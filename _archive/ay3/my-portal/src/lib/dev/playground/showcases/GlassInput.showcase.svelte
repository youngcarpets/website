<script lang="ts">
	let { placeholder = 'Type something...' }: { placeholder?: string } = $props();
	let value = $state('');
</script>

<div class="stack">
	<div class="field">
		<label for="demo-input" class="label">Default</label>
		<input id="demo-input" class="input" type="text" {placeholder} bind:value />
	</div>
	<div class="field">
		<label for="demo-input2" class="label">With value</label>
		<input id="demo-input2" class="input" type="text" value="alan@youngcarpets.ca" />
	</div>
	<div class="field">
		<label for="demo-input3" class="label">Disabled</label>
		<input id="demo-input3" class="input" type="text" placeholder="Locked" disabled />
	</div>
</div>

<style>
	.stack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 360px;
		margin: 0 auto;
		padding: 1rem 0;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.label {
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-tertiary);
	}

	.input {
		width: 100%;
		padding: var(--c-pad, 10px) 14px;
		font-size: 0.875rem;
		color: var(--text-primary);
		background: var(--surface-card);
		border: 1px solid var(--border-medium);
		border-radius: var(--c-radius, 10px);
		outline: none;
		transition: all 250ms var(--ease-apple);
		font-family: inherit;
	}

	.input::placeholder {
		color: var(--text-tertiary);
	}

	.input:focus {
		border-color: var(--c-accent, #00C2FF);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--c-accent, #00C2FF) 18%, transparent),
		            0 0 16px color-mix(in srgb, var(--c-accent, #00C2FF) 25%, transparent);
		background: var(--surface-warm);
	}

	.input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
