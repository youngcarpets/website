<script lang="ts">
	import { EmployeeTable } from '$lib/modules/employees';
	import { PageHeader } from '$lib/components/ui';
	import { goto } from '$app/navigation';

	let { data } = $props();
</script>

<svelte:head>
	<title>Employees — AY3 Portal</title>
</svelte:head>

<div class="mt-6 space-y-6">
	<PageHeader title="Employees" subtitle="Manage your team">
		{#snippet actions()}
			<a href="/employees/new" class="btn-primary inline-block no-underline">+ New Employee</a>
		{/snippet}
	</PageHeader>

	{#if data.error}
		<div class="glass p-4 border-[var(--color-danger)]! text-[var(--color-danger)] text-sm">
			Error: {data.error}
		</div>
	{/if}

	<div>
		<div class="flex items-center justify-between mb-3">
			<span class="text-xs text-[var(--color-text-muted)]">{data.employees.length} employees</span>
		</div>
		<EmployeeTable
			employees={data.employees}
			onedit={(e) => goto(`/employees/${e.id}`)}
		/>
	</div>
</div>
