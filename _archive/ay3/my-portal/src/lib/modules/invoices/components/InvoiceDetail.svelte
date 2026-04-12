<script lang="ts">
	import { GlassPanel } from '$lib/components/ui';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import InvoiceStatusBadge from './InvoiceStatusBadge.svelte';
	import TotalsSummary from './TotalsSummary.svelte';
	import type { InvoiceWithCustomer, LineItem, TaxRate } from '../types/invoice.types';

	let {
		invoice,
		lineItems = [],
		taxRates = []
	}: {
		invoice: InvoiceWithCustomer;
		lineItems?: LineItem[];
		taxRates?: TaxRate[];
	} = $props();

	let customer = $derived(invoice.customers);
</script>

<div class="space-y-4">
	<!-- Header -->
	<GlassPanel>
		<div class="flex justify-between items-start">
			<div>
				<h2 class="text-2xl font-bold">
					{invoice.invoice_number ?? 'DRAFT'}
				</h2>
				<p class="text-sm text-[var(--color-text-muted)] mt-1">
					Issued {formatDate(invoice.issue_date, 'long')}
					{#if invoice.reference}
						&middot; Ref: {invoice.reference}
					{/if}
				</p>
			</div>
			<InvoiceStatusBadge status={invoice.status} />
		</div>
	</GlassPanel>

	<!-- Customer + Dates -->
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
		<GlassPanel>
			<h3 class="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Bill To</h3>
			{#if customer}
				<p class="font-medium text-[var(--color-text-primary)]">{customer.name}</p>
				{#if customer.billing_street}<p class="text-sm text-[var(--color-text-secondary)]">{customer.billing_street}</p>{/if}
				{#if customer.billing_city || customer.billing_state}
					<p class="text-sm text-[var(--color-text-secondary)]">
						{[customer.billing_city, customer.billing_state, customer.billing_postcode].filter(Boolean).join(', ')}
					</p>
				{/if}
				{#if customer.email}<p class="text-sm text-[var(--color-text-muted)] mt-1">{customer.email}</p>{/if}
				{#if customer.phone}<p class="text-sm text-[var(--color-text-muted)]">{customer.phone}</p>{/if}
			{/if}
		</GlassPanel>

		<GlassPanel>
			<h3 class="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Details</h3>
			<div class="space-y-1 text-sm">
				<div class="flex justify-between">
					<span class="text-[var(--color-text-muted)]">Issue Date</span>
					<span>{formatDate(invoice.issue_date)}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-[var(--color-text-muted)]">Due Date</span>
					<span>{formatDate(invoice.due_date)}</span>
				</div>
				<div class="flex justify-between font-semibold text-lg mt-2 pt-2 border-t border-[var(--color-glass-border)]">
					<span>Amount Due</span>
					<span class="text-[var(--color-cyan-accent)]">{formatCurrency(invoice.amount_due)}</span>
				</div>
			</div>
		</GlassPanel>
	</div>

	<!-- Line Items -->
	<GlassPanel>
		<div class="overflow-x-auto">
			<table class="table-glass">
				<thead>
					<tr>
						<th>Description</th>
						<th class="text-right">Qty</th>
						<th class="text-right">Price</th>
						{#if lineItems.some((li) => li.discount_percent > 0)}
							<th class="text-right">Disc</th>
						{/if}
						<th>Tax</th>
						<th class="text-right">Total</th>
					</tr>
				</thead>
				<tbody>
					{#each lineItems as item (item.id)}
						<tr>
							<td class="!text-[var(--color-text-primary)]">{item.description}</td>
							<td class="text-right">{item.quantity}</td>
							<td class="text-right">{formatCurrency(item.unit_price)}</td>
							{#if lineItems.some((li) => li.discount_percent > 0)}
								<td class="text-right">{item.discount_percent > 0 ? `${item.discount_percent}%` : '—'}</td>
							{/if}
							<td class="text-[var(--color-text-muted)]">{item.tax_name ?? '—'}</td>
							<td class="text-right font-medium !text-[var(--color-text-primary)]">{formatCurrency(item.line_total)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="mt-4 ml-auto max-w-xs">
			<TotalsSummary
				lineItems={lineItems.map((li) => ({
					quantity: li.quantity,
					unit_price: li.unit_price,
					discount_percent: li.discount_percent,
					tax_rate_id: li.tax_rate_id
				}))}
				{taxRates}
				amountPaid={invoice.amount_paid}
			/>
		</div>
	</GlassPanel>

	<!-- Notes -->
	{#if invoice.notes}
		<GlassPanel>
			<h3 class="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Notes</h3>
			<p class="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap">{invoice.notes}</p>
		</GlassPanel>
	{/if}
</div>
