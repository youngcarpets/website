<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	let { children } = $props();
</script>

<Navbar />
<main class="pt-16 px-4 pb-8 max-w-6xl mx-auto">
	{@render children()}
</main>
