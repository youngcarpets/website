<script lang="ts">
	let { label = 'New' }: { label?: string } = $props();
</script>

<div class="grid">
	<div class="cell">
		Notifications <span class="badge">3</span>
	</div>
	<div class="cell">
		Messages <span class="badge">12</span>
	</div>
	<div class="cell">
		Status <span class="badge">{label}</span>
	</div>
	<div class="cell">
		Beta <span class="badge">v2</span>
	</div>
	<div class="cell">
		Stock <span class="badge">Low</span>
	</div>
</div>

<style>
	.grid {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		max-width: 280px;
		margin: 0 auto;
		padding: 1rem 0;
	}

	.cell {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.625rem 1rem;
		background: var(--surface-card);
		border: 1px solid var(--border-subtle);
		border-radius: 12px;
		font-size: 0.875rem;
		color: var(--text-primary);
	}

	.badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 22px;
		height: 22px;
		padding: 0 0.5rem;
		font-size: 0.6875rem;
		font-weight: 700;
		color: var(--surface);
		background: var(--c-accent, #00C2FF);
		border-radius: var(--c-radius, 9999px);
		box-shadow: 0 0 var(--c-glow, 8px) color-mix(in srgb, var(--c-accent, #00C2FF) 50%, transparent);
		transition: box-shadow 200ms var(--ease-apple);
	}
</style>
