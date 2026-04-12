---
description: Dispatch domain-expert agents to research a topic in the background
argument-hint: <topic> e.g. "image optimization for gallery" or "flooring product types"
---

Research `$ARGUMENTS` by dispatching specialist agents while continuing to work with the user.

## Procedure

1. **Parse the topic** from `$ARGUMENTS`. Identify which domain(s) it touches.

2. **Find or create the right agent.**
   - Check `.claude/agents/` for an existing domain expert that matches.
   - If no match exists:
     - First or second time in a domain → use a general-purpose research agent.
     - Third+ time in the same domain → create a new specialist agent in `.claude/agents/{domain}.md` following the format of existing agents (see `svelte-reviewer.md` as a template). Give it focused tools (Read, Grep, Glob, WebSearch, WebFetch) and clear scope.

3. **Dispatch the agent** with `run_in_background: true`.
   - Brief the agent with the full topic and enough project context to make judgment calls.
   - Agent must:
     - Research using primary sources (code, docs, web).
     - Write findings to `.claude/research/{YYYY-MM-DD}-{topic-slug}.md`.
     - Return a **1-2 sentence summary only** — not full logs.
   - If the topic spans multiple independent domains, dispatch one agent per domain in parallel.

4. **Announce and continue.**
   - Tell the user what was dispatched and what it's looking for.
   - Continue working on whatever else the user needs. Do not block.

5. **When results arrive:**
   - Read the findings file (do not rely on the agent summary alone).
   - Present a concise summary to the user.
   - User decides what to act on, what to defer, what to discard.

6. **Index and commit.**
   - Update `.claude/research/INDEX.md` with a new entry: `- [{topic}](./{filename}.md) @{date}`.
   - Create the INDEX.md if it doesn't exist yet.
   - Commit the findings file and updated index to git.

## Rules

- **Don't dispatch** for questions already answered in CLAUDE.md, TODO.md, or existing research files. Check first.
- **One agent per domain.** Keep agents focused and specialized.
- **Findings are durable.** Written to files, indexed, committed. Reusable across sessions.
- **3-5 active domain agents max** per project. Only create new ones when a domain genuinely recurs.
- **Stale research:** if findings are older than 60 days and the topic is revisited, re-research and archive the old file to `.claude/research/archived/`.
