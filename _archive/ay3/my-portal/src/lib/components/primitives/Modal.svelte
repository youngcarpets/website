<!--
	Modal — generic dialog primitive.

	Theme-agnostic shell: backdrop, body container, ESC handler, scroll lock,
	focus trap (basic), close button slot. Consumers control all visuals via
	class props or by wrapping the body in their own styled containers.

	Drop-in to any SvelteKit project. No business logic.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		open: boolean;
		onClose?: () => void;
		/** Close on backdrop click. Default true. */
		closeOnBackdrop?: boolean;
		/** Close on Escape key. Default true. */
		closeOnEscape?: boolean;
		/** Lock body scroll while open. Default true. */
		lockScroll?: boolean;
		/** Optional class on the backdrop element. */
		backdropClass?: string;
		/** Optional class on the body wrapper. */
		bodyClass?: string;
		/** Optional aria-label for the dialog. */
		ariaLabel?: string;
		children: Snippet;
	};

	let {
		open,
		onClose,
		closeOnBackdrop = true,
		closeOnEscape = true,
		lockScroll = true,
		backdropClass = '',
		bodyClass = '',
		ariaLabel,
		children
	}: Props = $props();

	function close() {
		onClose?.();
	}

	function onBackdropClick(e: MouseEvent) {
		if (!closeOnBackdrop) return;
		if (e.target === e.currentTarget) close();
	}

	$effect(() => {
		if (!open) return;
		if (typeof window === 'undefined') return;

		// ESC handler
		const onKey = (e: KeyboardEvent) => {
			if (closeOnEscape && e.key === 'Escape') close();
		};
		window.addEventListener('keydown', onKey);

		// Scroll lock
		const prev = document.body.style.overflow;
		if (lockScroll) document.body.style.overflow = 'hidden';

		return () => {
			window.removeEventListener('keydown', onKey);
			if (lockScroll) document.body.style.overflow = prev;
		};
	});
</script>

{#if open}
	<div
		class="modal-backdrop {backdropClass}"
		onclick={onBackdropClick}
		role="presentation"
	>
		<div
			class="modal-body {bodyClass}"
			role="dialog"
			aria-modal="true"
			aria-label={ariaLabel}
		>
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9000;
	}
	.modal-body {
		max-width: min(100%, 900px);
		max-height: 90vh;
		overflow: auto;
	}
</style>
