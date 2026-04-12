<script lang="ts">
	let {}: Record<string, never> = $props();
	let open = $state(false);
</script>

<div class="trigger-row">
	<button class="trigger" onclick={() => (open = true)}>Open Modal</button>
</div>

{#if open}
	<div class="backdrop" role="presentation" onclick={() => (open = false)}>
		<div
			class="modal"
			role="dialog"
			aria-modal="true"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={() => {}}
		>
			<div class="modal__header">
				<h3 class="modal__title">Confirm action</h3>
				<button class="modal__close" onclick={() => (open = false)} aria-label="Close">✕</button>
			</div>
			<p class="modal__body">
				This is a sample modal dialog. The accent color, padding, corner radius, backdrop blur,
				and border glow are all live-editable.
			</p>
			<div class="modal__actions">
				<button class="btn btn--ghost" onclick={() => (open = false)}>Cancel</button>
				<button class="btn btn--primary" onclick={() => (open = false)}>Confirm</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.trigger-row {
		display: flex;
		justify-content: center;
		padding: 2rem 0;
	}

	.trigger {
		padding: 0.625rem 1.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--surface);
		background: var(--c-accent, #00C2FF);
		border: none;
		border-radius: 9999px;
		cursor: pointer;
		box-shadow: 0 0 24px color-mix(in srgb, var(--c-accent, #00C2FF) 40%, transparent);
	}

	.backdrop {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(var(--c-blur, 8px));
		-webkit-backdrop-filter: blur(var(--c-blur, 8px));
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		animation: fadeIn 200ms var(--ease-apple);
	}

	.modal {
		background: var(--surface-card);
		backdrop-filter: blur(24px) saturate(1.4);
		-webkit-backdrop-filter: blur(24px) saturate(1.4);
		border: 1px solid color-mix(in srgb, var(--c-accent, #00C2FF) 35%, var(--border-medium));
		border-radius: var(--c-radius, 24px);
		padding: var(--c-pad, 28px);
		max-width: 420px;
		width: 90%;
		box-shadow:
			0 24px 64px rgba(0, 0, 0, 0.5),
			0 0 var(--c-glow, 24px) color-mix(in srgb, var(--c-accent, #00C2FF) 35%, transparent);
		animation: slideUp 300ms var(--ease-apple);
	}

	.modal__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.modal__title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.modal__close {
		background: transparent;
		border: none;
		font-size: 0.875rem;
		color: var(--text-tertiary);
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
	}

	.modal__close:active,
	.modal__close:hover {
		background: var(--border-subtle);
		color: var(--text-primary);
	}

	.modal__body {
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--text-secondary);
		margin-bottom: 1.25rem;
	}

	.modal__actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	.btn {
		padding: 0.5rem 1.25rem;
		font-size: 0.8125rem;
		font-weight: 600;
		border-radius: 9999px;
		cursor: pointer;
		border: none;
		transition: all 200ms var(--ease-apple);
	}

	.btn--ghost {
		background: transparent;
		color: var(--text-secondary);
	}

	.btn--ghost:hover {
		background: var(--border-subtle);
		color: var(--text-primary);
	}

	.btn--primary {
		background: var(--c-accent, #00C2FF);
		color: var(--surface);
		box-shadow: 0 0 16px color-mix(in srgb, var(--c-accent, #00C2FF) 40%, transparent);
	}

	.btn--primary:hover {
		filter: brightness(1.1);
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(20px) scale(0.95); }
		to { opacity: 1; transform: translateY(0) scale(1); }
	}
</style>
