# Error Check Findings — 2026-04-08

> Output of error-check agent run after the v1.24.x refactor pass.
> **All 11 remaining findings are portal/DB-side.** Parked because user is focused on client-facing YC website only right now (2026-04-08).
> Pick this up when DB work resumes.

## Already fixed (auto-applied 2026-04-08)

- ✅ **L4** — `formData.get('data') as string` → type-guarded with `typeof rawData !== 'string'` check. v1.24.34 (`cf172e6`). Touched: `routes/(public)/invoices/new/+page.server.ts:34`, `routes/(public)/invoices/[id]/edit/+page.server.ts:51`.

## Deferred LOWs (not auto-fixed)

- **L1** — Unused destructured var in invoice create. Depends on H2; fix together.
- **L2** — `as Row[]` casts on Supabase data in `crud.ts`. Codebase-wide pattern, would require Zod validation at boundaries. Architectural decision.
- **L3** — `ascending: options.ascending ?? false` default. All callers pass `true`. Changing the default could silently flip behavior on future callers — leave as-is.
- **L5** — `customerSchema` email/abn `.optional().or(z.literal(''))` chain. Cosmetic. Cleaner as `z.union([z.literal(''), z.string().email()]).optional()`.

---

## HIGH (DB-side, parked)

### H1. Invoice status enum drift
- **Files:** `lib/modules/invoices/services/invoice.service.ts:8`, `lib/modules/invoices/types/invoice.types.ts:13`
- **Problem:** Two sources of truth disagree: service has `['draft','sent','partially_paid','paid','overdue','void']`, types has `'draft'|'sent'|'viewed'|'partial'|'paid'|'void'`. `partially_paid` vs `partial`, `overdue` vs `viewed`.
- **Risk:** Runtime guard accepts strings the TS type rejects. UI dropdowns built off the type write strings the service rejects silently. Reports/filters have phantom buckets.
- **Fix:** Delete `InvoiceStatus` from `invoice.types.ts`, re-export `INVOICE_STATUSES` + `InvoiceStatus` from the service. Verify against actual Postgres enum / current DB rows before picking which set wins.

### H2. Invoice `create()` ignores line-items insert failure
- **File:** `lib/modules/invoices/services/invoice.service.ts:74-82`
- **Problem:** If invoice insert succeeds but line_items insert fails, the function returns `{ data: invoice, error: lineItemsError }`. The form action sees the error and surfaces 500 — but the invoice row already exists with fake totals and zero line items. User retries → creates a second orphan.
- **Risk:** Silent data corruption in money path. Stored totals don't match line items. Orphans accumulate.
- **Fix:** Either (a) Postgres function for atomicity, or (b) on `lineItemsError`, delete the just-inserted invoice before returning the error.

### H3. Invoice `update()` non-atomic empty window
- **File:** `lib/modules/invoices/services/invoice.service.ts:85-121`
- **Problem:** UPDATE invoice header → DELETE all line_items → INSERT new line_items. Not transactional. If final insert fails, invoice has new totals + zero items. Concurrent reads between delete and insert see an empty invoice.
- **Risk:** Same money-integrity class as H2. Mitigated by edit-only-on-draft guard but not eliminated.
- **Fix:** RPC with real transaction. Short-term: log loudly + flag invoice on failure rather than silent 500.

### H4. `customerService.search` ilike wildcard injection
- **File:** `lib/modules/customers/services/customer.service.ts:19-28`
- **Problem:** `.ilike('name', \`%${query}%\`)` interpolates raw user input. `%` and `_` become wildcards, `\` escapes. `_` matches every single-char, `%%%` is a cheap DoS on big tables. Not classic SQLi (PostgREST parameterizes the value) but still abusable.
- **Fix:**
  ```ts
  const safe = query.replace(/[\\%_]/g, (c) => '\\' + c);
  .ilike('name', `%${safe}%`)
  ```

---

## MED (DB-side, parked)

### M1. `hooks.server.ts` no dual-client / no cookie auth
- **Files:** `hooks.server.ts`, `lib/server/supabase.ts`
- **Problem:** Only uses `PUBLIC_SUPABASE_ANON_KEY`. No service-role client, no `@supabase/ssr`, no cookie propagation, no per-request user session. Single client shared across requests.
- **Risk:** Works today (no auth) but blocks any future RLS using `auth.uid()` (will see NULL). No session isolation.
- **Approach:** Adopt `@supabase/ssr` `createServerClient` with cookie handlers per request. Reference ADR-003.

### M2. Invoice `[id]/+page.server.ts` leaks raw Supabase error messages
- **File:** `routes/(public)/invoices/[id]/+page.server.ts:23,29,35`
- **Problem:** `fail(500, { error: err.message })` returns raw Postgres/Supabase strings. Edit page already hardened to friendly messages — detail page didn't get the treatment.
- **Risk:** Exposes table names, constraint names, RPC internals to caller.
- **Fix:** Match the edit page pattern: log raw, return generic.

### M3. customers/employees update + new pages leak raw DB error via `message()`
- **Files:** `routes/(public)/customers/[id]/+page.server.ts:36`, `routes/(public)/employees/[id]/+page.server.ts:35`, `routes/(public)/customers/new/+page.server.ts:18`, `routes/(public)/employees/new/+page.server.ts:18`
- **Problem:** `message(form, updateError.message, ...)` — raw Supabase text shown in UI.
- **Fix:** Log raw, show friendly. E1 error-code matching for unique constraint violations etc., generic fallback.

### M4. taxRates fetch error swallowed
- **Files:** `routes/(public)/invoices/new/+page.server.ts:54`, `routes/(public)/invoices/[id]/edit/+page.server.ts:71`
- **Problem:** `const { data: taxRates } = await invoiceService.getTaxRates(locals.supabase);` discards the error branch. If `getTaxRates` fails, `taxRates` is `[]` and the invoice saves with `tax_rate: 0` for every line — under-collecting GST/HST silently.
- **Risk:** **Real Ontario/AU bookkeeping problem.** Silent tax-rate=0 = real audit risk.
- **Fix:** `if (error || !taxRates.length) return fail(500, { error: 'Tax rates unavailable — cannot save invoice' });`

### M5. Invoice `getById` returns success-with-error shape
- **File:** `lib/modules/invoices/services/invoice.service.ts:31-51`
- **Problem:** On invoice-fetch success but line-item-fetch failure, returns `{ data: invoice, lineItems: [], error: lineItemsError }`. Caller at `[id]/+page.server.ts:8` only checks `result.error || !result.data` → surfaces line-item failure as a 404.
- **Fix:** Distinct error fields, or let caller distinguish load failure vs missing invoice.

### M6. `crud.ts` `.single()` conflates not-found with real errors
- **File:** `lib/services/crud.ts:48-59`
- **Problem:** `.single()` returns `PGRST116` on zero matches — that's a not-found, not a real error. Conflated and surfaced as 500-ish state.
- **Affects:** All 3 modules' detail pages.
- **Fix:** Use `.maybeSingle()` — returns `{ data: null, error: null }` on no rows.

### M7. `state_referenced_locally` Svelte 5 warnings
- **Files:**
  - `lib/modules/customers/components/CustomerForm.svelte:21,23`
  - `lib/modules/employees/components/EmployeeForm.svelte:23`
  - `lib/modules/invoices/components/InvoiceForm.svelte:50,51`
- **Problem:** Svelte 5 warns props captured once. Today edit pages always remount fresh forms, so it works. Inline editing or swapping form data without remount would silently show stale values.
- **Fix:** Wrap in `$derived(() => ...)` or use `$props()` getter closure per Svelte's warning link.

---

## Things explicitly checked and OK

- Superforms/Zod v4 adapter usage — correct everywhere
- Svelte 5 runes — correct
- `$effect` cleanup in timers (YcModalCarpet, YcModalSheet, YcProductModal) — all return cleanup
- `{#each}` key directives — acceptable
- XSS — no `{@html}` on user data
- CSRF — SvelteKit default, not bypassed
- Redirect after POST — all form actions redirect 303 on success
- `fail()` on validation — all form actions return fail(400) on invalid
- Protected SVG/animation code — intact
- YC locked parallax — not touched
- svelte-check — 0 errors / 17 warnings (known intentional set)
