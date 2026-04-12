<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		class: className = '',
		padding = 'p-6'
	}: {
		children: Snippet;
		class?: string;
		padding?: string;
	} = $props();
</script>

<div class="glass {padding} {className}">
	{@render children()}
</div>
