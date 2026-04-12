<script lang="ts">
	import { Badge } from '$lib/components/ui';
	import DataTable from '$lib/components/primitives/DataTable.svelte';
	import type { Customer } from '../types/customer.types';

	let {
		customers = [],
		onedit = (_c: Customer) => {},
		ontoggle = (_id: string, _active: boolean) => {}
	}: {
		customers?: Customer[];
		onedit?: (c: Customer) => void;
		ontoggle?: (id: string, active: boolean) => void;
	} = $props();
</script>

<DataTable rows={customers} emptyMessage="No customers yet. Add one to get started.">
	{#snippet header()}
		<th>Name</th>
		<th>Contact</th>
		<th>Email</th>
		<th>Phone</th>
		<th>Terms</th>
		<th>Status</th>
		<th class="text-right">Actions</th>
	{/snippet}
	{#snippet row(customer)}
		<tr>
			<td class="font-medium !text-[var(--color-text-primary)]">{customer.name}</td>
			<td>{customer.contact_name ?? '—'}</td>
			<td>{customer.email ?? '—'}</td>
			<td>{customer.phone ?? '—'}</td>
			<td class="text-[var(--color-text-muted)]">Net {customer.payment_terms}</td>
			<td>
				{#if customer.is_active}
					<Badge variant="green">Active</Badge>
				{:else}
					<Badge variant="gray">Inactive</Badge>
				{/if}
			</td>
			<td class="text-right">
				<div class="flex gap-2 justify-end">
					<button
						class="btn-secondary !py-1 !px-3 text-xs"
						onclick={() => onedit(customer)}
					>
						Edit
					</button>
					<button
						class="btn-danger !py-1 !px-3 text-xs"
						onclick={() => ontoggle(customer.id, !customer.is_active)}
					>
						{customer.is_active ? 'Deactivate' : 'Activate'}
					</button>
				</div>
			</td>
		</tr>
	{/snippet}
</DataTable>
