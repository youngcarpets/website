<script lang="ts">
	import { onMount } from 'svelte';
	import BrandMark from '$lib/components/BrandMark.svelte';
	import ProductBadge from '$lib/components/ProductBadge.svelte';
	import ProductModal from '$lib/components/ProductModal.svelte';
	import SupplierMarquee from '$lib/components/SupplierMarquee.svelte';
	import { countUp } from '$lib/actions/countUp';
	import { illuminateOnScroll } from '$lib/actions/illuminateOnScroll';
	import { featureProducts, type Product } from '$lib/content/products';

	let openProduct: Product | null = $state(null);

	let wordmarkReady = $state(false);

	onMount(() => {
		let cancelled = false;
		const start = async () => {
			try {
				if ('fonts' in document) {
					await document.fonts.load('5.5rem "Square721Nav"');
					await document.fonts.ready;
				}
			} catch {
				/* reveal anyway if font load fails */
			}
			if (!cancelled) wordmarkReady = true;
		};
		requestAnimationFrame(start);
		return () => {
			cancelled = true;
		};
	});
</script>

<svelte:head>
	<title>Young Carpets</title>
	<meta name="description" content="Young Carpets — flooring in Ontario." />
</svelte:head>

<section class="hero">
	<div class="hero-title">
		<BrandMark size="hero" animated ready={wordmarkReady} tag="h1" />
	</div>
</section>

<section id="products" class="products" aria-label="Products">
	<h2 class="section-heading">Products</h2>
	<div class="products-grid">
		{#each featureProducts as product, i (product.material)}
			<div use:illuminateOnScroll>
				<ProductBadge {product} index={i} onclick={() => (openProduct = featureProducts[0]!)} />
			</div>
		{/each}
	</div>
</section>

{#if openProduct}
	<ProductModal product={openProduct} onclose={() => (openProduct = null)} />
{/if}
<section id="services" class="section-placeholder" aria-label="Services"></section>
<SupplierMarquee />

<section id="contact" class="section-placeholder" aria-label="Contact">
	<div class="stats-bar">
		<div class="stats-counters">
			<div class="stats-item">
				<div
					class="stats-number"
					use:countUp
					data-target="35"
					data-suffix="+"
					aria-label="35 plus years in business"
				>
					0+
				</div>
				<div class="stats-label">Years in business<br />(est. 1991)</div>
			</div>
			<div class="stats-item">
				<div
					class="stats-number"
					use:countUp
					data-target="50000"
					data-suffix="+"
					aria-label="50,000 plus jobs completed"
				>
					0+
				</div>
				<div class="stats-label">Jobs completed across the region</div>
			</div>
			<div class="stats-item">
				<div
					class="stats-number"
					use:countUp
					data-target="250"
					data-suffix="+"
					aria-label="250 plus combined years of experience"
				>
					0+
				</div>
				<div class="stats-label">Combined years of experience</div>
			</div>
		</div>
	</div>
</section>

<style>
	.section-placeholder {
		min-height: 0;
	}

	/* --- Products ----------------------------------- */

	.products {
		padding: 2rem 0.75rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.section-heading {
		font-family: var(--font-body);
		font-size: 1.5rem;
		font-weight: 200;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: var(--color-text);
		text-align: center;
		margin-bottom: 1rem;
	}

	.products-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
	}

	@media (min-width: 521px) {
		.products {
			padding: 4rem 1.5rem;
		}

		.section-heading {
			font-size: 2.5rem;
			margin-bottom: 2.5rem;
		}

		.products-grid {
			grid-template-columns: repeat(4, 1fr);
			gap: 0.75rem;
		}
	}

	@media (min-width: 768px) {
		.products-grid {
			grid-template-columns: repeat(5, 1fr);
			gap: 1rem;
		}
	}

	@media (min-width: 1024px) {
		.products-grid {
			grid-template-columns: repeat(6, 1fr);
			gap: 1rem;
		}
	}

	.hero {
		min-height: 52vh;
		display: grid;
		place-items: center;
		padding: 6rem 1rem 2rem;
	}

	.hero-title {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	/* --- Stats / Counters ----------------------------------- */

	.stats-bar {
		display: flex;
		justify-content: center;
		padding: 2rem 1rem;
		max-width: 640px;
		margin: 0 auto;
	}

	.stats-counters {
		display: flex;
		gap: 0.5rem;
		width: 100%;
	}

	.stats-item {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 1.25rem 0.5rem;
		border-radius: var(--radius-lg);
		background: rgba(18, 18, 21, 0.18);
		border: 1px solid var(--color-border-glass);
		backdrop-filter: blur(8px) saturate(1.4);
		-webkit-backdrop-filter: blur(8px) saturate(1.4);
		box-shadow: var(--glass-shadow);
	}

	.stats-number {
		font-family: var(--font-body);
		font-size: 1.3rem;
		font-weight: 200;
		letter-spacing: 0.02em;
		color: var(--color-text);
		line-height: 1.1;
		white-space: nowrap;
	}

	.stats-label {
		font-size: 0.65rem;
		font-weight: 400;
		color: var(--color-text-muted);
		margin-top: 0.35rem;
		line-height: 1.3;
	}

	@media (min-width: 521px) {
		.stats-item {
			padding: 1.5rem 1rem;
		}

		.stats-number {
			font-size: 2rem;
			letter-spacing: 0.04em;
		}

		.stats-label {
			font-size: 0.8rem;
			margin-top: 0.5rem;
			line-height: 1.4;
		}

		.stats-counters {
			gap: 1rem;
		}
	}
</style>
