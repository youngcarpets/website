<script lang="ts">
	import type { Product } from '$lib/content/products';

	interface Props {
		product: Product;
		index?: number;
		onclick: () => void;
	}

	let { product, index = 0, onclick }: Props = $props();
</script>

<button
	type="button"
	class="product-badge"
	style="--i: {index};"
	aria-label="View {product.name} details"
	{onclick}
>
	<div class="product-badge__texture" aria-hidden="true">
		{#if product.material === 'carpet-tile'}
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				{#each [0, 1, 2] as row (row)}
					{#each [0, 1, 2] as col (col)}
						<rect
							x={10 + col * 28}
							y={10 + row * 28}
							width="24"
							height="24"
							rx="3"
							fill="none"
							stroke="currentColor"
							stroke-width="0.8"
						/>
					{/each}
				{/each}
			</svg>
		{:else if product.material === 'lvt'}
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				{#each [0, 1, 2, 3] as row (row)}
					{#each [0, 1] as col (col)}
						<rect
							x={12 + col * 40}
							y={8 + row * 24 + (col % 2 === 1 ? 12 : 0)}
							width="36"
							height="20"
							rx="2"
							fill="none"
							stroke="currentColor"
							stroke-width="0.7"
						/>
					{/each}
				{/each}
			</svg>
		{:else if product.material === 'carpet'}
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				{#each Array.from({ length: 12 }, (__, idx) => idx) as i (i)}
					<line
						x1={15 + i * 6}
						y1={85 - [38, 22, 45, 30, 48, 15, 42, 28, 50, 35, 20, 40][i]!}
						x2={15 + i * 6}
						y2="88"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				{/each}
			</svg>
		{:else if product.material === 'ceramic'}
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				{#each [0, 1, 2] as row (row)}
					{#each [0, 1, 2] as col (col)}
						<rect
							x={10 + col * 28}
							y={10 + row * 28}
							width="24"
							height="24"
							rx="1"
							fill="none"
							stroke="currentColor"
							stroke-width="0.6"
							transform={row === 1 && col === 1 ? 'rotate(45 34 34)' : ''}
						/>
					{/each}
				{/each}
			</svg>
		{:else if product.material === 'rubber'}
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				{#each Array.from({ length: 36 }, (__, idx) => idx) as i (i)}
					<circle
						cx={15 + (i % 6) * 14}
						cy={15 + Math.floor(i / 6) * 14}
						r="2"
						fill="currentColor"
					/>
				{/each}
			</svg>
		{:else if product.material === 'matting'}
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				{#each [0, 1, 2, 3] as row (row)}
					<line
						x1="10"
						y1={20 + row * 20}
						x2="90"
						y2={20 + row * 20}
						stroke="currentColor"
						stroke-width="1.5"
					/>
				{/each}
				{#each [0, 1, 2, 3] as col (col)}
					<line
						x1={20 + col * 20}
						y1="10"
						x2={20 + col * 20}
						y2="90"
						stroke="currentColor"
						stroke-width="1.5"
					/>
				{/each}
			</svg>
		{:else if product.material === 'hardwood'}
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				{#each [0, 1, 2, 3] as row (row)}
					<rect
						x="10"
						y={12 + row * 22}
						width={60 + row * 8}
						height="18"
						rx="2"
						fill="none"
						stroke="currentColor"
						stroke-width="0.7"
					/>
				{/each}
			</svg>
		{:else if product.material === 'sheet'}
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<rect
					x="10"
					y="30"
					width="80"
					height="60"
					rx="2"
					fill="none"
					stroke="currentColor"
					stroke-width="0.7"
				/>
				<path d="M10 30 Q10 15 25 15 L25 30" fill="none" stroke="currentColor" stroke-width="0.7" />
				<line
					x1="50"
					y1="30"
					x2="50"
					y2="90"
					stroke="currentColor"
					stroke-width="0.5"
					stroke-dasharray="2 3"
				/>
			</svg>
		{:else}
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<rect
					x="15"
					y="15"
					width="30"
					height="30"
					rx="3"
					fill="none"
					stroke="currentColor"
					stroke-width="0.7"
				/>
				<rect
					x="55"
					y="15"
					width="30"
					height="30"
					rx="3"
					fill="none"
					stroke="currentColor"
					stroke-width="0.7"
				/>
				<rect
					x="15"
					y="55"
					width="30"
					height="30"
					rx="3"
					fill="none"
					stroke="currentColor"
					stroke-width="0.7"
				/>
				<rect
					x="55"
					y="55"
					width="30"
					height="30"
					rx="3"
					fill="none"
					stroke="currentColor"
					stroke-width="0.7"
				/>
				<text x="50" y="54" text-anchor="middle" font-size="14" fill="currentColor">+</text>
			</svg>
		{/if}
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
		transition:
			transform var(--base) var(--ease-out),
			box-shadow var(--base) var(--ease-out),
			border-color var(--base) var(--ease-out);
		opacity: 0;
		animation: badge-in 700ms var(--ease-out) forwards;
		animation-delay: calc(var(--i, 0) * 90ms + 200ms);
		touch-action: manipulation;
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
		opacity: 0.22;
		mix-blend-mode: screen;
		transition:
			opacity 500ms var(--ease-out),
			transform 600ms var(--ease-out);
	}

	.product-badge__texture svg {
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
		opacity: 0.4;
		line-height: 1;
	}

	.product-badge__name {
		font-size: 0.9rem;
		font-weight: 200;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-text);
		line-height: 1.2;
	}

	@media (hover: hover) {
		.product-badge:hover {
			transform: translateY(-3px) scale(1.02);
			border-color: rgba(255, 255, 255, 0.15);
			box-shadow:
				inset 0 1px 0 rgba(255, 255, 255, 0.12),
				0 4px 12px rgba(0, 0, 0, 0.35);
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

	@media (prefers-reduced-motion: reduce) {
		.product-badge {
			opacity: 1;
			animation: none;
		}
	}
</style>
