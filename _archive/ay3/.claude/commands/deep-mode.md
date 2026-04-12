# /deep-mode — Multi-Agent Deep Work Mode

Activate Deep Mode for complex, multi-file tasks. This mode launches parallel specialist agents, chunks work into stages, and commits after each chunk.

## When to Use
- New module creation (schema + types + service + components + routes)
- Large refactors spanning multiple files
- Architecture changes affecting multiple modules
- Full feature implementations
- Any task touching 3+ files

## Execution Protocol

### Step 1: Analyze the Task
Break the task into **work chunks** by domain:
1. **Database chunk** — schema, types, migrations (Database Agent)
2. **Service chunk** — business logic, CRUD, API calls (Supabase Agent + Structure Agent)
3. **UI chunk** — components, forms, styling (Design Agent + Forms Agent)
4. **Route chunk** — pages, server files, navigation (Structure Agent)
5. **Quality chunk** — error check, performance review (Error Check Agent + Performance Agent)

### Step 2: Launch Parallel Agents
For each relevant chunk, spawn a specialist agent from `.claude/agents/`:
- Read the agent's definition file for its responsibilities
- Read the agent's index file for its resources
- Provide the agent with the specific task for this chunk
- Agents work in parallel where possible

### Step 3: Commit After Each Chunk
After each chunk completes:
1. Stage the changed files
2. Commit with message: `{type}: {chunk description}`
3. Do NOT wait for all chunks — commit as each finishes

### Step 4: Push and Report
After all chunks complete:
1. Push to main
2. Report summary:
   ```
   ## Deep Mode Complete
   - Chunks completed: X/Y
   - Files created: N
   - Files modified: N
   - Commits: N
   - Agents used: [list]
   ```

## Auto-Detection
Deep Mode activates automatically when:
- Task involves creating a new module
- Task requires schema + code + routes
- User says "build out", "implement", "do a full"
- Task touches 3+ files across different domains

## Key Rules
- Each agent reads its own resources before working
- Commit after EVERY chunk — don't batch
- Push silently — no confirmation needed
- If an agent needs info not in resources, spawn Research Agent
- Resource Merger handles any knowledge updates
