<script lang="ts">
	import type { Product } from '$lib/content/products';
	import { productDetails } from '$lib/content/product-details';
	import ProductContentModal from './ProductContentModal.svelte';

	interface Props {
		product: Product;
		onclose: () => void;
	}

	let { product, onclose }: Props = $props();

	const previouslyFocused = document.activeElement as HTMLElement | null;
	let modalBody: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (modalBody) {
			const closeBtn = modalBody.querySelector<HTMLElement>('.modal-close');
			closeBtn?.focus();
		}
	});

	function getFocusableElements(): HTMLElement[] {
		if (!modalBody) return [];
		const els = modalBody.querySelectorAll<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		return Array.from(els).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleClose();
			return;
		}
		if (e.key === 'Tab') {
			const focusable = getFocusableElements();
			if (focusable.length === 0) return;
			const first = focusable[0]!;
			const last = focusable[focusable.length - 1]!;
			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault();
					last.focus();
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		}
	}

	function handleClose() {
		previouslyFocused?.focus();
		onclose();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) handleClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="modal-backdrop" onclick={handleBackdropClick}>
	<div
		class="modal-body"
		role="dialog"
		aria-modal="true"
		aria-label={product.name}
		bind:this={modalBody}
	>
		<button type="button" class="modal-close" aria-label="Close" onclick={handleClose}>×</button>

		{#if product.code}<p class="modal-code">{product.code}</p>{/if}
		<h3 class="modal-title">
			{#if product.nameHtml}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- controlled data -->
				{@html product.nameHtml}
			{:else}
				{product.name}
			{/if}
		</h3>
		{#if product.details}
			<p class="modal-details">{product.details}</p>
		{/if}

		{#if productDetails[product.material]}
			<ProductContentModal material={product.material} />
		{/if}
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 200;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(20px) saturate(1.4);
		-webkit-backdrop-filter: blur(20px) saturate(1.4);
		animation: modal-bg-in 350ms var(--ease-out) both;
	}

	.modal-body {
		position: relative;
		max-width: 540px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		padding: 2.5rem 2rem;
		border-radius: var(--radius-lg);
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.05) 0%,
			rgba(255, 255, 255, 0.015) 45%,
			rgba(0, 0, 0, 0.15) 100%
		);
		border: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(32px) saturate(1.8);
		-webkit-backdrop-filter: blur(32px) saturate(1.8);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.1),
			0 30px 80px -20px rgba(0, 0, 0, 0.7),
			0 60px 140px -36px rgba(0, 0, 0, 0.8);
		animation: modal-body-in 500ms var(--ease-out) both;
	}

	@keyframes modal-bg-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes modal-body-in {
		from {
			opacity: 0;
			transform: translateY(20px) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.modal-close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.03);
		color: var(--color-text);
		border-radius: var(--radius-sm);
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		transition:
			background var(--base),
			border-color var(--base);
	}

	.modal-close:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 2px;
	}

	.modal-close:hover {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.15);
	}

	.modal-code {
		font-family: var(--font-body);
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		margin: 0;
	}

	.modal-title {
		font-family: var(--font-body);
		font-size: 1.85rem;
		font-weight: 200;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin: 0.4rem 0 1rem;
		color: var(--color-text);
	}

	.modal-details {
		font-size: 0.92rem;
		color: var(--color-text-muted);
		margin: 0 0 1.5rem;
		line-height: 1.65;
	}

	@media (prefers-reduced-motion: reduce) {
		.modal-backdrop,
		.modal-body {
			animation: none;
		}
	}
</style>
