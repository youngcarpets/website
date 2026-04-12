# Ontario Accounting Rules — YCI Reference

> **Last updated:** 2026-04-06
> **Jurisdiction:** Ontario, Canada
> **Business:** Young Carpets Inc. — commercial flooring contractor
> **Business HST#:** `131118986 RT001` (immutable — only the user edits this)
>
> **Source agent:** Financial agent research dispatch on 2026-04-06. Supersedes any earlier Australian/GST/ABN guidance from prior agent reports — those got the jurisdiction wrong.

## Section 1 — HST basics

- Ontario HST rate is **13%** (5% federal GST portion + 8% Ontario provincial portion, harmonized into a single tax line). Charge HST as a single 13% rate; no need to split federal/provincial on the invoice.
- **Commercial flooring sales are taxable.** Carpet, LVT, hardwood, tile, sheet, rubber, epoxy, sports flooring, stair nosings, treads, broadloom — all taxable supplies.
- **Installation labour is taxable.** When YCI installs flooring, the labour portion is taxable at HST 13%, same as the materials.
- **Single-supply rule:** when YCI sells materials + installation as one bundled supply (typical commercial job), the entire amount is taxable at HST 13%. Do not split it.
- **Three categories of supplies:**
  - **Taxable** — HST charged at 13%. The default for YCI.
  - **Zero-rated** — HST charged at 0%, but YCI can still claim ITCs on inputs. Examples: exports out of Canada, certain medical/agricultural goods.
  - **Exempt** — no HST charged, and YCI cannot claim ITCs on inputs. Examples: most financial services, residential rent. Generally not relevant to flooring.
- **Place-of-supply rule (inter-provincial):** if YCI installs flooring in another province (rare), the destination province's tax rate applies. Most jobs are in Ontario so HST 13% always.
- **Edge cases when HST may not apply:** exports out of Canada (zero-rated), certain Status Indian sales delivered on reserve (see Section 9), inter-provincial supplies to non-harmonized provinces.

## Section 2 — HST registration + small supplier threshold

- **Small supplier threshold:** $30,000 in worldwide taxable revenue over the **last 4 consecutive calendar quarters** (not a calendar year). Once you exceed it, you must register and start charging HST.
- **YCI is well over the threshold** and is a registered HST collector — always charge HST on every taxable supply.
- **Vendor side:** YCI's suppliers may or may not be registered. If a vendor is a small supplier under $30k they are NOT required to register, and they will NOT have an HST number. In that case YCI cannot claim an ITC on purchases from that vendor — you still pay them, but the cost flows through as a regular business expense.
- **Voluntary registration:** small suppliers can voluntarily register (so they can claim ITCs themselves). Not relevant to YCI.

## Section 3 — Input Tax Credits (ITCs)

ITCs are how YCI recovers the HST it pays on its own business purchases. This is the single biggest reason the schema must store vendor HST numbers.

- **What you can claim:** HST paid on purchases used in commercial activity (carpet rolls from suppliers, tools, vehicle fuel, office supplies, subcontractor invoices, etc.).
- **CRA Regulation 3500 — tiered documentation requirements** (the rules for what counts as a valid ITC document):

| Purchase total (incl. HST) | Required information |
|---|---|
| **Under $30** | Supplier name, date, total amount paid |
| **$30 to under $150** | Above + supplier's HST number, total HST paid OR statement that HST is included |
| **$150 and over** | Above + buyer's name, terms of payment, description sufficient to identify the supply |

- **Why this matters for the schema:** every bill from a vendor at or above $30 must record the vendor's HST number. If YCI claims an ITC on a $5,000 carpet purchase and the vendor's HST# was never captured, CRA can disallow the entire ITC on audit. Schema should store `vendors.hst_number` AND snapshot it onto the bill at write time so historical accuracy is preserved if the vendor record is later edited.
- **Time limit:** ITCs must be claimed within **4 years** of the end of the reporting period in which the HST became payable.
- **Common ITC mistakes:** missing vendor HST#, missing vendor name, claiming ITC on personal-use items, claiming ITC on exempt purchases.

## Section 4 — Required information on a tax invoice (CRA-mandated)

When YCI issues an invoice to a customer, what's printed on it must satisfy the same Reg 3500 tiered rules so the customer can claim their own ITC.

- **Supplier name** — `Young Carpets` (or full legal name)
- **Supplier address**
- **Supplier HST registration number** — `131118986 RT001` — must appear on every tax invoice ≥ $30
- **Date of invoice**
- **Total amount paid or payable**
- **For invoices ≥ $30:** also show the **HST amount** as a separate line OR a clear statement "HST included". Best practice: show subtotal + HST + total separately.
- **For invoices ≥ $150:** also show the **buyer's name**, **terms of payment**, and a **description sufficient to identify each property/service supplied**.

YCI invoices will almost always be over $150, so all fields are mandatory in practice.

## Section 5 — Holdback / lien retention (Ontario Construction Act)

This is the most YCI-specific rule and the one most likely to be missed. Construction work in Ontario is governed by the **Construction Act** (RSO 1990 c.C.30, formerly the Construction Lien Act).

- **10% statutory holdback.** The customer (owner) is required by law to withhold 10% of the contract price as holdback until the lien period expires.
- **Holdback is calculated on the PRE-HST subtotal**, not the HST-inclusive total. HST is still charged on the full subtotal — only the cash payable is reduced.
- **Lien period: 60 days from substantial performance** (or from the date of last supply, whichever applies). Customer can release the holdback after the 60-day window passes with no liens registered against the project.
- **How to show on a progress invoice:**
  ```
  Subtotal:           $10,000.00
  HST 13%:             $1,300.00
  Total:              $11,300.00
  Less holdback (10%): -$1,000.00   ← 10% of pre-HST subtotal
  Net payable now:     $10,300.00
  ```
  The customer pays $10,300 now and retains $1,000 until lien period expires.
- **Schema implications:**
  - Invoice header needs `holdback_cents` (computed: 10% of subtotal_cents, default 0)
  - Invoice header needs `holdback_released_at` (timestamptz, nullable — set when customer releases)
  - Invoice header needs `net_payable_cents` (computed: total_cents - holdback_cents) — useful for "amount due now"
  - Holdback should be optional per invoice (small jobs may not have holdback) — driven by a `holdback_applies` boolean or just by setting `holdback_cents = 0`
- **Prompt payment legislation (Construction Act amendments effective 2019):**
  - **Owner must pay GC (general contractor) within 28 days** of receipt of a "proper invoice"
  - **GC must pay subcontractor within 7 days** of receiving payment from owner (flow-down)
  - "Proper invoice" has specific required fields — same as CRA Reg 3500 + project description + period of supply
  - Disputes go to **adjudication** (interim binding decisions) under the Act
  - ⚠️ Flow-down rules apply if YCI is a subcontractor on a larger project, not when YCI is the prime/direct supplier
- **Lien rights:** if the customer doesn't pay, YCI can register a construction lien against the property — but only within the 60-day window. After that, lien rights expire.

## Section 6 — Payment terms

- **Net 30** is the most common in commercial flooring in Ontario.
- **Net 45 / Net 60** for government and large general contractors (sometimes longer).
- **2/10 Net 30** (2% discount for payment within 10 days) — uncommon in flooring but valid.
- **Late payment interest** can be charged if it's in the contract, capped by **Criminal Code section 347** (cannot exceed 60% effective annual rate — well above any reasonable late fee).
- **Default for YCI:** Net 30 stored in `document_settings.default_payment_terms_days = 30`. Customer-specific override on the customer record.

## Section 7 — Record keeping (CRA)

- **6-year retention.** Keep all records (invoices, bills, payments, contracts) for 6 years from the end of the last tax year they relate to.
- **Electronic records are acceptable** as long as they're readable and accessible.
- **Implication for schema:** never **hard-delete** invoices, bills, or payments. Use **soft-delete** (`deleted_at timestamptz NULL`) so the audit trail survives. Hard delete is only acceptable for never-issued draft data.
- ⚠️ **Storing CRA-relevant records on US-hosted cloud (e.g. Supabase US region) may require written permission from CRA** under section 286 of the Excise Tax Act. YCI should confirm with their accountant whether the current Supabase region is acceptable, and consider Canadian-region hosting if not.

## Section 8 — Money handling rules

- **All money in integer cents.** Postgres `BIGINT`, never `NUMERIC` and never `FLOAT`. Avoids float drift.
- **Per-line HST calculation, not header-level.** Compute HST on each line, store it in `tax_amount_cents`, then sum the lines for the header total. Do not compute HST as `subtotal × 0.13` at the header level — that produces different totals due to rounding and breaks reconciliation.
- **Rounding: half-up to the nearest cent.** Standard rounding, not banker's rounding. CRA accepts standard rounding.
- **Tax-exclusive entry by default.** User enters $100, HST calculated at $13, total $113. Tax-inclusive entry (user enters $113 → system extracts $13 HST) is also valid but should be a per-quote/per-invoice toggle (`tax_inclusive boolean default false`).
- **HST shown as a separate line** on every invoice ≥ $30 (CRA requirement).

## Section 9 — Special cases for commercial flooring contractors

- **Materials only, no installation:** straight HST on materials.
- **Materials + installation bundled:** single supply rule — full amount taxable at HST 13%.
- **Subcontracted installation:** if YCI hires a subcontractor to install, the subcontractor's invoice to YCI has HST that YCI claims as ITC; YCI charges its own customer HST on the full bundled price.
- **Government customers (federal, provincial, municipal, MUSH sector — Municipal/Universities/Schools/Hospitals):** GENERALLY all taxable at HST 13%. The federal government no longer has any general HST exemption (changed years ago). Provincial and municipal governments are taxable. Charge HST on all government invoices.
- **Status Indians delivered on reserve:** HST may not apply for tangible goods physically delivered to a reserve for an Indian or band. ⚠️ For services performed on reserve the rules are more nuanced — case-by-case, consult CRA Technical Information Bulletin B-039.
- **US / export customers:** zero-rated supplies. Charge 0% HST. Customer is in the US, goods leave Canada — file as zero-rated, claim ITCs as normal.
- **Inter-provincial customers:** different province's tax rate applies (place-of-supply rule). Rare for YCI; flag to accountant if it comes up.

## Section 10 — Schema implications (mapping to AY3 tables)

This section maps each rule above to a specific column or table in the upcoming `0001_quote_invoice_foundation.sql` migration.

### `customers` table
- **NO `tax_number` column.** Customers don't supply YCI with their HST# — only vendors do.
- Optional flags for the edge cases above:
  - `is_export_customer boolean default false` — drives zero-rated tax behavior
  - `is_on_reserve boolean default false` — drives potential HST-exempt treatment for tangible goods delivered on reserve
- Drop the existing `abn` column (Australian terminology, wrong jurisdiction).
- Add `customer_type` enum: `designer | contractor | government | facility_manager | other`.

### `vendors` table (NEW)
- `id uuid PK`
- `name text NOT NULL`
- `hst_number text NULL` — **nullable** because Ontario small suppliers under $30k aren't required to have one. App-level: warn (don't block) when claiming an ITC against a bill from a vendor with no HST#.
- `address` block (street, city, province, postal_code, country default 'CA')
- `contact_name`, `email`, `phone`
- `notes`
- `is_active boolean default true`
- `created_at`, `updated_at`, `deleted_at`

### `tax_rates` table (extend existing)
Seed three rows:
- `HST 13%` — id used as default for taxable supplies, `rate = 0.1300`
- `Zero-rated 0%` — for exports / on-reserve goods, `rate = 0.0000`
- `Exempt 0%` — for any exempt supplies, `rate = 0.0000`
- Add a `kind` enum column to distinguish: `taxable | zero_rated | exempt` — important because zero-rated and exempt look the same on the rate but have different ITC implications for YCI's bookkeeping.

### `quotes` and `invoices` headers
- `subtotal_cents bigint not null` — sum of line subtotals (pre-tax)
- `tax_total_cents bigint not null` — sum of line HST amounts
- `total_cents bigint not null` — `subtotal_cents + tax_total_cents`
- `holdback_cents bigint not null default 0` — typically 10% of subtotal_cents for construction jobs
- `holdback_released_at timestamptz null` — set when customer releases the holdback
- `net_payable_cents bigint generated always as (total_cents - holdback_cents) stored` — what the customer owes now
- `tax_inclusive boolean not null default false` — entry mode toggle
- `currency char(3) not null default 'CAD'` — future-proof, single value for now

### `quote_lines` and `invoice_lines`
- `tax_rate_id uuid FK not null` — required, points to `tax_rates`
- `tax_amount_cents bigint not null` — computed at write time, stored
- `line_subtotal_cents bigint not null` — qty × unit_price (pre-tax)
- `line_total_cents bigint not null` — `line_subtotal_cents + tax_amount_cents`

### `bills` table (NEW — for Section 3 ITC tracking, can defer to v2)
- `id uuid PK`
- `vendor_id uuid FK NOT NULL`
- `bill_number text` (vendor's invoice number)
- `bill_date date not null`
- `subtotal_cents bigint not null`
- `tax_total_cents bigint not null` — HST paid to vendor
- `total_cents bigint not null`
- `vendor_hst_number_snapshot text null` — **snapshot** of vendor.hst_number at the time the bill was recorded, for audit immutability
- `itc_claimable boolean generated always as (vendor_hst_number_snapshot is not null and total_cents >= 3000) stored` — flags whether the bill meets Reg 3500 documentation requirements (≥$30 in cents)
- Standard audit columns

### `document_settings` table
- `company_name text` — `YCI`
- `company_tax_number text` — **`131118986 RT001`** — IMMUTABLE
- `default_payment_terms_days int default 30`
- `default_holdback_percent numeric(5,2) default 10.00` — Construction Act default
- Address, phone, email, logo placeholders for now

### `payments` table
- Standard. No HST-specific fields needed (payments are post-tax cash receipts).

## Top 3 rules YCI must never get wrong

1. **Store vendor HST# on every bill ≥ $30.** Without it, CRA disallows the ITC on audit (Reg 3500 tiered documentation). Snapshot the value onto the bill so it's immutable.
2. **Holdback is 10% of the pre-HST subtotal.** HST is still charged on the full subtotal. The schema needs `holdback_cents` + `holdback_released_at` — do not reduce the HST calc to compensate.
3. **Per-line HST with half-up rounding, integer cents.** Computing HST at the invoice header level diverges from sum-of-lines and breaks reconciliation. Always per-line, always cents, always half-up.

## Uncertain items (⚠️)

1. **Status Indians on reserve — services vs goods.** Tangible goods delivered on reserve are clear; services performed on reserve are case-by-case. Consult CRA TIB B-039 or YCI's accountant before assuming exemption.
2. **CRA permission for US-hosted cloud records.** Section 286 of the Excise Tax Act may require written permission to keep records outside Canada. Confirm with YCI's accountant whether the current Supabase region is acceptable.
3. **Subcontractor flow-down (7-day prompt payment).** Applies when YCI is a subcontractor on a larger project, not when YCI is the prime contractor. Schema doesn't need to encode this directly, but the workflow logic should flag YCI's role on each job.

## Sources

- **Excise Tax Act (Canada), Part IX** — HST/GST rules
- **Input Tax Credit Information (GST/HST) Regulations, SOR/91-45** — Reg 3500 tiered documentation
- **CRA GST/HST Memorandum 8.4** — documentary requirements for ITCs
- **CRA GST/HST Memorandum 3.3** — place of supply
- **CRA Guide RC4022** — General Information for GST/HST Registrants
- **Construction Act, RSO 1990 c.C.30** — Ontario holdback, lien rights, prompt payment, adjudication
- **Criminal Code (Canada) section 347** — interest rate cap (60% effective annual)
- **CRA Technical Information Bulletin B-039** — Status Indian / on-reserve sales
- **Excise Tax Act section 286** — record retention location requirements

---

> **Note for future agents:** This file is canonical for Ontario accounting rules in the AY3 project. If you need to update it, append rather than overwrite (resource-merger pattern). Cite the source bulletin/section when adding new rules.
