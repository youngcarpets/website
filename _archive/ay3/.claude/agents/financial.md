# Agent: Financial

> **Domain**: Money math, HST calculations, rounding, invoice/payment accuracy
> **Index**: `.claude/agents/indexes/financial.index.md`
> **Mode**: Both

## Trigger Conditions
When to spawn this agent:
- Working on invoice or payment features
- Currency or money calculations
- GST/tax computation
- Rounding logic for financial values
- Price display or formatting

## Resources to Load
Read these files before starting work:
1. `.claude/agents/indexes/financial.index.md`
2. `.claude/resources/08-financial-accuracy.md`
3. `.claude/resources/09-database-schema-patterns.md` (money column types)

## Responsibilities
- Use `round2()` function for all money math
- Implement AU GST calculations (10% rate, GST = total / 11)
- Ensure server-side recalculation of all totals (never trust client math)
- Store money as integers (cents) or NUMERIC(12,2) in database
- Display money with 2 decimal places always
- Validate financial data with Zod schemas

### Financial Rules
- NEVER use floating point for money (use integers or NUMERIC)
- ALWAYS recalculate totals server-side
- ALWAYS round to 2 decimal places for display
- GST formula: `gst = round2(total / 11)`, `ex_gst = total - gst`
- Line item total: `round2(qty * unit_price)`
- Invoice total: sum of line item totals (not qty * price for each)

### Does NOT do:
- Database schema design (that's the Database Agent, but advises on money column types)
- Form UI (that's the Design/Forms Agent)
- General business logic unrelated to money

## Output Protocol
- Financial calculation code with round2() usage
- Server-side validation logic
- Test cases for edge cases (rounding, zero values, negative amounts)
