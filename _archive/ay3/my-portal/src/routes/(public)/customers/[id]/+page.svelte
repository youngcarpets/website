<script lang="ts">
	import { CustomerForm } from '$lib/modules/customers';
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
	<title>Edit {data.customer.name} — AY3 Portal</title>
</svelte:head>

<div class="mt-6 space-y-6">
	<PageHeader title="Edit Customer" subtitle={data.customer.name}>
		{#snippet actions()}
			<a href="/customers" class="btn-secondary">Back to List</a>
		{/snippet}
	</PageHeader>

	<CustomerForm
		data={data.form}
		action="?/update"
		submitLabel="Update Customer"
	/>
</div>

<Toast />
