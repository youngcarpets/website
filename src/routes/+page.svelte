<script lang="ts">
	import { onMount } from 'svelte';
	import BrandMark from '$lib/components/BrandMark.svelte';
	import ProductBadge from '$lib/components/ProductBadge.svelte';
	import ExpandedProduct from '$lib/components/ExpandedProduct.svelte';
	import SupplierMarquee from '$lib/components/SupplierMarquee.svelte';
	import { countUp } from '$lib/actions/countUp';
	import { illuminateOnScroll } from '$lib/actions/illuminateOnScroll';
	import { featureProducts } from '$lib/content/products';

	let expandedIndex: number | null = $state(null);
	let hiddenIndex: number | null = $state(null);
	let returningSet: Set<number> = $state(new Set());
	let badgeRect: { x: number; y: number; w: number; h: number } | null = $state(null);
	let textRect: { x: number; y: number } | null = $state(null);
	let iconRect: { x: number; y: number; w: number; h: number } | null = $state(null);
	let gridEl: HTMLDivElement | undefined = $state();

	function openBadge(index: number, e: MouseEvent) {
		const badge = (e.currentTarget as HTMLElement).closest('.products-grid > div');
		if (!badge || !gridEl) return;
		const bRect = badge.getBoundingClientRect();
		const gRect = gridEl.getBoundingClientRect();

		const bodyEl = (e.currentTarget as HTMLElement).querySelector('.product-badge__body');
		const bodyRect = bodyEl?.getBoundingClientRect();

		const svgEl = (e.currentTarget as HTMLElement).querySelector('.product-badge__texture svg');
		const svgBounds = svgEl?.getBoundingClientRect();

		gridEl.style.minHeight = `${gridEl.offsetHeight}px`;

		badgeRect = {
			x: bRect.left - gRect.left,
			y: bRect.top - gRect.top,
			w: bRect.width,
			h: bRect.height
		};
		textRect = bodyRect ? { x: bodyRect.left - gRect.left, y: bodyRect.top - gRect.top } : null;
		iconRect = svgBounds
			? {
					x: svgBounds.left - gRect.left,
					y: svgBounds.top - gRect.top,
					w: svgBounds.width,
					h: svgBounds.height
				}
			: null;
		expandedIndex = index;
		hiddenIndex = index;

		// Scroll products section into view simultaneously with FLIP
		const productsSection = gridEl.closest('#products');
		productsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function closeBadge() {
		const wasExpanded = expandedIndex;
		expandedIndex = null;
		badgeRect = null;
		textRect = null;
		iconRect = null;

		// Strip illumination from all badge wrappers except the selected one
		const wrappers = gridEl ? Array.from(gridEl.querySelectorAll<HTMLElement>(':scope > div')) : [];
		wrappers.forEach((el, i) => {
			if (i !== wasExpanded) el.classList.remove('illuminated');
		});

		// Stagger badges back in sequentially (unlit)
		const indices = featureProducts.map((_, i) => i).filter((i) => i !== wasExpanded);
		returningSet = new Set(indices);
		hiddenIndex = null;

		const FADE_STAGGER = 60;
		indices.forEach((idx, order) => {
			setTimeout(() => {
				returningSet = new Set([...returningSet].filter((i) => i !== idx));
			}, order * FADE_STAGGER);
		});

		// After all badges faded in, re-illuminate sequentially
		const fadeInDone = indices.length * FADE_STAGGER + 200;
		const ILLUMINATE_STAGGER = 50;
		setTimeout(() => {
			const unlitWrappers = wrappers.filter((_, i) => i !== wasExpanded);
			unlitWrappers.forEach((el, order) => {
				setTimeout(() => {
					el.classList.add('illuminated');
				}, order * ILLUMINATE_STAGGER);
			});
			// Clean up grid min-height after all illuminated
			setTimeout(() => {
				if (gridEl) gridEl.style.minHeight = '';
			}, wrappers.length * ILLUMINATE_STAGGER);
		}, fadeInDone);
	}

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
		<p class="hero-blurb">
			Young Carpets Inc. has been trusted to supply and install commercial flooring in Ottawa and
			the surrounding area since 1991.
		</p>
	</div>
</section>

<section id="products" class="products" aria-label="Products">
	<h2 class="section-heading">Products</h2>
	<div class="products-grid" bind:this={gridEl}>
		{#each featureProducts as product, i (product.material)}
			<div use:illuminateOnScroll>
				<ProductBadge
					{product}
					index={i}
					hidden={hiddenIndex === i}
					dimmed={(expandedIndex !== null && expandedIndex !== i) || returningSet.has(i)}
					onclick={(e) => openBadge(i, e)}
				/>
			</div>
		{/each}
		{#if expandedIndex !== null && badgeRect}
			<ExpandedProduct
				product={featureProducts[expandedIndex]!}
				{badgeRect}
				{textRect}
				{iconRect}
				onclose={closeBadge}
			/>
		{/if}
	</div>
</section>
<SupplierMarquee />
<section id="services" class="services" aria-label="Services">
	<p class="services-eyebrow">Supply &middot; Installation &middot; Maintenance</p>
	<h2 class="section-heading">Services</h2>
	<div class="services-grid">
		<div class="service-card">
			<h3 class="service-card__title">Commercial Installation</h3>
			<p class="service-card__text">
				From new construction to renovations &mdash; offices, schools, healthcare facilities, retail
				spaces, gyms, and industrial buildings.
			</p>
		</div>
		<div class="service-card">
			<h3 class="service-card__title">Consultation</h3>
			<p class="service-card__text">
				Material selection and specification for commercial projects, with sample boards and on-site
				mockups for design teams.
			</p>
		</div>
		<div class="service-card">
			<h3 class="service-card__title">Maintenance &amp; Repair</h3>
			<p class="service-card__text">
				Hardwood maintenance, screening and recoats, repairs, and full replacement across the
				National Capital Region.
			</p>
		</div>
		<div class="service-card">
			<h3 class="service-card__title">Seasonal Matting</h3>
			<p class="service-card__text">
				We remove and store your entrance matting at the end of winter, then return it when the
				season comes back around.
			</p>
		</div>
	</div>
</section>

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
		scroll-margin-top: 5rem;
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
		position: relative;
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
			grid-template-columns: repeat(4, 1fr);
			gap: 1rem;
		}
	}

	@media (min-width: 1024px) {
		.products-grid {
			grid-template-columns: repeat(5, 1fr);
			gap: 1rem;
		}
	}

	@media (min-width: 1280px) {
		.products-grid {
			grid-template-columns: repeat(6, 1fr);
		}
	}

	@media (orientation: landscape) and (max-height: 500px) {
		.products-grid {
			grid-template-columns: repeat(4, 1fr);
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

	.hero-blurb {
		font-family: var(--font-body);
		font-size: 1rem;
		font-weight: 350;
		color: var(--color-text-muted);
		max-width: 28ch;
		line-height: 1.6;
		margin-top: 1.25rem;
		text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
		opacity: 0;
		transform: translateY(12px);
		animation: hero-blurb-in 850ms var(--ease-out) 1800ms forwards;
	}

	@keyframes hero-blurb-in {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-blurb {
			opacity: 1;
			transform: none;
			animation: none;
		}
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

	/* --- Services ---------------------------------- */

	.services {
		padding: 2rem 0.75rem;
		max-width: 640px;
		margin: 0 auto;
		scroll-margin-top: 5rem;
	}

	.services-eyebrow {
		font-family: var(--font-body);
		font-size: 0.65rem;
		font-weight: 400;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		text-align: center;
		margin-bottom: 0.25rem;
	}

	.services-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;
	}

	.service-card {
		padding: 1rem 0.75rem;
		border-radius: var(--radius-lg);
		background: rgba(18, 18, 21, 0.18);
		border: 1px solid var(--color-border-glass);
		backdrop-filter: blur(8px) saturate(1.4);
		-webkit-backdrop-filter: blur(8px) saturate(1.4);
		box-shadow: var(--glass-shadow);
	}

	.service-card__title {
		font-family: var(--font-body);
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-text);
		margin: 0 0 0.4rem;
	}

	.service-card__text {
		font-size: 0.72rem;
		font-weight: 400;
		line-height: 1.45;
		color: var(--color-text-muted);
		margin: 0;
	}

	@media (min-width: 521px) {
		.services {
			padding: 4rem 1.5rem;
		}

		.services-grid {
			gap: 0.75rem;
		}

		.service-card {
			padding: 1.25rem 1rem;
		}

		.service-card__title {
			font-size: 0.8rem;
		}

		.service-card__text {
			font-size: 0.82rem;
		}
	}
</style>
