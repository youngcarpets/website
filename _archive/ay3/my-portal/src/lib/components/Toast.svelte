<script lang="ts">
	import { toast } from '$lib/stores/toast';
</script>

{#if $toast}
	<div class="toast toast-{$toast.type}">
		{$toast.message}
	</div>
{/if}
