<script lang="ts">
	import ProductTexture from './ProductTexture.svelte';
	import type { Product } from '$lib/content/products';

	interface Props {
		product: Product;
		index?: number;
		hidden?: boolean;
		dimmed?: boolean;
		onclick: (e: MouseEvent) => void;
	}

	let { product, index = 0, hidden = false, dimmed = false, onclick }: Props = $props();
</script>

<button
	type="button"
	class="product-badge"
	class:product-badge--hidden={hidden}
	class:product-badge--dimmed={dimmed}
	style="--i: {index};"
	aria-label="View {product.name} details"
	{onclick}
>
	<div class="product-badge__texture" aria-hidden="true">
		<ProductTexture material={product.material} />
	</div>

	<div class="product-badge__body">
		{#if product.code}<span class="product-badge__code">{product.code}</span>{/if}
		<span class="product-badge__name">
			{#if product.nameHtml}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- controlled data -->
				{@html product.nameHtml}
			{:else}
				{product.name}
			{/if}
		</span>
	</div>
</button>

<style>
	.product-badge {
		position: relative;
		isolation: isolate;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		box-sizing: border-box;
		overflow: hidden;
		width: 100%;
		aspect-ratio: 1 / 1;
		border-radius: var(--radius-sm);
		padding: 0.3rem 0.35rem 0.5rem 0.5rem;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.025) 0%,
			rgba(255, 255, 255, 0.005) 45%,
			rgba(0, 0, 0, 0.12) 100%
		);
		border: 1px solid var(--color-border-glass);
		backdrop-filter: var(--glass-blur);
		-webkit-backdrop-filter: var(--glass-blur);
		box-shadow: var(--glass-shadow);
		font: inherit;
		color: inherit;
		text-align: left;
		cursor: pointer;
		transform: translateY(0) scale(1);
		opacity: 0;
		animation: badge-in 700ms var(--ease-out) forwards;
		animation-delay: calc(var(--i, 0) * 90ms + 200ms);
		touch-action: manipulation;
		transition:
			transform var(--base) var(--ease-out),
			box-shadow var(--illuminate-speed) var(--ease-out),
			border-color var(--illuminate-speed) var(--ease-out);
	}

	:global(.illuminated) .product-badge {
		box-shadow: var(--glass-shadow), var(--illuminate-glow);
		border-color: rgba(255, 255, 255, 0.18);
	}

	@keyframes badge-in {
		from {
			opacity: 0;
			transform: translateY(28px) scale(0.96);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.product-badge__texture {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		z-index: 0;
		color: rgba(255, 255, 255, 0.55);
		opacity: 0.15;
		mix-blend-mode: screen;
		transition:
			opacity var(--illuminate-speed) var(--ease-out),
			transform 600ms var(--ease-out);
	}

	:global(.illuminated) .product-badge__texture {
		opacity: 0.55;
	}

	:global(.product-badge__texture svg) {
		width: 60%;
		height: 60%;
		display: block;
	}

	.product-badge__body {
		position: relative;
		z-index: 1;
		margin-top: auto;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.product-badge__code {
		font-size: 0.5rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-text);
		opacity: 0.3;
		line-height: 1;
		transition: opacity var(--illuminate-speed) var(--ease-out);
	}

	:global(.illuminated) .product-badge__code {
		opacity: 0.55;
	}

	.product-badge__name {
		font-size: 0.9rem;
		font-weight: 200;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-text);
		opacity: 0.6;
		line-height: 1.2;
		transition: opacity var(--illuminate-speed) var(--ease-out);
	}

	:global(.illuminated) .product-badge__name {
		opacity: 1;
	}

	@media (hover: hover) {
		.product-badge:hover {
			transform: translateY(-3px) scale(1.02);
			border-color: rgba(255, 255, 255, 0.2);
			box-shadow: var(--glass-shadow), var(--illuminate-glow);
		}

		.product-badge:hover .product-badge__texture {
			opacity: 0.42;
			transform: scale(1.04);
		}
	}

	.product-badge:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 4px;
	}

	.product-badge--hidden {
		visibility: hidden;
	}

	.product-badge--dimmed {
		opacity: 0 !important;
		transition: opacity 80ms var(--ease-out);
	}

	@media (prefers-reduced-motion: reduce) {
		.product-badge {
			opacity: 1;
			animation: none;
		}
	}
</style>
