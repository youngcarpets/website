<script lang="ts">
	let { children } = $props();
</script>

<!-- Standalone layout - no portal navbar, fully self-contained -->
{@render children()}
