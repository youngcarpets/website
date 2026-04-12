<script lang="ts">
	import { EmployeeForm } from '$lib/modules/employees';
	import { PageHeader } from '$lib/components/ui';
	import Toast from '$lib/components/Toast.svelte';
	import { showToast } from '$lib/stores/toast';

	let { data } = $props();

	$effect(() => {
		const msg = data.form.message;
		if (msg && typeof msg === 'string') {
			showToast(msg, data.form.valid ? 'success' : 'error');
		}
	});
</script>

<svelte:head>
	<title>Edit {data.employee.name} — AY3 Portal</title>
</svelte:head>

<div class="mt-6 space-y-6">
	<PageHeader title="Edit Employee" subtitle={data.employee.name}>
		{#snippet actions()}
			<a href="/employees" class="btn-secondary">Back to List</a>
		{/snippet}
	</PageHeader>

	<EmployeeForm
		data={data.form}
		action="?/update"
		submitLabel="Update Employee"
	/>
</div>

<Toast />
