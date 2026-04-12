<script lang="ts">
	import { CustomerForm } from '$lib/modules/customers';
	import { PageHeader } from '$lib/components/ui';

	let { data } = $props();
</script>

<svelte:head>
	<title>New Customer — AY3 Portal</title>
</svelte:head>

<div class="mt-6 space-y-6">
	<PageHeader title="New Customer" subtitle="Add a new customer to your database" />
	<CustomerForm data={data.form} />
</div>
