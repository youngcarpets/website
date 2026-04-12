# /save — Commit, Sync With Main, Push

The user said "save". This is the entire workflow on every device (cell, laptop, desktop):

> **Main is the source of truth. Always.** Every device works directly on `main`. Save = commit your work, pull in any newer work from other devices, push it all back to main. Always report the new **version number** first.

## Steps

1. **Get everything onto main — silently, no questions.** `git branch --show-current`
   - If `main` → continue to step 2.
   - If anything else (feature branch, autonomous branch, whatever) → do ALL of this automatically, without asking:
     1. `git add -A && git commit -m "wip: pre-save snapshot on <branch>"` (only if the working tree is dirty — skip if clean)
     2. `git push -u origin <branch>` (make sure the branch work is on the remote before we leave it)
     3. `git checkout main`
     4. `git fetch origin main && git pull --rebase origin main` (get latest main from other devices)
     5. `git merge --no-ff <branch> -m "merge <branch> into main via /save"` — resolve the two trivial conflict cases (RELAY.md union, package.json version max) the same way step 5 does; anything else aborts and warns
     6. `git branch -d <branch>` (local cleanup — the branch is merged, it's dead weight now)
     7. Continue to step 2 as if you'd been on main the whole time.
   - **The user NEVER wants to be asked about branches.** Main is the only branch that matters. Treat any other branch as temporary scratch space that gets absorbed into main on save.

2. **Inspect.** `git status --short` and `git diff --stat`. Confirm nothing sensitive is staged: `.env`, `*.key`, `*.pem`, credentials, anything in `node_modules/`. If anything looks suspicious, ask before continuing.

3. **Bump version in `my-portal/package.json`:**
   - Read the current `"version"` field.
   - Patch (`x.y.Z+1`) by default.
   - Minor (`x.Y+1.0`) if a real new feature was added this save.
   - Major (`X+1.0.0`) only on explicit breaking changes the user requested.
   - Write the bumped value back. If this fails for any reason, STOP and report it loudly.

4. **Stage and commit.**
   - `git add -A` (after the sensitivity check in step 2)
   - Compose a commit message based on the actual diff, not just file names:
     ```
     <type>(<scope>): <one-line summary>

     - <bullet>
     - <bullet>
     ```
   - `git commit -m "<message>"`
   - If there's nothing to commit (clean tree), say so and skip to step 5 anyway — you still need to sync with main.

5. **Pull other devices' work.** `git fetch origin main && git pull --rebase origin main`
   - **Clean rebase** → continue to step 6.
   - **Conflict on `.claude/RELAY.md`** → auto-resolve as a union: keep every session entry from both sides. Then `git add .claude/RELAY.md && git rebase --continue`.
   - **Conflict on `my-portal/package.json` version line only** → take the `max(local, remote)` version, bump it once more (so this save still produces a fresh version), `git add` and `git rebase --continue`.
   - **Any other conflict** → `git rebase --abort`, leave the working tree exactly as it was, and warn the user with this exact shape, then STOP:
     ```
     SAVE BLOCKED — main has newer work that conflicts with yours.

     Conflicting files:
       - <file 1>
       - <file 2>

     Their commits since your base:
       <git log --oneline of incoming commits not in your branch>

     Your local commit is intact at <local-commit-hash>.
     Tell me how to handle this — keep mine, keep theirs, or merge by hand.
     ```

6. **Push.** `git push origin main`
   - On non-fast-forward rejection (someone pushed between fetch and push) → re-run step 5. Up to **3 retries** total before giving up and warning the user.

7. **Report — version number FIRST, always.** Use this exact shape:
   ```
   Saved. v<VERSION>
   - commit:    <short-hash> on main
   - changes:   <one-line summary of what this save did>
   - pulled in: <list of incoming commits from other devices, or "nothing new from other devices">
   - main now:  <main-short-hash>
   ```
   If anything was skipped (no local changes, etc.) say so explicitly. Never leave the user guessing about state.

## Constraints

- **Version number is mandatory in every report.** No exceptions. If the bump failed, say so loudly.
- **Never force-push main.** Ever.
- **Only auto-resolve the two trivial conflict cases** above (`RELAY.md` union, `package.json` version max). Anything else aborts and warns.
- **Never commit `.env` / `*.key` / `*.pem` / credentials / `node_modules/`.**
- **ALWAYS silently switch to main.** The user's explicit standing instruction: "I just want all versions to just merge on main." Never ask about branches. Main is the only branch the user cares about.
- **Never leave the working tree in a half-rebased state.** Either finish cleanly or abort cleanly.
