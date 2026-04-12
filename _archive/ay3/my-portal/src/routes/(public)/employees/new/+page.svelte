<script lang="ts">
	import { EmployeeForm } from '$lib/modules/employees';
	import { PageHeader } from '$lib/components/ui';

	let { data } = $props();
</script>

<svelte:head>
	<title>New Employee — AY3 Portal</title>
</svelte:head>

<div class="mt-6 space-y-6">
	<PageHeader title="New Employee" subtitle="Add a new team member" />
	<EmployeeForm data={data.form} />
</div>
