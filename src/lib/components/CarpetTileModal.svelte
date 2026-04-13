<script lang="ts">
	import { tick } from 'svelte';
	import ModalTabs from './ModalTabs.svelte';
	import { type TilePattern, tilePatternList } from '$lib/content/interactions';

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
	{#snippet product()}
		<div class="tab-section">
			<h4 class="tab-heading">What It Is</h4>
			<p class="tab-text">
				Modular carpet squares and planks — 18×18, 24×24, 18×36, and plank formats. Each tile is
				individually replaceable without tearing up the whole floor.
			</p>
		</div>
		<div class="tab-section">
			<h4 class="tab-heading">Construction</h4>
			<p class="tab-text">
				Tufted nylon or PET face fibre on a dimensionally stable backing — typically PVC, bitumen,
				or cushion-back. Some lines use recycled content backing (Shaw EcoWorx, Interface TacTiles).
			</p>
		</div>
		<div class="tab-section">
			<h4 class="tab-heading">Where It Goes</h4>
			<ul class="tab-list">
				<li>Open-plan offices, call centres, co-working</li>
				<li>Schools, universities, libraries</li>
				<li>Healthcare corridors (with sealed edges)</li>
				<li>Retail, hospitality, airports</li>
			</ul>
		</div>
		<div class="tab-section">
			<h4 class="tab-heading">Ratings & Certifications</h4>
			<ul class="tab-list">
				<li>CRI Green Label Plus (indoor air quality)</li>
				<li>NSF/ANSI 140 — Sustainable Carpet Assessment</li>
				<li>Class 1 fire rating (ASTM E648 / CAN/ULC S102.2)</li>
				<li>LEED v4 credit-eligible (recycled content, EPD)</li>
			</ul>
		</div>
	{/snippet}

	{#snippet install()}
		<div class="tile-morph-stage">
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
			class="tile-morph-pills"
			role="radiogroup"
			aria-label="Install pattern"
			bind:this={radiogroupEl}
		>
			{#each tilePatternList as p, i (p.id)}
				<button
					type="button"
					class="tile-morph-pill"
					class:tile-morph-pill--active={activeTilePattern === p.id}
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
		<div class="tab-section">
			<h4 class="tab-heading">Install Methods</h4>
			<ul class="tab-list">
				<li>
					<strong>Glue-down</strong> — full-spread pressure-sensitive adhesive. Most common commercial
					method.
				</li>
				<li>
					<strong>Tackifier release</strong> — repositionable adhesive for easy tile swaps and access
					floor panels.
				</li>
				<li>
					<strong>Peel-and-stick</strong> — factory-applied adhesive backing. Fast install, lower bond
					strength.
				</li>
				<li>
					<strong>TacTiles (Interface)</strong> — adhesive-free connectors between tiles. No wet adhesive,
					no VOC.
				</li>
			</ul>
		</div>
		<div class="tab-section">
			<h4 class="tab-heading">Subfloor Prep</h4>
			<ul class="tab-list">
				<li>Concrete must be dry (≤ 5 lbs MVER or ≤ 80% RH per ASTM F2170)</li>
				<li>Patch and level — FF25/FL20 minimum for glue-down</li>
				<li>Remove all curing compounds, sealers, adhesive residue</li>
				<li>Acclimate tiles in conditioned space 24–48 hrs before install</li>
			</ul>
		</div>
	{/snippet}

	{#snippet maintain()}
		<div class="tab-section">
			<h4 class="tab-heading">Routine Cleaning</h4>
			<ul class="tab-list">
				<li>
					<strong>Daily:</strong> vacuum with CRI-approved upright (beater bar off for loop pile)
				</li>
				<li><strong>Weekly:</strong> spot-clean spills within 24 hrs — blot, don't rub</li>
				<li><strong>Quarterly:</strong> interim extraction or encapsulation cleaning</li>
				<li><strong>Annual:</strong> hot-water extraction (truck-mount or portable)</li>
			</ul>
		</div>
		<div class="tab-section">
			<h4 class="tab-heading">Tile Replacement</h4>
			<p class="tab-text">
				The killer advantage of modular tile: pull up the damaged tile, drop in a replacement from
				attic stock. No seaming, no re-stretch. Keep 3–5% attic stock from every job for colour-lot
				matching.
			</p>
		</div>
		<div class="tab-section">
			<h4 class="tab-heading">Lifecycle</h4>
			<ul class="tab-list">
				<li>
					<strong>Commercial life:</strong> 10–15 years in moderate traffic, 7–10 in heavy
				</li>
				<li>
					<strong>Warranty:</strong> most manufacturers offer 10-year commercial wear + 15-year structural
				</li>
				<li>
					<strong>End of life:</strong> many mills offer take-back recycling (Shaw re[TURN], Interface
					ReEntry)
				</li>
			</ul>
		</div>
		<div class="tab-section">
			<h4 class="tab-heading">Pros & Cons Over Time</h4>
			<ul class="tab-list">
				<li>
					<strong>Pro:</strong> individual tile replacement — no full-room disruption
				</li>
				<li>
					<strong>Pro:</strong> access to underfloor services (data, power) without destroying the floor
				</li>
				<li>
					<strong>Con:</strong> seams can telegraph dirt lines in high-traffic paths if not maintained
				</li>
				<li>
					<strong>Con:</strong> edge curl on low-quality tiles or poor adhesive application
				</li>
			</ul>
		</div>
	{/snippet}
</ModalTabs>

<style>
	.tile-morph-stage {
		margin: 1.25rem auto 0.85rem;
		padding: 1rem;
		border-radius: var(--radius-lg);
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid var(--color-border-glass);
		max-width: 280px;
	}

	.tile-morph-stage svg {
		display: block;
		width: 100%;
		height: auto;
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

	.tile-morph-pills {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.45rem;
		margin: 0.85rem auto 1.25rem;
		max-width: 320px;
	}

	.tile-morph-pill {
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

	.tile-morph-pill:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 2px;
	}

	.tile-morph-pill:hover {
		color: var(--color-text);
		background: rgba(255, 255, 255, 0.04);
		border-color: rgba(255, 255, 255, 0.15);
	}

	.tile-morph-pill--active {
		color: var(--color-text);
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.25);
	}

	.tab-section {
		margin-bottom: 1rem;
	}

	.tab-section:last-child {
		margin-bottom: 0;
	}

	.tab-heading {
		font-family: var(--font-body);
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-text);
		margin: 0 0 0.4rem;
	}

	.tab-text {
		font-size: 0.88rem;
		color: var(--color-text-muted);
		line-height: 1.6;
		margin: 0;
	}

	.tab-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.tab-list li {
		font-size: 0.85rem;
		color: var(--color-text-muted);
		line-height: 1.5;
		padding-left: 1rem;
		position: relative;
	}

	.tab-list li::before {
		content: '·';
		position: absolute;
		left: 0.25rem;
		color: var(--color-text);
		font-weight: 700;
	}
</style>
