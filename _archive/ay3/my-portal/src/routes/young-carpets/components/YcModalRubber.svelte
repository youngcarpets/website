<!--
	YcModalRubber — 3-tab modal for rubber flooring.
	Tab 1 (Product): concise identity — what it is, impact animation, recycled note, ratings.
	Tab 2 (Installation): 3-segment toggle (FITNESS/HEALTHCARE/INDUSTRIAL) + technical notes.
	Tab 3 (Maintenance): cleaning, repairs, lifecycle, pros & cons.
	Rendered inside YcProductModal when openProduct.material === 'rubber'.
	Restructured 2026-04-09 (v1.24.x) from single-panel to 3-tab layout.
-->
<script lang="ts">
	import { type RubberSegment, rubberSegments, rubberContent } from '../data/interactions';
	import { supplierUrl } from '../data/suppliers';
	import YcModalTabs from './YcModalTabs.svelte';

	let activeRubberSegment: RubberSegment = $state('fitness');
</script>

<YcModalTabs>
	{#snippet product()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">What It Is</h4>
			<p class="yc-tab-text">Vulcanized rubber flooring — dense, resilient, slip-resistant. Made from natural or synthetic rubber (many lines use recycled tire crumb).</p>
		</div>

		<!-- ── Impact / Drop Absorption by Thickness ── -->
		<div class="yc-modal-stage yc-impact" data-yc-anim>
			<svg viewBox="0 0 300 150" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
				<!-- ── Column 1: 6 mm ── -->
				<g transform="translate(20, 0)">
					<!-- Concrete slab -->
					<rect class="yc-impact-slab" x="0" y="100" width="70" height="24" rx="2"
						fill="var(--yc-griege-20)" stroke="var(--yc-griege-32)" stroke-width="0.5" />
					<!-- Flash on slab (red — impact reaches through) -->
					<rect class="yc-impact-slab-flash yc-impact-slab-flash--thin" x="0" y="100" width="70" height="24" rx="2"
						fill="#e05545" opacity="0" />
					<!-- Rubber layer (6 mm → 6px tall) -->
					<rect x="0" y="94" width="70" height="6" rx="1"
						fill="var(--yc-griege-32)" stroke="var(--yc-shimmer-20)" stroke-width="0.5" />
					<!-- Weight (dumbbell) -->
					<g class="yc-weight yc-weight--col1">
						<circle cx="12" cy="4" r="4" fill="var(--yc-text-muted)" />
						<rect x="12" y="1" width="46" height="6" rx="1.5" fill="var(--yc-text-muted)" />
						<circle cx="58" cy="4" r="4" fill="var(--yc-text-muted)" />
					</g>
					<!-- Labels -->
					<text x="35" y="136" text-anchor="middle" font-family="ui-monospace, 'SF Mono', monospace"
						font-size="8" fill="var(--yc-text-muted)" letter-spacing="0.05em">6 mm</text>
					<text x="35" y="145" text-anchor="middle" font-family="ui-monospace, 'SF Mono', monospace"
						font-size="7" fill="#e05545" letter-spacing="0.05em">✗</text>
				</g>

				<!-- ── Column 2: 8 mm ── -->
				<g transform="translate(115, 0)">
					<!-- Concrete slab -->
					<rect class="yc-impact-slab" x="0" y="100" width="70" height="24" rx="2"
						fill="var(--yc-griege-20)" stroke="var(--yc-griege-32)" stroke-width="0.5" />
					<!-- Flash on slab (amber — partial absorption) -->
					<rect class="yc-impact-slab-flash yc-impact-slab-flash--mid" x="0" y="100" width="70" height="24" rx="2"
						fill="var(--yc-maple-gold)" opacity="0" />
					<!-- Rubber layer (8 mm → 8px tall) -->
					<rect x="0" y="92" width="70" height="8" rx="1"
						fill="var(--yc-griege-32)" stroke="var(--yc-shimmer-20)" stroke-width="0.5" />
					<!-- Weight (dumbbell) -->
					<g class="yc-weight yc-weight--col2">
						<circle cx="12" cy="4" r="4" fill="var(--yc-text-muted)" />
						<rect x="12" y="1" width="46" height="6" rx="1.5" fill="var(--yc-text-muted)" />
						<circle cx="58" cy="4" r="4" fill="var(--yc-text-muted)" />
					</g>
					<!-- Labels -->
					<text x="35" y="136" text-anchor="middle" font-family="ui-monospace, 'SF Mono', monospace"
						font-size="8" fill="var(--yc-text-muted)" letter-spacing="0.05em">8 mm</text>
					<text x="35" y="145" text-anchor="middle" font-family="ui-monospace, 'SF Mono', monospace"
						font-size="7" fill="var(--yc-maple-gold)" letter-spacing="0.05em">~</text>
				</g>

				<!-- ── Column 3: 12 mm ── -->
				<g transform="translate(210, 0)">
					<!-- Concrete slab -->
					<rect class="yc-impact-slab" x="0" y="100" width="70" height="24" rx="2"
						fill="var(--yc-griege-20)" stroke="var(--yc-griege-32)" stroke-width="0.5" />
					<!-- Flash on slab (green — fully absorbed, never fires visibly) -->
					<rect class="yc-impact-slab-flash yc-impact-slab-flash--thick" x="0" y="100" width="70" height="24" rx="2"
						fill="#4ead6a" opacity="0" />
					<!-- Rubber layer (12 mm → 12px tall) -->
					<rect x="0" y="88" width="70" height="12" rx="1"
						fill="var(--yc-griege-32)" stroke="var(--yc-shimmer-20)" stroke-width="0.5" />
					<!-- Weight (dumbbell) -->
					<g class="yc-weight yc-weight--col3">
						<circle cx="12" cy="4" r="4" fill="var(--yc-text-muted)" />
						<rect x="12" y="1" width="46" height="6" rx="1.5" fill="var(--yc-text-muted)" />
						<circle cx="58" cy="4" r="4" fill="var(--yc-text-muted)" />
					</g>
					<!-- Labels -->
					<text x="35" y="136" text-anchor="middle" font-family="ui-monospace, 'SF Mono', monospace"
						font-size="8" fill="var(--yc-text-muted)" letter-spacing="0.05em">12 mm</text>
					<text x="35" y="145" text-anchor="middle" font-family="ui-monospace, 'SF Mono', monospace"
						font-size="7" fill="#4ead6a" letter-spacing="0.05em">✓</text>
				</g>
			</svg>
		</div>

		<!-- ── Recycled tire origin callout ── -->
		<div class="yc-recycled-note">
			<strong>Recycled Tire Origin</strong>
			<p>Most commercial rubber flooring starts as recycled tires — shredded into crumb, bound with polyurethane, and compressed into tiles or rolls. The speckle pattern isn't decorative, it's the raw material showing through.</p>
		</div>

		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Where It Goes</h4>
			<ul class="yc-tab-list">
				<li>Fitness centres, weight rooms</li>
				<li>Hospital corridors</li>
				<li>Industrial / manufacturing</li>
				<li>School stairwells</li>
				<li>Labs</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Ratings & Certifications</h4>
			<ul class="yc-tab-list">
				<li>ASTM F1344 (rubber tile)</li>
				<li>ASTM D2047 (slip resistance)</li>
				<li>ADA-compliant</li>
				<li>Class 1 fire rating</li>
				<li>Static-dissipative variants available (ANSI/ESD S20.20)</li>
			</ul>
		</div>
	{/snippet}

	{#snippet install()}
		<!-- ── Rubber 3-segment toggle ── -->
		<div class="yc-rubber-segments" role="tablist" aria-label="Rubber use case">
			{#each rubberSegments as s}
				<button
					type="button"
					class="yc-rubber-segment"
					class:yc-rubber-segment--active={activeRubberSegment === s.id}
					role="tab"
					aria-selected={activeRubberSegment === s.id}
					onclick={() => (activeRubberSegment = s.id)}
				>
					{s.label}
				</button>
			{/each}
		</div>
		{#key activeRubberSegment}
			<div class="yc-rubber-panel" role="tabpanel" data-yc-anim>
				<p class="yc-rubber-hero">{rubberContent[activeRubberSegment].hero}</p>
				<p class="yc-rubber-why">{rubberContent[activeRubberSegment].why}</p>
				<div class="yc-tab-section">
					<h4 class="yc-tab-heading">Install</h4>
					<ul class="yc-tab-list">
						{#each rubberContent[activeRubberSegment].install as item}
							<li>{item}</li>
						{/each}
					</ul>
				</div>
				<div class="yc-tab-section">
					<h4 class="yc-tab-heading">Best used for</h4>
					<ul class="yc-tab-list">
						{#each rubberContent[activeRubberSegment].bestFor as item}
							<li>{item}</li>
						{/each}
					</ul>
				</div>
				<div class="yc-tab-section">
					<h4 class="yc-tab-heading">Suppliers</h4>
					<div class="yc-vinyl-suppliers">
						{#each rubberContent[activeRubberSegment].suppliers as s}
							{@const url = supplierUrl(s)}
							{#if url}
								<a
									class="yc-vinyl-supplier-chip yc-vinyl-supplier-chip--link"
									href={url}
									target="_blank"
									rel="noopener noreferrer"
								>{s}</a>
							{:else}
								<span class="yc-vinyl-supplier-chip">{s}</span>
							{/if}
						{/each}
					</div>
				</div>
			</div>
		{/key}

		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Subfloor Prep</h4>
			<ul class="yc-tab-list">
				<li>Concrete must be dry (≤ 5 lbs MVER), clean, level</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Adhesive</h4>
			<ul class="yc-tab-list">
				<li>Epoxy or polyurethane for heavy-use</li>
				<li>Contact cement for stair treads</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Seaming</h4>
			<ul class="yc-tab-list">
				<li>Butt seams tight, no overlap</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Stair Treads</h4>
			<ul class="yc-tab-list">
				<li>Mechanical fasteners + adhesive at nosing</li>
			</ul>
		</div>
	{/snippet}

	{#snippet maintain()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Routine Cleaning</h4>
			<ul class="yc-tab-list">
				<li><strong>Daily:</strong> auto-scrub or damp mop with pH-neutral cleaner</li>
				<li>No wax, no polish — rubber is self-finishing</li>
				<li><strong>Weekly:</strong> scrub with soft-bristle pad in fitness areas (sweat/chalk buildup)</li>
				<li>Avoid petroleum-based cleaners (degrades rubber)</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Repairs</h4>
			<ul class="yc-tab-list">
				<li><strong>Tiles:</strong> pull and replace (heat to soften adhesive)</li>
				<li><strong>Sheet:</strong> patch with matching material, butt seams</li>
				<li><strong>Stair treads:</strong> replace individual treads (remove nosing screws, peel, re-glue)</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Lifecycle</h4>
			<ul class="yc-tab-list">
				<li><strong>Moderate commercial traffic:</strong> 20–30 years</li>
				<li><strong>Fitness areas:</strong> 15–20 years (drop damage accumulates)</li>
				<li><strong>Stair treads:</strong> 10–15 years in heavy institutional use</li>
				<li>Rubber darkens and hardens with age but retains slip resistance</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Pros & Cons</h4>
			<ul class="yc-tab-list">
				<li><strong>Pro:</strong> impact absorption, sound dampening, slip-resistant wet or dry</li>
				<li><strong>Pro:</strong> extremely durable, low maintenance, no finishing</li>
				<li><strong>Con:</strong> limited colour palette (earth tones, speckle)</li>
				<li><strong>Con:</strong> heavy (3–5 lbs/sq ft for 8 mm tile) — freight and handling cost</li>
				<li><strong>Con:</strong> off-gassing odour in first 2–4 weeks (ventilate during and after install)</li>
			</ul>
		</div>
	{/snippet}
</YcModalTabs>
