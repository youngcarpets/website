<script lang="ts">
	import DataTable from '$lib/components/primitives/DataTable.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import InvoiceStatusBadge from './InvoiceStatusBadge.svelte';
	import type { InvoiceWithCustomer } from '../types/invoice.types';

	let {
		invoices = [],
		onclick = (_inv: InvoiceWithCustomer) => {}
	}: {
		invoices?: InvoiceWithCustomer[];
		onclick?: (inv: InvoiceWithCustomer) => void;
	} = $props();

	function getDisplayStatus(inv: InvoiceWithCustomer): string {
		if (
			inv.status === 'sent' &&
			new Date(inv.due_date) < new Date()
		) {
			return 'overdue';
		}
		return inv.status;
	}
</script>

<DataTable rows={invoices} emptyMessage="No invoices yet. Create one to get started.">
	{#snippet header()}
		<th>Number</th>
		<th>Customer</th>
		<th>Date</th>
		<th>Due</th>
		<th>Status</th>
		<th class="text-right">Total</th>
		<th class="text-right">Due</th>
	{/snippet}
	{#snippet row(invoice)}
		<tr
			class="cursor-pointer"
			onclick={() => onclick(invoice)}
		>
			<td class="font-medium !text-[var(--color-text-primary)]">
				{invoice.invoice_number ?? 'DRAFT'}
			</td>
			<td>{invoice.customers?.name ?? '—'}</td>
			<td class="text-[var(--color-text-muted)]">{formatDate(invoice.issue_date)}</td>
			<td class="text-[var(--color-text-muted)]">{formatDate(invoice.due_date)}</td>
			<td><InvoiceStatusBadge status={getDisplayStatus(invoice)} /></td>
			<td class="text-right">{formatCurrency(invoice.total)}</td>
			<td class="text-right font-medium !text-[var(--color-text-primary)]">
				{formatCurrency(invoice.amount_due)}
			</td>
		</tr>
	{/snippet}
</DataTable>
