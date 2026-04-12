# Database Schema Patterns — PostgreSQL + Supabase

> **Priority: MEDIUM** — Early schema decisions are hard to undo. Design for the final product.
> Sources: https://supabase.com/docs/guides/database
>          https://cybertec-postgresql.com/en/index-your-foreign-key/

---

## Universal Table Template

Every table in the AY3 portal should follow this baseline:

```sql
CREATE TABLE table_name (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID REFERENCES organizations(id) ON DELETE CASCADE,  -- multi-tenancy prep
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,    -- audit trail

  -- table-specific columns here

  -- constraints
  CONSTRAINT check_something CHECK (amount >= 0)
);

-- Auto-update updated_at on every row change
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON table_name
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- Enable RLS immediately
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Index FK columns
CREATE INDEX idx_table_name_org_id ON table_name(org_id);
CREATE INDEX idx_table_name_created_by ON table_name(created_by);
```

---

## Index Every Foreign Key on the Source Table

PostgreSQL does NOT auto-index source-side foreign keys. Without indexes, constraint checks and JOINs cause full table scans.

```sql
-- employees table references departments
ALTER TABLE employees
  ADD COLUMN department_id UUID REFERENCES departments(id);

-- REQUIRED — index the source column
CREATE INDEX idx_employees_department_id ON employees(department_id);

-- documents table
CREATE INDEX idx_documents_employee_id ON documents(employee_id);
CREATE INDEX idx_documents_created_by ON documents(created_by);
```

---

## Explicit ON DELETE Behavior — Never Leave Implicit

```sql
-- RESTRICT (default safe): prevents deletion of parent if children exist
ALTER TABLE documents ADD CONSTRAINT fk_employee
  FOREIGN KEY (employee_id) REFERENCES employees(id)
  ON DELETE RESTRICT;  -- explicit, not implicit

-- CASCADE: deletes children when parent is deleted
ALTER TABLE line_items ADD CONSTRAINT fk_quote
  FOREIGN KEY (quote_id) REFERENCES quotes(id)
  ON DELETE CASCADE;  -- correct for line items

-- SET NULL: orphans children (use for optional relationships)
ALTER TABLE employees ADD CONSTRAINT fk_department
  FOREIGN KEY (department_id) REFERENCES departments(id)
  ON DELETE SET NULL;  -- employee can exist without a department
```

---

## Planned Schema for Final Product

```sql
-- Core identity
organizations (id, name, abn, address, created_at)
employees (id, org_id, user_id, name, email, role, department_id, created_at, updated_at)
departments (id, org_id, name, manager_id, created_at)

-- Documents
documents (id, org_id, employee_id, title, status, file_url, created_at, updated_at)
-- status: 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'void'

-- Quotes & Invoices
quotes (id, org_id, client_name, status, subtotal, gst_amount, total, issued_at, expires_at)
quote_line_items (id, quote_id, description, qty, unit_price, discount_percent, line_total)
invoices (id, org_id, quote_id, status, due_date, paid_at, subtotal, gst_amount, total)
```

---

## Naming Conventions

| Object | Convention | Example |
|--------|-----------|---------|
| Tables | `snake_case`, plural | `employees`, `line_items` |
| Columns | `snake_case` | `created_at`, `unit_price` |
| Indexes | `idx_{table}_{column(s)}` | `idx_employees_org_id` |
| Foreign keys | `fk_{table}_{ref_table}` | `fk_employees_departments` |
| Check constraints | `chk_{table}_{column}` | `chk_quotes_total_positive` |
| Functions | `snake_case` | `calculate_quote_total()` |
| Enums | `snake_case` type name | `document_status`, `quote_status` |

---

## Use PostgreSQL Enums for Status Fields

```sql
-- Define once, reuse across tables
CREATE TYPE document_status AS ENUM (
  'draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'void'
);

CREATE TYPE quote_status AS ENUM (
  'draft', 'sent', 'accepted', 'rejected', 'expired', 'converted'
);

-- Apply to columns
ALTER TABLE documents ADD COLUMN status document_status NOT NULL DEFAULT 'draft';
ALTER TABLE quotes ADD COLUMN status quote_status NOT NULL DEFAULT 'draft';
```

Note: Matches existing TypeScript types in `my-portal/src/lib/types/common.ts`.

---

## Multi-Tenancy Design (`org_id`)

Even if single-tenant now, add `org_id` to every table:
```sql
-- Every business-data table gets org_id
-- This enables future SaaS multi-tenancy without schema rewrites
-- Also enables clean RLS policies:

CREATE POLICY "org_isolation" ON employees
  TO authenticated
  USING (org_id = (SELECT (auth.jwt()->'app_metadata'->>'org_id')::uuid));
```

---

## Generated Column Example (Useful for Totals)

```sql
-- Auto-calculate line_total from qty and unit_price (minus discount)
ALTER TABLE quote_line_items
  ADD COLUMN line_total NUMERIC(10,2) GENERATED ALWAYS AS (
    ROUND(qty * unit_price * (1 - discount_percent / 100), 2)
  ) STORED;
```

---

## Sources
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://cybertec-postgresql.com/en/index-your-foreign-key/
- https://www.bytebase.com/blog/top-database-schema-design-best-practices/
- https://wiki.postgresql.org/wiki/Database_Schema_Recommendations_for_an_Application
