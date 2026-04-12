# /pre-commit — Quality Gate Before Committing

> **Agent**: `.claude/agents/git-ops.md` | **Mode**: Quick

Run this before every git commit to catch issues early.

## Steps

1. **Read** the project immutable facts from memory (`project_facts.md`) to verify:
   - Working from git root `C:\DEV\ay3\` (not my-portal/)
   - On `main` branch
   - Remote is `origin` → `https://github.com/onerrorgotowtf/ay3.git`

2. **Check staged files** for problems:
   ```bash
   git status
   git diff --cached --name-only
   ```
   - Flag if `.env` or any credential file is staged
   - Flag if `node_modules/` is staged
   - Flag if any file >500KB is staged (likely a binary)

3. **Run type checking:**
   ```bash
   cd my-portal && npx svelte-check --tsconfig ./tsconfig.json
   ```
   - Report ERROR count and WARNING count
   - If errors > 0, list them and recommend fixes

4. **Verify Svelte 5 compliance** (quick grep):
   - Check for `export let` in `.svelte` files (should be `$props()`)
   - Check for `<slot` in `.svelte` files (should be `{@render}`)
   - Check for `on:click` syntax (should be `onclick`)

5. **Report summary:**
   ```
   ## Pre-Commit Report
   - Branch: main ✓
   - No secrets staged: ✓
   - svelte-check: 0 errors, 2 warnings ✓
   - Svelte 5 compliance: ✓
   - Ready to commit: YES
   ```

6. If all checks pass, suggest a commit message based on the staged changes.
