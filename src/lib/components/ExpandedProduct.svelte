<script lang="ts">
	import type { Product } from '$lib/content/products';
	import ModalTabs from './ModalTabs.svelte';
	import CarpetTileModal from './CarpetTileModal.svelte';

	interface Props {
		product: Product;
		badgeRect: { x: number; y: number; w: number; h: number };
		onclose: () => void;
	}

	let { product: prod, badgeRect, onclose }: Props = $props();

	let cardEl: HTMLDivElement | undefined = $state();
	let contentVisible = $state(false);
	let animating = $state(true);
	const previouslyFocused = document.activeElement as HTMLElement | null;

	$effect(() => {
		if (!cardEl) return;

		const gW = cardEl.parentElement!.offsetWidth;
		const gH = cardEl.parentElement!.offsetHeight;
		const scaleX = badgeRect.w / gW;
		const scaleY = badgeRect.h / gH;

		cardEl.style.transform = `translate(${badgeRect.x}px, ${badgeRect.y}px) scale(${scaleX}, ${scaleY})`;

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (!cardEl) return;
				cardEl.style.transform = '';

				const onEnd = () => {
					animating = false;
					contentVisible = true;
					const closeBtn = cardEl?.querySelector<HTMLElement>('.expanded-close');
					closeBtn?.focus();
				};
				cardEl.addEventListener('transitionend', onEnd, { once: true });
			});
		});
	});

	function handleClose() {
		if (animating) return;
		contentVisible = false;
		animating = true;

		requestAnimationFrame(() => {
			if (!cardEl) return;
			const gW = cardEl.parentElement!.offsetWidth;
			const gH = cardEl.parentElement!.offsetHeight;
			const scaleX = badgeRect.w / gW;
			const scaleY = badgeRect.h / gH;

			cardEl.style.transform = `translate(${badgeRect.x}px, ${badgeRect.y}px) scale(${scaleX}, ${scaleY})`;

			const onEnd = () => {
				previouslyFocused?.focus();
				onclose();
			};
			cardEl.addEventListener('transitionend', onEnd, { once: true });
		});
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

	function getFocusableElements(): HTMLElement[] {
		if (!cardEl) return [];
		const els = cardEl.querySelectorAll<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		return Array.from(els).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="expanded-product"
	class:expanded-product--animating={animating}
	role="dialog"
	aria-modal="true"
	aria-label={prod.name}
	bind:this={cardEl}
>
	<div class="expanded-header">
		<div class="expanded-title-group">
			{#if prod.code}<span class="expanded-code">{prod.code}</span>{/if}
			<span class="expanded-name">
				{#if prod.nameHtml}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- controlled data -->
					{@html prod.nameHtml}
				{:else}
					{prod.name}
				{/if}
			</span>
		</div>
		<button type="button" class="expanded-close" aria-label="Close" onclick={handleClose}>
			×
		</button>
	</div>

	<div class="expanded-body" class:expanded-body--visible={contentVisible}>
		{#if prod.material === 'carpet-tile'}
			<CarpetTileModal />
		{:else if prod.details}
			<ModalTabs>
				{#snippet product()}
					<div class="tab-section">
						<p class="tab-text">{prod.details}</p>
					</div>
				{/snippet}
				{#snippet install()}
					<div class="tab-section">
						<p class="tab-text">Installation details coming soon.</p>
					</div>
				{/snippet}
				{#snippet maintain()}
					<div class="tab-section">
						<p class="tab-text">Maintenance details coming soon.</p>
					</div>
				{/snippet}
			</ModalTabs>
		{/if}
	</div>
</div>

<style>
	.expanded-product {
		position: absolute;
		inset: 0;
		z-index: 10;
		display: flex;
		flex-direction: column;
		border-radius: var(--radius-sm);
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.05) 0%,
			rgba(255, 255, 255, 0.015) 45%,
			rgba(0, 0, 0, 0.15) 100%
		);
		border: 1px solid rgba(255, 255, 255, 0.18);
		backdrop-filter: var(--glass-blur);
		-webkit-backdrop-filter: var(--glass-blur);
		box-shadow: var(--glass-shadow), var(--illuminate-glow);
		padding: 0.75rem;
		transition: transform 250ms var(--ease-out);
		transform-origin: top left;
		will-change: transform;
	}

	.expanded-product--animating {
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		box-shadow: none;
	}

	.expanded-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 44px;
		flex-shrink: 0;
	}

	.expanded-title-group {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.expanded-code {
		font-size: 0.5rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		line-height: 1;
	}

	.expanded-name {
		font-size: 1.1rem;
		font-weight: 200;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text);
		line-height: 1.2;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.expanded-close {
		width: 44px;
		height: 44px;
		flex-shrink: 0;
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

	.expanded-close:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 2px;
	}

	.expanded-close:hover {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.15);
	}

	.expanded-body {
		flex: 1;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		overscroll-behavior: contain;
		opacity: 0;
		transition: opacity 200ms var(--ease-out);
	}

	.expanded-body--visible {
		opacity: 1;
	}

	.tab-section {
		margin-bottom: 1rem;
	}

	.tab-section:last-child {
		margin-bottom: 0;
	}

	.tab-text {
		font-size: 0.88rem;
		color: var(--color-text-muted);
		line-height: 1.6;
		margin: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.expanded-product {
			transition: none;
		}

		.expanded-body {
			transition: none;
		}
	}
</style>
