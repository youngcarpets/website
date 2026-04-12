<script lang="ts">
	let { label = 'Active' }: { label?: string } = $props();
</script>

<div class="row">
	<span class="pill">{label}</span>
	<span class="pill">Online</span>
	<span class="pill">Pending</span>
	<span class="pill">Premium</span>
	<span class="pill">Verified</span>
	<span class="pill">Hot</span>
	<span class="pill">Urgent</span>
</div>

<div class="row">
	<span class="pill pill--solid">Solid</span>
	<span class="pill pill--solid">Solid</span>
	<span class="pill pill--solid">Solid</span>
</div>

<style>
	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
		padding: 0.75rem 0;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		padding: 0.3125rem 0.875rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--c-accent, #00C2FF);
		background: color-mix(in srgb, var(--c-accent, #00C2FF) var(--c-tint, 10%), transparent);
		border: 1px solid color-mix(in srgb, var(--c-accent, #00C2FF) 50%, transparent);
		border-radius: var(--c-radius, 9999px);
		box-shadow: 0 0 var(--c-glow, 0px) color-mix(in srgb, var(--c-accent, #00C2FF) 60%, transparent);
		transition: box-shadow 200ms var(--ease-apple);
	}

	.pill--solid {
		color: var(--surface);
		background: var(--c-accent, #00C2FF);
		border-color: var(--c-accent, #00C2FF);
		box-shadow: 0 0 var(--c-glow, 0px) color-mix(in srgb, var(--c-accent, #00C2FF) 70%, transparent);
	}
</style>
