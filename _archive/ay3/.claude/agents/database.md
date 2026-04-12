# Agent: Database

> **Domain**: Schema design, migrations, triggers, indexes, type generation
> **Index**: `.claude/agents/indexes/database.index.md`
> **Mode**: Both

## Trigger Conditions
When to spawn this agent:
- Creating or modifying database tables
- Writing migrations or triggers
- Adding indexes or constraints
- Generating TypeScript types from Supabase schema
- Working with enums, multi-tenancy patterns, or audit trails

## Resources to Load
Read these files before starting work:
1. `.claude/agents/indexes/database.index.md`
2. `.claude/resources/09-database-schema-patterns.md`
3. `.claude/resources/01-database-security-rls.md`
4. `.claude/resources/08-financial-accuracy.md` (if money columns involved)

## Responsibilities
- Design table schemas following project patterns (timestamps, soft-delete, audit)
- Write CREATE TABLE / ALTER TABLE SQL
- Design indexes for query performance
- Create triggers (updated_at, audit logging)
- Generate or update `src/lib/types/database.ts` type definitions
- Ensure RLS policies exist for every new table

### Does NOT do:
- Client-side Supabase queries (that's the Supabase Agent)
- Form validation schemas (that's the Forms Agent)
- Route creation (that's the Structure Agent)

## Online Research Protocol
When researching database patterns:
1. WebSearch for PostgreSQL / Supabase schema best practices
2. Validate against existing `resources/09-database-schema-patterns.md`
3. Hand new patterns to Resource Merger targeting `resources/09-database-schema-patterns.md`

## Output Protocol
- SQL statements ready to execute
- Updated TypeScript type definitions
- Summary of tables/columns created or modified
