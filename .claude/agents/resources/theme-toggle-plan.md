# YCI Theme Toggle — Implementation Plan (v1.21.0)

> Source: Structure agent `a379d45137f72e280` (rerun) on 2026-04-07.
> Companion to the Light Mode track. Pairs with `light-mode-spec.md`
> (Design agent) and `token-readiness-audit.md` (Audit agent).

## Architecture summary

Theme state lives in a single shared Svelte 5 runes store at `src/lib/stores/theme.svelte.ts` exporting a reactive `theme` object (`$state`) plus `setTheme`, `toggleTheme`, and `initTheme` helpers. The active mode (`'light' | 'dark'`) is derived from a user preference (`'light' | 'dark' | 'system'`) persisted to `localStorage` under the key `ay3:theme`. When the user has never toggled (preference = `'system'`) the store follows `prefers-color-scheme` via a `matchMedia` listener; once they toggle, the explicit choice is locked in. The store writes `data-theme="light"` or `data-theme="dark"` to `document.documentElement` via an `$effect`. To prevent FOUC, an inline blocking `<script>` injected into `app.html`'s `<head>` reads localStorage + `matchMedia` and sets `data-theme` on `<html>` before the first paint, so SvelteKit hydrates onto an already-correct DOM. The `ThemeToggle.svelte` component lives in `src/lib/components/` and is reusable across portal routes; on `/young-carpets` it slots into the floating pill navbar after the Contact link. Light-mode color overrides target `:root[data-theme='light'] .yc-page { ... }` to respect the existing `.yc-page`-scoped token block.

## File-by-file plan

### NEW: src/lib/stores/theme.svelte.ts

```ts
// src/lib/stores/theme.svelte.ts
//
// Shared theme store for the AY3 portal.
// Svelte 5 runes — must live in a .svelte.ts file.
//
// Preference values:
//   'system' → follow prefers-color-scheme (default if user has never toggled)
//   'light'  → force light
//   'dark'   → force dark
//
// Active values (what actually paints):
//   'light' | 'dark'
//
// Persistence: localStorage key 'ay3:theme'
// DOM contract: <html data-theme="light|dark">

import { browser } from '$app/environment';

export type ThemePref = 'system' | 'light' | 'dark';
export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'ay3:theme';
const MEDIA_QUERY = '(prefers-color-scheme: light)';

function readPref(): ThemePref {
	if (!browser) return 'system';
	try {
		const v = localStorage.getItem(STORAGE_KEY);
		if (v === 'light' || v === 'dark' || v === 'system') return v;
	} catch {
		/* private mode / disabled storage */
	}
	return 'system';
}

function systemMode(): ThemeMode {
	if (!browser) return 'dark';
	try {
		return window.matchMedia(MEDIA_QUERY).matches ? 'light' : 'dark';
	} catch {
		return 'dark';
	}
}

function resolve(pref: ThemePref): ThemeMode {
	return pref === 'system' ? systemMode() : pref;
}

// Reactive state — single source of truth.
export const theme = $state({
	pref: 'system' as ThemePref,
	mode: 'dark' as ThemeMode,
	ready: false
});

let mql: MediaQueryList | null = null;
let mqlHandler: ((e: MediaQueryListEvent) => void) | null = null;
let storageHandler: ((e: StorageEvent) => void) | null = null;

/**
 * Initialise the store. Call once from a top-level layout `$effect`.
 * Safe to call multiple times — subsequent calls are no-ops.
 */
export function initTheme() {
	if (!browser || theme.ready) return;

	theme.pref = readPref();
	theme.mode = resolve(theme.pref);
	apply(theme.mode);

	// Track system theme changes — only matters when pref === 'system'.
	try {
		mql = window.matchMedia(MEDIA_QUERY);
		mqlHandler = (e) => {
			if (theme.pref !== 'system') return;
			theme.mode = e.matches ? 'light' : 'dark';
			apply(theme.mode);
		};
		mql.addEventListener('change', mqlHandler);
	} catch {
		/* ignore */
	}

	// Cross-tab sync via storage events.
	storageHandler = (e) => {
		if (e.key !== STORAGE_KEY) return;
		const next = readPref();
		theme.pref = next;
		theme.mode = resolve(next);
		apply(theme.mode);
	};
	window.addEventListener('storage', storageHandler);

	theme.ready = true;
}

/** Tear down listeners — call from layout cleanup if needed. */
export function destroyTheme() {
	if (!browser) return;
	if (mql && mqlHandler) mql.removeEventListener('change', mqlHandler);
	if (storageHandler) window.removeEventListener('storage', storageHandler);
	mql = null;
	mqlHandler = null;
	storageHandler = null;
	theme.ready = false;
}

/** Set an explicit preference (locks in until cleared). */
export function setTheme(pref: ThemePref) {
	theme.pref = pref;
	theme.mode = resolve(pref);
	apply(theme.mode);
	if (browser) {
		try {
			localStorage.setItem(STORAGE_KEY, pref);
		} catch {
			/* ignore */
		}
	}
}

/**
 * Toggle between light and dark. Always lands on an explicit value
 * (never 'system') — toggling implies the user has made a choice.
 */
export function toggleTheme() {
	setTheme(theme.mode === 'dark' ? 'light' : 'dark');
}

/** Reset to system-follow behaviour. */
export function clearTheme() {
	setTheme('system');
}

function apply(mode: ThemeMode) {
	if (!browser) return;
	document.documentElement.setAttribute('data-theme', mode);
}
```

### NEW: src/lib/components/ThemeToggle.svelte

```svelte
<!-- src/lib/components/ThemeToggle.svelte
     Shared theme toggle button. Svelte 5 runes only.
     - 44×44 tap target (a11y minimum)
     - Inline sun/moon SVG (no icon library)
     - currentColor strokes so it inherits from parent
     - aria-pressed reflects "is light mode active"
-->
<script lang="ts">
	import { theme, toggleTheme, initTheme } from '$lib/stores/theme.svelte';

	// Lazy-init on first mount of any toggle in the tree.
	$effect(() => {
		initTheme();
	});

	const isLight = $derived(theme.mode === 'light');
	const label = $derived(isLight ? 'Switch to dark mode' : 'Switch to light mode');
</script>

<button
	type="button"
	class="theme-toggle"
	onclick={toggleTheme}
	aria-label={label}
	aria-pressed={isLight}
	title={label}
>
	<span class="theme-toggle__icon" aria-hidden="true">
		{#if isLight}
			<!-- Moon -->
			<svg viewBox="0 0 24 24" width="18" height="18" fill="none"
				stroke="currentColor" stroke-width="2"
				stroke-linecap="round" stroke-linejoin="round">
				<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
			</svg>
		{:else}
			<!-- Sun -->
			<svg viewBox="0 0 24 24" width="18" height="18" fill="none"
				stroke="currentColor" stroke-width="2"
				stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="12" r="4" />
				<path d="M12 2v2" />
				<path d="M12 20v2" />
				<path d="M4.93 4.93l1.41 1.41" />
				<path d="M17.66 17.66l1.41 1.41" />
				<path d="M2 12h2" />
				<path d="M20 12h2" />
				<path d="M4.93 19.07l1.41-1.41" />
				<path d="M17.66 6.34l1.41-1.41" />
			</svg>
		{/if}
	</span>
</button>

<style>
	.theme-toggle {
		min-width: 44px;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		border: 1px solid transparent;
		border-radius: 9999px;
		background: transparent;
		color: currentColor;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition:
			color 180ms cubic-bezier(0.4, 0, 0.2, 1),
			background-color 180ms cubic-bezier(0.4, 0, 0.2, 1),
			border-color 180ms cubic-bezier(0.4, 0, 0.2, 1),
			transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.theme-toggle:hover {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.12);
		transform: scale(1.04);
	}

	.theme-toggle:focus-visible {
		outline: none;
		border-color: rgba(255, 255, 255, 0.35);
		box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.18);
	}

	.theme-toggle:active {
		transform: scale(0.96);
	}

	.theme-toggle__icon {
		display: inline-flex;
		width: 18px;
		height: 18px;
	}

	@media (prefers-reduced-motion: reduce) {
		.theme-toggle,
		.theme-toggle:hover,
		.theme-toggle:active {
			transition: none;
			transform: none;
		}
	}
</style>
```

### EDIT: src/app.html

Inject FOUC-prevention script BEFORE `%sveltekit.head%`:

```html
<script>
	(function () {
		try {
			var pref = localStorage.getItem('ay3:theme');
			if (pref !== 'light' && pref !== 'dark' && pref !== 'system') pref = 'system';
			var mode = pref;
			if (pref === 'system') {
				mode = window.matchMedia('(prefers-color-scheme: light)').matches
					? 'light'
					: 'dark';
			}
			document.documentElement.setAttribute('data-theme', mode);
		} catch (e) {
			document.documentElement.setAttribute('data-theme', 'dark');
		}
	})();
</script>
```

### EDIT: src/routes/young-carpets/+page.svelte

1. Add import alongside other imports:

```ts
import ThemeToggle from '$lib/components/ThemeToggle.svelte';
```

2. Navbar markup — add divider + `<ThemeToggle />` after the Contact link:

```svelte
<a class="yc-nav-link" href="#contact" onclick={(e) => scrollToHash(e, '#contact')}>Contact</a>
<span class="yc-nav-divider" aria-hidden="true"></span>
<ThemeToggle />
```

3. CSS additions for the divider and the navbar-scoped toggle styling, plus the light-mode override block that targets `:root[data-theme='light'] .yc-page { ... }`. Full token override list needs to be cross-referenced with the Design agent's spec when it lands.

## State machine

```
Initial (SSR):           pref='system', mode='dark', ready=false
Initial (client paint):  app.html script writes data-theme via raw localStorage
                         + matchMedia BEFORE Svelte hydrates
initTheme() (first $effect):
  - reads localStorage → pref
  - resolves mode from pref (system → matchMedia)
  - apply(mode) → sets data-theme on <html>
  - subscribes to matchMedia 'change' (only acts when pref==='system')
  - subscribes to window 'storage' for cross-tab sync
  - ready=true

toggleTheme():
  pref: 'dark' or 'system'(currently dark) → 'light'
  pref: 'light' or 'system'(currently light) → 'dark'
  → setTheme(next)
  → localStorage.setItem('ay3:theme', next)
  → apply(next)

setTheme('system'):  re-engages matchMedia tracking, persists 'system'
```

## CSS transition strategy

NO global `* { transition: all }`. Scoped property-list transition on the YC page shell + nav:

```css
.yc-page,
.yc-nav,
.yc-nav-brand,
.yc-nav-link {
	transition:
		background-color 280ms cubic-bezier(0.4, 0, 0.2, 1),
		border-color 280ms cubic-bezier(0.4, 0, 0.2, 1),
		color 280ms cubic-bezier(0.4, 0, 0.2, 1),
		box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
	.yc-page, .yc-nav, .yc-nav-brand, .yc-nav-link {
		transition: none;
	}
}
```

## prefers-color-scheme tracking

- First visit no localStorage → `pref='system'`, follows OS via matchMedia listener.
- After explicit toggle → `pref='light'|'dark'`, MQL listener no-ops.
- `clearTheme()` re-engages system tracking (no UI yet, API in place).

## Edge cases

- **SSR / no localStorage on server:** browser guard short-circuits. SSR emits dark default; inline app.html script corrects it pre-paint.
- **First paint / FOUC:** inline `<script>` runs before any CSS resolves.
- **Multi-tab sync:** `storage` event listener.
- **iOS Safari:** matchMedia listener support is iOS 14+, wrapped in try/catch. Private Browsing localStorage failures wrapped. -webkit-tap-highlight-color: transparent kills the gray flash.
- **Disabled storage:** silent no-op on persistence.
- **Hydration:** initTheme runs in $effect after mount; until then the inline script's data-theme attribute is the source of truth.

## Component API

`<ThemeToggle />` — no props.

ARIA:
- `type="button"`
- `aria-label` dynamic ("Switch to dark mode" / "Switch to light mode")
- `aria-pressed={isLight}` (toggle button pattern)
- `title` mirrors aria-label
- Inner SVG span aria-hidden
- 44×44 minimum hit area
- `:focus-visible` ring

## Testing checklist

- [ ] Cold load with empty localStorage on dark-mode OS → renders dark, sun icon
- [ ] Cold load with empty localStorage on light-mode OS → renders light, moon icon
- [ ] Click toggle → DOM data-theme flips, ~280ms color transition
- [ ] Reload → preference persists, no FOUC (test with Slow 3G)
- [ ] OS theme change while pref='system' → page flips live
- [ ] OS theme change after explicit toggle → page does NOT flip
- [ ] Multi-tab sync via storage event
- [ ] Keyboard tab → focus ring visible, Enter/Space activates
- [ ] VoiceOver reads "Switch to light mode, toggle button, not pressed"
- [ ] Tap target ≥44×44 in DevTools device mode
- [ ] prefers-reduced-motion disables transitions
- [ ] Private Browsing → toggle works for session, no console errors
- [ ] svelte-check 0 errors
- [ ] Bump package.json to 1.21.0

## Source agent
- Structure agent rerun `a379d45137f72e280`
- Read 6 source files: dev page toggle, app.html, toast store, YC navbar markup ~1031-1043, YC navbar CSS ~2541-2625, YC `.yc-page` token block ~2330-2398
- Confirmed YC tokens scoped to `.yc-page` not `:root`
