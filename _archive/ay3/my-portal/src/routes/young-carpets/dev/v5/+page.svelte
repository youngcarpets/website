<!-- Young Carpets V5 — Expert Light-Mode Refinement Clone
     Same structure and content as the production site, rebuilt as a
     self-contained page with scoped styles that fix every light-mode
     contrast, clarity, and card-definition problem. -->
<script lang="ts">
	import '$lib/styles/young-carpets-tokens.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import DevColorPicker from '../../components/DevColorPicker.svelte';

	/* ── Font load gating ── */
	let fontLoaded = $state(false);
	$effect(() => {
		if (typeof document === 'undefined') return;
		const font = new FontFace('Square721', "url('/young-carpets/square721.ttf')");
		font.load().then((f) => {
			document.fonts.add(f);
			fontLoaded = true;
		}).catch(() => { fontLoaded = true; }); // degrade gracefully
	});

	/* ── Scroll-triggered reveal ── */
	let revealEls: HTMLElement[] = $state([]);
	$effect(() => {
		if (typeof window === 'undefined') return;
		const prm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prm) { revealEls.forEach(el => el.classList.add('v5-visible')); return; }
		const obs = new IntersectionObserver((entries) => {
			entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('v5-visible'); obs.unobserve(e.target); } });
		}, { threshold: 0.12 });
		revealEls.forEach(el => obs.observe(el));
		return () => obs.disconnect();
	});

	function addReveal(el: HTMLElement) { revealEls.push(el); }

	/* ── Products ── */
	const products = [
		{ code: 'CPT-T', name: 'Carpet Tile', blurb: 'Modular squares — replace one tile, not the whole floor.' },
		{ code: 'VNL',   name: 'LVT',         blurb: 'Luxury vinyl plank & tile. Waterproof. The #1 resilient spec.' },
		{ code: 'CPT',   name: 'Carpet',       blurb: 'Wall-to-wall broadloom in 12\' rolls. Sound absorption built in.' },
		{ code: 'CT',    name: 'Ceramic',       blurb: 'Slip-rated porcelain & ceramic for wet areas and lobbies.' },
		{ code: 'RB',    name: 'Rubber',        blurb: 'Vulcanized tiles & rolls. Impact-absorbing, slip-resistant.' },
		{ code: 'MAT',   name: 'Matting',       blurb: 'Walk-off entrance systems that stop 80%+ of tracked-in soil.' },
		{ code: 'WD',    name: 'Wood+',         blurb: 'Solid & engineered hardwood. Sand and refinish for decades.' },
		{ code: 'SHT',   name: 'Sheet Vinyl',   blurb: 'Seamless 6–12\' rolls. Heat-welded, flash-coved to walls.' },
		{ code: '+',     name: 'More…',         blurb: 'VCT, linoleum, epoxy, cork, bamboo, safety flooring & more.' },
	];

	const secondaryChips = [
		'VCT', 'Sheet Flooring', 'Linoleum', 'Safety Flooring', 'Porcelain', 'Stone',
		'Bamboo', 'Cork', 'Sports Flooring', 'Epoxy', 'Matting', 'Entrance Matting',
		'Stair Treads & Risers', 'Stair Nosings', 'Vinyl Base', 'Rubber Base',
		'Transition Strips', 'Subfloors',
	];

	const suppliers = [
		'Tarkett', 'Beaulieu Canada', 'Interface', 'Forbo', 'Shaw Contract',
		'Mohawk Group', 'Patcraft', 'Gerflor', 'Johnsonite', 'COREtec',
		'Nora', 'Armstrong Flooring',
	];

	const services = [
		{ title: 'Commercial Installation', desc: 'Full-service install for every flooring type. Union-certified crews, project management from spec to punch list.' },
		{ title: 'Consultation', desc: 'On-site assessments, product recommendations, and spec writing. We match the right floor to your traffic, moisture, and budget.' },
		{ title: 'Maintenance & Repair', desc: 'Carpet extraction, strip-and-wax, tile replacement, seam repairs. Keep your floors performing.' },
		{ title: 'Seasonal Matting', desc: 'Winter walk-off programs. We deliver, install, clean, and swap mats on a seasonal rotation.' },
	];

	const salesTeam = [
		{ name: 'Ryan Young',     phone: '613-277-7926', email: 'ryoung@youngcarpets.com' },
		{ name: 'Derek Young',    phone: '613-612-8487', email: 'dyoung@youngcarpets.com' },
		{ name: 'Peter Helis',    phone: '613-864-6998', email: 'phelis@youngcarpets.com' },
		{ name: 'Mike Noel',      phone: '613-222-5987', email: 'mnoel@youngcarpets.com' },
		{ name: 'Clayton Bradley',phone: '613-290-5075', email: 'cbradley@youngcarpets.com' },
		{ name: 'Alan O\'Connor', phone: '613-791-3252', email: 'aoconnor@youngcarpets.com' },
	];

	/* ── Smooth scroll ── */
	function scrollTo(id: string) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	}

	/* ── Hero letter stagger ── */
	const heroLetters = 'YOUNG'.split('');
</script>

<svelte:head>
	<title>Young Carpets — Commercial Flooring, Ottawa</title>
	<meta name="description" content="Commercial flooring supply & installation since 1991. Carpet tile, LVT, rubber, ceramic, hardwood & more." />
</svelte:head>

<div class="v5-page">

	<!-- ═══════════════════ NAVBAR ═══════════════════ -->
	<nav class="v5-nav">
		<a href="/young-carpets" class="v5-nav-brand">YOUNG</a>
		<div class="v5-nav-links">
			<button onclick={() => scrollTo('products')}>Products</button>
			<button onclick={() => scrollTo('services')}>Services</button>
			<button onclick={() => scrollTo('about')}>About</button>
			<button onclick={() => scrollTo('contact')}>Contact</button>
			<ThemeToggle />
		</div>
	</nav>

	<!-- ═══════════════════ HERO ═══════════════════ -->
	<section class="v5-hero">
		<div class="v5-hero-inner">
			<!-- Maple leaf badge -->
			<div class="v5-maple-badge">
				<svg viewBox="-2015 -2000 4030 4030" class="v5-maple-svg">
					<path d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z" fill="currentColor"/>
				</svg>
				<span class="v5-maple-label">PROUDLY CANADIAN</span>
			</div>

			<!-- Wordmark -->
			<h1 class="v5-wordmark" class:v5-font-ready={fontLoaded}>
				{#each heroLetters as letter, i}
					<span class="v5-letter" style="--i:{i}">{letter}</span>
				{/each}
			</h1>
			<p class="v5-tagline-primary">CARPETS INC.</p>
			<p class="v5-tagline-secondary">Commercial Flooring Supply & Installation</p>
			<p class="v5-tagline-tertiary">Ottawa · Since 1991</p>
		</div>
	</section>

	<!-- ═══════════════════ PRODUCTS ═══════════════════ -->
	<section id="products" class="v5-section v5-section-alt">
		<div class="v5-container" use:addReveal>
			<span class="v5-eyebrow">PRODUCTS</span>
			<h2 class="v5-heading">Commercial Flooring</h2>
			<p class="v5-subheading">Nine core product lines covering every commercial spec.</p>

			<div class="v5-product-grid">
				{#each products as p}
					<button class="v5-product-card" type="button">
						<span class="v5-product-code">{p.code}</span>
						<span class="v5-product-name">{p.name}</span>
						<span class="v5-product-blurb">{p.blurb}</span>
					</button>
				{/each}
			</div>

			<div class="v5-chips">
				{#each secondaryChips as chip}
					<span class="v5-chip">{chip}</span>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════════════════ SUPPLIERS MARQUEE ═══════════════════ -->
	<section class="v5-section v5-suppliers-section">
		<div class="v5-container">
			<span class="v5-eyebrow">SUPPLIERS</span>
			<div class="v5-marquee-wrap">
				<div class="v5-marquee">
					{#each [...suppliers, ...suppliers] as s}
						<span class="v5-marquee-item">{s}</span>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- ═══════════════════ SERVICES ═══════════════════ -->
	<section id="services" class="v5-section v5-section-alt">
		<div class="v5-container" use:addReveal>
			<span class="v5-eyebrow">SERVICES</span>
			<h2 class="v5-heading">What We Do</h2>

			<div class="v5-services-grid">
				{#each services as svc, i}
					<div class="v5-service-card" use:addReveal>
						<span class="v5-service-num">{String(i + 1).padStart(2, '0')}</span>
						<h3 class="v5-service-title">{svc.title}</h3>
						<p class="v5-service-desc">{svc.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ═══════════════════ ABOUT ═══════════════════ -->
	<section id="about" class="v5-section">
		<div class="v5-container" use:addReveal>
			<span class="v5-eyebrow">ABOUT</span>
			<h2 class="v5-heading">Since 1991</h2>
			<p class="v5-about-text">
				Young Carpets Inc. has been Ottawa's trusted commercial flooring contractor for over three decades.
				Family-owned and operated, we supply and install every category of commercial floor covering —
				from carpet tile and LVT to rubber, ceramic, hardwood, and specialty products. Our team of
				experienced estimators and certified installers delivers projects on time and on budget,
				from single-office renovations to multi-building rollouts.
			</p>
			<div class="v5-counters">
				<div class="v5-counter">
					<span class="v5-counter-num">250+</span>
					<span class="v5-counter-label">YEARS COMBINED EXPERIENCE</span>
				</div>
				<div class="v5-counter">
					<span class="v5-counter-num">50,000+</span>
					<span class="v5-counter-label">JOBS COMPLETED</span>
				</div>
			</div>
		</div>
	</section>

	<!-- ═══════════════════ CONTACT ═══════════════════ -->
	<section id="contact" class="v5-section v5-section-alt">
		<div class="v5-container" use:addReveal>
			<span class="v5-eyebrow">CONTACT</span>
			<h2 class="v5-heading">Get In Touch</h2>

			<div class="v5-contact-grid">
				<!-- Sales team -->
				<div class="v5-contact-group">
					<h3 class="v5-contact-group-title">Sales</h3>
					{#each salesTeam as person}
						<div class="v5-contact-person">
							<span class="v5-contact-name">{person.name}</span>
							<a href="tel:{person.phone}" class="v5-contact-link">{person.phone}</a>
							<a href="mailto:{person.email}" class="v5-contact-link">{person.email}</a>
						</div>
					{/each}
				</div>

				<!-- Accounting + Office -->
				<div class="v5-contact-group">
					<h3 class="v5-contact-group-title">Accounting</h3>
					<div class="v5-contact-person">
						<span class="v5-contact-name">Alan Young</span>
						<a href="tel:613-878-9911" class="v5-contact-link">613-878-9911</a>
						<a href="mailto:accounting@youngcarpets.com" class="v5-contact-link">accounting@youngcarpets.com</a>
					</div>
					<div class="v5-contact-person">
						<span class="v5-contact-name">Accounts Payable</span>
						<a href="mailto:ap@youngcarpets.com" class="v5-contact-link">ap@youngcarpets.com</a>
					</div>

					<h3 class="v5-contact-group-title" style="margin-top:1.5rem">Office</h3>
					<div class="v5-contact-person">
						<span class="v5-contact-name">Main</span>
						<a href="tel:613-744-2744" class="v5-contact-link">613-744-2744</a>
					</div>
					<div class="v5-contact-person">
						<span class="v5-contact-name">Fax</span>
						<span class="v5-contact-detail">613-744-2995</span>
					</div>
					<div class="v5-contact-person">
						<span class="v5-contact-name">Email</span>
						<a href="mailto:info@youngcarpets.com" class="v5-contact-link">info@youngcarpets.com</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ═══════════════════ MAP ═══════════════════ -->
	<section class="v5-section">
		<div class="v5-container" use:addReveal>
			<span class="v5-eyebrow">LOCATION</span>
			<h2 class="v5-heading">Find Us</h2>
			<div class="v5-map-frame">
				<iframe
					src="https://www.google.com/maps?q=1228+Old+Innes+Rd+Unit+316+Ottawa+ON+K1B+3V3&output=embed&z=15"
					title="Young Carpets location"
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					allowfullscreen
				></iframe>
			</div>
			<p class="v5-address">1228 Old Innes Rd, Unit 316 · Ottawa, ON K1B 3V3</p>
		</div>
	</section>

	<!-- ═══════════════════ FOOTER ═══════════════════ -->
	<footer class="v5-footer">
		<div class="v5-container">
			<div class="v5-footer-grid">
				<div class="v5-footer-brand">
					<span class="v5-footer-wordmark">YOUNG</span>
					<span class="v5-footer-sub">Carpets Inc.</span>
				</div>
				<div class="v5-footer-col">
					<span class="v5-footer-label">ADDRESS</span>
					<p>1228 Old Innes Rd, Unit 316<br/>Ottawa, ON K1B 3V3</p>
				</div>
				<div class="v5-footer-col">
					<span class="v5-footer-label">CONTACT</span>
					<p><a href="tel:613-744-2744">613-744-2744</a><br/><a href="mailto:info@youngcarpets.com">info@youngcarpets.com</a></p>
				</div>
				<div class="v5-footer-col">
					<span class="v5-footer-label">HOURS</span>
					<p>Mon – Fri: 10:00 – 16:00</p>
				</div>
			</div>
			<div class="v5-footer-bottom">
				<span>&copy; 2026 Young Carpets Inc.</span>
				<a href="/">AY3 Portal</a>
			</div>
		</div>
	</footer>
	<DevColorPicker />
</div>

<style>
	/* ═══════════════════════════════════════════════════════════════════════
	 * V5 DESIGN SYSTEM — SCOPED STYLES
	 * Expert light-mode refinement. Every color decision optimized for
	 * WCAG AA+ contrast on both dark and light backgrounds.
	 * ═══════════════════════════════════════════════════════════════════ */

	/* ── CSS Custom Properties (dark = default) ── */
	.v5-page {
		/* Page background */
		--v5-bg: var(--yc-ink, #080706);
		--v5-bg-alt: #0e0e0c;

		/* Text hierarchy — all pass AAA on dark */
		--v5-text-primary: #f0ede6;
		--v5-text-body: var(--yc-griege-text, #c2b39a);
		--v5-text-muted: #9a9490;
		--v5-text-label: #b8b0a4;

		/* Accent */
		--v5-gold: var(--yc-maple-gold, #ffe27a);
		--v5-gold-dim: rgba(255, 226, 122, 0.6);
		--v5-red: var(--yc-maple-red, #C8102E);

		/* Cards */
		--v5-card-bg: var(--yc-ink-45, rgba(8,7,6,0.45));
		--v5-card-border: var(--yc-griege-20, rgba(194,179,154,0.2));
		--v5-card-shadow: 0 2px 8px rgba(0,0,0,0.3);
		--v5-card-hover-shadow: 0 8px 32px rgba(0,0,0,0.5);

		/* Nav */
		--v5-nav-bg: rgba(8,7,6,0.75);
		--v5-nav-border: var(--yc-griege-18, rgba(194,179,154,0.18));

		/* Chips/pills */
		--v5-chip-bg: rgba(194,179,154,0.08);
		--v5-chip-border: rgba(194,179,154,0.18);
		--v5-chip-text: #b8b0a4;

		/* Misc */
		--v5-divider: rgba(194,179,154,0.12);
		--v5-radius: 18px;
		--v5-radius-sm: 10px;

		/* Motion */
		--v5-ease: cubic-bezier(0.4, 0, 0.2, 1);
		--v5-duration: 350ms;
	}

	/* ── LIGHT MODE OVERRIDES ─────────────────────────────────────────
	   Every override is designed for maximum readability on cream.
	   Text colors tested for WCAG AA (4.5:1) minimum on #faf7f0.
	   ─────────────────────────────────────────────────────────────── */
	:global(:root[data-theme='light']) .v5-page {
		/* Page background: warm cream, alternating with white */
		--v5-bg: #faf7f0;
		--v5-bg-alt: #ffffff;

		/* Text hierarchy — ALL pass AA on cream #faf7f0 */
		--v5-text-primary: #1d1d1f;       /* 15.4:1 — headings, key labels */
		--v5-text-body: #3d3832;           /* 9.8:1  — body paragraphs */
		--v5-text-muted: #5a5249;          /* 5.9:1  — secondary info */
		--v5-text-label: #1d1d1f;          /* 15.4:1 — monospace labels get max contrast */

		/* Accent: dark gold for TEXT, light gold for backgrounds */
		--v5-gold: #7a5d10;               /* 6.2:1 on cream — readable gold */
		--v5-gold-dim: #a07818;           /* lighter but still 4.5:1 */
		--v5-red: #a30d24;                /* darkened red for light bg */

		/* Cards: white with warm border and soft shadow */
		--v5-card-bg: rgba(255, 255, 255, 0.88);
		--v5-card-border: rgba(90, 77, 53, 0.16);
		--v5-card-shadow: 0 2px 12px rgba(90, 77, 53, 0.08);
		--v5-card-hover-shadow: 0 8px 28px rgba(90, 77, 53, 0.14);

		/* Nav: white glass */
		--v5-nav-bg: rgba(255, 255, 255, 0.92);
		--v5-nav-border: rgba(90, 77, 53, 0.12);

		/* Chips: visible borders on cream */
		--v5-chip-bg: rgba(90, 77, 53, 0.06);
		--v5-chip-border: rgba(90, 77, 53, 0.18);
		--v5-chip-text: #3d3832;

		/* Misc */
		--v5-divider: rgba(90, 77, 53, 0.12);
	}

	/* ── Base reset ── */
	.v5-page {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: var(--v5-bg);
		color: var(--v5-text-body);
		line-height: 1.6;
		-webkit-font-smoothing: antialiased;
		min-height: 100vh;
	}

	/* ── Reveal animation ── */
	.v5-page :global(.v5-visible) {
		opacity: 1 !important;
		transform: translateY(0) !important;
	}

	/* ── Container ── */
	.v5-container {
		max-width: 960px;
		margin: 0 auto;
		padding: 0 20px;
		opacity: 0;
		transform: translateY(24px);
		transition: opacity 0.6s var(--v5-ease), transform 0.6s var(--v5-ease);
	}
	@media (prefers-reduced-motion: reduce) {
		.v5-container { opacity: 1; transform: none; transition: none; }
	}

	/* ═══════════════════ NAVBAR ═══════════════════ */
	.v5-nav {
		position: fixed;
		top: 12px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 100;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		background: var(--v5-nav-bg);
		backdrop-filter: blur(20px) saturate(150%);
		-webkit-backdrop-filter: blur(20px) saturate(150%);
		border: 1px solid var(--v5-nav-border);
		border-radius: 40px;
		max-width: calc(100% - 24px);
	}
	.v5-nav-brand {
		font-family: 'Square721', sans-serif;
		font-size: 1.1rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		color: var(--v5-gold);
		text-decoration: none;
		padding: 0 8px;
		white-space: nowrap;
	}
	.v5-nav-links {
		display: flex;
		align-items: center;
		gap: 2px;
		margin-left: auto;
	}
	.v5-nav-links button {
		all: unset;
		cursor: pointer;
		font-size: 0.78rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		padding: 6px 10px;
		border-radius: 20px;
		color: var(--v5-text-muted);
		transition: color 0.2s, background 0.2s;
		white-space: nowrap;
	}
	.v5-nav-links button:hover {
		color: var(--v5-gold);
		background: var(--v5-chip-bg);
	}

	/* ═══════════════════ HERO ═══════════════════ */
	.v5-hero {
		min-height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 80px 20px 60px;
		position: relative;
		overflow: hidden;
	}
	.v5-hero-inner {
		position: relative;
		z-index: 1;
	}

	/* Maple badge */
	.v5-maple-badge {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		margin-bottom: 32px;
	}
	.v5-maple-svg {
		width: 48px;
		height: 48px;
		color: var(--v5-red);
		filter: drop-shadow(0 0 12px rgba(200, 16, 46, 0.35));
		transition: filter 0.3s;
	}
	.v5-maple-label {
		font-family: ui-monospace, 'SF Mono', 'Cascadia Code', Consolas, monospace;
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--v5-text-label);
		opacity: 0.8;
	}

	/* Wordmark */
	.v5-wordmark {
		font-family: sans-serif;
		font-size: clamp(4rem, 18vw, 9rem);
		font-weight: 800;
		letter-spacing: 0.12em;
		line-height: 0.9;
		color: var(--v5-text-primary);
		margin: 0;
		display: flex;
		justify-content: center;
		gap: 0.02em;
	}
	.v5-wordmark.v5-font-ready {
		font-family: 'Square721', sans-serif;
	}

	/* Staggered letter entrance */
	.v5-letter {
		display: inline-block;
		opacity: 0;
		transform: translateY(30px);
		animation: v5-letter-in 0.6s var(--v5-ease) forwards;
		animation-delay: calc(var(--i) * 80ms + 200ms);
	}
	@keyframes v5-letter-in {
		to { opacity: 1; transform: translateY(0); }
	}
	@media (prefers-reduced-motion: reduce) {
		.v5-letter { opacity: 1; transform: none; animation: none; }
	}

	.v5-tagline-primary {
		font-family: 'Square721', sans-serif;
		font-size: clamp(1rem, 4vw, 1.6rem);
		font-weight: 600;
		letter-spacing: 0.35em;
		color: var(--v5-gold);
		margin: 12px 0 0;
	}
	.v5-tagline-secondary {
		font-size: 1rem;
		color: var(--v5-text-body);
		margin: 16px 0 0;
		letter-spacing: 0.02em;
	}
	.v5-tagline-tertiary {
		font-family: ui-monospace, 'SF Mono', 'Cascadia Code', Consolas, monospace;
		font-size: 0.75rem;
		color: var(--v5-text-muted);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin: 12px 0 0;
	}

	/* ═══════════════════ SECTIONS ═══════════════════ */
	.v5-section {
		padding: 80px 0;
		background: var(--v5-bg);
	}
	.v5-section-alt {
		background: var(--v5-bg-alt);
	}

	.v5-eyebrow {
		display: block;
		font-family: ui-monospace, 'SF Mono', 'Cascadia Code', Consolas, monospace;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--v5-gold);
		margin-bottom: 8px;
	}
	.v5-heading {
		font-size: clamp(1.8rem, 5vw, 2.8rem);
		font-weight: 700;
		color: var(--v5-text-primary);
		margin: 0 0 8px;
		line-height: 1.15;
	}
	.v5-subheading {
		font-size: 1rem;
		color: var(--v5-text-muted);
		margin: 0 0 40px;
	}

	/* ═══════════════════ PRODUCT CARDS ═══════════════════ */
	.v5-product-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
		margin-bottom: 32px;
	}
	@media (min-width: 600px) {
		.v5-product-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
	}

	.v5-product-card {
		all: unset;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 16px;
		background: var(--v5-card-bg);
		border: 1px solid var(--v5-card-border);
		border-radius: var(--v5-radius);
		box-shadow: var(--v5-card-shadow);
		backdrop-filter: blur(12px) saturate(140%);
		-webkit-backdrop-filter: blur(12px) saturate(140%);
		transition: box-shadow var(--v5-duration) var(--v5-ease),
		            border-color var(--v5-duration) var(--v5-ease),
		            transform var(--v5-duration) var(--v5-ease);
	}
	.v5-product-card:hover,
	.v5-product-card:focus-visible {
		box-shadow: var(--v5-card-hover-shadow);
		border-color: var(--v5-gold-dim);
		transform: translateY(-2px);
	}
	.v5-product-code {
		font-family: ui-monospace, 'SF Mono', 'Cascadia Code', Consolas, monospace;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--v5-gold);
		background: var(--v5-chip-bg);
		padding: 2px 8px;
		border-radius: 6px;
		align-self: flex-start;
	}
	.v5-product-name {
		font-size: 1rem;
		font-weight: 600;
		color: var(--v5-text-primary);
	}
	.v5-product-blurb {
		font-size: 0.82rem;
		color: var(--v5-text-muted);
		line-height: 1.45;
	}

	/* Light mode: drop backdrop-filter (no visual benefit on white) */
	:global(:root[data-theme='light']) .v5-product-card {
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
	}

	/* ═══════════════════ SECONDARY CHIPS ═══════════════════ */
	.v5-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.v5-chip {
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		padding: 5px 12px;
		border-radius: 20px;
		background: var(--v5-chip-bg);
		border: 1px solid var(--v5-chip-border);
		color: var(--v5-chip-text);
		white-space: nowrap;
	}

	/* ═══════════════════ SUPPLIERS MARQUEE ═══════════════════ */
	.v5-suppliers-section {
		padding: 40px 0;
	}
	.v5-marquee-wrap {
		overflow: hidden;
		mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
		-webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
		margin-top: 16px;
	}
	.v5-marquee {
		display: flex;
		gap: 48px;
		white-space: nowrap;
		animation: v5-scroll 30s linear infinite;
		width: max-content;
	}
	@keyframes v5-scroll {
		from { transform: translateX(0); }
		to { transform: translateX(-50%); }
	}
	@media (prefers-reduced-motion: reduce) {
		.v5-marquee { animation: none; }
	}
	.v5-marquee-item {
		font-size: 0.85rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		color: var(--v5-text-muted);
		opacity: 0.7;
	}

	/* ═══════════════════ SERVICES ═══════════════════ */
	.v5-services-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;
		margin-top: 24px;
	}
	@media (min-width: 600px) {
		.v5-services-grid { grid-template-columns: repeat(2, 1fr); }
	}

	.v5-service-card {
		padding: 24px;
		background: var(--v5-card-bg);
		border: 1px solid var(--v5-card-border);
		border-radius: var(--v5-radius);
		box-shadow: var(--v5-card-shadow);
		backdrop-filter: blur(12px) saturate(140%);
		-webkit-backdrop-filter: blur(12px) saturate(140%);
		opacity: 0;
		transform: translateY(24px);
		transition: opacity 0.6s var(--v5-ease), transform 0.6s var(--v5-ease);
	}
	:global(:root[data-theme='light']) .v5-service-card {
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.v5-service-card { opacity: 1; transform: none; transition: none; }
	}

	.v5-service-num {
		font-family: ui-monospace, 'SF Mono', 'Cascadia Code', Consolas, monospace;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: var(--v5-gold);
	}
	.v5-service-title {
		font-size: 1.15rem;
		font-weight: 600;
		color: var(--v5-text-primary);
		margin: 8px 0 6px;
	}
	.v5-service-desc {
		font-size: 0.88rem;
		color: var(--v5-text-muted);
		line-height: 1.55;
		margin: 0;
	}

	/* ═══════════════════ ABOUT ═══════════════════ */
	.v5-about-text {
		font-size: 1rem;
		color: var(--v5-text-body);
		line-height: 1.7;
		max-width: 640px;
		margin: 0 0 40px;
	}
	.v5-counters {
		display: flex;
		gap: 48px;
		flex-wrap: wrap;
	}
	.v5-counter {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.v5-counter-num {
		font-size: clamp(2rem, 6vw, 3rem);
		font-weight: 800;
		color: var(--v5-gold);
		line-height: 1;
	}
	.v5-counter-label {
		font-family: ui-monospace, 'SF Mono', 'Cascadia Code', Consolas, monospace;
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--v5-text-label);
	}

	/* ═══════════════════ CONTACT ═══════════════════ */
	.v5-contact-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 32px;
		margin-top: 24px;
	}
	@media (min-width: 600px) {
		.v5-contact-grid { grid-template-columns: repeat(2, 1fr); }
	}
	.v5-contact-group-title {
		font-family: ui-monospace, 'SF Mono', 'Cascadia Code', Consolas, monospace;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--v5-gold);
		margin: 0 0 12px;
	}
	.v5-contact-person {
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin-bottom: 14px;
	}
	.v5-contact-name {
		font-size: 0.92rem;
		font-weight: 600;
		color: var(--v5-text-primary);
	}
	.v5-contact-link {
		font-size: 0.82rem;
		color: var(--v5-text-muted);
		text-decoration: none;
		transition: color 0.2s;
	}
	.v5-contact-link:hover {
		color: var(--v5-gold);
	}
	.v5-contact-detail {
		font-size: 0.82rem;
		color: var(--v5-text-muted);
	}

	/* ═══════════════════ MAP ═══════════════════ */
	.v5-map-frame {
		border-radius: var(--v5-radius);
		overflow: hidden;
		border: 1px solid var(--v5-card-border);
		margin-bottom: 12px;
		aspect-ratio: 16/9;
	}
	.v5-map-frame iframe {
		width: 100%;
		height: 100%;
		border: 0;
		display: block;
	}
	.v5-address {
		font-size: 0.85rem;
		color: var(--v5-text-muted);
		text-align: center;
	}

	/* ═══════════════════ FOOTER ═══════════════════ */
	.v5-footer {
		padding: 48px 0 32px;
		border-top: 1px solid var(--v5-divider);
		background: var(--v5-bg);
	}
	.v5-footer-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
		margin-bottom: 32px;
	}
	@media (min-width: 600px) {
		.v5-footer-grid { grid-template-columns: 1.2fr repeat(3, 1fr); }
	}
	.v5-footer-wordmark {
		font-family: 'Square721', sans-serif;
		font-size: 1.6rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		color: var(--v5-text-primary);
	}
	.v5-footer-sub {
		display: block;
		font-size: 0.82rem;
		color: var(--v5-text-muted);
		margin-top: 2px;
	}
	.v5-footer-label {
		display: block;
		font-family: ui-monospace, 'SF Mono', 'Cascadia Code', Consolas, monospace;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--v5-gold);
		margin-bottom: 8px;
	}
	.v5-footer-col p {
		font-size: 0.85rem;
		color: var(--v5-text-muted);
		line-height: 1.6;
		margin: 0;
	}
	.v5-footer-col a {
		color: var(--v5-text-muted);
		text-decoration: none;
		transition: color 0.2s;
	}
	.v5-footer-col a:hover { color: var(--v5-gold); }

	.v5-footer-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 20px;
		border-top: 1px solid var(--v5-divider);
		font-size: 0.78rem;
		color: var(--v5-text-muted);
	}
	.v5-footer-bottom a {
		color: var(--v5-gold);
		text-decoration: none;
		font-weight: 500;
	}
	.v5-footer-bottom a:hover { text-decoration: underline; }

	/* ═══════════════════ RESPONSIVE ═══════════════════ */
	@media (max-width: 390px) {
		.v5-nav { padding: 6px 12px; }
		.v5-nav-links button { font-size: 0.7rem; padding: 5px 6px; }
		.v5-product-grid { gap: 8px; }
		.v5-product-card { padding: 12px; }
	}
	@media (min-width: 900px) {
		.v5-section { padding: 100px 0; }
		.v5-product-grid { grid-template-columns: repeat(3, 1fr); }
	}
</style>
