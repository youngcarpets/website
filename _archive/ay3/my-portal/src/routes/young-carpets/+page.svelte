<script lang="ts">
	// Young Carpets Inc. — Info-only commercial flooring website
	// Dark mode, real architectural floor plan as a 3-layer parallax backdrop:
	//   Layer 1 — bg.jpg "paper" @ 0.25x scroll
	//   Layer 2 — ghost plan (same image, scaled+rotated, lower opacity) @ 0.50x
	//   Layer 3 — drafting grid (CSS pattern) @ 0.75x
	import { env as publicEnv } from '$env/dynamic/public';
	import { dev } from '$app/environment';
	import pkg from '../../../package.json';
	import '$lib/styles/young-carpets-tokens.css';
	import '$lib/styles/young-carpets.css';
	import { reveal, cardPointer, countUp, scrollToHash } from '$lib/actions';
	import { type Product, featureProducts, otherProducts } from './data/products';
	import { suppliers } from './data/suppliers';
	import YcNav from './components/YcNav.svelte';
	import YcHero from './components/YcHero.svelte';
	import YcFooter from './components/YcFooter.svelte';
	import YcSuppliersMarquee from './components/YcSuppliersMarquee.svelte';
	import YcServicesSection from './components/YcServicesSection.svelte';
	import YcAboutSection from './components/YcAboutSection.svelte';
	import YcContactSection from './components/YcContactSection.svelte';
	import YcMapSection from './components/YcMapSection.svelte';
	import YcMapModal from './components/YcMapModal.svelte';
	import YcProductsSection from './components/YcProductsSection.svelte';
	import YcProductModal from './components/YcProductModal.svelte';
	import DevColorPicker from './components/DevColorPicker.svelte';

	// Dev-only version badge — floats top-right of viewport. Removed before production.
	const ycVersion = pkg.version;

	// If a Google Maps JS API key is provided, the map upgrades to a fully
	// dark-styled custom map. If not, the existing dark-filtered iframe is the
	// fallback. Set PUBLIC_GOOGLE_MAPS_API_KEY in my-portal/.env to enable.
	const googleMapsApiKey = publicEnv.PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
	const useCustomMap = googleMapsApiKey.length > 0;
	// Approximate coordinates of 1228 Old Innes Rd, Ottawa, ON K1B 3V3
	const officeLat = 45.4429;
	const officeLng = -75.6094;


	let openProduct: Product | null = $state(null);
	let mapModalOpen: boolean = $state(false);



	function showProduct(p: Product) {
		openProduct = p;
	}
	function closeProduct() {
		openProduct = null;
	}
	function openMap() {
		mapModalOpen = true;
	}
	function closeMap() {
		mapModalOpen = false;
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		if (!mapModalOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') closeMap();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});


	let pageEl: HTMLDivElement | null = $state(null);

	// v1.20.4: device-tilt backdrop parallax. Additive to the locked
	// 3-layer scroll parallax (see RELAY LOCKED + INDEX Global Protected).
	// Uses CSS `translate` property on the layers, not `transform`, so
	// this composes WITHOUT touching the locked transform strings.
	let motionGranted = $state(false);
	let motionSupported = $state(false);
	let motionNeedsTap = $state(false);
	let tiltX = 0;
	let tiltY = 0;
	let targetTiltX = 0;
	let targetTiltY = 0;

	function onDeviceOrientation(e: DeviceOrientationEvent) {
		const gamma = e.gamma ?? 0; // left/right tilt, -90..90
		const beta = e.beta ?? 0; // front/back tilt, -180..180
		// Clamp + normalize to -1..1. Offset beta by 45deg (typical phone hold).
		targetTiltX = Math.max(-1, Math.min(1, gamma / 45));
		targetTiltY = Math.max(-1, Math.min(1, (beta - 45) / 45));
	}

	async function enableMotion() {
		if (typeof window === 'undefined') return;
		if (motionGranted) return;
		const DOE = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
			requestPermission?: () => Promise<'granted' | 'denied'>;
		};
		if (!DOE) return;
		if (typeof DOE.requestPermission === 'function') {
			try {
				const res = await DOE.requestPermission();
				if (res === 'granted') {
					motionGranted = true;
					motionNeedsTap = false;
					window.addEventListener('deviceorientation', onDeviceOrientation);
				}
			} catch {
				// user denied or error — silently fall back to scroll-only
			}
		} else {
			// Android / other — no permission prompt needed
			motionGranted = true;
			motionNeedsTap = false;
			window.addEventListener('deviceorientation', onDeviceOrientation);
		}
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		const prm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prm) return;

		const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

		// Check if DeviceOrientation is supported
		const DOE = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
			requestPermission?: () => Promise<'granted' | 'denied'>;
		};
		motionSupported = !!DOE;
		// v1.24.49: iOS device-tilt parallax flow PARKED.
		//
		// Calling DeviceOrientationEvent.requestPermission() (the iOS 13+
		// gating call) triggers the system "Access Motion and Orientation"
		// popup the first time a user taps the Proudly Canadian badge.
		// Confirmed by A/B test on 2026-04-09: short-circuiting this branch
		// makes the popup go away cleanly. So the parallax flow IS the
		// source — not a related side-effect, not a coincidence.
		//
		// The user does not want to ship a feature that prompts a
		// permission popup on a tap that looks like a static label.
		// Re-enable only if a workaround is found (e.g. moving the
		// requestPermission() gesture to a dedicated "enable parallax"
		// pill somewhere else on the page so the badge stays decorative).
		//
		// Desktop pointer parallax (lines below) and the floor-plan rAF
		// lerp loop both still run — only the iOS device-tilt path is
		// disabled. To re-enable, delete the `false && ` on the next line.
		// See `.claude/reference/known-deferred-fixes.md` item 5 for
		// the gating event and full context.
		if (false && isTouch && motionSupported) {
			if (typeof DOE?.requestPermission === 'function') {
				// iOS 13+: needs a tap on the maple badge to grant
				motionNeedsTap = true;
			} else {
				// Android / older iOS: attach listener immediately
				motionGranted = true;
				window.addEventListener('deviceorientation', onDeviceOrientation);
			}
		}

		// Desktop pointer fallback — drives tilt via mousemove
		const onPointer = (e: PointerEvent) => {
			if (isTouch) return;
			const cx = window.innerWidth * 0.5;
			const cy = window.innerHeight * 0.5;
			targetTiltX = Math.max(-1, Math.min(1, (e.clientX - cx) / cx));
			targetTiltY = Math.max(-1, Math.min(1, (e.clientY - cy) / cy));
		};
		const onLeave = () => {
			if (isTouch) return;
			targetTiltX = 0;
			targetTiltY = 0;
		};
		if (!isTouch) {
			window.addEventListener('pointermove', onPointer, { passive: true });
			window.addEventListener('pointerleave', onLeave, { passive: true });
		}

		// rAF lerp loop smooths target → actual
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
			window.removeEventListener('deviceorientation', onDeviceOrientation);
		};
	});

	$effect(() => {
		if (typeof window === 'undefined') return;

		// Honor reduced-motion: skip the scroll listener entirely
		const prm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prm) return;

		let raf = 0;
		const onScroll = () => {
			if (raf) return;
			raf = requestAnimationFrame(() => {
				if (pageEl) pageEl.style.setProperty('--yc-scroll', String(window.scrollY));
				raf = 0;
			});
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScroll);
			if (raf) cancelAnimationFrame(raf);
		};
	});
</script>

<svelte:head>
	<title>Young Carpets Inc. — Commercial Flooring | Ottawa, ON</title>
	<meta
		name="description"
		content="Young Carpets Inc. — Commercial flooring in Ottawa since 1991. Supply, installation, maintenance — for offices, institutions, and retail."
	/>
	<meta name="theme-color" content="#0b0b0d" />
	<link rel="canonical" href="https://www.youngcarpets.com/" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Young Carpets Inc." />
	<meta property="og:title" content="Young Carpets Inc. — Commercial Flooring | Ottawa" />
	<meta
		property="og:description"
		content="Commercial flooring in Ottawa since 1991. Supply, installation, maintenance — for offices, institutions, and retail."
	/>
	<meta property="og:url" content="https://www.youngcarpets.com/" />
	<meta property="og:locale" content="en_CA" />

	<!-- Twitter card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Young Carpets Inc. — Commercial Flooring | Ottawa" />
	<meta
		name="twitter:description"
		content="Commercial flooring in Ottawa since 1991. Supply, installation, maintenance — for offices, institutions, and retail."
	/>

	<!-- Structured data — LocalBusiness -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		name: 'Young Carpets Inc.',
		image: 'https://www.youngcarpets.com/young-carpets/bg.jpg',
		url: 'https://www.youngcarpets.com/',
		telephone: '+1-613-744-2744',
		faxNumber: '+1-613-744-2995',
		email: 'info@youngcarpets.com',
		priceRange: '$$',
		description:
			'Commercial flooring in Ottawa since 1991. Supply, installation, and maintenance of carpet, hardwood, LVT, laminate, rubber, and ceramic tile for offices, institutional buildings, healthcare, retail, and industrial.',
		address: {
			'@type': 'PostalAddress',
			streetAddress: 'Unit 316 - 1228 Old Innes Road',
			addressLocality: 'Ottawa',
			addressRegion: 'ON',
			postalCode: 'K1B 3V3',
			addressCountry: 'CA'
		},
		geo: {
			'@type': 'GeoCoordinates',
			latitude: 45.4429,
			longitude: -75.6094
		},
		foundingDate: '1991',
		areaServed: {
			'@type': 'City',
			name: 'Ottawa'
		},
		openingHoursSpecification: [
			{
				'@type': 'OpeningHoursSpecification',
				dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
				opens: '10:00',
				closes: '16:00'
			}
		]
	})}</` + `script>`}
</svelte:head>

<div class="yc-page" bind:this={pageEl}>
	{#if dev}
		<!-- DEV-ONLY version badge - floats above everything, removed before production -->
		<div class="yc-dev-version-badge" aria-hidden="true">v{ycVersion}</div>
	{/if}

	<!-- Skip to content \u2014 keyboard + screen reader shortcut past the nav -->
	<a class="yc-skip-link" href="#products">Skip to content</a>

	<!-- \u2500\u2500 3-layer architectural plan parallax backdrop \u2500\u2500 -->
	<div class="yc-bg-plan" aria-hidden="true">
		<img class="yc-bg-plan-img yc-bg-plan-layer-1" src="/young-carpets/bg.jpg" alt="" />
		<img class="yc-bg-plan-img yc-bg-plan-layer-2" src="/young-carpets/bg.jpg" alt="" />
		<div class="yc-bg-plan-grid yc-bg-plan-layer-3"></div>
	</div>

	<!-- ── Floating pill navbar ── -->
	<YcNav />

	<!-- ── Hero ── -->
	<YcHero {motionNeedsTap} {motionGranted} onEnableMotion={enableMotion} />

	<!-- ── Products ── -->
	<YcProductsSection
		products={featureProducts}
		{otherProducts}
		onProductClick={showProduct}
	/>

	<!-- ── Suppliers / Brands We Work With ── -->
	<YcSuppliersMarquee {suppliers} />

	<!-- ── Services ── -->
	<YcServicesSection />

	<!-- ── About ── -->
	<YcAboutSection />

	<!-- ── Map / Find Us ── -->
	<YcMapSection onOpen={openMap} />

	<!-- ── Contact / Our Team ── -->
	<YcContactSection />

	<!-- ── Product modal ── -->
	<YcProductModal {openProduct} onClose={closeProduct} />

	<!-- ── Map modal ── -->
	<YcMapModal open={mapModalOpen} onClose={closeMap} />

	<!-- ── Footer ── -->
	<YcFooter />

	{#if dev}<DevColorPicker />{/if}
</div>

