# Versioning Rules

- **Single source of truth:** `my-portal/package.json` → `"version"` field
- **Bump version on EVERY commit** — no exceptions
- Only update `package.json` — the dev page reads it automatically via `$app/environment`
- Use semver: patch for fixes, minor for features/refactors, major for breaking changes
- Report the version and commit hash to the user after every push
- Keep `CLAUDE.md` session info block in sync (update when version changes)
