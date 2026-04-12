<!--
	YcModalCarpetTile — 3-tab modal for carpet tile.
	Tab 1 (Product): concise identity — what it is, formats, ratings.
	Tab 2 (Installation): 6×6 pattern morph animation + install methods.
	Tab 3 (Maintenance): cleaning, replacement, lifecycle.
	Rendered inside YcProductModal when openProduct.material === 'carpet-tile'.
	Restructured 2026-04-09 (v1.24.x) from single-panel to 3-tab layout.
-->
<script lang="ts">
	import { type TilePattern, tilePatternList } from '../data/interactions';
	import YcModalTabs from './YcModalTabs.svelte';

	let activeTilePattern: TilePattern = $state('monolithic');

	const randomRotations: number[] = [
		0, 2, 1, 3, 0, 2,
		3, 0, 2, 1, 3, 1,
		1, 3, 0, 2, 1, 0,
		2, 1, 3, 0, 2, 3,
		0, 2, 1, 3, 0, 1,
		3, 0, 2, 1, 3, 2
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
				rot = randomRotations[i] * 90;
				break;
			case 'ashlar':
				if (col % 2 === 1) ty += 15;
				rot = 0;
				break;
		}
		return `translate(${tx} ${ty}) translate(15 15) rotate(${rot}) scale(${scale}) translate(-15 -15)`;
	}
</script>

<YcModalTabs>
	{#snippet product()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">What It Is</h4>
			<p class="yc-tab-text">Modular carpet squares and planks — 18×18, 24×24, 18×36, and plank formats. Each tile is individually replaceable without tearing up the whole floor.</p>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Construction</h4>
			<p class="yc-tab-text">Tufted nylon or PET face fibre on a dimensionally stable backing — typically PVC, bitumen, or cushion-back. Some lines use recycled content backing (Shaw EcoWorx, Interface TacTiles).</p>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Where It Goes</h4>
			<ul class="yc-tab-list">
				<li>Open-plan offices, call centres, co-working</li>
				<li>Schools, universities, libraries</li>
				<li>Healthcare corridors (with sealed edges)</li>
				<li>Retail, hospitality, airports</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Ratings & Certifications</h4>
			<ul class="yc-tab-list">
				<li>CRI Green Label Plus (indoor air quality)</li>
				<li>NSF/ANSI 140 — Sustainable Carpet Assessment</li>
				<li>Class 1 fire rating (ASTM E648 / CAN/ULC S102.2)</li>
				<li>LEED v4 credit-eligible (recycled content, EPD)</li>
			</ul>
		</div>
	{/snippet}

	{#snippet install()}
		<!-- ── Pattern morph animation ── -->
		<div class="yc-modal-stage yc-tile-morph" data-yc-anim>
			<svg viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<defs>
					<clipPath id="yc-tile-morph-clip">
						<rect x="0" y="0" width="180" height="180" />
					</clipPath>
				</defs>
				<g class="yc-tile-morph-grid" clip-path="url(#yc-tile-morph-clip)">
					{#each Array(36) as _, i (i)}
						<g
							class="yc-tile-morph-tile"
							transform={tileTransform(i, activeTilePattern)}
						>
							<rect
								x="0" y="0" width="30" height="30" rx="2"
								fill="var(--yc-shimmer-06)"
								stroke="var(--yc-shimmer-32)"
								stroke-width="0.8"
							/>
							<line x1="6" y1="6" x2="14" y2="6"
								stroke="var(--yc-griege-65)" stroke-width="1" stroke-linecap="round" />
							<line x1="6" y1="6" x2="6" y2="14"
								stroke="var(--yc-griege-65)" stroke-width="1" stroke-linecap="round" />
						</g>
					{/each}
				</g>
			</svg>
		</div>
		<div class="yc-tile-morph-pills" role="radiogroup" aria-label="Install pattern">
			{#each tilePatternList as p}
				<button
					type="button"
					class="yc-tile-morph-pill"
					class:yc-tile-morph-pill--active={activeTilePattern === p.id}
					role="radio"
					aria-checked={activeTilePattern === p.id}
					onclick={() => (activeTilePattern = p.id)}
				>
					{p.label}
				</button>
			{/each}
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Install Methods</h4>
			<ul class="yc-tab-list">
				<li><strong>Glue-down</strong> — full-spread pressure-sensitive adhesive. Most common commercial method.</li>
				<li><strong>Tackifier release</strong> — repositionable adhesive for easy tile swaps and access floor panels.</li>
				<li><strong>Peel-and-stick</strong> — factory-applied adhesive backing. Fast install, lower bond strength.</li>
				<li><strong>TacTiles (Interface)</strong> — adhesive-free connectors between tiles. No wet adhesive, no VOC.</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Subfloor Prep</h4>
			<ul class="yc-tab-list">
				<li>Concrete must be dry (≤ 5 lbs MVER or ≤ 80% RH per ASTM F2170)</li>
				<li>Patch and level — FF25/FL20 minimum for glue-down</li>
				<li>Remove all curing compounds, sealers, adhesive residue</li>
				<li>Acclimate tiles in conditioned space 24–48 hrs before install</li>
			</ul>
		</div>
	{/snippet}

	{#snippet maintain()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Routine Cleaning</h4>
			<ul class="yc-tab-list">
				<li><strong>Daily:</strong> vacuum with CRI-approved upright (beater bar off for loop pile)</li>
				<li><strong>Weekly:</strong> spot-clean spills within 24 hrs — blot, don't rub</li>
				<li><strong>Quarterly:</strong> interim extraction or encapsulation cleaning</li>
				<li><strong>Annual:</strong> hot-water extraction (truck-mount or portable)</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Tile Replacement</h4>
			<p class="yc-tab-text">The killer advantage of modular tile: pull up the damaged tile, drop in a replacement from attic stock. No seaming, no re-stretch. Keep 3–5% attic stock from every job for colour-lot matching.</p>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Lifecycle</h4>
			<ul class="yc-tab-list">
				<li><strong>Commercial life:</strong> 10–15 years in moderate traffic, 7–10 in heavy</li>
				<li><strong>Warranty:</strong> most manufacturers offer 10-year commercial wear + 15-year structural</li>
				<li><strong>End of life:</strong> many mills offer take-back recycling (Shaw re[TURN], Interface ReEntry)</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Pros & Cons Over Time</h4>
			<ul class="yc-tab-list">
				<li><strong>Pro:</strong> individual tile replacement — no full-room disruption</li>
				<li><strong>Pro:</strong> access to underfloor services (data, power) without destroying the floor</li>
				<li><strong>Con:</strong> seams can telegraph dirt lines in high-traffic paths if not maintained</li>
				<li><strong>Con:</strong> edge curl on low-quality tiles or poor adhesive application</li>
			</ul>
		</div>
	{/snippet}
</YcModalTabs>
