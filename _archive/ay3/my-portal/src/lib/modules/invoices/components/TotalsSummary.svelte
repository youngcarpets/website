<script lang="ts">
	import { formatCurrency } from '$lib/utils/format';
	import { round2, calculateLineTotal, calculateTaxAmount } from '$lib/utils/money';
	import type { TaxRate } from '../types/invoice.types';

	let {
		lineItems = [],
		taxRates = [],
		amountPaid = 0
	}: {
		lineItems?: { quantity: number; unit_price: number; discount_percent: number; tax_rate_id: string | null }[];
		taxRates?: TaxRate[];
		amountPaid?: number;
	} = $props();

	let totals = $derived.by(() => {
		let subtotal = 0;
		const taxBreakdown: Record<string, { name: string; amount: number }> = {};

		for (const item of lineItems) {
			const lineTotal = calculateLineTotal(item.quantity, item.unit_price, item.discount_percent);
			subtotal += lineTotal;

			if (item.tax_rate_id) {
				const taxRate = taxRates.find((t) => t.id === item.tax_rate_id);
				if (taxRate) {
					const taxAmount = calculateTaxAmount(lineTotal, taxRate.rate);
					if (!taxBreakdown[taxRate.id]) {
						taxBreakdown[taxRate.id] = { name: `${taxRate.name} (${taxRate.rate}%)`, amount: 0 };
					}
					taxBreakdown[taxRate.id].amount += taxAmount;
				}
			}
		}

		const taxTotal = Object.values(taxBreakdown).reduce((sum, t) => sum + t.amount, 0);
		const total = round2(subtotal + taxTotal);
		const balanceDue = round2(total - amountPaid);

		return { subtotal: round2(subtotal), taxBreakdown, taxTotal: round2(taxTotal), total, balanceDue };
	});
</script>

<div class="space-y-2 text-sm">
	<div class="flex justify-between text-[var(--color-text-secondary)]">
		<span>Subtotal</span>
		<span>{formatCurrency(totals.subtotal)}</span>
	</div>

	{#each Object.values(totals.taxBreakdown) as tax}
		<div class="flex justify-between text-[var(--color-text-secondary)]">
			<span>{tax.name}</span>
			<span>{formatCurrency(round2(tax.amount))}</span>
		</div>
	{/each}

	<div class="flex justify-between font-semibold text-[var(--color-text-primary)] border-t border-[var(--color-glass-border)] pt-2">
		<span>Total</span>
		<span>{formatCurrency(totals.total)}</span>
	</div>

	{#if amountPaid > 0}
		<div class="flex justify-between text-[var(--color-text-secondary)]">
			<span>Paid</span>
			<span>-{formatCurrency(amountPaid)}</span>
		</div>
		<div class="flex justify-between font-semibold text-[var(--color-cyan-accent)]">
			<span>Balance Due</span>
			<span>{formatCurrency(totals.balanceDue)}</span>
		</div>
	{/if}
</div>
