<script lang="ts">
	import { InvoiceForm } from '$lib/modules/invoices';
	import { PageHeader } from '$lib/components/ui';

	let { data } = $props();

	let initialData = $derived({
		customer_id: data.invoice.customer_id,
		issue_date: data.invoice.issue_date,
		due_date: data.invoice.due_date,
		reference: data.invoice.reference ?? '',
		notes: data.invoice.notes ?? '',
		internal_notes: data.invoice.internal_notes ?? '',
		line_items: data.lineItems.map((li) => ({
			description: li.description,
			quantity: li.quantity,
			unit_price: li.unit_price,
			discount_percent: li.discount_percent,
			tax_rate_id: li.tax_rate_id,
			tax_name: li.tax_name,
			tax_rate: li.tax_rate,
			sort_order: li.sort_order
		}))
	});
</script>

<svelte:head>
	<title>Edit {data.invoice.invoice_number ?? 'Draft'} — AY3 Portal</title>
</svelte:head>

<div class="mt-6 space-y-6">
	<PageHeader
		title="Edit Invoice"
		subtitle={data.invoice.invoice_number ?? 'Draft'}
	/>
	<InvoiceForm
		customers={data.customers}
		taxRates={data.taxRates}
		{initialData}
		action="?/update"
		submitLabel="Update Invoice"
	/>
</div>
