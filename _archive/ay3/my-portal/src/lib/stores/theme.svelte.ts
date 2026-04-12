// src/lib/stores/theme.svelte.ts
//
// Shared theme store for the AY3 portal.
// Svelte 5 runes — must live in a .svelte.ts file.
//
// Preference values:
//   'system' → follow prefers-color-scheme... DISABLED v1.23.15.
//              'system' now resolves to 'dark' so first-time visitors and
//              dev sessions with no localStorage always land in dark mode.
//              The user is iterating on dark and does not want light mode
//              to appear unless explicitly toggled. To re-enable system
//              following, restore systemMode() to use matchMedia + revert
//              the readPref() default to 'system'.
//   'light'  → force light (only via explicit toggle)
//   'dark'   → force dark (DEFAULT for any pref that isn't 'light')
//
// Active values (what actually paints):
//   'light' | 'dark'
//
// Persistence: localStorage key 'ay3:theme'
// DOM contract: <html data-theme="light|dark">
//
// Source: theme-toggle-plan.md (Structure agent a379d45137f72e280, 2026-04-07)

import { browser } from '$app/environment';

export type ThemePref = 'system' | 'light' | 'dark';
export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'ay3:theme';
const MEDIA_QUERY = '(prefers-color-scheme: light)';

function readPref(): ThemePref {
	// v1.23.15: default is 'dark', not 'system'. User is iterating on dark
	// mode and doesn't want first-time visitors to land on light.
	if (!browser) return 'dark';
	try {
		const v = localStorage.getItem(STORAGE_KEY);
		if (v === 'light' || v === 'dark' || v === 'system') return v;
	} catch {
		/* private mode / disabled storage */
	}
	return 'dark';
}

function systemMode(): ThemeMode {
	// v1.23.15: 'system' now resolves to 'dark' instead of following the OS.
	// To re-enable OS-following behaviour later, restore the matchMedia line.
	return 'dark';
}

function resolve(pref: ThemePref): ThemeMode {
	return pref === 'system' ? systemMode() : pref;
}

// Reactive state — single source of truth.
// v1.23.15: initial pref is 'dark' (was 'system') to match the new default.
export const theme = $state({
	pref: 'dark' as ThemePref,
	mode: 'dark' as ThemeMode,
	ready: false
});

let mql: MediaQueryList | null = null;
let mqlHandler: ((e: MediaQueryListEvent) => void) | null = null;
let storageHandler: ((e: StorageEvent) => void) | null = null;

/**
 * Initialise the store. Called from a `$effect` inside ThemeToggle.svelte
 * (or any component that mounts the store). Safe to call multiple times —
 * subsequent calls are no-ops once `theme.ready` is true.
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
		/* ignore — older iOS, etc. */
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
