<!--
	Young Carpets V11 — "Polished"
	Refined alive effects (subtler), typography hierarchy, spacing consistency,
	mobile polish, interaction refinements, alternating warm-tint sections.
	Built on V10 with error-checked CSS and premium feel.
	2026-04-09
-->
<script lang="ts">
	import { dev } from '$app/environment';
	import pkg from '../../../../../package.json';
	import '$lib/styles/young-carpets-tokens.css';
	import '$lib/styles/young-carpets.css';
	import { reveal, cardPointer, countUp } from '$lib/actions';
	import { onMount } from 'svelte';
	import { type Product, featureProducts } from '../../data/products';
	import { suppliers } from '../../data/suppliers';
	import YcMapModal from '../../components/YcMapModal.svelte';
	import DevColorPicker from '../../components/DevColorPicker.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	const ycVersion = pkg.version;

	let openProduct: Product | null = $state(null);
	let mapModalOpen: boolean = $state(false);
	let activeTab: 'product' | 'install' | 'maintenance' = $state('product');
	let tabAnimKey = $state(0);

	let scrollProgress = $state(0);
	let activeSection = $state('');
	let mobileMenuOpen = $state(false);
	let wordmarkReady = $state(false);
	let heroAlive = $state(false);
	let aliveSections = $state<Set<string>>(new Set());

	const LETTERS = ['Y', 'O', 'U', 'N', 'G'] as const;

	const sectionMap: Record<string, string> = {
		'products': 'Products',
		'what': 'Services',
		'map': 'Find Us',
		'contact': 'Contact',
	};

	function showProduct(p: Product) {
		openProduct = p;
		activeTab = 'product';
		tabAnimKey++;
	}
	function closeProduct() { openProduct = null; }
	function switchTab(t: 'product' | 'install' | 'maintenance') {
		activeTab = t;
		tabAnimKey++;
	}
	function openMap() { mapModalOpen = true; }
	function closeMap() { mapModalOpen = false; }

	function v11ScrollTo(id: string) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
		mobileMenuOpen = false;
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				if (openProduct) closeProduct();
				else if (mapModalOpen) closeMap();
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	let pageEl: HTMLDivElement | null = $state(null);

	let tiltX = 0;
	let tiltY = 0;
	let targetTiltX = 0;
	let targetTiltY = 0;

	$effect(() => {
		if (typeof window === 'undefined') return;
		const prm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prm) return;
		const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
		const onPointer = (e: PointerEvent) => {
			if (isTouch) return;
			const cx = window.innerWidth * 0.5;
			const cy = window.innerHeight * 0.5;
			targetTiltX = Math.max(-1, Math.min(1, (e.clientX - cx) / cx));
			targetTiltY = Math.max(-1, Math.min(1, (e.clientY - cy) / cy));
		};
		const onLeave = () => { if (isTouch) return; targetTiltX = 0; targetTiltY = 0; };
		if (!isTouch) {
			window.addEventListener('pointermove', onPointer, { passive: true });
			window.addEventListener('pointerleave', onLeave, { passive: true });
		}
		let tiltRaf = 0;
		const step = () => {
			const ease = 0.12;
			tiltX += (targetTiltX - tiltX) * ease;
			tiltY += (targetTiltY - tiltY) * ease;
			if (pageEl) {
				pageEl.style.setProperty('--yc-tilt-x', String(tiltX.toFixed(4)));
				pageEl.style.setProperty('--yc-tilt-y', String(tiltY.toFixed(4)));
			}
			tiltRaf = requestAnimationFrame(step);
		};
		tiltRaf = requestAnimationFrame(step);
		return () => {
			cancelAnimationFrame(tiltRaf);
			window.removeEventListener('pointermove', onPointer);
			window.removeEventListener('pointerleave', onLeave);
		};
	});

	$effect(() => {
		if (typeof window === 'undefined') return;
		const prm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prm) return;
		let raf = 0;
		const onScroll = () => {
			if (raf) return;
			raf = requestAnimationFrame(() => {
				if (pageEl) pageEl.style.setProperty('--yc-scroll', String(window.scrollY));
				const docH = document.documentElement.scrollHeight - window.innerHeight;
				scrollProgress = docH > 0 ? Math.min(window.scrollY / docH, 1) : 0;
				if (window.scrollY < 200) activeSection = '';
				raf = 0;
			});
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
	});

	$effect(() => {
		if (typeof window === 'undefined') return;
		const sections = ['contact', 'map', 'what', 'products'];
		const els = sections.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
		const io = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) activeSection = entry.target.id;
			}
		}, { threshold: 0.15, rootMargin: '-80px 0px -40% 0px' });
		els.forEach(el => io.observe(el));
		return () => io.disconnect();
	});

	onMount(() => {
		let cancelled = false;
		const start = async () => {
			try {
				if ('fonts' in document) {
					await document.fonts.load('5.5rem "Square721"');
					await document.fonts.ready;
				}
			} catch {}
			if (!cancelled) {
				wordmarkReady = true;
				setTimeout(() => { heroAlive = true; }, 400);
			}
		};
		requestAnimationFrame(start);
		return () => { cancelled = true; };
	});

	/* V10: IntersectionObserver for "come alive" sections */
	$effect(() => {
		if (typeof window === 'undefined') return;
		const aliveIds = ['products', 'suppliers', 'what', 'map', 'contact'];
		const els = aliveIds.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
		const io = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add('alive');
					aliveSections = new Set([...aliveSections, entry.target.id]);
					io.unobserve(entry.target);
				}
			}
		}, { threshold: 0.15 });
		els.forEach(el => io.observe(el));
		return () => io.disconnect();
	});

	type LayerDef = { label: string; color: string; height: number };

	const layerMap: Record<string, LayerDef[]> = {
		'carpet-tile': [
			{ label: 'Wear Surface', color: '#5a5a5c', height: 14 },
			{ label: 'Tufted Yarn', color: '#4a4a4c', height: 22 },
			{ label: 'Primary Backing', color: '#3a3a3c', height: 12 },
			{ label: 'Adhesive Dots', color: '#333335', height: 8 },
			{ label: 'Secondary Backing (PVC)', color: '#2a2a2c', height: 18 },
		],
		carpet: [
			{ label: 'Face Fiber', color: '#5a5a5c', height: 26 },
			{ label: 'Primary Backing', color: '#3e3e40', height: 14 },
			{ label: 'Secondary Backing (Jute)', color: '#2a2a2c', height: 16 },
		],
		lvt: [
			{ label: 'UV Coating', color: '#606062', height: 8 },
			{ label: 'Wear Layer (20–30 mil)', color: '#525254', height: 14 },
			{ label: 'Printed Design Layer', color: '#444446', height: 12 },
			{ label: 'Rigid Core', color: '#343436', height: 22 },
			{ label: 'Underlayment', color: '#2a2a2c', height: 12 },
		],
		hardwood: [
			{ label: 'Finish Coat', color: '#5e5850', height: 8 },
			{ label: 'Wear Layer', color: '#504a42', height: 14 },
			{ label: 'Hardwood Veneer', color: '#443e36', height: 18 },
			{ label: 'Plywood Core', color: '#383430', height: 20 },
			{ label: 'Backer', color: '#2c2a28', height: 12 },
		],
		rubber: [
			{ label: 'Wear Surface', color: '#4a4a4c', height: 16 },
			{ label: 'Dense Rubber Body', color: '#363638', height: 32 },
			{ label: 'Factory Backing', color: '#2a2a2c', height: 14 },
		],
		ceramic: [
			{ label: 'Glaze', color: '#585a5c', height: 10 },
			{ label: 'Bisque Body', color: '#3e3e40', height: 28 },
			{ label: 'Mortar Bed', color: '#2a2a2c', height: 22 },
		],
		sheet: [
			{ label: 'Wear Layer', color: '#565658', height: 12 },
			{ label: 'Printed Design', color: '#464648', height: 14 },
			{ label: 'Foam/Felt Backing', color: '#383838', height: 18 },
			{ label: 'Fiberglass Carrier', color: '#2a2a2c', height: 10 },
		],
		matting: [
			{ label: 'Surface Insert (Carpet/Scraper)', color: '#4c4c4e', height: 20 },
			{ label: 'Aluminium Rail', color: '#606062', height: 14 },
			{ label: 'Recessed Well Frame', color: '#2a2a2c', height: 24 },
		],
		more: [
			{ label: 'Surface Layer', color: '#4a4a4c', height: 16 },
			{ label: 'Core (varies)', color: '#3a3a3c', height: 20 },
			{ label: 'Substrate (varies)', color: '#2e2e30', height: 16 },
		],
	};

	const installInfo: Record<string, { method: string; desc: string }> = {
		'carpet-tile': { method: 'Grid Layout', desc: 'Tiles placed in ashlar, brick, quarter-turn, herringbone, or monolithic patterns. Glue-down with releasable tackifier or full-spread adhesive.' },
		carpet: { method: 'Stretch & Glue', desc: 'Direct glue-down or double-stick over cushion. Power-stretched seams with knee kicker and seam iron for wall-to-wall installations.' },
		lvt: { method: 'Click-Lock / Glue', desc: 'Rigid core planks snap together with click-lock joints. Also available in glue-down and loose-lay formats. Stagger joints minimum 6 inches.' },
		hardwood: { method: 'Nail-Down', desc: 'Pneumatic nailer drives cleats through tongue at 45 degrees into subfloor. Also glue-down for concrete slab and floating for engineered plank.' },
		rubber: { method: 'Full-Spread Adhesive', desc: 'Tiles or rolls set in full-spread adhesive on prepared substrate. Seams heat-welded or chemically fused for monolithic finish.' },
		ceramic: { method: 'Thinset Mortar', desc: 'Trowel applies modified thinset to substrate. Tile pressed and leveled with spacer clips. Grouted after 24-hour cure.' },
		sheet: { method: 'Roll & Flash Cove', desc: 'Sheet unrolled and trimmed to room dimensions. Flash-coved up walls for seamless transitions. Heat-welded seams for waterproof joints.' },
		matting: { method: 'Recessed Frame', desc: 'Aluminium frame set into floor recess at entrance. Modular carpet/scraper inserts drop into rails. Frame is level with surrounding finish floor.' },
		more: { method: 'Professional Install', desc: 'Installation method varies by product type. Our crews are certified across all commercial flooring systems.' },
	};

	const maintenanceInfo: Record<string, { daily: string; periodic: string; avoid: string }> = {
		'carpet-tile': { daily: 'Vacuum with CRI-approved equipment. Spot-clean spills immediately with approved carpet spotter.', periodic: 'Hot water extraction every 12–18 months. Rotate high-traffic tiles with low-traffic tiles to even wear.', avoid: 'Bleach, ammonia-based cleaners, over-wetting. Never use a beater bar on loop pile.' },
		carpet: { daily: 'Vacuum daily in high-traffic areas. Walk-off mats at all entries to reduce soil load.', periodic: 'Professional extraction cleaning annually. Interim encapsulation cleaning quarterly in heavy-use zones.', avoid: 'Excessive moisture, harsh chemicals, dragging heavy furniture without glides.' },
		lvt: { daily: 'Dust mop or vacuum (no beater bar). Damp mop with pH-neutral cleaner as needed.', periodic: 'Machine scrub with auto-scrubber quarterly. Apply manufacturer-recommended floor finish annually.', avoid: 'Rubber-backed mats (staining), steam mops, abrasive pads, solvent-based cleaners.' },
		hardwood: { daily: 'Dust mop or vacuum with hard-floor setting. Wipe spills immediately.', periodic: 'Screen and recoat every 3–5 years. Full sand and refinish when wear layer is thin.', avoid: 'Wet mopping, steam cleaners, vinegar, wax-based polishes on polyurethane finish.' },
		rubber: { daily: 'Auto-scrubber or damp mop with pH-neutral cleaner. Remove grit that acts as abrasive.', periodic: 'Deep scrub with low-speed buffer and manufacturer-approved pad quarterly.', avoid: 'Solvent-based cleaners, petroleum products, excessive water standing on seams.' },
		ceramic: { daily: 'Sweep and damp mop. Clean grout lines with soft brush as needed.', periodic: 'Machine scrub grout lines semi-annually. Seal grout annually in wet areas.', avoid: 'Acid cleaners on natural stone, metal tools on grout, standing water in freeze-thaw zones.' },
		sheet: { daily: 'Auto-scrubber or damp mop with neutral cleaner. Squeegee in wet areas.', periodic: 'Strip and re-apply floor finish per manufacturer schedule. Inspect heat-welded seams annually.', avoid: 'Harsh solvents, abrasive pads, rolling loads with small hard casters.' },
		matting: { daily: 'Vacuum inserts in place. Shake out loose mats. Sweep frame channel.', periodic: 'Remove inserts quarterly for deep cleaning and frame inspection. Replace worn inserts.', avoid: 'Pressure washing aluminium frames, leaving wet inserts in frames, using inserts as ramps.' },
		more: { daily: 'Follow manufacturer-specific cleaning protocol for each product type.', periodic: 'Schedule professional maintenance per product warranty requirements.', avoid: 'Using generic cleaners — always verify compatibility with specific flooring material.' },
	};
</script>

<svelte:head>
	<title>Young Carpets Inc. — Commercial Flooring | Ottawa, ON</title>
	<meta
		name="description"
		content="Young Carpets Inc. — Commercial flooring in Ottawa since 1991. Supply, installation, maintenance — for offices, institutions, and retail."
	/>
	<meta name="theme-color" content="#0b0b0d" />
</svelte:head>

<div class="yc-page v11" bind:this={pageEl}>
	{#if dev}
		<div class="yc-dev-version-badge" aria-hidden="true">v{ycVersion} · V11</div>
	{/if}

	<!-- Scroll progress indicator -->
	<div class="v11-progress" style="transform: scaleX({scrollProgress})" aria-hidden="true"></div>

	<a class="yc-skip-link" href="#products">Skip to content</a>

	<!-- 3-layer architectural plan parallax backdrop -->
	<div class="yc-bg-plan" aria-hidden="true">
		<img class="yc-bg-plan-img yc-bg-plan-layer-1" src="/young-carpets/bg.jpg" alt="" />
		<img class="yc-bg-plan-img yc-bg-plan-layer-2" src="/young-carpets/bg.jpg" alt="" />
		<div class="yc-bg-plan-grid yc-bg-plan-layer-3"></div>
	</div>

	<!-- Navbar -->
	<nav class="v11-nav">
		<div class="v11-nav-left">
			<a href="/young-carpets/dev/v11" class="v11-nav-brand">YOUNG</a>
			{#if activeSection && sectionMap[activeSection]}
				<span class="v11-nav-section">{sectionMap[activeSection]}</span>
			{/if}
		</div>
		<div class="v11-nav-right">
			<ThemeToggle />
			<button
				class="v11-hamburger"
				onclick={() => mobileMenuOpen = !mobileMenuOpen}
				aria-label="Toggle menu"
				aria-expanded={mobileMenuOpen}
			>
				<span class="v11-hamburger-bar" class:open={mobileMenuOpen}></span>
				<span class="v11-hamburger-bar" class:open={mobileMenuOpen}></span>
				<span class="v11-hamburger-bar" class:open={mobileMenuOpen}></span>
			</button>
		</div>
		{#if mobileMenuOpen}
			<div class="v11-mobile-menu">
				<button onclick={() => v11ScrollTo('products')}>Products</button>
				<button onclick={() => v11ScrollTo('what')}>Services</button>
				<button onclick={() => v11ScrollTo('contact')}>Contact</button>
			</div>
		{/if}
	</nav>

	<!-- Hero — maple leaf, YOUNG, tagline, CTAs, stat counters -->
	<section class="yc-hero" class:alive={heroAlive}>
		<div class="yc-container">
			<div class="v11-hero-maple" aria-label="Proudly Canadian">
				<svg class="yc-maple-leaf" viewBox="-2015 -2000 4030 4030" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
					<path
						d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z"
						fill="currentColor"
					/>
				</svg>
			</div>
			<p class="v11-hero-tag">Commercial Flooring &middot; Ottawa, Ontario</p>
			<h1 class="v11-wordmark" class:v11-wordmark--ready={wordmarkReady} aria-label="Young">
				{#each LETTERS as ch, i (ch + i)}
					<span
						class="v11-wordmark__char"
						style="--young-i: {i};"
						aria-hidden="true"
					>{ch}</span>
				{/each}
			</h1>
			<p class="v11-hero-sub">
				Supply, installation, and maintenance &mdash; for offices, institutions, and retail.
			</p>
			<div class="v11-hero-actions">
				<button class="v11-cta-primary" onclick={() => v11ScrollTo('products')}>
					View Products
				</button>
				<a href="tel:613-744-2744" class="v11-cta-secondary">
					Call Us
				</a>
			</div>
			<div class="v11-hero-stats">
				<div class="v11-stat">
					<span class="v11-stat-number" use:countUp data-target="250" data-suffix="+">0</span>
					<span class="v11-stat-label">combined years</span>
				</div>
				<div class="v11-stat">
					<span class="v11-stat-number" use:countUp data-target="50000" data-suffix="+">0</span>
					<span class="v11-stat-label">jobs completed</span>
				</div>
			</div>
		</div>
	</section>

	<!-- Products — 9 cards with SVG textures -->
	<section id="products" class="yc-section yc-section--products" use:reveal>
		<div class="yc-container">
			<p class="yc-section-eyebrow">Products</p>
			<h2 class="yc-section-title">What We Install</h2>
			<div class="yc-products-grid">
				{#each featureProducts as p, i (p.code)}
					<button
						class="yc-product-card"
						class:yc-product-card--has-image={p.image}
						data-material={p.material}
						use:cardPointer
						style={p.image
							? `--i: ${i}; --yc-product-image: url(${p.image})`
							: `--i: ${i}`}
						type="button"
						onclick={() => showProduct(p)}
						aria-label="View details for {p.name}"
					>
						{#if !p.image}
							<div class="yc-product-card-texture" data-material={p.material} aria-hidden="true">
								{#if p.material === 'carpet'}
									<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" stroke-width="1.4" fill="none"><path d="M 38 150 L 38 82 Q 38 80 40 80 Q 42 80 42 82 L 42 150 Z" /><path d="M 50 150 L 50 74 Q 50 72 52 72 Q 54 72 54 74 L 54 150 Z" /><path d="M 62 150 L 62 87 Q 62 85 64 85 Q 66 85 66 87 L 66 150 Z" /><path d="M 74 150 L 74 70 Q 74 68 76 68 Q 78 68 78 70 L 78 150 Z" /><path d="M 86 150 L 86 80 Q 86 78 88 78 Q 90 78 90 80 L 90 150 Z" /><path d="M 98 150 L 98 76 Q 98 74 100 74 Q 102 74 102 76 L 102 150 Z" /><path d="M 110 150 L 110 84 Q 110 82 112 82 Q 114 82 114 84 L 114 150 Z" /><path d="M 122 150 L 122 72 Q 122 70 124 70 Q 126 70 126 72 L 126 150 Z" /><path d="M 134 150 L 134 82 Q 134 80 136 80 Q 138 80 138 82 L 138 150 Z" /><path d="M 146 150 L 146 88 Q 146 86 148 86 Q 150 86 150 88 L 150 150 Z" /><path d="M 158 150 L 158 76 Q 158 74 160 74 Q 162 74 162 76 L 162 150 Z" /></g></svg>
								{:else if p.material === 'carpet-tile'}
									<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" stroke-width="1.5" fill="none"><rect x="30" y="40" width="38" height="38" rx="3" /><rect x="72" y="40" width="38" height="38" rx="3" /><rect x="114" y="40" width="38" height="38" rx="3" /><rect x="50" y="82" width="38" height="38" rx="3" /><rect x="92" y="82" width="38" height="38" rx="3" /><rect x="134" y="82" width="38" height="38" rx="3" /><rect x="30" y="124" width="38" height="38" rx="3" /><rect x="72" y="124" width="38" height="38" rx="3" /><rect x="114" y="124" width="38" height="38" rx="3" /></g></svg>
								{:else if p.material === 'lvt'}
									<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" fill="none"><rect x="15" y="35" width="78" height="24" rx="2" stroke-width="1.8" /><line x1="22" y1="42" x2="86" y2="42" stroke-width="0.7" opacity="0.55" /><line x1="22" y1="47" x2="86" y2="47" stroke-width="0.7" opacity="0.4" /><line x1="22" y1="52" x2="86" y2="52" stroke-width="0.7" opacity="0.55" /><rect x="107" y="35" width="78" height="24" rx="2" stroke-width="1.8" /><line x1="114" y1="42" x2="178" y2="42" stroke-width="0.7" opacity="0.55" /><line x1="114" y1="47" x2="178" y2="47" stroke-width="0.7" opacity="0.4" /><line x1="114" y1="52" x2="178" y2="52" stroke-width="0.7" opacity="0.55" /><rect x="61" y="65" width="78" height="24" rx="2" stroke-width="1.8" /><line x1="68" y1="72" x2="132" y2="72" stroke-width="0.7" opacity="0.55" /><line x1="68" y1="77" x2="132" y2="77" stroke-width="0.7" opacity="0.4" /><line x1="68" y1="82" x2="132" y2="82" stroke-width="0.7" opacity="0.55" /><rect x="15" y="95" width="78" height="24" rx="2" stroke-width="1.8" /><line x1="22" y1="102" x2="86" y2="102" stroke-width="0.7" opacity="0.55" /><line x1="22" y1="107" x2="86" y2="107" stroke-width="0.7" opacity="0.4" /><line x1="22" y1="112" x2="86" y2="112" stroke-width="0.7" opacity="0.55" /><rect x="107" y="95" width="78" height="24" rx="2" stroke-width="1.8" /><line x1="114" y1="102" x2="178" y2="102" stroke-width="0.7" opacity="0.55" /><line x1="114" y1="107" x2="178" y2="107" stroke-width="0.7" opacity="0.4" /><line x1="114" y1="112" x2="178" y2="112" stroke-width="0.7" opacity="0.55" /><rect x="61" y="125" width="78" height="24" rx="2" stroke-width="1.8" /><line x1="68" y1="132" x2="132" y2="132" stroke-width="0.7" opacity="0.55" /><line x1="68" y1="137" x2="132" y2="137" stroke-width="0.7" opacity="0.4" /><line x1="68" y1="142" x2="132" y2="142" stroke-width="0.7" opacity="0.55" /></g></svg>
								{:else if p.material === 'hardwood'}
									<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" fill="none"><rect x="15" y="35" width="100" height="22" rx="1.5" stroke-width="1.8" /><path d="M 22 42 Q 60 38 108 44" stroke-width="0.8" opacity="0.6" /><path d="M 22 48 Q 55 50 108 47" stroke-width="0.8" opacity="0.45" /><path d="M 22 53 Q 50 51 108 53" stroke-width="0.8" opacity="0.55" /><ellipse cx="55" cy="46" rx="2.5" ry="1.4" stroke-width="0.7" opacity="0.6" /><rect x="123" y="35" width="62" height="22" rx="1.5" stroke-width="1.8" /><path d="M 130 42 Q 150 39 178 43" stroke-width="0.8" opacity="0.55" /><path d="M 130 48 Q 155 50 178 47" stroke-width="0.8" opacity="0.45" /><path d="M 130 53 Q 152 51 178 52" stroke-width="0.8" opacity="0.55" /><rect x="15" y="65" width="58" height="22" rx="1.5" stroke-width="1.8" /><path d="M 22 72 Q 42 70 66 73" stroke-width="0.8" opacity="0.55" /><path d="M 22 77 Q 40 79 66 76" stroke-width="0.8" opacity="0.45" /><path d="M 22 82 Q 45 81 66 83" stroke-width="0.8" opacity="0.55" /><ellipse cx="42" cy="76" rx="2" ry="1.3" stroke-width="0.7" opacity="0.6" /><rect x="81" y="65" width="104" height="22" rx="1.5" stroke-width="1.8" /><path d="M 88 72 Q 130 68 178 74" stroke-width="0.8" opacity="0.6" /><path d="M 88 77 Q 125 80 178 76" stroke-width="0.8" opacity="0.45" /><path d="M 88 82 Q 135 81 178 83" stroke-width="0.8" opacity="0.55" /><rect x="15" y="95" width="80" height="22" rx="1.5" stroke-width="1.8" /><path d="M 22 102 Q 50 99 88 103" stroke-width="0.8" opacity="0.55" /><path d="M 22 107 Q 55 110 88 106" stroke-width="0.8" opacity="0.45" /><path d="M 22 112 Q 50 111 88 113" stroke-width="0.8" opacity="0.55" /><rect x="103" y="95" width="82" height="22" rx="1.5" stroke-width="1.8" /><path d="M 110 102 Q 145 98 178 104" stroke-width="0.8" opacity="0.6" /><path d="M 110 107 Q 140 110 178 106" stroke-width="0.8" opacity="0.45" /><path d="M 110 112 Q 148 111 178 113" stroke-width="0.8" opacity="0.55" /><ellipse cx="135" cy="106" rx="2.5" ry="1.5" stroke-width="0.7" opacity="0.6" /><rect x="15" y="125" width="110" height="22" rx="1.5" stroke-width="1.8" /><path d="M 22 132 Q 70 128 118 134" stroke-width="0.8" opacity="0.6" /><path d="M 22 137 Q 65 140 118 136" stroke-width="0.8" opacity="0.45" /><path d="M 22 142 Q 75 141 118 143" stroke-width="0.8" opacity="0.55" /><rect x="133" y="125" width="52" height="22" rx="1.5" stroke-width="1.8" /><path d="M 140 132 Q 158 130 178 133" stroke-width="0.8" opacity="0.55" /><path d="M 140 137 Q 156 139 178 136" stroke-width="0.8" opacity="0.45" /><path d="M 140 142 Q 158 141 178 143" stroke-width="0.8" opacity="0.55" /></g></svg>
								{:else if p.material === 'rubber'}
									<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><circle cx="40" cy="45" r="3" /><circle cx="62" cy="50" r="3" /><circle cx="84" cy="45" r="3" /><circle cx="106" cy="48" r="3" /><circle cx="128" cy="45" r="3" /><circle cx="150" cy="50" r="3" /><circle cx="35" cy="72" r="3" /><circle cx="57" cy="76" r="3" /><circle cx="79" cy="72" r="3" /><circle cx="101" cy="75" r="3" /><circle cx="123" cy="72" r="3" /><circle cx="145" cy="76" r="3" /><circle cx="40" cy="100" r="3" /><circle cx="62" cy="104" r="3" /><circle cx="84" cy="100" r="3" /><circle cx="106" cy="103" r="3" /><circle cx="128" cy="100" r="3" /><circle cx="150" cy="104" r="3" /><circle cx="45" cy="128" r="3" /><circle cx="67" cy="132" r="3" /><circle cx="89" cy="128" r="3" /><circle cx="111" cy="130" r="3" /><circle cx="133" cy="128" r="3" /><circle cx="155" cy="132" r="3" /><circle cx="38" cy="155" r="3" /><circle cx="60" cy="159" r="3" /><circle cx="82" cy="155" r="3" /><circle cx="104" cy="158" r="3" /><circle cx="126" cy="155" r="3" /><circle cx="148" cy="159" r="3" /></g></svg>
								{:else if p.material === 'ceramic'}
									<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="square"><rect x="30" y="42" width="42" height="42" /><rect x="78" y="42" width="42" height="42" /><rect x="126" y="42" width="42" height="42" /><rect x="30" y="90" width="42" height="42" /><g transform="translate(99, 111) rotate(45)"><rect x="-21" y="-21" width="42" height="42" /></g><rect x="126" y="90" width="42" height="42" /><rect x="30" y="138" width="42" height="42" /><rect x="78" y="138" width="42" height="42" /><rect x="126" y="138" width="42" height="42" /></g></svg>
								{:else if p.material === 'sheet'}
									<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" fill="none"><line x1="30" y1="20" x2="30" y2="120" stroke-width="1.5" opacity="0.5" /><line x1="60" y1="20" x2="60" y2="120" stroke-width="0.6" opacity="0.25" /><line x1="90" y1="20" x2="90" y2="120" stroke-width="0.6" opacity="0.25" /><line x1="120" y1="20" x2="120" y2="120" stroke-width="0.6" opacity="0.25" /><line x1="150" y1="20" x2="150" y2="120" stroke-width="0.6" opacity="0.25" /><line x1="180" y1="20" x2="180" y2="120" stroke-width="0.6" opacity="0.25" /><path d="M 30 90 L 30 110 Q 30 130 50 130 L 180 130" stroke-width="2.4" /><line x1="30" y1="90" x2="180" y2="90" stroke-width="1.2" opacity="0.7" stroke-dasharray="3 2" /><line x1="30" y1="130" x2="180" y2="130" stroke-width="2.4" /><line x1="50" y1="148" x2="180" y2="148" stroke-width="0.8" opacity="0.4" /><line x1="60" y1="166" x2="180" y2="166" stroke-width="0.8" opacity="0.3" /><line x1="105" y1="130" x2="105" y2="180" stroke-width="0.7" opacity="0.5" stroke-dasharray="2 2" /><line x1="55" y1="138" x2="170" y2="138" stroke-width="1" opacity="0.65" /></g></svg>
								{:else if p.material === 'matting'}
									<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" fill="none"><rect x="22" y="32" width="156" height="136" rx="3" stroke-width="1.6" /><line x1="28" y1="44" x2="172" y2="44" stroke-width="1.6" /><line x1="28" y1="58" x2="172" y2="58" stroke-width="1.6" /><line x1="28" y1="72" x2="172" y2="72" stroke-width="1.6" /><line x1="28" y1="86" x2="172" y2="86" stroke-width="1.6" /><line x1="28" y1="100" x2="172" y2="100" stroke-width="1.6" /><line x1="28" y1="114" x2="172" y2="114" stroke-width="1.6" /><line x1="28" y1="128" x2="172" y2="128" stroke-width="1.6" /><line x1="28" y1="142" x2="172" y2="142" stroke-width="1.6" /><line x1="28" y1="156" x2="172" y2="156" stroke-width="1.6" /><g stroke-width="0.7" opacity="0.6"><line x1="40" y1="51" x2="40" y2="55" /><line x1="56" y1="51" x2="56" y2="55" /><line x1="72" y1="51" x2="72" y2="55" /><line x1="88" y1="51" x2="88" y2="55" /><line x1="104" y1="51" x2="104" y2="55" /><line x1="120" y1="51" x2="120" y2="55" /><line x1="136" y1="51" x2="136" y2="55" /><line x1="152" y1="51" x2="152" y2="55" /><line x1="40" y1="79" x2="40" y2="83" /><line x1="56" y1="79" x2="56" y2="83" /><line x1="72" y1="79" x2="72" y2="83" /><line x1="88" y1="79" x2="88" y2="83" /><line x1="104" y1="79" x2="104" y2="83" /><line x1="120" y1="79" x2="120" y2="83" /><line x1="136" y1="79" x2="136" y2="83" /><line x1="152" y1="79" x2="152" y2="83" /><line x1="40" y1="107" x2="40" y2="111" /><line x1="56" y1="107" x2="56" y2="111" /><line x1="72" y1="107" x2="72" y2="111" /><line x1="88" y1="107" x2="88" y2="111" /><line x1="104" y1="107" x2="104" y2="111" /><line x1="120" y1="107" x2="120" y2="111" /><line x1="136" y1="107" x2="136" y2="111" /><line x1="152" y1="107" x2="152" y2="111" /><line x1="40" y1="135" x2="40" y2="139" /><line x1="56" y1="135" x2="56" y2="139" /><line x1="72" y1="135" x2="72" y2="139" /><line x1="88" y1="135" x2="88" y2="139" /><line x1="104" y1="135" x2="104" y2="139" /><line x1="120" y1="135" x2="120" y2="139" /><line x1="136" y1="135" x2="136" y2="139" /><line x1="152" y1="135" x2="152" y2="139" /></g></g></svg>
								{:else if p.material === 'more'}
									<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" fill="none"><rect x="22" y="22" width="74" height="74" rx="3" stroke-width="1.4" opacity="0.5" /><line x1="32" y1="86" x2="32" y2="40" stroke-width="0.7" opacity="0.55" /><line x1="42" y1="86" x2="42" y2="36" stroke-width="0.7" opacity="0.55" /><line x1="52" y1="86" x2="52" y2="42" stroke-width="0.7" opacity="0.55" /><line x1="62" y1="86" x2="62" y2="38" stroke-width="0.7" opacity="0.55" /><line x1="72" y1="86" x2="72" y2="40" stroke-width="0.7" opacity="0.55" /><line x1="82" y1="86" x2="82" y2="36" stroke-width="0.7" opacity="0.55" /><rect x="104" y="22" width="74" height="74" rx="3" stroke-width="1.4" opacity="0.5" /><rect x="112" y="30" width="26" height="26" stroke-width="0.7" opacity="0.55" /><rect x="144" y="30" width="26" height="26" stroke-width="0.7" opacity="0.55" /><rect x="112" y="62" width="26" height="26" stroke-width="0.7" opacity="0.55" /><rect x="144" y="62" width="26" height="26" stroke-width="0.7" opacity="0.55" /><rect x="22" y="104" width="74" height="74" rx="3" stroke-width="1.4" opacity="0.5" /><rect x="30" y="114" width="58" height="14" stroke-width="0.7" opacity="0.55" /><rect x="30" y="132" width="58" height="14" stroke-width="0.7" opacity="0.55" /><rect x="30" y="150" width="58" height="14" stroke-width="0.7" opacity="0.55" /><rect x="104" y="104" width="74" height="74" rx="3" stroke-width="1.4" opacity="0.5" /><g fill="currentColor" stroke="none" opacity="0.7"><circle cx="118" cy="118" r="2" /><circle cx="135" cy="120" r="2" /><circle cx="152" cy="118" r="2" /><circle cx="169" cy="120" r="2" /><circle cx="118" cy="135" r="2" /><circle cx="135" cy="137" r="2" /><circle cx="152" cy="135" r="2" /><circle cx="169" cy="137" r="2" /><circle cx="118" cy="152" r="2" /><circle cx="135" cy="154" r="2" /><circle cx="152" cy="152" r="2" /><circle cx="169" cy="154" r="2" /><circle cx="118" cy="169" r="2" /><circle cx="135" cy="171" r="2" /><circle cx="152" cy="169" r="2" /><circle cx="169" cy="171" r="2" /></g><line x1="100" y1="86" x2="100" y2="114" stroke-width="2.6" stroke-linecap="round" opacity="0.85" /><line x1="86" y1="100" x2="114" y2="100" stroke-width="2.6" stroke-linecap="round" opacity="0.85" /></g></svg>
								{/if}
							</div>
						{/if}
						<span class="yc-card-shine" aria-hidden="true"></span>
						<div class="yc-product-badges" aria-hidden="true">
							{#each p.badges as b}
								<span class="yc-badge">{b}</span>
							{/each}
						</div>
						<div class="yc-product-card-body">
							<p class="yc-product-code">{p.code}</p>
							{#if p.nameHtml}
								<h3 class="yc-product-name">{@html p.nameHtml}</h3>
							{:else}
								<h3 class="yc-product-name">{p.name}</h3>
							{/if}
							<p class="yc-product-blurb">{p.blurb}</p>
						</div>
					</button>
				{/each}
			</div>
		</div>
	</section>



	<!-- Suppliers marquee -->
	<section id="suppliers" class="yc-section yc-section--suppliers" use:reveal>
		<div class="yc-container">
			<p class="yc-section-eyebrow">Authorized Dealer</p>
			<h2 class="yc-section-title">Brands We Work With</h2>
		</div>
		<div class="yc-marquee" aria-label="Suppliers carousel">
			<div class="yc-marquee-track">
				{#each [...suppliers, ...suppliers] as s, i (i)}
					<a
						class="yc-marquee-item"
						href={s.url}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`Visit ${s.name}`}
					>
						<span class="yc-marquee-wordmark">{s.name}</span>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- Services — 3 cards -->
	<section id="what" class="yc-section yc-section--services" use:reveal>
		<div class="yc-container">
			<p class="yc-section-eyebrow">What We Do</p>
			<h2 class="yc-section-title">Services</h2>
			<div class="v11-services-grid">
				<div class="yc-card" use:cardPointer>
					<span class="yc-card-shine" aria-hidden="true"></span>
					<h3>Commercial Installation</h3>
					<p>
						From new construction to renovations &mdash; offices, schools,
						healthcare facilities, retail spaces, gyms, and industrial buildings.
					</p>
				</div>
				<div class="yc-card" use:cardPointer>
					<span class="yc-card-shine" aria-hidden="true"></span>
					<h3>Consultation</h3>
					<p>
						Material selection and specification for commercial projects, with
						sample boards and on-site mockups for design teams.
					</p>
				</div>
				<div class="yc-card" use:cardPointer>
					<span class="yc-card-shine" aria-hidden="true"></span>
					<h3>Maintenance &amp; Repair</h3>
					<p>
						Hardwood maintenance, screening and recoats, repairs, and full
						replacement across the National Capital Region.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Map -->
	<section id="map" class="yc-map-section" use:reveal>
		<div class="yc-container">
			<p class="yc-section-eyebrow">Find Us</p>
			<h2 class="yc-section-title">Our Location</h2>
			<p class="yc-map-address">
				Unit 316 &mdash; 1228 Old Innes Road, Ottawa, ON K1B 3V3
			</p>
			<button
				type="button"
				class="yc-map-preview"
				onclick={openMap}
				aria-label="Open larger map of Young Carpets Inc."
			>
				<iframe
					class="yc-map-preview-iframe"
					title="Young Carpets Inc. — preview"
					src="https://www.google.com/maps?q=1228+Old+Innes+Rd+Unit+316+Ottawa+ON+K1B+3V3&output=embed&z=15"
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					tabindex="-1"
					aria-hidden="true"
				></iframe>
				<span class="yc-map-preview-overlay" aria-hidden="true">
					<span class="yc-map-preview-pill">Tap to expand</span>
				</span>
			</button>
		</div>
	</section>

	<!-- Contact — consolidated, V6 gold standard -->
	<section id="contact" class="yc-section yc-section--contact" use:reveal>
		<div class="yc-container">
			<p class="yc-section-eyebrow">Get In Touch</p>
			<h2 class="yc-section-title">Contact</h2>

			<div class="v11-contact-grid">
				<div class="v11-contact-people">
					{#each [
						{ name: 'Ryan Young', phone: '613-277-7926', email: 'ryoung@youngcarpets.com' },
						{ name: 'Derek Young', phone: '613-612-8487', email: 'dyoung@youngcarpets.com' },
						{ name: 'Peter Helis', phone: '613-864-6998', email: 'phelis@youngcarpets.com' },
						{ name: 'Mike Noel', phone: '613-222-5987', email: 'mnoel@youngcarpets.com' },
						{ name: 'Clayton Bradley', phone: '613-290-5075', email: 'cbradley@youngcarpets.com' },
						{ name: "Alan O'Connor", phone: '613-791-3252', email: 'aoconnor@youngcarpets.com' },
					] as person}
						<div class="v11-person-card">
							<strong>{person.name}</strong>
							<a href="tel:{person.phone.replace(/[^0-9+]/g, '')}">{person.phone}</a>
							<a href="mailto:{person.email}">{person.email}</a>
						</div>
					{/each}
				</div>

				<div class="v11-contact-side">
					<div class="v11-contact-card">
						<h3>Accounting</h3>
						<div class="v11-person-card">
							<strong>Alan Young</strong>
							<a href="tel:6138789911">613-878-9911</a>
							<a href="mailto:accounting@youngcarpets.com">accounting@youngcarpets.com</a>
						</div>
						<div class="v11-person-card">
							<strong>Accounts Payable</strong>
							<a href="mailto:ap@youngcarpets.com">ap@youngcarpets.com</a>
						</div>
					</div>
					<div class="v11-contact-card">
						<h3>Office</h3>
						<div class="v11-person-card">
							<strong>Main Line</strong>
							<a href="tel:6137442744">613-744-2744</a>
						</div>
						<div class="v11-person-card">
							<strong>General</strong>
							<a href="mailto:info@youngcarpets.com">info@youngcarpets.com</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ======= INLINE PRODUCT MODAL ======= -->
	{#if openProduct}
		{@const mat = openProduct.material}
		{@const layers = layerMap[mat] || layerMap['more']}
		{@const install = installInfo[mat] || installInfo['more']}
		{@const maint = maintenanceInfo[mat] || maintenanceInfo['more']}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="v11-modal-backdrop" onclick={closeProduct}>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="v11-modal" onclick={(e) => e.stopPropagation()}>
				<button class="v11-modal-close" onclick={closeProduct} aria-label="Close">
					<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
				</button>

				<div class="v11-modal-header">
					<span class="v11-modal-code">{openProduct.code}</span>
					{#if openProduct.nameHtml}
						<h2 class="v11-modal-title">{@html openProduct.nameHtml}</h2>
					{:else}
						<h2 class="v11-modal-title">{openProduct.name}</h2>
					{/if}
				</div>

				<!-- Tab buttons -->
				<div class="v11-modal-tabs">
					<button
						class="v11-tab-btn"
						class:v11-tab-btn--active={activeTab === 'product'}
						onclick={() => switchTab('product')}
					>Product</button>
					<button
						class="v11-tab-btn"
						class:v11-tab-btn--active={activeTab === 'install'}
						onclick={() => switchTab('install')}
					>Install</button>
					<button
						class="v11-tab-btn"
						class:v11-tab-btn--active={activeTab === 'maintenance'}
						onclick={() => switchTab('maintenance')}
					>Maintenance</button>
				</div>

				<!-- Tab content -->
				<div class="v11-modal-body">
					{#key tabAnimKey}
						{#if activeTab === 'product'}
							<!-- == PRODUCT TAB == Cross-section diagram -->
							<div class="v11-tab-content v11-tab-enter">
								<div class="v11-cross-section">
									<div class="v11-cs-title-row">
										<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 14 L2 2 L14 2"/><path d="M2 14 L14 14"/><path d="M5 8 L5 14" opacity="0.5"/><path d="M8 5 L8 14" opacity="0.5"/><path d="M11 9 L11 14" opacity="0.5"/></svg>
										<span class="v11-cs-label">Cross-Section</span>
									</div>
									<div class="v11-cs-diagram">
										{#each layers as layer, li}
											<div
												class="v11-cs-layer"
												style="
													--layer-color: {layer.color};
													--layer-h: {layer.height}px;
													--layer-i: {li};
												"
											>
												<div class="v11-cs-layer-fill"></div>
												<span class="v11-cs-layer-label">{layer.label}</span>
												<div class="v11-cs-dim-line">
													<span class="v11-cs-dim-cap"></span>
													<span class="v11-cs-dim-stem"></span>
													<span class="v11-cs-dim-cap"></span>
												</div>
											</div>
										{/each}
									</div>
								</div>
								<div class="v11-tab-text">
									<p>{openProduct.details || openProduct.blurb}</p>
								</div>
							</div>

						{:else if activeTab === 'install'}
							<!-- == INSTALL TAB == -->
							<div class="v11-tab-content v11-tab-enter">
								<div class="v11-install-visual">
									<div class="v11-install-icon">
										{#if mat === 'carpet-tile'}
											<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
												<g stroke="#606062" stroke-width="1.2" fill="none">
													<rect x="10" y="10" width="40" height="40" rx="2" fill="#3a3a3c" class="v11-install-tile v11-it-1"/>
													<rect x="55" y="10" width="40" height="40" rx="2" fill="#444446" class="v11-install-tile v11-it-2"/>
													<rect x="100" y="10" width="40" height="40" rx="2" fill="#3a3a3c" class="v11-install-tile v11-it-3"/>
													<rect x="145" y="10" width="40" height="40" rx="2" fill="#444446" class="v11-install-tile v11-it-4"/>
													<rect x="10" y="55" width="40" height="40" rx="2" fill="#444446" class="v11-install-tile v11-it-5"/>
													<rect x="55" y="55" width="40" height="40" rx="2" fill="#3a3a3c" class="v11-install-tile v11-it-6"/>
													<rect x="100" y="55" width="40" height="40" rx="2" fill="#444446" class="v11-install-tile v11-it-7"/>
													<rect x="145" y="55" width="40" height="40" rx="2" fill="#3a3a3c" class="v11-install-tile v11-it-8"/>
													<rect x="10" y="100" width="40" height="40" rx="2" fill="#3a3a3c" class="v11-install-tile v11-it-9" opacity="0.4" stroke-dasharray="3 2"/>
												</g>
												<path d="M30 135 L30 115" stroke="#d4b87a" stroke-width="1.5" fill="none" marker-end="url(#v11arr)"/>
												<defs><marker id="v11arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#d4b87a"/></marker></defs>
											</svg>
										{:else if mat === 'lvt'}
											<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
												<g stroke="#606062" stroke-width="1" fill="none">
													<rect x="10" y="20" width="85" height="26" rx="2" fill="#3e3e40" class="v11-install-plank v11-ip-1"/>
													<rect x="100" y="20" width="85" height="26" rx="2" fill="#444446" class="v11-install-plank v11-ip-2"/>
													<rect x="50" y="50" width="85" height="26" rx="2" fill="#444446" class="v11-install-plank v11-ip-3"/>
													<rect x="140" y="50" width="50" height="26" rx="2" fill="#3e3e40" class="v11-install-plank v11-ip-4"/>
													<rect x="10" y="80" width="85" height="26" rx="2" fill="#3e3e40" class="v11-install-plank v11-ip-5"/>
													<rect x="100" y="80" width="85" height="26" rx="2" fill="#444446" class="v11-install-plank v11-ip-6" opacity="0.5" stroke-dasharray="3 2"/>
												</g>
												<g class="v11-click-indicator">
													<circle cx="100" cy="65" r="6" stroke="#d4b87a" stroke-width="1.2" fill="none"/>
													<path d="M97 65 L103 65 M100 62 L100 68" stroke="#d4b87a" stroke-width="1"/>
												</g>
											</svg>
										{:else if mat === 'sheet'}
											<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
												<g stroke="#606062" stroke-width="1.2" fill="none">
													<line x1="30" y1="10" x2="30" y2="110" stroke-width="2"/>
													<line x1="30" y1="110" x2="190" y2="110" stroke-width="2"/>
													<path d="M30 100 Q30 90 40 90 L160 90" stroke="#4a4a4c" stroke-width="3" fill="none" class="v11-sheet-unroll"/>
													<path d="M33 40 L33 100 Q33 108 40 108" stroke="#d4b87a" stroke-width="1.5" stroke-dasharray="4 2" class="v11-cove-line"/>
													<circle cx="175" cy="85" r="12" stroke="#4a4a4c" stroke-width="1.5" fill="#2a2a2c" class="v11-roll"/>
													<circle cx="175" cy="85" r="4" stroke="#606062" stroke-width="0.8"/>
												</g>
												<text x="35" y="35" fill="#888" font-size="8" font-family="monospace">WALL</text>
												<text x="100" y="125" fill="#888" font-size="8" font-family="monospace">FLOOR</text>
											</svg>
										{:else if mat === 'hardwood'}
											<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
												<g stroke="#606062" stroke-width="1" fill="none">
													<rect x="10" y="80" width="180" height="16" rx="1" fill="#443e36"/>
													<rect x="10" y="98" width="180" height="12" rx="1" fill="#383430"/>
													<path d="M10 80 L10 96 L190 96 L190 80" stroke="#504a42" stroke-width="0.8"/>
													<line x1="60" y1="45" x2="65" y2="80" stroke="#d4b87a" stroke-width="1.5" class="v11-nail"/>
													<line x1="120" y1="45" x2="125" y2="80" stroke="#d4b87a" stroke-width="1.5" class="v11-nail v11-nail-2"/>
													<rect x="45" y="20" width="30" height="28" rx="3" fill="#2a2a2c" stroke="#555" class="v11-nailer"/>
													<rect x="105" y="20" width="30" height="28" rx="3" fill="#2a2a2c" stroke="#555" class="v11-nailer v11-nailer-2"/>
												</g>
												<text x="42" y="135" fill="#888" font-size="8" font-family="monospace">45° NAIL THROUGH TONGUE</text>
											</svg>
										{:else if mat === 'rubber'}
											<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
												<g stroke="#606062" stroke-width="1" fill="none">
													<path d="M10 85 Q20 80 30 85 Q40 90 50 85 Q60 80 70 85 Q80 90 90 85 Q100 80 110 85 Q120 90 130 85 Q140 80 150 85 Q160 90 170 85 Q180 80 190 85" stroke="#555" stroke-width="1" class="v11-adhesive"/>
													<rect x="10" y="55" width="55" height="25" rx="2" fill="#3a3a3c" class="v11-rubber-tile v11-rt-1"/>
													<rect x="70" y="55" width="55" height="25" rx="2" fill="#444446" class="v11-rubber-tile v11-rt-2"/>
													<rect x="130" y="40" width="55" height="25" rx="2" fill="#3a3a3c" class="v11-rubber-tile v11-rt-3" opacity="0.6" stroke-dasharray="3 2"/>
												</g>
												<g class="v11-trowel" transform="translate(140,20)">
													<rect x="0" y="0" width="35" height="6" rx="1" fill="#555"/>
													<rect x="12" y="-10" width="4" height="12" rx="1" fill="#444"/>
												</g>
											</svg>
										{:else if mat === 'ceramic'}
											<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
												<g stroke="#606062" stroke-width="1" fill="none">
													<rect x="10" y="100" width="180" height="20" rx="1" fill="#2a2a2c"/>
													<rect x="10" y="85" width="180" height="15" rx="1" fill="#383838"/>
													<rect x="12" y="55" width="42" height="28" rx="1" fill="#3e3e40" class="v11-ceramic-tile v11-ct-1"/>
													<rect x="58" y="55" width="42" height="28" rx="1" fill="#484848" class="v11-ceramic-tile v11-ct-2"/>
													<rect x="104" y="55" width="42" height="28" rx="1" fill="#3e3e40" class="v11-ceramic-tile v11-ct-3"/>
													<rect x="150" y="45" width="42" height="28" rx="1" fill="#484848" class="v11-ceramic-tile v11-ct-4" opacity="0.5" stroke-dasharray="3 2"/>
													<line x1="56" y1="58" x2="56" y2="80" stroke="#d4b87a" stroke-width="1"/>
													<line x1="102" y1="58" x2="102" y2="80" stroke="#d4b87a" stroke-width="1"/>
												</g>
												<text x="15" y="115" fill="#666" font-size="7" font-family="monospace">SUBSTRATE</text>
												<text x="15" y="97" fill="#777" font-size="7" font-family="monospace">THINSET</text>
											</svg>
										{:else}
											<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
												<g stroke="#606062" stroke-width="1.2" fill="none">
													<rect x="30" y="40" width="140" height="60" rx="6" fill="#2a2a2c"/>
													<circle cx="100" cy="70" r="20" stroke="#555" stroke-width="1.5"/>
													<path d="M90 70 L97 77 L112 62" stroke="#d4b87a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
												</g>
												<text x="48" y="120" fill="#888" font-size="9" font-family="monospace">CERTIFIED INSTALL</text>
											</svg>
										{/if}
									</div>
									<h3 class="v11-install-method">{install.method}</h3>
								</div>
								<div class="v11-tab-text">
									<p>{install.desc}</p>
								</div>
							</div>

						{:else if activeTab === 'maintenance'}
							<!-- == MAINTENANCE TAB == -->
							<div class="v11-tab-content v11-tab-enter">
								<div class="v11-maint-visual">
									<div class="v11-maint-icon">
										<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
											<g stroke="#606062" stroke-width="1.5" fill="none">
												<path d="M20 45 L25 70 L55 70 L60 45" fill="#2a2a2c"/>
												<ellipse cx="40" cy="45" rx="20" ry="6"/>
												<line x1="40" y1="10" x2="40" y2="38" stroke-width="2"/>
												<rect x="30" y="36" width="20" height="6" rx="2" fill="#3a3a3c"/>
												<g stroke="#d4b87a" stroke-width="1" class="v11-sparkle">
													<line x1="65" y1="25" x2="65" y2="18"/>
													<line x1="61" y1="22" x2="69" y2="22"/>
													<line x1="15" y1="35" x2="15" y2="28"/>
													<line x1="11" y1="32" x2="19" y2="32"/>
												</g>
											</g>
										</svg>
									</div>
								</div>
								<div class="v11-maint-info">
									<div class="v11-maint-block">
										<h4>Daily Care</h4>
										<p>{maint.daily}</p>
									</div>
									<div class="v11-maint-block">
										<h4>Periodic Maintenance</h4>
										<p>{maint.periodic}</p>
									</div>
									<div class="v11-maint-block v11-maint-avoid">
										<h4>Avoid</h4>
										<p>{maint.avoid}</p>
									</div>
								</div>
							</div>
						{/if}
					{/key}
				</div>
			</div>
		</div>
	{/if}



	<!-- Map modal -->
	<YcMapModal open={mapModalOpen} onClose={closeMap} />

	<!-- Version nav -->
	<div class="v-nav"><a href="/young-carpets">Main</a><a href="/young-carpets/dev/v7">V7</a><a href="/young-carpets/dev/v8">V8</a><a href="/young-carpets/dev/v9">V9</a><a href="/young-carpets/dev/v10">V10</a><span class="v-nav-current">V11</span><a href="/young-carpets/dev/v12">V12</a></div>

	<!-- Footer — minimal -->
	<footer class="v11-footer">
		<div class="yc-container">
			<div class="v11-footer-inner">
				<div class="v11-footer-brand">
					<span class="v11-footer-brand-name">YOUNG</span>
					<span class="v11-footer-brand-sub">Carpets Inc.</span>
				</div>
				<div class="v11-footer-info">
					<span>Unit 316 &mdash; 1228 Old Innes Road, Ottawa, ON K1B 3V3</span>
					<span><a href="tel:6137442744">613-744-2744</a></span>
					<span><a href="mailto:info@youngcarpets.com">info@youngcarpets.com</a></span>
					<span>Mon&ndash;Fri 7:00 AM &ndash; 4:00 PM</span>
				</div>
			</div>
		</div>
	</footer>

	{#if dev}<DevColorPicker />{/if}
</div>

<style>
	/* =============== V11 — POLISHED =============== */

	/* == Base64 Square721 for nav + hero == */
		@font-face {
		font-family: 'Square721';
		src: url("data:font/ttf;base64,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ARMBFAEVARYBFwEYARkBGgEbAOMA5ACBB6oAegAAAAADzQAAA80AAAPNAXMCTgBeBicAaAeYAH8J3QCBCI0AjQExAF4C5wCYAucASgVCAN0GqgD+A80BYgOFAKYDzQFzAuf/ZgeYAH8HmAGeB5gAogeYAIUHmABoB5gAmgeYAK4HmACTB5gAkweYAKADzQFzA80BYgaqAQgGqgD+BqoBCAY7AGoIAABxB7T//ge4ALYH8gCYCE4AtgbNALgGiwC2CEIAmAgjALYCNwC6Bi8ANQdaALYGIwC2CocAtgiJALYIfwCYB2gAtgh/AJgHtgC2B6IAkQbfADEIEgCsB17//gpeAAIHi//2B14AAgdQAFoC5wCeAuf/oALnAEwIAAGmBAAAAAQAAMUGDgBmBkIApAXhAIUGQgB7BiEAhQNvAB8GMwCFBkIApAIAAKwCEgAOBXsAwQInAMEJtACkBkIApAZkAIUGQgCkBkIAeQUhAKQGQgCPBKwADgZCAJwFVAAACCEAAAVkAAAFOQACBTkAZAQAAKwEAAHBBAAApgaqALIC9gD4B5gAOQSmAPgIAADiBUIAnAVCALAEAACgDh8AgQeiAJECVgBeC5gAlgL2AQYC9gD4BKYBBgSmAPgEuAEzBAAAAAgAAAAEAACsBqoA/gZCAI8CVgBeCtUAhQdeAAIHmAAAA80BcweYAWAHmACHBNkAVgeYACsEAAHBBhIAiQQAAMkGqgB3BIsATgQEAF4GqgD+A4UApgaqAHcEAADJAqIANwaqAP4FAgBqBQIAWAQAAVoEaP+RBAAATAPNAW8EAAEIBQIBEATLAGQEBABcCucBBArnAQQK5wBUBjsAaAe0//4HtP/+B7T//ge0//4HtP/+B7T//gnw/9kH8gCYBs0AuAbNALgGzQC4Bs0AuAI3/+ICNwB3Ajf/vQI3/+YIQgCYCIkAtgh/AJgIfwCYCH8AmAh/AJgIfwCYBqoBLQh/AEYIEgCsCBIArAgSAKwIEgCsAjcAsAeiAJEGQgCyBg4AZgYOAGYGDgBmBg4AZgYOAGYGDgBmCm0AaAXhAIUGIQCFBiEAhQYhAIUGIQCFAgD/xQIAAFoCAP+gAgD/yQYzAIUGQgCkBmQAhQZkAIUGZACFBmQAhQZkAIUGqgD+BmQAMQZCAJwGQgCcBkIAnAZCAJwCAACsBkIAjwU5AAIEAACiBAABkwIAAKwEAADsBAAA8AQAAKAGMQAAAkL/+gFW/qoFMQAfBTEAHwdQAFoFOQBkB/IAmAXhAIUH8gCYBeEAhQZMAIUHogCRBkIAjwusALYIQgCYBjMAhQI3ALAJjQAACY0AAAmNAAAGJQBkBKL/8AmNAAAJjQAACY0AAAmNAAAJjQAACY0AAAmNAAAJjQAABBQAdQmNAAAJjQAACY0AAAVM//gF+ACgCY0AAAVCABIGqgD+CY0AAAmNAAAJjQAACY0AAAmNAAAFCAA5CY0AAAmNAAAJjQAABqoA4wP8AC8GqgCyBqoA/gmNAAAJjQAACY0AAAaqAQYGqgEGA/QABgZSAHEF1gWnB04EJgV8ByMDXAEOAAACWAR5BJ4GFwZjAvYFVP6TB6oExQUPBFoCngPlA6b/+f47/pUA2/8bBJkBzgHjACgCTP4fA3j+d/9CA/AD2wBMAuX+YQOaAnf+6AFj/8EEsQCHApgCJwTP/9oBH/9YAKYAogABAK4BWANOAh0EgQHbAbYC4QMZAj4C+APpANMEsgFxAGYBRgEAASMApgFxAMgA6QCRAEEBlgFcAAwAmwAABTwBkAAHAA4FRwTMAAD+RAVHBMwAAAJPAGoCZggPAgsFBwICAgYCAwAAAAAAAAAAAAAAAAAAAABCaXRzAEAAIPACBhQB7AGaB6oB4wAAAAAAEAAAASAJEAkABAQEAwcJCwoBAwMGBwQEBAMJCQkJCQkJCQkJBAQHBwcHCQkJCQkIBwkJAgcIBwwKCggKCQkICQgMCAgIAwMDCQUFBwcHBwcEBwcCAgYCCwcHBwcGBwUHBgkGBgYFBQUHAwkFCQYGBRAJAw0DAwUFBQUJBQcHAwwICQQJCQUJBQcFBwUFBwQHBQMHBgYFBQUEBQYFBQwMDAcJCQkJCQkLCQgICAgCAgICCQoKCgoKCgcKCQkJCQIJBwcHBwcHBwwHBwcHBwICAgIHBwcHBwcHBwcHBwcHAgcGBQUCBQUFBwMCBgYIBgkHCQcHCQcNCQcCCwsLBwULCwsLCwsLCwULCwsGBwsGBwsLCwsLBgsLCwcEBwcLCwsHBwQHAAAKEgoABQUFAwgJDAsBBAQHCAUEBQQJCQkJCQkJCQkJBQUICAgICgoKCgoJCAoKAwgJCA0LCwkLCgoJCgkNCQkJBAQECgUFCAgHCAgECAgDAwcDDAgICAgGCAYIBwoHBwcFBQUIBAkGCgcHBRIKAw4EBAYGBgUKBQgIAw4JCQUJCQYJBQgFCAYFCAQIBQMIBgYFBgUFBQYGBQ4ODggKCgoKCgoMCgkJCQkDAwMDCgsLCwsLCwgLCgoKCgMKCAgICAgICA0HCAgICAMDAwMICAgICAgICAgICAgIAwgHBQUDBQUFCAMCBgYJBwoHCgcICggPCggDDAwMCAYMDAwMDAwMDAUMDAwHBwwHCAwMDAwMBgwMDAgFCAgMDAwICAUIAAALEwsABQUFAwgKDgwCBAQHCQUFBQQKCgoKCgoKCgoKBQUJCQkJCwsLCwsJCQsLAwkKCA4MDAoMCwoJCwoOCgoKBAQECwYGCAkICQgFCQkDAwgDDQkJCQkHCQYJBwsHBwcGBgYJBAoGCwcHBhMKAxAEBAYGBgYLBgkJAw8KCgUKCgcKBggGCQYGCQUJBgQJBwcGBgYFBgcHBg8PDwkLCwsLCwsOCwkJCQkDAwMDCwwMDAwMDAkMCwsLCwMKCQgICAgICA4ICAgICAMDAwMJCQkJCQkJCQkJCQkJAwkHBgYDBgYGCQMCBwcKBwsICwgJCgkQCwkDDQ0NCAYNDQ0NDQ0NDQYNDQ0HCA0HCQ0NDQ0NBw0NDQkFCQkNDQ0JCQUJAAAMFQsABgYGAwkLDw0CBAQICgYFBgQLCwsLCwsLCwsLBgYKCgoJDAwMDAwKCgwMAwkLCRANDQsNDAsKDAsQCwsLBAQEDAYGCQkJCQkFCQkDAwgDDwkKCQkICQcJCAwICAgGBgYKBAsHDAgIBhULBBEEBAcHBwYMBgoJBBALCwYLCwcLBgkGCgcGCgUKBgQKCAgGBwYGBggHBhAQEAkMDAwMDAwPDAoKCgoDAwMDDA0NDQ0NDQoNDAwMDAMLCQkJCQkJCRAJCQkJCQMDAwMJCQoKCgoKCgoJCQkJAwkIBgYDBgYGCQMCCAgLCAwJDAkJCwkSDAkDDg4OCQcODg4ODg4ODgYODg4ICQ4ICg4ODg4OCA4ODgoGCgoODg4KCgYJAAANFwwABgYGBAoMEA4CBQUJCwYGBgUMDAwMDAwMDAwMBgYLCwsKDQ0NDQ0LCw0NBAoMChEODgwODQwLDQwRDAwMBQUFDQcHCgoKCgoGCgoDAwkDEAoKCgoICggKCQ0JCAgHBwcLBQwIDQkJBxcMBBMFBQgICAcNBwsKBBIMDAYMDAgMBwoHCwcHCwYLBwQLCAgHBwcGBwgIBxISEgoNDQ0NDQ0QDQsLCwsEBAQEDQ4ODg4ODgsODQ0NDQQMCgoKCgoKChEKCgoKCgMDAwMKCgoKCgoKCwoKCgoKAwoIBwcDBwcHCgQCCAgMCA0KDQoKDAoTDQoEEBAQCggQEBAQEBAQEAcQEBAJChAJCxAQEBAQCBAQEAsGCwsQEBALCwYKAAAOGQ0ABwcHBAsNEQ8CBQUJDAcGBwUNDQ0NDQ0NDQ0NBwcMDAwLDg0ODg8MCw4OBAsNCxIPDw0PDQ0MDg0SDQ0NBQUFDgcHCwsKCwsGCwsEBAoEEQsLCwsJCwgLCQ4JCQkHBwcMBQ0IDgkJBxkNBBQFBQgICAcOBwwLBBMNDQcNDQgNBwsHDAgHDAYMBwUMCQkHCAcHBwkIBxMTEwsNDQ0NDQ0RDgwMDAwEBAQEDg8PDw8PDwwPDg4ODgQNCwsLCwsLCxIKCwsLCwQEBAQLCwsLCwsLDAsLCwsLBAsJBwcEBwcHCwQCCQkNCQ4KDgoLDQsUDgsEERERCwgREREREREREQcREREJChEJDBERERERCREREQwHDAwREREMDAcLAAAPGg4ABwcHBAwOEhACBQUKDAcHBwUODg4ODg4ODg4OBwcMDAwMDw4ODxANDA8PBAwODBQQEA4QDg4NDw4TDg4OBQUFDwgICwwLDAsGDAwEBAoEEgwMDAwKDAkMCg8KCgoICAgMBg4JDwoKCBoOBBYGBgkJCQgPCAwMBBQODgcODgkOCAsIDAkIDAcMCAUMCQkICAgHCAkJCBQUFAwODg4ODg4TDw0NDQ0EBAQEDxAQEBAQEAwQDw8PDwQODAsLCwsLCxQLCwsLCwQEBAQMDAwMDAwMDAwMDAwMBAwKCAgECAgIDAQDCgoOCg8LDwsMDgwWDwwEEhISDAkSEhISEhISEggSEhIKCxIKDBISEhISCRISEgwHDAwSEhIMDAcMAAAQHA8ACAgIBQwPFBECBgYLDQgHCAYPDw8PDw8PDw8PCAgNDQ0MEA8PEBEODREQBAwPDBUREQ8RDw8OEA8VDw8PBgYGEAgIDA0MDQwHDA0EBAsEEw0NDQ0KDQkNCxALCgoICAgNBg8JEAsLCBwPBRcGBgkJCQgQCA0NBRYPDwgPDwoPCAwIDQkIDQcNCAUNCgoICQgICAoKCBYWFgwPDw8PDw8UEA4ODg4EBAQEEREREREREQ0REBAQEAQPDQwMDAwMDBUMDAwMDAQEBAQMDQ0NDQ0NDQ0NDQ0NBA0KCAgECAgIDAUDCgoPChAMEAwNDw0XEQwEExMTDAkTExMTExMTEwgTExMLDBMLDRMTExMTChMTEw0IDQ0TExMNDQgNAAARHhAACAgIBQ0QFRIDBgYLDggHCAYQEBAQEBAQEBAQCAgODg4NERAQERIODhIRBQ0QDRYSEhASEBAPERAWEBAQBgYGEQkJDQ0MDQ0HDQ0EBAwFFQ0ODQ0LDQoNCxELCwsJCQkOBhAKEQsLCR4QBRkGBgoKCgkRCQ4NBRcQEAgQEAoQCQ0JDgoJDgcOCQYOCwsJCQkICQsKCRcXFw0QEBAQEBAVEQ4ODg4FBQUFEhISEhISEg4SEREREQUQDQ0NDQ0NDRYMDQ0NDQQEBAQNDQ4ODg4ODg4NDQ0NBA0LCQkECQkJDQUDCwsQCxEMEQwNEA0ZEg0FFBQUDQoUFBQUFBQUFAkUFBQLDRQLDhQUFBQUCxQUFA4IDg4UFBQODggNAAASGhEACQkJBQ4RFhMDBwcMDwkICQcRERERERERERERCQkPDw8OEhEREhMPDxMSBQ4RDhgTExETEREPEhEXEREQBwcHEgkJDg4NDg4IDg4FBQwFFg4ODg4MDgsODBIMDAwJCQkPBxEKEgwMCQARBRoHBwoKCwkSCQ8OBRgREQkREQsRCQ4JDwoJDwgPCQYPCwsJCgkJCQsLCRkZGQ4REREREREWEg8PDw8FBQUFExMTExMTEw8TEhISEgURDg4ODg4ODhcNDg4ODgUFBQUODg4ODg4ODw4ODg4OBQ4MCQkFCQkJDgUDDAwQDBINEg0OEQ4aEw4FFRUVDgoVFRUVFRUVFQkVFRUMDRUMDxUVFRUVCxUVFQ8JDw8VFRUPDwkOAAATHBIACQkJBQ8SFxQDBwcMEAkICQcSEhISEhISEhISCQkQEBAPExISExQQEBQTBQ8RDxkUFBIUEhIQExEZEhERBwcHEwoKDg8ODw8IDw8FBQ0FFw8PDw8MDwsPDRMNDAwKCgoQBxILEwwMCgISBhwHBwsLCwoTChAPBhoREgkSEgwSCg4KEAsKEAgQCgYQDAwKCgoJCgwLChoaGg8SEhISEhIYExAQEBAFBQUFFBQUFBQUFBAUExMTEwUSDw4ODg4ODhkO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/xUALwA8/lkALgA8/2sAKgA8/7cAJwA8/7cAlQA8/tMAZAA8/ogAJQA8/9wAAAA8/lkAOgBE/5AALgBE/9wATgBE/9wAMwBE/5AANwBE/h8ANQBEACYAKQBE/5AAPABE/uYAOQBE/4gAWwBG/9wANwBG/h8ALwBI/9wATgBI/7cALgBI/7cAMwBI/7cAOwBI/7cAOQBI/2EAPABI/uYAWwBI/9wAKQBI/5AAOgBI/7cANwBI/h8AAABI/9wAYgBJ/9wAZABJ/9wALwBS/9wAPABS/uYAOgBS/7cALgBS/7cAWwBS/9wANwBS/h8AMwBS/7cAEABSACYATgBS/9wAKQBS/7cAOQBS/2EAAABS/9wANwBV/h8AbwBV/7cAOgBV/8kAbQBV/7cANwBW/h8AOQBY/6QALwBY/7cANwBY/h8AMwBY/9wAOgBY/9wAPABY/ykANQBYACYALgBY/7cAKQBY/7cAAABY/7cAJABZ/9wAnwBZ/9wAYgBa/60AZABa/60ANwBa/h8AeABb/9wA0gBb/9wAVQBb/9wAUgBb/9wASABb/9wAwABb/9wAKQBc/9wALgBc/7cAnwBc/9wAJABc/9wAMwBc/9wAOQBc/7cANwBc/h8AVQBc/9wALwBc/2sAAABc/2sAVQBd/9wAVQBi/4gAXABi/5AASQBi/9wAMgBi/2sAsgBi/2sAOgBi/2sAKQBi/x8AJQBi/7cAJwBi/2sALQBi/5AANwBi/2sAWgBi/4gAnwBiACYAOwBiAEsAPABi/0QAJABiACYAqgBi/2sALgBiAEEAMwBi/mEAOQBi/x8AMwBk/mEAJABkACYAOwBkAEsALQBk/5AAsgBk/2sAPABk/0QAOQBk/x8AWgBk/4gAKQBk/x8AJwBk/2sAnwBkACYAOgBk/2sALgBkAEEASQBk/9wAVQBk/4gAqgBk/2sAJQBk/7cANwBk/2sAXABk/5AAMgBk/2sAPABr/tMALwBr/5AAPQBr/7cAMwBr/5AAOgBr/7cAOQBr/5AALgBr/30AKQBr/9wAJQBrACYANwBr/tMAAABr/5AAOwBs/9wAZABs/9wAbQBs/60APABs/7cAYgBs/9wALgBs/9MAEABsACYAbwBs/60ALgBt/7cAPABt/7cASQBtAEEA0gBt/9wALwBt/aQAOwBt/9wAPQBt/9wAXABtAEsAUQBt/7cAJABt/mEAWgBtADkAMwBtACYAUgBt/9wAnwBt/mEANwBt/7cAuQBt/7cAAABt/aQANQBuACYAUQBu/9wAOgBuACYAMwBuAC8ALwBu/g0AXABuACYAnwBu/sEAVQBuAFYAsgBuACYAKQBuACYASQBuAI0AMgBuACYAKgBuADkAJABu/sEAAABu/g0AWgBvADkA0gBv/9wASQBvAEEAPQBv/9wAMwBvACYALgBv/7cALwBv/aQAPABv/7cAnwBv/mEAUQBv/7cAOwBv/9wANwBv/7cAuQBv/7cAJABv/mEAUgBv/9wAXABvAEsAAABv/aQAMgBwACYAnwBw/sEAUQBw/9wAKQBwACYAsgBwACYAOgBwACYASQBwAI0ALwBw/g0AJABw/sEAVQBwAFYAKgBwADkAMwBwAC8AXABwACYANQBwACYAAABw/g0AOQB3/7cAOgB3/9wANwB3/vgAPAB3/0QAKQB4/7cAPAB4/uYANwB4/h8AMwB4/7cAOgB4/7cAWwB4/9wALwB4/9wAEAB4ACYALgB4/7cAOQB4/2EATgB4/9wAAAB4/9wALwCF/5AAMwCF/5AAPQCF/7cAOQCF/5AANwCF/tMALgCF/30AJQCFACYAPACF/tMAKQCF/9wAOgCF/7cAAACF/5AAOgCV/9wAOQCV/7cAPACV/0QANwCV/vgALgCf/9wAJwCf/9wAOQCf/2sAMwCf/zIAbwCf/sEAKQCf/0QAbQCf/sEAOgCf/2sALwCf/5AANwCf/w0AqgCf/9wAYgCfACYAPACf/tMAJgCf/9wAZACfACYAOACf/9wAAACf/5AAhQCgAEsAEACgADkAbQCg/poAZACgAEsAYgCgAEsAawCgAEsAbwCg/poAOwCy/9wAEACyACYAYgCy/9wAbQCy/60AbwCy/60ALgCy/9MAZACy/9wAPACy/7cAKQDA/5AAMwDA/5AAOgDA/5AAPADA/uYANwDA/h8ALgDA/9wATgDA/9wAOQDA/4gANQDAACYAPADS/uYAEADSACYATgDS/9wAOQDS/2EAMwDS/7cAOgDS/7cANwDS/h8ALwDS/9wAKQDS/7cAWwDS/9wALgDS/7cAAADS/9wUFA4UDggAAA==") format("truetype");
		font-display: block;
	}

	/* == Color overrides == */
	:global(.yc-page.v11) {
		--yc-maple-gold: #d4b87a;
		--yc-maple-gold-10: rgba(212, 184, 122, 0.10);
		--yc-maple-gold-35: rgba(212, 184, 122, 0.35);
		--yc-maple-gold-08: rgba(212, 184, 122, 0.08);
		--v11-ink: #0b0b0d;
		--v11-text: #c8c8ca;
		--v11-text-muted: rgba(200,200,202,0.5);
		--v11-electric: rgba(140, 180, 255, 0.15);
		--v11-electric-hover: rgba(140, 180, 255, 0.25);
		--v11-warm-tint: rgba(255, 240, 220, 0.04);
		--v11-section-py: 80px;
		--v11-section-py-mobile: 60px;
		--v11-container-max: 1100px;
		--v11-card-gap: 16px;
	}

	/* == Squared pills (12px) == */
	:global(.yc-page.v11.yc-section-eyebrow),
	:global(.yc-page.v11.yc-badge),
	:global(.yc-page.v11.yc-chip),
	:global(.yc-page.v11.yc-map-preview-pill),
	:global(.yc-page.v11.yc-dev-version-badge),
	:global(.yc-page.v11.yc-stat-number),
	:global(.yc-page.v11.yc-modal-close),
	:global(.yc-page.v11.yc-supplier-chip),
	:global(.yc-page.v11.yc-modal-tab),
	:global(.yc-page.v11.yc-modal-tab-btn),
	:global(.yc-page.v11.yc-back-link) {
		border-radius: 12px !important;
	}

	/* == V11: Overflow fix (prevent horizontal scroll on mobile) == */
	:global(.yc-page.v11) {
		overflow-x: hidden;
	}

	/* == V11: Consistent section spacing == */
	:global(.yc-page.v11.yc-section),
	:global(.yc-page.v11.yc-map-section) {
		padding-top: var(--v11-section-py, 80px);
		padding-bottom: var(--v11-section-py, 80px);
	}
	@media (max-width: 599px) {
		:global(.yc-page.v11.yc-section),
		:global(.yc-page.v11.yc-map-section) {
			padding-top: var(--v11-section-py-mobile, 60px);
			padding-bottom: var(--v11-section-py-mobile, 60px);
		}
	}

	/* == V11: Container max-width consistency == */
	:global(.yc-page.v11.yc-container) {
		max-width: var(--v11-container-max, 1100px);
	}

	/* == V11: Alternating warm tint (every other section) == */
	:global(.yc-page.v11.yc-section--suppliers),
	:global(.yc-page.v11.yc-section--contact) {
		background: var(--v11-warm-tint, rgba(255, 240, 220, 0.04));
	}

	/* == V11: Section titles — consistent sizing == */
	:global(.yc-page.v11.yc-section-title) {
		font-size: 1.6rem;
		letter-spacing: 0.06em;
		line-height: 1.2;
	}

	/* == Scroll progress == */
	.v11-progress {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--yc-maple-gold, #d4b87a);
		transform-origin: left;
		z-index: 10002;
		pointer-events: none;
	}

	/* == Navbar == */
	.v11-nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		padding: 0.6rem 1rem;
		background: rgba(11,11,13,0.7);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-bottom: 1px solid rgba(255,255,255,0.06);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
	}
	.v11-nav-left {
		display: flex;
		align-items: center;
		min-width: 0;
		flex-shrink: 0;
	}
	.v11-nav-brand {
		font-family: 'Square721', ui-serif, Georgia, serif;
		font-size: 1.1rem;
		font-weight: 400;
		letter-spacing: 0.12em;
		color: var(--yc-text, #e6e6e8);
		text-decoration: none;
		white-space: nowrap;
		flex-shrink: 0;
	}
	.v11-nav-section {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.9rem;
		font-weight: 400;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--v11-text-muted, rgba(200,200,202,0.6));
		margin-left: 0.75rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		opacity: 0;
		animation: v11-fade-in 300ms ease forwards;
	}
	@keyframes v11-fade-in {
		from { opacity: 0; transform: translateY(4px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.v11-nav-right {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.v11-hamburger {
		width: 44px;
		height: 44px;
		background: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 5px;
		padding: 0;
	}
	.v11-hamburger-bar {
		width: 20px;
		height: 2px;
		background: var(--yc-text, #e6e6e8);
		border-radius: 2px;
		transition: all 0.3s ease;
	}
	.v11-hamburger-bar.open:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
	.v11-hamburger-bar.open:nth-child(2) { opacity: 0; }
	.v11-hamburger-bar.open:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
	.v11-mobile-menu {
		width: 100%;
		display: flex;
		flex-direction: column;
		padding-top: 0.5rem;
		gap: 0.25rem;
	}
	.v11-mobile-menu button {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--v11-text-muted, rgba(200,200,200,0.6));
		background: transparent;
		border: none;
		padding: 0.75rem 0.5rem;
		text-align: left;
		cursor: pointer;
		border-radius: 8px;
		min-height: 44px;
		transition: color 0.2s, background 0.2s;
	}
	.v11-mobile-menu button:hover {
		color: var(--yc-text, #e6e6e8);
		background: rgba(140, 180, 255, 0.08);
	}

	/* == Hero == */
	.v11-hero-maple {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}
	.v11-hero-maple .yc-maple-leaf {
		width: 48px;
		height: 48px;
		color: var(--yc-maple-gold, #d4b87a);
		opacity: 0.7;
	}
	.v11-hero-tag {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--v11-text-muted, rgba(200,200,202,0.5));
		margin-bottom: 0.75rem;
	}

	/* Wordmark */
	.v11-wordmark {
		font-family: 'Square721', ui-serif, Georgia, serif;
		font-size: 5.5rem;
		font-weight: 400;
		line-height: 1.05;
		color: var(--yc-text);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		margin: 0 0 1.25rem;
		display: inline-block;
		white-space: nowrap;
		visibility: hidden;
	}
	.v11-wordmark--ready {
		visibility: visible;
	}
	.v11-wordmark__char {
		display: inline-block;
		opacity: 0;
		transform: translateY(28px) scale(0.92);
	}
	.v11-wordmark--ready .v11-wordmark__char {
		animation: v11-letter-in 700ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
		animation-delay: calc(var(--young-i, 0) * 80ms);
		will-change: transform, opacity;
	}
	@keyframes v11-letter-in {
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.v11-hero-sub {
		font-size: 1.05rem;
		line-height: 1.65;
		color: var(--v11-text, #c8c8ca);
		max-width: 440px;
		margin-bottom: 1.75rem;
	}

	/* CTAs */
	.v11-hero-actions {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}
	.v11-cta-primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.7rem 1.6rem;
		border-radius: 12px;
		background: var(--v11-ink, #0b0b0d);
		color: #fff;
		font-size: 0.85rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		border: 1px solid rgba(255,255,255,0.15);
		cursor: pointer;
		transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
		min-height: 44px;
	}
	.v11-cta-primary:hover {
		border-color: var(--v11-electric-hover, rgba(140,180,255,0.25));
		box-shadow: 0 2px 12px var(--v11-electric, rgba(140,180,255,0.15));
		transform: scale(1.02);
	}
	.v11-cta-secondary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.7rem 1.6rem;
		border-radius: 12px;
		background: transparent;
		color: var(--v11-text, #c8c8ca);
		font-size: 0.85rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		border: 1px solid rgba(255,255,255,0.1);
		text-decoration: none;
		cursor: pointer;
		transition: color 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s;
		min-height: 44px;
	}
	.v11-cta-secondary:hover {
		color: var(--yc-text, #e6e6e8);
		border-color: var(--v11-electric-hover, rgba(140,180,255,0.25));
		transform: scale(1.02);
		box-shadow: 0 2px 8px rgba(140,180,255,0.08);
	}

	/* Stat counters */
	.v11-hero-stats {
		display: flex;
		gap: 2rem;
		margin-top: 0.5rem;
		flex-wrap: wrap;
	}
	@media (max-width: 380px) {
		.v11-hero-stats {
			flex-direction: column;
			gap: 1rem;
		}
	}
	.v11-stat {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}
	.v11-stat-number {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--yc-text, #e6e6e8);
		letter-spacing: 0.02em;
	}
	.v11-stat-label {
		font-size: 0.65rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--v11-text-muted, rgba(200,200,202,0.5));
	}

	/* == Products eyebrow — greyscale, not gold == */
	:global(.yc-page.v11.yc-section-eyebrow) {
		color: var(--v11-text-muted, rgba(200,200,202,0.5));
	}

	/* == V11: Product grid responsive (1 col mobile, 2 tablet, 3 desktop) == */
	:global(.yc-page.v11.yc-products-grid) {
		gap: var(--v11-card-gap, 16px);
	}
	@media (max-width: 599px) {
		:global(.yc-page.v11.yc-products-grid) {
			grid-template-columns: 1fr;
		}
	}
	@media (min-width: 600px) and (max-width: 899px) {
		:global(.yc-page.v11.yc-products-grid) {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (min-width: 900px) {
		:global(.yc-page.v11.yc-products-grid) {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* == V11: Product card blurb overflow fix == */
	:global(.yc-page.v11.yc-product-blurb) {
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		line-height: 1.45;
	}

	/* == V11: Card hover — lift + shadow increase == */
	:global(.yc-page.v11.yc-product-card) {
		transition: opacity 600ms ease-out, box-shadow 200ms ease, transform 200ms ease, border-color 200ms ease;
	}
	:global(.yc-page.v11.yc-product-card:hover) {
		transform: translateY(-2px);
	}
	:global(.yc-page.v11.yc-card) {
		transition: opacity 600ms ease-out, box-shadow 200ms ease, transform 200ms ease;
	}
	:global(.yc-page.v11.yc-card:hover) {
		transform: translateY(-2px);
		box-shadow:
			inset 0 1px 0 var(--yc-sheen-08, rgba(255,255,255,0.08)),
			0 6px 24px rgba(0,0,0,0.4),
			0 0 16px rgba(140,180,255,0.08);
	}

	/* == Services == */
	.v11-services-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--v11-card-gap, 16px);
	}
	@media (min-width: 600px) {
		.v11-services-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* == Map — bigger == */
	:global(.yc-page.v11.yc-map-preview) {
		max-width: 600px !important;
		aspect-ratio: 4 / 3 !important;
	}
	@media (min-width: 900px) {
		:global(.yc-page.v11.yc-map-preview) {
			max-width: 720px !important;
		}
	}

	/* == Contact == */
	.v11-contact-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--v11-card-gap, 16px);
	}
	@media (min-width: 600px) {
		.v11-contact-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
	.v11-contact-people {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--v11-card-gap, 16px);
	}
	@media (min-width: 420px) {
		.v11-contact-people {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (min-width: 600px) {
		.v11-contact-people {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	.v11-person-card {
		background: var(--yc-ink-45, rgba(18,18,21,0.45));
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--yc-sheen-10, rgba(255,255,255,0.1));
		border-radius: 14px;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.v11-person-card strong {
		font-size: 0.85rem;
		color: var(--yc-text, #e6e6e8);
		font-weight: 600;
	}
	.v11-person-card a {
		font-size: 0.75rem;
		color: var(--v11-text-muted, rgba(200,200,200,0.6));
		text-decoration: none;
		transition: color 0.15s;
	}
	.v11-person-card a:hover {
		color: var(--yc-text, #e6e6e8);
	}
	.v11-contact-side {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.v11-contact-card {
		background: var(--yc-ink-45, rgba(18,18,21,0.45));
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--yc-sheen-10, rgba(255,255,255,0.1));
		border-radius: 14px;
		padding: 1rem;
	}
	.v11-contact-card h3 {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--v11-text-muted, rgba(200,200,200,0.6));
		margin-bottom: 0.75rem;
	}
	.v11-contact-card .v11-person-card {
		background: transparent;
		border: none;
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		padding: 0.4rem 0;
		border-radius: 0;
		border-bottom: 1px solid var(--yc-sheen-06, rgba(255,255,255,0.06));
	}
	.v11-contact-card .v11-person-card:last-child {
		border-bottom: none;
	}

	/* == Version nav == */
	.v-nav { display: flex; gap: 0.5rem; justify-content: center; padding: 1.5rem 1rem; flex-wrap: wrap; }
	.v-nav a, .v-nav-current { font-family: ui-monospace, 'SF Mono', monospace; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(200,200,200,0.5); text-decoration: none; padding: 0.5rem 0.75rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); min-height: 44px; display: flex; align-items: center; transition: border-color 0.2s, color 0.2s; }
	.v-nav a:hover { border-color: rgba(140,180,255,0.3); color: #e6e6e8; }
	.v-nav-current { color: #e6e6e8; border-color: rgba(140,180,255,0.4); background: rgba(140,180,255,0.06); }

	/* == Footer == */
	.v11-footer {
		padding: 2rem 0;
		border-top: 1px solid var(--yc-sheen-06, rgba(255,255,255,0.06));
	}
	.v11-footer-inner {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		text-align: center;
	}
	@media (min-width: 600px) {
		.v11-footer-inner {
			flex-direction: row;
			justify-content: space-between;
			text-align: left;
			align-items: flex-start;
		}
	}
	.v11-footer-brand {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}
	.v11-footer-brand-name {
		font-family: 'Square721', ui-serif, Georgia, serif;
		font-size: 1.2rem;
		font-weight: 400;
		letter-spacing: 0.1em;
		color: var(--yc-text, #e6e6e8);
	}
	.v11-footer-brand-sub {
		font-size: 0.7rem;
		color: var(--v11-text-muted, rgba(200,200,202,0.5));
		letter-spacing: 0.04em;
	}
	.v11-footer-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.75rem;
		color: var(--v11-text-muted, rgba(200,200,202,0.5));
	}
	.v11-footer-info a {
		color: var(--v11-text-muted, rgba(200,200,202,0.5));
		text-decoration: none;
		transition: color 0.15s;
	}
	.v11-footer-info a:hover {
		color: var(--yc-text, #e6e6e8);
	}

	/* ============================================================
	   V9 INLINE PRODUCT MODAL — Glass + Tabs + Rich Content
	   ============================================================ */

	.v11-modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 10000;
		background: rgba(0,0,0,0.7);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		animation: v11-backdrop-in 200ms ease;
	}
	@keyframes v11-backdrop-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.v11-modal {
		position: relative;
		width: 100%;
		max-width: 520px;
		max-height: 85vh;
		overflow-y: auto;
		background: rgba(18,18,21,0.92);
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: 20px;
		padding: 1.5rem;
		animation: v11-modal-in 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@media (max-width: 599px) {
		.v11-modal {
			max-width: 100%;
			max-height: 100vh;
			height: 100%;
			border-radius: 0;
			padding: 1.25rem;
			padding-top: max(1.25rem, env(safe-area-inset-top));
			padding-bottom: max(1.25rem, env(safe-area-inset-bottom));
			padding-left: max(1.25rem, env(safe-area-inset-left));
			padding-right: max(1.25rem, env(safe-area-inset-right));
		}
		.v11-modal-backdrop {
			padding: 0;
		}
	}
	@keyframes v11-modal-in {
		from { opacity: 0; transform: scale(0.95) translateY(10px); }
		to { opacity: 1; transform: scale(1) translateY(0); }
	}

	.v11-modal-close {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255,255,255,0.06);
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: 12px;
		color: var(--yc-text, #e6e6e8);
		cursor: pointer;
		transition: background 0.2s;
	}
	.v11-modal-close:hover {
		background: rgba(255,255,255,0.12);
	}

	.v11-modal-header {
		margin-bottom: 1rem;
	}
	.v11-modal-code {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--v11-text-muted, rgba(200,200,202,0.5));
		margin-bottom: 0.25rem;
		display: block;
	}
	.v11-modal-title {
		font-family: 'Square721', ui-serif, Georgia, serif;
		font-size: 1.5rem;
		font-weight: 400;
		letter-spacing: 0.06em;
		line-height: 1.3;
		color: var(--yc-text, #e6e6e8);
		margin: 0;
	}

	/* Tab buttons */
	.v11-modal-tabs {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.25rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid rgba(255,255,255,0.06);
	}
	.v11-tab-btn {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 0.4rem 0.9rem;
		border-radius: 12px;
		border: 1px solid rgba(255,255,255,0.08);
		background: transparent;
		color: var(--v11-text-muted, rgba(200,200,200,0.5));
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 44px;
	}
	.v11-tab-btn:hover {
		color: var(--yc-text, #e6e6e8);
		border-color: rgba(255,255,255,0.15);
	}
	.v11-tab-btn--active {
		color: var(--yc-text, #e6e6e8);
		border-color: var(--v11-electric-hover, rgba(140,180,255,0.25));
		background: rgba(140,180,255,0.06);
		border-bottom: 2px solid rgba(140,180,255,0.5);
	}

	/* Tab content animation */
	.v11-tab-enter {
		animation: v11-tab-slide 300ms ease-out;
	}
	@keyframes v11-tab-slide {
		from { opacity: 0; transform: translateY(8px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.v11-tab-text {
		margin-top: 1rem;
	}
	.v11-tab-text p {
		font-size: 0.875rem;
		line-height: 1.7;
		color: var(--v11-text, #c8c8ca);
	}

	/* ============================================================
	   CROSS-SECTION DIAGRAM — the star of V9
	   ============================================================ */

	.v11-cross-section {
		background: rgba(0,0,0,0.3);
		border: 1px solid rgba(255,255,255,0.06);
		border-radius: 14px;
		padding: 1rem;
		overflow: hidden;
	}

	.v11-cs-title-row {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin-bottom: 0.75rem;
		color: var(--v11-text-muted, rgba(200,200,202,0.5));
	}
	.v11-cs-label {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.v11-cs-diagram {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.v11-cs-layer {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		height: var(--layer-h, 16px);
		min-height: var(--layer-h, 16px);
		position: relative;
		animation: v11-layer-slide 400ms ease-out backwards;
		animation-delay: calc(var(--layer-i, 0) * 80ms);
	}
	@keyframes v11-layer-slide {
		from {
			opacity: 0;
			transform: translateX(-20px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.v11-cs-layer-fill {
		flex: 1;
		height: 100%;
		background: var(--layer-color, #3a3a3c);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 3px;
		min-width: 0;
		transition: box-shadow 0.2s;
	}
	.v11-cs-layer:hover .v11-cs-layer-fill {
		box-shadow: 0 0 8px rgba(140,180,255,0.15);
		border-color: rgba(140,180,255,0.25);
	}

	.v11-cs-layer-label {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.6rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		color: var(--v11-text-muted, rgba(200,200,202,0.6));
		white-space: nowrap;
		flex-shrink: 0;
		width: 140px;
		text-align: right;
	}

	.v11-cs-dim-line {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		width: 8px;
		flex-shrink: 0;
	}
	.v11-cs-dim-cap {
		width: 6px;
		height: 1px;
		background: rgba(200,200,200,0.25);
	}
	.v11-cs-dim-stem {
		flex: 1;
		width: 1px;
		background: rgba(200,200,200,0.15);
	}

	/* ============================================================
	   INSTALL TAB VISUALS
	   ============================================================ */

	.v11-install-visual {
		background: rgba(0,0,0,0.3);
		border: 1px solid rgba(255,255,255,0.06);
		border-radius: 14px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.v11-install-icon {
		width: 100%;
		max-width: 300px;
	}
	.v11-install-icon svg {
		width: 100%;
		height: auto;
	}

	.v11-install-method {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--v11-text-muted, rgba(200,200,202,0.5));
		margin: 0;
	}

	/* Install animations */
	.v11-install-tile {
		animation: v11-tile-place 400ms ease-out backwards;
	}
	.v11-it-1 { animation-delay: 0ms; }
	.v11-it-2 { animation-delay: 60ms; }
	.v11-it-3 { animation-delay: 120ms; }
	.v11-it-4 { animation-delay: 180ms; }
	.v11-it-5 { animation-delay: 240ms; }
	.v11-it-6 { animation-delay: 300ms; }
	.v11-it-7 { animation-delay: 360ms; }
	.v11-it-8 { animation-delay: 420ms; }
	.v11-it-9 { animation-delay: 480ms; }

	@keyframes v11-tile-place {
		from { opacity: 0; transform: translateY(-8px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.v11-install-plank {
		animation: v11-plank-snap 350ms ease-out backwards;
	}
	.v11-ip-1 { animation-delay: 0ms; }
	.v11-ip-2 { animation-delay: 80ms; }
	.v11-ip-3 { animation-delay: 160ms; }
	.v11-ip-4 { animation-delay: 240ms; }
	.v11-ip-5 { animation-delay: 320ms; }
	.v11-ip-6 { animation-delay: 400ms; }

	@keyframes v11-plank-snap {
		from { opacity: 0; transform: translateX(12px); }
		to { opacity: 1; transform: translateX(0); }
	}

	.v11-click-indicator {
		animation: v11-click-pulse 1.5s ease-in-out infinite;
	}
	@keyframes v11-click-pulse {
		0%, 100% { opacity: 0.5; }
		50% { opacity: 1; }
	}

	.v11-ceramic-tile {
		animation: v11-tile-drop 400ms ease-out backwards;
	}
	.v11-ct-1 { animation-delay: 0ms; }
	.v11-ct-2 { animation-delay: 100ms; }
	.v11-ct-3 { animation-delay: 200ms; }
	.v11-ct-4 { animation-delay: 300ms; }

	@keyframes v11-tile-drop {
		from { opacity: 0; transform: translateY(-12px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.v11-rubber-tile {
		animation: v11-rubber-place 400ms ease-out backwards;
	}
	.v11-rt-1 { animation-delay: 0ms; }
	.v11-rt-2 { animation-delay: 120ms; }
	.v11-rt-3 { animation-delay: 240ms; }

	@keyframes v11-rubber-place {
		from { opacity: 0; transform: translateY(-6px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.v11-nail {
		animation: v11-nail-drive 500ms ease-out backwards;
		animation-delay: 200ms;
	}
	.v11-nail-2 {
		animation-delay: 500ms;
	}
	@keyframes v11-nail-drive {
		from { opacity: 0; transform: translateY(-10px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.v11-sheet-unroll {
		stroke-dasharray: 200;
		stroke-dashoffset: 200;
		animation: v11-unroll 800ms ease-out forwards;
		animation-delay: 200ms;
	}
	@keyframes v11-unroll {
		to { stroke-dashoffset: 0; }
	}

	.v11-cove-line {
		stroke-dasharray: 100;
		stroke-dashoffset: 100;
		animation: v11-cove-draw 600ms ease-out forwards;
		animation-delay: 400ms;
	}
	@keyframes v11-cove-draw {
		to { stroke-dashoffset: 0; }
	}

	/* ============================================================
	   MAINTENANCE TAB
	   ============================================================ */

	.v11-maint-visual {
		background: rgba(0,0,0,0.3);
		border: 1px solid rgba(255,255,255,0.06);
		border-radius: 14px;
		padding: 1.25rem;
		display: flex;
		justify-content: center;
	}

	.v11-maint-icon {
		width: 80px;
		height: 80px;
	}
	.v11-maint-icon svg {
		width: 100%;
		height: 100%;
	}

	.v11-sparkle {
		animation: v11-sparkle-pulse 2s ease-in-out infinite;
	}
	@keyframes v11-sparkle-pulse {
		0%, 100% { opacity: 0.4; }
		50% { opacity: 1; }
	}

	.v11-maint-info {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1rem;
	}

	.v11-maint-block {
		padding: 0.75rem;
		background: rgba(0,0,0,0.2);
		border: 1px solid rgba(255,255,255,0.06);
		border-radius: 10px;
	}
	.v11-maint-block h4 {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--v11-text-muted, rgba(200,200,202,0.5));
		margin: 0 0 0.35rem;
	}
	.v11-maint-block p {
		font-size: 0.8rem;
		line-height: 1.5;
		color: var(--v11-text, #c8c8ca);
		margin: 0;
	}

	.v11-maint-avoid {
		border-color: rgba(200,80,80,0.15);
		background: rgba(200,80,80,0.05);
	}
	.v11-maint-avoid h4 {
		color: #c86060;
	}

	/* ============================================================
	   V11 "COME ALIVE" — Refined scroll-activated section effects (subtler)
	   ============================================================ */

	/* -- Hero alive (on load) — V11: subtler start (0.85 not 0.6) -- */
	.yc-hero {
		opacity: 0.85;
		transition: opacity 800ms ease-out;
	}
	.yc-hero.alive {
		opacity: 1;
	}

	/* Maple leaf glow — V11: barely perceptible (5% opacity max) */
	.yc-hero .v11-hero-maple {
		position: relative;
	}
	.yc-hero .v11-hero-maple::after {
		content: '';
		position: absolute;
		inset: -20px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(180,200,255,0.05) 0%, transparent 70%);
		opacity: 0;
		transition: opacity 1000ms ease-out 400ms;
		pointer-events: none;
	}
	.yc-hero.alive .v11-hero-maple::after {
		opacity: 1;
	}

	/* Stats brightness — V11: subtler start */
	.v11-hero-stats {
		opacity: 0.7;
		transition: opacity 600ms ease-out;
	}
	.yc-hero.alive .v11-hero-stats {
		animation: v11-stats-pulse 1s ease-out 800ms;
		opacity: 1;
	}
	@keyframes v11-stats-pulse {
		0% { opacity: 0.7; filter: brightness(1); }
		40% { filter: brightness(1.15); }
		100% { opacity: 1; filter: brightness(1); }
	}

	/* -- Products section alive — V11: subtler (0.85 → 1.0) -- */
	:global(.yc-page.v11.yc-section--products .yc-product-card) {
		opacity: 0.85;
		transition: opacity 600ms ease-out, box-shadow 200ms ease, transform 200ms ease;
		will-change: opacity, box-shadow, transform;
	}
	:global(.yc-page.v11.yc-section--products.alive .yc-product-card) {
		opacity: 1;
		box-shadow: 0 1px 4px rgba(140,180,255,0.03);
	}
	:global(.yc-page.v11.yc-section--products .yc-product-card:hover) {
		transform: translateY(-2px);
		box-shadow:
			inset 0 1px 0 var(--yc-sheen-08, rgba(255,255,255,0.08)),
			0 6px 24px rgba(0,0,0,0.4),
			0 0 16px rgba(140,180,255,0.1) !important;
		border-color: rgba(140,180,255,0.2) !important;
	}

	/* -- Services section alive — V11: simple brightness transition (no scanner) -- */
	:global(.yc-page.v11.yc-section--services .yc-card) {
		opacity: 0.85;
		filter: brightness(0.92);
		transition: opacity 600ms ease-out, filter 600ms ease-out, transform 200ms ease, box-shadow 200ms ease;
		will-change: opacity, filter;
	}
	:global(.yc-page.v11.yc-section--services.alive .yc-card) {
		opacity: 1;
		filter: brightness(1);
	}

	/* -- Map section alive (brightens) -- */
	:global(.yc-page.v11.yc-map-section .yc-map-preview-iframe) {
		filter: brightness(0.7);
		transition: filter 600ms ease-out;
	}
	:global(.yc-page.v11.yc-map-section.alive .yc-map-preview-iframe) {
		filter: brightness(1);
	}

	/* -- Contact section alive (pulse glow on person cards) -- */
	:global(.yc-page.v11.yc-section--contact) {
		position: relative;
	}
	.v11-person-card {
		transition: box-shadow 600ms ease-out, opacity 600ms ease-out;
		opacity: 0.85;
		will-change: opacity, box-shadow;
	}
	:global(.yc-page.v11.yc-section--contact.alive) .v11-person-card {
		opacity: 1;
		animation: v11-contact-pulse 1.5s ease-in-out;
	}
	@keyframes v11-contact-pulse {
		0% { box-shadow: 0 0 0 rgba(140,180,255,0); }
		35% { box-shadow: 0 0 8px rgba(140,180,255,0.07); }
		100% { box-shadow: 0 0 0 rgba(140,180,255,0); }
	}

	/* -- Suppliers alive — V11: subtler -- */
	:global(.yc-page.v11.yc-section--suppliers) {
		opacity: 0.85;
		transition: opacity 600ms ease-out;
	}
	:global(.yc-page.v11.yc-section--suppliers.alive) {
		opacity: 1;
	}
</style>