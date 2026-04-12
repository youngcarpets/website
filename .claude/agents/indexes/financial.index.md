# Financial Agent — Resource Index

> Last updated: 2026-04-06

## Core Resources
| File | What's In It |
|------|-------------|
| `resources/08-financial-accuracy.md` | Money math, round2(), AU GST, server recalculation |
| `resources/09-database-schema-patterns.md` | Money column types (NUMERIC(12,2)), table patterns |

## Reference Files
| File | What's In It |
|------|-------------|
| `reference/standards.md` | Section [E] Errors — server-side validation for financial data |

## Key Formulas
- GST (AU): `gst = round2(total / 11)`
- Ex-GST: `ex_gst = total - gst`
- Line total: `round2(qty * unit_price)`
- Invoice total: `sum(line_totals)` (not recalculated from raw qty*price)
- round2: `Math.round(value * 100) / 100`

## Research Log
| Date | Topic | Source | Added To |
|------|-------|--------|----------|
| | | | |
