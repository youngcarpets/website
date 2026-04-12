<script lang="ts">
	import { Badge, ConfirmDialog } from '$lib/components/ui';
	import DataTable from '$lib/components/primitives/DataTable.svelte';
	import { formatDate } from '$lib/utils/format';
	import type { Employee } from '../types/employee.types';

	let {
		employees = [],
		onedit = (_e: Employee) => {}
	}: {
		employees?: Employee[];
		onedit?: (e: Employee) => void;
	} = $props();

	let deleteTarget = $state<Employee | null>(null);
	let confirmOpen = $state(false);
</script>

<DataTable rows={employees} emptyMessage="No employees yet. Add one above.">
	{#snippet header()}
		<th>Name</th>
		<th>Email</th>
		<th>Role</th>
		<th>Created</th>
		<th class="text-right">Actions</th>
	{/snippet}
	{#snippet row(employee)}
		<tr>
			<td class="font-medium !text-[var(--color-text-primary)]">{employee.name}</td>
			<td>{employee.email}</td>
			<td><Badge>{employee.role}</Badge></td>
			<td class="text-[var(--color-text-muted)]">{formatDate(employee.created_at)}</td>
			<td class="text-right">
				<div class="flex gap-2 justify-end">
					<button
						class="btn-secondary !py-1 !px-3 text-xs"
						onclick={() => onedit(employee)}
					>
						Edit
					</button>
					<button
						class="btn-danger !py-1 !px-3 text-xs"
						onclick={() => { deleteTarget = employee; confirmOpen = true; }}
					>
						Delete
					</button>
				</div>
			</td>
		</tr>
	{/snippet}
</DataTable>

<ConfirmDialog
	bind:open={confirmOpen}
	title="Delete Employee"
	message="Are you sure you want to delete {deleteTarget?.name ?? 'this employee'}?"
	confirmLabel="Delete"
	onconfirm={() => {
		if (!deleteTarget) return;
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '?/delete';
		const input = document.createElement('input');
		input.type = 'hidden';
		input.name = 'id';
		input.value = deleteTarget.id;
		form.appendChild(input);
		document.body.appendChild(form);
		form.submit();
	}}
/>
