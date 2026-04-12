<!-- Young Carpets — V4 "The Grand Scheme"
     A cinematic, full-website prototype for Ottawa's premier commercial flooring installer.
     Svelte 5 runes. Self-contained. No DB/API. -->
<script lang="ts">
	import '$lib/styles/young-carpets-tokens.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import DevColorPicker from '../../components/DevColorPicker.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	/* ═══════════════ STATE ═══════════════ */
	let fontLoaded = $state(false);
	let heroVisible = $state(false);
	let navScrolled = $state(false);
	let scrollProgress = $state(0);
	let activeSection = $state('hero');
	let mobileMenuOpen = $state(false);

	/* Counters */
	let yearsCount = $state(0);
	let jobsCount = $state(0);
	let crewYearsCount = $state(0);
	let statsTriggered = $state(false);

	/* Section reveal */
	let revealedSections = $state<Set<string>>(new Set());

	/* Product filter */
	let activeCategory = $state('all');

	/* Flooring advisor */
	let advisorStep = $state(0);
	let advisorSpace = $state('');
	let advisorPriority = $state('');

	/* Portfolio */
	let activeProject = $state(0);

	/* Process */
	let activeProcess = $state(-1);

	/* ═══════════════ DATA ═══════════════ */

	const navLinks = [
		{ label: 'Products', href: '#products' },
		{ label: 'Process', href: '#process' },
		{ label: 'Portfolio', href: '#portfolio' },
		{ label: 'Why Us', href: '#why-us' },
		{ label: 'Advisor', href: '#advisor' },
		{ label: 'Contact', href: '#contact' }
	];

	const categories = [
		{ id: 'all', name: 'All Products' },
		{ id: 'soft', name: 'Soft Floors' },
		{ id: 'resilient', name: 'Resilient' },
		{ id: 'hard', name: 'Hard Surface' },
		{ id: 'wood', name: 'Wood & Natural' },
		{ id: 'specialty', name: 'Specialty' }
	];

	const products = [
		{ name: 'Carpet Tile', cat: 'soft', desc: 'Modular squares, individually replaceable. Swap a tile, not a room.', tags: ['Office', 'Education', 'Airport'], icon: '▦' },
		{ name: 'Broadloom', cat: 'soft', desc: 'Wall-to-wall rolls with acoustic dampening for corridors and ballrooms.', tags: ['Hotel', 'Theatre'], icon: '▬' },
		{ name: 'LVT', cat: 'resilient', desc: 'Luxury vinyl tile & plank. Waterproof, design-forward, high-traffic ready.', tags: ['Healthcare', 'Retail', 'Office'], icon: '◫' },
		{ name: 'VCT', cat: 'resilient', desc: 'Rigid 12×12 limestone-composite. Strip-and-wax finish that lasts decades.', tags: ['School', 'Institution'], icon: '▢' },
		{ name: 'SCT', cat: 'resilient', desc: 'Solid vinyl through full thickness. Heat-welded seams for zero-gap hygiene.', tags: ['Operating Theatre', 'Clean Room'], icon: '◻' },
		{ name: 'Sheet Vinyl', cat: 'resilient', desc: 'Continuous rolls, flash-coved up walls. No seams where bacteria hide.', tags: ['Hospital', 'Kitchen'], icon: '▭' },
		{ name: 'Safety Flooring', cat: 'resilient', desc: 'Embedded aggregate for slip resistance in the wettest conditions.', tags: ['Wet Area', 'Commercial Kitchen'], icon: '◈' },
		{ name: 'Marmoleum', cat: 'resilient', desc: 'Natural linseed-oil linoleum by Forbo. Hypoallergenic and carbon-neutral.', tags: ['School', 'Healthcare'], icon: '◉' },
		{ name: 'Ceramic', cat: 'hard', desc: 'Slip-rated porcelain tile for entrances and wet areas. 25–50+ year life.', tags: ['Entrance', 'Wet Area'], icon: '◧' },
		{ name: 'Epoxy', cat: 'hard', desc: 'Resinous flooring poured seamless. Chemical resistant, easy to decontaminate.', tags: ['Lab', 'Mech Room'], icon: '◰' },
		{ name: 'Hardwood', cat: 'wood', desc: 'Solid and engineered. Refinishable for generations. The executive standard.', tags: ['Executive Office', 'Showroom'], icon: '▤' },
		{ name: 'Bamboo', cat: 'wood', desc: 'Strand-woven, harder than hardwood. Rapid-renewable and LEED eligible.', tags: ['LEED Project', 'Modern Office'], icon: '▥' },
		{ name: 'Cork', cat: 'wood', desc: 'Bark-harvested without felling. Sound and thermal insulation in one layer.', tags: ['Library', 'Museum'], icon: '◦' },
		{ name: 'Reclaimed Wood', cat: 'wood', desc: 'Salvaged old-growth timber. Every plank carries a century of story.', tags: ['Heritage Restoration'], icon: '▧' },
		{ name: 'Rubber', cat: 'specialty', desc: 'Vulcanized rubber. Impact-absorbing, sound-deadening, nearly indestructible.', tags: ['Gym', 'Hospital', 'Industrial'], icon: '●' },
		{ name: 'Matting', cat: 'specialty', desc: 'Entrance walk-off systems that stop 80%+ of tracked-in soil at the door.', tags: ['Entrance', 'Lobby'], icon: '▩' },
		{ name: 'Raised Access', cat: 'specialty', desc: 'Pedestal panels with full underfloor plenum. Route cables, HVAC, power.', tags: ['Data Centre', 'Trading Floor'], icon: '⊞' },
		{ name: 'Stair Treads', cat: 'specialty', desc: 'Rubber and vinyl treads with slip-resistant nosings. Code-compliant safety.', tags: ['Stairwell', 'Fire Exit'], icon: '⊟' },
		{ name: 'Wall Base', cat: 'specialty', desc: '4–6″ coved and straight vinyl/rubber base. The detail that finishes a room.', tags: ['All Commercial'], icon: '⊡' },
		{ name: 'ESD', cat: 'specialty', desc: 'Static-dissipative tile that bleeds charge before it reaches electronics.', tags: ['Server Room', 'Electronics Lab'], icon: '⚡' }
	];

	let filteredProducts = $derived(
		activeCategory === 'all' ? products : products.filter(p => p.cat === activeCategory)
	);

	const processSteps = [
		{ num: '01', title: 'Consultation', desc: 'Site visit and needs assessment. We walk the space, understand your traffic patterns, timeline, and budget constraints before recommending a single product.', icon: '🔍' },
		{ num: '02', title: 'Specification', desc: 'Material selection with physical samples. We write the spec, produce budget comparisons, and coordinate with your architect or GC.', icon: '📋' },
		{ num: '03', title: 'Scheduling', desc: 'Coordinate with your general contractor, manage access windows, and sequence trades. We fit your timeline — not the other way around.', icon: '📅' },
		{ num: '04', title: 'Installation', desc: 'Our own crews — never subcontracted. Subfloor prep, moisture testing, adhesive selection, and precision installation to manufacturer spec.', icon: '🔨' },
		{ num: '05', title: 'Inspection', desc: 'Full walkthrough with your team. Punch list completed same-day where possible. We don\'t leave until you sign off.', icon: '✓' },
		{ num: '06', title: 'Maintenance', desc: 'Ongoing care plan: scheduled strip-and-wax, carpet extraction, emergency repairs. Protect your investment for the full lifecycle.', icon: '🛡' }
	];

	const portfolio = [
		{ name: 'Ottawa Civic Hospital', area: '45,000 sq ft', products: 'Sheet Vinyl + Rubber Stair Treads', desc: 'Complete corridor and patient room renovation across three wings. Flash-coved sheet vinyl for infection control, rubber treads on all emergency stairwells.', year: '2023', type: 'Healthcare' },
		{ name: 'Carleton University', area: '28,000 sq ft', products: 'Carpet Tile + LVT', desc: 'Lecture halls outfitted with modular carpet tile for acoustics, high-traffic corridors in luxury vinyl plank. Phased installation around the academic calendar.', year: '2024', type: 'Education' },
		{ name: 'Rideau Centre', area: '18,500 sq ft', products: 'Ceramic/Porcelain + LVT', desc: 'Retail wing refresh. Large-format porcelain in common areas, LVT in individual tenant suites. Weekend-only installation to maintain foot traffic.', year: '2023', type: 'Retail' },
		{ name: 'National Defence HQ', area: '32,000 sq ft', products: 'Raised Access + Carpet Tile', desc: 'Security-cleared installation. Raised access flooring for IT infrastructure, carpet tile overlay for comfort. All crews vetted and escorted.', year: '2024', type: 'Government' },
		{ name: 'Brookstreet Hotel', area: '22,000 sq ft', products: 'Broadloom + Hardwood', desc: 'Grand ballroom broadloom replacement and lobby hardwood restoration. Night shifts only — zero guest disruption across a 4-week install.', year: '2022', type: 'Hospitality' },
		{ name: 'Ottawa Convention Centre', area: '55,000 sq ft', products: 'Carpet Tile + Matting', desc: 'The largest single-project install in company history. Modular carpet tile throughout exhibit halls, heavy-duty matting systems at all entrances.', year: '2024', type: 'Convention' }
	];

	const suppliers = [
		'Tarkett', 'Beaulieu Canada', 'Interface', 'Forbo', 'Shaw Contract',
		'Mohawk Group', 'Patcraft', 'Gerflor', 'Johnsonite', 'COREtec',
		'Nora', 'Armstrong Flooring'
	];

	const services = [
		{ title: 'Commercial Installation', desc: 'Full-service flooring for offices, hospitals, schools, and every building type in between. Our own crews — never subcontracted.', stat: '50,000+', statLabel: 'installations' },
		{ title: 'Consultation & Specification', desc: 'Product selection, spec writing, and budget planning. We help you choose the right floor before the first tile is cut.', stat: '20+', statLabel: 'product families' },
		{ title: 'Maintenance & Repair', desc: 'Scheduled maintenance programs and emergency repairs to protect your flooring investment for its full lifecycle.', stat: '365', statLabel: 'days/year' },
		{ title: 'Seasonal Matting', desc: 'Winter walk-off matting programs that keep Ottawa\'s salt and slush outside where it belongs.', stat: '6', statLabel: 'month season' }
	];

	const salesTeam = [
		{ name: 'Ryan Young', phone: '613-277-7926', email: 'ryoung@youngcarpets.com', role: 'Sales' },
		{ name: 'Derek Young', phone: '613-612-8487', email: 'dyoung@youngcarpets.com', role: 'Sales' },
		{ name: 'Peter Helis', phone: '613-864-6998', email: 'phelis@youngcarpets.com', role: 'Sales' },
		{ name: 'Mike Noel', phone: '613-222-5987', email: 'mnoel@youngcarpets.com', role: 'Sales' },
		{ name: 'Clayton Bradley', phone: '613-290-5075', email: 'cbradley@youngcarpets.com', role: 'Sales' },
		{ name: 'Alan O\u2019Connor', phone: '613-791-3252', email: 'aoconnor@youngcarpets.com', role: 'Sales' }
	];

	const whyUs = [
		{ num: '34', suffix: 'yrs', title: 'Ottawa Heritage', desc: 'Operating in the National Capital Region since 1991. We know every building, every spec, every inspector.' },
		{ num: '250', suffix: '+', title: 'Combined Years', desc: 'Our installation crew brings over 250 years of combined flooring experience to every project.' },
		{ num: '12', suffix: '', title: 'National Suppliers', desc: 'Authorized dealer for every major commercial flooring manufacturer in North America.' },
		{ num: '0', suffix: '', title: 'Subcontractors', desc: 'Every installer on your project is a Young Carpets employee. Accountable. Trained. Insured.' }
	];

	/* Advisor logic */
	const spaceTypes = [
		{ id: 'office', label: 'Office', icon: '🏢' },
		{ id: 'healthcare', label: 'Healthcare', icon: '🏥' },
		{ id: 'education', label: 'Education', icon: '🎓' },
		{ id: 'retail', label: 'Retail', icon: '🛍' },
		{ id: 'hospitality', label: 'Hospitality', icon: '🏨' },
		{ id: 'government', label: 'Government', icon: '🏛' },
		{ id: 'industrial', label: 'Industrial', icon: '🏭' },
		{ id: 'residential', label: 'Residential', icon: '🏠' }
	];

	const priorities = [
		{ id: 'durability', label: 'Durability', icon: '🛡', desc: 'Maximum lifespan, minimal maintenance' },
		{ id: 'aesthetics', label: 'Aesthetics', icon: '✨', desc: 'Design-forward, premium look' },
		{ id: 'budget', label: 'Budget', icon: '💰', desc: 'Best value per square foot' },
		{ id: 'sustainability', label: 'Sustainability', icon: '🌿', desc: 'LEED-eligible, low VOC, natural' }
	];

	type Recommendation = { product: string; reason: string };
	const advisorResults = $derived<Recommendation[]>(getRecommendations(advisorSpace, advisorPriority));

	function getRecommendations(space: string, priority: string): Recommendation[] {
		if (!space || !priority) return [];
		const map: Record<string, Record<string, Recommendation[]>> = {
			office: {
				durability: [{ product: 'Carpet Tile', reason: 'Modular replacement keeps floors fresh for decades' }, { product: 'LVT', reason: 'Waterproof luxury vinyl handles heavy rolling traffic' }],
				aesthetics: [{ product: 'Hardwood', reason: 'Executive-grade warmth and character' }, { product: 'Carpet Tile', reason: 'Design flexibility with pattern mixing' }],
				budget: [{ product: 'VCT', reason: 'Lowest lifecycle cost with strip-and-wax maintenance' }, { product: 'Carpet Tile', reason: 'Replace individual tiles, not entire floors' }],
				sustainability: [{ product: 'Marmoleum', reason: 'Carbon-neutral natural linoleum' }, { product: 'Cork', reason: 'Harvested without felling trees, LEED points' }]
			},
			healthcare: {
				durability: [{ product: 'Sheet Vinyl', reason: 'Seamless, flash-coved — zero bacterial harboring' }, { product: 'Rubber', reason: 'Impact-absorbing and nearly indestructible' }],
				aesthetics: [{ product: 'LVT', reason: 'Wood and stone looks with full infection control' }, { product: 'Marmoleum', reason: 'Natural beauty with antimicrobial properties' }],
				budget: [{ product: 'VCT', reason: 'Proven hospital workhorse at the lowest installed cost' }, { product: 'Sheet Vinyl', reason: 'Fast install, decades of service' }],
				sustainability: [{ product: 'Marmoleum', reason: 'Linseed-oil based, carbon-neutral, hypoallergenic' }, { product: 'Cork', reason: 'Natural thermal and acoustic insulation' }]
			},
			education: {
				durability: [{ product: 'VCT', reason: '50-year track record in schools across Ontario' }, { product: 'Rubber', reason: 'Handles gym and corridor abuse effortlessly' }],
				aesthetics: [{ product: 'LVT', reason: 'Modern looks that inspire learning environments' }, { product: 'Carpet Tile', reason: 'Color zoning for wayfinding and acoustics' }],
				budget: [{ product: 'VCT', reason: 'The lowest lifecycle cost for institutional use' }, { product: 'Sheet Vinyl', reason: 'Fast install during summer breaks' }],
				sustainability: [{ product: 'Marmoleum', reason: 'Natural, LEED-eligible, great for school IAQ' }, { product: 'Bamboo', reason: 'Rapid-renewable and harder than hardwood' }]
			},
			retail: {
				durability: [{ product: 'Ceramic', reason: 'Porcelain handles the heaviest foot traffic' }, { product: 'LVT', reason: 'Waterproof and scratch-resistant' }],
				aesthetics: [{ product: 'LVT', reason: 'Wood and stone visuals that elevate the brand' }, { product: 'Hardwood', reason: 'Premium presence for flagship stores' }],
				budget: [{ product: 'LVT', reason: 'Design-forward at a fraction of natural stone cost' }, { product: 'VCT', reason: 'Simple and effective for high-volume retail' }],
				sustainability: [{ product: 'Marmoleum', reason: 'Natural linoleum with bold color options' }, { product: 'Cork', reason: 'Comfortable underfoot, warm acoustics' }]
			},
			hospitality: {
				durability: [{ product: 'LVT', reason: 'Waterproof luxury vinyl handles spills and traffic' }, { product: 'Ceramic', reason: 'Porcelain in lobbies and pool areas' }],
				aesthetics: [{ product: 'Hardwood', reason: 'Classic warmth for lobbies and restaurants' }, { product: 'Broadloom', reason: 'Luxurious wall-to-wall for ballrooms and suites' }],
				budget: [{ product: 'Carpet Tile', reason: 'Replace high-wear zones without full replacement' }, { product: 'LVT', reason: 'Stone look at vinyl pricing' }],
				sustainability: [{ product: 'Cork', reason: 'Natural warmth with sound absorption' }, { product: 'Bamboo', reason: 'Rapid-renewable with a modern aesthetic' }]
			},
			government: {
				durability: [{ product: 'Carpet Tile', reason: 'GSA-rated, individually replaceable, decades of service' }, { product: 'Raised Access', reason: 'Full infrastructure flexibility for IT-heavy spaces' }],
				aesthetics: [{ product: 'LVT', reason: 'Modern government spaces deserve modern floors' }, { product: 'Hardwood', reason: 'Dignified presence for public-facing areas' }],
				budget: [{ product: 'VCT', reason: 'The institutional standard for lowest lifecycle cost' }, { product: 'Carpet Tile', reason: 'Modular replacement keeps budgets predictable' }],
				sustainability: [{ product: 'Marmoleum', reason: 'Meets LEED and WELL building standards' }, { product: 'Cork', reason: 'Natural material with thermal insulation' }]
			},
			industrial: {
				durability: [{ product: 'Epoxy', reason: 'Seamless resinous floor, chemical and impact resistant' }, { product: 'Rubber', reason: 'Absorbs impact and deadens sound' }],
				aesthetics: [{ product: 'Epoxy', reason: 'Metallic and decorative epoxy options available' }, { product: 'LVT', reason: 'Office areas within industrial facilities' }],
				budget: [{ product: 'Epoxy', reason: 'Pour once, use for decades' }, { product: 'VCT', reason: 'Economical for warehouse offices and break rooms' }],
				sustainability: [{ product: 'Rubber', reason: 'Recycled-content options available' }, { product: 'Marmoleum', reason: 'Natural linoleum for office spaces' }]
			},
			residential: {
				durability: [{ product: 'LVT', reason: 'Waterproof and pet-proof luxury vinyl' }, { product: 'Ceramic', reason: 'Porcelain for kitchens and baths' }],
				aesthetics: [{ product: 'Hardwood', reason: 'Timeless beauty, refinishable for generations' }, { product: 'LVT', reason: 'Wood looks without wood worries' }],
				budget: [{ product: 'LVT', reason: 'Best value for style and performance' }, { product: 'Carpet Tile', reason: 'DIY-friendly modular installation' }],
				sustainability: [{ product: 'Cork', reason: 'Natural, warm, and sound-absorbing' }, { product: 'Bamboo', reason: 'Harder than hardwood, rapid-renewable' }]
			}
		};
		return map[space]?.[priority] ?? [
			{ product: 'LVT', reason: 'Versatile luxury vinyl suits most commercial spaces' },
			{ product: 'Carpet Tile', reason: 'Modular, replaceable, acoustically effective' }
		];
	}

	/* ═══════════════ HERO LETTERS ═══════════════ */
	const heroLetters = 'YOUNG'.split('');

	/* ═══════════════ HELPERS ═══════════════ */
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

	function smoothScroll(href: string) {
		if (!browser) return;
		const el = document.querySelector(href);
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		mobileMenuOpen = false;
	}

	function resetAdvisor() {
		advisorStep = 0;
		advisorSpace = '';
		advisorPriority = '';
	}

	/* ═══════════════ LIFECYCLE ═══════════════ */
	onMount(() => {
		/* Font loading */
		const font = new FontFace('Square721', 'url(/young-carpets/square721.ttf)');
		font.load().then((loaded) => {
			document.fonts.add(loaded);
			fontLoaded = true;
			setTimeout(() => { heroVisible = true; }, 120);
		}).catch(() => {
			fontLoaded = true;
			setTimeout(() => { heroVisible = true; }, 120);
		});

		/* Scroll handlers */
		const onScroll = () => {
			navScrolled = window.scrollY > 80;
			const docH = document.documentElement.scrollHeight - window.innerHeight;
			scrollProgress = docH > 0 ? Math.min(window.scrollY / docH, 1) : 0;
		};
		window.addEventListener('scroll', onScroll, { passive: true });

		/* Intersection observers */
		const revealObserver = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					const id = (entry.target as HTMLElement).dataset.reveal;
					if (id) revealedSections = new Set([...revealedSections, id]);
				}
			}
		}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

		const statsObserver = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting && !statsTriggered) {
					statsTriggered = true;
					animateCount(250, 2200, (v) => { crewYearsCount = v; });
					animateCount(50000, 2800, (v) => { jobsCount = v; });
					animateCount(34, 1800, (v) => { yearsCount = v; });
				}
			}
		}, { threshold: 0.25 });

		const navObserver = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) activeSection = entry.target.id;
			}
		}, { threshold: 0.2, rootMargin: '-80px 0px -40% 0px' });

		/* Process step observer */
		const processObserver = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					const idx = parseInt((entry.target as HTMLElement).dataset.processIdx ?? '-1');
					if (idx >= 0) activeProcess = idx;
				}
			}
		}, { threshold: 0.5 });

		requestAnimationFrame(() => {
			document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));
			const statsEl = document.getElementById('stats-row');
			if (statsEl) statsObserver.observe(statsEl);
			document.querySelectorAll('section[id]').forEach((el) => navObserver.observe(el));
			document.querySelectorAll('[data-process-idx]').forEach((el) => processObserver.observe(el));
		});

		return () => {
			window.removeEventListener('scroll', onScroll);
			revealObserver.disconnect();
			statsObserver.disconnect();
			navObserver.disconnect();
			processObserver.disconnect();
		};
	});
</script>

<svelte:head>
	<title>Young Carpets — Ottawa's Commercial Flooring Experts Since 1991</title>
	<meta name="description" content="Ottawa's premier commercial flooring installer. 34 years, 50,000+ installations, 20 product families, 12 national suppliers. Carpet tile, LVT, hardwood, sheet vinyl, and more." />
</svelte:head>

<div class="yc-page v4-page">

	<!-- ═══════════════ SCROLL PROGRESS BAR ═══════════════ -->
	<div class="v4-progress" style="transform: scaleX({scrollProgress})"></div>

	<!-- ═══════════════ FLOATING NAV ═══════════════ -->
	<nav class="v4-nav" class:scrolled={navScrolled}>
		<div class="v4-nav-inner">
			<a href="/young-carpets" class="v4-nav-brand">YOUNG</a>

			<div class="v4-nav-links desktop-only">
				{#each navLinks as link}
					<button
						class="v4-nav-link"
						class:active={activeSection === link.href.slice(1)}
						onclick={() => smoothScroll(link.href)}
					>
						{link.label}
					</button>
				{/each}
			</div>

			<div class="v4-nav-actions">
				<ThemeToggle />
				<button
					class="v4-hamburger mobile-only"
					onclick={() => mobileMenuOpen = !mobileMenuOpen}
					aria-label="Toggle menu"
					aria-expanded={mobileMenuOpen}
				>
					<span class="v4-hamburger-bar" class:open={mobileMenuOpen}></span>
					<span class="v4-hamburger-bar" class:open={mobileMenuOpen}></span>
					<span class="v4-hamburger-bar" class:open={mobileMenuOpen}></span>
				</button>
			</div>
		</div>

		<!-- Mobile menu -->
		{#if mobileMenuOpen}
			<div class="v4-mobile-menu">
				{#each navLinks as link}
					<button
						class="v4-mobile-link"
						onclick={() => smoothScroll(link.href)}
					>
						{link.label}
					</button>
				{/each}
			</div>
		{/if}
	</nav>

	<!-- ═══════════════ HERO ═══════════════ -->
	<header id="hero" class="v4-hero">
		<!-- Architectural grid background -->
		<div class="v4-hero-grid" aria-hidden="true">
			{#each Array(20) as _, i}
				<div class="v4-grid-line v4-grid-h" style="top: {(i + 1) * 5}%"></div>
			{/each}
			{#each Array(12) as _, i}
				<div class="v4-grid-line v4-grid-v" style="left: {(i + 1) * (100 / 13)}%"></div>
			{/each}
		</div>

		<!-- Floating category words -->
		<div class="v4-hero-floats" class:visible={heroVisible} aria-hidden="true">
			<span class="v4-float" style="--fx: 12%; --fy: 22%; --fd: 0.2s">carpet tile</span>
			<span class="v4-float" style="--fx: 72%; --fy: 18%; --fd: 0.4s">hardwood</span>
			<span class="v4-float" style="--fx: 85%; --fy: 55%; --fd: 0.6s">sheet vinyl</span>
			<span class="v4-float" style="--fx: 8%; --fy: 65%; --fd: 0.8s">epoxy</span>
			<span class="v4-float" style="--fx: 55%; --fy: 75%; --fd: 1.0s">marmoleum</span>
			<span class="v4-float" style="--fx: 30%; --fy: 85%; --fd: 1.2s">rubber</span>
			<span class="v4-float" style="--fx: 78%; --fy: 82%; --fd: 1.4s">LVT</span>
			<span class="v4-float" style="--fx: 20%; --fy: 45%; --fd: 0.3s">ceramic</span>
		</div>

		<!-- Maple leaf -->
		<div class="v4-hero-leaf" class:visible={heroVisible}>
			<svg viewBox="-2015 -2000 4030 4030" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<path d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z" fill="currentColor"/>
			</svg>
		</div>

		<div class="v4-hero-content">
			<!-- Wordmark -->
			<div class="v4-hero-wordmark" class:visible={heroVisible}>
				{#each heroLetters as letter, i}
					<span class="v4-hero-letter" style="--delay: {i * 0.08}s">{letter}</span>
				{/each}
			</div>

			<!-- Badge -->
			<div class="v4-hero-badge" class:visible={heroVisible}>
				<svg class="v4-badge-leaf" viewBox="-2015 -2000 4030 4030" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
					<path d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z" fill="currentColor"/>
				</svg>
				<span class="v4-badge-text">CARPETS INC</span>
			</div>

			<!-- Tagline -->
			<p class="v4-hero-tagline" class:visible={heroVisible}>
				Ottawa's commercial flooring experts since 1991
			</p>

			<!-- CTA -->
			<div class="v4-hero-ctas" class:visible={heroVisible}>
				<button class="v4-btn-primary" onclick={() => smoothScroll('#contact')}>
					Get a Quote
				</button>
				<button class="v4-btn-ghost" onclick={() => smoothScroll('#products')}>
					Explore Products
				</button>
			</div>
		</div>

		<!-- Scroll indicator -->
		<div class="v4-scroll-hint" class:visible={heroVisible}>
			<div class="v4-scroll-line"></div>
		</div>
	</header>

	<!-- ═══════════════ ABOUT / STATS ═══════════════ -->
	<section id="about" class="v4-section" data-reveal="about">
		<div class="v4-container" class:revealed={revealedSections.has('about')}>
			<span class="v4-eyebrow">Since 1991</span>
			<h2 class="v4-title">We install floors that<br/>outlast the buildings.</h2>
			<p class="v4-body v4-body-wide">
				Young Carpets Inc. has been Ottawa's go-to commercial flooring contractor for over three decades.
				From hospital corridors to government data centres, hotel ballrooms to university lecture halls —
				we've installed more than 50,000 projects across the National Capital Region. Our own crews,
				our own standards, our own reputation on the line every time.
			</p>

			<div id="stats-row" class="v4-stats">
				<div class="v4-stat">
					<span class="v4-stat-num">{yearsCount}</span>
					<span class="v4-stat-label">Years in Ottawa</span>
				</div>
				<div class="v4-stat">
					<span class="v4-stat-num">{crewYearsCount}<span class="v4-stat-suffix">+</span></span>
					<span class="v4-stat-label">Combined crew years</span>
				</div>
				<div class="v4-stat">
					<span class="v4-stat-num">{jobsCount.toLocaleString()}<span class="v4-stat-suffix">+</span></span>
					<span class="v4-stat-label">Installations completed</span>
				</div>
			</div>
		</div>
	</section>

	<!-- ═══════════════ PRODUCTS ═══════════════ -->
	<section id="products" class="v4-section v4-section-products" data-reveal="products">
		<div class="v4-container" class:revealed={revealedSections.has('products')}>
			<span class="v4-eyebrow">Product Families</span>
			<h2 class="v4-title">20 products. One source.</h2>
			<p class="v4-body">Every commercial flooring product under one roof — specified, sourced, and installed by our own crews.</p>

			<!-- Category filter -->
			<div class="v4-filter-bar">
				{#each categories as cat}
					<button
						class="v4-filter-btn"
						class:active={activeCategory === cat.id}
						onclick={() => activeCategory = cat.id}
					>
						{cat.name}
					</button>
				{/each}
			</div>

			<!-- Product grid -->
			<div class="v4-product-grid">
				{#each filteredProducts as product (product.name)}
					<div class="v4-product-card">
						<div class="v4-product-icon">{product.icon}</div>
						<h3 class="v4-product-name">{product.name}</h3>
						<p class="v4-product-desc">{product.desc}</p>
						<div class="v4-product-tags">
							{#each product.tags as tag}
								<span class="v4-tag">{tag}</span>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════════════ SERVICES ═══════════════ -->
	<section id="services" class="v4-section" data-reveal="services">
		<div class="v4-container" class:revealed={revealedSections.has('services')}>
			<span class="v4-eyebrow">What We Do</span>
			<h2 class="v4-title">Full-spectrum flooring services</h2>

			<div class="v4-services-grid">
				{#each services as svc}
					<div class="v4-service-card">
						<div class="v4-service-stat">
							<span class="v4-service-num">{svc.stat}</span>
							<span class="v4-service-stat-label">{svc.statLabel}</span>
						</div>
						<h3 class="v4-service-title">{svc.title}</h3>
						<p class="v4-service-desc">{svc.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════════════ PROCESS ═══════════════ -->
	<section id="process" class="v4-section v4-section-process" data-reveal="process">
		<div class="v4-container" class:revealed={revealedSections.has('process')}>
			<span class="v4-eyebrow">How We Work</span>
			<h2 class="v4-title">Six steps to a perfect floor</h2>
			<p class="v4-body">Every project follows the same proven sequence — from first site visit to ongoing maintenance.</p>

			<div class="v4-process-timeline">
				<div class="v4-process-line">
					<div class="v4-process-line-fill" style="height: {activeProcess >= 0 ? ((activeProcess + 1) / processSteps.length) * 100 : 0}%"></div>
				</div>

				{#each processSteps as step, i}
					<div
						class="v4-process-step"
						class:active={i <= activeProcess}
						data-process-idx={i}
					>
						<div class="v4-process-dot">
							<span class="v4-process-num">{step.num}</span>
						</div>
						<div class="v4-process-content">
							<h3 class="v4-process-title">{step.title}</h3>
							<p class="v4-process-desc">{step.desc}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════════════ PORTFOLIO ═══════════════ -->
	<section id="portfolio" class="v4-section" data-reveal="portfolio">
		<div class="v4-container" class:revealed={revealedSections.has('portfolio')}>
			<span class="v4-eyebrow">Our Work</span>
			<h2 class="v4-title">Projects that speak for themselves</h2>

			<div class="v4-portfolio-nav">
				{#each portfolio as project, i}
					<button
						class="v4-portfolio-tab"
						class:active={activeProject === i}
						onclick={() => activeProject = i}
					>
						<span class="v4-portfolio-tab-type">{project.type}</span>
						<span class="v4-portfolio-tab-name">{project.name}</span>
					</button>
				{/each}
			</div>

			<div class="v4-portfolio-detail">
				{#each portfolio as project, i}
					{#if activeProject === i}
						<div class="v4-portfolio-card">
							<div class="v4-portfolio-header">
								<div class="v4-portfolio-meta">
									<span class="v4-portfolio-type-badge">{project.type}</span>
									<span class="v4-portfolio-year">{project.year}</span>
								</div>
								<h3 class="v4-portfolio-name">{project.name}</h3>
							</div>
							<div class="v4-portfolio-body">
								<div class="v4-portfolio-stats">
									<div class="v4-portfolio-stat">
										<span class="v4-portfolio-stat-label">Area</span>
										<span class="v4-portfolio-stat-val">{project.area}</span>
									</div>
									<div class="v4-portfolio-stat">
										<span class="v4-portfolio-stat-label">Products</span>
										<span class="v4-portfolio-stat-val">{project.products}</span>
									</div>
								</div>
								<p class="v4-portfolio-desc">{project.desc}</p>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════════════ WHY US ═══════════════ -->
	<section id="why-us" class="v4-section v4-section-why" data-reveal="why-us">
		<div class="v4-container" class:revealed={revealedSections.has('why-us')}>
			<span class="v4-eyebrow">The Difference</span>
			<h2 class="v4-title">Why Young Carpets</h2>

			<div class="v4-why-grid">
				{#each whyUs as item}
					<div class="v4-why-card">
						<div class="v4-why-num">
							{item.num}<span class="v4-why-suffix">{item.suffix}</span>
						</div>
						<h3 class="v4-why-title">{item.title}</h3>
						<p class="v4-why-desc">{item.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════════════ FLOORING ADVISOR ═══════════════ -->
	<section id="advisor" class="v4-section v4-section-advisor" data-reveal="advisor">
		<div class="v4-container" class:revealed={revealedSections.has('advisor')}>
			<span class="v4-eyebrow">Interactive</span>
			<h2 class="v4-title">Flooring Advisor</h2>
			<p class="v4-body">Answer two questions and we'll recommend the right products for your space.</p>

			<div class="v4-advisor-box">
				{#if advisorStep === 0}
					<!-- Step 1: Space type -->
					<div class="v4-advisor-step">
						<h3 class="v4-advisor-question">What type of space?</h3>
						<div class="v4-advisor-options">
							{#each spaceTypes as space}
								<button
									class="v4-advisor-option"
									onclick={() => { advisorSpace = space.id; advisorStep = 1; }}
								>
									<span class="v4-advisor-icon">{space.icon}</span>
									<span class="v4-advisor-label">{space.label}</span>
								</button>
							{/each}
						</div>
					</div>
				{:else if advisorStep === 1}
					<!-- Step 2: Priority -->
					<div class="v4-advisor-step">
						<div class="v4-advisor-breadcrumb">
							<button class="v4-advisor-back" onclick={() => { advisorStep = 0; advisorPriority = ''; }}>
								← Back
							</button>
							<span class="v4-advisor-selected">{spaceTypes.find(s => s.id === advisorSpace)?.label}</span>
						</div>
						<h3 class="v4-advisor-question">What's your top priority?</h3>
						<div class="v4-advisor-options v4-advisor-priorities">
							{#each priorities as pri}
								<button
									class="v4-advisor-option v4-advisor-priority-btn"
									onclick={() => { advisorPriority = pri.id; advisorStep = 2; }}
								>
									<span class="v4-advisor-icon">{pri.icon}</span>
									<span class="v4-advisor-label">{pri.label}</span>
									<span class="v4-advisor-sublabel">{pri.desc}</span>
								</button>
							{/each}
						</div>
					</div>
				{:else}
					<!-- Step 3: Results -->
					<div class="v4-advisor-step v4-advisor-results">
						<div class="v4-advisor-breadcrumb">
							<button class="v4-advisor-back" onclick={() => { advisorStep = 1; advisorPriority = ''; }}>
								← Back
							</button>
							<span class="v4-advisor-selected">
								{spaceTypes.find(s => s.id === advisorSpace)?.label} → {priorities.find(p => p.id === advisorPriority)?.label}
							</span>
						</div>
						<h3 class="v4-advisor-question">We recommend:</h3>
						<div class="v4-advisor-recs">
							{#each advisorResults as rec, i}
								<div class="v4-advisor-rec">
									<span class="v4-advisor-rec-num">{i + 1}</span>
									<div class="v4-advisor-rec-body">
										<h4 class="v4-advisor-rec-product">{rec.product}</h4>
										<p class="v4-advisor-rec-reason">{rec.reason}</p>
									</div>
								</div>
							{/each}
						</div>
						<button class="v4-btn-ghost v4-advisor-restart" onclick={resetAdvisor}>
							Start Over
						</button>
					</div>
				{/if}

				<!-- Step indicator -->
				<div class="v4-advisor-dots">
					{#each [0, 1, 2] as step}
						<div class="v4-advisor-dot" class:active={advisorStep >= step}></div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- ═══════════════ SUPPLIERS ═══════════════ -->
	<section class="v4-section v4-section-suppliers" data-reveal="suppliers">
		<div class="v4-container" class:revealed={revealedSections.has('suppliers')}>
			<span class="v4-eyebrow">Authorized Dealer</span>
			<h2 class="v4-title-sm">Trusted by every major manufacturer</h2>

			<div class="v4-marquee-wrapper">
				<div class="v4-marquee">
					{#each [...suppliers, ...suppliers] as name}
						<span class="v4-marquee-item">{name}</span>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- ═══════════════ CONTACT ═══════════════ -->
	<section id="contact" class="v4-section v4-section-contact" data-reveal="contact">
		<div class="v4-container" class:revealed={revealedSections.has('contact')}>
			<span class="v4-eyebrow">Get In Touch</span>
			<h2 class="v4-title">Let's talk flooring</h2>

			<div class="v4-contact-grid">
				<!-- Sales team -->
				<div class="v4-contact-team">
					<h3 class="v4-contact-heading">Sales Team</h3>
					<div class="v4-team-cards">
						{#each salesTeam as person}
							<div class="v4-team-card">
								<span class="v4-team-name">{person.name}</span>
								<a href="tel:{person.phone}" class="v4-team-phone">{person.phone}</a>
								<a href="mailto:{person.email}" class="v4-team-email">{person.email}</a>
							</div>
						{/each}
					</div>
				</div>

				<!-- Office info -->
				<div class="v4-contact-office">
					<h3 class="v4-contact-heading">Office</h3>
					<div class="v4-office-info">
						<div class="v4-office-row">
							<span class="v4-office-label">Main</span>
							<a href="tel:613-744-2744" class="v4-office-val">613-744-2744</a>
						</div>
						<div class="v4-office-row">
							<span class="v4-office-label">Fax</span>
							<span class="v4-office-val">613-744-2995</span>
						</div>
						<div class="v4-office-row">
							<span class="v4-office-label">Email</span>
							<a href="mailto:info@youngcarpets.com" class="v4-office-val">info@youngcarpets.com</a>
						</div>
						<div class="v4-office-row">
							<span class="v4-office-label">Accounting</span>
							<a href="mailto:accounting@youngcarpets.com" class="v4-office-val">accounting@youngcarpets.com</a>
						</div>
						<div class="v4-office-row">
							<span class="v4-office-label">AP</span>
							<a href="mailto:ap@youngcarpets.com" class="v4-office-val">ap@youngcarpets.com</a>
						</div>
					</div>

					<div class="v4-address">
						<span class="v4-office-label">Address</span>
						<address>1228 Old Innes Rd, Unit 316<br/>Ottawa, ON K1B 3V3</address>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ═══════════════ MAP ═══════════════ -->
	<section class="v4-section v4-section-map" data-reveal="map">
		<div class="v4-map-container" class:revealed={revealedSections.has('map')}>
			<iframe
				src="https://www.google.com/maps?q=1228+Old+Innes+Rd+Unit+316+Ottawa+ON+K1B+3V3&output=embed&z=15"
				title="Young Carpets location"
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
				class="v4-map-iframe"
			></iframe>
		</div>
	</section>

	<!-- ═══════════════ FOOTER ═══════════════ -->
	<footer class="v4-footer">
		<div class="v4-container">
			<div class="v4-footer-grid">
				<div class="v4-footer-brand">
					<span class="v4-footer-wordmark">YOUNG</span>
					<span class="v4-footer-sub">CARPETS INC</span>
					<p class="v4-footer-tagline">Ottawa's commercial flooring experts since 1991.</p>
				</div>

				<div class="v4-footer-col">
					<h4 class="v4-footer-heading">Contact</h4>
					<p>1228 Old Innes Rd, Unit 316</p>
					<p>Ottawa, ON K1B 3V3</p>
					<p><a href="tel:613-744-2744">613-744-2744</a></p>
					<p><a href="mailto:info@youngcarpets.com">info@youngcarpets.com</a></p>
				</div>

				<div class="v4-footer-col">
					<h4 class="v4-footer-heading">Hours</h4>
					<p>Monday – Friday</p>
					<p>7:00 AM – 4:00 PM</p>
					<p class="v4-footer-muted">Closed weekends & holidays</p>
				</div>

				<div class="v4-footer-col">
					<h4 class="v4-footer-heading">Quick Links</h4>
					<button class="v4-footer-link" onclick={() => smoothScroll('#products')}>Products</button>
					<button class="v4-footer-link" onclick={() => smoothScroll('#process')}>Process</button>
					<button class="v4-footer-link" onclick={() => smoothScroll('#portfolio')}>Portfolio</button>
					<a href="/" class="v4-footer-link">Staff Portal</a>
				</div>
			</div>

			<div class="v4-footer-bottom">
				<span>&copy; 2026 Young Carpets Inc. All rights reserved.</span>
				<a href="/" class="v4-footer-portal">Portal ↗</a>
			</div>
		</div>
	</footer>

	<DevColorPicker />
</div>

<style>
	/* ═══════════════ RESET & BASE ═══════════════ */
	.v4-page {
		background: var(--yc-bg, #0b0b0d);
		color: var(--yc-griege-text, #c2b39a);
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
		font-weight: 300;
		font-size: 0.9rem;
		line-height: 1.6;
		overflow-x: hidden;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* ═══════════════ UTILITY ═══════════════ */
	.v4-container {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 1.25rem;
	}

	.v4-eyebrow {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-weight: 700;
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--yc-maple-gold, #ffe27a);
		display: block;
		margin-bottom: 1rem;
	}

	.v4-title {
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
		font-weight: 200;
		font-size: 2rem;
		line-height: 1.15;
		color: var(--yc-text, #e6e6e8);
		margin: 0 0 1.25rem;
	}

	.v4-title-sm {
		font-weight: 200;
		font-size: 1.5rem;
		color: var(--yc-text, #e6e6e8);
		margin: 0 0 1.5rem;
		text-align: center;
	}

	.v4-body {
		font-weight: 300;
		font-size: 0.9rem;
		line-height: 1.65;
		color: var(--yc-griege-text, #c2b39a);
		max-width: 600px;
		margin-bottom: 2rem;
	}

	.v4-body-wide {
		max-width: 720px;
	}

	.v4-section {
		padding: 5rem 0;
		position: relative;
	}

	/* Reveal animation */
	.v4-container {
		opacity: 0;
		transform: translateY(30px);
		transition: opacity 0.8s cubic-bezier(0.2, 0.9, 0.25, 1.05),
					transform 0.8s cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	.v4-container.revealed {
		opacity: 1;
		transform: translateY(0);
	}

	.desktop-only { display: none; }
	.mobile-only { display: flex; }

	@media (min-width: 600px) {
		.v4-title { font-size: 2.5rem; }
	}

	@media (min-width: 900px) {
		.desktop-only { display: flex; }
		.mobile-only { display: none; }
		.v4-section { padding: 7rem 0; }
	}

	/* ═══════════════ SCROLL PROGRESS ═══════════════ */
	.v4-progress {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--yc-maple-gold, #ffe27a);
		transform-origin: left;
		z-index: 1001;
		pointer-events: none;
	}

	/* ═══════════════ NAV ═══════════════ */
	.v4-nav {
		position: fixed;
		top: 12px;
		left: 12px;
		right: 12px;
		z-index: 1000;
		background: var(--yc-ink-45);
		backdrop-filter: blur(16px) saturate(1.4);
		-webkit-backdrop-filter: blur(16px) saturate(1.4);
		border: 1px solid var(--yc-griege-20);
		border-radius: 16px;
		transition: all 0.35s cubic-bezier(0.2, 0.9, 0.25, 1.05);
		box-shadow: 0 4px 24px -4px var(--yc-shadow-25);
	}

	.v4-nav.scrolled {
		top: 8px;
		background: var(--yc-ink-55);
		box-shadow: 0 8px 32px -4px var(--yc-shadow-35);
	}

	.v4-nav-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.6rem 1rem;
		gap: 1rem;
	}

	.v4-nav-brand {
		font-family: 'Square721', system-ui, sans-serif;
		font-size: 1.1rem;
		letter-spacing: 0.08em;
		color: var(--yc-text, #e6e6e8);
		text-decoration: none;
		font-weight: 400;
	}

	.v4-nav-links {
		display: flex;
		gap: 0.25rem;
		align-items: center;
	}

	.v4-nav-link {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--yc-griege-text, #c2b39a);
		background: transparent;
		border: 1px solid transparent;
		border-radius: 8px;
		padding: 0.4rem 0.65rem;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 44px;
		display: flex;
		align-items: center;
	}

	.v4-nav-link:hover {
		color: var(--yc-text, #e6e6e8);
		border-color: var(--yc-griege-20);
	}

	.v4-nav-link.active {
		color: var(--yc-maple-gold, #ffe27a);
		background: var(--yc-maple-gold-08);
		border-color: var(--yc-maple-gold-35);
	}

	.v4-nav-actions {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	/* Hamburger */
	.v4-hamburger {
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

	.v4-hamburger-bar {
		width: 20px;
		height: 2px;
		background: var(--yc-griege-text, #c2b39a);
		border-radius: 2px;
		transition: all 0.3s ease;
	}

	.v4-hamburger-bar.open:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
	.v4-hamburger-bar.open:nth-child(2) { opacity: 0; }
	.v4-hamburger-bar.open:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

	.v4-mobile-menu {
		display: flex;
		flex-direction: column;
		padding: 0 1rem 1rem;
		gap: 0.25rem;
	}

	.v4-mobile-link {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--yc-griege-text);
		background: transparent;
		border: none;
		padding: 0.75rem 0.5rem;
		text-align: left;
		cursor: pointer;
		border-radius: 8px;
		min-height: 44px;
	}

	.v4-mobile-link:hover {
		color: var(--yc-maple-gold);
		background: var(--yc-maple-gold-08);
	}

	/* ═══════════════ HERO ═══════════════ */
	.v4-hero {
		position: relative;
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		padding: 6rem 1.25rem 3rem;
	}

	/* Architectural grid */
	.v4-hero-grid {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.v4-grid-line {
		position: absolute;
		background: var(--yc-griege-06);
	}

	.v4-grid-h {
		left: 0;
		right: 0;
		height: 1px;
	}

	.v4-grid-v {
		top: 0;
		bottom: 0;
		width: 1px;
	}

	/* Floating words */
	.v4-hero-floats {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.v4-float {
		position: absolute;
		left: var(--fx);
		top: var(--fy);
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--yc-griege-20);
		opacity: 0;
		transform: translateY(10px);
		transition: opacity 1s ease var(--fd), transform 1s ease var(--fd);
	}

	.v4-hero-floats.visible .v4-float {
		opacity: 1;
		transform: translateY(0);
		animation: v4-drift 12s ease-in-out infinite alternate;
		animation-delay: var(--fd);
	}

	@keyframes v4-drift {
		0% { transform: translateY(0); }
		100% { transform: translateY(-8px); }
	}

	/* Hero maple leaf */
	.v4-hero-leaf {
		position: absolute;
		width: 55vw;
		max-width: 480px;
		aspect-ratio: 1;
		color: var(--yc-maple-red, #C8102E);
		opacity: 0;
		transform: scale(0.8);
		transition: opacity 1.2s ease, transform 1.2s cubic-bezier(0.2, 0.9, 0.25, 1.05);
		pointer-events: none;
		filter: blur(1px);
	}

	.v4-hero-leaf.visible {
		opacity: 0.06;
		transform: scale(1);
	}

	.v4-hero-leaf svg {
		width: 100%;
		height: 100%;
	}

	/* Hero content */
	.v4-hero-content {
		position: relative;
		z-index: 2;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	/* Wordmark */
	.v4-hero-wordmark {
		display: flex;
		gap: 0.04em;
		justify-content: center;
		overflow: hidden;
	}

	.v4-hero-letter {
		font-family: 'Square721', system-ui, sans-serif;
		font-size: 4rem;
		line-height: 1;
		color: var(--yc-text, #e6e6e8);
		opacity: 0;
		transform: translateY(100%);
		transition: opacity 0.6s cubic-bezier(0.2, 0.9, 0.25, 1.05),
					transform 0.6s cubic-bezier(0.2, 0.9, 0.25, 1.05);
		transition-delay: var(--delay);
	}

	.v4-hero-wordmark.visible .v4-hero-letter {
		opacity: 1;
		transform: translateY(0);
	}

	@media (min-width: 600px) {
		.v4-hero-letter { font-size: 5.5rem; }
	}

	/* Badge */
	.v4-hero-badge {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		opacity: 0;
		transform: translateY(16px);
		transition: opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s;
	}

	.v4-hero-badge.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.v4-badge-leaf {
		width: 18px;
		height: 18px;
		color: var(--yc-maple-red, #C8102E);
	}

	.v4-badge-text {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.2em;
		color: var(--yc-griege-text);
	}

	/* Tagline */
	.v4-hero-tagline {
		font-weight: 200;
		font-size: 1rem;
		color: var(--yc-griege-text);
		opacity: 0;
		transform: translateY(16px);
		transition: opacity 0.8s ease 0.7s, transform 0.8s ease 0.7s;
		max-width: 360px;
	}

	.v4-hero-tagline.visible {
		opacity: 0.8;
		transform: translateY(0);
	}

	/* CTAs */
	.v4-hero-ctas {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: center;
		opacity: 0;
		transform: translateY(16px);
		transition: opacity 0.8s ease 0.9s, transform 0.8s ease 0.9s;
	}

	.v4-hero-ctas.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.v4-btn-primary {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 0.75rem 1.75rem;
		min-height: 44px;
		border: none;
		border-radius: 10px;
		background: var(--yc-maple-gold, #ffe27a);
		color: var(--yc-ink, #080706);
		cursor: pointer;
		transition: all 0.25s ease;
	}

	.v4-btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 20px -2px var(--yc-maple-gold-45);
	}

	.v4-btn-ghost {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 0.75rem 1.75rem;
		min-height: 44px;
		border: 1px solid var(--yc-griege-25);
		border-radius: 10px;
		background: transparent;
		color: var(--yc-griege-text);
		cursor: pointer;
		transition: all 0.25s ease;
	}

	.v4-btn-ghost:hover {
		border-color: var(--yc-griege-50);
		color: var(--yc-text, #e6e6e8);
		transform: translateY(-2px);
	}

	/* Scroll hint */
	.v4-scroll-hint {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		opacity: 0;
		transition: opacity 1s ease 1.5s;
	}

	.v4-scroll-hint.visible {
		opacity: 0.4;
	}

	.v4-scroll-line {
		width: 1px;
		height: 48px;
		background: linear-gradient(to bottom, var(--yc-griege-text), transparent);
		animation: v4-scroll-pulse 2s ease-in-out infinite;
	}

	@keyframes v4-scroll-pulse {
		0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
		50% { opacity: 1; transform: scaleY(1); }
	}

	/* ═══════════════ STATS ═══════════════ */
	.v4-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		margin-top: 3rem;
		max-width: 600px;
	}

	.v4-stat {
		text-align: center;
	}

	.v4-stat-num {
		display: block;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
		font-weight: 200;
		font-size: 2.2rem;
		color: var(--yc-text, #e6e6e8);
		line-height: 1.1;
	}

	.v4-stat-suffix {
		font-size: 0.6em;
		opacity: 0.6;
	}

	.v4-stat-label {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--yc-griege-text);
		opacity: 0.6;
		margin-top: 0.25rem;
		display: block;
	}

	@media (min-width: 600px) {
		.v4-stat-num { font-size: 3rem; }
	}

	/* ═══════════════ PRODUCTS ═══════════════ */
	.v4-section-products {
		background: linear-gradient(180deg, transparent 0%, var(--yc-sheen-02) 50%, transparent 100%);
	}

	.v4-filter-bar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-bottom: 2rem;
	}

	.v4-filter-btn {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 0.5rem 0.85rem;
		min-height: 44px;
		border: 1px solid var(--yc-griege-18);
		border-radius: 10px;
		background: transparent;
		color: var(--yc-griege-text);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.v4-filter-btn:hover {
		border-color: var(--yc-griege-35);
		color: var(--yc-text);
	}

	.v4-filter-btn.active {
		background: var(--yc-maple-gold-10);
		border-color: var(--yc-maple-gold-45);
		color: var(--yc-maple-gold);
	}

	.v4-product-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	@media (min-width: 600px) {
		.v4-product-grid { grid-template-columns: repeat(2, 1fr); }
	}

	@media (min-width: 900px) {
		.v4-product-grid { grid-template-columns: repeat(3, 1fr); }
	}

	.v4-product-card {
		background: var(--yc-ink-45);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--yc-griege-20);
		border-radius: 18px;
		padding: 1.25rem;
		box-shadow: inset 0 var(--yc-edge-y, 1px) 0 var(--yc-shimmer-10),
					0 8px 24px -4px var(--yc-shadow-30);
		transition: all 0.35s cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	.v4-product-card:hover {
		border-color: var(--yc-griege-35);
		transform: translateY(-4px);
		box-shadow: inset 0 var(--yc-edge-y, 1px) 0 var(--yc-shimmer-14),
					0 12px 32px -4px var(--yc-shadow-42);
	}

	.v4-product-icon {
		font-size: 1.5rem;
		margin-bottom: 0.75rem;
		opacity: 0.5;
	}

	.v4-product-name {
		font-weight: 500;
		font-size: 0.9rem;
		color: var(--yc-text);
		margin: 0 0 0.5rem;
	}

	.v4-product-desc {
		font-size: 0.78rem;
		line-height: 1.55;
		color: var(--yc-griege-text);
		opacity: 0.75;
		margin: 0 0 0.75rem;
	}

	.v4-product-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}

	.v4-tag {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.55rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 0.2rem 0.5rem;
		border: 1px solid var(--yc-griege-18);
		border-radius: 6px;
		color: var(--yc-griege-text);
		opacity: 0.6;
	}

	/* ═══════════════ SERVICES ═══════════════ */
	.v4-services-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	@media (min-width: 600px) {
		.v4-services-grid { grid-template-columns: repeat(2, 1fr); }
	}

	.v4-service-card {
		background: var(--yc-ink-45);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--yc-griege-20);
		border-radius: 18px;
		padding: 1.5rem;
		box-shadow: inset 0 var(--yc-edge-y, 1px) 0 var(--yc-shimmer-10),
					0 8px 24px -4px var(--yc-shadow-30);
		transition: all 0.35s cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	.v4-service-card:hover {
		border-color: var(--yc-griege-35);
		transform: translateY(-3px);
	}

	.v4-service-stat {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		margin-bottom: 1rem;
	}

	.v4-service-num {
		font-weight: 200;
		font-size: 2rem;
		color: var(--yc-maple-gold, #ffe27a);
		line-height: 1;
	}

	.v4-service-stat-label {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--yc-griege-text);
		opacity: 0.5;
	}

	.v4-service-title {
		font-weight: 500;
		font-size: 0.95rem;
		color: var(--yc-text);
		margin: 0 0 0.5rem;
	}

	.v4-service-desc {
		font-size: 0.78rem;
		line-height: 1.55;
		color: var(--yc-griege-text);
		opacity: 0.75;
		margin: 0;
	}

	/* ═══════════════ PROCESS ═══════════════ */
	.v4-section-process {
		background: linear-gradient(180deg, transparent 0%, var(--yc-sheen-02) 50%, transparent 100%);
	}

	.v4-process-timeline {
		position: relative;
		padding-left: 2.5rem;
		margin-top: 2.5rem;
	}

	.v4-process-line {
		position: absolute;
		left: 11px;
		top: 0;
		bottom: 0;
		width: 2px;
		background: var(--yc-griege-18);
		border-radius: 1px;
	}

	.v4-process-line-fill {
		width: 100%;
		background: var(--yc-maple-gold, #ffe27a);
		border-radius: 1px;
		transition: height 0.8s cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	.v4-process-step {
		position: relative;
		padding: 1.5rem 0;
		opacity: 0.4;
		transition: opacity 0.5s ease;
	}

	.v4-process-step.active {
		opacity: 1;
	}

	.v4-process-dot {
		position: absolute;
		left: -2.5rem;
		top: 1.5rem;
		width: 24px;
		height: 24px;
		background: var(--yc-bg, #0b0b0d);
		border: 2px solid var(--yc-griege-25);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.4s ease;
	}

	.v4-process-step.active .v4-process-dot {
		border-color: var(--yc-maple-gold, #ffe27a);
		background: var(--yc-maple-gold-10);
		box-shadow: 0 0 12px -2px var(--yc-maple-gold-45);
	}

	.v4-process-num {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.5rem;
		font-weight: 700;
		color: var(--yc-griege-text);
	}

	.v4-process-step.active .v4-process-num {
		color: var(--yc-maple-gold);
	}

	.v4-process-title {
		font-weight: 500;
		font-size: 1rem;
		color: var(--yc-text);
		margin: 0 0 0.4rem;
	}

	.v4-process-desc {
		font-size: 0.78rem;
		line-height: 1.55;
		color: var(--yc-griege-text);
		opacity: 0.75;
		margin: 0;
		max-width: 520px;
	}

	/* ═══════════════ PORTFOLIO ═══════════════ */
	.v4-portfolio-nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 1.5rem 0 2rem;
	}

	.v4-portfolio-tab {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 0.6rem 1rem;
		min-height: 44px;
		border: 1px solid var(--yc-griege-18);
		border-radius: 12px;
		background: transparent;
		cursor: pointer;
		transition: all 0.25s ease;
	}

	.v4-portfolio-tab:hover {
		border-color: var(--yc-griege-35);
	}

	.v4-portfolio-tab.active {
		background: var(--yc-maple-gold-10);
		border-color: var(--yc-maple-gold-45);
	}

	.v4-portfolio-tab-type {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.5rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--yc-maple-gold);
		opacity: 0.6;
	}

	.v4-portfolio-tab.active .v4-portfolio-tab-type {
		opacity: 1;
	}

	.v4-portfolio-tab-name {
		font-size: 0.72rem;
		font-weight: 500;
		color: var(--yc-text);
		margin-top: 0.15rem;
	}

	.v4-portfolio-card {
		background: var(--yc-ink-45);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--yc-griege-20);
		border-radius: 18px;
		overflow: hidden;
		box-shadow: inset 0 var(--yc-edge-y, 1px) 0 var(--yc-shimmer-10),
					0 8px 24px -4px var(--yc-shadow-30);
	}

	.v4-portfolio-header {
		padding: 1.5rem 1.5rem 1rem;
		border-bottom: 1px solid var(--yc-griege-08);
	}

	.v4-portfolio-meta {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.v4-portfolio-type-badge {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.55rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 0.2rem 0.6rem;
		border-radius: 6px;
		background: var(--yc-maple-gold-10);
		color: var(--yc-maple-gold);
		border: 1px solid var(--yc-maple-gold-35);
	}

	.v4-portfolio-year {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.6rem;
		color: var(--yc-griege-text);
		opacity: 0.5;
	}

	.v4-portfolio-name {
		font-weight: 300;
		font-size: 1.5rem;
		color: var(--yc-text);
		margin: 0;
	}

	.v4-portfolio-body {
		padding: 1.5rem;
	}

	.v4-portfolio-stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	.v4-portfolio-stat {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.v4-portfolio-stat-label {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.55rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--yc-griege-text);
		opacity: 0.5;
	}

	.v4-portfolio-stat-val {
		font-size: 0.85rem;
		font-weight: 400;
		color: var(--yc-text);
	}

	.v4-portfolio-desc {
		font-size: 0.82rem;
		line-height: 1.6;
		color: var(--yc-griege-text);
		opacity: 0.8;
		margin: 0;
	}

	/* ═══════════════ WHY US ═══════════════ */
	.v4-section-why {
		background: linear-gradient(180deg, transparent 0%, var(--yc-sheen-02) 50%, transparent 100%);
	}

	.v4-why-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin-top: 2rem;
	}

	@media (min-width: 900px) {
		.v4-why-grid { grid-template-columns: repeat(4, 1fr); }
	}

	.v4-why-card {
		background: var(--yc-ink-45);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--yc-griege-20);
		border-radius: 18px;
		padding: 1.5rem;
		text-align: center;
		box-shadow: inset 0 var(--yc-edge-y, 1px) 0 var(--yc-shimmer-10),
					0 8px 24px -4px var(--yc-shadow-30);
		transition: all 0.35s ease;
	}

	.v4-why-card:hover {
		border-color: var(--yc-griege-35);
		transform: translateY(-3px);
	}

	.v4-why-num {
		font-weight: 200;
		font-size: 2.5rem;
		color: var(--yc-maple-gold, #ffe27a);
		line-height: 1;
		margin-bottom: 0.5rem;
	}

	.v4-why-suffix {
		font-size: 0.5em;
		opacity: 0.6;
	}

	.v4-why-title {
		font-weight: 600;
		font-size: 0.8rem;
		color: var(--yc-text);
		margin: 0 0 0.5rem;
	}

	.v4-why-desc {
		font-size: 0.72rem;
		line-height: 1.5;
		color: var(--yc-griege-text);
		opacity: 0.7;
		margin: 0;
	}

	/* ═══════════════ ADVISOR ═══════════════ */
	.v4-section-advisor {
		overflow: visible;
	}

	.v4-advisor-box {
		background: var(--yc-ink-45);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--yc-griege-20);
		border-radius: 22px;
		padding: 2rem 1.5rem;
		box-shadow: inset 0 var(--yc-edge-y, 1px) 0 var(--yc-shimmer-10),
					0 12px 40px -8px var(--yc-shadow-35);
		max-width: 700px;
	}

	.v4-advisor-step {
		min-height: 200px;
	}

	.v4-advisor-breadcrumb {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}

	.v4-advisor-back {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--yc-griege-text);
		background: transparent;
		border: 1px solid var(--yc-griege-18);
		border-radius: 8px;
		padding: 0.4rem 0.7rem;
		min-height: 44px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.v4-advisor-back:hover {
		border-color: var(--yc-griege-35);
		color: var(--yc-text);
	}

	.v4-advisor-selected {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--yc-maple-gold);
		opacity: 0.7;
	}

	.v4-advisor-question {
		font-weight: 300;
		font-size: 1.25rem;
		color: var(--yc-text);
		margin: 0 0 1.25rem;
	}

	.v4-advisor-options {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.6rem;
	}

	@media (min-width: 600px) {
		.v4-advisor-options { grid-template-columns: repeat(4, 1fr); }
	}

	.v4-advisor-option {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.3rem;
		padding: 1rem 0.5rem;
		min-height: 44px;
		background: transparent;
		border: 1px solid var(--yc-griege-18);
		border-radius: 14px;
		cursor: pointer;
		transition: all 0.25s ease;
	}

	.v4-advisor-option:hover {
		border-color: var(--yc-maple-gold-45);
		background: var(--yc-maple-gold-08);
		transform: translateY(-2px);
	}

	.v4-advisor-icon {
		font-size: 1.5rem;
	}

	.v4-advisor-label {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--yc-text);
	}

	.v4-advisor-sublabel {
		font-size: 0.62rem;
		color: var(--yc-griege-text);
		opacity: 0.6;
		text-align: center;
	}

	.v4-advisor-priorities {
		grid-template-columns: repeat(2, 1fr);
	}

	.v4-advisor-priority-btn {
		padding: 1.25rem 0.75rem;
	}

	/* Advisor results */
	.v4-advisor-recs {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.v4-advisor-rec {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		padding: 1rem;
		background: var(--yc-sheen-03);
		border: 1px solid var(--yc-griege-18);
		border-radius: 14px;
	}

	.v4-advisor-rec-num {
		font-weight: 200;
		font-size: 1.5rem;
		color: var(--yc-maple-gold);
		line-height: 1;
		min-width: 2rem;
		text-align: center;
	}

	.v4-advisor-rec-product {
		font-weight: 500;
		font-size: 0.9rem;
		color: var(--yc-text);
		margin: 0 0 0.25rem;
	}

	.v4-advisor-rec-reason {
		font-size: 0.78rem;
		line-height: 1.5;
		color: var(--yc-griege-text);
		opacity: 0.75;
		margin: 0;
	}

	.v4-advisor-restart {
		margin-top: 0.5rem;
	}

	/* Advisor dots */
	.v4-advisor-dots {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1.5rem;
	}

	.v4-advisor-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--yc-griege-18);
		transition: all 0.3s ease;
	}

	.v4-advisor-dot.active {
		background: var(--yc-maple-gold);
		box-shadow: 0 0 8px -2px var(--yc-maple-gold-45);
	}

	/* ═══════════════ SUPPLIERS MARQUEE ═══════════════ */
	.v4-section-suppliers {
		padding: 3rem 0;
		overflow: hidden;
	}

	.v4-marquee-wrapper {
		overflow: hidden;
		mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
		-webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
		margin-top: 1rem;
	}

	.v4-marquee {
		display: flex;
		gap: 3rem;
		animation: v4-marquee 30s linear infinite;
		width: max-content;
	}

	.v4-marquee-item {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--yc-griege-text);
		opacity: 0.4;
		white-space: nowrap;
	}

	@keyframes v4-marquee {
		0% { transform: translateX(0); }
		100% { transform: translateX(-50%); }
	}

	/* ═══════════════ CONTACT ═══════════════ */
	.v4-section-contact {
		background: linear-gradient(180deg, transparent 0%, var(--yc-sheen-02) 50%, transparent 100%);
	}

	.v4-contact-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		margin-top: 2rem;
	}

	@media (min-width: 900px) {
		.v4-contact-grid { grid-template-columns: 1.5fr 1fr; }
	}

	.v4-contact-heading {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--yc-maple-gold);
		margin: 0 0 1rem;
	}

	.v4-team-cards {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
	}

	@media (min-width: 600px) {
		.v4-team-cards { grid-template-columns: repeat(3, 1fr); }
	}

	.v4-team-card {
		background: var(--yc-ink-45);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--yc-griege-18);
		border-radius: 14px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.v4-team-name {
		font-weight: 500;
		font-size: 0.82rem;
		color: var(--yc-text);
	}

	.v4-team-phone,
	.v4-team-email {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.58rem;
		color: var(--yc-griege-text);
		text-decoration: none;
		opacity: 0.7;
		transition: color 0.2s ease;
	}

	.v4-team-phone:hover,
	.v4-team-email:hover {
		color: var(--yc-maple-gold);
		opacity: 1;
	}

	.v4-office-info {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.v4-office-row {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.v4-office-label {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.55rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--yc-griege-text);
		opacity: 0.5;
	}

	.v4-office-val {
		font-size: 0.82rem;
		color: var(--yc-text);
		text-decoration: none;
	}

	a.v4-office-val:hover {
		color: var(--yc-maple-gold);
	}

	.v4-address {
		margin-top: 1rem;
	}

	.v4-address address {
		font-style: normal;
		font-size: 0.82rem;
		color: var(--yc-text);
		line-height: 1.5;
		margin-top: 0.25rem;
	}

	/* ═══════════════ MAP ═══════════════ */
	.v4-section-map {
		padding: 0;
	}

	.v4-map-container {
		height: 350px;
		opacity: 0;
		transition: opacity 0.8s ease;
	}

	.v4-map-container.revealed {
		opacity: 1;
	}

	.v4-map-iframe {
		width: 100%;
		height: 100%;
		border: none;
		filter: grayscale(0.6) contrast(1.1);
	}

	/* ═══════════════ FOOTER ═══════════════ */
	.v4-footer {
		background: var(--yc-ink-45);
		border-top: 1px solid var(--yc-griege-08);
		padding: 3rem 0 1.5rem;
	}

	.v4-footer .v4-container {
		opacity: 1;
		transform: none;
	}

	.v4-footer-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		margin-bottom: 2.5rem;
	}

	@media (min-width: 600px) {
		.v4-footer-grid { grid-template-columns: repeat(2, 1fr); }
	}

	@media (min-width: 900px) {
		.v4-footer-grid { grid-template-columns: 1.5fr 1fr 1fr 1fr; }
	}

	.v4-footer-wordmark {
		font-family: 'Square721', system-ui, sans-serif;
		font-size: 1.3rem;
		color: var(--yc-text);
		display: block;
	}

	.v4-footer-sub {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.55rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		color: var(--yc-griege-text);
		opacity: 0.5;
		display: block;
		margin-top: 0.15rem;
	}

	.v4-footer-tagline {
		font-size: 0.78rem;
		color: var(--yc-griege-text);
		opacity: 0.6;
		margin-top: 0.75rem;
	}

	.v4-footer-heading {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--yc-text);
		margin: 0 0 0.75rem;
	}

	.v4-footer-col p {
		font-size: 0.78rem;
		color: var(--yc-griege-text);
		opacity: 0.6;
		margin: 0.25rem 0;
	}

	.v4-footer-col a {
		color: var(--yc-griege-text);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.v4-footer-col a:hover {
		color: var(--yc-maple-gold);
	}

	.v4-footer-muted {
		opacity: 0.4 !important;
		font-size: 0.7rem !important;
	}

	.v4-footer-link {
		display: block;
		font-size: 0.78rem;
		color: var(--yc-griege-text);
		opacity: 0.6;
		text-decoration: none;
		background: transparent;
		border: none;
		padding: 0.2rem 0;
		cursor: pointer;
		text-align: left;
		transition: color 0.2s ease;
	}

	.v4-footer-link:hover {
		color: var(--yc-maple-gold);
		opacity: 1;
	}

	.v4-footer-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1.5rem;
		border-top: 1px solid var(--yc-griege-08);
		font-size: 0.68rem;
		color: var(--yc-griege-text);
		opacity: 0.4;
	}

	.v4-footer-portal {
		color: var(--yc-griege-text);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.v4-footer-portal:hover {
		color: var(--yc-maple-gold);
	}

	/* ═══════════════ LIGHT MODE OVERRIDES ═══════════════ */
	:global(:root[data-theme='light']) .v4-page {
		--yc-bg: #faf8f4;
		--yc-bg-2: #f2efe8;
		--yc-surface: #eae7e0;
		--yc-surface-2: #e0ddd5;
		--yc-text: #1a1917;
		--yc-text-muted: #5a584f;
		--yc-griege-text: #5A4D35;
	}

	:global(:root[data-theme='light']) .v4-hero-leaf {
		color: #C8102E;
	}

	:global(:root[data-theme='light']) .v4-nav {
		background: rgba(250, 248, 244, 0.75);
		border-color: rgba(194, 179, 154, 0.15);
	}

	:global(:root[data-theme='light']) .v4-nav.scrolled {
		background: rgba(250, 248, 244, 0.88);
	}

	:global(:root[data-theme='light']) .v4-product-card,
	:global(:root[data-theme='light']) .v4-service-card,
	:global(:root[data-theme='light']) .v4-why-card,
	:global(:root[data-theme='light']) .v4-advisor-box,
	:global(:root[data-theme='light']) .v4-portfolio-card,
	:global(:root[data-theme='light']) .v4-team-card {
		background: rgba(255, 255, 255, 0.65);
		border-color: rgba(194, 179, 154, 0.2);
		box-shadow: 0 4px 16px -4px rgba(0, 0, 0, 0.08);
	}

	:global(:root[data-theme='light']) .v4-footer {
		background: rgba(0, 0, 0, 0.03);
		border-top-color: rgba(194, 179, 154, 0.15);
	}

	:global(:root[data-theme='light']) .v4-grid-line {
		background: rgba(194, 179, 154, 0.08);
	}

	:global(:root[data-theme='light']) .v4-map-iframe {
		filter: grayscale(0.3) contrast(1.05);
	}

	:global(:root[data-theme='light']) .v4-process-dot {
		background: var(--yc-bg);
	}

	:global(:root[data-theme='light']) .v4-btn-primary {
		background: #1a1917;
		color: #faf8f4;
	}

	:global(:root[data-theme='light']) .v4-btn-primary:hover {
		box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.25);
	}

	:global(:root[data-theme='light']) .v4-progress {
		background: #1a1917;
	}

	/* ═══════════════ REDUCED MOTION ═══════════════ */
	@media (prefers-reduced-motion: reduce) {
		.v4-container {
			transition: none;
			opacity: 1;
			transform: none;
		}

		.v4-hero-letter,
		.v4-hero-badge,
		.v4-hero-tagline,
		.v4-hero-ctas,
		.v4-hero-leaf {
			transition: none;
			opacity: 1;
			transform: none;
		}

		.v4-float {
			animation: none;
			opacity: 1;
			transform: none;
			transition: none;
		}

		.v4-marquee {
			animation: none;
		}

		.v4-scroll-line {
			animation: none;
		}

		.v4-product-card:hover,
		.v4-service-card:hover,
		.v4-why-card:hover,
		.v4-advisor-option:hover,
		.v4-btn-primary:hover,
		.v4-btn-ghost:hover {
			transform: none;
		}

		.v4-process-line-fill {
			transition: none;
		}
	}
</style>
