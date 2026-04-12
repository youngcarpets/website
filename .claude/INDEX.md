# .claude/ Master Index

> Quick-access map for all agents, resources, and reference material.
> Last updated: 2026-04-12

---

## Agent Dispatch

| Agent | Domain | Index | When to use |
|-------|--------|-------|-------------|
| [ay3-expert](agents/ay3-expert.md) | Original YC website analysis, porting, comparison | [index](agents/indexes/ay3-expert.index.md) | Replicate ay3 features, compare old vs new, port effects |
| [design](agents/design.md) | Apple Liquid Glass UI, colors, typography, effects, a11y | [index](agents/indexes/design.index.md) | Styling, glass effects, color, dark mode, animations |
| [visual-diagnose](agents/visual-diagnose.md) | Screenshot-based visual bug diagnosis | [index](agents/indexes/visual-diagnose.index.md) | User drops screenshot, visual bug resists code-only debug |
| [mobile](agents/mobile.md) | Phone/tablet, touch, Safari quirks | [index](agents/indexes/mobile.index.md) | iPhone rendering, touch events, viewport units, safe areas |
| [svelte-reviewer](agents/svelte-reviewer.md) | Svelte 5 + TS code review | — | Runes, props, events, anti-patterns |
| [a11y-checker](agents/a11y-checker.md) | WCAG 2.2 AA auditor | — | Landmarks, headings, contrast, focus, target size |
| [performance](agents/performance.md) | Web performance, Core Web Vitals | [index](agents/indexes/performance.index.md) | LCP, CLS, INP, bundle size, image optimization |
| [flooring-expert](agents/flooring-expert.md) | Commercial flooring domain knowledge | [index](agents/indexes/flooring-expert.index.md) | Product content, industry terms, supplier info |
| [forms](agents/forms.md) | Form UX, validation, submission | [index](agents/indexes/forms.index.md) | Quote form, Zod schemas, error handling |
| [research](agents/research.md) | Web research, vendor docs | [index](agents/indexes/research.index.md) | Investigating libraries, APIs, best practices |
| [charts](agents/charts.md) | Data visualization | [index](agents/indexes/charts.index.md) | If charting is ever needed |
| [financial](agents/financial.md) | Financial accuracy, accounting | [index](agents/indexes/financial.index.md) | Invoice, billing, Ontario accounting rules |
| [error-check](agents/error-check.md) | Error diagnosis | — | Build errors, runtime errors, type errors |
| [optimize](agents/optimize.md) | Code optimization | [index](agents/indexes/optimize.index.md) | Bundle size, render perf, CSS optimization |
| [refactor](agents/refactor.md) | Code restructuring | [index](agents/indexes/refactor.index.md) | Component extraction, file reorganization |
| [structure](agents/structure.md) | Project architecture | [index](agents/indexes/structure.index.md) | Route layout, module organization |
| [troubleshoot](agents/troubleshoot.md) | General debugging | [index](agents/indexes/troubleshoot.index.md) | When standard debugging fails |
| [resource-merger](agents/resource-merger.md) | Merge new research into resources | — | After research agent returns findings |

---

## Resources (`.claude/resources/`)

### Apple Design System
| File | Contents |
|------|----------|
| [03-apple-liquid-glass-design.md](resources/03-apple-liquid-glass-design.md) | Three-layer glass CSS, color system, backdrop-filter perf, reduced-transparency |
| [10-apple-colors.md](resources/10-apple-colors.md) | Apple system colors (12 + grays), semantic labels/backgrounds/fills, dark mode |
| [11-apple-effects.md](resources/11-apple-effects.md) | Material thickness levels, shadows, easing curves, parallax tilt, iOS toggle |
| [12-apple-typography.md](resources/12-apple-typography.md) | SF Pro type scale, spacing grid (8pt base), corner radii |

### Motion & Animation
| File | Contents |
|------|----------|
| [13a-motion-tokens.md](resources/13a-motion-tokens.md) | CSS custom properties for duration/easing, GPU rules |
| [13b-motion-controllers.md](resources/13b-motion-controllers.md) | TypeScript MotionController + StaggerManager classes |
| [13c-motion-utilities.md](resources/13c-motion-utilities.md) | CSS utility classes for motion |

### Young Carpets Specific
| File | Contents |
|------|----------|
| [20-dark-glass-pills-glows.md](resources/20-dark-glass-pills-glows.md) | Dark-mode glass cards, floating pill nav, colorful glow palette, locked neutral palette |
| [21-architectural-finishes-plan.md](resources/21-architectural-finishes-plan.md) | SVG conventions for floor-plan drawings |
| [25-color-preferences.md](resources/25-color-preferences.md) | User color preferences and accent decisions |

### Accessibility & Quality
| File | Contents |
|------|----------|
| [04-accessibility-wcag22.md](resources/04-accessibility-wcag22.md) | WCAG 2.2 AA on glass UI, contrast, focus indicators, reduced-transparency |
| [30-troubleshooting-playbooks.md](resources/30-troubleshooting-playbooks.md) | Common issue diagnosis and fix patterns |

### Tech Reference
| File | Contents |
|------|----------|
| [05-typescript-zod-superforms.md](resources/05-typescript-zod-superforms.md) | TypeScript strict, Zod validation, Superforms patterns |
| [06-performance-sveltekit.md](resources/06-performance-sveltekit.md) | SvelteKit performance patterns, prerendering, code splitting |
| [07-svelte5-runes-patterns.md](resources/07-svelte5-runes-patterns.md) | Svelte 5 runes reference ($state, $derived, $effect, $props) |
| [08-financial-accuracy.md](resources/08-financial-accuracy.md) | Financial calculation rules, rounding, Ontario tax |

### Flooring Products
| Directory | Contents |
|-----------|----------|
| [products/](resources/products/) | Flooring product knowledge (moved from ay3) |

---

## Reference (`.claude/reference/`)

### Animation
| File | Contents |
|------|----------|
| [animation-navigation.md](reference/animation-navigation.md) | View Transitions API + SvelteKit page transitions |
| [animation-components.md](reference/animation-components.md) | Card pop, button animations, glow effects, consistency checklist |
| [animation-carousel.md](reference/animation-carousel.md) | CSS-only + Embla carousel patterns |

### Architecture & Patterns
| File | Contents |
|------|----------|
| [architecture-decisions.md](reference/architecture-decisions.md) | ADR-005: Apple Liquid Glass UI (CSS-only approach) |
| [component-patterns.md](reference/component-patterns.md) | Svelte component patterns and conventions |
| [design-standards.md](reference/design-standards.md) | New website design decisions that override ay3 patterns |
| [standards.md](reference/standards.md) | Code standards and conventions (ay3-era) |
| [review-checklist.md](reference/review-checklist.md) | Pre-commit review checklist |

### Domain
| File | Contents |
|------|----------|
| [ontario-accounting.md](reference/ontario-accounting.md) | Ontario business accounting rules |
| [mobile-testing.md](reference/mobile-testing.md) | Mobile device testing notes |
| [shell-commands.md](reference/shell-commands.md) | Useful shell commands reference |

### Project History
| File | Contents |
|------|----------|
| [ay3-archive-index.md](reference/ay3-archive-index.md) | Comprehensive ay3 archive index |
| [ay3-structure.md](reference/ay3-structure.md) | ay3 project structure overview |
| [young-hero-deleted-code.md](reference/young-hero-deleted-code.md) | Deleted hero code (restorable patterns) |
| [known-deferred-fixes.md](reference/known-deferred-fixes.md) | Known issues deferred for later |
| [pending-assets.md](reference/pending-assets.md) | Assets not yet integrated |

---

## Agent Resources (`.claude/agents/resources/`)

| File | Contents |
|------|----------|
| light-mode-implementation-plan.md | Light mode implementation strategy |
| light-mode-spec.md | Light mode color/contrast spec |
| maple-leaf-candidates.md | Maple leaf badge design candidates |
| products-section-spec.md | Products section layout spec |
| theme-toggle-plan.md | Theme toggle implementation plan |
| token-readiness-audit.md | Design token completeness audit |
| workflow-master-todo-rule.md | Master todo queue management rule |

---

## Research (`.claude/research/`)

| File | Contents |
|------|----------|
| [INDEX.md](research/INDEX.md) | Research index (local sub-index) |
| [2026-04-11-expert-setup-findings.md](research/2026-04-11-expert-setup-findings.md) | Expert research on tooling setup (pinned versions) |
| [2026-04-11-preflight-install-audit.md](research/2026-04-11-preflight-install-audit.md) | Pre-flight install dependency audit |
| [2026-04-11-workflow-cycle-research.md](research/2026-04-11-workflow-cycle-research.md) | Workflow cycle research (error checking strategy) |

---

## Commands (`.claude/commands/`)

| Command | Purpose |
|---------|---------|
| `/add-page <slug>` | Scaffold a new marketing page with SEO + nav integration |
| `/check-a11y <file>` | Audit component for WCAG 2.2 AA |
| `/component-review <file>` | Review Svelte 5 runes, types, prop design |
| `/research <topic>` | Dispatch background research agents |
