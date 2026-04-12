<script lang="ts">
	let { label = 'Click me' }: { label?: string } = $props();
</script>

<div class="row">
	<button class="btn">{label}</button>
	<button class="btn btn--ghost">Ghost</button>
	<button class="btn btn--outline">Outline</button>
	<button class="btn" disabled>Disabled</button>
</div>

<style>
	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.875rem;
		justify-content: center;
		padding: 2rem 0;
	}

	.btn {
		padding: var(--c-pad-y, 10px) var(--c-pad-x, 24px);
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--surface);
		background: var(--c-accent, #00C2FF);
		border: 1px solid var(--c-accent, #00C2FF);
		border-radius: var(--c-radius, 9999px);
		cursor: pointer;
		box-shadow: 0 0 var(--c-glow, 16px) color-mix(in srgb, var(--c-accent, #00C2FF) 40%, transparent);
		transition: all 250ms var(--ease-apple);
	}

	.btn:active,
	.btn:hover:not(:disabled) {
		filter: brightness(1.1);
		transform: translateY(-1px);
		box-shadow: 0 0 calc(var(--c-glow, 16px) * 1.5) color-mix(in srgb, var(--c-accent, #00C2FF) 60%, transparent);
	}

	.btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.btn--ghost {
		background: transparent;
		color: var(--c-accent, #00C2FF);
		border-color: transparent;
		box-shadow: none;
	}

	.btn--ghost:hover:not(:disabled) {
		background: color-mix(in srgb, var(--c-accent, #00C2FF) 10%, transparent);
		box-shadow: none;
	}

	.btn--outline {
		background: transparent;
		color: var(--c-accent, #00C2FF);
		border-color: var(--c-accent, #00C2FF);
		box-shadow: 0 0 var(--c-glow, 16px) color-mix(in srgb, var(--c-accent, #00C2FF) 25%, transparent);
	}
</style>
