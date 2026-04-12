<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		message = 'No records found.',
		actions
	}: {
		message?: string;
		actions?: Snippet;
	} = $props();
</script>

<div class="glass p-8 text-center">
	<p class="text-[var(--color-text-muted)] mb-4">{message}</p>
	{#if actions}
		{@render actions()}
	{/if}
</div>
