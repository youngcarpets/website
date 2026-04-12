# Known Deferred Fixes

> Last updated: 2026-04-06
> Purpose: track real issues that error-check agents have flagged but that we **intentionally postponed** because they require coordinated work (schema migration, large refactor, etc.). Future agents should NOT re-flag these — they're already known. Future agents SHOULD apply them when the listed gating event happens.

---

## 1. Money math: float → integer cents migration

**What's wrong:**
- `my-portal/src/lib/utils/money.ts` uses floating-point arithmetic with `round2()` instead of storing/computing money as integer cents (BIGINT).
- All consumers (`invoice.service.ts`, `TotalsSummary.svelte`, `LineItemsEditor.svelte`, etc.) follow the float pattern.
- Per `.claude/reference/ontario-accounting.md` section 8, money must be integer cents only — no float.
- On invoices with 10+ lines the float drift accumulates and the displayed total can diverge from the per-line sum.

**Why deferred:**
- The upcoming `0001_quote_invoice_foundation.sql` migration is going to introduce `*_cents BIGINT` columns on all the new tables anyway. Refactoring `money.ts` now would force a follow-up refactor when the migration lands.
- Want to do the float→cents refactor in a single coordinated chunk **after** the new schema is live, so we can drop the legacy `subtotal NUMERIC` columns at the same time.

**Gating event:** `0001_quote_invoice_foundation.sql` applied to live DB and `database.ts` regenerated.

**Files to touch when ready:**
- `my-portal/src/lib/utils/money.ts` — rewrite signatures to take/return `number` (cents)
- `my-portal/src/lib/modules/invoices/services/invoice.service.ts` — drop `round2` usage, use cents end-to-end
- `my-portal/src/lib/modules/invoices/components/TotalsSummary.svelte` — recompute from cents
- `my-portal/src/lib/modules/invoices/components/LineItemsEditor.svelte` — display cents/100 with formatter
- `my-portal/src/lib/modules/invoices/schemas/invoice.schema.ts` — money fields become integer with `.int()`
- New shared helper at `my-portal/src/lib/modules/_shared/money.ts` per the ontario-accounting reference

---

## 2. `InvoiceForm.svelte` manual-JSON anti-pattern → Superforms

**What's wrong:**
- `my-portal/src/lib/modules/invoices/components/InvoiceForm.svelte:62-83` uses `handleSubmit()` with manual `fetch()` and `JSON.stringify()`.
- Bypasses `use:enhance`, breaks progressive enhancement, breaks Superforms client validation, makes the server-side validation we just added unreachable from the form's own pipeline.

**Why deferred:**
- This is a substantial UI refactor (~150 lines) and the file is also slated for the upcoming `quotes/invoices` rebuild as part of the schema migration work (`lib/modules/quotes/components/QuoteForm.svelte` will be the new template, then `InvoiceForm` adopts the same pattern).
- Doing it now would mean doing it twice.

**Gating event:** Either (a) the schema migration ships and we rebuild invoice forms wholesale, OR (b) a critical bug shows up in InvoiceForm that forces us to fix it sooner.

**Files to touch when ready:**
- `my-portal/src/lib/modules/invoices/components/InvoiceForm.svelte`
- `my-portal/src/routes/(public)/invoices/new/+page.server.ts` — re-wire to `superValidate(zod(invoiceSchema))` instead of the current `safeParse` workaround
- `my-portal/src/routes/(public)/invoices/[id]/edit/+page.server.ts` — same
- Use the existing `EmployeeForm.svelte` / `CustomerForm.svelte` as the reference pattern (both already on Superforms v2 + zod4 adapter)

---

## 3. Drop `customers.abn` column (Australian terminology, wrong jurisdiction)

**What's wrong:**
- `my-portal/src/lib/types/database.ts` lines ~36, 66, 81 still type the `abn` column on `customers`.
- `my-portal/src/lib/modules/customers/schemas/customer.schema.ts` includes `abn: z.string().optional()`.
- `my-portal/src/lib/modules/customers/components/CustomerForm.svelte` lines ~66-71 render an ABN input.
- YCI is in Ontario, Canada — there is no ABN. This is leftover Australian assumption from the very early agent reports. Per `.claude/reference/ontario-accounting.md` section 10, customers do NOT need a tax_number field at all (vendors do).

**Why deferred:**
- Removing the column from code now would break against the live DB which still has the column.
- The fix has to land in a coordinated migration: drop the column AND update code AND regenerate types in one chunk.
- Will be part of `0001_quote_invoice_foundation.sql`.

**Gating event:** `0001_quote_invoice_foundation.sql` applied (the migration's first DDL statement should be `ALTER TABLE customers DROP COLUMN abn`).

**Files to touch when ready:**
- `0001_quote_invoice_foundation.sql` — `ALTER TABLE customers DROP COLUMN abn`
- Regenerate `my-portal/src/lib/types/database.ts`
- `my-portal/src/lib/modules/customers/schemas/customer.schema.ts` — remove `abn` field, add `customer_type` enum + `is_export_customer` + `is_on_reserve` flags per ontario-accounting section 10
- `my-portal/src/lib/modules/customers/components/CustomerForm.svelte` — remove ABN input, add type selector

---

## 4. `invoice.service.ts:update()` race condition

**What's wrong:**
- `update()` does: update header → delete line items → re-insert line items as three separate Supabase calls.
- A concurrent reader between the delete and re-insert sees an invoice with no lines.
- Not atomic.

**Why deferred:**
- The proper fix is a Postgres `RPC` function `update_invoice(id uuid, payload jsonb)` that runs the whole update in one transaction.
- That RPC will be written as part of the schema migration alongside the `convert_quote_to_invoice()` and `recompute_invoice_totals()` triggers.
- Patching it in TS now would still leave a race window.

**Gating event:** `0001_quote_invoice_foundation.sql` applied with the new RPC functions.

**Files to touch when ready:**
- `0001_quote_invoice_foundation.sql` — add `update_invoice(id, payload)` RPC
- `my-portal/src/lib/modules/invoices/services/invoice.service.ts:update()` — call `supabase.rpc('update_invoice', ...)` instead of three statements

---

## 5. iOS device-tilt parallax — PARKED (causes "Access Motion and Orientation" popup)

**Status:** Disabled in code at `+page.svelte:129` via a `false && ` short-circuit on the iOS branch. Desktop pointer parallax and the floor-plan rAF lerp loop still run normally — only the device-tilt path is gated off.

**Confirmed cause (A/B tested 2026-04-09):**
- Tapping the "Proudly Canadian" maple-leaf badge in the YC hero on iOS triggered the system "Access Motion and Orientation" permission popup.
- Root cause: the badge was the tap target for `DeviceOrientationEvent.requestPermission()` (the iOS 13+ gating call) so the device-tilt parallax could be enabled. Apple requires a user gesture before granting motion access — that gesture happened to be "tap the badge that looks like a static label."
- Verified by short-circuiting the iOS branch in the `$effect` and re-testing on iPhone — popup gone, no other regressions. So the parallax flow IS the source, not a side-effect.

**Why parked (not deleted):**
- The user **likes** the device-tilt parallax effect itself.
- The user **does not want** to ship a feature that prompts a permission popup on a tap that looks like a static label, even if iOS caches the response after the first prompt.
- Disabling rather than deleting keeps the door open for a future workaround. The phone-side agent's wholesale strip on `claude/fix-canadian-popup-p22kc` (`9d44089`) was rejected for that reason — it deleted the parallax flow instead of parking it.

**Gating event for re-enabling:**
- A redesign that moves the `requestPermission()` gesture OFF the badge to a dedicated "enable motion parallax" element somewhere else on the page (a settings pill, a footer toggle, an "experimental effects" menu, etc). The badge then stays purely decorative and the popup is gated behind an explicit, clearly-labeled opt-in.
- The user does not actively expect to find such a workaround — leans toward leaving this parked indefinitely.

**Files to touch when re-enabling:**
- `my-portal/src/routes/young-carpets/+page.svelte` line ~129 — delete the `false && ` from the iOS branch condition. The original logic is intact under the short-circuit.
- New dedicated UI element for the gesture target (not the maple badge) — TBD on design.
- Reference fix (do NOT cherry-pick — it strips the parallax wholesale):
  - `git show 9d44089` on branch `claude/fix-canadian-popup-p22kc`
- Mirrors the older v1.24.28 footer-badge fix (same root cause, different element) — search git log for context.

---

## How to use this file

- **Future error-check agents:** before flagging any of the above, check this file first. If it's listed here with a gating event, do NOT re-flag it. Note instead in your report: "see known-deferred-fixes.md item N."
- **When a gating event happens:** the agent doing that work is responsible for finding everything in this file gated on that event and either fixing it OR moving its entry to a follow-up section.
- **When something is fixed:** delete its section entirely. This file is for OPEN deferred items only.
