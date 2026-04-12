<script lang="ts">
	import '$lib/styles/young-carpets-tokens.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import DevColorPicker from '../../components/DevColorPicker.svelte';

	/* ── Font loading state ── */
	let fontLoaded = $state(false);
	let heroVisible = $state(false);

	/* ── Building-type navigator state ── */
	let activeBuildingType = $state<string | null>(null);

	/* ── Stat counter state ── */
	let statsVisible = $state(false);
	let yearsCount = $state(0);
	let jobsCount = $state(0);
	let sqftCount = $state(0);

	/* ── Scroll reveal tracking ── */
	let revealedSections = $state<Set<string>>(new Set());

	/* ── Nav scroll state ── */
	let scrolled = $state(false);

	/* ── Building types with their product mappings ── */
	const buildingTypes: {
		id: string;
		name: string;
		icon: string;
		tagline: string;
		context: string;
		products: { name: string; reason: string }[];
	}[] = [
		{
			id: 'office',
			name: 'Office / Corporate',
			icon: '\u25FB',
			tagline: 'Professional environments that balance aesthetics with durability',
			context: 'A typical 50,000 sq ft office sees 200+ people daily. Flooring must handle rolling chairs, foot traffic, and coffee spills while still looking polished for client visits.',
			products: [
				{ name: 'Carpet Tile', reason: 'Modular replacement means one stained tile swaps out in minutes \u2014 no full-corridor tear-up. Sound absorption cuts ambient noise 10\u201315 dB, critical in open-plan layouts.' },
				{ name: 'LVT (Luxury Vinyl Tile)', reason: 'Waterproof, dent-resistant, and available in realistic wood and stone visuals. Perfect for reception areas and lobbies where first impressions matter.' },
				{ name: 'Hardwood', reason: 'Executive suites and boardrooms demand warmth and prestige. Engineered hardwood delivers the look with better dimensional stability over concrete subfloors.' },
				{ name: 'Raised Access Flooring', reason: 'Open-plan tech offices need cable management. Raised panels let IT re-route data and power without tearing up the floor.' },
				{ name: 'Wall Base', reason: 'Rubber and vinyl wall base protects drywall from chair kicks and vacuum bumpers. Clean finished edges throughout every corridor.' },
				{ name: 'ESD/Static Control', reason: 'Server rooms and data closets require static-dissipative flooring to protect sensitive electronics. Conductive tile or sheet vinyl meets ANSI/ESD standards.' },
				{ name: 'Entrance Matting', reason: 'Recessed mat wells at every entrance trap 80% of tracked-in grit within the first 6 feet \u2014 protecting your interior investment from day one.' },
			],
		},
		{
			id: 'healthcare',
			name: 'Healthcare / Medical',
			icon: '\u271A',
			tagline: 'Infection control, slip resistance, and easy maintenance',
			context: 'Hospital corridors see 10,000+ footfalls per day, plus wheeled beds, IV carts, and chemical disinfectants. Every seam is a potential harbour for bacteria \u2014 that is why heat-welded sheet vinyl is the standard.',
			products: [
				{ name: 'Sheet Vinyl', reason: 'Seamless, watertight, heat-weldable seams eliminate crevices where pathogens thrive. The gold standard for operating rooms, patient rooms, and corridors.' },
				{ name: 'SCT/Homogeneous Sheet', reason: 'Through-body color means scratches and scuffs don\u2019t expose a different layer. Ideal for high-traffic corridors that see gurney wheels and stretcher carts daily.' },
				{ name: 'Rubber Flooring', reason: 'Slip-resistant, cushioned underfoot, and sound-dampening. Reduces fall injuries in patient areas and cuts noise in nursing stations.' },
				{ name: 'LVT (Luxury Vinyl Tile)', reason: 'Waiting rooms and administrative areas benefit from a warm, residential feel that calms patients. Easy to clean and replace individual tiles as needed.' },
				{ name: 'Safety Flooring (Altro)', reason: 'Wet areas, commercial kitchens, hydrotherapy pools \u2014 Altro\u2019s R10+ slip rating meets the strictest OH&S requirements for Canadian healthcare facilities.' },
				{ name: 'Coved Wall Base', reason: 'Integral cove base creates a seamless floor-to-wall transition, eliminating the 90-degree corner where moisture and bacteria collect.' },
				{ name: 'Marmoleum/Linoleum', reason: 'Made from linseed oil, jute, and limestone \u2014 naturally antimicrobial. Qualifies for LEED credits and meets growing demand for sustainable healthcare interiors.' },
				{ name: 'Stair Treads', reason: 'High-visibility contrast nosings on every tread meet fire-code egress requirements and reduce slip-and-fall risk in stairwells.' },
			],
		},
		{
			id: 'education',
			name: 'Education / Schools',
			icon: '\u25B3',
			tagline: 'High traffic, tight budgets, and acoustics that matter',
			context: 'A school hallway endures 3,000+ students shuffling between classes every 50 minutes. Budgets are public and scrutinized, so lifecycle cost matters more than installed cost. Acoustics directly affect learning outcomes.',
			products: [
				{ name: 'VCT (Vinyl Composition Tile)', reason: 'Lowest lifecycle cost in education \u2014 strip, wax, and refinish each summer during school closure. A 20-year floor for the price of a 5-year budget cycle.' },
				{ name: 'Carpet Tile', reason: 'Libraries, reading rooms, and special-needs classrooms benefit from noise reduction. Spot-replace stained tiles without disrupting an entire room.' },
				{ name: 'Rubber Flooring', reason: 'Gymnasiums and main corridors demand impact absorption and extreme durability. Rubber handles basketball shoes, dropped weights, and rolling bleachers.' },
				{ name: 'LVT (Luxury Vinyl Tile)', reason: 'Common areas, cafeterias, and admin offices get a durable, visually appealing surface that resists scratches from chair legs and foot traffic.' },
				{ name: 'Stair Treads', reason: 'High-contrast safety nosings meet Ontario Building Code requirements for every stairwell \u2014 critical in a building full of running children.' },
				{ name: 'Wall Base', reason: 'Heavy-duty rubber wall base protects corridor drywall from the daily abuse of backpacks, cleaning equipment, and floor buffers.' },
				{ name: 'Marmoleum/Linoleum', reason: 'Environmentally conscious school boards choose linoleum for its zero-VOC emissions and LEED contribution. Natural antimicrobial properties are a bonus.' },
				{ name: 'Entrance Matting', reason: 'Every exterior door needs a recessed mat system. Ottawa\u2019s road salt and slush would destroy interior floors within a single winter without them.' },
			],
		},
		{
			id: 'hospitality',
			name: 'Hospitality / Hotels',
			icon: '\u25C7',
			tagline: 'Guest experience, luxury feel, and acoustic comfort',
			context: 'Hotels sell an experience, and flooring is the largest single visual surface in any room. Acoustic performance between floors is non-negotiable \u2014 one noisy hallway and you lose the guest forever.',
			products: [
				{ name: 'Broadloom Carpet', reason: 'Custom patterns for lobbies, ballrooms, and corridors. Axminster and Wilton weaves deliver the dense, luxurious pile that defines a 4-star property.' },
				{ name: 'Carpet Tile', reason: 'Conference rooms, back-of-house corridors, and business centres. Modular tiles mean quick replacement after events without closing an entire floor.' },
				{ name: 'Hardwood', reason: 'Restaurants and reception areas demand warmth and a premium atmosphere. Engineered planks over radiant heat are increasingly the standard for upscale dining.' },
				{ name: 'LVT (Luxury Vinyl Tile)', reason: 'Guest bathrooms and kitchenettes benefit from water-resistant elegance. Modern LVT is visually indistinguishable from natural stone at a fraction of the cost.' },
				{ name: 'Ceramic/Porcelain', reason: 'Pool decks, spa wet areas, and grand entrance foyers. Porcelain\u2019s near-zero absorption rate handles splash zones without staining.' },
				{ name: 'Cork Flooring', reason: 'Boutique hotel rooms gain warmth, quiet, and a sustainable story guests appreciate. Cork\u2019s natural cushion reduces fatigue for housekeeping staff.' },
				{ name: 'Rubber Flooring', reason: 'Hotel fitness centres need impact absorption, easy cleaning, and slip resistance \u2014 rubber delivers all three without the odour issues of cheap foam.' },
			],
		},
		{
			id: 'industrial',
			name: 'Industrial / Manufacturing',
			icon: '\u2B21',
			tagline: 'Chemical resistance, heavy loads, and worker safety',
			context: 'Forklift traffic, chemical spills, standing workers, and 24/7 operations. Industrial floors must be functional first \u2014 but break rooms and offices within the plant still deserve comfortable, attractive surfaces.',
			products: [
				{ name: 'Epoxy Coatings', reason: 'Seamless, chemical-resistant, and built to handle forklift traffic and pallet jack abuse. Available in high-visibility safety colours for lane marking.' },
				{ name: 'Anti-Fatigue Rubber', reason: 'Standing workstations, assembly lines, and packing areas. Anti-fatigue matting reduces lower-back strain and improves worker productivity measurably.' },
				{ name: 'Safety Flooring (Altro)', reason: 'Wet process areas, wash-down zones, and food-grade environments. R12 slip ratings exceed even the strictest CFIA requirements.' },
				{ name: 'Entrance Matting', reason: 'Heavy-duty scraper mats at loading docks and personnel doors control debris, moisture, and oil ingress \u2014 protecting finished floors deeper in the facility.' },
				{ name: 'ESD/Static Control', reason: 'Electronics manufacturing, clean rooms, and explosive-atmosphere zones require conductive or dissipative flooring to prevent discharge events.' },
				{ name: 'VCT (Vinyl Composition Tile)', reason: 'Break rooms, lunch areas, and office spaces within the plant. Cost-effective, easy to maintain, and available in cheerful colours that boost morale.' },
				{ name: 'Polished Concrete', reason: 'Warehouse and distribution floors benefit from concrete polishing \u2014 it hardens the surface, reduces dusting, and reflects light to cut energy costs.' },
			],
		},
		{
			id: 'retail',
			name: 'Retail / Showroom',
			icon: '\u25BD',
			tagline: 'Brand expression, foot traffic, and visual merchandising',
			context: 'Retail flooring is a silent salesperson. It sets the tone before anyone speaks. High-traffic areas near entrances wear 10x faster than back walls \u2014 plan for zone-specific products.',
			products: [
				{ name: 'LVT (Luxury Vinyl Tile)', reason: 'Endless design options from reclaimed barnboard to Carrara marble. Handles shopping carts, stiletto heels, and holiday-season stampedes.' },
				{ name: 'Ceramic/Porcelain', reason: 'Premium retail \u2014 jewelry stores, auto showrooms, flagship boutiques. Large-format porcelain creates a gallery-like atmosphere that elevates merchandise.' },
				{ name: 'Carpet Tile', reason: 'Fitting areas, shoe departments, and lifestyle boutiques. Soft underfoot, warm, and available in brand-specific colorways.' },
				{ name: 'Bamboo Flooring', reason: 'Eco-conscious brands use strand-woven bamboo for a distinctive, sustainable look. Harder than most hardwoods and a compelling story for green marketing.' },
				{ name: 'Entrance Matting', reason: 'Recessed mat systems at every entry protect thousands of dollars of interior flooring from Ottawa\u2019s road salt and gravel.' },
				{ name: 'Epoxy Coatings', reason: 'Big-box and warehouse retail \u2014 durable, easy to clean, and available in branded colours. Polished concrete with epoxy topcoat is the modern standard.' },
				{ name: 'Rubber Flooring', reason: 'Grocery stores, pharmacies, and high-traffic aisles benefit from rubber\u2019s slip resistance, cushion, and easy spot-repair.' },
			],
		},
		{
			id: 'residential',
			name: 'Residential Multi-Unit',
			icon: '\u25A2',
			tagline: 'Tenant turnover, sound transmission, and lifecycle value',
			context: 'Condo boards and property managers think in 10-year windows. Every tenant turnover is a chance to upgrade \u2014 but only if the product can be installed fast and hold up to the next cycle.',
			products: [
				{ name: 'LVT (Luxury Vinyl Tile)', reason: 'Waterproof, scratch-resistant, and installable in a single day per unit. The fastest path from vacancy to a signed lease.' },
				{ name: 'Carpet Tile (Corridors)', reason: 'Common-area corridors see every resident daily. Modular tiles mean damaged sections swap out without closing the hallway.' },
				{ name: 'Broadloom Carpet', reason: 'In-suite installation over quality underpad delivers exceptional sound insulation \u2014 critical for STC ratings between floors in multi-storey buildings.' },
				{ name: 'Engineered Hardwood', reason: 'Premium units and penthouses. Adds measurable rental and resale value. Engineered construction handles concrete subfloors and radiant heat.' },
				{ name: 'Cork Underlay/Flooring', reason: 'Natural sound insulation between floors. Cork underlay beneath LVT or hardwood can add 5\u201310 STC points to the assembly.' },
				{ name: 'Reclaimed Wood', reason: 'Loft conversions and heritage buildings gain authentic character. Reclaimed oak and elm planks tell a story that new products cannot.' },
				{ name: 'Ceramic/Porcelain', reason: 'Common-area bathrooms, laundry rooms, and lobby entrances. Porcelain handles heavy foot traffic and water without complaint.' },
				{ name: 'Entrance Matting', reason: 'Building lobbies need commercial-grade mat wells. One winter without proper matting can destroy a year\u2019s worth of corridor carpet.' },
			],
		},
		{
			id: 'government',
			name: 'Government / Institutional',
			icon: '\u25C8',
			tagline: 'Code compliance, accessibility, and 20-year lifecycle planning',
			context: 'Government procurement demands documented lifecycle costs, accessibility compliance, and products that meet or exceed Canadian building codes. The lowest bid wins only if it meets the 20-year spec.',
			products: [
				{ name: 'VCT (Vinyl Composition Tile)', reason: 'Lowest total cost of ownership over 20+ year lifecycles. Maintenance is predictable, well-documented, and performed by in-house custodial staff.' },
				{ name: 'Carpet Tile', reason: 'Courtrooms, hearing rooms, and administrative offices need acoustic control. Modular tiles simplify repair without sole-source procurement headaches.' },
				{ name: 'Rubber Flooring', reason: 'Accessible ramps, main corridors, and public lobbies. Slip-resistant, ADA/AODA compliant, and incredibly durable under institutional traffic.' },
				{ name: 'Raised Access Flooring', reason: 'IT infrastructure in government data centres and secure facilities. Enables underfloor HVAC and rapid cabling changes.' },
				{ name: 'Stair Treads', reason: 'Code-compliant visibility strips and slip-resistant nosings on every stairwell. A non-negotiable life-safety item in public buildings.' },
				{ name: 'Marmoleum/Linoleum', reason: 'LEED credits, zero-VOC emissions, and a 30-year lifespan. Meets green building mandates increasingly required by federal and provincial RFPs.' },
				{ name: 'Reclaimed Wood', reason: 'Heritage restoration of historic government buildings. The Dominion Public Building, courthouses, and Parliament Hill annex projects all demand period-appropriate materials.' },
				{ name: 'Sheet Vinyl', reason: 'Kitchens, washrooms, and medical units within institutional campuses. Heat-welded seams meet health-code hygiene requirements.' },
			],
		},
	];

	const suppliers = [
		'Tarkett', 'Beaulieu Canada', 'Interface', 'Forbo', 'Shaw Contract',
		'Mohawk Group', 'Patcraft', 'Gerflor', 'Johnsonite', 'COREtec',
		'Nora', 'Armstrong Flooring',
	];

	const services = [
		{
			title: 'Commercial Installation',
			description: 'Full-service flooring installation for new construction and renovation projects of any scale.',
			bullets: [
				'Subfloor preparation, moisture testing, and leveling to manufacturer specs',
				'Certified installers for every product category \u2014 sheet vinyl heat-welding, carpet seaming, hardwood nailing, tile setting',
				'Project management from material delivery through final punch list \u2014 on schedule, on spec, on budget',
			],
		},
		{
			title: 'Specification & Consultation',
			description: 'Product selection, lifecycle cost analysis, and specification writing for architects, designers, and general contractors.',
			bullets: [
				'On-site assessments of subfloor conditions, moisture levels, and traffic patterns',
				'Full CSI-format specifications for tender packages and government RFPs',
				'Material samples, mock-ups, and comparative lifecycle cost reports to support your design decisions',
			],
		},
		{
			title: 'Maintenance & Repair',
			description: 'Preventive maintenance programs, emergency repairs, and modular replacement services.',
			bullets: [
				'Scheduled strip-and-wax programs for VCT, deep extraction for broadloom, and recoating for hardwood',
				'Emergency response for water damage, burns, and high-impact failures',
				'Carpet tile swap programs \u2014 we stock your replacement tiles so repairs happen same-day',
			],
		},
		{
			title: 'Seasonal Matting Programs',
			description: 'Ottawa winters are brutal on interior floors. Our seasonal matting programs protect your investment year-round.',
			bullets: [
				'Pre-winter installation of heavy-duty scraper mats, drainage mats, and walk-off runners',
				'Spring removal, cleaning, and off-season storage so you never scramble',
				'Custom mat sizing for recessed wells, revolving doors, and oversized vestibules',
			],
		},
	];

	const navLinks = [
		{ label: 'Products', href: '#products' },
		{ label: 'Suppliers', href: '#suppliers' },
		{ label: 'Services', href: '#services' },
		{ label: 'About', href: '#about' },
		{ label: 'Contact', href: '#contact' },
	];

	/* ── Effects ── */

	$effect(() => {
		// Font loading
		const fontFace = new FontFace('Square721', "url('/young-carpets/square721.ttf')");
		fontFace.load().then((loaded) => {
			document.fonts.add(loaded);
			return document.fonts.ready;
		}).then(() => {
			fontLoaded = true;
			setTimeout(() => { heroVisible = true; }, 100);
		}).catch(() => {
			fontLoaded = true;
			setTimeout(() => { heroVisible = true; }, 100);
		});

		// Scroll tracking for nav
		const handleScroll = () => {
			scrolled = window.scrollY > 40;
		};
		window.addEventListener('scroll', handleScroll, { passive: true });

		// Intersection observer for scroll reveals
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const id = entry.target.getAttribute('data-reveal');
						if (id) {
							revealedSections = new Set([...revealedSections, id]);
						}
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
		);

		// Stats intersection observer
		const statsObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !statsVisible) {
						statsVisible = true;
						animateCounters();
						statsObserver.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.3 }
		);

		// Observe after DOM settles
		requestAnimationFrame(() => {
			document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
			const statsEl = document.querySelector('[data-stats]');
			if (statsEl) statsObserver.observe(statsEl);
		});

		return () => {
			window.removeEventListener('scroll', handleScroll);
			observer.disconnect();
			statsObserver.disconnect();
		};
	});

	function animateCounters() {
		const duration = 2000;
		const start = performance.now();
		const ease = (t: number) => 1 - Math.pow(1 - t, 3);

		function tick(now: number) {
			const elapsed = now - start;
			const progress = Math.min(elapsed / duration, 1);
			const eased = ease(progress);

			yearsCount = Math.round(250 * eased);
			jobsCount = Math.round(50000 * eased);
			sqftCount = Math.round(15 * eased);

			if (progress < 1) {
				requestAnimationFrame(tick);
			}
		}
		requestAnimationFrame(tick);
	}

	function toggleBuildingType(id: string) {
		activeBuildingType = activeBuildingType === id ? null : id;
	}

	function scrollToSection(e: MouseEvent, href: string) {
		e.preventDefault();
		const el = document.querySelector(href);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	/* ── YOUNG wordmark letters ── */
	const wordmarkLetters = ['Y', 'O', 'U', 'N', 'G'];
</script>

<svelte:head>
	<title>Young Carpets — Commercial Flooring · Ottawa, Ontario</title>
	<meta name="description" content="Ottawa's trusted commercial flooring partner since 1991. Supply, installation, and maintenance for offices, healthcare, education, hospitality, and institutional environments." />
</svelte:head>

<div class="yc-page yc-v1">
	<!-- FLOATING GLASS NAVBAR -->
	<nav class="v1-nav" class:v1-nav--scrolled={scrolled}>
		<div class="v1-nav__inner">
			<a href="/young-carpets" class="v1-nav__brand">YOUNG</a>
			<div class="v1-nav__links">
				{#each navLinks as link}
					<a
						href={link.href}
						class="v1-nav__link"
						onclick={(e) => scrollToSection(e, link.href)}
					>
						{link.label}
					</a>
				{/each}
			</div>
			<div class="v1-nav__toggle">
				<ThemeToggle />
			</div>
		</div>
	</nav>

	<!-- HERO -->
	<section class="v1-hero">
		<div class="v1-hero__container">
			<!-- Maple Leaf Badge -->
			<div class="v1-hero__leaf" class:v1-hero__leaf--visible={heroVisible}>
				<svg viewBox="-2015 -2000 4030 4030" class="v1-hero__leaf-svg" aria-hidden="true">
					<path
						d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z"
						fill="var(--yc-maple-red)"
					/>
				</svg>
			</div>

			<!-- Wordmark -->
			<h1 class="v1-hero__wordmark" aria-label="YOUNG">
				{#each wordmarkLetters as letter, i}
					<span
						class="v1-hero__letter"
						class:v1-hero__letter--visible={heroVisible}
						style="transition-delay: {150 + i * 80}ms"
					>
						{letter}
					</span>
				{/each}
			</h1>

			<!-- Tagline -->
			<p class="v1-hero__tagline" class:v1-hero__tagline--visible={heroVisible}>
				Commercial Flooring &middot; Ottawa, Ontario
			</p>
			<p class="v1-hero__sub" class:v1-hero__sub--visible={heroVisible}>
				Ottawa's trusted commercial flooring partner since 1991. We supply, install, and maintain floors for offices, hospitals, schools, hotels, and government buildings across the National Capital Region.
			</p>

			<!-- CTA -->
			<div class="v1-hero__cta" class:v1-hero__cta--visible={heroVisible}>
				<a href="#products" class="v1-hero__btn" onclick={(e) => scrollToSection(e, '#products')}>Explore Products</a>
				<a href="#contact" class="v1-hero__btn v1-hero__btn--ghost" onclick={(e) => scrollToSection(e, '#contact')}>Contact Us</a>
			</div>
		</div>
	</section>

	<!-- PRODUCTS — BUILDING-TYPE NAVIGATOR -->
	<section id="products" class="v1-section v1-section--alt" data-reveal="products">
		<div class="v1-container" class:v1-revealed={revealedSections.has('products')}>
			<span class="v1-eyebrow">Product Navigator</span>
			<h2 class="v1-title">What floor goes<br />in your building?</h2>
			<p class="v1-subtitle">
				Every environment has different demands: traffic volume, moisture exposure, acoustic needs, code compliance, and budget cycles. Select your building type below. We will show you the right floors and explain why each one belongs there.
			</p>

			<div class="v1-buildings">
				{#each buildingTypes as bt}
					<div class="v1-building" class:v1-building--active={activeBuildingType === bt.id}>
						<button
							class="v1-building__header"
							onclick={() => toggleBuildingType(bt.id)}
							aria-expanded={activeBuildingType === bt.id}
							aria-controls="building-{bt.id}"
						>
							<span class="v1-building__icon">{bt.icon}</span>
							<div class="v1-building__meta">
								<span class="v1-building__name">{bt.name}</span>
								<span class="v1-building__tagline">{bt.tagline}</span>
							</div>
							<span class="v1-building__chevron" aria-hidden="true">
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
									<path d="M6 8l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</span>
						</button>

						<div
							id="building-{bt.id}"
							class="v1-building__products"
							class:v1-building__products--open={activeBuildingType === bt.id}
						>
							<div class="v1-building__products-inner">
								<p class="v1-building__context">{bt.context}</p>
								{#each bt.products as product}
									<div class="v1-product-row">
										<span class="v1-product-row__name">{product.name}</span>
										<span class="v1-product-row__reason">{product.reason}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- SUPPLIERS MARQUEE -->
	<section id="suppliers" class="v1-marquee-section" data-reveal="suppliers">
		<div class="v1-container v1-container--wide" class:v1-revealed={revealedSections.has('suppliers')}>
			<span class="v1-eyebrow" style="text-align:center;display:block;">Our Suppliers</span>
			<p class="v1-marquee-desc">We partner with North America's leading commercial flooring manufacturers. Every product we specify is backed by factory warranties and our own installation guarantee.</p>
			<div class="v1-marquee">
				<div class="v1-marquee__track">
					{#each [...suppliers, ...suppliers] as name}
						<span class="v1-marquee__item">{name}</span>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- SERVICES -->
	<section id="services" class="v1-section v1-section--alt" data-reveal="services">
		<div class="v1-container" class:v1-revealed={revealedSections.has('services')}>
			<span class="v1-eyebrow">What We Do</span>
			<h2 class="v1-title">Services</h2>
			<p class="v1-subtitle">
				From first consultation to final walkthrough, we manage every phase of your commercial flooring project.
			</p>

			<div class="v1-services-grid">
				{#each services as svc, i}
					<div class="v1-service-card" style="transition-delay: {i * 80}ms">
						<h3 class="v1-service-card__title">{svc.title}</h3>
						<p class="v1-service-card__desc">{svc.description}</p>
						<ul class="v1-service-card__bullets">
							{#each svc.bullets as bullet}
								<li>{bullet}</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ABOUT -->
	<section id="about" class="v1-section" data-reveal="about">
		<div class="v1-container" class:v1-revealed={revealedSections.has('about')}>
			<span class="v1-eyebrow">Since 1991</span>
			<h2 class="v1-title">About Young Carpets</h2>

			<div class="v1-about-content">
				<p class="v1-about-text">
					Young Carpets Inc. is a family-owned commercial flooring company rooted in Ottawa's east end. Founded in 1991, the company has grown from a two-person carpet installation crew into one of the National Capital Region's most experienced flooring teams, with six dedicated sales professionals and a network of certified installers across every product category.
				</p>
				<p class="v1-about-text">
					Three decades of continuous operation in the same market means deep relationships with local architects, general contractors, property managers, and building engineers. We have floored federal courthouses, Ottawa Hospital campuses, Algonquin College buildings, hotel lobbies along the Rideau Canal, and hundreds of office towers in the downtown core and Kanata tech corridor.
				</p>
				<p class="v1-about-text">
					What separates us is knowledge. Our sales team doesn't just sell flooring — they understand subfloor conditions, moisture vapor emission rates, lifecycle cost modeling, LEED contribution strategies, and the specific slip-resistance and fire-code requirements for each environment. When we recommend a product, we can explain exactly why it is the right choice for your building, your traffic, your budget, and your maintenance capacity.
				</p>
			</div>

			<div class="v1-stats" data-stats>
				<div class="v1-stat">
					<span class="v1-stat__number">{yearsCount}+</span>
					<span class="v1-stat__label">combined years of experience</span>
				</div>
				<div class="v1-stat">
					<span class="v1-stat__number">{jobsCount.toLocaleString()}+</span>
					<span class="v1-stat__label">commercial jobs completed</span>
				</div>
				<div class="v1-stat">
					<span class="v1-stat__number">{sqftCount}M+</span>
					<span class="v1-stat__label">square feet installed</span>
				</div>
			</div>
		</div>
	</section>

	<!-- CONTACT / OUR TEAM -->
	<section id="contact" class="v1-section v1-section--alt" data-reveal="contact">
		<div class="v1-container" class:v1-revealed={revealedSections.has('contact')}>
			<span class="v1-eyebrow">Get In Touch</span>
			<h2 class="v1-title">Our Team</h2>
			<p class="v1-subtitle">
				Every member of our sales team is a flooring specialist, not a generalist. Call or email anyone directly — we pick up the phone.
			</p>

			<div class="v1-team-grid">
				<!-- Sales -->
				<div class="v1-team-group">
					<h3 class="v1-team-group__title">Sales</h3>
					<div class="v1-team-members">
						<div class="v1-member">
							<span class="v1-member__name">Ryan Young</span>
							<a href="tel:6132777926" class="v1-member__detail">613-277-7926</a>
							<a href="mailto:ryoung@youngcarpets.com" class="v1-member__detail">ryoung@youngcarpets.com</a>
						</div>
						<div class="v1-member">
							<span class="v1-member__name">Derek Young</span>
							<a href="tel:6136128487" class="v1-member__detail">613-612-8487</a>
							<a href="mailto:dyoung@youngcarpets.com" class="v1-member__detail">dyoung@youngcarpets.com</a>
						</div>
						<div class="v1-member">
							<span class="v1-member__name">Peter Helis</span>
							<a href="tel:6138646998" class="v1-member__detail">613-864-6998</a>
							<a href="mailto:phelis@youngcarpets.com" class="v1-member__detail">phelis@youngcarpets.com</a>
						</div>
						<div class="v1-member">
							<span class="v1-member__name">Mike Noel</span>
							<a href="tel:6132225987" class="v1-member__detail">613-222-5987</a>
							<a href="mailto:mnoel@youngcarpets.com" class="v1-member__detail">mnoel@youngcarpets.com</a>
						</div>
						<div class="v1-member">
							<span class="v1-member__name">Clayton Bradley</span>
							<a href="tel:6132905075" class="v1-member__detail">613-290-5075</a>
							<a href="mailto:cbradley@youngcarpets.com" class="v1-member__detail">cbradley@youngcarpets.com</a>
						</div>
						<div class="v1-member">
							<span class="v1-member__name">Alan O'Connor</span>
							<a href="tel:6137913252" class="v1-member__detail">613-791-3252</a>
							<a href="mailto:aoconnor@youngcarpets.com" class="v1-member__detail">aoconnor@youngcarpets.com</a>
						</div>
					</div>
				</div>

				<!-- Accounting -->
				<div class="v1-team-group">
					<h3 class="v1-team-group__title">Accounting</h3>
					<div class="v1-team-members">
						<div class="v1-member">
							<span class="v1-member__name">Alan Young</span>
							<a href="tel:6138789911" class="v1-member__detail">613-878-9911</a>
							<a href="mailto:accounting@youngcarpets.com" class="v1-member__detail">accounting@youngcarpets.com</a>
						</div>
						<div class="v1-member">
							<span class="v1-member__name">Accounts Payable</span>
							<a href="mailto:ap@youngcarpets.com" class="v1-member__detail">ap@youngcarpets.com</a>
						</div>
					</div>
				</div>

				<!-- Office -->
				<div class="v1-team-group">
					<h3 class="v1-team-group__title">Office</h3>
					<div class="v1-team-members">
						<div class="v1-member">
							<span class="v1-member__name">Main Line</span>
							<a href="tel:6137442744" class="v1-member__detail">613-744-2744</a>
						</div>
						<div class="v1-member">
							<span class="v1-member__name">Fax</span>
							<span class="v1-member__detail">613-744-2995</span>
						</div>
						<div class="v1-member">
							<span class="v1-member__name">Email</span>
							<a href="mailto:info@youngcarpets.com" class="v1-member__detail">info@youngcarpets.com</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- MAP -->
	<section class="v1-section v1-map-section" data-reveal="map">
		<div class="v1-container" class:v1-revealed={revealedSections.has('map')}>
			<span class="v1-eyebrow">Visit Us</span>
			<h2 class="v1-title">Find Our Office</h2>
			<p class="v1-map-address">Unit 316 — 1228 Old Innes Road, Ottawa, ON K1B 3V3</p>
			<div class="v1-map-embed">
				<iframe
					title="Young Carpets location"
					src="https://www.google.com/maps?q=1228+Old+Innes+Rd+Unit+316+Ottawa+ON+K1B+3V3&output=embed&z=15"
					width="100%"
					height="400"
					style="border:0;border-radius:18px;"
					allowfullscreen
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
				></iframe>
			</div>
		</div>
	</section>

	<!-- FOOTER -->
	<footer class="v1-footer">
		<div class="v1-container v1-container--footer">
			<div class="v1-footer__grid">
				<div class="v1-footer__brand">
					<span class="v1-footer__wordmark">YOUNG</span>
					<span class="v1-footer__tagline">Commercial Flooring</span>
					<span class="v1-footer__since">Ottawa, Ontario &middot; Est. 1991</span>
				</div>

				<div class="v1-footer__col">
					<span class="v1-footer__col-title">Visit</span>
					<p class="v1-footer__text">Unit 316 — 1228 Old Innes Road<br />Ottawa, ON K1B 3V3</p>
				</div>

				<div class="v1-footer__col">
					<span class="v1-footer__col-title">Contact</span>
					<p class="v1-footer__text">
						<a href="tel:6137442744">613-744-2744</a><br />
						Fax: 613-744-2995<br />
						<a href="mailto:info@youngcarpets.com">info@youngcarpets.com</a><br />
						<a href="mailto:ap@youngcarpets.com">ap@youngcarpets.com</a>
					</p>
				</div>

				<div class="v1-footer__col">
					<span class="v1-footer__col-title">Hours</span>
					<p class="v1-footer__text">
						Mon – Fri: 10:00 – 16:00<br />
						Sat – Sun: Closed
					</p>
				</div>
			</div>

			<div class="v1-footer__bottom">
				<span>&copy; 2026 Young Carpets Inc.</span>
				<a href="/" class="v1-footer__portal-link">Portal</a>
			</div>
		</div>
	</footer>
	<DevColorPicker />
</div>

<style>
	/* ═══════════════════════════════════════════════════════════════
	   BASE / RESET
	   ═══════════════════════════════════════════════════════════════ */
	.yc-v1 {
		background: var(--yc-ink);
		color: var(--yc-griege-text);
		min-height: 100vh;
		overflow-x: hidden;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
		font-weight: 300;
		font-size: 0.9rem;
		line-height: 1.6;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* ── LIGHT MODE: Root-level overrides ── */
	:global(:root[data-theme='light']) .yc-v1 {
		background: #faf7f0;
		color: #3d3832;
	}

	/* ═══════════════════════════════════════════════════════════════
	   LAYOUT
	   ═══════════════════════════════════════════════════════════════ */
	.v1-container {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 1.25rem;
	}

	.v1-container--wide {
		max-width: 1200px;
	}

	.v1-container--footer {
		opacity: 1;
		transform: none;
	}

	.v1-section {
		padding: 5rem 0;
	}

	/* Alternating section backgrounds for light mode */
	:global(:root[data-theme='light']) .v1-section--alt {
		background: #ffffff;
	}

	/* ═══════════════════════════════════════════════════════════════
	   TYPOGRAPHY
	   ═══════════════════════════════════════════════════════════════ */
	.v1-eyebrow {
		font-family: ui-monospace, 'SF Mono', monospace;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 700;
		font-size: 0.68rem;
		color: rgba(194, 179, 154, 0.55);
		display: block;
		margin-bottom: 0.75rem;
	}

	:global(:root[data-theme='light']) .v1-eyebrow {
		color: #1d1d1f;
	}

	.v1-title {
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
		font-weight: 200;
		font-size: 2.25rem;
		letter-spacing: 0.04em;
		color: var(--yc-maple-gold);
		margin: 0 0 1.5rem;
		line-height: 1.15;
	}

	:global(:root[data-theme='light']) .v1-title {
		color: #1d1d1f;
	}

	.v1-subtitle {
		font-weight: 300;
		font-size: 0.95rem;
		color: rgba(194, 179, 154, 0.7);
		max-width: 580px;
		margin-bottom: 2.5rem;
		line-height: 1.6;
	}

	:global(:root[data-theme='light']) .v1-subtitle {
		color: #3d3832;
	}

	/* ═══════════════════════════════════════════════════════════════
	   SCROLL REVEAL
	   ═══════════════════════════════════════════════════════════════ */
	.v1-container {
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.6s cubic-bezier(0.2, 0.9, 0.25, 1.05),
		            transform 0.6s cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	.v1-container.v1-revealed {
		opacity: 1;
		transform: translateY(0);
	}

	/* Hero container doesn't use scroll reveal */
	.v1-hero .v1-hero__container {
		opacity: 1;
		transform: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.v1-container {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}

	/* ═══════════════════════════════════════════════════════════════
	   FLOATING GLASS NAVBAR
	   ═══════════════════════════════════════════════════════════════ */
	.v1-nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 0.75rem 1.25rem;
		transition: background 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease;
	}

	.v1-nav--scrolled {
		background: var(--yc-ink-55);
		backdrop-filter: blur(20px) saturate(150%);
		-webkit-backdrop-filter: blur(20px) saturate(150%);
		box-shadow: 0 1px 0 var(--yc-griege-08), 0 8px 32px -8px var(--yc-shadow-30);
	}

	:global(:root[data-theme='light']) .v1-nav--scrolled {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		border-bottom: 1px solid rgba(90, 77, 53, 0.1);
		box-shadow: 0 2px 12px rgba(90, 77, 53, 0.06);
	}

	.v1-nav__inner {
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.v1-nav__brand {
		font-family: 'Square721', ui-serif, Georgia, serif;
		font-size: 1.3rem;
		font-weight: 700;
		color: var(--yc-maple-gold);
		text-decoration: none;
		letter-spacing: 0.06em;
		flex-shrink: 0;
	}

	:global(:root[data-theme='light']) .v1-nav__brand {
		color: #1d1d1f;
	}

	.v1-nav__links {
		display: flex;
		gap: 0.25rem;
	}

	.v1-nav__link {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(194, 179, 154, 0.6);
		text-decoration: none;
		padding: 0.5rem 0.75rem;
		border-radius: 8px;
		transition: color 0.2s ease, background 0.2s ease;
		min-height: 44px;
		display: flex;
		align-items: center;
	}

	.v1-nav__link:hover {
		color: var(--yc-maple-gold);
		background: var(--yc-maple-gold-08);
	}

	:global(:root[data-theme='light']) .v1-nav__link {
		color: #5a5249;
	}

	:global(:root[data-theme='light']) .v1-nav__link:hover {
		color: #7a5d10;
		background: rgba(138, 106, 20, 0.08);
		border-radius: 8px;
		border: 1px solid rgba(138, 106, 20, 0.3);
	}

	.v1-nav__toggle {
		flex-shrink: 0;
	}

	@media (max-width: 599px) {
		.v1-nav__links {
			display: none;
		}
	}

	/* ═══════════════════════════════════════════════════════════════
	   HERO
	   ═══════════════════════════════════════════════════════════════ */
	.v1-hero {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 6rem 1.25rem 4rem;
		position: relative;
		overflow: hidden;
	}

	.v1-hero__container {
		position: relative;
		z-index: 2;
	}

	.v1-hero__leaf {
		display: flex;
		justify-content: center;
		margin-bottom: 1.5rem;
		opacity: 0;
		transform: scale(0.8);
		transition: opacity 0.6s cubic-bezier(0.2, 0.9, 0.25, 1.05),
		            transform 0.6s cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	.v1-hero__leaf--visible {
		opacity: 1;
		transform: scale(1);
	}

	.v1-hero__leaf-svg {
		width: 48px;
		height: 48px;
		filter: drop-shadow(0 0 12px rgba(200, 16, 46, 0.35));
	}

	.v1-hero__wordmark {
		font-family: 'Square721', ui-serif, Georgia, serif;
		font-size: 3.75rem;
		font-weight: 700;
		color: var(--yc-maple-gold);
		letter-spacing: 0.08em;
		margin: 0 0 1rem;
		display: flex;
		justify-content: center;
		gap: 0.02em;
		line-height: 1;
	}

	:global(:root[data-theme='light']) .v1-hero__wordmark {
		color: #1d1d1f;
	}

	.v1-hero__letter {
		display: inline-block;
		opacity: 0;
		transform: translateY(30px);
		transition: opacity 0.5s cubic-bezier(0.2, 0.9, 0.25, 1.05),
		            transform 0.5s cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	.v1-hero__letter--visible {
		opacity: 1;
		transform: translateY(0);
	}

	.v1-hero__tagline {
		font-family: ui-monospace, 'SF Mono', monospace;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-weight: 700;
		font-size: 0.7rem;
		color: rgba(194, 179, 154, 0.6);
		margin: 0 0 1.5rem;
		opacity: 0;
		transform: translateY(12px);
		transition: opacity 0.5s ease 0.6s, transform 0.5s ease 0.6s;
	}

	.v1-hero__tagline--visible {
		opacity: 1;
		transform: translateY(0);
	}

	:global(:root[data-theme='light']) .v1-hero__tagline {
		color: #1d1d1f;
	}

	.v1-hero__sub {
		font-weight: 200;
		font-size: 0.95rem;
		color: rgba(194, 179, 154, 0.5);
		max-width: 500px;
		margin: 0 auto 2rem;
		line-height: 1.65;
		opacity: 0;
		transform: translateY(12px);
		transition: opacity 0.5s ease 0.8s, transform 0.5s ease 0.8s;
	}

	.v1-hero__sub--visible {
		opacity: 1;
		transform: translateY(0);
	}

	:global(:root[data-theme='light']) .v1-hero__sub {
		color: #3d3832;
	}

	/* CTA buttons */
	.v1-hero__cta {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
		flex-wrap: wrap;
		opacity: 0;
		transform: translateY(12px);
		transition: opacity 0.5s ease 1s, transform 0.5s ease 1s;
	}

	.v1-hero__cta--visible {
		opacity: 1;
		transform: translateY(0);
	}

	.v1-hero__btn {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		padding: 0.75rem 1.5rem;
		border-radius: 10px;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		transition: all 0.25s cubic-bezier(0.2, 0.9, 0.25, 1.05);
		background: var(--yc-maple-gold);
		color: var(--yc-ink);
		border: 1px solid transparent;
	}

	.v1-hero__btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 16px rgba(255, 226, 122, 0.25);
	}

	:global(:root[data-theme='light']) .v1-hero__btn {
		background: #1d1d1f;
		color: #faf7f0;
	}

	:global(:root[data-theme='light']) .v1-hero__btn:hover {
		box-shadow: 0 4px 16px rgba(29, 29, 31, 0.2);
	}

	.v1-hero__btn--ghost {
		background: transparent;
		color: var(--yc-maple-gold);
		border: 1px solid var(--yc-maple-gold-45);
	}

	.v1-hero__btn--ghost:hover {
		background: var(--yc-maple-gold-08);
		box-shadow: none;
	}

	:global(:root[data-theme='light']) .v1-hero__btn--ghost {
		background: transparent;
		color: #7a5d10;
		border: 1px solid rgba(138, 106, 20, 0.3);
	}

	:global(:root[data-theme='light']) .v1-hero__btn--ghost:hover {
		background: rgba(138, 106, 20, 0.08);
		box-shadow: none;
	}

	@media (min-width: 900px) {
		.v1-hero__wordmark {
			font-size: 5.5rem;
		}

		.v1-hero__leaf-svg {
			width: 60px;
			height: 60px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.v1-hero__leaf,
		.v1-hero__letter,
		.v1-hero__tagline,
		.v1-hero__sub,
		.v1-hero__cta {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}

	/* ═══════════════════════════════════════════════════════════════
	   BUILDING-TYPE NAVIGATOR
	   ═══════════════════════════════════════════════════════════════ */
	.v1-buildings {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.v1-building {
		background: var(--yc-ink-45);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--yc-griege-20);
		border-radius: 18px;
		box-shadow: inset 0 var(--yc-edge-y) 0 var(--yc-shimmer-10),
		            0 8px 24px -4px var(--yc-shadow-30);
		overflow: hidden;
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
	}

	.v1-building--active {
		border-color: var(--yc-maple-gold-45);
		box-shadow: inset 0 var(--yc-edge-y) 0 var(--yc-shimmer-10),
		            0 8px 32px -4px var(--yc-shadow-35),
		            0 0 0 1px var(--yc-maple-gold-10);
	}

	/* Light mode cards */
	:global(:root[data-theme='light']) .v1-building {
		background: rgba(255, 255, 255, 0.88);
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		border: 1px solid rgba(90, 77, 53, 0.16);
		box-shadow: 0 2px 12px rgba(90, 77, 53, 0.08);
	}

	:global(:root[data-theme='light']) .v1-building--active {
		border-color: rgba(138, 106, 20, 0.35);
		box-shadow: 0 2px 16px rgba(90, 77, 53, 0.1);
	}

	.v1-building__header {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
		padding: 1.15rem 1.25rem;
		background: none;
		border: none;
		color: inherit;
		cursor: pointer;
		text-align: left;
		min-height: 44px;
		transition: background 0.2s ease;
		font-family: inherit;
	}

	.v1-building__header:hover {
		background: var(--yc-griege-06);
	}

	:global(:root[data-theme='light']) .v1-building__header:hover {
		background: rgba(138, 106, 20, 0.04);
	}

	.v1-building__icon {
		font-size: 1.4rem;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		border-radius: 12px;
		background: var(--yc-ink-50);
		color: var(--yc-maple-gold);
		border: 1px solid var(--yc-griege-08);
	}

	.v1-building--active .v1-building__icon {
		background: var(--yc-maple-gold-10);
		border-color: var(--yc-maple-gold-45);
	}

	:global(:root[data-theme='light']) .v1-building__icon {
		background: rgba(138, 106, 20, 0.06);
		color: #7a5d10;
		border-color: rgba(90, 77, 53, 0.12);
	}

	:global(:root[data-theme='light']) .v1-building--active .v1-building__icon {
		background: rgba(138, 106, 20, 0.12);
		border-color: rgba(138, 106, 20, 0.35);
	}

	.v1-building__meta {
		flex: 1;
		min-width: 0;
	}

	.v1-building__name {
		display: block;
		font-weight: 500;
		font-size: 0.92rem;
		color: var(--yc-griege-text);
		letter-spacing: 0.01em;
	}

	.v1-building--active .v1-building__name {
		color: var(--yc-maple-gold);
	}

	:global(:root[data-theme='light']) .v1-building__name {
		color: #1d1d1f;
	}

	:global(:root[data-theme='light']) .v1-building--active .v1-building__name {
		color: #7a5d10;
	}

	.v1-building__tagline {
		display: block;
		font-size: 0.72rem;
		color: rgba(194, 179, 154, 0.5);
		margin-top: 0.15rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	:global(:root[data-theme='light']) .v1-building__tagline {
		color: #5a5249;
	}

	.v1-building__chevron {
		flex-shrink: 0;
		color: rgba(194, 179, 154, 0.4);
		transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.25, 1.05);
		display: flex;
		align-items: center;
	}

	.v1-building--active .v1-building__chevron {
		transform: rotate(180deg);
		color: var(--yc-maple-gold);
	}

	:global(:root[data-theme='light']) .v1-building__chevron {
		color: #5a5249;
	}

	:global(:root[data-theme='light']) .v1-building--active .v1-building__chevron {
		color: #7a5d10;
	}

	/* Products panel */
	.v1-building__products {
		max-height: 0;
		overflow: hidden;
		transition: max-height 0.45s cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	.v1-building__products--open {
		max-height: 1200px;
	}

	.v1-building__products-inner {
		padding: 0 1.25rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.v1-building__context {
		font-size: 0.82rem;
		font-weight: 300;
		font-style: italic;
		color: rgba(194, 179, 154, 0.6);
		line-height: 1.55;
		margin: 0 0 0.75rem;
		padding: 0.75rem 0.85rem;
		border-radius: 10px;
		background: var(--yc-ink-50);
		border-left: 3px solid var(--yc-maple-gold-45);
	}

	:global(:root[data-theme='light']) .v1-building__context {
		color: #3d3832;
		background: rgba(138, 106, 20, 0.04);
		border-left-color: rgba(138, 106, 20, 0.3);
	}

	.v1-product-row {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		padding: 0.65rem 0.85rem;
		border-radius: 10px;
		background: var(--yc-ink-50);
		border: 1px solid var(--yc-griege-08);
		transition: background 0.2s ease, border-color 0.2s ease;
	}

	.v1-product-row:hover {
		background: var(--yc-maple-gold-08);
		border-color: var(--yc-maple-gold-35);
	}

	:global(:root[data-theme='light']) .v1-product-row {
		background: rgba(255, 255, 255, 0.6);
		border: 1px solid rgba(90, 77, 53, 0.1);
	}

	:global(:root[data-theme='light']) .v1-product-row:hover {
		background: rgba(138, 106, 20, 0.06);
		border-color: rgba(138, 106, 20, 0.25);
	}

	.v1-product-row__name {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-weight: 700;
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--yc-maple-gold);
	}

	:global(:root[data-theme='light']) .v1-product-row__name {
		color: #1d1d1f;
	}

	.v1-product-row__reason {
		font-size: 0.8rem;
		font-weight: 300;
		color: rgba(194, 179, 154, 0.65);
		line-height: 1.45;
	}

	:global(:root[data-theme='light']) .v1-product-row__reason {
		color: #3d3832;
	}

	@media (min-width: 600px) {
		.v1-product-row {
			flex-direction: row;
			align-items: baseline;
			gap: 1rem;
		}

		.v1-product-row__name {
			flex-shrink: 0;
			width: 200px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.v1-building {
			transition: none;
		}
		.v1-building__products {
			transition: none;
		}
		.v1-building__chevron {
			transition: none;
		}
	}

	/* ═══════════════════════════════════════════════════════════════
	   SUPPLIERS MARQUEE
	   ═══════════════════════════════════════════════════════════════ */
	.v1-marquee-section {
		padding: 3rem 0;
		overflow: hidden;
	}

	.v1-marquee-desc {
		font-weight: 300;
		font-size: 0.88rem;
		color: rgba(194, 179, 154, 0.55);
		text-align: center;
		max-width: 560px;
		margin: 0.5rem auto 1.5rem;
		line-height: 1.55;
	}

	:global(:root[data-theme='light']) .v1-marquee-desc {
		color: #3d3832;
	}

	.v1-marquee {
		margin-top: 1rem;
		overflow: hidden;
		mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
		-webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
	}

	.v1-marquee__track {
		display: flex;
		gap: 3rem;
		animation: v1-marquee-scroll 30s linear infinite;
		width: max-content;
	}

	.v1-marquee__item {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(194, 179, 154, 0.35);
		white-space: nowrap;
		flex-shrink: 0;
	}

	:global(:root[data-theme='light']) .v1-marquee__item {
		color: #5a5249;
	}

	@keyframes v1-marquee-scroll {
		from { transform: translateX(0); }
		to { transform: translateX(-50%); }
	}

	@media (prefers-reduced-motion: reduce) {
		.v1-marquee__track {
			animation: none;
		}
	}

	/* ═══════════════════════════════════════════════════════════════
	   SERVICES
	   ═══════════════════════════════════════════════════════════════ */
	.v1-services-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.75rem;
	}

	@media (min-width: 600px) {
		.v1-services-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	.v1-service-card {
		background: var(--yc-ink-45);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--yc-griege-20);
		border-radius: 18px;
		padding: 1.5rem;
		box-shadow: inset 0 var(--yc-edge-y) 0 var(--yc-shimmer-10),
		            0 8px 24px -4px var(--yc-shadow-30);
		transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
	}

	.v1-service-card:hover {
		border-color: var(--yc-griege-30);
		transform: translateY(-2px);
		box-shadow: inset 0 var(--yc-edge-y) 0 var(--yc-shimmer-10),
		            0 12px 32px -4px var(--yc-shadow-35);
	}

	:global(:root[data-theme='light']) .v1-service-card {
		background: rgba(255, 255, 255, 0.88);
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		border: 1px solid rgba(90, 77, 53, 0.16);
		box-shadow: 0 2px 12px rgba(90, 77, 53, 0.08);
	}

	:global(:root[data-theme='light']) .v1-service-card:hover {
		border-color: rgba(90, 77, 53, 0.25);
		box-shadow: 0 4px 16px rgba(90, 77, 53, 0.1);
	}

	.v1-service-card__title {
		font-family: ui-monospace, 'SF Mono', monospace;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-weight: 700;
		font-size: 0.72rem;
		color: var(--yc-maple-gold);
		margin: 0 0 0.65rem;
	}

	:global(:root[data-theme='light']) .v1-service-card__title {
		color: #1d1d1f;
	}

	.v1-service-card__desc {
		font-size: 0.85rem;
		font-weight: 300;
		color: rgba(194, 179, 154, 0.65);
		line-height: 1.55;
		margin: 0 0 0.85rem;
	}

	:global(:root[data-theme='light']) .v1-service-card__desc {
		color: #3d3832;
	}

	.v1-service-card__bullets {
		margin: 0;
		padding: 0 0 0 1.1rem;
		list-style: disc;
	}

	.v1-service-card__bullets li {
		font-size: 0.8rem;
		font-weight: 300;
		color: rgba(194, 179, 154, 0.55);
		line-height: 1.5;
		margin-bottom: 0.35rem;
	}

	.v1-service-card__bullets li:last-child {
		margin-bottom: 0;
	}

	:global(:root[data-theme='light']) .v1-service-card__bullets li {
		color: #5a5249;
	}

	@media (prefers-reduced-motion: reduce) {
		.v1-service-card {
			transition: none;
		}
		.v1-service-card:hover {
			transform: none;
		}
	}

	/* ═══════════════════════════════════════════════════════════════
	   ABOUT
	   ═══════════════════════════════════════════════════════════════ */
	.v1-about-content {
		max-width: 680px;
		margin-bottom: 3rem;
	}

	.v1-about-text {
		font-weight: 200;
		font-size: 0.95rem;
		line-height: 1.7;
		color: rgba(194, 179, 154, 0.7);
		margin: 0 0 1.25rem;
	}

	.v1-about-text:last-child {
		margin-bottom: 0;
	}

	:global(:root[data-theme='light']) .v1-about-text {
		color: #3d3832;
	}

	.v1-stats {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	@media (min-width: 600px) {
		.v1-stats {
			flex-direction: row;
			gap: 4rem;
		}
	}

	.v1-stat__number {
		display: block;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
		font-weight: 200;
		font-size: 3rem;
		color: var(--yc-maple-gold);
		letter-spacing: 0.02em;
		line-height: 1;
		margin-bottom: 0.35rem;
	}

	:global(:root[data-theme='light']) .v1-stat__number {
		color: #1d1d1f;
	}

	.v1-stat__label {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(194, 179, 154, 0.5);
	}

	:global(:root[data-theme='light']) .v1-stat__label {
		color: #1d1d1f;
	}

	/* ═══════════════════════════════════════════════════════════════
	   CONTACT / TEAM
	   ═══════════════════════════════════════════════════════════════ */
	.v1-team-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	@media (min-width: 600px) {
		.v1-team-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (min-width: 900px) {
		.v1-team-grid {
			grid-template-columns: 1fr 1fr 1fr;
		}
	}

	.v1-team-group {
		background: var(--yc-ink-45);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--yc-griege-20);
		border-radius: 18px;
		padding: 1.5rem;
		box-shadow: inset 0 var(--yc-edge-y) 0 var(--yc-shimmer-10),
		            0 8px 24px -4px var(--yc-shadow-30);
	}

	:global(:root[data-theme='light']) .v1-team-group {
		background: rgba(255, 255, 255, 0.88);
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
		border: 1px solid rgba(90, 77, 53, 0.16);
		box-shadow: 0 2px 12px rgba(90, 77, 53, 0.08);
	}

	.v1-team-group__title {
		font-family: ui-monospace, 'SF Mono', monospace;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 700;
		font-size: 0.68rem;
		color: var(--yc-maple-gold);
		margin: 0 0 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--yc-griege-08);
	}

	:global(:root[data-theme='light']) .v1-team-group__title {
		color: #1d1d1f;
		border-bottom-color: rgba(90, 77, 53, 0.12);
	}

	.v1-team-members {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.v1-member {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.v1-member__name {
		font-weight: 500;
		font-size: 0.85rem;
		color: var(--yc-griege-text);
	}

	:global(:root[data-theme='light']) .v1-member__name {
		color: #1d1d1f;
	}

	.v1-member__detail {
		font-size: 0.78rem;
		font-weight: 300;
		color: rgba(194, 179, 154, 0.55);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	a.v1-member__detail:hover {
		color: var(--yc-maple-gold);
	}

	:global(:root[data-theme='light']) .v1-member__detail {
		color: #5a5249;
	}

	:global(:root[data-theme='light']) a.v1-member__detail:hover {
		color: #7a5d10;
	}

	/* ═══════════════════════════════════════════════════════════════
	   MAP
	   ═══════════════════════════════════════════════════════════════ */
	.v1-map-address {
		font-weight: 300;
		font-size: 0.9rem;
		color: rgba(194, 179, 154, 0.65);
		margin-bottom: 1.5rem;
	}

	:global(:root[data-theme='light']) .v1-map-address {
		color: #3d3832;
	}

	.v1-map-embed {
		border-radius: 18px;
		overflow: hidden;
		border: 1px solid var(--yc-griege-20);
		box-shadow: 0 8px 24px -4px var(--yc-shadow-30);
	}

	:global(:root[data-theme='light']) .v1-map-embed {
		border: 1px solid rgba(90, 77, 53, 0.16);
		box-shadow: 0 2px 12px rgba(90, 77, 53, 0.08);
	}

	.v1-map-embed iframe {
		display: block;
		width: 100%;
		height: 350px;
	}

	@media (min-width: 600px) {
		.v1-map-embed iframe {
			height: 420px;
		}
	}

	/* ═══════════════════════════════════════════════════════════════
	   FOOTER
	   ═══════════════════════════════════════════════════════════════ */
	.v1-footer {
		border-top: 1px solid var(--yc-griege-08);
		padding: 3.5rem 0 2rem;
		margin-top: 2rem;
	}

	:global(:root[data-theme='light']) .v1-footer {
		border-top-color: rgba(90, 77, 53, 0.12);
	}

	.v1-footer__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		margin-bottom: 2.5rem;
	}

	@media (min-width: 600px) {
		.v1-footer__grid {
			grid-template-columns: 1.4fr 1fr 1fr 1fr;
		}
	}

	.v1-footer__wordmark {
		font-family: 'Square721', ui-serif, Georgia, serif;
		font-size: 1.6rem;
		font-weight: 700;
		color: var(--yc-maple-gold);
		display: block;
		letter-spacing: 0.06em;
	}

	:global(:root[data-theme='light']) .v1-footer__wordmark {
		color: #1d1d1f;
	}

	.v1-footer__tagline {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.62rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(194, 179, 154, 0.45);
		margin-top: 0.35rem;
		display: block;
	}

	:global(:root[data-theme='light']) .v1-footer__tagline {
		color: #5a5249;
	}

	.v1-footer__since {
		font-size: 0.75rem;
		font-weight: 300;
		color: rgba(194, 179, 154, 0.4);
		margin-top: 0.25rem;
		display: block;
	}

	:global(:root[data-theme='light']) .v1-footer__since {
		color: #5a5249;
	}

	.v1-footer__col-title {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.62rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(194, 179, 154, 0.5);
		display: block;
		margin-bottom: 0.65rem;
	}

	:global(:root[data-theme='light']) .v1-footer__col-title {
		color: #1d1d1f;
	}

	.v1-footer__text {
		font-size: 0.8rem;
		font-weight: 300;
		color: rgba(194, 179, 154, 0.55);
		line-height: 1.65;
		margin: 0;
	}

	.v1-footer__text a {
		color: rgba(194, 179, 154, 0.55);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.v1-footer__text a:hover {
		color: var(--yc-maple-gold);
	}

	:global(:root[data-theme='light']) .v1-footer__text,
	:global(:root[data-theme='light']) .v1-footer__text a {
		color: #5a5249;
	}

	:global(:root[data-theme='light']) .v1-footer__text a:hover {
		color: #7a5d10;
	}

	.v1-footer__bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1.5rem;
		border-top: 1px solid var(--yc-griege-06);
		font-size: 0.72rem;
		font-weight: 300;
		color: rgba(194, 179, 154, 0.35);
	}

	:global(:root[data-theme='light']) .v1-footer__bottom {
		color: #5a5249;
		border-top-color: rgba(90, 77, 53, 0.1);
	}

	.v1-footer__portal-link {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.62rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(194, 179, 154, 0.4);
		text-decoration: none;
		padding: 0.5rem 0.75rem;
		border-radius: 8px;
		border: 1px solid var(--yc-griege-08);
		transition: color 0.2s ease, border-color 0.2s ease;
		min-height: 44px;
		display: flex;
		align-items: center;
	}

	.v1-footer__portal-link:hover {
		color: var(--yc-maple-gold);
		border-color: var(--yc-maple-gold-35);
	}

	:global(:root[data-theme='light']) .v1-footer__portal-link {
		color: #5a5249;
		border-color: rgba(90, 77, 53, 0.16);
	}

	:global(:root[data-theme='light']) .v1-footer__portal-link:hover {
		color: #7a5d10;
		border-color: rgba(138, 106, 20, 0.3);
	}
</style>
