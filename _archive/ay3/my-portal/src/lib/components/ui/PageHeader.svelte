<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		subtitle = '',
		actions
	}: {
		title: string;
		subtitle?: string;
		actions?: Snippet;
	} = $props();
</script>

<div class="flex items-start justify-between gap-4">
	<div>
		<h1 class="text-3xl font-bold tracking-tight mb-1">{title}</h1>
		{#if subtitle}
			<p class="text-[var(--color-text-muted)] text-sm">{subtitle}</p>
		{/if}
	</div>
	{#if actions}
		<div class="flex gap-3">
			{@render actions()}
		</div>
	{/if}
</div>
