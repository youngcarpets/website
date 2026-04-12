<script lang="ts">
	import '$lib/styles/young-carpets-tokens.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	// ── Product data ──
	type Product = {
		name: string;
		slug: string;
		oneLiner: string;
		environments: string;
		detail: string;
		category: string;
	};

	const categories = [
		{ id: 'soft', label: 'Soft Flooring', icon: '◠' },
		{ id: 'resilient', label: 'Resilient', icon: '◈' },
		{ id: 'hard', label: 'Hard Surface', icon: '◇' },
		{ id: 'natural', label: 'Natural', icon: '◎' },
		{ id: 'specialty', label: 'Specialty', icon: '⬡' },
		{ id: 'accessories', label: 'Accessories', icon: '┃' },
	] as const;

	const products: Product[] = [
		// ── Soft Flooring ──
		{
			name: 'Carpet Tile',
			slug: 'carpet-tile',
			oneLiner: 'Modular 24×24 and 18×36 squares — replace one tile, not the whole floor.',
			environments: 'Offices, schools, airports',
			detail: 'The most specified commercial carpet format. Individual tiles swap out for spot repairs. Endless pattern layouts from a single SKU.',
			category: 'soft',
		},
		{
			name: 'Broadloom',
			slug: 'broadloom',
			oneLiner: 'Wall-to-wall rolls in 12\' widths. Acoustic dampening built in.',
			environments: 'Hotels, theatres, executive offices',
			detail: 'Traditional roll carpet for large seamless expanses. Superior sound absorption. Power-stretch or direct-glue installation.',
			category: 'soft',
		},
		// ── Resilient ──
		{
			name: 'Luxury Vinyl (LVT)',
			slug: 'lvt',
			oneLiner: 'Multi-layer vinyl tile and plank. Waterproof. The most-specified resilient floor today.',
			environments: 'Healthcare, retail, offices',
			detail: 'Realistic wood and stone visuals with zero moisture risk. Rigid-core or flexible options. Dimensionally stable over concrete slabs.',
			category: 'resilient',
		},
		{
			name: 'VCT',
			slug: 'vct',
			oneLiner: 'Rigid 12×12 limestone-filler tile. Strip-and-wax maintenance.',
			environments: 'Schools, institutions, cafeterias',
			detail: 'The institutional workhorse. Lowest upfront cost per square foot. Decades of life with a regular strip-and-wax program.',
			category: 'resilient',
		},
		{
			name: 'Homogeneous Sheet (SCT)',
			slug: 'sct',
			oneLiner: 'Solid vinyl through full thickness. Heat-welded seams for zero-gap hygiene.',
			environments: 'Operating theatres, clean rooms, pharma',
			detail: 'Color goes all the way through — scratches don\'t show a different layer. Heat-welded seams create a monolithic, impervious surface.',
			category: 'resilient',
		},
		{
			name: 'Sheet Vinyl',
			slug: 'sheet-vinyl',
			oneLiner: 'Continuous 6–12\' rolls. Heat-welded, flash-coved to walls.',
			environments: 'Hospitals, kitchens, labs',
			detail: 'Seamless coverage for infection-control areas. Flash coving eliminates wall-floor joints. Includes Altro safety flooring options.',
			category: 'resilient',
		},
		{
			name: 'Rubber',
			slug: 'rubber',
			oneLiner: 'Vulcanized rubber for impact absorption. Often recycled tire content.',
			environments: 'Gyms, hospitals, industrial',
			detail: 'Extreme durability and slip resistance. Available in tiles, rolls, and interlocking formats. Sustainable recycled-rubber options available.',
			category: 'resilient',
		},
		{
			name: 'Safety Flooring',
			slug: 'safety',
			oneLiner: 'Altro-style slip-resistant sheet with embedded aggregate particles.',
			environments: 'Commercial kitchens, pool decks, wet areas',
			detail: 'Sustained slip resistance even when wet, greasy, or contaminated. Meets HSE guidelines for barefoot and shod traffic zones.',
			category: 'resilient',
		},
		{
			name: 'Marmoleum / Linoleum',
			slug: 'marmoleum',
			oneLiner: 'Natural linseed-oil-based sheet. Hypoallergenic, carbon-neutral.',
			environments: 'Schools, healthcare, museums',
			detail: 'Forbo Marmoleum — made from flax, jute, limestone, and rosin. Naturally antibacterial. LEED-contributing and carbon-neutral at manufacture.',
			category: 'resilient',
		},
		// ── Hard Surface ──
		{
			name: 'Ceramic / Porcelain',
			slug: 'ceramic',
			oneLiner: 'Slip-rated tile for wet areas, lobbies, and entrances. 25–50+ year life.',
			environments: 'Lobbies, washrooms, entrances',
			detail: 'The hardest-wearing finish for high-moisture and high-traffic zones. Porcelain body absorbs less than 0.5% water. Huge format range.',
			category: 'hard',
		},
		{
			name: 'Epoxy / Resinous',
			slug: 'epoxy',
			oneLiner: 'Seamless resinous coating for chemical resistance and easy washdown.',
			environments: 'Labs, mech rooms, food processing',
			detail: 'Applied as a liquid, cures to a seamless monolith. Chemical-resistant, antimicrobial, and available in any color. Self-leveling or broadcast-chip finishes.',
			category: 'hard',
		},
		// ── Natural ──
		{
			name: 'Hardwood',
			slug: 'hardwood',
			oneLiner: 'Solid and engineered wood. Refinishable for decades of life.',
			environments: 'Executive offices, showrooms, boardrooms',
			detail: 'White oak, maple, walnut — solid or engineered over concrete. Sand and refinish multiple times over a 30+ year lifespan.',
			category: 'natural',
		},
		{
			name: 'Bamboo',
			slug: 'bamboo',
			oneLiner: 'Strand-woven bamboo — harder than most hardwoods. LEED credit eligible.',
			environments: 'Offices, retail, sustainable builds',
			detail: 'Rapid-renewable grass compressed to extreme hardness (>3,000 Janka). Dimensionally stable. Formaldehyde-free options available.',
			category: 'natural',
		},
		{
			name: 'Cork',
			slug: 'cork',
			oneLiner: 'Harvested bark with built-in sound and thermal insulation.',
			environments: 'Libraries, museums, senior living',
			detail: 'The bark regenerates every 9 years — no tree is felled. Natural cushion reduces fatigue. Warm underfoot. Excellent acoustic dampening.',
			category: 'natural',
		},
		{
			name: 'Reclaimed Wood',
			slug: 'reclaimed',
			oneLiner: 'Salvaged barn board and old-growth timber. One-of-a-kind character.',
			environments: 'Heritage restorations, breweries, lofts',
			detail: 'Sourced from decommissioned barns, factories, and warehouses. Each plank carries decades of patina. Chain-of-custody documentation available.',
			category: 'natural',
		},
		// ── Specialty ──
		{
			name: 'ESD / Static Control',
			slug: 'esd',
			oneLiner: 'Static-dissipative tile for sensitive electronics environments.',
			environments: 'Server rooms, electronics mfg, telecom',
			detail: 'Permanently conductive — no topical treatments to reapply. Meets ANSI/ESD S20.20 and ATIS-0600321. Grounding strips included.',
			category: 'specialty',
		},
		{
			name: 'Raised Access',
			slug: 'raised-access',
			oneLiner: 'Pedestal-mounted panels for underfloor cable management.',
			environments: 'Data centres, trading floors, control rooms',
			detail: 'Steel or calcium-sulfate panels on adjustable pedestals. Instant access to power, data, and HVAC beneath the floor. Finished with carpet tile, LVT, or HPL.',
			category: 'specialty',
		},
		{
			name: 'Matting / Walk-Off',
			slug: 'matting',
			oneLiner: 'Entrance systems that stop 80%+ of tracked-in soil at the door.',
			environments: 'Every commercial entrance',
			detail: 'Recessed aluminum frames, roll goods, and surface mats. Scrapes and absorbs moisture in the first 6–12 feet. Dramatically reduces interior maintenance costs.',
			category: 'specialty',
		},
		// ── Accessories ──
		{
			name: 'Stair Treads',
			slug: 'stair-treads',
			oneLiner: 'Rubber and vinyl treads with integrated slip-resistant nosings.',
			environments: 'Every institutional stairwell',
			detail: 'Full-coverage treads or overlay nosings. Color-contrasted edges meet building code visibility requirements. Rubber or vinyl to match adjacent flooring.',
			category: 'accessories',
		},
		{
			name: 'Wall Base',
			slug: 'wall-base',
			oneLiner: '4″ and 6″ coved or straight vinyl and rubber base trim.',
			environments: 'Every commercial interior',
			detail: 'The finishing detail that makes a floor installation look complete. Coved profile for seamless wall-floor transition. Hundreds of color matches.',
			category: 'accessories',
		},
	];

	// ── Interactive state ──
	let activeCategory = $state<string | null>(null);
	let expandedProduct = $state<string | null>(null);

	const filteredProducts = $derived(
		activeCategory ? products.filter((p) => p.category === activeCategory) : products
	);

	function toggleProduct(slug: string) {
		expandedProduct = expandedProduct === slug ? null : slug;
	}

	function setCategory(id: string | null) {
		activeCategory = activeCategory === id ? null : id;
		expandedProduct = null;
	}

	function getCategoryLabel(id: string): string {
		return categories.find((c) => c.id === id)?.label ?? id;
	}
</script>

<svelte:head>
	<title>Products — Young Carpets Inc.</title>
	<meta name="description" content="Commercial flooring products installed by Young Carpets Inc. in Ottawa. Carpet, LVT, hardwood, rubber, ceramic, and 15+ specialty systems." />
</svelte:head>

<div class="yc-page dev-products">
	<!-- ── Nav ── -->
	<nav class="nav" aria-label="Product page navigation">
		<a href="/young-carpets" class="nav__brand">
			<span class="nav__wordmark">YOUNG</span>
		</a>
		<div class="nav__actions">
			<ThemeToggle />
		</div>
	</nav>

	<!-- ── Hero ── -->
	<header class="hero">
		<p class="hero__eyebrow">Commercial Flooring</p>
		<h1 class="hero__title">Every Floor.<br />Installed Right.</h1>
		<p class="hero__sub">
			20+ flooring systems for offices, institutions, healthcare, and industrial — supplied and installed across Ottawa since 1991.
		</p>
	</header>

	<!-- ── Category filter pills ── -->
	<section class="filters" aria-label="Filter by category">
		<div class="filters__track">
			<button
				class="filter-pill"
				class:active={activeCategory === null}
				onclick={() => setCategory(null)}
			>All</button>
			{#each categories as cat}
				<button
					class="filter-pill"
					class:active={activeCategory === cat.id}
					onclick={() => setCategory(cat.id)}
				>
					<span class="filter-pill__icon">{cat.icon}</span>
					{cat.label}
				</button>
			{/each}
		</div>
	</section>

	<!-- ── Product listing ── -->
	<main class="product-grid" aria-label="Flooring products">
		{#each filteredProducts as product (product.slug)}
			{@const isOpen = expandedProduct === product.slug}
			<article
				class="card"
				class:card--open={isOpen}
			>
				<button
					class="card__header"
					onclick={() => toggleProduct(product.slug)}
					aria-expanded={isOpen}
				>
					<div class="card__top">
						<span class="card__badge">{getCategoryLabel(product.category)}</span>
						<span class="card__chevron" class:card__chevron--open={isOpen}>&#x203A;</span>
					</div>
					<h2 class="card__name">{product.name}</h2>
					<p class="card__oneliner">{product.oneLiner}</p>
					<p class="card__envs">
						<span class="card__envs-label">Where:</span> {product.environments}
					</p>
				</button>

				{#if isOpen}
					<div class="card__detail">
						<p>{product.detail}</p>
					</div>
				{/if}
			</article>
		{/each}
	</main>

	<!-- ── CTA ── -->
	<section class="cta">
		<div class="cta__glass">
			<h2 class="cta__heading">Ready to Spec Your Next Project?</h2>
			<p class="cta__sub">
				We'll walk the site, recommend the right system, and quote it — no obligation.
			</p>
			<div class="cta__actions">
				<a href="tel:6137442744" class="cta__btn cta__btn--primary">
					<span class="cta__btn-icon">&#9742;</span>
					613-744-2744
				</a>
				<a href="mailto:info@youngcarpets.com" class="cta__btn cta__btn--secondary">
					info@youngcarpets.com
				</a>
			</div>
		</div>
	</section>

	<!-- ── Footer ── -->
	<footer class="foot">
		<p class="foot__legal">
			&copy; {new Date().getFullYear()} Young Carpets Inc. &middot; Ottawa, ON &middot;
			<a href="/young-carpets">Main Site</a>
		</p>
	</footer>
</div>

<style>
	/* ── Reset + page shell ── */
	.dev-products {
		min-height: 100vh;
		background: var(--yc-ink);
		color: var(--yc-griege-text);
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
		line-height: 1.55;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		overflow-x: hidden;
	}

	/* ── Nav ── */
	.nav {
		position: sticky;
		top: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 20px;
		background: var(--yc-ink-55);
		backdrop-filter: blur(20px) saturate(150%);
		-webkit-backdrop-filter: blur(20px) saturate(150%);
		border-bottom: 1px solid var(--yc-griege-08);
	}

	.nav__brand {
		text-decoration: none;
		color: var(--yc-maple-gold);
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.nav__wordmark {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 15px;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
	}

	.nav__actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	/* ── Hero ── */
	.hero {
		padding: 56px 20px 32px;
		max-width: 640px;
		margin: 0 auto;
		text-align: center;
	}

	.hero__eyebrow {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--yc-maple-gold);
		margin-bottom: 12px;
		opacity: 0.85;
	}

	.hero__title {
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
		font-size: clamp(28px, 7vw, 44px);
		font-weight: 700;
		line-height: 1.1;
		color: var(--yc-maple-gold);
		margin: 0 0 16px;
		letter-spacing: -0.02em;
	}

	.hero__sub {
		font-size: 15px;
		line-height: 1.6;
		color: var(--yc-griege-text);
		max-width: 480px;
		margin: 0 auto;
		opacity: 0.8;
	}

	/* ── Filter pills ── */
	.filters {
		padding: 0 12px;
		margin-bottom: 24px;
		max-width: 900px;
		margin-left: auto;
		margin-right: auto;
	}

	.filters__track {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		padding: 4px 0 12px;
	}

	.filters__track::-webkit-scrollbar {
		display: none;
	}

	.filter-pill {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 7px 14px;
		border: 1px solid var(--yc-griege-18);
		border-radius: 100px;
		background: var(--yc-ink-45);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		color: var(--yc-griege-text);
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		cursor: pointer;
		transition: all 180ms ease;
		white-space: nowrap;
	}

	.filter-pill:hover {
		border-color: var(--yc-griege-35);
		background: var(--yc-ink-55);
	}

	.filter-pill.active {
		border-color: var(--yc-maple-gold-45);
		color: var(--yc-maple-gold);
		background: var(--yc-maple-gold-08);
		box-shadow: 0 0 12px var(--yc-maple-gold-10);
	}

	.filter-pill__icon {
		font-size: 12px;
		opacity: 0.7;
	}

	/* ── Product grid ── */
	.product-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
		padding: 0 16px 32px;
		max-width: 900px;
		margin: 0 auto;
	}

	@media (min-width: 600px) {
		.product-grid {
			grid-template-columns: 1fr 1fr;
			gap: 16px;
			padding: 0 24px 48px;
		}
	}

	@media (min-width: 900px) {
		.product-grid {
			grid-template-columns: 1fr 1fr 1fr;
		}
	}

	/* ── Card ── */
	.card {
		border: 1px solid var(--yc-griege-18);
		border-radius: 14px;
		background: var(--yc-ink-45);
		backdrop-filter: blur(12px) saturate(140%);
		-webkit-backdrop-filter: blur(12px) saturate(140%);
		box-shadow:
			inset 0 var(--yc-edge-y, 1px) 0 var(--yc-shimmer-08),
			0 2px 8px var(--yc-shadow-18);
		transition: border-color 180ms ease, box-shadow 250ms ease;
		overflow: hidden;
	}

	.card:hover {
		border-color: var(--yc-griege-28);
		box-shadow:
			inset 0 var(--yc-edge-y, 1px) 0 var(--yc-shimmer-12),
			0 4px 20px var(--yc-shadow-30);
	}

	.card--open {
		border-color: var(--yc-maple-gold-35);
		box-shadow:
			inset 0 var(--yc-edge-y, 1px) 0 var(--yc-shimmer-14),
			0 4px 24px var(--yc-shadow-35),
			0 0 20px var(--yc-maple-gold-08);
	}

	.card__header {
		display: block;
		width: 100%;
		text-align: left;
		padding: 16px;
		border: none;
		background: transparent;
		cursor: pointer;
		color: inherit;
		font: inherit;
		line-height: inherit;
	}

	.card__top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	.card__badge {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--yc-maple-gold-70);
		padding: 3px 8px;
		border: 1px solid var(--yc-maple-gold-14);
		border-radius: 4px;
		background: var(--yc-maple-gold-08);
	}

	.card__chevron {
		font-size: 20px;
		color: var(--yc-griege-50);
		transition: transform 200ms ease;
		line-height: 1;
	}

	.card__chevron--open {
		transform: rotate(90deg);
		color: var(--yc-maple-gold);
	}

	.card__name {
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
		font-size: 17px;
		font-weight: 650;
		color: var(--yc-shimmer-rgb, 255, 248, 235);
		color: rgba(var(--yc-shimmer-rgb), 0.92);
		margin: 0 0 6px;
		letter-spacing: -0.01em;
	}

	.card__oneliner {
		font-size: 13px;
		line-height: 1.5;
		color: var(--yc-griege-text);
		margin: 0 0 8px;
		opacity: 0.85;
	}

	.card__envs {
		font-size: 12px;
		color: var(--yc-griege-50);
		margin: 0;
	}

	.card__envs-label {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--yc-griege-35);
	}

	.card__detail {
		padding: 0 16px 16px;
		border-top: 1px solid var(--yc-griege-08);
		margin-top: 0;
	}

	.card__detail p {
		margin: 12px 0 0;
		font-size: 13px;
		line-height: 1.6;
		color: var(--yc-griege-text);
		opacity: 0.75;
	}

	/* ── CTA section ── */
	.cta {
		padding: 48px 16px 40px;
		max-width: 640px;
		margin: 0 auto;
	}

	.cta__glass {
		text-align: center;
		padding: 32px 24px;
		border: 1px solid var(--yc-griege-18);
		border-radius: 18px;
		background: var(--yc-ink-45);
		backdrop-filter: blur(16px) saturate(150%);
		-webkit-backdrop-filter: blur(16px) saturate(150%);
		box-shadow:
			inset 0 var(--yc-edge-y, 1px) 0 var(--yc-shimmer-10),
			0 4px 24px var(--yc-shadow-30);
	}

	.cta__heading {
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
		font-size: clamp(20px, 5vw, 28px);
		font-weight: 700;
		color: var(--yc-maple-gold);
		margin: 0 0 8px;
		letter-spacing: -0.01em;
	}

	.cta__sub {
		font-size: 14px;
		color: var(--yc-griege-text);
		margin: 0 0 24px;
		opacity: 0.8;
		line-height: 1.55;
	}

	.cta__actions {
		display: flex;
		flex-direction: column;
		gap: 10px;
		align-items: center;
	}

	@media (min-width: 480px) {
		.cta__actions {
			flex-direction: row;
			justify-content: center;
		}
	}

	.cta__btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 12px 24px;
		border-radius: 10px;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-decoration: none;
		transition: all 180ms ease;
		white-space: nowrap;
	}

	.cta__btn--primary {
		background: var(--yc-maple-gold);
		color: var(--yc-ink);
		box-shadow: 0 2px 12px var(--yc-maple-gold-35);
	}

	.cta__btn--primary:hover {
		box-shadow: 0 4px 20px var(--yc-maple-gold-45);
		transform: translateY(-1px);
	}

	.cta__btn--secondary {
		border: 1px solid var(--yc-griege-25);
		color: var(--yc-griege-text);
		background: var(--yc-ink-45);
	}

	.cta__btn--secondary:hover {
		border-color: var(--yc-griege-35);
		background: var(--yc-ink-55);
	}

	.cta__btn-icon {
		font-size: 16px;
	}

	/* ── Footer ── */
	.foot {
		padding: 24px 20px 32px;
		text-align: center;
		border-top: 1px solid var(--yc-griege-06);
	}

	.foot__legal {
		font-size: 12px;
		color: var(--yc-griege-35);
		margin: 0;
	}

	.foot__legal a {
		color: var(--yc-griege-50);
		text-decoration: none;
	}

	.foot__legal a:hover {
		color: var(--yc-maple-gold);
	}
</style>
