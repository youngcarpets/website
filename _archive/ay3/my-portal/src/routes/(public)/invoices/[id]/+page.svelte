<script lang="ts">
	import { InvoiceDetail } from '$lib/modules/invoices';
	import { PageHeader } from '$lib/components/ui';
	import Toast from '$lib/components/Toast.svelte';
	import { showToast } from '$lib/stores/toast';
	import { enhance } from '$app/forms';

	let { data } = $props();

	let inv = $derived(data.invoice);
	let canSend = $derived(inv.status === 'draft');
	let canPay = $derived(inv.status === 'sent' || inv.status === 'viewed' || inv.status === 'partial');
	let canVoid = $derived(inv.status !== 'void' && inv.status !== 'paid');
	let canEdit = $derived(inv.status === 'draft');
</script>

<svelte:head>
	<title>{inv.invoice_number ?? 'Draft'} — AY3 Portal</title>
</svelte:head>

<div class="mt-6 space-y-6">
	<PageHeader
		title={inv.invoice_number ?? 'Draft Invoice'}
		subtitle={inv.customers?.name ?? ''}
	>
		{#snippet actions()}
			<div class="flex gap-2 no-print">
				{#if canEdit}
					<a href="/invoices/{inv.id}/edit" class="btn-secondary inline-block no-underline">Edit</a>
				{/if}
				{#if canSend}
					<form method="POST" action="?/send" use:enhance>
						<button type="submit" class="btn-primary">Send</button>
					</form>
				{/if}
				{#if canPay}
					<form method="POST" action="?/markPaid" use:enhance>
						<button type="submit" class="btn-primary">Mark Paid</button>
					</form>
				{/if}
				{#if canVoid}
					<form method="POST" action="?/void" use:enhance>
						<button type="submit" class="btn-danger">Void</button>
					</form>
				{/if}
				<button class="btn-secondary" onclick={() => window.print()}>Print</button>
				<a href="/invoices" class="btn-secondary inline-block no-underline">Back</a>
			</div>
		{/snippet}
	</PageHeader>

	<InvoiceDetail
		invoice={data.invoice}
		lineItems={data.lineItems}
		taxRates={data.taxRates}
	/>
</div>

<Toast />
