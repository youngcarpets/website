<script lang="ts">
	import { InvoiceTable } from '$lib/modules/invoices';
	import { PageHeader } from '$lib/components/ui';
	import { goto } from '$app/navigation';

	let { data } = $props();

	const filters = [
		{ value: 'all', label: 'All' },
		{ value: 'draft', label: 'Draft' },
		{ value: 'sent', label: 'Outstanding' },
		{ value: 'paid', label: 'Paid' },
		{ value: 'void', label: 'Void' }
	];
</script>

<svelte:head>
	<title>Invoices — AY3 Portal</title>
</svelte:head>

<div class="mt-6 space-y-6">
	<PageHeader title="Invoices" subtitle="Manage your invoices">
		{#snippet actions()}
			<a href="/invoices/new" class="btn-primary inline-block no-underline">+ New Invoice</a>
		{/snippet}
	</PageHeader>

	{#if data.error}
		<div class="glass p-4 text-[var(--color-danger)] text-sm">Error: {data.error}</div>
	{/if}

	<!-- Filter tabs -->
	<div class="flex gap-1">
		{#each filters as f}
			<a
				href="/invoices?status={f.value}"
				class="px-3 py-1.5 rounded-lg text-sm transition-colors duration-200
					{data.currentFilter === f.value
						? 'bg-[var(--color-cyan-glow)] text-[var(--color-cyan-accent)] font-medium'
						: 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'}"
			>
				{f.label}
			</a>
		{/each}
	</div>

	<div>
		<div class="flex items-center justify-between mb-3">
			<span class="text-xs text-[var(--color-text-muted)]">{data.invoices.length} invoices</span>
		</div>
		<InvoiceTable
			invoices={data.invoices}
			onclick={(inv) => goto(`/invoices/${inv.id}`)}
		/>
	</div>
</div>
