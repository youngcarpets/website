<script lang="ts">
	import { CustomerTable } from '$lib/modules/customers';
	import { PageHeader } from '$lib/components/ui';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { data } = $props();

	function handleToggle(id: string, active: boolean) {
		// Build the form via createElement so the customer id is set as a property,
		// not interpolated into an HTML string. innerHTML with a string would let
		// any quote/angle-bracket inside id escape the attribute (XSS vector).
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '?/toggle';

		const idInput = document.createElement('input');
		idInput.type = 'hidden';
		idInput.name = 'id';
		idInput.value = id;
		form.appendChild(idInput);

		const activeInput = document.createElement('input');
		activeInput.type = 'hidden';
		activeInput.name = 'active';
		activeInput.value = String(active);
		form.appendChild(activeInput);

		document.body.appendChild(form);
		form.submit();
	}
</script>

<svelte:head>
	<title>Customers — AY3 Portal</title>
</svelte:head>

<div class="mt-6 space-y-6">
	<PageHeader title="Customers" subtitle="Manage your customer database">
		{#snippet actions()}
			<a href="/customers/new" class="btn-primary inline-block no-underline">+ New Customer</a>
		{/snippet}
	</PageHeader>

	{#if data.error}
		<div class="glass p-4 border-[var(--color-danger)]! text-[var(--color-danger)] text-sm">
			Error: {data.error}
		</div>
	{/if}

	<div>
		<div class="flex items-center justify-between mb-3">
			<span class="text-xs text-[var(--color-text-muted)]">{data.customers.length} customers</span>
		</div>
		<CustomerTable
			customers={data.customers}
			onedit={(c) => goto(`/customers/${c.id}`)}
			ontoggle={handleToggle}
		/>
	</div>
</div>
