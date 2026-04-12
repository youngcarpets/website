# Workflow Architect Output — Master Todo + Interrupt-Aware Ordering Rule

> Source: Workflow Architect agent `abbdf2a939635aa75` on 2026-04-07.
> Synthesized from tonight's session (v1.20.6 → v1.20.29 + light mode planning).
> Companion to `feedback_master_todo.md` (saved to user memory) + the proposed CLAUDE.md Rule 6 below.

## Synthesis

Tonight's Young Carpets session shipped v1.20.6 → v1.20.29 in a single long conversation. The defining shape of that session wasn't the code — it was the **queue discipline**. The user walked in with a 10-item mobile handoff document, then kept interrupting with new thoughts ("products more square", "deferring item 6", "not item 8 yet — I need to think", "LOVE this flow"), and the session never lost its place. That only worked because every interrupt went into TodoWrite instead of short-term memory, and because each new interrupt was slotted into a **logical position** relative to the in-flight work — not appended blindly to the end. Item 6 got deferred. Item 8 got parked pending 3 design questions. Item 10 got split into token base → sweep → 4 new glass spots, in that order, because the sweep depended on the base and the glass spots depended on the sweep's vars.

The user's exact words: *"it's like you have a master todo list.. but i keep interrupting with other tasks that you add for future and put them in the correct logical flow of tasks if that makes sense."* Earlier: *"i LOVE this flow. where you send off agent and i can keep adding to todo list without messing things up."* And confirming the canonical pattern: *"it's this most recent workflow right here that was the best. you started agents.. showed me the existing todo. allowed me to interrupt and add more to master todo or random little tweaks. love it. and it doesn't stop the main build we are currently doing."*

What the user wants formalized is the division of labor: **he owns priorities, Claude owns the dependency graph.** He says "this matters, this doesn't, do this next." Claude says "okay, but logically that should go after X because X unblocks it, and it should be batched with Y because they touch the same tokens." When Claude does that slotting, it announces where it landed in one sentence and goes back to whatever was in_progress. The master list is TodoWrite — single source of truth, no mental tracking, state persists into RELAY.md at every save/handoff so the next device picks up exactly where it left off.

## Proposed CLAUDE.md change

**Insertion point:** new Rule 6, after Rule 5 (Dynamic Agent Creation), before the Tech Stack section. Keeps the numbered structure intact.

**Status:** REQUIRES USER APPROVAL per CLAUDE.md's own header rule (`must prompt USER when making changes to this file. Only the USER can approve changes to this file.`)

```diff
@@ c:/DEV/ay3/CLAUDE.md @@
 ## Rule 5: Dynamic Agent Creation

 If a task type recurs 3+ times without a dedicated agent:
 1. Create a new agent definition in `.claude/agents/{name}.md` following `_template.md`
 2. Create its index file in `.claude/agents/indexes/{name}.index.md`
 3. Update `.claude/INDEX.md` with the new agent entry in the dispatch table
 4. Commit the new agent files

 ---

+## Rule 6: Master Todo + Interrupt-Aware Ordering
+
+**TodoWrite is the master queue.** Every directive — current work, future work, deferred, blocked, parked questions, re-review passes — lives in one place. No mental tracking.
+
+**Interrupts get slotted by dependency, not appended blindly.** When a new task arrives mid-work:
+1. Do NOT drop the in-progress task.
+2. Capture the new task in TodoWrite immediately.
+3. Ask: does it block on / batch with / unblock anything already queued? Slot it accordingly.
+4. Announce where it landed in **one sentence** (e.g. *"queued → slot 4 after token sweep, needs the shimmer var"*).
+5. Return to the in-progress task.
+
+**The user owns priorities; Claude owns the dependency graph.** If the user says "do this NEXT" or "now" or "drop everything", that beats dependency logic — promote it to the front and re-order around it. "Not now" / "later" / "park it" → move to end with a `(DEFERRED BY USER)` annotation.
+
+**Status tags make the queue legible:** exactly one `in_progress` at a time, `pending` items in execution order, and inline annotations for `(WAITING ON USER)`, `(DEFERRED BY USER)`, `(BLOCKED ON: <task>)`, `(AGENT IN FLIGHT: <id>)`, `(IDEA — not confirmed)`.
+
+**In-flight agents don't pause the queue.** The user can keep adding while agents run (see `feedback_agent_flow.md`). Work on independent queued items while agents are out; queue anything that depends on their output.
+
+**The list survives the conversation.** At every save / handoff / 5–8 message checkpoint on long tracks, mirror the queue into `.claude/RELAY.md`'s `📌 LATEST` pin so the next device/session picks up exactly where things left off.
+
+Full protocol + worked examples: user memory `feedback_master_todo.md`. Composes with `feedback_agent_flow.md`, `feedback_chunking.md`, `feedback_slow_discovery.md`, `feedback_checkpoint_todos.md`.
+
+---
+
 ## Tech Stack
```

## Test plan (week-from-now)

**Positive signals (rule is working):**
- RELAY.md `📌 LATEST` pin always contains a legible queue state with status tags
- User can context-switch devices mid-task; receiving session knows exactly what's in_progress, pending, waiting
- Interrupt acks are one sentence with slot position, then back to in-progress work
- `(IDEA — not confirmed)` items exist and don't accidentally get executed
- Priority overrides ("next", "now", "drop everything") trigger visible reorders within one turn
- `/save` reports include "queue: N in_progress, M pending, K parked" one-liner

**Negative signals (rule is broken):**
- "What happened to X?" — interrupt was lost
- Claude executes a tentative idea without confirmation
- Queue order doesn't match dependencies
- Interrupt acks run longer than one sentence
- RELAY.md pin has no queue section or is stale
- Two devices show different queue states after handoff

**Probe in a week:** *"is the queue doing what you wanted — are interrupts landing in the right spots without you having to re-explain?"*

## Sibling rules
- `feedback_agent_flow.md` — async fan-out (sister rule)
- `feedback_chunking.md` — small-chunk bias
- `feedback_slow_discovery.md` — one-question-per-turn
- `feedback_checkpoint_todos.md` — persist frequency
- `feedback_handoff_vocab.md` — cross-device handoffs
