<!--
	FormSection — wraps a labeled section of form fields in a GlassPanel.
	Takes title + column count, renders children inside a CSS grid.
	Reduces the GlassPanel + h2 + grid boilerplate that repeats across all module forms.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { GlassPanel } from '$lib/components/ui';

	type Props = {
		title: string;
		columns?: 1 | 2 | 3 | 4;
		class?: string;
		children: Snippet;
		/** Optional snippet rendered to the right of the title (e.g. a checkbox) */
		titleAside?: Snippet;
	};

	let { title, columns = 2, class: cls = 'mb-4', children, titleAside }: Props = $props();

	const gridClass = $derived(
		columns === 1
			? 'grid grid-cols-1 gap-4'
			: columns === 2
				? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
				: columns === 3
					? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
					: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
	);
</script>

<GlassPanel class={cls}>
	{#if titleAside}
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">{title}</h2>
			{@render titleAside()}
		</div>
	{:else}
		<h2 class="text-lg font-semibold mb-4">{title}</h2>
	{/if}
	<div class={gridClass}>
		{@render children()}
	</div>
</GlassPanel>
