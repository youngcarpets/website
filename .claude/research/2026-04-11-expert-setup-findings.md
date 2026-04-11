# Setup Research — Young Carpets Website

**Date:** 2026-04-11
**Status:** Pending consumption. Used to write new project `CLAUDE.md` + `.claude/` setup, replacing ay3's stale Claude-protocol rules.
**Scope:** Phase 1 public marketing site only. No DB, auth, or portal.
**Source:** 8 parallel expert subagents with primary-source web access.

---

## 1. SvelteKit 2 Architecture

**1. Rendering: Prerender everything, one server route for the form.**
Set `export const prerender = true` in the root `+layout.ts`. Marketing content is static; prerendering gives best perf, SEO, lowest cost. The quote form is the one exception — it posts to a server action on a non-prerendered route.

**2. Adapter: `@sveltejs/adapter-cloudflare`.**
`adapter-static` is disqualified — form actions cannot run under it. `adapter-auto` is for prototyping only. Cloudflare Pages has a generous free tier, emits `_routes.json` so prerendered pages bypass the worker entirely, and supports all SvelteKit features. Avoid `fs` in server code; use `read()` from `$app/server` if loading bundled assets.

**3. Route layout:**
```
src/routes/
  +layout.svelte          // nav + footer, {@render children()}
  +layout.ts              // export const prerender = true
  +page.svelte            // home
  (marketing)/
    services/+page.svelte
    services/[slug]/+page.svelte   // + +page.ts load
    gallery/+page.svelte
    about/+page.svelte
  quote/
    +page.svelte          // the form
    +page.server.ts       // actions + export const prerender = false
```
`(marketing)` is a route group — organizational only, no URL segment. The `quote` route opts out of prerendering so its action runs server-side.

**4. `load` + content location: `src/lib/content/` as typed TS modules.**
For a small site, skip markdown tooling. Define services as typed TS objects in `src/lib/content/services.ts`. Import directly in `+page.ts` `load` functions and return from there (do not import into `.svelte` files directly — going through `load` keeps data flow uniform and type-safe via `PageData`). `src/lib/content` over `src/content` because `$lib` is the documented alias.

**5. Quote form — the right way:**
- `quote/+page.server.ts`: `export const prerender = false;` and `export const actions = { default: async ({ request }) => { ... } }`. Validate, send email via fetch to a transactional API (Resend/Postmark) using `$env/static/private`, return `fail(400, { ... })` on errors, plain object on success.
- `quote/+page.svelte`: `<form method="POST" use:enhance>` with `{ form }: { form: ActionData }` from `./$types`. `use:enhance` gives progressive enhancement. Honeypot field + server-side rate limiting (simple in-memory Map keyed by IP is fine at this scale).

**6. SvelteKit 2 — prefer / avoid:**
Prefer: runes (`$state`, `$derived`, `$props`), `{@render children()}` over slots, typed `./$types`, `enhance`, `fail`, remote `load` typing. Avoid: shallow routing, streamed promises from `load`, `goto` with `invalidateAll` tricks, and `adapter-node` self-hosting. Do not reach for MDsveX unless content volume forces it.

**7. Env:** `OWNER_EMAIL` and `RESEND_API_KEY` in `.env` (gitignored), imported from `$env/static/private` inside `+page.server.ts` only — inlined at build, never reaches the client.

---

## 2. Svelte 5 Runes — Rules for a Marketing Site

1. **`$state`**: use for any value that changes over time and drives the UI (menu open, gallery index, form fields). Default choice for mutable reactive state.
2. **`$derived`**: use whenever a value is a pure function of other reactive state (`let total = $derived(items.length)`). Never write the same computation into `$effect`.
3. **`$derived.by(() => { ... })`**: use when the expression needs multiple statements. Must stay side-effect free.
4. **`$props`**: use exclusively to receive component inputs. Never reassign a prop locally — copy into `$state` if you need to mutate.
5. **`$effect`**: last resort. Only for true side effects with the outside world — DOM measurements, `IntersectionObserver` (scroll reveals), manual event listeners, analytics. Never to sync one piece of state to another; that is what `$derived` is for.
6. **Canonical `$props` typing**:
   ```ts
   interface Props { title: string; href?: string; children?: Snippet }
   let { title, href = '#', children }: Props = $props();
   ```
   Declare `interface Props` above, destructure with defaults inline, import `Snippet` from `'svelte'`.
7. **Events are plain props**: write `onclick={handler}`, not `on:click`. No `|preventDefault` modifier — call `e.preventDefault()` inside the handler. Only one handler per event; compose manually.
8. **Component "events" = callback props**: `let { onsubmit }: { onsubmit: (data: QuoteData) => void } = $props()`. Never use `createEventDispatcher` (deprecated).
9. **Slots are dead — use snippets**. Default content: `{@render children?.()}` with `children: Snippet` in props. Named regions: named snippet props typed `Snippet<[ParamType]>`.
10. **`$bindable`**: don't use it on a marketing site. A quote form's fields should be plain `$state` owned by the form component; submit via callback prop. `bind:` on native `<input>` is fine and unrelated.
11. **No `$:`, no `export let`, no `createEventDispatcher`, no `<slot>`, no stores for local UI state.** All are Svelte 4 anti-patterns in runes mode.
12. **Class reactivity**: declare fields with `$state` directly — `class Nav { open = $state(false) }`. Instances are not proxies; only the `$state` fields are reactive. Use arrow-function methods so `this` survives being passed as a handler.
13. **Destructuring a `$state` object loses reactivity** — keep the object reference and read `.field` at use site.
14. **Cross-module state**: export a `const` object created with `$state({...})` plus mutator functions; never export a reassignable `let`.
15. **`$state.raw`** for large static-ish data (image manifest, product list loaded once) to skip proxy cost; reassign wholesale to update.
16. **`$state.snapshot(value)`** before handing reactive data to `structuredClone`, `JSON.stringify` for an API, or any non-Svelte library.

---

## 3. TypeScript in SvelteKit

### tsconfig.json
```jsonc
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "strict": true,                      // on — baseline correctness
    "noUncheckedIndexedAccess": true,    // on — arr[i] typed T|undefined
    "noImplicitOverride": true,          // on — cheap, zero friction
    "exactOptionalPropertyTypes": false, // OFF — pedantic, slows marketing work
    "verbatimModuleSyntax": true         // already set by SvelteKit; keep
  }
}
```
SvelteKit's generated `.svelte-kit/tsconfig.json` already sets `verbatimModuleSyntax`, `isolatedModules`, `moduleResolution: "bundler"`, `lib: ["esnext","DOM","DOM.Iterable"]`, and `$lib` paths — do not re-set.

### app.d.ts stub
```ts
declare global {
  namespace App {
    interface Error { message: string; code?: string }
  }
}
export {};
```

### Canonical $props typing
```svelte
<script lang="ts">
  interface Props {
    title: string;
    subtitle?: string;
    cta?: Snippet;
  }
  let { title, subtitle, cta }: Props = $props();
</script>
```

### Typing load return → +page.svelte
```ts
// +page.ts
import type { PageLoad } from './$types';
export const load: PageLoad = async ({ fetch }) => ({ services: await getServices(fetch) });
```
```svelte
<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
</script>
```

### Import order
1. Svelte / SvelteKit (`svelte`, `svelte/*`, `$app/*`, `./$types`)
2. External packages
3. Internal `$lib/*` (components, then utils)
4. Type-only imports (`import type { ... }`)
5. Styles / assets

### Naming / placement
- Shared types: one folder — `src/lib/types/`. Not colocated.
- Rune modules: `*.svelte.ts` only when module uses runes. Cannot export reassigned `$state` — export getters or objects.
- Components: `PascalCase.svelte`. Routes: SvelteKit conventions.

---

## 4. Performance + SEO

**Core Web Vitals targets (p75 mobile+desktop):** LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
**Three biggest SvelteKit levers:**
1. SSR + prerender service/about/gallery pages.
2. `@sveltejs/enhanced-img` for AVIF/WebP + intrinsic width/height (kills CLS + shrinks LCP).
3. Ship minimal JS — keep components static, avoid client-side stores on marketing pages, lazy-load the quote form.

**Meta / OG / Twitter:**
- Base defaults in `+layout.svelte` `<svelte:head>`.
- Per-page: return `{ title, description, canonical, ogImage }` from `+page.ts` `load`, read via `page.data` (Svelte 5: `import { page } from '$app/state'`). Canonical in root layout: `<link rel="canonical" href={page.data.canonical ?? \`https://youngcarpets.tld${page.url.pathname}\`}>`.

**sitemap.xml:** `src/routes/sitemap.xml/+server.ts`, export `GET` returning XML, `export const prerender = true`.
**robots.txt:** `static/robots.txt`. Include `Sitemap:` line.

**Images:** `@sveltejs/enhanced-img`. Zero runtime cost, no CDN bill, emits `<picture>` with AVIF/WebP/JPEG, stamps intrinsic dimensions. Source masters: JPEG, ~2400px long edge, sRGB. Render widths: 400/800/1200/1600. `sizes="(min-width: 1024px) 50vw, 100vw"` for gallery grids.

**Fonts:** Self-host one variable WOFF2, `font-display: swap`, preload critical weight, one font family max two weights. No Google Fonts.

**JSON-LD:** `LocalBusiness` on `/` and `/contact`, `Service` on each service page, `BreadcrumbList` on deep pages. Inject via `<svelte:head>{@html '<script type="application/ld+json">'+JSON.stringify(data)+'</script>'}</svelte:head>`.

**Analytics:** Cloudflare Web Analytics (free, no cookies, no consent banner in most jurisdictions).

**Local SEO:** Claim and fully complete Google Business Profile — NAP byte-for-byte match with the site. Outranks on-page work.

---

## 5. Tooling (Windows, solo dev)

**Verified versions (2026-04-11):** `@sveltejs/kit` 2.57.1, `svelte` 5.55.3, `vite` 8.0.8, `svelte-check` 4.4.6, `eslint` 10.2.0, `eslint-plugin-svelte` 3.17.0, `typescript-eslint` 8.58.1, `prettier` 3.8.2, `prettier-plugin-svelte` 3.5.1, `lefthook` 2.1.5.

**Package manager: pnpm.** Disk-efficient, strict hoisting. Windows: `git config --global core.longpaths true`, install via `npm i -g pnpm` or Corepack.

**Scripts:**
```json
"scripts": {
  "dev": "vite dev",
  "build": "vite build",
  "preview": "vite preview",
  "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
  "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
  "lint": "prettier --check . && eslint .",
  "format": "prettier --write ."
}
```

**ESLint (flat config):** `eslint`, `typescript-eslint`, `eslint-plugin-svelte`, `globals`. Compose `js.configs.recommended`, `tseslint.configs.recommended`, `sveltePlugin.configs['flat/recommended']`, `sveltePlugin.configs['flat/prettier']`. Parser for `.svelte`: `svelte-eslint-parser` with `parserOptions.parser: tseslint.parser`. Stay on `recommended` only — no strict/stylistic tiers.

**Prettier (`.prettierrc`):**
```json
{
  "useTabs": true,
  "singleQuote": true,
  "trailingComma": "none",
  "printWidth": 100,
  "plugins": ["prettier-plugin-svelte"],
  "overrides": [{ "files": "*.svelte", "options": { "parser": "svelte" } }]
}
```

**Pre-commit: lefthook.** Single binary, no Node shim, faster on Windows. `lefthook.yml`:
```yaml
pre-commit:
  parallel: true
  commands:
    format:
      glob: "*.{js,ts,svelte,json,md,css}"
      run: pnpm prettier --write {staged_files} && git add {staged_files}
    lint:
      glob: "*.{js,ts,svelte}"
      run: pnpm eslint {staged_files}
```
Do NOT run `svelte-check` in pre-commit (too slow — whole project). Run it manually + in CI.

**Git hooks vs Claude Code hooks:** lefthook gates commits (fast, staged files). Claude Code `PostToolUse` hooks for in-session feedback — `prettier --write` on the edited file only. Do NOT put `svelte-check` on PostToolUse.

**GitHub Actions (`.github/workflows/ci.yml`):** one job on ubuntu-latest. Steps: checkout → pnpm setup → node setup (cache:pnpm) → `pnpm install --frozen-lockfile` → `pnpm check` → `pnpm lint` → `pnpm build`. Triggers: `push` + `pull_request` on `main`.

**`.gitignore` additions:** `Thumbs.db`, `Desktop.ini`, `*.lnk`, `.vscode/*` (keep `!.vscode/extensions.json`), `.idea/`.

**Windows gotchas:**
- `core.longpaths=true` — pnpm's nested store can exceed 260 chars.
- `core.autocrlf=input` + `.gitattributes` with `* text=auto eol=lf`.
- Vite HMR: Defender exclusion for project folder.
- Use git bash or PowerShell, not cmd.exe.

---

## 6. Accessibility (WCAG 2.2 AA)

1. **Landmarks:** exactly one `<header>`, `<nav>`, `<main id="main">`, `<footer>` at layout level. Never nest `<main>`.
2. **Heading hierarchy:** one `<h1>` per page describing *that* page. Descend without skipping levels.
3. **`<html lang="en">`** in `src/app.html`.
4. **Skip link:** first focusable element in `+layout.svelte`: `<a href="#main" class="skip-link">Skip to main content</a>`. Visually hidden until `:focus`. `<main>` needs `id="main"` and `tabindex="-1"`.
5. **Route focus management:** SvelteKit's route announcer handles screen-reader announcements. Focus does NOT move — add `afterNavigate` in `+layout.svelte` that calls `document.querySelector('h1')?.focus()`. Skip on initial load.
6. **Svelte a11y warnings are non-negotiable.** Never globally disable. Suppress only per-line with `<!-- svelte-ignore a11y_... -->` plus a reason.
7. **Contrast (WCAG 1.4.3 / 1.4.11):**
   - Normal text ≥ **4.5:1**
   - Large text (≥ 18.66px bold or 24px regular) ≥ **3:1**
   - Non-text UI ≥ **3:1** against background
   - Brand-color rule: one brand color with ≥ 4.5:1 on white AND white-on-brand ≥ 4.5:1.
8. **Visible focus indicator:** ≥ 3:1 contrast, ≥ 2px outline (WCAG 2.2 SC 2.4.11, 2.4.13). Never `outline: none` without a replacement.
9. **Gallery alt text:** before/after carpet photos are **informative**, not decorative. Never omit. Decorative accents: `alt=""`.
10. **Quote form:** `<label for>` (no placeholder-as-label), required with `required` + visible "*" + `aria-describedby`. Errors: `aria-invalid="true"`, `aria-describedby` to error text. Success/error via `<div role="status" aria-live="polite">`.
11. **Motion:** honor `prefers-reduced-motion` on all transforms/opacity/scroll animations (WCAG 2.3.3).
12. **Target size (WCAG 2.2 SC 2.5.8 AA):** ≥ 24×24 CSS px. Aim 44×44 on primary CTAs.
13. **Testing:** axe DevTools extension locally, `@axe-core/playwright` in CI. Manual keyboard pass on every page.

---

## 7. Motion + Transitions

### Page transitions (SvelteKit + View Transitions API)
Drop in `src/routes/+layout.svelte`:
```svelte
<script lang="ts">
  import { onNavigate } from '$app/navigation';
  onNavigate((navigation) => {
    if (!document.startViewTransition) return;
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>
```
Style via `::view-transition-old(root)` / `::view-transition-new(root)` with 200ms fade.

### Svelte built-in transitions — verdict
- **fade** — use. Default.
- **fly** — sparingly, small `y` (8–16px). Never horizontal.
- **slide** — accordions/FAQ only.
- **scale** — avoid for page elements; fine for toasts.
- **blur** — avoid.
- **draw** — only for SVG logo reveal.
- **crossfade** — skip; View Transitions API supersedes.

### Scroll reveals
IntersectionObserver + `$effect`. `animation-timeline: view()` is Chromium-only — don't ship on a one-browser feature.

### Quote form micro-interactions
- Focus: 120ms border-color + 1px ring grow, no layout shift.
- Invalid: 150ms ring to red, no shake.
- Submit press: 80ms scale to 0.98.
- Success: swap button content in a View Transition.

### Performance budget
- Max duration: **300ms** anywhere.
- Max concurrent animations: **3** on screen.
- Only animate `opacity` and `transform`.
- No motion above fold before LCP.

### Motion vocabulary
- Durations: `--fast: 120ms`, `--base: 200ms`, `--slow: 320ms`.
- Easings: `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` (entries), `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)` (state changes).

### Reduced motion wrapper
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after,
  ::view-transition-old(*), ::view-transition-new(*) {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 8. Claude Code Harness Setup

### `.claude/settings.json` baseline
```json
{
  "permissions": {
    "defaultMode": "dontAsk",
    "allow": [
      "Read",
      "Edit(/src/**)",
      "Edit(/static/**)",
      "Bash(pnpm install)",
      "Bash(pnpm add *)",
      "Bash(svelte-check)",
      "Bash(pnpm run build)",
      "Bash(pnpm run lint)",
      "Bash(git status)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(git log *)",
      "Bash(git diff *)"
    ],
    "deny": [
      "Bash(pnpm run dev *)",
      "Bash(npm run dev *)",
      "Bash(pnpm run preview *)",
      "Bash(* serve *)"
    ]
  },
  "hooks": {
    "PreToolUse": [
      { "matcher": "Edit|Write", "hooks": [{ "type": "command", "if": "Edit(**.svelte)|Edit(**.ts)", "command": ".claude/hooks/validate-svelte.sh", "timeout": 30 }] }
    ]
  }
}
```

**Interactive Commands (Never Auto-Run):**
- `pnpm run dev`, `pnpm run preview`, any `* serve *`, interactive git (rebase with conflicts, cherry-pick)
Enforced via `deny` rules AND declared in CLAUDE.md.

### `.claude/` layout
```
.claude/
├── settings.json          # permissions + hooks (committed)
├── settings.local.json    # local overrides (gitignored)
├── hooks/                 # hook scripts
├── skills/                # custom slash commands
├── agents/                # project-specific subagents
├── research/              # research outputs (this file)
└── reference/             # ported ay3 reference files
```

### Suggested custom skills
- `/add-page <slug>` — create marketing page with SEO metadata, nav integration
- `/check-a11y <file>` — audit component WCAG 2.2 AA
- `/component-review <file>` — review runes, types, prop design

### Suggested project subagents
- `svelte-reviewer` — Svelte 5 + TS expert, reports only, no auto-fix
- `a11y-checker` — WCAG 2.2 AA auditor, reports only

### Hooks + subagents
Parent `settings.json` hooks fire for subagent tool calls too. Define critical gates there, not in delegated skills. Don't hook PreToolUse on Skill invocations (risk of loops).

---

## Next steps (after user approves CLAUDE.md rewrite)

1. Write new `CLAUDE.md` sections from this research: Commands, Svelte 5 Patterns, Import Order, Interactive Commands Never Run, Workflow, Code Generation, Error Handling, Naming.
2. Write `.claude/settings.json` from section 8.
3. Create `.claude/hooks/validate-svelte.sh` (Windows: .cmd variant).
4. Decide on skills and subagents — scaffold empty templates.

Ay3's Claude-protocol files are stale and are NOT being ported — this research replaces them.
