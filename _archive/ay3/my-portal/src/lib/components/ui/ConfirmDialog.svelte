<script lang="ts">
	import Modal from '$lib/components/primitives/Modal.svelte';

	let {
		open = $bindable(false),
		title = 'Confirm',
		message = 'Are you sure?',
		confirmLabel = 'Confirm',
		cancelLabel = 'Cancel',
		variant = 'danger',
		onconfirm
	}: {
		open?: boolean;
		title?: string;
		message?: string;
		confirmLabel?: string;
		cancelLabel?: string;
		variant?: 'danger' | 'primary';
		onconfirm: () => void;
	} = $props();

	function handleConfirm() {
		onconfirm();
		open = false;
	}
</script>

<Modal
	{open}
	onClose={() => (open = false)}
	backdropClass="confirm-backdrop"
	bodyClass="glass confirm-body"
	ariaLabel={title}
>
	<h3 class="text-lg font-semibold mb-2">{title}</h3>
	<p class="text-sm text-[var(--color-text-secondary)] mb-6">{message}</p>
	<div class="flex gap-3 justify-end">
		<button class="btn-secondary" onclick={() => (open = false)}>
			{cancelLabel}
		</button>
		<button
			class={variant === 'danger' ? 'btn-danger' : 'btn-primary'}
			onclick={handleConfirm}
		>
			{confirmLabel}
		</button>
	</div>
</Modal>

<style>
	:global(.confirm-backdrop) {
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
	}
	:global(.confirm-body) {
		max-width: 24rem;
		width: calc(100% - 2rem);
		padding: 1.5rem;
	}
</style>
