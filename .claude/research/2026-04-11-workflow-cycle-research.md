# Workflow Cycle Research — 2026-04-11

Research-only. No adoption decisions made. Captured from two `claude-code-guide` subagent passes dispatched during the laptop session on 2026-04-11.

## Goal

Design a Claude Code workflow for the website project that enforces a **feature → full verify cycle → advance** discipline, with a session-start flow that presents a pickable TODO. Merge good ideas from the prior ay3 project with current 2026 Claude Code features.

The user's own words for the pattern:
> "Start with the background and get the background right... go through a workflow cycle to make sure that after I implement that one little feature, it's perfect and it works with everything else."

---

## Pass 1 — Modern port of ay3's workflow protocol

### Current Claude Code feature inventory (2026)

| Feature | Use |
|---|---|
| **Hooks** — `PreToolUse`, `PostToolUse`, `SessionStart`, `UserPromptSubmit`, `Stop` | Automate repeatable gates. Exit 2 to block. Regex matchers. |
| **Slash commands** — `.claude/commands/*.md` | Still work; being merged into the Skills model. |
| **Skills** — `.claude/skills/*/SKILL.md` with frontmatter | Extended commands with supporting files, tool restrictions, model overrides, optional auto-invoke. Supports `$ARGUMENTS`, shell injection. |
| **Subagents** — `.claude/agents/*.md` + Agent tool | Forked context windows. Types: `Explore` (read-only), `Plan`, `general-purpose`, custom. |
| **Plugins + marketplaces** | Bundled agents/skills/commands/hooks from `claude-plugins-official` or community. |
| **MCPs** | External tools via JSON-RPC. |
| **TaskCreate / TaskList / TaskUpdate** | Native task tracking. Status, ownership, dependencies (`addBlockedBy`), visible checkboxes. |
| **Status line** | Real-time bottom-bar workflow visibility. |
| **Permission modes** | `acceptEdits`, `plan`, `bypassPermissions`, `auto`. |
| **Pre-compaction** | Automatic context summarization; skills re-attach up to 25k tokens. |

### Plugins already installed (at ay3 project scope, NOT website yet)

- **`superpowers@5.0.7` (official).** Brainstorm → plan → execute → code-review pipeline with red-green TDD gates, auto-git-commits at milestones, built-in code-reviewer subagent.
- **`frontend-design@claude-plugins-official`.** Design judgment framework: nudges toward intentional typography, orchestrated motion, spatial composition. Auto-activates when building frontend interfaces.

### Recommended ay3-derived architecture for this project

- **Master queue:** TaskCreate (native). Mandate in CLAUDE.md: every multi-step directive → TaskCreate entries, visible to user.
- **Mode detection:** **Drop** the ay3 Quick/Deep dichotomy. Conflicts with the user's "setup-phase-slow" memory rule. Marketing site doesn't need parallel multi-agent as default.
- **Agent roster:** 4 agents for Phase 1 — `svelte-reviewer` (exists), `a11y-checker` (exists), `error-check` (new), `refactor` (new). Plus optional `perf-audit`. **Drop** ay3's 18-agent roster (database, supabase, charts, financial, forms, optimize, performance, mobile, design, flooring-expert, resource-merger, git-ops, troubleshoot, visual-diagnose — overkill or Phase 2).
- **Slash commands to port:** `/error-check`, `/pre-commit`, `/refactor`, `/perf-audit`. Drop `/deep-mode`, `/new-module`, `/save`.
- **Hooks beyond existing prettier:** `SessionStart` (branch + task list), `PreToolUse` on `Bash(git push*)` (gate on `pnpm check`), `PermissionRequest` on destructive Bash.
- **What NOT to port from ay3:** the 18-agent roster, the `rules/` auto-loading framework, the Quick/Deep mode detection, a manual master-todo `.md` file (TaskCreate replaces it).

---

## Pass 2 — Top workflow plugins enforcing feature → verify → advance

### Plugin survey

| Plugin | Description | One-feature-at-a-time? | Session start TODO? | Verify scope | Opinionated |
|---|---|---|---|---|---|
| **Superpowers** *(official)* | Brainstorm → design → plan → TDD implement → review → complete. Gated phases. | **Yes, strong.** Each phase blocks the next. Code review between tasks can block progress. | No native session-start picker. | Red-green TDD, code review against plan, test pass gate. | **Highly.** "Iron law" — prod code without a failing test must be deleted. |
| **Feature-Dev** *(official)* | Guided 7-phase workflow with 3 agents (code-explorer, code-architect, code-reviewer). | **Partial.** Sequential phases but can be skipped. | No. | Architecture review, bug detection, security, convention checks. No TDD. | Moderate — guided, not blocked. |
| **Code-Review** *(official)* | Automated PR review via 5 parallel agents (compliance, bugs, git history, PR history, comments). | **No.** Post-hoc verification tool. | No. | CLAUDE.md compliance, bug scoring, historical context. | No — on-demand. |
| **PR-Review-Toolkit** *(official)* | Specialized agents for comments, tests, error handling, type design, simplification. | **No.** Post-hoc review. | No. | Narrow — comments, tests, errors, types, quality. | No. |
| **Commit-Commands** *(official)* | Automated git workflow (commit, push, PR in one step). | **No.** Convenience automation. | No. | None; git orchestration only. | No. |
| **Pro-Workflow** *(community, `rohitg00`)* | LLM Gates (prompt-type hooks) + multi-phase validation gates (research → plan → implement → review). | Some — has explicit gates. | No. | User-defined validation gates. | Moderate. |
| **claude-code-workflows** *(community, `shinpr`)* | Quality-fixer verification before every commit. | Weakly — commit-level gate, not feature-level. | No. | User-defined quality fixer. | Moderate. |

### Gap analysis

1. **No plugin ships a built-in session-start TODO picker.** None show a user-selectable pending-feature list at session open. The user's session-start flow vision (open session → see TODO → pick one) requires a custom `SessionStart` hook regardless of which plugin is chosen.
2. **No cross-session feature-completion gate.** A feature finished in one session cannot automatically block new features in the next. That discipline is manual.
3. **Superpowers is the only strict enforcer of feature → verify → advance.** Feature-Dev is guided-but-skippable. Every other plugin is either post-hoc review or convenience automation.

### Native Claude Code features (Jan 2025+) that affect this decision

- **Task Management (`TaskCreate`/`TaskList`/`TaskUpdate`):** hierarchical TODOs with parent-child + dependencies + status. Programmatically queryable.
- **SessionStart hooks:** inject custom commands at session open (can print task list, run a picker).
- **Plan Mode:** read-only exploration before edits.
- **Native PR linking:** sessions auto-link to PRs; `/resume --from-pr <n>` recovers state.

**Implication:** a "no-plugin" approach using TaskCreate + a custom SessionStart hook is viable. The plugins add phase-gating enforcement, not the session-start TODO picker itself.

---

## Three paths (choose one)

### Option A — Superpowers + custom SessionStart hook
- Superpowers enforces brainstorm → plan → TDD implement → review gates.
- Custom SessionStart hook displays pending tasks from TaskList at session open.
- **Strongest verify-before-advance discipline.**
- **Trade-off:** TDD cycle may feel heavy for trivial routes. Can disable per-task if needed.

### Option B — Feature-Dev standalone
- Guided 7-phase workflow; user can skip phases.
- No session-start hook (or add one separately).
- **Lighter, less opinionated.** Better for small marketing sites where TDD is overkill.
- **Trade-off:** phases are advisory, not gates — weaker enforcement.

### Option C — No plugin; TaskCreate + custom SessionStart hook + manual gates
- Native `TaskCreate` for the task list.
- Custom `SessionStart` hook queries `TaskList` and presents the picker.
- Manual `/error-check`, `/pre-commit`, `/refactor` skills (hand-rolled, ported from ay3 and modernized).
- **Lightest ceremony, maximum flexibility.**
- **Trade-off:** discipline is fully user-driven; no tool enforces phase gates.

---

## Open decisions (for the user to make — not decided yet)

1. **Which path?** A, B, or C.
2. **SessionStart hook content:** print the full pending task list, or a condensed "next 3 items" view, or an interactive picker?
3. **Where does the durable TODO live?** `TODO.md` (already exists, cross-device), `TaskCreate` (native, in-session only), or both?
4. **Verify cycle scope:** at minimum, what must pass before a feature is "done"?
   - `pnpm check` (types)
   - `pnpm lint` (style)
   - `error-check` subagent (project rules)
   - `a11y-checker` subagent (WCAG on routes)
   - visual check (human eye)
   - "doesn't break anything else" check (integration — how?)
5. **Is this project too small for superpowers' TDD?** Marketing site has ~6 routes and a quote form — is red-green TDD appropriate?

## Sources

- [Superpowers — Claude Plugin](https://claude.com/plugins/superpowers) · [obra/superpowers](https://github.com/obra/superpowers/)
- [Feature-Dev — Claude Plugin](https://claude.com/plugins/feature-dev)
- [Code-Review — Claude Plugin](https://claude.com/plugins/code-review)
- [PR-Review-Toolkit — Claude Plugin](https://claude.com/plugins/pr-review-toolkit)
- [Claude Code Hooks Reference](https://code.claude.com/docs/en/hooks.md)
- [Claude Code Skills](https://code.claude.com/docs/en/skills.md)
- [Claude Code Subagents](https://code.claude.com/docs/en/sub-agents.md)
- [Claude Code Common Workflows](https://code.claude.com/docs/en/common-workflows)
- [Discover and install prebuilt plugins](https://code.claude.com/docs/en/discover-plugins)
- [shinpr/claude-code-workflows](https://github.com/shinpr/claude-code-workflows)
- [rohitg00/pro-workflow](https://github.com/rohitg00/pro-workflow)
