# Financial Accuracy — Money Handling in AY3 Portal

> **Priority: MEDIUM-HIGH** — AU tax/invoice calculations must be deterministic.
> IEEE 754 floating-point cannot represent all decimal values exactly (0.1 + 0.2 ≠ 0.3).
> Existing utilities: `my-portal/src/lib/utils/money.ts`

---

## The Core Problem

```typescript
// IEEE 754 floating-point failure cases
0.1 + 0.2                    // 0.30000000000000004 ❌
1.005 * 100                  // 100.49999999999999 ❌ (rounds wrong)
(0.715 * 100) / 100          // 0.7150000000000001 ❌

// This is why the project has round2() in money.ts
```

---

## Use Existing `money.ts` Utilities — Always

Located at: `my-portal/src/lib/utils/money.ts`

```typescript
import { round2, calculateLineTotal, calculateTaxAmount, calculateSubtotal, calculateGrandTotal } from '$lib/utils/money'

// CORRECT — use helpers
const lineTotal = calculateLineTotal(qty, unitPrice, discountPercent)
const tax = calculateTaxAmount(subtotal, 10)  // 10% GST
const total = calculateGrandTotal(subtotal, tax)

// WRONG — never calculate money with raw arithmetic
const lineTotal = qty * unitPrice * (1 - discount / 100)  // floating-point error risk
```

---

## Database Storage — `NUMERIC(10,2)` NOT `FLOAT`

```sql
-- WRONG — floating-point in database
CREATE TABLE line_items (
  unit_price FLOAT,   -- ❌ stores 0.30000000000000004
  total DOUBLE PRECISION  -- ❌ same problem
);

-- CORRECT — exact decimal storage
CREATE TABLE line_items (
  unit_price NUMERIC(10, 2) NOT NULL,   -- exact: max $99,999,999.99
  total      NUMERIC(10, 2) NOT NULL,
  tax_amount NUMERIC(10, 2) NOT NULL,
  CHECK (unit_price >= 0),
  CHECK (total >= 0)
);

-- For high-precision needs (e.g. exchange rates, percentages)
  tax_rate NUMERIC(5, 4)  -- e.g. 0.1000 for 10%
```

---

## AU GST Calculation (10%)

```typescript
// Standard AU GST pattern
const GST_RATE = 10  // percent

// Exclusive GST (price + tax on top)
const subtotal = calculateSubtotal(lineTotals)
const gst = calculateTaxAmount(subtotal, GST_RATE)  // round2(subtotal * 0.10)
const total = calculateGrandTotal(subtotal, gst)

// Inclusive GST (extract tax from GST-inclusive price)
function extractGST(gstInclusiveAmount: number): { excl: number; gst: number } {
  const gst = round2(gstInclusiveAmount / 11)
  const excl = round2(gstInclusiveAmount - gst)
  return { excl, gst }
}
```

---

## Display Formatting — Always Use `format.ts`

Located at: `my-portal/src/lib/utils/format.ts`

```typescript
import { formatCurrency } from '$lib/utils/format'

// CORRECT — consistent AUD display
formatCurrency(1234.5)     // "$1,234.50"
formatCurrency(0)          // "$0.00"
formatCurrency(-50)        // "-$50.00"

// WRONG — manual string formatting
`$${amount.toFixed(2)}`    // no thousand separators, locale inconsistency
```

---

## Server-Side Validation for Financial Data

Never trust client-sent totals. Recalculate server-side:
```typescript
// In +page.server.ts form action
export const actions = {
  createQuote: async (event) => {
    const form = await superValidate(event, zod(quoteSchema))
    if (!form.valid) return fail(400, { form })

    const { lineItems, discountPercent } = form.data

    // Recalculate server-side — never trust client total
    const lineTotals = lineItems.map(item =>
      calculateLineTotal(item.qty, item.unitPrice, item.discountPercent)
    )
    const subtotal = calculateSubtotal(lineTotals)
    const gst = calculateTaxAmount(subtotal, 10)
    const total = calculateGrandTotal(subtotal, gst)

    await event.locals.supabase.from('quotes').insert({
      ...form.data,
      subtotal,
      gst_amount: gst,
      total  // server-calculated, not client-provided
    })
  }
}
```

---

## Zod Schema for Money Fields

```typescript
import { z } from 'zod'

const moneyAmount = z.number()
  .nonnegative('Amount cannot be negative')
  .multipleOf(0.01, 'Maximum 2 decimal places')

const percentage = z.number()
  .min(0, 'Cannot be negative')
  .max(100, 'Cannot exceed 100%')
  .multipleOf(0.01)

export const lineItemSchema = z.object({
  description: z.string().min(1),
  qty: z.number().positive().multipleOf(0.001),  // 3dp for quantities
  unit_price: moneyAmount,
  discount_percent: percentage.default(0),
})
```

---

## Rules Summary

1. **Always use `round2()`** — never raw `* 0.1` or `.toFixed(2)` for calculation
2. **DB column type**: `NUMERIC(10,2)` not `FLOAT` or `DOUBLE PRECISION`
3. **Recalculate server-side** — never trust client-sent totals
4. **Display via `formatCurrency()`** — consistent AUD locale formatting
5. **GST is 10%** in Australia — store rate separately for future changes
6. **Extract-then-store** — store subtotal, GST, and total as separate columns
