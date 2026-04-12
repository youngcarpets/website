<!--
	Young Carpets V6 — "Greatest Hits"
	The definitive variant. Cherry-picked from V1–V5:
	  V1 building-type navigator, V2 visual magazine feel,
	  V3 need-based filter pills, V4 process/portfolio/advisor,
	  V5 light-mode contrast fixes.
	Pure CSS animations. IntersectionObserver reveals. No jank.
	2026-04-09
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import DevColorPicker from '../../components/DevColorPicker.svelte';

	/* ── Theme ── */
	let dark = $state(true);
	function toggleTheme() { dark = !dark; }

	/* ── Font Load Gate ── */
	let fontLoaded = $state(false);
	onMount(() => {
		if (document.fonts) {
			document.fonts.load('1em Square721').then(() => { fontLoaded = true; }).catch(() => { fontLoaded = true; });
			setTimeout(() => { fontLoaded = true; }, 2500);
		} else {
			setTimeout(() => { fontLoaded = true; }, 400);
		}
	});

	/* ── Intersection Observer Reveals ── */
	let revealNodes: HTMLElement[] = [];
	onMount(() => {
		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReduced) {
			revealNodes.forEach(n => n.classList.add('revealed'));
			return;
		}
		const io = new IntersectionObserver((entries) => {
			entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
		}, { threshold: 0.12 });
		revealNodes.forEach(n => io.observe(n));
		return () => io.disconnect();
	});
	function reveal(node: HTMLElement) { revealNodes.push(node); }

	/* ── Counter Animation ── */
	let counterEls: { el: HTMLElement; target: number; suffix: string }[] = [];
	onMount(() => {
		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const io = new IntersectionObserver((entries) => {
			entries.forEach(e => {
				if (!e.isIntersecting) return;
				const rec = counterEls.find(c => c.el === e.target);
				if (!rec) return;
				io.unobserve(e.target);
				if (prefersReduced) { rec.el.textContent = rec.target + rec.suffix; return; }
				let start = 0;
				const dur = 1600;
				const t0 = performance.now();
				function tick(now: number) {
					const p = Math.min((now - t0) / dur, 1);
					const ease = 1 - Math.pow(1 - p, 3);
					rec!.el.textContent = Math.round(ease * rec!.target) + rec!.suffix;
					if (p < 1) requestAnimationFrame(tick);
				}
				requestAnimationFrame(tick);
			});
		}, { threshold: 0.3 });
		counterEls.forEach(c => io.observe(c.el));
		return () => io.disconnect();
	});
	function counter(node: HTMLElement, opts: { target: number; suffix?: string }) {
		counterEls.push({ el: node, target: opts.target, suffix: opts.suffix ?? '' });
		node.textContent = '0' + (opts.suffix ?? '');
	}

	/* ── Smooth Scroll ── */
	function scrollTo(id: string) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	}

	/* ── Mobile Nav ── */
	let mobileNav = $state(false);

	/* ── Products ── */
	type Product = {
		name: string; desc: string; needs: string[]; buildings: string[];
	};
	const products: Product[] = [
		{ name: 'Carpet Tile', desc: 'Modular squares. Replace single tiles, not entire floors.', needs: ['Quiet', 'Green'], buildings: ['Office', 'Education'] },
		{ name: 'Broadloom', desc: 'Wall-to-wall luxury. Seamless comfort underfoot.', needs: ['Quiet', 'Comfort'], buildings: ['Hospitality', 'Office'] },
		{ name: 'LVT', desc: 'Luxury vinyl tile. Wood/stone looks, zero maintenance.', needs: ['Waterproof', 'Tough'], buildings: ['Healthcare', 'Retail'] },
		{ name: 'VCT', desc: 'Vinyl composition tile. Tough, affordable, classic.', needs: ['Tough', 'Budget'], buildings: ['Education', 'Retail'] },
		{ name: 'SCT', desc: 'Sports court tile. Built for impact and traction.', needs: ['Tough', 'Safety'], buildings: ['Recreation', 'Education'] },
		{ name: 'Sheet Vinyl', desc: 'Seamless roll goods. Zero seams, total hygiene.', needs: ['Waterproof', 'Safety'], buildings: ['Healthcare', 'Lab'] },
		{ name: 'Safety Flooring', desc: 'R10+ slip resistance for wet zones.', needs: ['Safety', 'Waterproof'], buildings: ['Healthcare', 'Food Service'] },
		{ name: 'Marmoleum', desc: 'Natural linoleum. Flax, jute, limestone — alive.', needs: ['Green', 'Quiet'], buildings: ['Education', 'Office'] },
		{ name: 'Ceramic', desc: 'Porcelain and ceramic tile. Timeless, hard-wearing.', needs: ['Waterproof', 'Tough'], buildings: ['Retail', 'Hospitality'] },
		{ name: 'Epoxy', desc: 'Seamless resinous coating. Industrial strength.', needs: ['Tough', 'Safety'], buildings: ['Industrial', 'Lab'] },
		{ name: 'Hardwood', desc: 'Solid and engineered wood. Warmth and prestige.', needs: ['Comfort', 'Green'], buildings: ['Hospitality', 'Office'] },
		{ name: 'Bamboo', desc: 'Rapid-renewable hardwood alternative.', needs: ['Green', 'Tough'], buildings: ['Office', 'Education'] },
		{ name: 'Cork', desc: 'Sound-dampening, warm, sustainable.', needs: ['Quiet', 'Green', 'Comfort'], buildings: ['Office', 'Education'] },
		{ name: 'Reclaimed Wood', desc: 'Salvaged timber. Character, history, sustainability.', needs: ['Green', 'Comfort'], buildings: ['Hospitality', 'Retail'] },
		{ name: 'Rubber', desc: 'Dense, resilient, sound-absorbing.', needs: ['Safety', 'Quiet'], buildings: ['Healthcare', 'Recreation'] },
		{ name: 'Matting', desc: 'Entrance systems. Trap dirt at the door.', needs: ['Safety', 'Tough'], buildings: ['Office', 'Retail'] },
		{ name: 'Raised Access', desc: 'Elevated panels for cables and airflow.', needs: ['Tech'], buildings: ['Office', 'Data Centre'] },
		{ name: 'Stair Treads', desc: 'Non-slip stair nosings and treads.', needs: ['Safety'], buildings: ['Healthcare', 'Education'] },
		{ name: 'Wall Base', desc: 'Vinyl, rubber, and wood wall base trim.', needs: ['Budget'], buildings: ['Office', 'Healthcare'] },
		{ name: 'ESD', desc: 'Electrostatic discharge control flooring.', needs: ['Tech', 'Safety'], buildings: ['Data Centre', 'Lab'] },
	];

	const allNeeds = ['All', 'Waterproof', 'Quiet', 'Tough', 'Green', 'Safety', 'Comfort', 'Budget', 'Tech'];
	const allBuildings = ['Office', 'Healthcare', 'Education', 'Retail', 'Hospitality', 'Industrial', 'Recreation', 'Lab', 'Data Centre', 'Food Service'];

	let activeNeed = $state('All');
	let activeBuilding = $state('');
	let expandedProduct = $state('');

	let filteredProducts = $derived.by(() => {
		return products.filter(p => {
			if (activeNeed !== 'All' && !p.needs.includes(activeNeed)) return false;
			if (activeBuilding && !p.buildings.includes(activeBuilding)) return false;
			return true;
		});
	});

	function setNeed(n: string) { activeNeed = n; activeBuilding = ''; expandedProduct = ''; }
	function setBuilding(b: string) { activeBuilding = activeBuilding === b ? '' : b; expandedProduct = ''; }
	function toggleProduct(name: string) { expandedProduct = expandedProduct === name ? '' : name; }

	/* ── Process ── */
	const steps = [
		{ num: '01', title: 'Consultation', desc: 'We visit your site, understand your needs, and assess conditions.' },
		{ num: '02', title: 'Specification', desc: 'Our team specs the right products for your traffic, budget, and timeline.' },
		{ num: '03', title: 'Scheduling', desc: 'We coordinate with your operations for minimal disruption.' },
		{ num: '04', title: 'Installation', desc: 'Our own crews handle every square foot — no subcontractors.' },
		{ num: '05', title: 'Inspection', desc: 'Walk-through with your team. We don\'t leave until it\'s right.' },
		{ num: '06', title: 'Maintenance', desc: 'Ongoing care plans to protect your investment long-term.' },
	];

	/* ── Portfolio ── */
	const portfolio = [
		{ name: 'Ottawa Civic Hospital', type: 'Healthcare', area: '45,000 sq ft', products: 'Sheet Vinyl + Rubber Treads' },
		{ name: 'Carleton University', type: 'Education', area: '32,000 sq ft', products: 'Carpet Tile + LVT Corridors' },
		{ name: 'Rideau Centre', type: 'Retail', area: '28,000 sq ft', products: 'Ceramic + LVT' },
		{ name: 'National Defence HQ', type: 'Government', area: '60,000 sq ft', products: 'Raised Access + Carpet Tile' },
		{ name: 'Brookstreet Hotel', type: 'Hospitality', area: '18,000 sq ft', products: 'Broadloom Ballroom + Hardwood Lobby' },
	];

	/* ── Flooring Advisor ── */
	let advisorStep = $state(0);
	let advisorSpace = $state('');
	let advisorPriority = $state('');

	const spaceTypes = ['Office', 'Healthcare', 'Education', 'Retail', 'Hospitality', 'Industrial'];
	const priorities = ['Durability', 'Acoustics', 'Sustainability', 'Budget', 'Aesthetics', 'Safety'];

	type Rec = { product: string; reason: string };
	let advisorResults = $derived.by((): Rec[] => {
		if (!advisorSpace || !advisorPriority) return [];
		const map: Record<string, Record<string, Rec[]>> = {
			Office: {
				Durability: [{ product: 'Carpet Tile', reason: 'Replace individual tiles as needed' }, { product: 'LVT', reason: 'Scratch-resistant, long lifespan' }],
				Acoustics: [{ product: 'Carpet Tile', reason: 'NRC 0.25+ sound absorption' }, { product: 'Cork', reason: 'Natural sound dampening' }],
				Sustainability: [{ product: 'Marmoleum', reason: '100% natural materials' }, { product: 'Bamboo', reason: 'Rapid-renewable resource' }],
				Budget: [{ product: 'VCT', reason: 'Lowest installed cost' }, { product: 'Carpet Tile', reason: 'Modular = less waste' }],
				Aesthetics: [{ product: 'Hardwood', reason: 'Warm, prestigious look' }, { product: 'LVT', reason: 'Wood/stone visuals, zero upkeep' }],
				Safety: [{ product: 'Matting', reason: 'Entrance dirt/moisture control' }, { product: 'Rubber', reason: 'Slip-resistant, resilient' }],
			},
			Healthcare: {
				Durability: [{ product: 'Sheet Vinyl', reason: 'Seamless, chemical-resistant' }, { product: 'Rubber', reason: 'Dense, resilient surface' }],
				Acoustics: [{ product: 'Rubber', reason: 'Impact sound reduction' }, { product: 'Cork', reason: 'Warm and quiet underfoot' }],
				Sustainability: [{ product: 'Marmoleum', reason: 'Naturally bacteriostatic' }, { product: 'Rubber', reason: 'Long lifecycle, recyclable' }],
				Budget: [{ product: 'Sheet Vinyl', reason: 'Low maintenance cost' }, { product: 'VCT', reason: 'Affordable, refinishable' }],
				Aesthetics: [{ product: 'LVT', reason: 'Design flexibility' }, { product: 'Sheet Vinyl', reason: 'Seamless, clean look' }],
				Safety: [{ product: 'Safety Flooring', reason: 'R10+ wet slip resistance' }, { product: 'Stair Treads', reason: 'Non-slip nosings' }],
			},
			Education: {
				Durability: [{ product: 'VCT', reason: 'Decades of proven performance' }, { product: 'LVT', reason: 'Impact and scratch resistant' }],
				Acoustics: [{ product: 'Carpet Tile', reason: 'Classroom noise reduction' }, { product: 'Cork', reason: 'Natural IIC improvement' }],
				Sustainability: [{ product: 'Marmoleum', reason: 'Carbon-neutral manufacturing' }, { product: 'Bamboo', reason: 'Rapidly renewable' }],
				Budget: [{ product: 'VCT', reason: 'Lowest lifecycle cost' }, { product: 'Carpet Tile', reason: 'Spot-replace damaged tiles' }],
				Aesthetics: [{ product: 'LVT', reason: 'Wood/stone looks for lobbies' }, { product: 'Carpet Tile', reason: 'Pattern and color options' }],
				Safety: [{ product: 'Rubber', reason: 'Gym and lab safety' }, { product: 'Safety Flooring', reason: 'Wet area compliance' }],
			},
			Retail: {
				Durability: [{ product: 'Ceramic', reason: 'Hardest-wearing surface' }, { product: 'LVT', reason: 'High-traffic resilience' }],
				Acoustics: [{ product: 'LVT', reason: 'Integrated acoustic backing' }, { product: 'Cork', reason: 'Warm, quiet customer experience' }],
				Sustainability: [{ product: 'Reclaimed Wood', reason: 'Unique character, zero new timber' }, { product: 'Marmoleum', reason: 'All-natural composition' }],
				Budget: [{ product: 'VCT', reason: 'Affordable for large areas' }, { product: 'LVT', reason: 'Low maintenance saves long-term' }],
				Aesthetics: [{ product: 'Hardwood', reason: 'Premium brand impression' }, { product: 'Ceramic', reason: 'Timeless elegance' }],
				Safety: [{ product: 'Matting', reason: 'Entrance moisture control' }, { product: 'Safety Flooring', reason: 'Slip prevention' }],
			},
			Hospitality: {
				Durability: [{ product: 'LVT', reason: 'Waterproof, scratch-proof' }, { product: 'Ceramic', reason: 'Lobby and restaurant grade' }],
				Acoustics: [{ product: 'Broadloom', reason: 'Wall-to-wall sound absorption' }, { product: 'Cork', reason: 'Suite-to-suite noise reduction' }],
				Sustainability: [{ product: 'Reclaimed Wood', reason: 'Story-driven design' }, { product: 'Marmoleum', reason: 'Green certification points' }],
				Budget: [{ product: 'Carpet Tile', reason: 'Replace high-wear zones only' }, { product: 'LVT', reason: 'Minimal maintenance' }],
				Aesthetics: [{ product: 'Hardwood', reason: 'Lobby prestige' }, { product: 'Broadloom', reason: 'Custom patterns and colors' }],
				Safety: [{ product: 'Safety Flooring', reason: 'Pool and spa areas' }, { product: 'Stair Treads', reason: 'Code-compliant nosings' }],
			},
			Industrial: {
				Durability: [{ product: 'Epoxy', reason: 'Chemical and impact resistant' }, { product: 'Rubber', reason: 'Heavy-load resilience' }],
				Acoustics: [{ product: 'Rubber', reason: 'Machine vibration dampening' }, { product: 'Cork', reason: 'Office areas within facilities' }],
				Sustainability: [{ product: 'Rubber', reason: 'Long lifecycle, recyclable' }, { product: 'Marmoleum', reason: 'Office/break room areas' }],
				Budget: [{ product: 'Epoxy', reason: 'Lowest cost per sq ft for heavy use' }, { product: 'VCT', reason: 'Office and break areas' }],
				Aesthetics: [{ product: 'Epoxy', reason: 'Decorative chip and metallic options' }, { product: 'LVT', reason: 'Showroom and office areas' }],
				Safety: [{ product: 'ESD', reason: 'Electrostatic discharge protection' }, { product: 'Safety Flooring', reason: 'Anti-slip in wet processing' }],
			},
		};
		return map[advisorSpace]?.[advisorPriority] ?? [{ product: 'Carpet Tile', reason: 'Versatile all-rounder' }, { product: 'LVT', reason: 'Low-maintenance modern option' }];
	});

	function resetAdvisor() { advisorStep = 0; advisorSpace = ''; advisorPriority = ''; }

	/* ── Suppliers ── */
	const suppliers = ['Tarkett', 'Beaulieu Canada', 'Interface', 'Forbo', 'Shaw Contract', 'Mohawk Group', 'Patcraft', 'Gerflor', 'Johnsonite', 'COREtec', 'Nora', 'Armstrong Flooring'];

	/* ── Services ── */
	const services = [
		{ title: 'Commercial Installation', desc: 'Full-service flooring installation for offices, healthcare, education, retail, and hospitality.', bullets: ['Own crews — never subcontracted', 'Night and weekend scheduling', 'Phased rollouts for occupied spaces'] },
		{ title: 'Product Specification', desc: 'We match the right product to your space, traffic, and budget.', bullets: ['12 manufacturer partnerships', 'Sample and mockup service', 'LEED and Green Globes guidance'] },
		{ title: 'Project Management', desc: 'Single point of contact from consultation through punch list.', bullets: ['Dedicated project coordinator', 'Real-time progress updates', 'Budget and timeline tracking'] },
		{ title: 'Maintenance Programs', desc: 'Protect your investment with scheduled care plans.', bullets: ['Carpet extraction and encapsulation', 'Hard surface strip and refinish', 'Preventive maintenance schedules'] },
	];

	/* ── Differentiators ── */
	const diffs = [
		{ num: 34, suffix: '', label: 'Years in Ottawa', desc: 'Serving the capital region since 1991.' },
		{ num: 250, suffix: '+', label: 'Crew Years Experience', desc: 'Our installers average 15+ years each.' },
		{ num: 12, suffix: '', label: 'Brand Partners', desc: 'Direct relationships with top manufacturers.' },
		{ num: 100, suffix: '%', label: 'Own Crews', desc: 'Never subcontracted. Always accountable.' },
	];

	/* ── Contact ── */
	const salesTeam = [
		{ name: 'Ryan Young', phone: '613-277-7926', email: 'ryoung@youngcarpets.com' },
		{ name: 'Derek Young', phone: '613-612-8487', email: 'dyoung@youngcarpets.com' },
		{ name: 'Peter Helis', phone: '613-864-6998', email: 'phelis@youngcarpets.com' },
		{ name: 'Mike Noel', phone: '613-222-5987', email: 'mnoel@youngcarpets.com' },
		{ name: 'Clayton Bradley', phone: '613-290-5075', email: 'cbradley@youngcarpets.com' },
		{ name: 'Alan O\'Connor', phone: '613-791-3252', email: 'aoconnor@youngcarpets.com' },
	];
</script>

<svelte:head>
	<title>Young Carpets — Ottawa's Commercial Flooring Experts</title>
	<meta name="description" content="Young Carpets — 34 years of commercial flooring installation in Ottawa. Carpet, LVT, vinyl, hardwood, rubber, and more." />
	<style>
		@font-face {
			font-family: 'Square721';
			src: url('/young-carpets/square721.ttf') format('truetype');
			font-display: swap;
		}
	</style>
</svelte:head>

<div class="v6" class:light={!dark}>

<!-- ════════════════════════════════════════════════
     HERO
     ════════════════════════════════════════════════ -->
<section class="hero" id="home">
	<div class="hero-grid-bg"></div>
	<div class="hero-content" use:reveal>
		<div class="hero-badge">
			<svg class="maple-leaf" viewBox="-2015 -2000 4030 4030" aria-hidden="true">
				<path d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z" fill="currentColor"/>
			</svg>
		</div>
		<h1 class="hero-wordmark" class:font-loaded={fontLoaded}>
			{#each 'YOUNG' as letter, i}
				<span class="hero-letter" style="--i:{i}">{letter}</span>
			{/each}
		</h1>
		<p class="hero-sub mono-label">COMMERCIAL FLOORING &middot; OTTAWA</p>
		<p class="hero-tagline">34 years installing floors that work as hard as you do.</p>
		<div class="hero-ctas">
			<button class="btn-primary" onclick={() => scrollTo('contact')}>Get a Quote</button>
			<button class="btn-secondary" onclick={() => scrollTo('products')}>View Products</button>
		</div>
	</div>
</section>

<!-- ════════════════════════════════════════════════
     NAVBAR (sticky, glass)
     ════════════════════════════════════════════════ -->
<nav class="glass-nav">
	<div class="nav-inner">
		<a href="/young-carpets" class="nav-brand">YOUNG</a>
		<div class="nav-links" class:open={mobileNav}>
			<button onclick={() => { scrollTo('products'); mobileNav = false; }}>Products</button>
			<button onclick={() => { scrollTo('process'); mobileNav = false; }}>Process</button>
			<button onclick={() => { scrollTo('portfolio'); mobileNav = false; }}>Portfolio</button>
			<button onclick={() => { scrollTo('advisor'); mobileNav = false; }}>Advisor</button>
			<button onclick={() => { scrollTo('services'); mobileNav = false; }}>Services</button>
			<button onclick={() => { scrollTo('contact'); mobileNav = false; }}>Contact</button>
		</div>
		<div class="nav-right">
			<button class="theme-toggle" onclick={toggleTheme} aria-label="Toggle theme">
				{#if dark}
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
				{:else}
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
				{/if}
			</button>
			<button class="nav-hamburger" onclick={() => mobileNav = !mobileNav} aria-label="Menu">
				<span></span><span></span><span></span>
			</button>
		</div>
	</div>
</nav>

<!-- ════════════════════════════════════════════════
     PRODUCTS
     ════════════════════════════════════════════════ -->
<section class="section" id="products">
	<div class="container">
		<h2 class="section-title" use:reveal><span class="mono-label">Products</span>Commercial Flooring Solutions</h2>
		<div class="pill-bar" use:reveal>
			<div class="pill-row">
				{#each allNeeds as need}
					<button class="pill" class:active={activeNeed === need} onclick={() => setNeed(need)}>{need}</button>
				{/each}
			</div>
			<div class="pill-row building-pills">
				{#each allBuildings as bld}
					<button class="pill pill-building" class:active={activeBuilding === bld} onclick={() => setBuilding(bld)}>{bld}</button>
				{/each}
			</div>
		</div>
		<div class="product-grid">
			{#each filteredProducts as prod (prod.name)}
				<button class="product-card glass-card" class:expanded={expandedProduct === prod.name} onclick={() => toggleProduct(prod.name)}>
					<div class="product-header">
						<h3 class="product-name">{prod.name}</h3>
						<span class="product-chevron">{expandedProduct === prod.name ? '−' : '+'}</span>
					</div>
					<p class="product-desc">{prod.desc}</p>
					<div class="product-pills">
						{#each prod.needs as n}
							<span class="micro-pill">{n}</span>
						{/each}
						{#each prod.buildings as b}
							<span class="micro-pill micro-pill-bld">{b}</span>
						{/each}
					</div>
					<div class="product-detail">
						<p class="product-detail-text">Best for: {prod.buildings.join(', ')} environments. Key properties: {prod.needs.join(', ').toLowerCase()}.</p>
					</div>
				</button>
			{/each}
		</div>
		{#if filteredProducts.length === 0}
			<p class="no-results" use:reveal>No products match that combination. Try a different filter.</p>
		{/if}
	</div>
</section>

<!-- ════════════════════════════════════════════════
     PROCESS
     ════════════════════════════════════════════════ -->
<section class="section section-alt" id="process">
	<div class="container">
		<h2 class="section-title" use:reveal><span class="mono-label">Process</span>From Consultation to Completion</h2>
		<div class="timeline">
			{#each steps as step, i}
				<div class="timeline-step" use:reveal style="--delay:{i * 80}ms">
					<div class="timeline-num">{step.num}</div>
					<div class="timeline-body">
						<h3 class="timeline-title">{step.title}</h3>
						<p class="timeline-desc">{step.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ════════════════════════════════════════════════
     PORTFOLIO
     ════════════════════════════════════════════════ -->
<section class="section" id="portfolio">
	<div class="container">
		<h2 class="section-title" use:reveal><span class="mono-label">Portfolio</span>Ottawa Projects</h2>
		<div class="portfolio-grid">
			{#each portfolio as proj}
				<div class="glass-card portfolio-card" use:reveal>
					<span class="mono-label">{proj.type}</span>
					<h3>{proj.name}</h3>
					<p class="portfolio-area">{proj.area}</p>
					<p class="portfolio-products">{proj.products}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ════════════════════════════════════════════════
     FLOORING ADVISOR
     ════════════════════════════════════════════════ -->
<section class="section section-alt" id="advisor">
	<div class="container">
		<h2 class="section-title" use:reveal><span class="mono-label">Advisor</span>Find Your Flooring</h2>
		<div class="advisor glass-card" use:reveal>
			<!-- Step indicators -->
			<div class="advisor-steps-indicator">
				<span class="advisor-dot" class:done={advisorStep >= 0} class:current={advisorStep === 0}>1</span>
				<span class="advisor-line" class:done={advisorStep >= 1}></span>
				<span class="advisor-dot" class:done={advisorStep >= 1} class:current={advisorStep === 1}>2</span>
				<span class="advisor-line" class:done={advisorStep >= 2}></span>
				<span class="advisor-dot" class:done={advisorStep >= 2} class:current={advisorStep === 2}>3</span>
			</div>

			{#if advisorStep === 0}
				<div class="advisor-panel">
					<h3>What type of space?</h3>
					<div class="advisor-options">
						{#each spaceTypes as sp}
							<button class="advisor-btn" onclick={() => { advisorSpace = sp; advisorStep = 1; }}>{sp}</button>
						{/each}
					</div>
				</div>
			{:else if advisorStep === 1}
				<div class="advisor-panel">
					<h3>What's your top priority?</h3>
					<div class="advisor-options">
						{#each priorities as pr}
							<button class="advisor-btn" onclick={() => { advisorPriority = pr; advisorStep = 2; }}>{pr}</button>
						{/each}
					</div>
				</div>
			{:else}
				<div class="advisor-panel">
					<h3>Our Recommendations</h3>
					<p class="advisor-context">{advisorSpace} &middot; {advisorPriority}</p>
					<div class="advisor-results">
						{#each advisorResults as rec}
							<div class="advisor-result glass-card">
								<h4>{rec.product}</h4>
								<p>{rec.reason}</p>
							</div>
						{/each}
					</div>
					<button class="btn-secondary" onclick={resetAdvisor}>Start Over</button>
				</div>
			{/if}
		</div>
	</div>
</section>

<!-- ════════════════════════════════════════════════
     SUPPLIERS MARQUEE
     ════════════════════════════════════════════════ -->
<section class="marquee-section">
	<div class="marquee-track">
		<div class="marquee-inner">
			{#each [...suppliers, ...suppliers] as name}
				<span class="marquee-item">{name}</span>
			{/each}
		</div>
	</div>
</section>

<!-- ════════════════════════════════════════════════
     SERVICES
     ════════════════════════════════════════════════ -->
<section class="section" id="services">
	<div class="container">
		<h2 class="section-title" use:reveal><span class="mono-label">Services</span>What We Do</h2>
		<div class="services-grid">
			{#each services as svc}
				<div class="glass-card service-card" use:reveal>
					<h3>{svc.title}</h3>
					<p>{svc.desc}</p>
					<ul>
						{#each svc.bullets as b}
							<li>{b}</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ════════════════════════════════════════════════
     WHY YOUNG CARPETS
     ════════════════════════════════════════════════ -->
<section class="section section-alt" id="why">
	<div class="container">
		<h2 class="section-title" use:reveal><span class="mono-label">Why Us</span>The Young Carpets Difference</h2>
		<div class="diff-grid">
			{#each diffs as d}
				<div class="glass-card diff-card" use:reveal>
					<div class="diff-num" use:counter={{ target: d.num, suffix: d.suffix }}>0</div>
					<h3 class="diff-label">{d.label}</h3>
					<p>{d.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ════════════════════════════════════════════════
     ABOUT
     ════════════════════════════════════════════════ -->
<section class="section" id="about">
	<div class="container">
		<h2 class="section-title" use:reveal><span class="mono-label">About</span>Since 1991</h2>
		<div class="about-body" use:reveal>
			<p>Young Carpets has been Ottawa's trusted commercial flooring partner for over three decades. Founded in 1991, we've grown from a small family operation into one of the region's largest commercial flooring contractors — while keeping the values that got us here: own crews, honest pricing, and craftsmanship that speaks for itself.</p>
			<p>We've installed millions of square feet across hospitals, universities, government buildings, hotels, and retail spaces throughout the National Capital Region. Every project gets the same attention, whether it's a 500 sq ft office refresh or a 60,000 sq ft institutional rollout.</p>
		</div>
	</div>
</section>

<!-- ════════════════════════════════════════════════
     CONTACT
     ════════════════════════════════════════════════ -->
<section class="section section-alt" id="contact">
	<div class="container">
		<h2 class="section-title" use:reveal><span class="mono-label">Contact</span>Get In Touch</h2>
		<div class="contact-grid">
			<div class="glass-card contact-card" use:reveal>
				<h3>Sales Team</h3>
				<div class="contact-list">
					{#each salesTeam as person}
						<div class="contact-person">
							<strong>{person.name}</strong>
							<a href="tel:{person.phone}">{person.phone}</a>
							<a href="mailto:{person.email}">{person.email}</a>
						</div>
					{/each}
				</div>
			</div>
			<div class="contact-side">
				<div class="glass-card contact-card" use:reveal>
					<h3>Accounting</h3>
					<div class="contact-list">
						<div class="contact-person">
							<strong>Alan Young</strong>
							<a href="tel:613-878-9911">613-878-9911</a>
							<a href="mailto:accounting@youngcarpets.com">accounting@youngcarpets.com</a>
						</div>
						<div class="contact-person">
							<strong>Accounts Payable</strong>
							<a href="mailto:ap@youngcarpets.com">ap@youngcarpets.com</a>
						</div>
					</div>
				</div>
				<div class="glass-card contact-card" use:reveal>
					<h3>Office</h3>
					<div class="contact-list">
						<div class="contact-person">
							<strong>Main Line</strong>
							<a href="tel:613-744-2744">613-744-2744</a>
						</div>
						<div class="contact-person">
							<strong>Fax</strong>
							<span>613-744-2995</span>
						</div>
						<div class="contact-person">
							<strong>General</strong>
							<a href="mailto:info@youngcarpets.com">info@youngcarpets.com</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ════════════════════════════════════════════════
     MAP
     ════════════════════════════════════════════════ -->
<section class="map-section" id="map">
	<iframe
		title="Young Carpets Location"
		src="https://www.google.com/maps?q=1228+Old+Innes+Rd+Unit+316+Ottawa+ON+K1B+3V3&output=embed&z=15"
		width="100%"
		height="350"
		style="border:0"
		loading="lazy"
		referrerpolicy="no-referrer-when-downgrade"
	></iframe>
</section>

<!-- ════════════════════════════════════════════════
     FOOTER
     ════════════════════════════════════════════════ -->
<footer class="footer">
	<div class="container footer-inner">
		<div class="footer-brand">
			<span class="footer-logo">YOUNG</span>
			<span class="footer-sub">Commercial Flooring</span>
		</div>
		<div class="footer-info">
			<p>1228 Old Innes Rd, Unit 316, Ottawa ON K1B 3V3</p>
			<p>613-744-2744 &middot; info@youngcarpets.com</p>
			<p>Mon–Fri 10:00–16:00</p>
		</div>
		<div class="footer-links">
			<a href="/">AY3 Portal</a>
		</div>
		<p class="footer-copy">&copy; 2026 Young Carpets. All rights reserved.</p>
	</div>
</footer>

</div>

<DevColorPicker />

<style>
	/* ═══════════════════════════════════════
	   CSS CUSTOM PROPERTIES
	   ═══════════════════════════════════════ */
	.v6 {
		--ink: #080706;
		--text: #c2b39a;
		--text-body: #a89b87;
		--text-muted: rgba(194,179,154,0.6);
		--gold: #ffe27a;
		--gold-dim: rgba(255,226,122,0.7);
		--maple-red: #d44532;
		--card-bg: rgba(8,7,6,0.45);
		--card-border: rgba(194,179,154,0.12);
		--card-shadow: 0 2px 24px rgba(0,0,0,0.18);
		--card-shimmer: inset 0 1px 0 rgba(194,179,154,0.06);
		--glass-blur: blur(18px);
		--radius: 18px;
		--ease: cubic-bezier(0.2, 0.9, 0.25, 1.05);
		--section-bg: var(--ink);
		--section-alt: #0c0b09;
		--container: 1100px;
		--nav-height: 60px;

		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: var(--ink);
		color: var(--text-body);
		line-height: 1.6;
		overflow-x: hidden;
		-webkit-font-smoothing: antialiased;
	}

	/* ── Light Mode ── */
	.v6.light {
		--ink: #faf7f0;
		--text: #1d1d1f;
		--text-body: #3d3832;
		--text-muted: #5a5249;
		--gold: #7a5d10;
		--gold-dim: #7a5d10;
		--maple-red: #c03a28;
		--card-bg: #ffffff;
		--card-border: rgba(90,77,53,0.16);
		--card-shadow: 0 2px 16px rgba(90,77,53,0.08);
		--card-shimmer: none;
		--glass-blur: blur(12px);
		--section-bg: #faf7f0;
		--section-alt: #ffffff;
	}

	/* ═══════════════════════════════════════
	   GLOBAL UTILITIES
	   ═══════════════════════════════════════ */
	.v6 *, .v6 *::before, .v6 *::after { box-sizing: border-box; margin: 0; padding: 0; }

	.container { max-width: var(--container); margin: 0 auto; padding: 0 20px; }

	.mono-label {
		font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
		font-size: 0.7rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--gold);
		display: block;
		margin-bottom: 8px;
	}

	.section {
		padding: 80px 0;
		background: var(--section-bg);
	}
	.section-alt {
		background: var(--section-alt);
	}

	.section-title {
		font-size: 1.8rem;
		font-weight: 700;
		color: var(--text);
		margin-bottom: 40px;
		line-height: 1.2;
	}

	/* ── Reveal animation ── */
	:global(.v6 [class*="reveal"]:not(.revealed)) {
		opacity: 0;
		transform: translateY(24px);
	}
	:global(.v6 .revealed) {
		opacity: 1;
		transform: translateY(0);
		transition: opacity 0.6s var(--ease), transform 0.6s var(--ease);
		transition-delay: var(--delay, 0ms);
	}

	/* ── Glass Card ── */
	.glass-card {
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: var(--radius);
		box-shadow: var(--card-shadow), var(--card-shimmer);
		padding: 24px;
	}
	.v6:not(.light) .glass-card {
		backdrop-filter: var(--glass-blur);
		-webkit-backdrop-filter: var(--glass-blur);
	}

	/* ── Buttons ── */
	.btn-primary, .btn-secondary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 48px;
		padding: 12px 28px;
		border-radius: 12px;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		border: none;
		transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease), background 0.2s;
	}
	.btn-primary {
		background: var(--gold);
		color: #080706;
	}
	.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(255,226,122,0.3); }

	.btn-secondary {
		background: transparent;
		color: var(--gold);
		border: 1.5px solid var(--gold);
	}
	.btn-secondary:hover { background: rgba(255,226,122,0.08); }
	.v6.light .btn-secondary:hover { background: rgba(122,93,16,0.08); }
	.v6.light .btn-primary { background: #7a5d10; color: #fff; }
	.v6.light .btn-primary:hover { box-shadow: 0 4px 20px rgba(122,93,16,0.25); }

	/* ═══════════════════════════════════════
	   HERO
	   ═══════════════════════════════════════ */
	.hero {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		background: var(--ink);
	}

	.hero-grid-bg {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(194,179,154,0.04) 1px, transparent 1px),
			linear-gradient(90deg, rgba(194,179,154,0.04) 1px, transparent 1px);
		background-size: 60px 60px;
	}
	.v6.light .hero-grid-bg {
		background-image:
			linear-gradient(rgba(90,77,53,0.06) 1px, transparent 1px),
			linear-gradient(90deg, rgba(90,77,53,0.06) 1px, transparent 1px);
	}

	.hero-content {
		position: relative;
		z-index: 1;
		text-align: center;
		padding: 20px;
	}

	.hero-badge { margin-bottom: 24px; }
	.maple-leaf {
		width: 48px;
		height: 48px;
		color: var(--maple-red);
	}

	.hero-wordmark {
		font-family: 'Square721', sans-serif;
		font-size: clamp(3.5rem, 12vw, 7rem);
		font-weight: 700;
		letter-spacing: 0.12em;
		color: var(--text);
		line-height: 1;
		margin-bottom: 12px;
		display: flex;
		justify-content: center;
		gap: 0.02em;
	}

	.hero-letter {
		display: inline-block;
		opacity: 0;
		transform: translateY(30px);
		transition: opacity 0.5s var(--ease), transform 0.5s var(--ease);
		transition-delay: calc(var(--i) * 100ms + 200ms);
	}
	.font-loaded .hero-letter {
		opacity: 1;
		transform: translateY(0);
	}

	.hero-sub {
		font-size: 0.8rem;
		color: var(--gold);
		margin-bottom: 16px;
		letter-spacing: 0.2em;
	}
	.hero-tagline {
		font-size: 1.15rem;
		color: var(--text-body);
		margin-bottom: 32px;
		max-width: 420px;
		margin-left: auto;
		margin-right: auto;
	}
	.hero-ctas {
		display: flex;
		gap: 12px;
		justify-content: center;
		flex-wrap: wrap;
	}

	/* ═══════════════════════════════════════
	   NAVBAR
	   ═══════════════════════════════════════ */
	.glass-nav {
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(8,7,6,0.75);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-bottom: 1px solid var(--card-border);
		height: var(--nav-height);
	}
	.v6.light .glass-nav {
		background: rgba(250,247,240,0.85);
	}

	.nav-inner {
		max-width: var(--container);
		margin: 0 auto;
		padding: 0 20px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.nav-brand {
		font-family: 'Square721', sans-serif;
		font-size: 1.2rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--text);
		text-decoration: none;
	}

	.nav-links {
		display: flex;
		gap: 4px;
	}
	.nav-links button {
		background: none;
		border: none;
		color: var(--text-muted);
		font-size: 0.85rem;
		padding: 8px 12px;
		cursor: pointer;
		border-radius: 8px;
		transition: color 0.2s, background 0.2s;
		min-height: 44px;
		display: flex;
		align-items: center;
	}
	.nav-links button:hover { color: var(--text); background: rgba(194,179,154,0.08); }
	.v6.light .nav-links button:hover { background: rgba(90,77,53,0.06); }

	.nav-right { display: flex; align-items: center; gap: 8px; }

	.theme-toggle {
		background: none;
		border: 1px solid var(--card-border);
		border-radius: 10px;
		color: var(--text-muted);
		cursor: pointer;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.2s, border-color 0.2s;
	}
	.theme-toggle:hover { color: var(--gold); border-color: var(--gold); }

	.nav-hamburger {
		display: none;
		flex-direction: column;
		gap: 5px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 10px;
		min-height: 44px;
		min-width: 44px;
		align-items: center;
		justify-content: center;
	}
	.nav-hamburger span {
		display: block;
		width: 20px;
		height: 2px;
		background: var(--text);
		border-radius: 1px;
		transition: transform 0.2s, opacity 0.2s;
	}

	@media (max-width: 600px) {
		.nav-hamburger { display: flex; }
		.nav-links {
			display: none;
			position: absolute;
			top: var(--nav-height);
			left: 0;
			right: 0;
			flex-direction: column;
			background: var(--ink);
			border-bottom: 1px solid var(--card-border);
			padding: 8px 16px;
		}
		.v6.light .nav-links { background: var(--section-bg); }
		.nav-links.open { display: flex; }
	}

	/* ═══════════════════════════════════════
	   PRODUCTS
	   ═══════════════════════════════════════ */
	.pill-bar {
		margin-bottom: 32px;
	}
	.pill-row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 10px;
	}

	.pill {
		background: transparent;
		border: 1px solid var(--card-border);
		color: var(--text-muted);
		padding: 6px 16px;
		border-radius: 100px;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.2s var(--ease);
		min-height: 36px;
		white-space: nowrap;
	}
	.pill:hover { border-color: var(--gold); color: var(--text); }
	.pill.active {
		background: var(--gold);
		color: #080706;
		border-color: var(--gold);
	}
	.v6.light .pill.active { background: #7a5d10; color: #fff; }
	.pill-building { font-style: italic; }

	.product-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
	}
	@media (min-width: 600px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
	@media (min-width: 900px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }

	.product-card {
		text-align: left;
		cursor: pointer;
		transition: transform 0.25s var(--ease), box-shadow 0.25s var(--ease);
		width: 100%;
	}
	.product-card:hover { transform: translateY(-2px); }

	.product-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 6px;
	}
	.product-name {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text);
	}
	.product-chevron {
		font-size: 1.2rem;
		color: var(--gold);
		line-height: 1;
		flex-shrink: 0;
	}
	.product-desc {
		font-size: 0.85rem;
		color: var(--text-muted);
		margin-bottom: 10px;
	}
	.product-pills { display: flex; flex-wrap: wrap; gap: 4px; }
	.micro-pill {
		font-size: 0.65rem;
		padding: 2px 8px;
		border-radius: 100px;
		background: rgba(255,226,122,0.1);
		color: var(--gold);
		font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
		letter-spacing: 0.04em;
	}
	.v6.light .micro-pill { background: rgba(122,93,16,0.08); }
	.micro-pill-bld {
		background: rgba(194,179,154,0.1);
		color: var(--text-muted);
	}
	.v6.light .micro-pill-bld { background: rgba(90,77,53,0.06); }

	.product-detail {
		max-height: 0;
		overflow: hidden;
		transition: max-height 0.35s var(--ease), opacity 0.3s;
		opacity: 0;
	}
	.product-card.expanded .product-detail {
		max-height: 120px;
		opacity: 1;
	}
	.product-detail-text {
		padding-top: 12px;
		font-size: 0.85rem;
		color: var(--text-body);
		border-top: 1px solid var(--card-border);
		margin-top: 10px;
	}

	.no-results {
		text-align: center;
		color: var(--text-muted);
		padding: 40px 0;
	}

	/* ═══════════════════════════════════════
	   PROCESS TIMELINE
	   ═══════════════════════════════════════ */
	.timeline {
		position: relative;
		padding-left: 48px;
	}
	.timeline::before {
		content: '';
		position: absolute;
		left: 18px;
		top: 8px;
		bottom: 8px;
		width: 2px;
		background: var(--card-border);
	}

	.timeline-step {
		position: relative;
		margin-bottom: 36px;
	}
	.timeline-step:last-child { margin-bottom: 0; }

	.timeline-num {
		position: absolute;
		left: -48px;
		top: 0;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--gold);
		color: #080706;
		font-weight: 700;
		font-size: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1;
	}
	.v6.light .timeline-num { background: #7a5d10; color: #fff; }

	.timeline-title {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text);
		margin-bottom: 4px;
	}
	.timeline-desc {
		font-size: 0.9rem;
		color: var(--text-muted);
	}

	/* ═══════════════════════════════════════
	   PORTFOLIO
	   ═══════════════════════════════════════ */
	.portfolio-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;
	}
	@media (min-width: 600px) { .portfolio-grid { grid-template-columns: repeat(2, 1fr); } }
	@media (min-width: 900px) { .portfolio-grid { grid-template-columns: repeat(3, 1fr); } }

	.portfolio-card h3 {
		font-size: 1.05rem;
		color: var(--text);
		margin-bottom: 8px;
	}
	.portfolio-area {
		font-size: 0.85rem;
		color: var(--text-body);
		margin-bottom: 4px;
	}
	.portfolio-products {
		font-size: 0.8rem;
		color: var(--gold);
		font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
	}

	/* ═══════════════════════════════════════
	   ADVISOR
	   ═══════════════════════════════════════ */
	.advisor {
		max-width: 560px;
		margin: 0 auto;
	}

	.advisor-steps-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		margin-bottom: 28px;
	}
	.advisor-dot {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--text-muted);
		border: 2px solid var(--card-border);
		background: transparent;
		transition: all 0.3s var(--ease);
	}
	.advisor-dot.done { border-color: var(--gold); color: var(--gold); }
	.advisor-dot.current { background: var(--gold); color: #080706; border-color: var(--gold); }
	.v6.light .advisor-dot.current { background: #7a5d10; color: #fff; border-color: #7a5d10; }

	.advisor-line {
		width: 40px;
		height: 2px;
		background: var(--card-border);
		transition: background 0.3s;
	}
	.advisor-line.done { background: var(--gold); }
	.v6.light .advisor-line.done { background: #7a5d10; }

	.advisor-panel {
		text-align: center;
	}
	.advisor-panel h3 {
		font-size: 1.1rem;
		color: var(--text);
		margin-bottom: 20px;
	}
	.advisor-context {
		font-size: 0.85rem;
		color: var(--gold);
		margin-bottom: 20px;
		font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
	}

	.advisor-options {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
	}
	@media (min-width: 600px) { .advisor-options { grid-template-columns: repeat(3, 1fr); } }

	.advisor-btn {
		background: transparent;
		border: 1px solid var(--card-border);
		color: var(--text);
		padding: 14px 12px;
		border-radius: 12px;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s var(--ease);
		min-height: 48px;
	}
	.advisor-btn:hover { border-color: var(--gold); color: var(--gold); background: rgba(255,226,122,0.05); }
	.v6.light .advisor-btn:hover { background: rgba(122,93,16,0.04); }

	.advisor-results {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 20px;
	}
	.advisor-result {
		text-align: left;
	}
	.advisor-result h4 {
		font-size: 1rem;
		color: var(--text);
		margin-bottom: 4px;
	}
	.advisor-result p {
		font-size: 0.85rem;
		color: var(--text-muted);
	}

	/* ═══════════════════════════════════════
	   SUPPLIERS MARQUEE
	   ═══════════════════════════════════════ */
	.marquee-section {
		padding: 24px 0;
		overflow: hidden;
		background: var(--section-alt);
		border-top: 1px solid var(--card-border);
		border-bottom: 1px solid var(--card-border);
	}
	.marquee-track { overflow: hidden; }
	.marquee-inner {
		display: flex;
		gap: 48px;
		width: max-content;
		animation: marquee-scroll 30s linear infinite;
	}
	@keyframes marquee-scroll {
		from { transform: translateX(0); }
		to { transform: translateX(-50%); }
	}
	.marquee-item {
		font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		white-space: nowrap;
		text-transform: uppercase;
	}

	/* ═══════════════════════════════════════
	   SERVICES
	   ═══════════════════════════════════════ */
	.services-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;
	}
	@media (min-width: 600px) { .services-grid { grid-template-columns: repeat(2, 1fr); } }

	.service-card h3 {
		font-size: 1.05rem;
		color: var(--text);
		margin-bottom: 8px;
	}
	.service-card p {
		font-size: 0.88rem;
		color: var(--text-body);
		margin-bottom: 12px;
	}
	.service-card ul {
		list-style: none;
		padding: 0;
	}
	.service-card li {
		font-size: 0.82rem;
		color: var(--text-muted);
		padding: 4px 0 4px 16px;
		position: relative;
	}
	.service-card li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--gold);
		transform: translateY(-50%);
	}

	/* ═══════════════════════════════════════
	   WHY / DIFFERENTIATORS
	   ═══════════════════════════════════════ */
	.diff-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}
	@media (min-width: 600px) { .diff-grid { grid-template-columns: repeat(4, 1fr); } }

	.diff-card { text-align: center; }
	.diff-num {
		font-size: 2.4rem;
		font-weight: 800;
		color: var(--gold);
		line-height: 1.1;
		margin-bottom: 4px;
	}
	.diff-label {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text);
		margin-bottom: 6px;
	}
	.diff-card p {
		font-size: 0.78rem;
		color: var(--text-muted);
	}

	/* ═══════════════════════════════════════
	   ABOUT
	   ═══════════════════════════════════════ */
	.about-body p {
		font-size: 1rem;
		color: var(--text-body);
		margin-bottom: 16px;
		max-width: 720px;
	}

	/* ═══════════════════════════════════════
	   CONTACT
	   ═══════════════════════════════════════ */
	.contact-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;
	}
	@media (min-width: 600px) { .contact-grid { grid-template-columns: 1fr 1fr; } }

	.contact-side { display: flex; flex-direction: column; gap: 16px; }

	.contact-card h3 {
		font-size: 1rem;
		color: var(--text);
		margin-bottom: 12px;
	}

	.contact-list { display: flex; flex-direction: column; gap: 12px; }
	.contact-person { display: flex; flex-direction: column; gap: 2px; }
	.contact-person strong {
		font-size: 0.88rem;
		color: var(--text);
	}
	.contact-person a, .contact-person span {
		font-size: 0.8rem;
		color: var(--text-muted);
		text-decoration: none;
		transition: color 0.15s;
	}
	.contact-person a:hover { color: var(--gold); }

	/* ═══════════════════════════════════════
	   MAP
	   ═══════════════════════════════════════ */
	.map-section iframe {
		display: block;
		width: 100%;
	}

	/* ═══════════════════════════════════════
	   FOOTER
	   ═══════════════════════════════════════ */
	.footer {
		background: var(--section-alt);
		border-top: 1px solid var(--card-border);
		padding: 40px 0 24px;
	}
	.footer-inner {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.footer-brand { display: flex; align-items: baseline; gap: 10px; }
	.footer-logo {
		font-family: 'Square721', sans-serif;
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--text);
		letter-spacing: 0.08em;
	}
	.footer-sub {
		font-size: 0.75rem;
		color: var(--text-muted);
	}
	.footer-info p {
		font-size: 0.8rem;
		color: var(--text-muted);
		line-height: 1.5;
	}
	.footer-links a {
		font-size: 0.8rem;
		color: var(--gold);
		text-decoration: none;
	}
	.footer-links a:hover { text-decoration: underline; }
	.footer-copy {
		font-size: 0.7rem;
		color: var(--text-muted);
		opacity: 0.6;
	}

	/* ═══════════════════════════════════════
	   REDUCED MOTION
	   ═══════════════════════════════════════ */
	@media (prefers-reduced-motion: reduce) {
		.hero-letter { opacity: 1 !important; transform: none !important; transition: none !important; }
		.marquee-inner { animation: none !important; }
		:global(.v6 .revealed) { transition: none !important; }
	}
</style>
