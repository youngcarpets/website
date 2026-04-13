<script lang="ts">
	import { tick } from 'svelte';
	import type { Product } from '$lib/content/products';
	import { productDetails } from '$lib/content/product-details';
	import ModalTabs from './ModalTabs.svelte';
	import SupplierMarquee from './SupplierMarquee.svelte';
	import { type TilePattern, tilePatternList } from '$lib/content/interactions';

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
</style>
