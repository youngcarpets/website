# AY3 Portal — Project Plan

## Overview
Staff portal built with SvelteKit + Svelte 5 + TypeScript + Tailwind v4 + Supabase.
Modular architecture: each feature is a self-contained module in `src/lib/modules/`.

## Version History
| Tag | Milestone |
|-----|-----------|
| v1.0.0 | Fresh start — all connections verified, basic CRUD working |
| v1.1.0 | Foundation infrastructure — shared UI, CRUD factory, Supabase SSR |
| v1.2.0 | Employees migrated to module pattern — Superforms, Zod, services |

---

## Phase 3: Customers Module (NEXT)
- Create `customers` table in Supabase (name, contact, email, phone, ABN, addresses, payment terms)
- Build module: schema, service, CustomerForm, CustomerTable, CustomerSelect (typeahead)
- Routes: `/customers`, `/customers/new`, `/customers/[id]`
- Tag: `v1.3.0`

## Phase 4: Invoicing Module
- Create 5 tables: document_settings, tax_rates, number_sequences, invoices, line_items
- Create `next_invoice_number()` RPC with row-level locking
- Build module: InvoiceForm (composed from CustomerSelect + LineItemsEditor + TotalsSummary), InvoiceTable, InvoiceDetail
- Status workflow: draft → sent → viewed → partial → paid | void
- Print stylesheet for browser PDF export
- Routes: `/invoices`, `/invoices/new`, `/invoices/[id]`, `/invoices/[id]/edit`
- Tag: `v2.0.0`

## Phase 5: Polish & Settings
- Settings page: company info, tax rates CRUD, invoice defaults, products catalog
- Dashboard overhaul: outstanding totals, overdue count, recent invoices
- Move employees to `/employees` route
- Navbar: Dashboard | Invoices | Customers | Employees | Settings
- Tag: `v2.1.0`

---

## Future Modules (same pattern)
- **Quoting** — `modules/quotes/`, shares line_items table, quote→invoice conversion via RPC
- **Reporting** — Revenue charts, outstanding aging, customer analysis
- **Auth** — Supabase Auth for staff login, proper RLS with user context
- **Animation** — See `.claude/reference/animation-patterns.md` for OOP animation system

## Tech Reference
See `.claude/INDEX.md` for the full resource library.
