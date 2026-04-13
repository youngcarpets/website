<script lang="ts">
	import { tick } from 'svelte';
	import type { Product } from '$lib/content/products';
	import { productDetails } from '$lib/content/product-details';
	import ModalTabs from './ModalTabs.svelte';
	import SupplierMarquee from './SupplierMarquee.svelte';
	import {
		type TilePattern,
		tilePatternList,
		type HardwoodCard,
		hardwoodCards
	} from '$lib/content/interactions';

	interface Props {
		material: Product['material'];
	}

	let { material }: Props = $props();

	const details = $derived(productDetails[material]);

	let featureOpen = $state(false);

	/* ── LVT: exploded layer diagram state ── */
	let lvtExploded = $state(false);

	const lvtLayers = [
		{ label: 'Wear Layer', opacity: 0.25, h: 10 },
		{ label: 'Print Film', opacity: 0.15, h: 2 },
		{ label: 'Core', opacity: 0.35, h: 70 },
		{ label: 'Backing', opacity: 0.12, h: 20 }
	] as const;

	const lvtColX = 20;
	const lvtColW = 80;
	const lvtLabelX = lvtColX + lvtColW + 8;
	const lvtBaseY = 10;
	const lvtExplodeGap = 14;

	function lvtLayerY(idx: number, open: boolean): number {
		let y = lvtBaseY;
		for (let i = 0; i < idx; i++) y += lvtLayers[i]!.h;
		if (open) y += idx * lvtExplodeGap;
		return y;
	}

	$effect(() => {
		if (material === 'lvt' && featureOpen) {
			lvtExploded = false;
			const id = setTimeout(() => {
				lvtExploded = true;
			}, 1000);
			return () => clearTimeout(id);
		}
	});

	/* ── Carpet: noise path dampening state ── */
	let carpetDampened = $state(false);
	let carpetAutoFired = $state(false);

	$effect(() => {
		if (material === 'carpet' && featureOpen && !carpetAutoFired) {
			const t = setTimeout(() => {
				carpetDampened = true;
				carpetAutoFired = true;
			}, 3000);
			return () => clearTimeout(t);
		}
	});

	/* ── Ceramic: grout anatomy step reveal ── */
	let groutStep = $state(0);
	let groutTimer: ReturnType<typeof setTimeout> | null = null;

	function playGroutSequence() {
		if (groutTimer) clearTimeout(groutTimer);
		groutStep = 0;
		const advance = (n: number) => {
			groutStep = n;
			if (n < 5) groutTimer = setTimeout(() => advance(n + 1), 700);
		};
		groutTimer = setTimeout(() => advance(1), 350);
	}

	$effect(() => {
		if (material === 'ceramic' && featureOpen) {
			playGroutSequence();
			return () => {
				if (groutTimer) {
					clearTimeout(groutTimer);
					groutTimer = null;
				}
			};
		}
	});

	/* ── Carpet Tile: tile morph state ── */
	let activeTilePattern: TilePattern = $state('monolithic');
	let radiogroupEl: HTMLDivElement | undefined = $state();

	async function handlePillKeydown(e: KeyboardEvent, index: number) {
		let nextIndex: number | null = null;
		if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
			nextIndex = (index + 1) % tilePatternList.length;
		} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			nextIndex = (index - 1 + tilePatternList.length) % tilePatternList.length;
		} else if (e.key === 'Home') {
			nextIndex = 0;
		} else if (e.key === 'End') {
			nextIndex = tilePatternList.length - 1;
		}
		if (nextIndex !== null) {
			e.preventDefault();
			activeTilePattern = tilePatternList[nextIndex]!.id;
			await tick();
			radiogroupEl?.querySelectorAll<HTMLElement>('[role="radio"]')[nextIndex]?.focus();
		}
	}

	const randomRotations: number[] = [
		0, 2, 1, 3, 0, 2, 3, 0, 2, 1, 3, 1, 1, 3, 0, 2, 1, 0, 2, 1, 3, 0, 2, 3, 0, 2, 1, 3, 0, 1, 3, 0,
		2, 1, 3, 2
	];

	function tileTransform(i: number, pattern: TilePattern): string {
		const col = i % 6;
		const row = Math.floor(i / 6);
		let tx = col * 30;
		let ty = row * 30;
		let rot = 0;
		let scale = 1;
		switch (pattern) {
			case 'monolithic':
				rot = 0;
				break;
			case 'quarter':
				rot = (col + row) % 2 === 0 ? 0 : 90;
				break;
			case 'brick':
				if (row % 2 === 1) tx += 15;
				rot = 0;
				break;
			case 'herring':
				rot = (col + row) % 2 === 0 ? 45 : -45;
				scale = 0.7071067811865476;
				break;
			case 'random':
				rot = randomRotations[i]! * 90;
				break;
			case 'ashlar':
				if (col % 2 === 1) ty += 15;
				rot = 0;
				break;
		}
		return `translate(${tx} ${ty}) translate(15 15) rotate(${rot}) scale(${scale}) translate(-15 -15)`;
	}

	/* ── Matting: lobby heatmap zones ── */
	let mattingShowZones = $state(false);

	$effect(() => {
		if (material === 'matting' && featureOpen) {
			mattingShowZones = false;
			const id = setTimeout(() => {
				mattingShowZones = true;
			}, 1500);
			return () => clearTimeout(id);
		}
	});

	/* ── Hardwood: flip cards state ── */
	let flippedCard = $state<HardwoodCard | null>(null);

	function toggleHwFlip(id: HardwoodCard) {
		flippedCard = flippedCard === id ? null : id;
	}

	$effect(() => {
		if (material !== 'hardwood' || !featureOpen) {
			flippedCard = null;
		}
	});

	/* ── Sheet Vinyl: cove-build anatomy state ── */
	const CV = {
		cornerX: 60,
		cornerY: 160,
		r: 22,
		floorRight: 230,
		capY: 100,
		inset: 3,
		seamX: 160
	};
	const CV_ARC_TOP_X = CV.cornerX;
	const CV_ARC_TOP_Y = CV.cornerY - CV.r;
	const CV_ARC_RIGHT_X = CV.cornerX + CV.r;
	const CV_ARC_RIGHT_Y = CV.cornerY;
	const CV_SHEET_R = CV.r - CV.inset;
	const CV_SHEET_FLOOR_Y = CV.cornerY - CV.inset;
	const CV_SHEET_WALL_X = CV.cornerX + CV.inset;
	const CV_SHEET_ARC_FLOOR_X = CV_ARC_RIGHT_X;
	const CV_SHEET_ARC_FLOOR_Y = CV_SHEET_FLOOR_Y;
	const CV_SHEET_ARC_WALL_X = CV_SHEET_WALL_X;
	const CV_SHEET_ARC_WALL_Y = CV_ARC_TOP_Y;
	const COVE_STICK_D = `M ${CV_ARC_TOP_X} ${CV_ARC_TOP_Y} L ${CV.cornerX} ${CV.cornerY} L ${CV_ARC_RIGHT_X} ${CV_ARC_RIGHT_Y} A ${CV.r} ${CV.r} 0 0 1 ${CV_ARC_TOP_X} ${CV_ARC_TOP_Y} Z`;
	const BORDER_PIECE_D = `M ${CV_SHEET_WALL_X} ${CV.capY} L ${CV_SHEET_ARC_WALL_X} ${CV_SHEET_ARC_WALL_Y} A ${CV_SHEET_R} ${CV_SHEET_R} 0 0 0 ${CV_SHEET_ARC_FLOOR_X} ${CV_SHEET_ARC_FLOOR_Y} L ${CV.seamX} ${CV_SHEET_FLOOR_Y}`;
	const FIELD_PIECE_D = `M ${CV.floorRight} ${CV_SHEET_FLOOR_Y} L ${CV.seamX} ${CV_SHEET_FLOOR_Y}`;
	const SHEET_BORDER_LEN = 150;
	const SHEET_FIELD_LEN = 70;

	let coveStep: number = $state(0);
	let coveTimer: ReturnType<typeof setTimeout> | null = null;

	function playCoveSequence() {
		if (coveTimer) clearTimeout(coveTimer);
		coveStep = 0;
		const advance = (n: number) => {
			coveStep = n;
			if (n < 4) coveTimer = setTimeout(() => advance(n + 1), 700);
		};
		coveTimer = setTimeout(() => advance(1), 350);
	}

	$effect(() => {
		if (material === 'sheet' && featureOpen) {
			playCoveSequence();
			return () => {
				if (coveTimer) {
					clearTimeout(coveTimer);
					coveTimer = null;
				}
			};
		}
	});
</script>

{#if details}
	<ModalTabs>
		{#snippet overview()}
			{#if featureOpen}
				<div class="feature-stage">
					<button
						type="button"
						class="feature-back"
						aria-label="Back to overview"
						onclick={() => (featureOpen = false)}
					>
						<svg viewBox="0 0 16 16" aria-hidden="true" width="14" height="14">
							<path
								d="M10 3 L5 8 L10 13"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						Back to overview
					</button>
					<h4 class="feature-title">{details.featureLabel}</h4>

					{#if material === 'carpet-tile'}
						<div class="feature-morph">
							<svg viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
								<defs>
									<clipPath id="tile-morph-clip">
										<rect x="0" y="0" width="180" height="180" />
									</clipPath>
								</defs>
								<g clip-path="url(#tile-morph-clip)">
									{#each Array.from({ length: 36 }, (__, idx) => idx) as i (i)}
										<g class="tile-morph-tile" transform={tileTransform(i, activeTilePattern)}>
											<rect
												x="0"
												y="0"
												width="30"
												height="30"
												rx="2"
												fill="rgba(255, 255, 255, 0.04)"
												stroke="rgba(255, 255, 255, 0.2)"
												stroke-width="0.8"
											/>
											<line
												x1="6"
												y1="6"
												x2="14"
												y2="6"
												stroke="rgba(255, 255, 255, 0.35)"
												stroke-width="1"
												stroke-linecap="round"
											/>
											<line
												x1="6"
												y1="6"
												x2="6"
												y2="14"
												stroke="rgba(255, 255, 255, 0.35)"
												stroke-width="1"
												stroke-linecap="round"
											/>
										</g>
									{/each}
								</g>
							</svg>
						</div>
						<div
							class="pattern-pills"
							role="radiogroup"
							aria-label="Install pattern"
							bind:this={radiogroupEl}
						>
							{#each tilePatternList as p, i (p.id)}
								<button
									type="button"
									class="pattern-pill"
									class:pattern-pill--active={activeTilePattern === p.id}
									role="radio"
									aria-checked={activeTilePattern === p.id}
									tabindex={activeTilePattern === p.id ? 0 : -1}
									onclick={() => (activeTilePattern = p.id)}
									onkeydown={(e) => handlePillKeydown(e, i)}
								>
									{p.label}
								</button>
							{/each}
						</div>
					{:else if material === 'lvt'}
						<div class="feature-explode">
							<svg viewBox="0 0 160 170" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
								{#each lvtLayers as layer, i (layer.label)}
									{@const midY = lvtLayerY(i, false) + layer.h / 2}
									<g
										class="explode-layer"
										class:explode-layer--open={lvtExploded}
										style="--explode-y: {lvtLayerY(i, true) - lvtLayerY(i, false)}px;
											transition-delay: {i * 80}ms;"
									>
										<rect
											x={lvtColX}
											y={lvtLayerY(i, false)}
											width={lvtColW}
											height={layer.h}
											fill="rgba(255, 255, 255, {layer.opacity})"
											stroke="rgba(255, 255, 255, 0.5)"
											stroke-width="0.5"
										/>
										<line
											x1={lvtColX + lvtColW}
											y1={midY}
											x2={lvtLabelX - 2}
											y2={midY}
											stroke="rgba(255, 255, 255, 0.25)"
											stroke-width="0.5"
											opacity="0.5"
										/>
										<text
											x={lvtLabelX}
											y={midY + 2.5}
											font-family="ui-monospace, 'SF Mono', monospace"
											font-size="7"
											letter-spacing="0.05em"
											fill="rgba(255, 255, 255, 0.45)"
										>
											{layer.label}
										</text>
									</g>
								{/each}
							</svg>
						</div>
					{:else if material === 'ceramic'}
						<div class="feature-grout">
							<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
								<defs>
									<pattern
										id="grout-hatch"
										patternUnits="userSpaceOnUse"
										width="6"
										height="6"
										patternTransform="rotate(45)"
									>
										<line
											x1="0"
											y1="0"
											x2="0"
											y2="6"
											stroke="rgba(255,255,255,0.12)"
											stroke-width="1"
										/>
									</pattern>
								</defs>
								<g class="grout-step" class:grout-step--in={groutStep >= 1}>
									<rect x="10" y="120" width="220" height="50" fill="url(#grout-hatch)" />
									<rect
										x="10"
										y="120"
										width="220"
										height="50"
										fill="none"
										stroke="rgba(255,255,255,0.35)"
										stroke-width="1"
									/>
									<line
										x1="165"
										y1="145"
										x2="185"
										y2="145"
										stroke="rgba(255,255,255,0.3)"
										stroke-width="0.6"
									/>
									<text
										x="188"
										y="148"
										font-size="9"
										font-family="ui-monospace, 'SF Mono', monospace"
										fill="rgba(255,255,255,0.45)"
										letter-spacing="0.05em">SLAB</text
									>
								</g>
								<g class="grout-step" class:grout-step--in={groutStep >= 2}>
									<rect
										x="10"
										y="108"
										width="220"
										height="12"
										fill="rgba(255,255,255,0.35)"
										stroke="rgba(255,255,255,0.45)"
										stroke-width="0.6"
									/>
									<circle cx="30" cy="114" r="0.8" fill="rgba(255,255,255,0.22)" />
									<circle cx="60" cy="112" r="0.6" fill="rgba(255,255,255,0.22)" />
									<circle cx="95" cy="115" r="0.7" fill="rgba(255,255,255,0.22)" />
									<circle cx="140" cy="113" r="0.8" fill="rgba(255,255,255,0.22)" />
									<circle cx="175" cy="111" r="0.6" fill="rgba(255,255,255,0.22)" />
									<circle cx="210" cy="114" r="0.7" fill="rgba(255,255,255,0.22)" />
									<line
										x1="165"
										y1="114"
										x2="185"
										y2="127"
										stroke="rgba(255,255,255,0.3)"
										stroke-width="0.6"
									/>
									<text
										x="188"
										y="130"
										font-size="9"
										font-family="ui-monospace, 'SF Mono', monospace"
										fill="rgba(255,255,255,0.45)"
										letter-spacing="0.05em">THINSET</text
									>
								</g>
								<g class="grout-step" class:grout-step--in={groutStep >= 3}>
									<rect
										x="10"
										y="72"
										width="102"
										height="36"
										fill="rgba(255,255,255,0.2)"
										stroke="rgba(255,255,255,0.35)"
										stroke-width="0.8"
										rx="1"
									/>
									<rect
										x="128"
										y="72"
										width="102"
										height="36"
										fill="rgba(255,255,255,0.2)"
										stroke="rgba(255,255,255,0.35)"
										stroke-width="0.8"
										rx="1"
									/>
									<line
										x1="45"
										y1="90"
										x2="45"
										y2="60"
										stroke="rgba(255,255,255,0.3)"
										stroke-width="0.6"
									/>
									<text
										x="14"
										y="55"
										font-size="9"
										font-family="ui-monospace, 'SF Mono', monospace"
										fill="rgba(255,255,255,0.45)"
										letter-spacing="0.05em">TILE BODY</text
									>
								</g>
								<g class="grout-step" class:grout-step--in={groutStep >= 4}>
									<rect
										x="112"
										y="72"
										width="16"
										height="36"
										fill="rgba(255,255,255,0.25)"
										stroke="rgba(255,255,255,0.28)"
										stroke-width="0.6"
									/>
									<circle cx="118" cy="82" r="0.5" fill="rgba(255,255,255,0.3)" />
									<circle cx="122" cy="90" r="0.4" fill="rgba(255,255,255,0.3)" />
									<circle cx="116" cy="98" r="0.5" fill="rgba(255,255,255,0.3)" />
									<line
										x1="120"
										y1="42"
										x2="120"
										y2="70"
										stroke="rgba(255,255,255,0.3)"
										stroke-width="0.6"
									/>
									<text
										x="96"
										y="37"
										font-size="9"
										font-family="ui-monospace, 'SF Mono', monospace"
										fill="rgba(255,255,255,0.45)"
										letter-spacing="0.05em">GROUT</text
									>
								</g>
								<g class="grout-step" class:grout-step--in={groutStep >= 5}>
									<rect
										x="112"
										y="70"
										width="16"
										height="3"
										fill="rgba(255,255,255,0.4)"
										stroke="rgba(255,255,255,0.5)"
										stroke-width="0.4"
										rx="0.5"
									/>
									<line
										x1="130"
										y1="71.5"
										x2="148"
										y2="40"
										stroke="rgba(255,255,255,0.3)"
										stroke-width="0.6"
									/>
									<text
										x="150"
										y="37"
										font-size="9"
										font-family="ui-monospace, 'SF Mono', monospace"
										fill="rgba(255,255,255,0.45)"
										letter-spacing="0.05em">SEALER</text
									>
								</g>
							</svg>
							<p class="grout-caption">
								Side-view cutaway — layers build bottom-up as installed on site.
							</p>
							<button type="button" class="grout-replay" onclick={() => playGroutSequence()}>
								&#x21bb;&ensp;Replay anatomy
							</button>
						</div>
					{:else if material === 'rubber'}
						<div class="feature-impact">
							<svg viewBox="0 0 300 150" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
								<!-- Column 1: 6 mm -->
								<g transform="translate(20, 0)">
									<rect
										x="0"
										y="100"
										width="70"
										height="24"
										rx="2"
										fill="rgba(255,255,255,0.12)"
										stroke="rgba(255,255,255,0.2)"
										stroke-width="0.5"
									/>
									<rect
										class="impact-flash impact-flash--thin"
										x="0"
										y="100"
										width="70"
										height="24"
										rx="2"
										fill="rgba(255,255,255,0.5)"
										opacity="0"
									/>
									<rect
										x="0"
										y="94"
										width="70"
										height="6"
										rx="1"
										fill="rgba(255,255,255,0.2)"
										stroke="rgba(255,255,255,0.15)"
										stroke-width="0.5"
									/>
									<g class="impact-weight impact-weight--thin">
										<circle cx="12" cy="4" r="4" fill="rgba(255,255,255,0.45)" />
										<rect
											x="12"
											y="1"
											width="46"
											height="6"
											rx="1.5"
											fill="rgba(255,255,255,0.45)"
										/>
										<circle cx="58" cy="4" r="4" fill="rgba(255,255,255,0.45)" />
									</g>
									<text
										x="35"
										y="136"
										text-anchor="middle"
										font-family="ui-monospace, 'SF Mono', monospace"
										font-size="8"
										fill="rgba(255,255,255,0.45)"
										letter-spacing="0.05em">6 mm</text
									>
									<text
										x="35"
										y="145"
										text-anchor="middle"
										font-family="ui-monospace, 'SF Mono', monospace"
										font-size="7"
										fill="rgba(255,255,255,0.3)"
										letter-spacing="0.05em">✗</text
									>
								</g>
								<!-- Column 2: 8 mm -->
								<g transform="translate(115, 0)">
									<rect
										x="0"
										y="100"
										width="70"
										height="24"
										rx="2"
										fill="rgba(255,255,255,0.12)"
										stroke="rgba(255,255,255,0.2)"
										stroke-width="0.5"
									/>
									<rect
										class="impact-flash impact-flash--mid"
										x="0"
										y="100"
										width="70"
										height="24"
										rx="2"
										fill="rgba(255,255,255,0.35)"
										opacity="0"
									/>
									<rect
										x="0"
										y="92"
										width="70"
										height="8"
										rx="1"
										fill="rgba(255,255,255,0.2)"
										stroke="rgba(255,255,255,0.15)"
										stroke-width="0.5"
									/>
									<g class="impact-weight impact-weight--mid">
										<circle cx="12" cy="4" r="4" fill="rgba(255,255,255,0.45)" />
										<rect
											x="12"
											y="1"
											width="46"
											height="6"
											rx="1.5"
											fill="rgba(255,255,255,0.45)"
										/>
										<circle cx="58" cy="4" r="4" fill="rgba(255,255,255,0.45)" />
									</g>
									<text
										x="35"
										y="136"
										text-anchor="middle"
										font-family="ui-monospace, 'SF Mono', monospace"
										font-size="8"
										fill="rgba(255,255,255,0.45)"
										letter-spacing="0.05em">8 mm</text
									>
									<text
										x="35"
										y="145"
										text-anchor="middle"
										font-family="ui-monospace, 'SF Mono', monospace"
										font-size="7"
										fill="rgba(255,255,255,0.45)"
										letter-spacing="0.05em">~</text
									>
								</g>
								<!-- Column 3: 12 mm -->
								<g transform="translate(210, 0)">
									<rect
										x="0"
										y="100"
										width="70"
										height="24"
										rx="2"
										fill="rgba(255,255,255,0.12)"
										stroke="rgba(255,255,255,0.2)"
										stroke-width="0.5"
									/>
									<rect
										class="impact-flash impact-flash--thick"
										x="0"
										y="100"
										width="70"
										height="24"
										rx="2"
										fill="rgba(255,255,255,0.15)"
										opacity="0"
									/>
									<rect
										x="0"
										y="88"
										width="70"
										height="12"
										rx="1"
										fill="rgba(255,255,255,0.2)"
										stroke="rgba(255,255,255,0.15)"
										stroke-width="0.5"
									/>
									<g class="impact-weight impact-weight--thick">
										<circle cx="12" cy="4" r="4" fill="rgba(255,255,255,0.45)" />
										<rect
											x="12"
											y="1"
											width="46"
											height="6"
											rx="1.5"
											fill="rgba(255,255,255,0.45)"
										/>
										<circle cx="58" cy="4" r="4" fill="rgba(255,255,255,0.45)" />
									</g>
									<text
										x="35"
										y="136"
										text-anchor="middle"
										font-family="ui-monospace, 'SF Mono', monospace"
										font-size="8"
										fill="rgba(255,255,255,0.45)"
										letter-spacing="0.05em">12 mm</text
									>
									<text
										x="35"
										y="145"
										text-anchor="middle"
										font-family="ui-monospace, 'SF Mono', monospace"
										font-size="7"
										fill="rgba(255,255,255,0.6)"
										letter-spacing="0.05em">✓</text
									>
								</g>
							</svg>
						</div>
					{:else if material === 'matting'}
						<div class="feature-heatmap">
							<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
								<defs>
									<radialGradient id="mat-heat-core" cx="50%" cy="12%" r="55%" fx="50%" fy="12%">
										<stop offset="0%" stop-color="rgba(255,255,255,0.35)" />
										<stop offset="30%" stop-color="rgba(255,255,255,0.18)" />
										<stop offset="60%" stop-color="rgba(255,255,255,0.12)" />
										<stop offset="100%" stop-color="rgba(255,255,255,0)" />
									</radialGradient>
									<radialGradient id="mat-heat-left" cx="25%" cy="10%" r="35%">
										<stop offset="0%" stop-color="rgba(255,255,255,0.2)" />
										<stop offset="55%" stop-color="rgba(255,255,255,0.08)" />
										<stop offset="100%" stop-color="rgba(255,255,255,0)" />
									</radialGradient>
									<radialGradient id="mat-heat-right" cx="75%" cy="10%" r="35%">
										<stop offset="0%" stop-color="rgba(255,255,255,0.2)" />
										<stop offset="55%" stop-color="rgba(255,255,255,0.08)" />
										<stop offset="100%" stop-color="rgba(255,255,255,0)" />
									</radialGradient>
									<pattern id="mat-grid" patternUnits="userSpaceOnUse" width="6" height="6">
										<line
											x1="0"
											y1="3"
											x2="6"
											y2="3"
											stroke="rgba(255,255,255,0.35)"
											stroke-width="0.5"
											stroke-linecap="round"
										/>
										<line
											x1="3"
											y1="0"
											x2="3"
											y2="6"
											stroke="rgba(255,255,255,0.35)"
											stroke-width="0.5"
											stroke-linecap="round"
										/>
									</pattern>
									<pattern id="mat-pile" patternUnits="userSpaceOnUse" width="4" height="4">
										<line
											x1="2"
											y1="0"
											x2="2"
											y2="4"
											stroke="rgba(255,255,255,0.45)"
											stroke-width="0.6"
											stroke-linecap="round"
										/>
									</pattern>
								</defs>
								<!-- Lobby floor -->
								<rect
									x="10"
									y="6"
									width="300"
									height="148"
									rx="4"
									fill="rgba(255,255,255,0.05)"
									stroke="rgba(255,255,255,0.28)"
									stroke-width="1"
								/>
								<!-- Door opening -->
								<line
									x1="110"
									y1="6"
									x2="210"
									y2="6"
									stroke="rgba(255,255,255,0.45)"
									stroke-width="1.8"
									stroke-linecap="round"
								/>
								<text
									x="160"
									y="3"
									font-size="5.5"
									font-family="ui-monospace, 'SF Mono', monospace"
									fill="rgba(255,255,255,0.3)"
									letter-spacing="0.08em"
									text-anchor="middle">ENTRANCE</text
								>
								<!-- Heatmap pulses -->
								<rect
									x="10"
									y="6"
									width="300"
									height="148"
									rx="4"
									fill="url(#mat-heat-core)"
									class="hm-pulse"
								/>
								<rect
									x="10"
									y="6"
									width="300"
									height="148"
									rx="4"
									fill="url(#mat-heat-left)"
									class="hm-pulse hm-pulse-2"
								/>
								<rect
									x="10"
									y="6"
									width="300"
									height="148"
									rx="4"
									fill="url(#mat-heat-right)"
									class="hm-pulse hm-pulse-3"
								/>
								<!-- Traffic flow lines -->
								<line
									x1="160"
									y1="14"
									x2="140"
									y2="80"
									stroke="rgba(255,255,255,0.28)"
									stroke-width="0.6"
									stroke-linecap="round"
									stroke-dasharray="3 4"
								/>
								<line
									x1="160"
									y1="14"
									x2="180"
									y2="80"
									stroke="rgba(255,255,255,0.28)"
									stroke-width="0.6"
									stroke-linecap="round"
									stroke-dasharray="3 4"
								/>
								<line
									x1="160"
									y1="14"
									x2="160"
									y2="85"
									stroke="rgba(255,255,255,0.28)"
									stroke-width="0.6"
									stroke-linecap="round"
									stroke-dasharray="3 4"
								/>
								<line
									x1="160"
									y1="14"
									x2="110"
									y2="70"
									stroke="rgba(255,255,255,0.28)"
									stroke-width="0.6"
									stroke-linecap="round"
									stroke-dasharray="3 4"
								/>
								<line
									x1="160"
									y1="14"
									x2="210"
									y2="70"
									stroke="rgba(255,255,255,0.28)"
									stroke-width="0.6"
									stroke-linecap="round"
									stroke-dasharray="3 4"
								/>
								<!-- 3-zone overlay -->
								<g class="hm-zones" class:hm-zones-visible={mattingShowZones}>
									<!-- Zone 1: SCRAPE -->
									<rect
										x="50"
										y="12"
										width="220"
										height="34"
										rx="2"
										fill="url(#mat-grid)"
										stroke="rgba(255,255,255,0.5)"
										stroke-width="1.2"
										stroke-dasharray="4 2"
										opacity="0.85"
									/>
									<text
										x="160"
										y="32"
										font-size="8.5"
										font-family="ui-monospace, 'SF Mono', monospace"
										fill="rgba(255,255,255,0.45)"
										letter-spacing="0.1em"
										text-anchor="middle">SCRAPE</text
									>
									<text
										x="160"
										y="42"
										font-size="6.5"
										font-family="ui-monospace, 'SF Mono', monospace"
										fill="rgba(255,255,255,0.3)"
										letter-spacing="0.05em"
										text-anchor="middle">grit + mud · 0–4 ft</text
									>
									<!-- Zone 2: WIPE -->
									<rect
										x="35"
										y="52"
										width="250"
										height="40"
										rx="2"
										fill="url(#mat-pile)"
										stroke="rgba(255,255,255,0.35)"
										stroke-width="1"
										stroke-dasharray="4 2"
										opacity="0.75"
									/>
									<text
										x="160"
										y="74"
										font-size="8.5"
										font-family="ui-monospace, 'SF Mono', monospace"
										fill="rgba(255,255,255,0.45)"
										letter-spacing="0.1em"
										text-anchor="middle">WIPE</text
									>
									<text
										x="160"
										y="84"
										font-size="6.5"
										font-family="ui-monospace, 'SF Mono', monospace"
										fill="rgba(255,255,255,0.3)"
										letter-spacing="0.05em"
										text-anchor="middle">water + salt · 4–8 ft</text
									>
									<!-- Zone 3: DRY -->
									<rect
										x="25"
										y="98"
										width="270"
										height="40"
										rx="2"
										fill="rgba(255,255,255,0.05)"
										stroke="rgba(255,255,255,0.28)"
										stroke-width="0.8"
										stroke-dasharray="4 2"
										opacity="0.65"
									/>
									<text
										x="160"
										y="120"
										font-size="8.5"
										font-family="ui-monospace, 'SF Mono', monospace"
										fill="rgba(255,255,255,0.45)"
										letter-spacing="0.1em"
										text-anchor="middle">DRY</text
									>
									<text
										x="160"
										y="130"
										font-size="6.5"
										font-family="ui-monospace, 'SF Mono', monospace"
										fill="rgba(255,255,255,0.3)"
										letter-spacing="0.05em"
										text-anchor="middle">finish floor · 8–12 ft</text
									>
								</g>
							</svg>
						</div>
					{:else if material === 'hardwood'}
						<div class="feature-flips">
							<div class="hw-flips" role="group" aria-label="Hardwood type cards">
								{#each hardwoodCards as card (card.id)}
									<button
										type="button"
										class="hw-flip"
										class:hw-flip--flipped={flippedCard === card.id}
										aria-pressed={flippedCard === card.id}
										aria-label="{card.label} — {flippedCard === card.id
											? 'showing specs, tap to flip back'
											: 'tap to see specs'}"
										onclick={() => toggleHwFlip(card.id)}
									>
										<div class="hw-flip-inner">
											<div class="hw-flip-face hw-flip-front" aria-hidden={flippedCard === card.id}>
												<span class="hw-flip-label">{card.label}</span>
												<span class="hw-flip-front-text">{card.front}</span>
											</div>
											<div class="hw-flip-face hw-flip-back" aria-hidden={flippedCard !== card.id}>
												<span class="hw-flip-back-heading">Thickness</span>
												<span class="hw-flip-back-text">{card.thickness}</span>
												<span class="hw-flip-back-heading">Best for</span>
												<span class="hw-flip-back-text">{card.bestFor}</span>
												<span class="hw-flip-back-heading">Install</span>
												<span class="hw-flip-back-text">{card.install}</span>
											</div>
										</div>
									</button>
								{/each}
							</div>
							<p class="grout-caption">Tap a card to flip and see specs.</p>
						</div>
					{:else if material === 'sheet'}
						<div class="feature-cove">
							<svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
								<defs>
									<pattern
										id="cove-hatch"
										patternUnits="userSpaceOnUse"
										width="6"
										height="6"
										patternTransform="rotate(45)"
									>
										<line
											x1="0"
											y1="0"
											x2="0"
											y2="6"
											stroke="rgba(255,255,255,0.12)"
											stroke-width="1"
										/>
									</pattern>
								</defs>
								<!-- Wall substrate -->
								<rect x="36" y="20" width="24" height="140" fill="url(#cove-hatch)" />
								<!-- Slab substrate -->
								<rect x="60" y="160" width="170" height="20" fill="url(#cove-hatch)" />
								<!-- Wall edge -->
								<line
									x1="60"
									y1="20"
									x2="60"
									y2="160"
									stroke="rgba(255,255,255,0.35)"
									stroke-width="1.4"
								/>
								<!-- Slab edge -->
								<line
									x1="60"
									y1="160"
									x2="230"
									y2="160"
									stroke="rgba(255,255,255,0.35)"
									stroke-width="1.4"
								/>
								<!-- Step 1: Cap strip -->
								<g class="grout-step" class:grout-step--in={coveStep >= 1}>
									<rect
										x="50"
										y="96"
										width="22"
										height="8"
										rx="1.5"
										fill="rgba(255,255,255,0.4)"
										stroke="rgba(255,255,255,0.5)"
										stroke-width="0.8"
									/>
									<line
										x1="74"
										y1="100"
										x2="93"
										y2="100"
										stroke="rgba(255,255,255,0.3)"
										stroke-width="0.6"
									/>
									<text
										x="97"
										y="103"
										font-size="9"
										font-family="ui-monospace, 'SF Mono', monospace"
										fill="rgba(255,255,255,0.45)"
										letter-spacing="0.05em">CAP STRIP</text
									>
								</g>
								<!-- Step 2: Cove stick -->
								<g class="grout-step" class:grout-step--in={coveStep >= 2}>
									<path
										d={COVE_STICK_D}
										fill="rgba(255,255,255,0.35)"
										stroke="rgba(255,255,255,0.45)"
										stroke-width="0.8"
									/>
									<circle cx="82" cy="138" r="0.9" fill="rgba(255,255,255,0.45)" />
									<line
										x1="82"
										y1="138"
										x2="66.4"
										y2="153.6"
										stroke="rgba(255,255,255,0.45)"
										stroke-width="0.6"
									/>
									<polygon
										points="66.4,153.6 67.5,150.4 69.6,152.5"
										fill="rgba(255,255,255,0.45)"
									/>
									<text
										x="86"
										y="134"
										font-size="9"
										font-family="ui-monospace, 'SF Mono', monospace"
										fill="rgba(255,255,255,0.45)"
										letter-spacing="0.05em">COVE STICK</text
									>
									<text
										x="86"
										y="144"
										font-size="7"
										font-family="ui-monospace, 'SF Mono', monospace"
										fill="rgba(255,255,255,0.45)"
										letter-spacing="0.05em">R 7/8&quot;</text
									>
								</g>
								<!-- Step 3: Sheet vinyl -->
								<g class="grout-step" class:grout-step--in={coveStep >= 3}>
									<path
										class="cove-sheet-stroke"
										d={BORDER_PIECE_D}
										fill="none"
										stroke="rgba(255,255,255,0.6)"
										stroke-width="4"
										stroke-linecap="butt"
										stroke-linejoin="round"
										stroke-dasharray={SHEET_BORDER_LEN}
										stroke-dashoffset={SHEET_BORDER_LEN}
									/>
									<path
										class="cove-sheet-stroke"
										d={FIELD_PIECE_D}
										fill="none"
										stroke="rgba(255,255,255,0.6)"
										stroke-width="4"
										stroke-linecap="butt"
										stroke-linejoin="round"
										stroke-dasharray={SHEET_FIELD_LEN}
										stroke-dashoffset={SHEET_FIELD_LEN}
									/>
									<line
										x1="180"
										y1="124"
										x2="180"
										y2="153"
										stroke="rgba(255,255,255,0.3)"
										stroke-width="0.6"
									/>
									<text
										x="180"
										y="120"
										font-size="9"
										font-family="ui-monospace, 'SF Mono', monospace"
										fill="rgba(255,255,255,0.45)"
										letter-spacing="0.05em"
										text-anchor="middle">SHEET VINYL</text
									>
								</g>
								<!-- Step 4: Heat-welded seam -->
								<g class="grout-step" class:grout-step--in={coveStep >= 4}>
									<line
										x1="160"
										y1="148"
										x2="160"
										y2="158"
										stroke="rgba(255,255,255,0.5)"
										stroke-width="1.2"
										stroke-dasharray="2 2"
									/>
									<line
										x1="160"
										y1="160"
										x2="180"
										y2="190"
										stroke="rgba(255,255,255,0.3)"
										stroke-width="0.6"
									/>
									<text
										x="184"
										y="194"
										font-size="9"
										font-family="ui-monospace, 'SF Mono', monospace"
										fill="rgba(255,255,255,0.45)"
										letter-spacing="0.05em">HEAT WELD</text
									>
								</g>
							</svg>
							<p class="grout-caption">
								Monolithic floor-to-wall &mdash; no seam, no shadow line, nowhere for bacteria to
								hide.
							</p>
							<button type="button" class="grout-replay" onclick={() => playCoveSequence()}>
								&#x21bb;&ensp;Replay anatomy
							</button>
						</div>
					{:else if material === 'carpet'}
						<div class="feature-noise">
							<div class="noise-pills">
								<button
									type="button"
									class="noise-pill"
									class:noise-pill--active={!carpetDampened}
									onclick={() => (carpetDampened = false)}>Hard floor</button
								>
								<button
									type="button"
									class="noise-pill"
									class:noise-pill--active={carpetDampened}
									onclick={() => {
										carpetDampened = true;
										carpetAutoFired = true;
									}}>Carpet + pad</button
								>
							</div>
							<svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
								<rect x="10" y="10" width="260" height="76" fill="rgba(255,255,255,0.04)" rx="3" />
								<text
									x="24"
									y="26"
									font-family="ui-monospace, 'SF Mono', monospace"
									font-size="7"
									fill="rgba(255,255,255,0.45)"
									letter-spacing="0.05em">UPPER UNIT</text
								>
								<rect x="10" y="78" width="260" height="4" fill="rgba(255,255,255,0.25)" rx="1" />
								<g class="noise-floor-layer" class:noise-floor-layer--visible={carpetDampened}>
									<rect x="10" y="74" width="260" height="4" fill="rgba(255,255,255,0.25)" rx="1" />
									<rect x="10" y="70" width="260" height="4" fill="rgba(255,255,255,0.35)" rx="1" />
									{#each Array.from({ length: 26 }, (__, idx) => idx) as i (i)}
										<line
											x1={20 + i * 10}
											y1="70"
											x2={20 + i * 10}
											y2="67"
											stroke="rgba(255,255,255,0.4)"
											stroke-width="1.2"
											stroke-linecap="round"
										/>
									{/each}
									<text
										x="140"
										y="66"
										text-anchor="middle"
										font-family="ui-monospace, 'SF Mono', monospace"
										font-size="6"
										fill="rgba(255,255,255,0.5)"
										letter-spacing="0.05em">CARPET + PAD</text
									>
								</g>
								<rect x="10" y="82" width="260" height="12" fill="rgba(255,255,255,0.15)" />
								<line
									x1="10"
									y1="82"
									x2="270"
									y2="82"
									stroke="rgba(255,255,255,0.25)"
									stroke-width="0.8"
								/>
								<line
									x1="10"
									y1="94"
									x2="270"
									y2="94"
									stroke="rgba(255,255,255,0.25)"
									stroke-width="0.8"
								/>
								{#each Array.from({ length: 18 }, (__, idx) => idx) as i (i)}
									<circle
										cx={22 + i * 14}
										cy="88"
										r="1.2"
										fill="rgba(255,255,255,0.25)"
										opacity="0.5"
									/>
								{/each}
								<rect x="10" y="94" width="260" height="86" fill="rgba(255,255,255,0.02)" rx="3" />
								<text
									x="24"
									y="108"
									font-family="ui-monospace, 'SF Mono', monospace"
									font-size="7"
									fill="rgba(255,255,255,0.45)"
									letter-spacing="0.05em">LOWER UNIT</text
								>
								<rect
									x="30"
									y="150"
									width="40"
									height="22"
									fill="none"
									stroke="rgba(255,255,255,0.12)"
									stroke-width="0.8"
									rx="2"
								/>
								<rect
									x="200"
									y="155"
									width="50"
									height="17"
									fill="none"
									stroke="rgba(255,255,255,0.12)"
									stroke-width="0.8"
									rx="2"
								/>
								<g transform="translate(140 42)">
									<ellipse
										cx="0"
										cy="0"
										rx="7"
										ry="10"
										fill="none"
										stroke="rgba(255,255,255,0.4)"
										stroke-width="1.2"
										class="noise-wave footstep-pulse"
									/>
									<ellipse
										cx="0"
										cy="0"
										rx="4"
										ry="6"
										fill="rgba(255,255,255,0.25)"
										opacity="0.6"
									/>
									<line
										x1="-10"
										y1="4"
										x2="-13"
										y2="6"
										stroke="rgba(255,255,255,0.35)"
										stroke-width="0.8"
										class="noise-wave footstep-pulse"
									/>
									<line
										x1="10"
										y1="4"
										x2="13"
										y2="6"
										stroke="rgba(255,255,255,0.35)"
										stroke-width="0.8"
										class="noise-wave footstep-pulse"
									/>
								</g>
								<path
									d="M 122 58 Q 140 72, 158 58"
									fill="none"
									stroke="rgba(255,255,255,0.5)"
									stroke-width="1.2"
									stroke-linecap="round"
									class="noise-wave"
									class:noise-wave--damped={carpetDampened}
									style="animation-delay: 0s"
								/>
								<path
									d="M 116 66 Q 140 84, 164 66"
									fill="none"
									stroke="rgba(255,255,255,0.5)"
									stroke-width="1"
									stroke-linecap="round"
									class="noise-wave"
									class:noise-wave--damped={carpetDampened}
									style="animation-delay: 0.25s"
								/>
								<path
									d="M 110 76 Q 140 98, 170 76"
									fill="none"
									stroke="rgba(255,255,255,0.5)"
									stroke-width="0.8"
									stroke-linecap="round"
									class="noise-wave"
									class:noise-wave--damped={carpetDampened}
									style="animation-delay: 0.5s"
								/>
								<path
									d="M 106 100 Q 140 120, 174 100"
									fill="none"
									stroke="rgba(255,255,255,0.5)"
									stroke-width="0.7"
									stroke-linecap="round"
									class="noise-wave"
									class:noise-wave--damped={carpetDampened}
									style="animation-delay: 0.75s"
								/>
								<path
									d="M 102 114 Q 140 138, 178 114"
									fill="none"
									stroke="rgba(255,255,255,0.5)"
									stroke-width="0.6"
									stroke-linecap="round"
									class="noise-wave"
									class:noise-wave--damped={carpetDampened}
									style="animation-delay: 1s"
								/>
								<g transform="translate(230 138)">
									<rect
										x="-22"
										y="-10"
										width="44"
										height="22"
										rx="4"
										fill="rgba(255,255,255,0.06)"
										stroke="rgba(255,255,255,0.2)"
										stroke-width="0.8"
									/>
									<text
										x="0"
										y="-1"
										text-anchor="middle"
										font-family="ui-monospace, 'SF Mono', monospace"
										font-size="7"
										fill="rgba(255,255,255,0.45)"
										letter-spacing="0.05em">IIC</text
									>
									<text
										x="0"
										y="9"
										text-anchor="middle"
										font-family="ui-monospace, 'SF Mono', monospace"
										font-size="9"
										font-weight="700"
										letter-spacing="0.05em"
									>
										{#if carpetDampened}
											<tspan fill="rgba(255,255,255,0.7)">55+</tspan>
										{:else}
											<tspan fill="rgba(255,255,255,0.35)">25</tspan>
										{/if}
									</text>
								</g>
							</svg>
						</div>
					{:else}
						<div class="feature-placeholder">
							<span class="placeholder-label">Coming soon</span>
						</div>
					{/if}
				</div>
			{:else}
				<div class="overview-layout">
					<div class="tab-scroll">
						<p class="tab-lead">{details.lead}</p>
						<div class="spec-rows">
							{#each details.specs as row (row.label)}
								<div class="spec-row">
									<span class="spec-label">{row.label}</span>
									<span class="spec-value">{row.value}</span>
								</div>
							{/each}
						</div>
						<SupplierMarquee {material} compact />
					</div>
					<button type="button" class="feature-btn" onclick={() => (featureOpen = true)}>
						<span class="feature-btn__icon" aria-hidden="true">
							<svg viewBox="0 0 24 24" width="18" height="18">
								<circle
									cx="12"
									cy="12"
									r="10"
									fill="none"
									stroke="currentColor"
									stroke-width="1.5"
								/>
								<path d="M10 8.5 L16 12 L10 15.5 Z" fill="currentColor" />
							</svg>
						</span>
						<span class="feature-btn__text">{details.featureLabel}</span>
						{#if details.featureHint}
							<span class="feature-btn__hint">{details.featureHint}</span>
						{/if}
					</button>
				</div>
			{/if}
		{/snippet}

		{#snippet install()}
			<div class="tab-scroll">
				<div class="media-stage media-stage--placeholder">
					<span class="placeholder-label">Video</span>
				</div>
				<div class="spec-rows">
					{#each details.installRows as row (row.label)}
						<div class="spec-row">
							<span class="spec-label">{row.label}</span>
							<span class="spec-value">{row.value}</span>
						</div>
					{/each}
				</div>
			</div>
		{/snippet}

		{#snippet care()}
			<div class="tab-scroll">
				<div class="care-icon-row" aria-hidden="true">
					<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="care-icon">
						<circle
							cx="24"
							cy="24"
							r="20"
							fill="none"
							stroke="rgba(255,255,255,0.15)"
							stroke-width="1.5"
						/>
						<path
							d="M16 32 L24 16 L32 32"
							fill="none"
							stroke="rgba(255,255,255,0.4)"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<line
							x1="24"
							y1="26"
							x2="24"
							y2="28"
							stroke="rgba(255,255,255,0.4)"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
				</div>
				<div class="spec-rows">
					{#each details.careRows as row (row.label)}
						<div class="spec-row">
							<span class="spec-label">{row.label}</span>
							<span class="spec-value">{row.value}</span>
						</div>
					{/each}
				</div>
				<p class="tab-footnote">{details.careFootnote}</p>
			</div>
		{/snippet}
	</ModalTabs>
{/if}

<style>
	.tab-scroll {
		flex: 1;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		overscroll-behavior: contain;
		min-height: 0;
	}

	.feature-stage {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.feature-back {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-family: var(--font-body);
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		background: none;
		border: none;
		padding: 0.4rem 0;
		cursor: pointer;
		transition: color var(--base);
	}

	.feature-back:hover {
		color: var(--color-text);
	}

	.feature-back:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 2px;
	}

	.feature-title {
		font-family: var(--font-body);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text);
		margin: 0;
		text-align: center;
	}

	.feature-morph {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
	}

	.feature-morph svg {
		display: block;
		width: 100%;
		max-width: 280px;
		height: auto;
	}

	.feature-placeholder {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* ── LVT exploded layer diagram ── */
	.feature-explode {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
	}

	.feature-explode svg {
		display: block;
		width: 100%;
		max-width: 280px;
		height: auto;
	}

	.explode-layer {
		transition: transform 480ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	.explode-layer--open {
		transform: translateY(var(--explode-y, 0));
	}

	.explode-layer rect {
		transition:
			stroke 460ms cubic-bezier(0.2, 0.9, 0.25, 1.05),
			stroke-width 460ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	@media (prefers-reduced-motion: reduce) {
		.explode-layer {
			transition: none !important;
			transform: translateY(var(--explode-y, 0)) !important;
		}

		.explode-layer rect {
			transition: none !important;
		}
	}

	/* ── Ceramic: grout anatomy ── */
	.feature-grout {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.5rem;
	}

	.feature-grout svg {
		display: block;
		width: 100%;
		max-width: 280px;
		height: auto;
		margin-bottom: 0.5rem;
	}

	.grout-step {
		opacity: 0;
		transform: translateY(-4px);
		transform-box: fill-box;
		transition:
			opacity 380ms ease,
			transform 420ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	.grout-step--in {
		opacity: 1;
		transform: translateY(0);
	}

	.grout-caption {
		font-size: 0.72rem;
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.3);
		font-style: italic;
		margin: 0.25rem 0 0.5rem;
		text-align: center;
	}

	.grout-replay {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 36px;
		padding: 0.45rem 1rem;
		border-radius: var(--radius-sm);
		font-family: var(--font-body);
		font-size: 0.65rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.1);
		cursor: pointer;
		transition:
			background var(--base),
			border-color var(--base),
			color var(--base);
	}

	.grout-replay:hover {
		color: var(--color-text);
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.18);
	}

	.grout-replay:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.grout-step {
			transition: none;
			opacity: 1;
			transform: none;
		}
	}

	/* ── Carpet: noise path animation ── */
	.feature-noise {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.5rem;
	}

	.feature-noise svg {
		display: block;
		width: 100%;
		max-width: 280px;
		height: auto;
	}

	.noise-pills {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.45rem;
		margin: 0 auto 0.75rem;
		max-width: 260px;
		width: 100%;
	}

	.noise-pill {
		font-family: var(--font-body);
		font-size: 0.58rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		min-height: 36px;
		padding: 0.45rem 0.5rem;
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(255, 255, 255, 0.06);
		cursor: pointer;
		transition:
			background var(--base),
			border-color var(--base),
			color var(--base);
	}

	.noise-pill:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 2px;
	}

	.noise-pill:hover {
		color: var(--color-text);
		background: rgba(255, 255, 255, 0.04);
		border-color: rgba(255, 255, 255, 0.15);
	}

	.noise-pill--active {
		color: var(--color-text);
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.25);
	}

	@keyframes wave-pulse {
		0%,
		100% {
			opacity: 0.85;
		}
		50% {
			opacity: 0.3;
		}
	}

	@keyframes footstep-pulse {
		0%,
		100% {
			opacity: 0.7;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.08);
		}
	}

	.footstep-pulse {
		animation: footstep-pulse 1.5s ease-in-out infinite;
	}

	.noise-wave {
		opacity: 0.85;
		animation: wave-pulse 1.5s ease-in-out infinite;
		transition: opacity 460ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	.noise-wave--damped {
		opacity: 0.06;
		animation: none;
	}

	.noise-floor-layer {
		opacity: 0;
		transition: opacity 460ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	.noise-floor-layer--visible {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.noise-wave {
			animation: none;
		}
		.footstep-pulse {
			animation: none;
		}
		.noise-floor-layer {
			transition: none;
		}
	}

	.overview-layout {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.feature-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.65rem 0.75rem;
		margin: auto 0 0;
		flex-shrink: 0;
		border-radius: var(--radius-sm);
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: var(--color-text);
		cursor: pointer;
		transition:
			background var(--base),
			border-color var(--base);
	}

	.feature-btn:hover {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.18);
	}

	.feature-btn:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 2px;
	}

	.feature-btn__icon {
		flex-shrink: 0;
		display: flex;
		color: var(--color-text-muted);
	}

	.feature-btn__text {
		font-family: var(--font-body);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.feature-btn__hint {
		font-size: 0.65rem;
		font-weight: 400;
		letter-spacing: 0.04em;
		color: var(--color-text-muted);
		margin-left: auto;
	}

	.media-stage {
		margin: 0.75rem auto 0.85rem;
		padding: 1rem;
		border-radius: var(--radius-lg);
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid var(--color-border-glass);
		max-width: 280px;
	}

	.media-stage--placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 16 / 10;
	}

	.placeholder-label {
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.2);
	}

	.care-icon-row {
		display: flex;
		justify-content: center;
		margin: 0.5rem 0 0.75rem;
	}

	.care-icon {
		width: 32px;
		height: 32px;
	}

	.tile-morph-tile {
		transition: transform 460ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
		transform-box: fill-box;
	}

	@media (prefers-reduced-motion: reduce) {
		.tile-morph-tile {
			transition: none;
		}
	}

	.pattern-pills {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.45rem;
		margin: 0 auto;
		padding: 0 0.5rem 0.5rem;
		max-width: 320px;
	}

	.pattern-pill {
		font-family: var(--font-body);
		font-size: 0.58rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		min-height: 36px;
		padding: 0.45rem 0.5rem;
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(255, 255, 255, 0.06);
		cursor: pointer;
		transition:
			background var(--base),
			border-color var(--base),
			color var(--base);
	}

	.pattern-pill:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 2px;
	}

	.pattern-pill:hover {
		color: var(--color-text);
		background: rgba(255, 255, 255, 0.04);
		border-color: rgba(255, 255, 255, 0.15);
	}

	.pattern-pill--active {
		color: var(--color-text);
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.25);
	}

	.tab-lead {
		font-size: 0.95rem;
		color: var(--color-text);
		line-height: 1.5;
		margin: 0 0 0.85rem;
	}

	.spec-rows {
		display: flex;
		flex-direction: column;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
	}

	.spec-row {
		display: flex;
		align-items: baseline;
		font-size: 0.78rem;
		line-height: 1.4;
		padding: 0.4rem 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.spec-label {
		flex-shrink: 0;
		width: 5rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		color: var(--color-text);
	}

	.spec-value {
		color: var(--color-text-muted);
	}

	.tab-footnote {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.3);
		line-height: 1.5;
		margin: 0.85rem 0 0;
	}

	/* ── Rubber: impact absorption ── */
	.feature-impact {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
	}

	.feature-impact svg {
		display: block;
		width: 100%;
		max-width: 280px;
		height: auto;
		overflow: visible;
	}

	@keyframes impact-weight-thin {
		0%,
		10% {
			transform: translateY(20px);
		}
		35% {
			transform: translateY(82px);
		}
		45% {
			transform: translateY(78px);
		}
		55%,
		80% {
			transform: translateY(82px);
		}
		90%,
		100% {
			transform: translateY(20px);
		}
	}

	@keyframes impact-weight-mid {
		0%,
		10% {
			transform: translateY(20px);
		}
		35% {
			transform: translateY(80px);
		}
		45% {
			transform: translateY(76px);
		}
		55%,
		80% {
			transform: translateY(80px);
		}
		90%,
		100% {
			transform: translateY(20px);
		}
	}

	@keyframes impact-weight-thick {
		0%,
		10% {
			transform: translateY(20px);
		}
		35% {
			transform: translateY(74px);
		}
		45% {
			transform: translateY(71px);
		}
		55%,
		80% {
			transform: translateY(74px);
		}
		90%,
		100% {
			transform: translateY(20px);
		}
	}

	@keyframes impact-flash-thin {
		0%,
		34% {
			opacity: 0;
		}
		36% {
			opacity: 0.75;
		}
		50% {
			opacity: 0.55;
		}
		65%,
		100% {
			opacity: 0;
		}
	}

	@keyframes impact-flash-mid {
		0%,
		36% {
			opacity: 0;
		}
		40% {
			opacity: 0.35;
		}
		52% {
			opacity: 0.15;
		}
		65%,
		100% {
			opacity: 0;
		}
	}

	@keyframes impact-flash-thick {
		0%,
		38% {
			opacity: 0;
		}
		44% {
			opacity: 0.1;
		}
		52%,
		100% {
			opacity: 0;
		}
	}

	.impact-weight--thin {
		animation: impact-weight-thin 4s ease-in-out infinite;
	}

	.impact-weight--mid {
		animation: impact-weight-mid 4s ease-in-out infinite;
	}

	.impact-weight--thick {
		animation: impact-weight-thick 4s ease-in-out infinite;
	}

	.impact-flash--thin {
		animation: impact-flash-thin 4s ease-in-out infinite;
	}

	.impact-flash--mid {
		animation: impact-flash-mid 4s ease-in-out infinite;
	}

	.impact-flash--thick {
		animation: impact-flash-thick 4s ease-in-out infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		.impact-weight--thin,
		.impact-weight--mid,
		.impact-weight--thick {
			animation: none;
			transform: translateY(20px);
		}

		.impact-flash--thin,
		.impact-flash--mid,
		.impact-flash--thick {
			animation: none;
			opacity: 0;
		}
	}

	/* ── Matting: lobby heatmap ── */
	.feature-heatmap {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.5rem;
	}

	.feature-heatmap svg {
		display: block;
		width: 100%;
		max-width: 280px;
		height: auto;
	}

	@keyframes hm-breathe {
		0%,
		100% {
			opacity: 0.55;
		}
		50% {
			opacity: 1;
		}
	}

	.hm-pulse {
		animation: hm-breathe 3.5s ease-in-out infinite;
	}

	.hm-pulse-2 {
		animation-delay: -1.2s;
	}

	.hm-pulse-3 {
		animation-delay: -2.4s;
	}

	.hm-zones {
		opacity: 0;
		transition: opacity 480ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
	}

	.hm-zones-visible {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.hm-pulse {
			animation: none;
			opacity: 0.75;
		}

		.hm-zones {
			transition: none;
			opacity: 1;
		}
	}

	/* ── Hardwood: flip cards ── */
	.feature-flips {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.5rem 0.25rem;
		min-height: 0;
	}

	.hw-flips {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
		width: 100%;
		max-width: 340px;
		perspective: 1200px;
	}

	.hw-flip {
		position: relative;
		aspect-ratio: 3 / 4;
		min-height: 120px;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
		font: inherit;
		color: inherit;
	}

	.hw-flip-inner {
		position: relative;
		width: 100%;
		height: 100%;
		transition: transform 600ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
		transform-style: preserve-3d;
	}

	.hw-flip--flipped .hw-flip-inner {
		transform: rotateY(180deg);
	}

	.hw-flip-face {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		padding: 0.55rem 0.45rem;
		border-radius: var(--radius-sm);
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.1);
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		transition: border-color var(--base);
	}

	.hw-flip:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 2px;
		border-radius: var(--radius-sm);
	}

	@media (hover: hover) {
		.hw-flip:hover .hw-flip-face {
			border-color: rgba(255, 255, 255, 0.18);
		}
	}

	.hw-flip-front {
		justify-content: space-between;
		align-items: center;
		text-align: center;
	}

	.hw-flip-label {
		font-family: var(--font-body);
		font-size: 0.65rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-text);
	}

	.hw-flip-front-text {
		font-size: 0.55rem;
		line-height: 1.4;
		color: var(--color-text-muted);
	}

	.hw-flip-back {
		transform: rotateY(180deg);
		justify-content: flex-start;
		gap: 0.1rem;
		overflow: hidden;
	}

	.hw-flip-back-heading {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.48rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: rgba(255, 255, 255, 0.45);
		margin-top: 0.25rem;
	}

	.hw-flip-back-heading:first-child {
		margin-top: 0;
	}

	.hw-flip-back-text {
		font-size: 0.5rem;
		line-height: 1.35;
		color: var(--color-text);
	}

	@media (prefers-reduced-motion: reduce) {
		.hw-flip-inner {
			transition: none;
		}
	}

	/* ── Sheet Vinyl: cove-build anatomy ── */
	.feature-cove {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.5rem;
	}

	.feature-cove svg {
		display: block;
		width: 100%;
		max-width: 280px;
		height: auto;
		margin-bottom: 0.5rem;
	}

	.cove-sheet-stroke {
		transition: stroke-dashoffset 1100ms cubic-bezier(0.4, 0, 0.2, 1) 100ms;
	}

	.grout-step--in .cove-sheet-stroke {
		stroke-dashoffset: 0 !important;
	}

	@media (prefers-reduced-motion: reduce) {
		.cove-sheet-stroke {
			transition: none;
			stroke-dashoffset: 0 !important;
		}
	}
</style>
