<!--
	YcModalLvt — 3-tab modal for LVT.
	Tab 1 (Product): concise identity — what it is, construction SVG, where it goes, ratings.
	Tab 2 (Installation): install methods, adhesives, subfloor prep, jobsite conditions.
	Tab 3 (Maintenance): cleaning, repairs, lifecycle, pros & cons, suppliers.
	Rendered inside YcProductModal when openProduct.material === 'lvt'.
	Restructured 2026-04-09 (v1.24.x) from single-panel to 3-tab layout.
-->
<script lang="ts">
	import { vinylContent } from '../data/interactions';
	import { supplierUrl } from '../data/suppliers';
	import YcModalTabs from './YcModalTabs.svelte';

	let exploded: boolean = $state(false);

	$effect(() => {
		const id = setTimeout(() => { exploded = true; }, 1000);
		return () => clearTimeout(id);
	});

	/* ── LVT layer definitions (to-scale ratios) ──
	 * Real thicknesses: wear ~0.5mm, print ~0.1mm, core ~3.5mm, backing ~1mm.
	 * Scaled ×20 so the thinnest layer (print) is still visible at 2px. */
	const layers = [
		{ label: 'Wear Layer',  fill: 'var(--yc-shimmer-25)',  h: 10 },
		{ label: 'Print Film',  fill: 'var(--yc-griege-35)',   h: 2  },
		{ label: 'Core',        fill: 'var(--yc-griege-55)',   h: 70 },
		{ label: 'Backing',     fill: 'var(--yc-griege-20)',   h: 20 },
	] as const;

	const colX = 20;
	const colW = 80;
	const labelX = colX + colW + 8; /* left edge of label text */
	const baseY = 10; /* top of assembled stack */
	const explodeGap = 14;

	const lvt = vinylContent.lvt;

	/** Compute Y position for each layer. */
	function layerY(idx: number, open: boolean): number {
		let y = baseY;
		for (let i = 0; i < idx; i++) y += layers[i].h;
		if (open) y += idx * explodeGap;
		return y;
	}
</script>

<YcModalTabs>
	{#snippet product()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">What It Is</h4>
			<p class="yc-tab-text">Multi-layer luxury vinyl tile and plank. High-resolution photographic print film under a clear urethane wear layer. The most-specified resilient flooring in commercial work.</p>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Construction</h4>
			<!-- ── Layer Exploded View SVG ── -->
			<div class="yc-modal-stage yc-explode" data-yc-anim>
				<svg
					viewBox="0 0 160 170"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					{#each layers as layer, i}
						{@const midY = layerY(i, false) + layer.h / 2}
						<g
							class="yc-explode-layer"
							class:yc-explode-layer--open={exploded}
							style="--explode-y: {layerY(i, true) - layerY(i, false)}px;
								transition-delay: {i * 80}ms;"
						>
							<rect
								x={colX}
								y={layerY(i, false)}
								width={colW}
								height={layer.h}
								fill={layer.fill}
								stroke="var(--yc-maple-gold)"
								stroke-width="0.5"
							/>
							<line
								x1={colX + colW}
								y1={midY}
								x2={labelX - 2}
								y2={midY}
								stroke="var(--yc-text-muted)"
								stroke-width="0.5"
								opacity="0.5"
							/>
							<text
								x={labelX}
								y={midY + 2.5}
								font-family="ui-monospace, 'SF Mono', monospace"
								font-size="7"
								letter-spacing="0.05em"
								fill="var(--yc-text-muted)"
							>
								{layer.label}
							</text>
						</g>
					{/each}
				</svg>
			</div>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Where It Goes</h4>
			<ul class="yc-tab-list">
				<li>Healthcare corridors</li>
				<li>Retail, hospitality</li>
				<li>Education</li>
				<li>Multi-tenant office</li>
				<li>Multi-storey residential</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Ratings & Certifications</h4>
			<ul class="yc-tab-list">
				<li>ASTM F1700 (solid vinyl tile)</li>
				<li>FloorScore / GreenGuard Gold</li>
				<li>Class III commercial wear (20–30 mil)</li>
				<li>LEED credit eligible</li>
			</ul>
		</div>
	{/snippet}

	{#snippet install()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Install Methods</h4>
			<ul class="yc-tab-list">
				<li><strong>Glue-down dryback</strong> — full-spread urethane adhesive. Most stable, standard commercial method.</li>
				<li><strong>Click-lock floating</strong> — no adhesive, allows substrate movement. Fast install.</li>
				<li><strong>Loose-lay rigid core</strong> — perimeter glue only, fast replacement.</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Adhesives</h4>
			<ul class="yc-tab-list">
				<li>Pressure-sensitive for dryback LVT</li>
				<li>Full-spread urethane for high-traffic</li>
				<li>No solvent-based — all low-VOC</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Subfloor Prep</h4>
			<ul class="yc-tab-list">
				<li>Concrete must pass ASTM F2170 (≤ 80% RH) or calcium chloride (≤ 5 lbs MVER)</li>
				<li>Patch to FF25/FL20</li>
				<li>Remove all sealers, curing compounds</li>
				<li>Acclimate 48 hrs</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Jobsite Conditions</h4>
			<ul class="yc-tab-list">
				<li>65–85°F, maintain 48 hrs before and after install</li>
				<li>Radiant heat OK for rigid core — cap at 85°F surface temp</li>
			</ul>
		</div>
	{/snippet}

	{#snippet maintain()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Routine Cleaning</h4>
			<ul class="yc-tab-list">
				<li><strong>Daily:</strong> dust mop or vacuum (no beater bar)</li>
				<li><strong>Weekly:</strong> damp mop with pH-neutral cleaner</li>
				<li><strong>Quarterly:</strong> scrub-and-recoat for high-traffic areas</li>
				<li>No wax, no polish — the wear layer IS the finish</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Repairs</h4>
			<ul class="yc-tab-list">
				<li>Individual plank replacement — heat to soften adhesive, pull, re-glue</li>
				<li>Click-lock: disassemble from nearest wall</li>
				<li>Keep 5% attic stock from every job</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Lifecycle</h4>
			<ul class="yc-tab-list">
				<li><strong>Commercial life:</strong> 15–20 years in moderate traffic</li>
				<li><strong>Wear layer thickness determines life:</strong> 20 mil = light commercial, 28–30 mil = heavy</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Pros & Cons</h4>
			<ul class="yc-tab-list">
				<li><strong>Pro:</strong> waterproof, dimensionally stable, quiet underfoot with acoustic backing</li>
				<li><strong>Pro:</strong> realistic wood/stone visuals without natural material maintenance</li>
				<li><strong>Con:</strong> can dent under sustained point loads (heavy furniture without pads)</li>
				<li><strong>Con:</strong> print film means the pattern repeats — visible in large open floors</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Suppliers</h4>
			<div class="yc-vinyl-suppliers">
				{#each lvt.suppliers as s}
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
	{/snippet}
</YcModalTabs>
