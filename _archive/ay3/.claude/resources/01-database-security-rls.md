# Database Security — Supabase Row Level Security (RLS)

> **Priority: CRITICAL** — Enable and test before any table is exposed to the employee portal.
> Source: https://supabase.com/docs/guides/database/postgres/row-level-security

---

## Core Rules

### 1. Always Enable RLS on Every Table
```sql
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
-- Repeat for every table. No exceptions.
```

### 2. Use `(SELECT auth.uid())` — Not `auth.uid()` Directly
Wrapping in SELECT allows PostgreSQL to cache the result per-statement (not per-row), giving 100x+ speedup on large tables.
```sql
-- WRONG (re-evaluates per row)
CREATE POLICY "own_rows" ON employees USING (user_id = auth.uid());

-- CORRECT (cached per statement)
CREATE POLICY "own_rows" ON employees USING (user_id = (SELECT auth.uid()));
```

### 3. Index Every Column Used in RLS Policies
Missing indexes are the #1 RLS performance killer.
```sql
CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_documents_employee_id ON documents(employee_id);
```

### 4. Never Trust `user_metadata` for RBAC
`user_metadata` lives in the JWT and can be modified client-side. Use server-side Auth Hooks to inject custom claims for roles.
```sql
-- WRONG — user can modify their own metadata
CREATE POLICY "admin_only" ON employees USING (
  auth.jwt()->'user_metadata'->>'role' = 'admin'
);

-- CORRECT — use app_metadata (server-managed) or custom claims
CREATE POLICY "admin_only" ON employees USING (
  (auth.jwt()->'app_metadata'->>'role') = 'admin'
);
```

### 5. Always Scope Policies to `authenticated` Role
```sql
CREATE POLICY "select_own_employees" ON employees
  TO authenticated                          -- <-- required
  FOR SELECT
  USING (user_id = (SELECT auth.uid()));
```

### 6. Test Policies via Client SDK — NOT SQL Editor
The SQL Editor runs as `postgres` role and bypasses RLS entirely. Test with actual Supabase client:
```typescript
// This correctly tests RLS
const { data, error } = await supabase.from('employees').select('*')
```

### 7. Default-Deny Pattern
When RLS is enabled with no policies, all access is denied. Start with deny-all, add policies explicitly.
```sql
-- After enabling RLS, add only what's needed:
-- SELECT: employees can read their own record
-- INSERT: only via service role or admin
-- UPDATE/DELETE: owner-only or admin-only
```

---

## RBAC Pattern (Role-Based Access Control)

Use custom JWT claims via Auth Hooks for role data:
```sql
-- In Supabase Dashboard → Auth → Hooks → Custom Access Token Hook
-- Inject role into app_metadata server-side

-- Policy using injected role:
CREATE POLICY "admin_full_access" ON employees
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "employee_read_own" ON employees
  TO authenticated
  FOR SELECT
  USING (id = (SELECT auth.uid()));
```

---

## Sources
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv
- https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac
