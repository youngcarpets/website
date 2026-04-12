# AY3 Portal — Multi-Agent System

Staff portal for automating business procedures. SvelteKit + Supabase + Apple Liquid Glass UI.

must prompt USER when making changes to this file. Only the USER can approve changes to this file. 

---

## Session Info — Display at Conversation Start

**On every new session, display this block before doing anything else:**

```
AY3 Portal | v1.23.28 | main | 2026-04-08
```

Then run `git branch --show-current` and `git log --oneline -1` to confirm branch and latest commit.
Update the version here whenever a new `git tag vX.Y.Z` is created.

---

## TOP PRIORITY — Mode Detection (Intent-Based)

**Read every user message and determine the mode BEFORE doing anything else.**

Detect mode by **intent**, not just punctuation. Read what the user actually wants:

- **Quick Mode** → user knows exactly what they want done, single targeted task
- **Deep Mode** → user wants research, exploration, planning, or multi-file work

**When in doubt, default to Deep Mode.** Multi-agent is always the user's preference. Only use Quick when the task is obviously small and specific.

---

## Rule 1: Agent-First — ALWAYS Delegate

For ANY task, read `.claude/INDEX.md` to find the right specialist agent and its resources.

Agent files in `.claude/agents/*.md` are **reference docs** — read them for instructions, then use the `Agent` tool to launch subagents with those instructions as context.

**Agent dispatch flow:**
1. Read `.claude/INDEX.md` → find the matching agent in the Agent Dispatch table
2. Read the agent's definition (`.claude/agents/{name}.md`) and index (`.claude/agents/indexes/{name}.index.md`)
3. Launch subagents via the `Agent` tool, providing the agent definition + relevant resources as prompt context
4. Parallel agents where domains are independent

**Available agents:** Database, Supabase, Error-Check, Refactor, Structure, Design, Forms, Performance, Research, Resource-Merger, Git-Ops, Financial, Optimize

---

## Rule 2: Two Operating Modes

### Quick Mode — Small Directives
- Single agent, targeted task
- Read the agent's index → load resources → do the work → commit
- No parallel agents, no chunking
- **Use for:** specific fixes, small features, single-file edits (1-2 files)
- **How to detect:** User gives a **directive** — they know exactly what to change and it's one thing
- **Examples:** "Fix the button color." "Move the logo left." "Rename this variable."

### Deep Mode (default preference) — Everything Else
- Multi-agent, chunked, parallel work
- Launch parallel agents for different aspects of the task
- Save and commit after each chunk
- Push to main after each major milestone
- **Use for:** new modules, refactors, multi-file changes, architecture, debugging, investigation, research, planning
- **How to detect:** Any of these signals:

**Deep Mode signals (any one = Deep Mode):**
- **Questions:** anything asking why, how, what — user needs you to figure something out
- **Prefix keywords:** "Deep:", "Research:", "Plan:" — explicit mode signal
- **Exploration language:** "look into", "figure out", "investigate", "review", "check"
- **Build language:** "build out", "implement", "set up", "create the module"
- **Scope:** task touches 3+ files, new module, schema + code + routes
- **Ambiguity:** if you're unsure, it's Deep Mode

**The user prefers multi-agent work. Only go Quick for obviously small, single-target tasks.**

---

## Rule 3: Resource Growth Protocol

Resources are **append-only** — NEVER replace existing content. See `.claude/agents/resource-merger.md` for the full merge protocol.

### Memory vs. repo files — what goes where

The per-device auto-memory system (`~/.claude/projects/.../memory/`) is **per-machine**, **per-OS-user**, and **not in the repo**. Use it sparingly. Repo files are the source of truth for anything that should travel with the project.

**Memory files should contain only:**
- User profile and preferences (work style, device setup, terminology)
- Collaboration patterns and feedback (how Claude should work with you)
- Transient session state (current todos, in-flight agent IDs)

**Do NOT duplicate in memory:** Reference docs, hardware specs, code patterns, framework rules, or project decisions belong in `.claude/notes/`, `.claude/reference/`, `.claude/rules/`, or `docs/`. If a repo file already exists for the topic, point to it from memory instead of restating it (e.g. *"See `.claude/notes/hardware-specs.md` for Alienware R15 details"*). Before saving a new memory entry, ask: "could this live in the repo instead?" — if yes, put it there.

---

## Rule 4: Silent GitHub Operations

Git operations happen silently — no approval prompts. See `.claude/agents/git-ops.md` for full protocol. Never commit `.env`, credentials, or `node_modules/`.

---

## Rule 5: Dynamic Agent Creation

If a task type recurs 3+ times without a dedicated agent:
1. Create a new agent definition in `.claude/agents/{name}.md` following `_template.md`
2. Create its index file in `.claude/agents/indexes/{name}.index.md`
3. Update `.claude/INDEX.md` with the new agent entry in the dispatch table
4. Commit the new agent files

---

## Rule 6: Master Todo + Interrupt-Aware Ordering

**TodoWrite is the master queue.** Every directive — current work, future work, deferred, blocked, parked questions, re-review passes — lives in one place. No mental tracking.

**Interrupts get slotted by dependency, not appended blindly.** When a new task arrives mid-work:
1. Do NOT drop the in-progress task.
2. Capture the new task in TodoWrite immediately.
3. Ask: does it block on / batch with / unblock anything already queued? Slot it accordingly.
4. Announce where it landed in **one sentence** (e.g. *"queued → slot 4 after token sweep, needs the shimmer var"*).
5. Return to the in-progress task.

**The user owns priorities; Claude owns the dependency graph.** If the user says "do this NEXT" or "now" or "drop everything", that beats dependency logic — promote it to the front and re-order around it. "Not now" / "later" / "park it" → move to end with a `(DEFERRED BY USER)` annotation.

**Status tags make the queue legible:** exactly one `in_progress` at a time, `pending` items in execution order, and inline annotations for `(WAITING ON USER)`, `(DEFERRED BY USER)`, `(BLOCKED ON: <task>)`, `(AGENT IN FLIGHT: <id>)`, `(IDEA — not confirmed)`.

**In-flight agents don't pause the queue.** The user can keep adding while agents run (see `feedback_agent_flow.md` in user memory). Work on independent queued items while agents are out; queue anything that depends on their output.

**The list persists within the session.** Use remote-control to continue from another device.

Full protocol + worked examples: user memory `feedback_master_todo.md`. Composes with `feedback_agent_flow.md`, `feedback_chunking.md`, `feedback_slow_discovery.md`, `feedback_checkpoint_todos.md`.

---

## Tech Stack
- **SvelteKit** + Svelte 5 runes + TypeScript strict | **Tailwind CSS v4** | **Supabase** (PostgreSQL)
- **Superforms v2** + **Zod v4** for forms | **Bits UI** for headless primitives
- **Module pattern:** `src/lib/modules/{name}/` with types, schemas, services, components, barrel export

## Critical Gotchas
See `.claude/rules/` for framework rules (auto-loaded). Only non-rule gotcha:
- **Supabase env:** `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` in `my-portal/.env`

## Git Protocol
- **Root:** project root (NOT my-portal/) | **Branch:** `main` | **Remote:** `https://github.com/onerrorgotowtf/ay3.git`
- Commit after every file creation or major edit. Never commit `.env` files.
- Push silently — no confirmation needed.

## Commands
- Dev: `cd my-portal && npm run dev` (localhost:5173) or `scripts\start-portal.bat`
- Install: `cd my-portal && npm install`
- Type check: `cd my-portal && npx svelte-check --tsconfig ./tsconfig.json`

## Project Structure
See `.claude/INDEX.md` for full resource map and agent dispatch. See `docs/PROJECT-PLAN.md` for current phases.
