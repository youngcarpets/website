# GitHub Reference — AY3

Single source of truth for GitHub-related URLs and conventions for this
project. If git says something different, git wins — verify with
`git remote -v` and `git config --get remote.origin.url`.

## Repo

- **Owner:** onerrorgotowtf (canonical casing per redirect: `onErrorGoToWTF`)
- **Repo name:** `ay3` (lowercase)
- **Remote URL:** `https://github.com/onerrorgotowtf/ay3.git`
  - The remote redirects to the canonical-cased URL `https://github.com/onErrorGoToWTF/ay3.git` — push/fetch still work, you'll just see a "This repository moved" notice in the output. Harmless.
- **Default branch:** `main` (the only branch that matters — see `.claude/rules/relay.md` and the `/save` skill: every device works on `main`, never on feature branches)

## GitHub Pages

- **Pages URL:** `https://onerrorgotowtf.github.io/ay3` (if Pages is enabled — verify in repo Settings → Pages before assuming live)

## Conventions

- Use `gh` CLI for all GitHub operations (issues, PRs, checks, releases) — never the web UI from Claude Code
- Reference issues/PRs in commits as `onerrorgotowtf/ay3#123`
- Never force-push `main`, never skip hooks (`--no-verify`)
- See `CLAUDE.md` Rule 4 (Silent GitHub Operations) and `.claude/agents/git-ops.md`

## When git remote and this file disagree

Git wins. Update this file.
