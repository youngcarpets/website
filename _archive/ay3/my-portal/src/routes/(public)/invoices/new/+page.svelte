<script lang="ts">
	import { InvoiceForm } from '$lib/modules/invoices';
	import { PageHeader } from '$lib/components/ui';

	let { data } = $props();
</script>

<svelte:head>
	<title>New Invoice — AY3 Portal</title>
</svelte:head>

<div class="mt-6 space-y-6">
	<PageHeader title="New Invoice" subtitle="Create a draft invoice" />
	<InvoiceForm
		customers={data.customers}
		taxRates={data.taxRates}
		action="?/create"
	/>
</div>
