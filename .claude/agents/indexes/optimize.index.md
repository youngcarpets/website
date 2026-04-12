# Optimize Agent — Resource Index

## Files to Audit

### System Files (always check)
- `CLAUDE.md` — main project instructions (target: <200 lines)
- `.claude/INDEX.md` — master resource map
- `.claude/settings.json` — permissions and hooks config
- `.claude/settings.local.json` — local overrides (if exists)

### Agent Definitions (`.claude/agents/`)
- `_template.md` — canonical template (compare all agents against this)
- All `*.md` files — verify structure, responsibilities, no overlaps

### Agent Indexes (`.claude/agents/indexes/`)
- All `*.index.md` files — verify each non-system agent has one
- System agents (error-check, git-ops, resource-merger) intentionally lack indexes

### Commands (`.claude/commands/`)
- All `*.md` files — verify each appears in INDEX.md Commands table

### Resources (`.claude/resources/`)
- All `*.md` files — verify each is referenced by at least one agent index

### References (`.claude/reference/`)
- All `*.md` files — verify each is referenced by at least one agent index

### Auto-Load Directory
- `.claude/rules/` — check if it exists and is being used (all .md files auto-load into context)

## Token Budget Guidelines (Opus 4.6, 1M Context, Max Tier)

| Item | Target | Warning | Critical |
|------|--------|---------|----------|
| CLAUDE.md | < 200 lines | 200-300 | > 300 |
| INDEX.md | < 150 lines | 150-250 | > 250 |
| Single agent def | < 80 lines | 80-150 | > 150 |
| Single agent index | < 50 lines | 50-100 | > 100 |
| Single resource | < 250 lines | 250-400 | > 400 |
| Single reference | < 300 lines | 300-500 | > 500 |
| Total system (auto-loaded) | < 5K tokens | 5K-10K | > 10K |

Note: Only CLAUDE.md and .claude/rules/ are auto-loaded. Agent files, resources, and references are loaded on-demand. Budget matters most for auto-loaded content.

## Best Practices Checklist (from Anthropic research)

1. **CLAUDE.md under 200 lines** — instruction overload causes uniform ignoring
2. **Progressive disclosure** — tell Claude *how to find* info, not *all* the info
3. **Hooks over instructions** — mechanical rules belong in settings.json hooks
4. **Stable content at top** — cached tokens are 75-90% cheaper
5. **`.claude/rules/` for domain rules** — auto-loaded, keeps CLAUDE.md lean
6. **Sub-agents compress findings** — don't pollute main context with raw exploration
7. **No code patterns in instructions** — Claude infers these from reading the code
8. **Living document** — update CLAUDE.md when Claude makes mistakes
9. **One source of truth per fact** — duplicates waste context and drift apart
10. **Clear between unrelated tasks** — context degradation is real

## Functional Tests

The optimize agent should dispatch these agents to verify the system works:
- **Error-Check** → run on one module, verify it follows its 5-agent protocol
- **Structure Agent** → verify dispatch chain loads correctly (INDEX → def → index → resources)
- **Any agent** → verify settings.json permissions cover its operations

## Research Log
| Date | Topic | Source | Saved To |
|------|-------|--------|----------|
| 2026-04-06 | Claude Code best practices | Anthropic docs, blog, PDF | optimize.index.md checklist |
