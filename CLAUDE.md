# Young Carpets Website

SvelteKit 2 + Svelte 5 + TypeScript. Phase 1: public marketing site. Phase 2: authenticated portal (deferred).

Interaction style is governed by global memory at `~/.claude/`. Do not restate those rules here.

## Commands

Package manager: **pnpm** (Windows: `git config --global core.longpaths true`).

```
pnpm install           # install deps
pnpm dev               # DO NOT auto-run — see Never Run
pnpm build             # production build
pnpm preview           # DO NOT auto-run
pnpm check             # svelte-kit sync + svelte-check (run before commit)
pnpm check:watch       # continuous typecheck
pnpm lint              # prettier --check + eslint
pnpm format            # prettier --write
```

## Interactive Commands — Never Auto-Run

- `pnpm dev` / `pnpm run dev` / `npm run dev` / `vite dev`
- `pnpm preview` / `pnpm run preview`
- Anything matching `* serve *`
- `git rebase -i`, `git add -i`, interactive `git cherry-pick` with conflicts
- Any long-running watch process

These are also blocked via `deny` rules in `.claude/settings.json`.

## Tooling

- **Versions** (verified 2026-04-11, pinned list in `.claude/research/2026-04-11-expert-setup-findings.md` §5): SvelteKit 2.57, Svelte 5.55, Vite 8.0, svelte-check 4.4, ESLint 10.2, typescript-eslint 8.58, eslint-plugin-svelte 3.17, Prettier 3.8, prettier-plugin-svelte 3.5, lefthook 2.1.
- **ESLint:** flat config only. Compose `js.configs.recommended`, `tseslint.configs.recommended`, `eslint-plugin-svelte` `flat/recommended` + `flat/prettier`. `.svelte` parser is `svelte-eslint-parser` with `parserOptions.parser: tseslint.parser`. Stay on `recommended` — no strict/stylistic tiers.
- **Prettier (`.prettierrc`):** `useTabs: true`, `singleQuote: true`, `trailingComma: "none"`, `printWidth: 100`, plugin `prettier-plugin-svelte`, override `*.svelte` → parser `svelte`.
- **Pre-commit: lefthook.** Runs `prettier --write` + `eslint` on staged files, parallel. **Never put `svelte-check` in pre-commit** — too slow. Run it manually and in CI only.
- **CI:** single GitHub Actions job on `ubuntu-latest` — checkout → pnpm setup → node setup (`cache: pnpm`) → `pnpm install --frozen-lockfile` → `pnpm check` → `pnpm lint` → `pnpm build`. Triggers: `push` + `pull_request` on `main`.
- **In-session feedback vs commit gates:** lefthook gates commits (fast, staged only). Claude Code `PostToolUse` hooks run `prettier --write` on the edited file only. **Never** run `svelte-check` on `PostToolUse`.
- **.gitignore additions:** `Thumbs.db`, `Desktop.ini`, `*.lnk`, `.vscode/*` (keep `!.vscode/extensions.json`), `.idea/`.
- **Windows gotchas:** `core.longpaths=true`, `core.autocrlf=input` + `.gitattributes` `* text=auto eol=lf`, Defender exclusion for the project folder, use git-bash or PowerShell (not `cmd.exe`).

## Workflow

1. **Setup phase = one step at a time.** Propose → wait for confirmation → execute → confirm done → next step. No batching.
2. **Deep questions → expert subagents.** Dispatch domain experts with primary-source access, distill findings into concise answers. Never guess on technical questions.
3. **Before commit:** `pnpm check` + `pnpm lint` must pass. `svelte-check` is NOT run on every edit — only on demand and in CI.
4. **Never start the dev server.** If the user needs it running, they run it themselves.
5. **Reference library:** ay3 archive at `C:\dev\youngcarpets\_archive\ay3\.claude\` holds prior project knowledge. Domain content (products, Ontario accounting) gets moved into this project. Protocol files (agents, commands, rules) are stale — superseded by this CLAUDE.md and the research file at `.claude/research/2026-04-11-expert-setup-findings.md`.

## Project Architecture

- **Rendering:** prerender everything. `export const prerender = true` in root `+layout.ts`. Quote form route opts out with `export const prerender = false` so its action runs server-side.
- **Adapter:** `@sveltejs/adapter-cloudflare`. Free tier, `_routes.json` bypasses worker for static pages, supports form actions.
- **Route layout:**
  ```
  src/routes/
    +layout.svelte          nav + footer, {@render children()}
    +layout.ts              prerender = true
    +page.svelte            home
    (marketing)/
      services/+page.svelte
      services/[slug]/+page.svelte
      gallery/+page.svelte
      about/+page.svelte
    quote/
      +page.svelte          the form
      +page.server.ts       actions + prerender = false
  ```
- **Content:** typed TS modules in `src/lib/content/`. Imported via `+page.ts` `load`, consumed in `.svelte` via `PageProps`. No markdown tooling unless volume demands it.
- **Env:** `.env` (gitignored) → `$env/static/private` → server code only. Never imported into client code.

## Svelte 5 Patterns

Runes-only. No `$:`, no `export let`, no `createEventDispatcher`, no `<slot>`, no stores for local UI state.

1. **`$state`** — mutable reactive UI state (menu open, gallery index, form fields).
2. **`$derived`** — pure function of other reactive state. Never replicate in `$effect`.
3. **`$derived.by(() => {...})`** — multi-statement derivation. Side-effect free.
4. **`$props`** — component inputs. Never reassign; copy to `$state` if mutation needed.
5. **`$effect`** — last resort. Only for DOM measurements, `IntersectionObserver`, manual listeners, analytics. Never to sync state → state.
6. **`$state.raw`** — large static-ish data (image manifest). Reassign wholesale.
7. **`$state.snapshot(value)`** — before passing reactive data to `JSON.stringify` or non-Svelte libs.
8. **`$bindable`** — not on marketing site. `bind:` on native `<input>` is fine and unrelated.

### Canonical `$props` typing
```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';
  interface Props {
    title: string;
    href?: string;
    children?: Snippet;
  }
  let { title, href = '#', children }: Props = $props();
</script>
```

### Events
- Native: `onclick={handler}` — not `on:click`. No `|preventDefault` modifier; call `e.preventDefault()` inside the handler.
- Component "events" = callback props: `let { onsubmit }: { onsubmit: (data: QuoteData) => void } = $props()`.

### Snippets
- Default content: `{@render children?.()}` with `children: Snippet` in props.
- Named regions: named snippet props typed `Snippet<[ParamType]>`.

### Class reactivity
```ts
class Nav { open = $state(false) }
```
Only `$state` fields are reactive on instances. Use arrow-function methods so `this` survives being passed as a handler. Destructuring a `$state` object loses reactivity — read `.field` at use site.

### Cross-module state
Export a `const` object created with `$state({...})` + mutator functions. Never export a reassignable `let`.

## TypeScript

### tsconfig.json
```jsonc
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": false
  }
}
```
SvelteKit's generated tsconfig already sets `verbatimModuleSyntax`, `isolatedModules`, `moduleResolution: "bundler"`, and `$lib` paths. Do not re-set.

### Typing `load` return
```ts
// +page.ts
import type { PageLoad } from './$types';
export const load: PageLoad = async ({ fetch }) => ({ services: await getServices(fetch) });
```
```svelte
<!-- +page.svelte -->
<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
</script>
```

## Import Order

1. Svelte / SvelteKit (`svelte`, `svelte/*`, `$app/*`, `./$types`)
2. External packages
3. Internal `$lib/*` (components first, then utils)
4. Type-only imports (`import type { ... }`)
5. Styles / assets

## Naming

- **Components:** `PascalCase.svelte`
- **Routes:** SvelteKit conventions (`+page.svelte`, `+layout.ts`)
- **Rune modules:** `*.svelte.ts` ONLY when the module uses runes. Plain helpers stay `.ts`.
- **Shared types:** single folder `src/lib/types/`. Not colocated.
- **Content:** `src/lib/content/` — typed TS modules (`services.ts`, `gallery.ts`).

## Error Handling

- **`load` failures:** throw with `error(status, message)` from `@sveltejs/kit`. Never return partial data.
- **Form actions:** `return fail(400, { field: '...', message: '...' })` on validation errors; plain object on success. Type via `./$types` `ActionData`.
- **Client-side:** don't catch errors you can't handle. Let them propagate to SvelteKit's `+error.svelte`.
- **app.d.ts:**
  ```ts
  declare global {
    namespace App {
      interface Error { message: string; code?: string }
    }
  }
  export {};
  ```

## Code Generation

- **Default to no comments.** Only add a comment for non-obvious *why* (hidden constraint, workaround, surprising behavior).
- **No placeholder stubs.** If a section isn't ready, skip it entirely — don't write `// TODO` scaffolding.
- **No backwards-compat shims.** If something changes, change it cleanly.
- **No feature flags** unless there's a real gate.
- **Trust internal code.** Only validate at system boundaries (user input, external APIs).
- **Form actions validate with Zod** (add when quote form lands).

## Performance + SEO (Targets)

- **Core Web Vitals (p75):** LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
- **Images:** `@sveltejs/enhanced-img`. Source JPEG ~2400px sRGB. Render widths 400/800/1200/1600.
- **Fonts:** one self-hosted variable WOFF2, `font-display: swap`, preload critical weight. No Google Fonts.
- **Meta:** base defaults in `+layout.svelte` `<svelte:head>`. Per-page overrides via `+page.ts` `load` returning `{ title, description, canonical, ogImage }`, read with `page.data` from `$app/state`.
- **sitemap.xml:** `src/routes/sitemap.xml/+server.ts`, `prerender = true`.
- **robots.txt:** `static/robots.txt`.
- **JSON-LD:** `LocalBusiness` on `/` and `/contact`, `Service` on service pages, `BreadcrumbList` on deep pages.
- **Analytics:** Cloudflare Web Analytics (free, no consent banner needed).

## Accessibility (WCAG 2.2 AA)

1. **Landmarks:** one `<header>`, `<nav>`, `<main id="main" tabindex="-1">`, `<footer>`. Never nest `<main>`.
2. **Headings:** one `<h1>` per page. Descend without skipping levels.
3. **`<html lang="en">`** in `src/app.html`.
4. **Skip link** first focusable in `+layout.svelte` pointing to `#main`.
5. **Route focus:** `afterNavigate` in `+layout.svelte` moves focus to `h1` (skip on initial load). Route announcer is built-in.
6. **Svelte `a11y_*` compiler warnings are non-negotiable.** Suppress only per-line with a reason.
7. **Contrast:** normal text ≥ 4.5:1, large text ≥ 3:1, non-text UI ≥ 3:1.
8. **Focus indicator:** ≥ 3:1 contrast, ≥ 2px outline. Never `outline: none` without a replacement.
9. **Target size:** ≥ 24×24 CSS px. Primary CTAs 44×44.
10. **Gallery alt text:** before/after shots are informative, not decorative.
11. **Forms:** `<label for>` (no placeholder-as-label), `aria-invalid`, `aria-describedby` to error text, `<div role="status" aria-live="polite">` for success/error.
12. **Motion:** honor `prefers-reduced-motion` on every transform/opacity/scroll animation.
13. **Testing:** axe DevTools locally, `@axe-core/playwright` in CI.

## Motion + Transitions

- **Page transitions:** View Transitions API via `onNavigate` in `+layout.svelte`. Style with `::view-transition-old(root)` / `::view-transition-new(root)`, 200ms fade.
- **Built-in transitions:** `fade` default, `fly` sparingly (y: 8–16px), `slide` for accordions only, avoid `scale`/`blur`/`draw`/`crossfade` for page elements.
- **Scroll reveals:** `IntersectionObserver` + `$effect`. Avoid `animation-timeline: view()` (Chromium-only).
- **Performance budget:** max duration 300ms, max 3 concurrent animations on screen, only `opacity` and `transform`. No motion above the fold before LCP.
- **Vocabulary:**
  ```css
  --fast: 120ms;
  --base: 200ms;
  --slow: 320ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  ```
- **Reduced motion:** wrap every motion rule with `@media (prefers-reduced-motion: reduce)` override.

## Project Context

Project-specific research and domain knowledge live in `.claude/` subfolders:

- `.claude/research/` — expert research outputs
- `.claude/reference/` — ported ay3 reference material (domain + design)
- `.claude/resources/products/` — flooring product knowledge (moved from ay3)

The ay3 archive at `C:\dev\youngcarpets\_archive\ay3\` holds the prior project. Read from it when needed but do not re-port its Claude-protocol files (agents, commands, rules, settings) — those are stale and replaced by this CLAUDE.md.

## Claude Harness

- **`.claude/` layout:**
  ```
  .claude/
  ├── settings.json          permissions + hooks (committed)
  ├── settings.local.json    local overrides (gitignored)
  ├── hooks/                 hook scripts
  ├── skills/                custom slash commands
  ├── agents/                project subagents
  ├── research/              expert research outputs
  ├── reference/             ported ay3 reference material
  └── resources/products/    flooring product knowledge
  ```
- **Hook scope:** parent `.claude/settings.json` hooks fire for subagent tool calls too. Define critical gates there, not in delegated skills. Do **not** hook `PreToolUse` on `Skill` invocations — loop risk.
- **Custom skills** (scaffold under `.claude/skills/`):
  - `/add-page <slug>` — create marketing page with SEO metadata + nav integration
  - `/check-a11y <file>` — audit component against WCAG 2.2 AA
  - `/component-review <file>` — review runes, types, prop design
- **Project subagents** (scaffold under `.claude/agents/`):
  - `svelte-reviewer` — Svelte 5 + TS expert, reports only, no auto-fix
  - `a11y-checker` — WCAG 2.2 AA auditor, reports only
