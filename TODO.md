# TODO — Young Carpets Website

Last updated: 2026-04-11 (very late evening — hero bg image live on production).

This file is the durable cross-session to-do list. Both Claude and you read it at session start.

Working branch: `claude/review-todo-list-CfdHE`. All pushes fast-forward into `main` on GitHub (`youngcarpets/website`).

---

## Live preview URL (bookmark this)

**https://youngcarpets-website.pages.dev** — stable production URL on Cloudflare Pages. Never changes. Updates whenever you run `pnpm run deploy` locally. Use this on any device (phone, work computer, anywhere).

## Where we landed tonight (2026-04-11)

- **Hero background image is LIVE.** `src/lib/assets/hero/bg.jpg` — the architectural floor-plan image from `forClaude/bg.jpg` upscaled to 2400×1850, wired into `src/routes/+page.svelte` via `@sveltejs/enhanced-img` as a full-bleed `object-fit: cover` layer under the (still placeholder) `<h1>hello</h1>`. Verified on desktop via `pnpm run deploy`; awaiting phone verification from Alan.
- **Upscale method used: Pillow LANCZOS (not AI).** Source `bg.jpg` is 899×693, 101 KB. Target was ~2400 px wide for `enhanced-img`. AI upscaling via Real-ESRGAN was the original plan and the binary + models are already downloaded at `C:/Users/alany/tools/realesrgan/full/` (v0.2.5.0, includes `realesrgan-x4plus-anime` model — ideal for line art), but it failed with `vulkan-1.dll: cannot open shared object file` because **the Vulkan runtime is not installed on this machine**. LANCZOS was chosen as a zero-install fallback and looked clean on the preview image (sharp lines, readable text) — needs phone-screen verification before deciding whether to escalate to Real-ESRGAN.
- **Test colors pass:** as a deployment-speed smoke test we cycled the hero background through red → blue → green → yellow via `pnpm run deploy`. Each deploy was under a minute. Confirmed: the loop from edit → `pnpm run deploy` → live URL is fast enough to iterate visual changes from the phone.
- **Scaffold + infra unchanged from previous note:** SvelteKit 2.57 + Svelte 5.55 + TypeScript strict, Cloudflare Pages project `youngcarpets-website`, CLI wrangler deploys, `nodejs_compat` flag via `wrangler.toml`, `pnpm run deploy` one-command build + deploy, `.claude/settings.json` `defaultMode: "bypassPermissions"` (already active this session), plugins `feature-dev` + `frontend-design` installed.
- **forClaude/ folder** (untracked, local only) now contains: original `bg.jpg` (101 KB), `Grok Image 2026-04-11 at 19.20.20.png` (the Grok-generated alternative, rejected as fuzzy), and new `bg-lanczos-2400.jpg` (539 KB, the upscaled source that was copied into `src/lib/assets/hero/bg.jpg`).

## Resume here next session

1. **Verify the hero bg on a real phone.** Open https://youngcarpets-website.pages.dev on an iPhone and a mid-range Android if possible. Look specifically at line crispness — LANCZOS upscaling was used, which is non-AI interpolation. If it looks fuzzy or soft on a retina phone, escalate to AI upscaling (step 2). If it looks clean, step 2 is skipped entirely.
2. **(Conditional) Escalate to Real-ESRGAN if LANCZOS isn't sharp enough.**
   - The Real-ESRGAN portable binary and models are already downloaded at `C:/Users/alany/tools/realesrgan/full/` — no need to re-download.
   - The blocker is `vulkan-1.dll` not being installed. Fix: install Vulkan Runtime from LunarG — the official installer is at https://vulkan.lunarg.com/sdk/home#windows (look for "Vulkan Runtime" / `VulkanRT-*-Installer.exe`, ~3 MB). Or, if you already have a recent NVIDIA / AMD / Intel GPU driver, `vulkan-1.dll` may already be somewhere — in which case just copy it next to `realesrgan-ncnn-vulkan.exe`.
   - Command to run after Vulkan is available: `"C:/Users/alany/tools/realesrgan/full/realesrgan-ncnn-vulkan.exe" -i "C:/dev/youngcarpets/website/forClaude/bg.jpg" -o "C:/dev/youngcarpets/website/forClaude/bg-ai-4x.png" -n realesrgan-x4plus-anime -s 4` — then resize the result to 2400 wide with Pillow and overwrite `src/lib/assets/hero/bg.jpg`, then `pnpm run deploy`.
3. **Hero text:** still `<h1>hello</h1>`. Decide what replaces it — brand name, tagline, or leave the image to carry the hero alone.
4. **Typography + fonts:** still untouched. Pick a self-hosted WOFF2 variable font per CLAUDE.md rules (one file, `font-display: swap`, preload critical weight, no Google Fonts).
5. **Parallax (deferred, optional).** The ay3 v12 layered parallax pattern (`_archive/ay3/my-portal/src/routes/young-carpets/dev/v12/+page.svelte` and `_archive/ay3/my-portal/src/lib/styles/young-carpets.css`) can be ported once the base hero looks right. Alan is undecided on whether to add it. If added, gate on `prefers-reduced-motion` (mandatory per CLAUDE.md WCAG rules) and optionally on `(pointer: fine)` for desktop-only mouse parallax. `enhanced-img` already handles the per-device file-size question, so shipping one large source is fine.

## Next Up (after hero background)

- [ ] **Plan the ay3 archive port.** Source: local `_archive/ay3/` on this laptop (gitignored, never pushed). Candidates:
  - Apple/design resources in ay3 tree
  - v7 reference at `_archive/ay3/my-portal/src/routes/young-carpets/dev/v7/+page.svelte` and sibling `v1–v12`
  - Flooring product knowledge → `.claude/resources/products/`
  - Written port plan before copying anything.

## Site content (after scaffold — not started)

- [ ] Real home page hero (background chosen, text decided, CTAs, JSON-LD `LocalBusiness`)
- [ ] Header nav with real links (currently stub: just the brand link)
- [ ] Footer with real content (currently stub: just copyright)
- [ ] `(marketing)/services/+page.svelte` index
- [ ] `(marketing)/services/[slug]/+page.svelte` (dynamic via `src/lib/content/services.ts`)
- [ ] `(marketing)/gallery/+page.svelte` (before/after, informative alt text)
- [ ] `(marketing)/about/+page.svelte`
- [ ] `quote/+page.svelte` + `quote/+page.server.ts` (form action, Zod, honeypot, rate limit, Resend)
- [ ] Favicon (currently removed from `app.html` — add a real one with the hero work)
- [ ] Real self-hosted font

## Phase 2 (deferred — not started)

- [ ] Authenticated employee portal with a database. Deferred until Phase 1 marketing site ships.

## Done ✓

- [x] CLAUDE.md with all protocols, TODO.md durable cross-session list
- [x] `.claude/` harness scaffolded (settings.json, hooks, commands, agents, research dirs)
- [x] Expert research file: `.claude/research/2026-04-11-expert-setup-findings.md`
- [x] Workflow cycle research: `.claude/research/2026-04-11-workflow-cycle-research.md`
- [x] Pre-flight install audit: `.claude/research/2026-04-11-preflight-install-audit.md`
- [x] ay3 archive copied to `_archive/ay3/` (local only, gitignored)
- [x] Git identity: `OnError <alanyoungjr@gmail.com>`, longpaths=true, autocrlf=input
- [x] Windows Defender exclusion on project folder
- [x] pnpm 10.33.0 via Corepack
- [x] Claude Code plugins (project scope): `feature-dev`, `frontend-design`
- [x] SvelteKit project scaffolded with pinned deps, all configs, source shell, CI, pre-push hook, lefthook pre-commit hook
- [x] Cloudflare Pages project `youngcarpets-website` created and deployed
- [x] `pnpm run deploy` script added — one-command build + deploy
- [x] `wrangler.toml` at project root (nodejs_compat flag, pages_build_output_dir)
- [x] `defaultMode: bypassPermissions` set in `.claude/settings.json` (active next session)
- [x] Three new memory feedback rules added: stop-and-reassess-after-second-fix-fails, fetch-vendor-docs-first, recommend-one-path
- [x] **Hello page live on production URL and verified working**
- [x] **Hero background image live on production URL** (LANCZOS upscale of `bg.jpg` to 2400×1850, wired via `@sveltejs/enhanced-img`; awaiting phone verification before declaring the quality question closed)
- [x] Verified deploy loop speed (cycled red/blue/green/yellow backgrounds — each `pnpm run deploy` < 1 min)
- [x] Added memory rule: links — never wrap URLs in `**` or similar formatting; emit bare URLs so they stay clickable without getting broken

---

## How to use this file

- **Start of a session:** read this file first, then read `CLAUDE.md`.
- **Mid-session:** whenever a decision changes, update this file immediately.
- **End of a session:** update checkboxes, commit, push.
- **Switching devices:** `git pull origin main` on the other device.
- **Live preview:** `pnpm run deploy` → reload `https://youngcarpets-website.pages.dev`.
