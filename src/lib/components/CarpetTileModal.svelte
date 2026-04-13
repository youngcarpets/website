<script lang="ts">
	import { tick } from 'svelte';
	import ModalTabs from './ModalTabs.svelte';
	import SupplierMarquee from './SupplierMarquee.svelte';
	import { type TilePattern, tilePatternList } from '$lib/content/interactions';

	let featureOpen = $state(false);
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
				<h4 class="feature-title">Install patterns</h4>
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
			</div>
		{:else}
			<div class="overview-layout">
				<div class="tab-scroll">
					<p class="tab-lead">
						Modular squares & planks that swap out one tile at a time — no full-room tearup.
					</p>
					<div class="spec-rows">
						<div class="spec-row">
							<span class="spec-label">Sizes</span>
							<span class="spec-value">18×18 · 24×24 · 18×36 · plank</span>
						</div>
						<div class="spec-row">
							<span class="spec-label">Wear</span>
							<span class="spec-value">Nylon or PET, loop or cut-pile</span>
						</div>
						<div class="spec-row">
							<span class="spec-label">Install</span>
							<span class="spec-value">Peel-stick, glue-down, or loose-lay</span>
						</div>
						<div class="spec-row">
							<span class="spec-label">Traffic</span>
							<span class="spec-value">Heavy commercial</span>
						</div>
						<div class="spec-row">
							<span class="spec-label">Fire</span>
							<span class="spec-value">Class 1 (ASTM E648)</span>
						</div>
						<div class="spec-row">
							<span class="spec-label">For</span>
							<span class="spec-value">Offices, schools, healthcare, retail</span>
						</div>
						<div class="spec-row">
							<span class="spec-label">Maintain</span>
							<span class="spec-value">Vacuum + spot-replace damaged tiles</span>
						</div>
						<div class="spec-row">
							<span class="spec-label">Life</span>
							<span class="spec-value">15–25 yr in commercial settings</span>
						</div>
					</div>
					<SupplierMarquee material="carpet-tile" compact />
				</div>
				<button type="button" class="feature-btn" onclick={() => (featureOpen = true)}>
					<span class="feature-btn__icon" aria-hidden="true">
						<svg viewBox="0 0 24 24" width="18" height="18">
							<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5" />
							<path d="M10 8.5 L16 12 L10 15.5 Z" fill="currentColor" />
						</svg>
					</span>
					<span class="feature-btn__text">Install patterns</span>
					<span class="feature-btn__hint">(interactive)</span>
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
				<div class="spec-row">
					<span class="spec-label">Glue-down</span>
					<span class="spec-value">Permanent, most common</span>
				</div>
				<div class="spec-row">
					<span class="spec-label">Tackifier</span>
					<span class="spec-value">Repositionable, access floors</span>
				</div>
				<div class="spec-row">
					<span class="spec-label">Peel & stick</span>
					<span class="spec-value">Factory adhesive, fastest</span>
				</div>
				<div class="spec-row">
					<span class="spec-label">Adhesive-free</span>
					<span class="spec-value">Zero VOC connectors</span>
				</div>
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
				<div class="spec-row">
					<span class="spec-label">Daily</span>
					<span class="spec-value">Vacuum, beater bar off for loop</span>
				</div>
				<div class="spec-row">
					<span class="spec-label">Spills</span>
					<span class="spec-value">Spot-clean within 24 hrs</span>
				</div>
				<div class="spec-row">
					<span class="spec-label">Quarterly</span>
					<span class="spec-value">Extraction or encap cleaning</span>
				</div>
				<div class="spec-row">
					<span class="spec-label">Annual</span>
					<span class="spec-value">Hot-water extraction</span>
				</div>
			</div>
			<p class="tab-footnote">
				10–15 yr life, moderate traffic. Typical warranty: 10-yr wear + 15-yr structural.
			</p>
		</div>
	{/snippet}
</ModalTabs>

<style>
	.tab-scroll {
		flex: 1;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		overscroll-behavior: contain;
		min-height: 0;
	}

	/* Feature stage — full-bleed takeover of tab panel */
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

	/* Feature button on overview */
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

	/* Media stage (install tab placeholder) */
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

	/* Care tab icon */
	.care-icon-row {
		display: flex;
		justify-content: center;
		margin: 0.5rem 0 0.75rem;
	}

	.care-icon {
		width: 32px;
		height: 32px;
	}

	/* Tile morph animation */
	.tile-morph-tile {
		transition: transform 460ms cubic-bezier(0.2, 0.9, 0.25, 1.05);
		transform-box: fill-box;
	}

	@media (prefers-reduced-motion: reduce) {
		.tile-morph-tile {
			transition: none;
		}
	}

	/* Pattern pills */
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

	/* Shared text styles */
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
