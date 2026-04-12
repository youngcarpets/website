# Backup Command

When the user says **"BACKUP"**, mark the current state as a preserved milestone restorable later.

1. Confirm working tree is clean (`git status --short`) — if dirty, ask before proceeding
2. Create an annotated tag: `git tag -a backup-YYYY-MM-DD-vX.Y.Z-<short-slug> -m "BACKUP: <user context or current feature>"`. Use the current package.json version.
3. Create a snapshot branch: `git branch backup/YYYY-MM-DD-vX.Y.Z-<slug>` pointing at the same commit
4. Push both: `git push origin backup-YYYY-MM-DD-vX.Y.Z-<slug>` and the branch
5. Report: tag name, branch name, commit hash, and the exact restore command `git reset --hard <tag>` so the user can return later
6. Do NOT advance past a BACKUP without user direction — they're marking a milestone on purpose
