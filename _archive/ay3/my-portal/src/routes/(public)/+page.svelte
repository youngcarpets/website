<script lang="ts">
	import { EmployeeForm, EmployeeTable } from '$lib/modules/employees';
	import type { Employee } from '$lib/modules/employees';
	import { PageHeader } from '$lib/components/ui';
	import Toast from '$lib/components/Toast.svelte';
	import { showToast } from '$lib/stores/toast';

	let { data } = $props();

	let editingEmployee = $state<Employee | null>(null);

	function startEdit(employee: Employee) {
		editingEmployee = employee;
	}

	function cancelEdit() {
		editingEmployee = null;
	}

	$effect(() => {
		const msg = data.form.message;
		if (msg && typeof msg === 'string') {
			showToast(msg, data.form.valid ? 'success' : 'error');
		}
	});
</script>

<svelte:head>
	<title>Dashboard — AY3 Portal</title>
</svelte:head>

<div class="mt-6 space-y-6">
	<PageHeader
		title="Dev Test Dashboard"
		subtitle="Manage employees — full CRUD on Supabase"
	/>

	{#if data.error}
		<div class="glass p-4 border-[var(--color-danger)]! text-[var(--color-danger)] text-sm">
			Supabase error: {data.error}
		</div>
	{/if}

	{#if editingEmployee}
		{@const editData = {
			...data.form,
			data: { name: editingEmployee.name, email: editingEmployee.email, role: editingEmployee.role }
		}}
		<EmployeeForm
			data={editData}
			editId={editingEmployee.id}
			action="?/update"
			submitLabel="Update Employee"
			oncancel={cancelEdit}
		/>
	{:else}
		<EmployeeForm data={data.form} />
	{/if}

	<div>
		<div class="flex items-center justify-between mb-3">
			<h2 class="text-lg font-semibold">Employees</h2>
			<span class="text-xs text-[var(--color-text-muted)]">{data.employees.length} records</span>
		</div>
		<EmployeeTable
			employees={data.employees}
			onedit={startEdit}
		/>
	</div>
</div>

<Toast />
