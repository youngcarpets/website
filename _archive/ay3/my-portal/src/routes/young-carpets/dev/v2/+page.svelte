<script lang="ts">
	import '$lib/styles/young-carpets-tokens.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import DevColorPicker from '../../components/DevColorPicker.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	/* ── State ── */
	let fontLoaded = $state(false);
	let heroVisible = $state(false);
	let navScrolled = $state(false);
	let activeSection = $state('');

	/* ── Stat counters ── */
	let yearsCount = $state(0);
	let jobsCount = $state(0);
	let statsTriggered = $state(false);

	/* ── Section reveal tracking ── */
	let revealedSections = $state<Set<string>>(new Set());

	/* ── Product families ── */
	const families = [
		{
			id: 'soft-floors',
			name: 'Soft Floors',
			pitch: 'Where silence and comfort begin underfoot.',
			why: 'Carpet remains the top choice for acoustic control in commercial interiors. A well-specified broadloom or tile system can cut impact noise by 25-35 dB — the difference between a productive office and a distraction factory. For GCs, it also means the fastest install-to-occupancy time of any flooring category.',
			gradient: 'rgba(194, 179, 154, 0.04)',
			products: [
				{
					name: 'Carpet Tile',
					desc: 'Modular 24×24 or 48×48 squares, individually replaceable. Swap a tile, not a room.',
					specs: ['Nylon 6,6 or Solution-Dyed', '20 oz+ face weight', 'Class 1 fire rating', 'CRI Green Label Plus'],
					tags: ['Offices', 'Schools', 'Airports']
				},
				{
					name: 'Broadloom Carpet',
					desc: 'Wall-to-wall rolls with acoustic dampening that turns corridors into quiet zones. Available in 6\' and 12\' widths for minimal seaming.',
					specs: ['NRC 0.25–0.55', 'Type I & Type II rated', 'Antimicrobial backing options', 'Up to 15-year warranty'],
					tags: ['Hotels', 'Theatres', 'Corridors']
				}
			]
		},
		{
			id: 'resilient',
			name: 'Resilient',
			pitch: 'Waterproof. Weldable. Built for the hardest-working rooms in the building.',
			why: 'Resilient flooring dominates healthcare, education, and food service because it handles moisture, rolling loads, and chemical exposure without flinching. Heat-welded seams give you monolithic floors with nowhere for pathogens to hide. For PMs managing multi-phase healthcare projects, resilient is often the only spec that passes infection-control review.',
			gradient: 'rgba(46, 196, 182, 0.03)',
			products: [
				{
					name: 'LVT / LVP',
					desc: 'Luxury vinyl tile and plank. Waterproof, design-forward, and built for high traffic. Realistic wood and stone visuals with zero maintenance.',
					specs: ['20-30 mil wear layer', 'Waterproof rigid core', 'Click-lock or glue-down', 'FloorScore certified'],
					tags: ['Healthcare', 'Retail', 'Offices']
				},
				{
					name: 'VCT',
					desc: 'Rigid 12×12 limestone-composite tile. Strip-and-wax finish that lasts decades. The institutional workhorse.',
					specs: ['1/8" gauge standard', 'Through-pattern construction', 'Class III chemical resistance', 'Lowest lifecycle cost'],
					tags: ['Schools', 'Institutions']
				},
				{
					name: 'SCT / Homogeneous',
					desc: 'Solid vinyl through full thickness. Heat-welded seams for zero-gap hygiene surfaces. Color and pattern run all the way through — scratches disappear.',
					specs: ['Full-depth color homogeneity', 'Heat-welded seam integrity', 'Meets ISO 10581', 'Chemical resistance Class A'],
					tags: ['Operating Theatres', 'Clean Rooms']
				},
				{
					name: 'Sheet Vinyl',
					desc: 'Continuous rolls up to 12\' wide, flash-coved up walls. No seams where bacteria can hide — the gold standard for sterile environments.',
					specs: ['Up to 12\' seamless width', 'Flash-cove wall integration', 'Polyurethane reinforcement', '0.7mm+ wear layer'],
					tags: ['Hospitals', 'Kitchens']
				},
				{
					name: 'Safety Flooring',
					desc: 'Altro-style embedded aggregate for sustained slip resistance in wet and greasy conditions. Meets OSHA and CSA slip thresholds out of the box.',
					specs: ['R10-R13 slip ratings', 'Carborundum aggregate', 'HSE compliant', 'Meets ASTM D2047'],
					tags: ['Wet Areas', 'Commercial Kitchens']
				},
				{
					name: 'Marmoleum',
					desc: 'Natural linseed-oil linoleum by Forbo. Hypoallergenic, antibacterial, and carbon-neutral from raw material to end of life.',
					specs: ['97% natural raw materials', 'Carbon neutral (Scope 1-3)', 'Bacteriostatic surface', '25-year commercial warranty'],
					tags: ['Schools', 'Healthcare']
				}
			]
		},
		{
			id: 'hard-surface',
			name: 'Hard Surface',
			pitch: 'Decades of performance. No apologies.',
			why: 'When the spec calls for permanent — truly permanent — hard surface delivers. Porcelain rated for freeze-thaw cycles handles Ottawa\'s -30°C winters at building entrances. Epoxy gives you seamless, impervious floors for labs and processing plants where chemical spills are Tuesday. These floors outlast the buildings they\'re installed in.',
			gradient: 'rgba(229, 76, 60, 0.03)',
			products: [
				{
					name: 'Ceramic / Porcelain',
					desc: 'Slip-rated tile for entrances and wet areas. Porcelain body absorbs less than 0.5% moisture — virtually impervious. 25-50+ year service life with zero refinishing.',
					specs: ['PEI IV-V abrasion rating', '< 0.5% water absorption', 'DCOF ≥ 0.42 wet', 'Freeze-thaw rated'],
					tags: ['Entrances', 'Wet Areas']
				},
				{
					name: 'Epoxy / Resinous',
					desc: 'Poured seamless over concrete. Chemical resistant, easy to decontaminate, available in broadcast quartz, metallic, and flake finishes.',
					specs: ['Compressive strength 10,000+ PSI', 'Chemical resistance Class A', 'Seamless monolithic surface', 'Anti-static formulations available'],
					tags: ['Labs', 'Mech Rooms', 'Food Processing']
				}
			]
		},
		{
			id: 'wood-natural',
			name: 'Wood & Natural',
			pitch: 'Real materials. Real character. Warmth that synthetics can only imitate.',
			why: 'Natural materials bring biophilic warmth to executive and public-facing spaces. Engineered hardwood gives you the look of solid with dimensional stability over concrete subfloors and radiant heat. Bamboo and cork earn LEED MR credits. For heritage restorations, reclaimed wood is often the only way to match existing century-old floors.',
			gradient: 'rgba(212, 164, 74, 0.04)',
			products: [
				{
					name: 'Hardwood',
					desc: 'Solid and engineered profiles. Refinishable for generations. The executive standard for boardrooms, showrooms, and anywhere first impressions matter.',
					specs: ['Janka 1000-3000+', '3/4" solid or engineered', 'Site-finished or prefinished', 'FSC-certified options'],
					tags: ['Executive Offices', 'Showrooms']
				},
				{
					name: 'Bamboo',
					desc: 'Strand-woven and harder than most North American hardwoods. Rapid-renewable harvest cycle of 5-7 years versus 40+ for oak.',
					specs: ['Janka 3000+ (strand-woven)', 'Rapid-renewable (5-7 yr cycle)', 'LEED MR credit eligible', 'Formaldehyde-free adhesives'],
					tags: ['LEED Projects', 'Modern Offices']
				},
				{
					name: 'Cork',
					desc: 'Bark-harvested without felling the tree. Inherent sound and thermal insulation in a single layer — NRC values rival dedicated acoustic underlayments.',
					specs: ['NRC 0.15-0.30 (no underlay)', 'R-value 1.125 per inch', 'Naturally antimicrobial', 'Harvest-renewable every 9 years'],
					tags: ['Libraries', 'Museums']
				},
				{
					name: 'Reclaimed Wood',
					desc: 'Salvaged old-growth timber from barns, factories, and warehouses. Every plank carries a century of story — nail holes, patina, and grain density impossible to replicate.',
					specs: ['Old-growth grain density', 'Kiln-dried to 6-8% MC', 'Custom milling available', 'Chain-of-custody documentation'],
					tags: ['Heritage Restorations']
				}
			]
		},
		{
			id: 'rubber-impact',
			name: 'Rubber & Impact',
			pitch: 'When the floor has to absorb the punishment so the people don\'t.',
			why: 'Rubber flooring absorbs impact energy, deadens sound transmission, and resists indentation from heavy equipment. In gyms and fitness centres, it protects both athletes and the slab beneath them. At building entrances, walk-off matting systems stop 80%+ of tracked-in soil — protecting every other floor in the building.',
			gradient: 'rgba(46, 138, 230, 0.03)',
			products: [
				{
					name: 'Rubber Tile & Sheet',
					desc: 'Vulcanized rubber in tile and sheet formats. Impact-absorbing, sound-deadening, and nearly indestructible. Handles rolling loads from hospital beds to forklifts.',
					specs: ['Shore A hardness 85-95', 'IIC 51-58 (impact sound)', 'Static load limit 2000+ PSI', '20-year commercial warranty'],
					tags: ['Gyms', 'Hospitals', 'Industrial']
				},
				{
					name: 'Entrance Matting',
					desc: 'Recessed and surface-mount walk-off systems. Engineered zones — scrape, absorb, dry — that stop 80%+ of tracked-in soil before it reaches finished flooring.',
					specs: ['3-zone walk-off design', 'Aluminum or vinyl scraper', 'Moisture-wicking textile inserts', 'ADA-compliant transitions'],
					tags: ['Entrances', 'Lobbies']
				}
			]
		},
		{
			id: 'specialty',
			name: 'Specialty',
			pitch: 'The niche solutions that most installers can\'t even quote.',
			why: 'Specialty products solve problems that mainstream flooring can\'t touch. Raised access floors let you route power and data anywhere without trenching concrete. ESD tile keeps static charges below the thresholds that destroy sensitive electronics. These are the specs where you need a supplier who\'s done it before — and we have, hundreds of times.',
			gradient: 'rgba(60, 200, 110, 0.03)',
			products: [
				{
					name: 'Raised Access',
					desc: 'Pedestal-mounted panels with full underfloor plenum. Route cables, HVAC, and power anywhere — reconfigure without demolition.',
					specs: ['CISCA Grade 1-3 load ratings', 'Plenum depth 6"-36"', 'Steel or concrete-core panels', 'Infinite reconfigurability'],
					tags: ['Data Centres', 'Trading Floors']
				},
				{
					name: 'Stair Treads',
					desc: 'Rubber and vinyl treads with integrated slip-resistant nosings. Meets building code egress requirements and ADA/AODA accessibility standards.',
					specs: ['ASTM C1028 slip tested', 'Photoluminescent nosing options', 'One-piece or overlay install', 'Fire-rated assemblies'],
					tags: ['Stairwells', 'Fire Exits']
				},
				{
					name: 'Wall Base',
					desc: '4-6" coved and straight profiles in vinyl and rubber. The detail that finishes a room and protects wall surfaces from cart and equipment damage.',
					specs: ['4" and 6" heights', 'Coved, straight, or butt-cove', 'Toeless and toed profiles', '48 standard colors'],
					tags: ['All Commercial']
				},
				{
					name: 'ESD / Conductive',
					desc: 'Static-dissipative tile that bleeds charge to ground before it reaches sensitive electronics. Resistance-tested and certified to ANSI/ESD standards.',
					specs: ['10⁶–10⁹ Ω resistance range', 'ANSI/ESD S20.20 compliant', 'Body voltage < 100V', 'Permanent conductivity'],
					tags: ['Server Rooms', 'Electronics Labs']
				}
			]
		}
	];

	const suppliers = [
		'Tarkett', 'Beaulieu Canada', 'Interface', 'Forbo', 'Shaw Contract',
		'Mohawk Group', 'Patcraft', 'Gerflor', 'Johnsonite', 'COREtec',
		'Nora', 'Armstrong Flooring'
	];

	const services = [
		{
			title: 'Commercial Installation',
			desc: 'Full-service flooring installation for offices, hospitals, schools, and every building type in between.',
			bullets: [
				'Bonded and insured crews with INSTALL certification',
				'Subfloor prep: shot-blasting, levelling, moisture mitigation',
				'Phased occupancy scheduling for occupied buildings',
				'Post-install inspection and punch-list resolution'
			]
		},
		{
			title: 'Specification & Consultation',
			desc: 'Product selection, spec writing, and budget planning. We help you choose the right floor before the first tile is cut.',
			bullets: [
				'CSI MasterFormat Section 09 specification support',
				'Lifecycle cost analysis across product categories',
				'Mockup and sample coordination',
				'LEED and sustainability credit guidance'
			]
		},
		{
			title: 'Maintenance & Repair',
			desc: 'Scheduled maintenance programs and emergency repairs that extend floor life and protect your investment.',
			bullets: [
				'Strip-and-wax programs for VCT and natural stone',
				'Carpet extraction and restoration',
				'Spot repairs and seamless patching',
				'Warranty administration and manufacturer coordination'
			]
		},
		{
			title: 'Seasonal Matting Programs',
			desc: 'Winter walk-off matting programs that keep Ottawa\'s salt and slush outside where it belongs.',
			bullets: [
				'Custom-fit entrance matting for your building profile',
				'Seasonal swap service (November through April)',
				'Cleaning and storage between seasons',
				'Reduces interior floor damage by up to 80%'
			]
		}
	];

	const salesTeam = [
		{ name: 'Ryan Young', phone: '613-277-7926', email: 'ryoung@youngcarpets.com' },
		{ name: 'Derek Young', phone: '613-612-8487', email: 'dyoung@youngcarpets.com' },
		{ name: 'Peter Helis', phone: '613-864-6998', email: 'phelis@youngcarpets.com' },
		{ name: 'Mike Noel', phone: '613-222-5987', email: 'mnoel@youngcarpets.com' },
		{ name: 'Clayton Bradley', phone: '613-290-5075', email: 'cbradley@youngcarpets.com' },
		{ name: 'Alan O\u2019Connor', phone: '613-791-3252', email: 'aoconnor@youngcarpets.com' }
	];

	const navLinks = [
		{ label: 'Products', href: '#soft-floors' },
		{ label: 'Services', href: '#services' },
		{ label: 'About', href: '#about' },
		{ label: 'Contact', href: '#contact' }
	];

	/* ── Animated counter ── */
	function animateCount(target: number, duration: number, cb: (v: number) => void) {
		const start = performance.now();
		function tick(now: number) {
			const elapsed = now - start;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			cb(Math.round(eased * target));
			if (progress < 1) requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
	}

	onMount(() => {
		/* ── Font loading ── */
		const font = new FontFace('Square721', 'url(/young-carpets/square721.ttf)');
		font.load().then((loaded) => {
			document.fonts.add(loaded);
			fontLoaded = true;
			setTimeout(() => { heroVisible = true; }, 100);
		}).catch(() => {
			fontLoaded = true;
			setTimeout(() => { heroVisible = true; }, 100);
		});

		/* ── Scroll handler for nav ── */
		const onScroll = () => {
			navScrolled = window.scrollY > 60;
		};
		window.addEventListener('scroll', onScroll, { passive: true });

		/* ── Intersection observer for section reveals ── */
		const revealObserver = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					const id = (entry.target as HTMLElement).dataset.reveal;
					if (id) {
						revealedSections = new Set([...revealedSections, id]);
					}
				}
			}
		}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

		/* ── Intersection observer for stats ── */
		const statsObserver = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting && !statsTriggered) {
					statsTriggered = true;
					animateCount(250, 2000, (v) => { yearsCount = v; });
					animateCount(50000, 2500, (v) => { jobsCount = v; });
				}
			}
		}, { threshold: 0.3 });

		/* ── Intersection observer for active nav section ── */
		const navObserver = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					activeSection = entry.target.id;
				}
			}
		}, { threshold: 0.3 });

		// Observe all sections after a tick
		requestAnimationFrame(() => {
			document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));
			const statsEl = document.getElementById('stats-row');
			if (statsEl) statsObserver.observe(statsEl);
			document.querySelectorAll('section[id]').forEach((el) => navObserver.observe(el));
		});

		return () => {
			window.removeEventListener('scroll', onScroll);
			revealObserver.disconnect();
			statsObserver.disconnect();
			navObserver.disconnect();
		};
	});

	function smoothScroll(href: string) {
		if (!browser) return;
		const el = document.querySelector(href);
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	/* ── Hero letters ── */
	const heroLetters = 'YOUNG'.split('');
</script>

<svelte:head>
	<title>Young Carpets — Ottawa's Commercial Flooring Experts Since 1991</title>
	<meta name="description" content="Ottawa's commercial flooring experts since 1991. 20+ product families, 12 national suppliers, 50,000+ installations. Carpet, resilient, hardwood, rubber, and specialty flooring for every commercial application." />
</svelte:head>

<div class="yc-page v2-page">

	<!-- ═══════════════ FLOATING NAV ═══════════════ -->
	<nav class="v2-nav" class:scrolled={navScrolled}>
		<div class="v2-nav-inner">
			<a href="/young-carpets" class="v2-nav-brand">YOUNG</a>
			<div class="v2-nav-links">
				{#each navLinks as link}
					<button
						class="v2-nav-link"
						class:active={activeSection === link.href.slice(1)}
						onclick={() => smoothScroll(link.href)}
					>
						{link.label}
					</button>
				{/each}
			</div>
			<ThemeToggle />
		</div>
	</nav>

	<!-- ═══════════════ HERO ═══════════════ -->
	<header class="v2-hero">
		<div class="v2-hero-inner">
			<!-- Maple leaf background -->
			<div class="v2-hero-leaf" class:visible={heroVisible}>
				<svg viewBox="-2015 -2000 4030 4030" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
					<path d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z" fill="currentColor"/>
				</svg>
			</div>

			<!-- Wordmark -->
			<div class="v2-hero-wordmark" class:visible={heroVisible}>
				{#each heroLetters as letter, i}
					<span class="v2-hero-letter" style="animation-delay: {150 + i * 80}ms">{letter}</span>
				{/each}
			</div>

			<div class="v2-hero-text" class:visible={heroVisible}>
				<p class="v2-hero-tagline">Ottawa's Commercial Flooring Experts</p>
				<p class="v2-hero-sub">Since 1991 &mdash; 20 product lines, 12 national suppliers, one call.</p>
			</div>

			<div class="v2-hero-badge" class:visible={heroVisible}>
				<svg viewBox="-2015 -2000 4030 4030" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="v2-badge-leaf">
					<path d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z" fill="currentColor"/>
				</svg>
				<span class="v2-badge-text">EST 1991</span>
			</div>

			<!-- Scroll indicator -->
			<div class="v2-hero-scroll" class:visible={heroVisible}>
				<div class="v2-scroll-line"></div>
			</div>
		</div>
	</header>

	<!-- ═══════════════ PRODUCT FAMILIES ═══════════════ -->
	{#each families as family, fi}
		<section
			id={family.id}
			class="v2-family"
			class:alt={fi % 2 === 1}
			data-reveal={family.id}
			class:revealed={revealedSections.has(family.id)}
			style="--family-tint: {family.gradient}"
		>
			<div class="v2-family-bg"></div>
			<div class="v2-container">
				<div class="v2-family-header">
					<span class="v2-family-number">{String(fi + 1).padStart(2, '0')}</span>
					<h2 class="v2-family-title">{family.name}</h2>
					<p class="v2-family-pitch">{family.pitch}</p>
					<p class="v2-family-why">{family.why}</p>
				</div>

				<div class="v2-products-track">
					{#each family.products as product}
						<article class="v2-product-card">
							<h3 class="v2-product-name">{product.name}</h3>
							<p class="v2-product-desc">{product.desc}</p>
							{#if product.specs && product.specs.length > 0}
								<ul class="v2-product-specs">
									{#each product.specs as spec}
										<li>{spec}</li>
									{/each}
								</ul>
							{/if}
							<div class="v2-product-tags">
								{#each product.tags as tag}
									<span class="v2-tag">{tag}</span>
								{/each}
							</div>
						</article>
					{/each}
				</div>
			</div>
		</section>
	{/each}

	<!-- ═══════════════ SUPPLIERS ═══════════════ -->
	<section class="v2-suppliers" data-reveal="suppliers" class:revealed={revealedSections.has('suppliers')}>
		<div class="v2-container">
			<span class="v2-eyebrow">National Partners</span>
			<h2 class="v2-section-title">Suppliers We Trust</h2>
			<p class="v2-section-intro">We hold direct accounts with every major commercial flooring manufacturer in North America. That means competitive pricing, priority allocation, and technical support from the people who engineered the product.</p>
		</div>
		<div class="v2-marquee-wrap">
			<div class="v2-marquee">
				{#each [...suppliers, ...suppliers] as name}
					<span class="v2-supplier-name">{name}</span>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════════════ SERVICES ═══════════════ -->
	<section id="services" class="v2-services alt" data-reveal="services" class:revealed={revealedSections.has('services')}>
		<div class="v2-container">
			<span class="v2-eyebrow">What We Do</span>
			<h2 class="v2-section-title">Services</h2>
			<p class="v2-section-intro">From initial specification through final walk-through, we manage every phase of your commercial flooring project. Our crews are INSTALL-certified, our estimators know CSI MasterFormat inside out, and our project managers keep your schedule on track.</p>
			<div class="v2-services-grid">
				{#each services as svc, si}
					<div class="v2-service-card" style="animation-delay: {si * 120}ms">
						<h3 class="v2-service-name">{svc.title}</h3>
						<p class="v2-service-desc">{svc.desc}</p>
						{#if svc.bullets && svc.bullets.length > 0}
							<ul class="v2-service-bullets">
								{#each svc.bullets as bullet}
									<li>{bullet}</li>
								{/each}
							</ul>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════════════ ABOUT ═══════════════ -->
	<section id="about" class="v2-about" data-reveal="about" class:revealed={revealedSections.has('about')}>
		<div class="v2-container">
			<span class="v2-eyebrow">Our Story</span>
			<h2 class="v2-section-title">Family-Built. Ottawa-Rooted.</h2>
			<div class="v2-about-body">
				<p class="v2-about-text">
					Young Carpets was founded in 1991 by the Young family in Ottawa's east end. What started as a small commercial flooring operation has grown into one of the National Capital Region's most trusted names in the trade &mdash; but the values haven't changed. Every project still gets a handshake, a direct phone number, and someone who answers on the first ring.
				</p>
				<p class="v2-about-text">
					Over three decades, we've installed flooring in hospitals, schools, government buildings, airports, hotels, data centres, and thousands of offices across Eastern Ontario and Western Quebec. We've laid carpet tile in Parliament Hill offices, poured epoxy in food processing plants, and heat-welded sheet vinyl in operating theatres at The Ottawa Hospital.
				</p>
				<p class="v2-about-text">
					Our team of six dedicated sales professionals brings over 250 years of combined flooring industry experience. We know the products because we've installed them, maintained them, repaired them, and watched them perform for decades. When we recommend a product, it's because we've seen it hold up &mdash; not because a manufacturer is running a promotion.
				</p>
				<p class="v2-about-text">
					We're still family-owned. Still in Ottawa. Still picking up the phone.
				</p>
			</div>

			<div class="v2-stats" id="stats-row">
				<div class="v2-stat">
					<span class="v2-stat-number">{yearsCount}+</span>
					<span class="v2-stat-label">Combined Years Experience</span>
				</div>
				<div class="v2-stat">
					<span class="v2-stat-number">{jobsCount.toLocaleString()}+</span>
					<span class="v2-stat-label">Jobs Completed</span>
				</div>
			</div>
		</div>
	</section>

	<!-- ═══════════════ CONTACT ═══════════════ -->
	<section id="contact" class="v2-contact alt" data-reveal="contact" class:revealed={revealedSections.has('contact')}>
		<div class="v2-container">
			<span class="v2-eyebrow">Get In Touch</span>
			<h2 class="v2-section-title">Contact</h2>

			<div class="v2-contact-grid">
				<!-- Sales -->
				<div class="v2-contact-group">
					<h3 class="v2-contact-group-title">Sales Team</h3>
					<div class="v2-team-list">
						{#each salesTeam as person}
							<div class="v2-team-card">
								<span class="v2-team-name">{person.name}</span>
								<a href="tel:{person.phone}" class="v2-team-link">{person.phone}</a>
								<a href="mailto:{person.email}" class="v2-team-link">{person.email}</a>
							</div>
						{/each}
					</div>
				</div>

				<!-- Office -->
				<div class="v2-contact-group">
					<h3 class="v2-contact-group-title">Office</h3>
					<div class="v2-team-list">
						<div class="v2-team-card">
							<span class="v2-team-name">Main Line</span>
							<a href="tel:613-744-2744" class="v2-team-link">613-744-2744</a>
						</div>
						<div class="v2-team-card">
							<span class="v2-team-name">Fax</span>
							<span class="v2-team-link">613-744-2995</span>
						</div>
						<div class="v2-team-card">
							<span class="v2-team-name">Email</span>
							<a href="mailto:info@youngcarpets.com" class="v2-team-link">info@youngcarpets.com</a>
						</div>
					</div>

					<h3 class="v2-contact-group-title" style="margin-top: 2rem">Accounting</h3>
					<div class="v2-team-list">
						<div class="v2-team-card">
							<span class="v2-team-name">Alan Young</span>
							<a href="tel:613-878-9911" class="v2-team-link">613-878-9911</a>
							<a href="mailto:accounting@youngcarpets.com" class="v2-team-link">accounting@youngcarpets.com</a>
						</div>
						<div class="v2-team-card">
							<span class="v2-team-name">Accounts Payable</span>
							<a href="mailto:ap@youngcarpets.com" class="v2-team-link">ap@youngcarpets.com</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ═══════════════ MAP ═══════════════ -->
	<section class="v2-map" data-reveal="map" class:revealed={revealedSections.has('map')}>
		<div class="v2-container">
			<span class="v2-eyebrow">Find Us</span>
			<h2 class="v2-section-title">Location</h2>
			<div class="v2-map-frame">
				<iframe
					src="https://www.google.com/maps?q=1228+Old+Innes+Rd+Unit+316+Ottawa+ON+K1B+3V3&output=embed&z=15"
					width="100%"
					height="100%"
					style="border:0; border-radius: 18px;"
					allowfullscreen
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					title="Young Carpets location"
				></iframe>
			</div>
			<p class="v2-map-address">Unit 316 &mdash; 1228 Old Innes Road, Ottawa, ON K1B 3V3</p>
		</div>
	</section>

	<!-- ═══════════════ FOOTER ═══════════════ -->
	<footer class="v2-footer">
		<div class="v2-container">
			<div class="v2-footer-grid">
				<div class="v2-footer-brand">
					<span class="v2-footer-wordmark">YOUNG</span>
					<p class="v2-footer-sub">Commercial Flooring<br />Ottawa, Canada</p>
				</div>
				<div class="v2-footer-col">
					<h4 class="v2-footer-heading">Address</h4>
					<p class="v2-footer-text">Unit 316 &mdash; 1228 Old Innes Road<br />Ottawa, ON K1B 3V3</p>
				</div>
				<div class="v2-footer-col">
					<h4 class="v2-footer-heading">Contact</h4>
					<p class="v2-footer-text">
						<a href="tel:613-744-2744">613-744-2744</a><br />
						<a href="mailto:info@youngcarpets.com">info@youngcarpets.com</a>
					</p>
				</div>
				<div class="v2-footer-col">
					<h4 class="v2-footer-heading">Hours</h4>
					<p class="v2-footer-text">Mon &ndash; Fri: 10:00 &ndash; 16:00<br />Sat &ndash; Sun: Closed</p>
				</div>
			</div>
			<div class="v2-footer-bottom">
				<span>&copy; 2026 Young Carpets Inc.</span>
				<a href="/" class="v2-footer-portal">Portal</a>
			</div>
		</div>
	</footer>
	<DevColorPicker />
</div>

<style>
	/* ═══════════════════════════════════════════════════
	   V2 — VISUAL MAGAZINE LAYOUT (FULL PUBLIC WEBSITE)
	   Light mode: warm cream palette, WCAG AA+ contrast
	   Dark mode: glass cards, ink bg, griege accents
	   ═══════════════════════════════════════════════════ */

	/* ── Reset & Base ── */
	.v2-page {
		background: var(--yc-ink);
		color: var(--yc-griege-text);
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
		font-weight: 200;
		font-size: 0.9rem;
		line-height: 1.6;
		overflow-x: hidden;
		-webkit-font-smoothing: antialiased;
	}

	/* LIGHT MODE — warm cream base */
	:global(:root[data-theme='light']) .v2-page {
		background: #faf7f0;
		color: #3d3832;
	}

	.v2-container {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 1.25rem;
	}

	/* ── Section alternation (light mode) ── */
	:global(:root[data-theme='light']) .v2-family.alt,
	:global(:root[data-theme='light']) .v2-services.alt,
	:global(:root[data-theme='light']) .v2-contact.alt {
		background: #ffffff;
	}

	/* ── Shared typography ── */
	.v2-eyebrow {
		display: block;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--yc-griege-50);
		margin-bottom: 0.75rem;
	}

	:global(:root[data-theme='light']) .v2-eyebrow {
		color: #7a5d10;
	}

	.v2-section-title {
		font-weight: 200;
		font-size: 2rem;
		letter-spacing: 0.04em;
		margin: 0 0 1.25rem;
		color: var(--yc-griege-text);
	}

	:global(:root[data-theme='light']) .v2-section-title {
		color: #1d1d1f;
	}

	.v2-section-intro {
		font-weight: 300;
		font-size: 0.95rem;
		line-height: 1.7;
		color: var(--yc-griege-50);
		max-width: 640px;
		margin: 0 0 2.5rem;
	}

	:global(:root[data-theme='light']) .v2-section-intro {
		color: #3d3832;
	}

	/* ═══════════════ NAVBAR ═══════════════ */
	.v2-nav {
		position: fixed;
		top: 0.75rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 100;
		width: calc(100% - 2rem);
		max-width: 700px;
		border-radius: 16px;
		border: 1px solid transparent;
		transition: all 400ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
		padding: 0;
	}

	.v2-nav.scrolled {
		background: var(--yc-ink-45);
		backdrop-filter: blur(20px) saturate(150%);
		-webkit-backdrop-filter: blur(20px) saturate(150%);
		border-color: var(--yc-griege-20);
		box-shadow: 0 8px 32px -8px var(--yc-shadow-30);
	}

	:global(:root[data-theme='light']) .v2-nav.scrolled {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-color: rgba(90, 77, 53, 0.12);
		box-shadow: 0 4px 24px -4px rgba(90, 77, 53, 0.1);
	}

	.v2-nav-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.6rem 1rem;
		gap: 0.5rem;
	}

	.v2-nav-brand {
		font-family: 'Square721', ui-serif, Georgia, serif;
		font-size: 1.1rem;
		font-weight: 400;
		letter-spacing: 0.08em;
		color: var(--yc-maple-gold);
		text-decoration: none;
		flex-shrink: 0;
	}

	:global(:root[data-theme='light']) .v2-nav-brand {
		color: #7a5d10;
	}

	.v2-nav-links {
		display: flex;
		gap: 0.25rem;
	}

	.v2-nav-link {
		background: none;
		border: none;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--yc-griege-50);
		padding: 0.4rem 0.6rem;
		border-radius: 8px;
		cursor: pointer;
		transition: all 250ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
		min-height: 44px;
		display: flex;
		align-items: center;
	}

	:global(:root[data-theme='light']) .v2-nav-link {
		color: #5a5249;
	}

	.v2-nav-link:hover {
		color: var(--yc-griege-text);
		background: var(--yc-griege-06);
	}

	:global(:root[data-theme='light']) .v2-nav-link:hover {
		color: #1d1d1f;
		background: rgba(90, 77, 53, 0.06);
	}

	.v2-nav-link.active {
		color: var(--yc-maple-gold);
		background: var(--yc-maple-gold-10);
	}

	:global(:root[data-theme='light']) .v2-nav-link.active {
		color: #7a5d10;
		background: rgba(122, 93, 16, 0.08);
	}

	/* ═══════════════ HERO ═══════════════ */
	.v2-hero {
		min-height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		padding: 6rem 1.25rem 4rem;
	}

	.v2-hero-inner {
		text-align: center;
		position: relative;
		z-index: 2;
	}

	/* Background leaf */
	.v2-hero-leaf {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 60vmin;
		height: 60vmin;
		color: var(--yc-maple-red);
		opacity: 0;
		transition: opacity 1.2s ease;
		z-index: 0;
		pointer-events: none;
	}

	.v2-hero-leaf.visible {
		opacity: 0.06;
	}

	:global(:root[data-theme='light']) .v2-hero-leaf.visible {
		opacity: 0.08;
		color: #7a5d10;
	}

	.v2-hero-leaf svg {
		width: 100%;
		height: 100%;
	}

	/* Wordmark */
	.v2-hero-wordmark {
		font-family: 'Square721', ui-serif, Georgia, serif;
		font-size: 3.75rem;
		letter-spacing: 0.12em;
		color: var(--yc-griege-text);
		display: flex;
		justify-content: center;
		gap: 0.05em;
		opacity: 0;
		transition: opacity 0.6s ease;
		margin-bottom: 1.5rem;
	}

	:global(:root[data-theme='light']) .v2-hero-wordmark {
		color: #1d1d1f;
	}

	.v2-hero-wordmark.visible {
		opacity: 1;
	}

	.v2-hero-letter {
		display: inline-block;
		animation: v2-letter-bounce 0.6s cubic-bezier(0.2, 0.9, 0.25, 1.05) both;
		opacity: 0;
	}

	.v2-hero-wordmark.visible .v2-hero-letter {
		opacity: 1;
	}

	@keyframes v2-letter-bounce {
		0% { transform: translateY(30px); opacity: 0; }
		100% { transform: translateY(0); opacity: 1; }
	}

	/* Hero text */
	.v2-hero-text {
		opacity: 0;
		transform: translateY(20px);
		transition: all 0.8s cubic-bezier(0.2, 0.9, 0.25, 1.05) 0.6s;
	}

	.v2-hero-text.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.v2-hero-tagline {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--yc-maple-gold);
		margin: 0 0 0.75rem;
	}

	:global(:root[data-theme='light']) .v2-hero-tagline {
		color: #7a5d10;
	}

	.v2-hero-sub {
		font-weight: 200;
		font-size: 0.95rem;
		color: var(--yc-griege-50);
		max-width: 400px;
		margin: 0 auto;
		line-height: 1.65;
	}

	:global(:root[data-theme='light']) .v2-hero-sub {
		color: #5a5249;
	}

	/* Badge */
	.v2-hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 2.5rem;
		padding: 0.5rem 1rem;
		border-radius: 100px;
		border: 1px solid var(--yc-griege-20);
		background: var(--yc-ink-45);
		backdrop-filter: blur(12px);
		opacity: 0;
		transform: translateY(20px);
		transition: all 0.8s cubic-bezier(0.2, 0.9, 0.25, 1.05) 0.9s;
	}

	:global(:root[data-theme='light']) .v2-hero-badge {
		background: rgba(255, 255, 255, 0.88);
		border-color: rgba(90, 77, 53, 0.16);
		backdrop-filter: none;
		box-shadow: 0 2px 8px rgba(90, 77, 53, 0.08);
	}

	.v2-hero-badge.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.v2-badge-leaf {
		width: 16px;
		height: 16px;
		color: var(--yc-maple-red);
	}

	:global(:root[data-theme='light']) .v2-badge-leaf {
		color: #7a5d10;
	}

	.v2-badge-text {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: var(--yc-griege-50);
	}

	:global(:root[data-theme='light']) .v2-badge-text {
		color: #1d1d1f;
	}

	/* Scroll indicator */
	.v2-hero-scroll {
		position: absolute;
		bottom: -3rem;
		left: 50%;
		transform: translateX(-50%);
		opacity: 0;
		transition: opacity 1.2s ease 1.4s;
	}

	.v2-hero-scroll.visible {
		opacity: 1;
	}

	.v2-scroll-line {
		width: 1px;
		height: 48px;
		background: linear-gradient(to bottom, var(--yc-griege-50), transparent);
		animation: v2-scroll-pulse 2s ease-in-out infinite;
	}

	:global(:root[data-theme='light']) .v2-scroll-line {
		background: linear-gradient(to bottom, #5a5249, transparent);
	}

	@keyframes v2-scroll-pulse {
		0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
		50% { opacity: 1; transform: scaleY(1); }
	}

	/* ═══════════════ PRODUCT FAMILIES ═══════════════ */
	.v2-family {
		position: relative;
		padding: 6rem 0;
		min-height: 70svh;
		display: flex;
		align-items: center;
		scroll-snap-align: start;
	}

	.v2-family-bg {
		position: absolute;
		inset: 0;
		background: radial-gradient(ellipse at 30% 50%, var(--family-tint), transparent 70%);
		pointer-events: none;
		opacity: 0;
		transition: opacity 1s ease;
	}

	.v2-family.revealed .v2-family-bg {
		opacity: 1;
	}

	.v2-family > .v2-container {
		position: relative;
		z-index: 1;
		width: 100%;
	}

	/* Family header */
	.v2-family-header {
		margin-bottom: 3rem;
		opacity: 0;
		transform: translateY(40px);
		transition: all 0.8s cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	.v2-family.revealed .v2-family-header {
		opacity: 1;
		transform: translateY(0);
	}

	.v2-family-number {
		display: block;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: var(--yc-maple-gold-45);
		margin-bottom: 0.75rem;
	}

	:global(:root[data-theme='light']) .v2-family-number {
		color: #7a5d10;
	}

	.v2-family-title {
		font-weight: 200;
		font-size: 2.5rem;
		letter-spacing: 0.04em;
		margin: 0 0 1rem;
		color: var(--yc-griege-text);
	}

	:global(:root[data-theme='light']) .v2-family-title {
		color: #1d1d1f;
	}

	.v2-family-pitch {
		font-weight: 300;
		font-size: 1.1rem;
		color: var(--yc-griege-50);
		max-width: 500px;
		line-height: 1.5;
		margin: 0 0 1rem;
	}

	:global(:root[data-theme='light']) .v2-family-pitch {
		color: #3d3832;
		font-weight: 400;
	}

	.v2-family-why {
		font-weight: 200;
		font-size: 0.88rem;
		color: var(--yc-griege-35);
		max-width: 600px;
		line-height: 1.7;
		margin: 0;
	}

	:global(:root[data-theme='light']) .v2-family-why {
		color: #5a5249;
		font-weight: 300;
	}

	/* Product card track — horizontal scroll on mobile */
	.v2-products-track {
		display: flex;
		gap: 1rem;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
		padding-bottom: 1rem;
		scrollbar-width: none;
	}

	.v2-products-track::-webkit-scrollbar {
		display: none;
	}

	/* Product cards */
	.v2-product-card {
		flex: 0 0 290px;
		scroll-snap-align: start;
		background: var(--yc-ink-45);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--yc-griege-20);
		border-radius: 18px;
		padding: 1.5rem;
		box-shadow: inset 0 var(--yc-edge-y) 0 var(--yc-shimmer-10), 0 8px 24px -4px var(--yc-shadow-30);
		opacity: 0;
		transform: translateY(20px);
		transition: all 0.6s cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	:global(:root[data-theme='light']) .v2-product-card {
		background: rgba(255, 255, 255, 0.88);
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		border-color: rgba(90, 77, 53, 0.16);
		box-shadow: 0 2px 12px -2px rgba(90, 77, 53, 0.1);
	}

	.v2-family.revealed .v2-product-card {
		opacity: 1;
		transform: translateY(0);
	}

	.v2-family.revealed .v2-product-card:nth-child(1) { transition-delay: 0.15s; }
	.v2-family.revealed .v2-product-card:nth-child(2) { transition-delay: 0.25s; }
	.v2-family.revealed .v2-product-card:nth-child(3) { transition-delay: 0.35s; }
	.v2-family.revealed .v2-product-card:nth-child(4) { transition-delay: 0.45s; }
	.v2-family.revealed .v2-product-card:nth-child(5) { transition-delay: 0.55s; }
	.v2-family.revealed .v2-product-card:nth-child(6) { transition-delay: 0.65s; }

	.v2-product-card:hover {
		border-color: var(--yc-griege-35);
		box-shadow:
			inset 0 var(--yc-edge-y) 0 var(--yc-shimmer-18),
			0 12px 32px -4px var(--yc-shadow-45);
		transform: translateY(-4px);
	}

	:global(:root[data-theme='light']) .v2-product-card:hover {
		border-color: rgba(90, 77, 53, 0.24);
		box-shadow: 0 8px 24px -4px rgba(90, 77, 53, 0.14);
		transform: translateY(-4px);
	}

	.v2-product-name {
		font-weight: 600;
		font-size: 1rem;
		letter-spacing: 0.02em;
		margin: 0 0 0.75rem;
		color: var(--yc-griege-text);
	}

	:global(:root[data-theme='light']) .v2-product-name {
		color: #1d1d1f;
	}

	.v2-product-desc {
		font-weight: 200;
		font-size: 0.85rem;
		line-height: 1.6;
		color: var(--yc-griege-50);
		margin: 0 0 1rem;
	}

	:global(:root[data-theme='light']) .v2-product-desc {
		color: #3d3832;
		font-weight: 300;
	}

	/* Product specs list */
	.v2-product-specs {
		list-style: none;
		padding: 0;
		margin: 0 0 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.v2-product-specs li {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--yc-griege-35);
		padding-left: 0.75rem;
		position: relative;
	}

	.v2-product-specs li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.45em;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--yc-griege-25);
	}

	:global(:root[data-theme='light']) .v2-product-specs li {
		color: #5a5249;
	}

	:global(:root[data-theme='light']) .v2-product-specs li::before {
		background: #7a5d10;
		opacity: 0.5;
	}

	.v2-product-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.v2-tag {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.6rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 0.3rem 0.6rem;
		border-radius: 100px;
		border: 1px solid var(--yc-griege-18);
		color: var(--yc-griege-50);
		background: var(--yc-ink-45);
	}

	:global(:root[data-theme='light']) .v2-tag {
		background: rgba(122, 93, 16, 0.05);
		border-color: rgba(90, 77, 53, 0.14);
		color: #5a5249;
	}

	/* ═══════════════ SUPPLIERS MARQUEE ═══════════════ */
	.v2-suppliers {
		padding: 5rem 0;
		overflow: hidden;
		opacity: 0;
		transition: opacity 0.8s ease;
	}

	.v2-suppliers.revealed {
		opacity: 1;
	}

	.v2-marquee-wrap {
		position: relative;
		margin-top: 2rem;
	}

	.v2-marquee-wrap::before,
	.v2-marquee-wrap::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		width: 80px;
		z-index: 2;
		pointer-events: none;
	}

	.v2-marquee-wrap::before {
		left: 0;
		background: linear-gradient(to right, var(--yc-ink), transparent);
	}

	.v2-marquee-wrap::after {
		right: 0;
		background: linear-gradient(to left, var(--yc-ink), transparent);
	}

	:global(:root[data-theme='light']) .v2-marquee-wrap::before {
		background: linear-gradient(to right, #faf7f0, transparent);
	}

	:global(:root[data-theme='light']) .v2-marquee-wrap::after {
		background: linear-gradient(to left, #faf7f0, transparent);
	}

	.v2-marquee {
		display: flex;
		gap: 3rem;
		animation: v2-marquee 30s linear infinite;
		width: max-content;
	}

	@keyframes v2-marquee {
		0% { transform: translateX(0); }
		100% { transform: translateX(-50%); }
	}

	.v2-supplier-name {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--yc-griege-35);
		white-space: nowrap;
		padding: 0.75rem 0;
	}

	:global(:root[data-theme='light']) .v2-supplier-name {
		color: #5a5249;
	}

	/* ═══════════════ SERVICES ═══════════════ */
	.v2-services {
		padding: 6rem 0;
		opacity: 0;
		transform: translateY(30px);
		transition: all 0.8s cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	.v2-services.revealed {
		opacity: 1;
		transform: translateY(0);
	}

	.v2-services-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.v2-service-card {
		background: var(--yc-ink-45);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--yc-griege-20);
		border-radius: 18px;
		padding: 1.5rem;
		box-shadow: inset 0 var(--yc-edge-y) 0 var(--yc-shimmer-10), 0 8px 24px -4px var(--yc-shadow-30);
		transition: all 300ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	:global(:root[data-theme='light']) .v2-service-card {
		background: rgba(255, 255, 255, 0.88);
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		border-color: rgba(90, 77, 53, 0.16);
		box-shadow: 0 2px 12px -2px rgba(90, 77, 53, 0.1);
	}

	.v2-service-card:hover {
		border-color: var(--yc-griege-35);
		transform: translateY(-2px);
		box-shadow:
			inset 0 var(--yc-edge-y) 0 var(--yc-shimmer-18),
			0 12px 32px -4px var(--yc-shadow-45);
	}

	:global(:root[data-theme='light']) .v2-service-card:hover {
		border-color: rgba(90, 77, 53, 0.24);
		box-shadow: 0 8px 24px -4px rgba(90, 77, 53, 0.14);
		transform: translateY(-2px);
	}

	.v2-service-name {
		font-weight: 600;
		font-size: 0.95rem;
		margin: 0 0 0.5rem;
		color: var(--yc-griege-text);
	}

	:global(:root[data-theme='light']) .v2-service-name {
		color: #1d1d1f;
	}

	.v2-service-desc {
		font-weight: 200;
		font-size: 0.85rem;
		line-height: 1.6;
		color: var(--yc-griege-50);
		margin: 0 0 0.75rem;
	}

	:global(:root[data-theme='light']) .v2-service-desc {
		color: #3d3832;
		font-weight: 300;
	}

	.v2-service-bullets {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.v2-service-bullets li {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--yc-griege-35);
		padding-left: 0.75rem;
		position: relative;
	}

	.v2-service-bullets li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.45em;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--yc-griege-25);
	}

	:global(:root[data-theme='light']) .v2-service-bullets li {
		color: #5a5249;
	}

	:global(:root[data-theme='light']) .v2-service-bullets li::before {
		background: #7a5d10;
		opacity: 0.5;
	}

	/* ═══════════════ ABOUT ═══════════════ */
	.v2-about {
		padding: 6rem 0;
		opacity: 0;
		transform: translateY(30px);
		transition: all 0.8s cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	.v2-about.revealed {
		opacity: 1;
		transform: translateY(0);
	}

	.v2-about-body {
		max-width: 640px;
		margin-bottom: 3rem;
	}

	.v2-about-text {
		font-weight: 200;
		font-size: 1.05rem;
		line-height: 1.7;
		color: var(--yc-griege-50);
		margin: 0 0 1.25rem;
	}

	.v2-about-text:last-child {
		margin-bottom: 0;
		font-weight: 400;
		font-style: italic;
		color: var(--yc-griege-60);
	}

	:global(:root[data-theme='light']) .v2-about-text {
		color: #3d3832;
		font-weight: 300;
	}

	:global(:root[data-theme='light']) .v2-about-text:last-child {
		color: #1d1d1f;
		font-weight: 500;
	}

	.v2-stats {
		display: flex;
		gap: 3rem;
	}

	.v2-stat {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.v2-stat-number {
		font-weight: 200;
		font-size: 2.5rem;
		letter-spacing: 0.02em;
		color: var(--yc-maple-gold);
	}

	:global(:root[data-theme='light']) .v2-stat-number {
		color: #7a5d10;
	}

	.v2-stat-label {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--yc-griege-35);
	}

	:global(:root[data-theme='light']) .v2-stat-label {
		color: #1d1d1f;
	}

	/* ═══════════════ CONTACT ═══════════════ */
	.v2-contact {
		padding: 6rem 0;
		opacity: 0;
		transform: translateY(30px);
		transition: all 0.8s cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	.v2-contact.revealed {
		opacity: 1;
		transform: translateY(0);
	}

	.v2-contact-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2.5rem;
	}

	.v2-contact-group-title {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--yc-maple-gold-45);
		margin: 0 0 1rem;
	}

	:global(:root[data-theme='light']) .v2-contact-group-title {
		color: #7a5d10;
	}

	.v2-team-list {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.75rem;
	}

	.v2-team-card {
		background: var(--yc-ink-45);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--yc-griege-20);
		border-radius: 14px;
		padding: 1rem 1.25rem;
		box-shadow: inset 0 var(--yc-edge-y) 0 var(--yc-shimmer-10);
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	:global(:root[data-theme='light']) .v2-team-card {
		background: rgba(255, 255, 255, 0.88);
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		border-color: rgba(90, 77, 53, 0.16);
		box-shadow: 0 2px 8px -2px rgba(90, 77, 53, 0.08);
	}

	.v2-team-name {
		font-weight: 600;
		font-size: 0.85rem;
		color: var(--yc-griege-text);
	}

	:global(:root[data-theme='light']) .v2-team-name {
		color: #1d1d1f;
	}

	.v2-team-link {
		font-size: 0.8rem;
		font-weight: 300;
		color: var(--yc-griege-50);
		text-decoration: none;
		transition: color 200ms ease;
	}

	:global(:root[data-theme='light']) .v2-team-link {
		color: #3d3832;
	}

	.v2-team-link:hover {
		color: var(--yc-maple-gold);
	}

	:global(:root[data-theme='light']) .v2-team-link:hover {
		color: #7a5d10;
	}

	a.v2-team-link {
		min-height: 44px;
		display: flex;
		align-items: center;
	}

	/* ═══════════════ MAP ═══════════════ */
	.v2-map {
		padding: 5rem 0;
		opacity: 0;
		transform: translateY(30px);
		transition: all 0.8s cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	.v2-map.revealed {
		opacity: 1;
		transform: translateY(0);
	}

	.v2-map-frame {
		width: 100%;
		height: 320px;
		border-radius: 18px;
		overflow: hidden;
		border: 1px solid var(--yc-griege-20);
		margin-bottom: 1.25rem;
	}

	:global(:root[data-theme='light']) .v2-map-frame {
		border-color: rgba(90, 77, 53, 0.16);
		box-shadow: 0 2px 12px -2px rgba(90, 77, 53, 0.1);
	}

	.v2-map-address {
		font-size: 0.85rem;
		font-weight: 300;
		color: var(--yc-griege-50);
		text-align: center;
	}

	:global(:root[data-theme='light']) .v2-map-address {
		color: #3d3832;
	}

	/* ═══════════════ FOOTER ═══════════════ */
	.v2-footer {
		padding: 4rem 0 2rem;
		border-top: 1px solid var(--yc-griege-20);
	}

	:global(:root[data-theme='light']) .v2-footer {
		border-top-color: rgba(90, 77, 53, 0.12);
		background: #faf7f0;
	}

	.v2-footer-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.v2-footer-wordmark {
		font-family: 'Square721', ui-serif, Georgia, serif;
		font-size: 1.5rem;
		letter-spacing: 0.1em;
		color: var(--yc-griege-text);
		display: block;
		margin-bottom: 0.5rem;
	}

	:global(:root[data-theme='light']) .v2-footer-wordmark {
		color: #1d1d1f;
	}

	.v2-footer-sub {
		font-size: 0.8rem;
		font-weight: 200;
		color: var(--yc-griege-35);
		line-height: 1.5;
		margin: 0;
	}

	:global(:root[data-theme='light']) .v2-footer-sub {
		color: #5a5249;
	}

	.v2-footer-heading {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--yc-griege-50);
		margin: 0 0 0.5rem;
	}

	:global(:root[data-theme='light']) .v2-footer-heading {
		color: #1d1d1f;
	}

	.v2-footer-text {
		font-size: 0.8rem;
		font-weight: 200;
		line-height: 1.6;
		color: var(--yc-griege-35);
		margin: 0;
	}

	:global(:root[data-theme='light']) .v2-footer-text {
		color: #5a5249;
	}

	.v2-footer-text a {
		color: var(--yc-griege-50);
		text-decoration: none;
		transition: color 200ms ease;
	}

	:global(:root[data-theme='light']) .v2-footer-text a {
		color: #3d3832;
	}

	.v2-footer-text a:hover {
		color: var(--yc-maple-gold);
	}

	:global(:root[data-theme='light']) .v2-footer-text a:hover {
		color: #7a5d10;
	}

	.v2-footer-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1.5rem;
		border-top: 1px solid var(--yc-griege-08);
		font-size: 0.75rem;
		font-weight: 300;
		color: var(--yc-griege-35);
	}

	:global(:root[data-theme='light']) .v2-footer-bottom {
		border-top-color: rgba(90, 77, 53, 0.08);
		color: #5a5249;
	}

	.v2-footer-portal {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--yc-griege-35);
		text-decoration: none;
		padding: 0.4rem 0.8rem;
		border-radius: 8px;
		border: 1px solid var(--yc-griege-18);
		transition: all 200ms ease;
		min-height: 44px;
		display: flex;
		align-items: center;
	}

	:global(:root[data-theme='light']) .v2-footer-portal {
		color: #5a5249;
		border-color: rgba(90, 77, 53, 0.16);
	}

	.v2-footer-portal:hover {
		color: var(--yc-maple-gold);
		border-color: var(--yc-maple-gold-45);
		background: var(--yc-maple-gold-10);
	}

	:global(:root[data-theme='light']) .v2-footer-portal:hover {
		color: #7a5d10;
		border-color: rgba(122, 93, 16, 0.3);
		background: rgba(122, 93, 16, 0.06);
	}

	/* ═══════════════ RESPONSIVE ═══════════════ */

	/* Tablet (600px+) */
	@media (min-width: 600px) {
		.v2-hero-wordmark {
			font-size: 4.5rem;
		}

		.v2-family-title {
			font-size: 3rem;
		}

		.v2-product-card {
			flex: 0 0 300px;
		}

		.v2-services-grid {
			grid-template-columns: 1fr 1fr;
		}

		.v2-contact-grid {
			grid-template-columns: 1fr 1fr;
		}

		.v2-team-list {
			grid-template-columns: 1fr 1fr;
		}

		.v2-footer-grid {
			grid-template-columns: 1.5fr 1fr 1fr 1fr;
		}

		.v2-stats {
			gap: 4rem;
		}

		.v2-stat-number {
			font-size: 3rem;
		}

		.v2-map-frame {
			height: 400px;
		}
	}

	/* Desktop (900px+) */
	@media (min-width: 900px) {
		.v2-hero-wordmark {
			font-size: 5.5rem;
		}

		.v2-family {
			padding: 8rem 0;
		}

		.v2-family-title {
			font-size: 3.5rem;
		}

		.v2-family-pitch {
			font-size: 1.2rem;
		}

		.v2-products-track {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
			overflow-x: visible;
		}

		.v2-product-card {
			flex: none;
		}

		.v2-section-title {
			font-size: 2.5rem;
		}

		.v2-about-text {
			font-size: 1.15rem;
		}

		.v2-team-list {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* ═══════════════ REDUCED MOTION ═══════════════ */
	@media (prefers-reduced-motion: reduce) {
		.v2-hero-letter {
			animation: none;
			opacity: 1;
		}

		.v2-hero-text,
		.v2-hero-badge,
		.v2-hero-leaf,
		.v2-family-header,
		.v2-product-card,
		.v2-services,
		.v2-about,
		.v2-contact,
		.v2-map,
		.v2-suppliers {
			opacity: 1 !important;
			transform: none !important;
			transition: none !important;
		}

		.v2-family.revealed .v2-product-card {
			transition-delay: 0s !important;
		}

		.v2-marquee {
			animation-duration: 60s;
		}

		.v2-scroll-line {
			animation: none;
		}
	}
</style>
