<!--
	YcModalHardwood — 3-tab modal for hardwood (Wood⁺).
	Tab 1 (Product): identity, 6 flip cards, where it goes, ratings.
	Tab 2 (Installation): methods, subfloor prep, acclimation, finishing.
	Tab 3 (Maintenance): cleaning, refinishing, cork/bamboo notes, lifecycle, pros/cons.
	Rendered inside YcProductModal when openProduct.material === 'hardwood'.
	Owns its own flipped state (resets on each modal open).
	Restructured 2026-04-09 (v1.24.x) from single-panel to 3-tab layout.
-->
<script lang="ts">
	import { type HardwoodCard, hardwoodCards } from '../data/interactions';
	import YcModalTabs from './YcModalTabs.svelte';

	let flippedHardwoodCard: HardwoodCard | null = $state(null);
	function flipHardwood(id: HardwoodCard) {
		flippedHardwoodCard = flippedHardwoodCard === id ? null : id;
	}
</script>

<YcModalTabs>
	{#snippet product()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">What It Is</h4>
			<p class="yc-tab-text">Real wood flooring — solid planks, engineered veneer, parquet patterns. Plus related natural products: bamboo (strand-woven, harder than most hardwoods), cork (bark-harvested, acoustic insulation), and reclaimed (salvaged old-growth).</p>
		</div>

		<!-- ── 6 flip cards (3×2 grid) ── -->
		<div class="yc-hw-flips">
			{#each hardwoodCards as card}
				<button
					type="button"
					class="yc-hw-flip"
					class:yc-hw-flip--flipped={flippedHardwoodCard === card.id}
					onclick={() => flipHardwood(card.id)}
					aria-label={`${card.label} hardwood — ${flippedHardwoodCard === card.id ? 'flipping back' : 'tap to see specs'}`}
				>
					<div class="yc-hw-flip-inner">
						<div class="yc-hw-flip-face yc-hw-flip-front">
							<span class="yc-hw-flip-label">{card.label}</span>
							<span class="yc-hw-flip-front-text">{card.front}</span>
						</div>
						<div class="yc-hw-flip-face yc-hw-flip-back">
							<span class="yc-hw-flip-back-heading">Thickness</span>
							<span class="yc-hw-flip-back-text">{card.thickness}</span>
							<span class="yc-hw-flip-back-heading">Best for</span>
							<span class="yc-hw-flip-back-text">{card.bestFor}</span>
							<span class="yc-hw-flip-back-heading">Install</span>
							<span class="yc-hw-flip-back-text">{card.install}</span>
						</div>
					</div>
				</button>
			{/each}
		</div>
		<p class="yc-hw-tap-hint">Tap a card to flip and see specs.</p>

		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Where It Goes</h4>
			<ul class="yc-tab-list">
				<li>Executive offices, showrooms</li>
				<li>Heritage buildings, boutique hotels</li>
				<li>Restaurants, university common rooms</li>
				<li>Luxury retail</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Ratings & Certifications</h4>
			<ul class="yc-tab-list">
				<li>NWFA (National Wood Flooring Association) standards</li>
				<li>Janka hardness scale</li>
				<li>LEED credit-eligible (certified wood, material reuse for reclaimed)</li>
				<li>CARB Phase 2 formaldehyde compliance</li>
			</ul>
		</div>
	{/snippet}

	{#snippet install()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Install Methods</h4>
			<ul class="yc-tab-list">
				<li><strong>Nail-down</strong> — 3/4" solid over plywood subfloor. The traditional method.</li>
				<li><strong>Glue-down</strong> — engineered over concrete. Full-spread urethane adhesive.</li>
				<li><strong>Floating click-lock</strong> — engineered with underlayment. Fastest install.</li>
				<li><strong>Pattern-laid</strong> — parquet herringbone/chevron. Hand-laid, glue-down.</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Subfloor Prep</h4>
			<ul class="yc-tab-list">
				<li><strong>Wood subfloor:</strong> 3/4" CDX plywood, screwed, no squeaks</li>
				<li><strong>Concrete:</strong> must pass ASTM F2170 (&le; 80% RH). Moisture barrier required for slab-on-grade</li>
				<li><strong>Radiant heat:</strong> OK for engineered only — cap at 85&deg;F</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Acclimation</h4>
			<ul class="yc-tab-list">
				<li>Deliver to jobsite 3–5 days before install</li>
				<li>Store in conditioned space at job's final humidity range</li>
				<li>Bamboo needs 72 hrs minimum</li>
				<li>Cork needs stable 50–70% RH</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Finishing</h4>
			<ul class="yc-tab-list">
				<li><strong>Site-finished:</strong> sand, stain, seal on site — seamless, custom colour. Adds 3–5 days to schedule.</li>
				<li><strong>Pre-finished:</strong> factory-applied, UV-cured — faster install, harder coating.</li>
			</ul>
		</div>
	{/snippet}

	{#snippet maintain()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Routine Cleaning</h4>
			<ul class="yc-tab-list">
				<li><strong>Daily:</strong> dust mop (microfibre)</li>
				<li><strong>Weekly:</strong> vacuum with hard-floor setting</li>
				<li><strong>Damp mop:</strong> manufacturer-approved cleaner only. Never wet-mop — standing water is the enemy.</li>
				<li>Felt pads under all furniture</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Refinishing</h4>
			<ul class="yc-tab-list">
				<li><strong>Screen-and-recoat:</strong> buff existing finish, apply new coat — every 3–5 years in commercial</li>
				<li><strong>Full sand-and-refinish:</strong> sand to bare wood — every 10–15 years or when screen-and-recoat is no longer effective</li>
				<li>Solid 3/4" can be refinished 3–5 times over its life</li>
				<li>Engineered depends on wear layer thickness (2mm = 1 refinish, 4mm+ = 2–3)</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Cork</h4>
			<ul class="yc-tab-list">
				<li>Seal with 2–3 coats polyurethane for commercial wear</li>
				<li>Re-coat every 5–7 years</li>
				<li>Cork dents recover partially over time (cellular memory)</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Bamboo</h4>
			<ul class="yc-tab-list">
				<li>Treat like hardwood</li>
				<li>Strand-woven is extremely hard (Janka 3000+) but can still scratch</li>
				<li>Avoid below-grade slabs without moisture barrier</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Lifecycle</h4>
			<ul class="yc-tab-list">
				<li><strong>Solid hardwood:</strong> 50–100+ years (refinishable)</li>
				<li><strong>Engineered:</strong> 20–30 years</li>
				<li><strong>Bamboo:</strong> 20–25 years</li>
				<li><strong>Cork:</strong> 15–20 years</li>
				<li><strong>Reclaimed:</strong> already survived 100+ years, will outlast everything else</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Pros & Cons</h4>
			<ul class="yc-tab-list">
				<li><strong>Pro:</strong> timeless aesthetic, adds real estate value, refinishable (solid)</li>
				<li><strong>Pro:</strong> reclaimed wood is one-of-a-kind, LEED material reuse credit</li>
				<li><strong>Con:</strong> moisture-sensitive (not for kitchens, wet areas, below-grade without barrier)</li>
				<li><strong>Con:</strong> dents and scratches (especially softer species — pine, cherry)</li>
				<li><strong>Con:</strong> highest installed cost per sq ft among common commercial floors</li>
				<li><strong>Con:</strong> site-finishing generates dust and VOC — requires space isolation</li>
			</ul>
		</div>
	{/snippet}
</YcModalTabs>
