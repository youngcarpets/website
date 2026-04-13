<script lang="ts">
	import ModalTabs from './ModalTabs.svelte';
	import CarpetTileModal from './CarpetTileModal.svelte';
	import ProductTexture from './ProductTexture.svelte';
	import type { Product } from '$lib/content/products';

	interface Props {
		product: Product;
		badgeRect: { x: number; y: number; w: number; h: number };
		textRect: { x: number; y: number } | null;
		onclose: () => void;
	}

	let { product: prod, badgeRect, textRect, onclose }: Props = $props();

	let cardEl: HTMLDivElement | undefined = $state();
	let titleEl: HTMLDivElement | undefined = $state();
	let glowEl: HTMLDivElement | undefined = $state();
	let animating = $state(true);
	let closing = $state(false);
	let tabsVisible = $state(false);
	let contentVisible = $state(false);
	const previouslyFocused = document.activeElement as HTMLElement | null;

	const EXPAND_MS = 600;
	const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

	$effect(() => {
		if (!cardEl || !titleEl) return;

		const gW = cardEl.parentElement!.offsetWidth;
		const gH = cardEl.parentElement!.offsetHeight;
		const scaleX = badgeRect.w / gW;
		const scaleY = badgeRect.h / gH;

		// Card FLIP: start at badge position/size
		cardEl.style.transition = 'none';
		cardEl.style.transform = `translate(${badgeRect.x}px, ${badgeRect.y}px) scale(${scaleX}, ${scaleY})`;

		// Title counter-FLIP: start at badge text position
		if (textRect) {
			const cardRect = cardEl.parentElement!.getBoundingClientRect();
			const titleRect = titleEl.getBoundingClientRect();

			// Where the title currently renders (at card's scaled position)
			// We need it to appear at textRect instead
			const titleCurrentX = titleRect.left - cardRect.left;
			const titleCurrentY = titleRect.top - cardRect.top;
			const targetX = textRect.x;
			const targetY = textRect.y;

			const dx = (targetX - titleCurrentX) / scaleX;
			const dy = (targetY - titleCurrentY) / scaleY;

			titleEl.style.transition = 'none';
			titleEl.style.transform = `translate(${dx}px, ${dy}px) scale(${0.714 / scaleX}, ${0.714 / scaleY})`;
			titleEl.style.transformOrigin = 'top left';
		}

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (!cardEl || !titleEl) return;

				// Animate card to fill grid
				cardEl.style.transition = `transform ${EXPAND_MS}ms ${EASING}`;
				cardEl.style.transform = '';

				// Animate title to header position
				titleEl.style.transition = `transform ${EXPAND_MS}ms ${EASING}`;
				titleEl.style.transform = '';

				const onEnd = (e: TransitionEvent) => {
					if (e.target !== cardEl) return;
					cardEl!.removeEventListener('transitionend', onEnd);
					animating = false;
					tabsVisible = true;
					// Content appears after tabs stagger in (~300ms for 3 tabs)
					setTimeout(() => {
						contentVisible = true;
						const closeBtn = cardEl?.querySelector<HTMLElement>('.expanded-close');
						closeBtn?.focus();
					}, 300);
				};
				cardEl.addEventListener('transitionend', onEnd);
			});
		});
	});

	function handleClose() {
		if (animating) return;
		const closeBtn = cardEl?.querySelector<HTMLElement>('.expanded-close');
		if (closeBtn) closeBtn.style.opacity = '0';
		contentVisible = false;
		animating = true;
		closing = true;

		// Strip glow from card — the fresh glowEl overlay will carry it
		if (cardEl) {
			cardEl.style.boxShadow = 'var(--glass-shadow)';
		}

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (!cardEl || !titleEl) return;
				tabsVisible = false;
				const gW = cardEl.parentElement!.offsetWidth;
				const gH = cardEl.parentElement!.offsetHeight;
				const scaleX = badgeRect.w / gW;
				const scaleY = badgeRect.h / gH;

				// Reverse FLIP for title: move it back to where badge text sits
				if (textRect) {
					const cardRect = cardEl.parentElement!.getBoundingClientRect();
					const titleRect = titleEl.getBoundingClientRect();

					const titleCurrentX = titleRect.left - cardRect.left;
					const titleCurrentY = titleRect.top - cardRect.top;
					const targetX = textRect.x;
					const targetY = textRect.y;

					const dx = (targetX - badgeRect.x) / scaleX - titleCurrentX;
					const dy = (targetY - badgeRect.y) / scaleY - titleCurrentY;

					titleEl.style.transition = `transform ${EXPAND_MS}ms ${EASING}`;
					titleEl.style.transform = `translate(${dx}px, ${dy}px) scale(${0.714 / scaleX}, ${0.714 / scaleY})`;
					titleEl.style.transformOrigin = 'top left';
				}

				cardEl.style.transition = `transform ${EXPAND_MS}ms ${EASING}`;
				cardEl.style.transform = `translate(${badgeRect.x}px, ${badgeRect.y}px) scale(${scaleX}, ${scaleY})`;

				// Animate glow overlay via layout (not transform) so box-shadow survives
				if (glowEl) {
					glowEl.style.top = `${badgeRect.y}px`;
					glowEl.style.left = `${badgeRect.x}px`;
					glowEl.style.width = `${badgeRect.w}px`;
					glowEl.style.height = `${badgeRect.h}px`;
				}

				const onEnd = (e: TransitionEvent) => {
					if (e.target !== cardEl) return;
					cardEl!.removeEventListener('transitionend', onEnd);
					previouslyFocused?.focus();
					onclose();
				};
				cardEl.addEventListener('transitionend', onEnd);
			});
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
		<div class="expanded-title-group" bind:this={titleEl}>
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
		<div class="expanded-icon" aria-hidden="true">
			<ProductTexture material={prod.material} />
		</div>
		<button
			type="button"
			class="expanded-close"
			class:expanded-close--visible={!animating}
			aria-label="Close"
			onclick={handleClose}
		>
			×
		</button>
	</div>

	{#if tabsVisible}
		<div class="expanded-body" class:expanded-body--visible={contentVisible}>
			{#if prod.material === 'carpet-tile'}
				<CarpetTileModal />
			{:else if prod.details}
				<ModalTabs stagger>
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
	{/if}
</div>

{#if closing}
	<div class="shrink-glow" bind:this={glowEl} aria-hidden="true"></div>
{/if}

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
		transform-origin: top left;
		will-change: transform;
	}

	.expanded-product--animating {
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
	}

	.expanded-header {
		display: flex;
		align-items: flex-start;
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
		transform-origin: top left;
		will-change: transform;
	}

	.expanded-code {
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		line-height: 1;
	}

	.expanded-name {
		font-size: 1.26rem;
		font-weight: 200;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text);
		line-height: 1.2;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.expanded-icon {
		width: 44px;
		height: 44px;
		flex-shrink: 0;
		color: rgba(255, 255, 255, 0.45);
		opacity: 0;
		transition: opacity 300ms var(--ease-out);
	}

	:global(.expanded-icon svg) {
		width: 100%;
		height: 100%;
		display: block;
	}

	.expanded-product:not(.expanded-product--animating) .expanded-icon {
		opacity: 1;
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
		opacity: 0;
		transition:
			opacity 200ms var(--ease-out),
			background var(--base),
			border-color var(--base);
	}

	.expanded-close--visible {
		opacity: 1;
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
		transition: opacity 250ms var(--ease-out);
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

	.shrink-glow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 11;
		border-radius: var(--radius-sm);
		border: 1px solid rgba(255, 255, 255, 0.18);
		box-shadow: var(--illuminate-glow);
		pointer-events: none;
		transition:
			top 600ms cubic-bezier(0.22, 1, 0.36, 1),
			left 600ms cubic-bezier(0.22, 1, 0.36, 1),
			width 600ms cubic-bezier(0.22, 1, 0.36, 1),
			height 600ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	@media (prefers-reduced-motion: reduce) {
		.expanded-product {
			transition: none !important;
		}

		.expanded-title-group {
			transition: none !important;
		}

		.expanded-body {
			transition: none;
		}

		.expanded-close {
			opacity: 1;
		}

		.expanded-icon {
			transition: none;
		}

		.shrink-glow {
			transition: none;
		}
	}
</style>
