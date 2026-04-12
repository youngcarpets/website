<script lang="ts">
	let {}: Record<string, never> = $props();
	type ToastKind = 'success' | 'error' | 'info' | 'warn';
	let toasts = $state<{ id: number; kind: ToastKind; msg: string }[]>([]);
	let next = 0;

	function show(kind: ToastKind, msg: string) {
		const id = next++;
		toasts.push({ id, kind, msg });
		setTimeout(() => {
			toasts = toasts.filter((t) => t.id !== id);
		}, 3000);
	}
</script>

<div class="trigger-row">
	<button class="btn" onclick={() => show('success', 'Saved successfully!')}>Success</button>
	<button class="btn" onclick={() => show('error', 'Something went wrong.')}>Error</button>
	<button class="btn" onclick={() => show('info', 'Heads up — new update available.')}>Info</button>
	<button class="btn" onclick={() => show('warn', 'Low disk space.')}>Warn</button>
</div>

<div class="toast-stack">
	{#each toasts as toast (toast.id)}
		<div class="toast toast--{toast.kind}">
			<div class="toast__dot"></div>
			{toast.msg}
		</div>
	{/each}
</div>

<style>
	.trigger-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
		padding: 1.5rem 0;
	}

	.btn {
		padding: 0.5rem 1.125rem;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--c-accent, #00C2FF);
		background: transparent;
		border: 1px solid color-mix(in srgb, var(--c-accent, #00C2FF) 50%, transparent);
		border-radius: var(--c-radius, 12px);
		cursor: pointer;
		transition: all 200ms var(--ease-apple);
	}

	.btn:active,
	.btn:hover {
		background: color-mix(in srgb, var(--c-accent, #00C2FF) 12%, transparent);
		box-shadow: 0 0 var(--c-glow, 8px) color-mix(in srgb, var(--c-accent, #00C2FF) 35%, transparent);
	}

	.toast-stack {
		position: absolute;
		bottom: 1.5rem;
		right: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		z-index: 50;
	}

	.toast {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.75rem 1rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-primary);
		background: var(--surface-card);
		border: 1px solid var(--border-medium);
		border-radius: var(--c-radius, 12px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25),
		            0 0 var(--c-glow, 8px) color-mix(in srgb, var(--c-accent, #00C2FF) 30%, transparent);
		animation: slideIn 250ms var(--ease-apple);
		min-width: 220px;
		backdrop-filter: blur(20px) saturate(1.3);
		-webkit-backdrop-filter: blur(20px) saturate(1.3);
	}

	.toast__dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.toast--success .toast__dot { background: #00FF94; box-shadow: 0 0 8px #00FF94; }
	.toast--error   .toast__dot { background: #FF4060; box-shadow: 0 0 8px #FF4060; }
	.toast--info    .toast__dot { background: var(--c-accent, #00C2FF); box-shadow: 0 0 8px var(--c-accent, #00C2FF); }
	.toast--warn    .toast__dot { background: #FFB020; box-shadow: 0 0 8px #FFB020; }

	@keyframes slideIn {
		from { opacity: 0; transform: translateX(20px); }
		to { opacity: 1; transform: translateX(0); }
	}
</style>
