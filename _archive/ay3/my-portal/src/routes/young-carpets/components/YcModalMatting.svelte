<!--
	YcModalMatting — 3-tab modal for matting.
	Tab 1 (Product): concise identity — what it is, heatmap animation, where/types.
	Tab 2 (Installation): install methods, sizing, subfloor, integration.
	Tab 3 (Maintenance): cleaning, seasonal, repairs, lifecycle, pros & cons.
	Rendered inside YcProductModal when openProduct.material === 'matting'.
	Restructured 2026-04-09 (v1.24.x) from single-panel to 3-tab layout.
-->
<script lang="ts">
	import YcModalTabs from './YcModalTabs.svelte';

	let showZones = $state(false);

	$effect(() => {
		const timer = setTimeout(() => { showZones = true; }, 1500);
		return () => clearTimeout(timer);
	});
</script>

<YcModalTabs>
	{#snippet product()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">What It Is</h4>
			<p class="yc-tab-text">Entrance and walk-off matting systems — the first floor surface visitors touch. Engineered to trap dirt, moisture, and debris before it reaches the finish floor. Stops 80%+ of tracked-in soil.</p>
		</div>

		<!-- ── Heatmap animation: bird's-eye lobby with 3-zone overlay ── -->
		<div class="yc-modal-stage yc-mat" data-yc-anim>
			<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<defs>
					<!-- Heatmap radial: hot core (maple-gold) → warm → cool → transparent -->
					<radialGradient id="yc-heat-core" cx="50%" cy="12%" r="55%" fx="50%" fy="12%">
						<stop offset="0%" stop-color="var(--yc-maple-gold)" stop-opacity="0.6" />
						<stop offset="30%" stop-color="var(--yc-maple-gold)" stop-opacity="0.3" />
						<stop offset="60%" stop-color="var(--yc-shimmer-50)" stop-opacity="0.12" />
						<stop offset="100%" stop-color="var(--yc-shimmer-50)" stop-opacity="0" />
					</radialGradient>
					<!-- Secondary splash near door wings -->
					<radialGradient id="yc-heat-left" cx="25%" cy="10%" r="35%">
						<stop offset="0%" stop-color="var(--yc-maple-gold)" stop-opacity="0.35" />
						<stop offset="55%" stop-color="var(--yc-shimmer-50)" stop-opacity="0.08" />
						<stop offset="100%" stop-color="var(--yc-shimmer-50)" stop-opacity="0" />
					</radialGradient>
					<radialGradient id="yc-heat-right" cx="75%" cy="10%" r="35%">
						<stop offset="0%" stop-color="var(--yc-maple-gold)" stop-opacity="0.35" />
						<stop offset="55%" stop-color="var(--yc-shimmer-50)" stop-opacity="0.08" />
						<stop offset="100%" stop-color="var(--yc-shimmer-50)" stop-opacity="0" />
					</radialGradient>
					<!-- Zone hatching patterns -->
					<pattern id="yc-hm-grid" patternUnits="userSpaceOnUse" width="6" height="6">
						<line x1="0" y1="3" x2="6" y2="3" stroke="var(--yc-shimmer-50)" stroke-width="0.5" stroke-linecap="round" />
						<line x1="3" y1="0" x2="3" y2="6" stroke="var(--yc-shimmer-50)" stroke-width="0.5" stroke-linecap="round" />
					</pattern>
					<pattern id="yc-hm-pile" patternUnits="userSpaceOnUse" width="4" height="4">
						<line x1="2" y1="0" x2="2" y2="4" stroke="var(--yc-griege-65)" stroke-width="0.6" stroke-linecap="round" />
					</pattern>
				</defs>

				<!-- Lobby floor background -->
				<rect x="10" y="6" width="300" height="148" rx="4"
					fill="var(--yc-griege-08)" stroke="var(--yc-shimmer-40)" stroke-width="1" />

				<!-- Door opening indicator at top -->
				<line x1="110" y1="6" x2="210" y2="6" stroke="var(--yc-text-muted)" stroke-width="1.8" stroke-linecap="round" />
				<text x="160" y="3" font-size="5.5" font-family="ui-monospace, 'SF Mono', monospace"
					fill="var(--yc-text-faint)" letter-spacing="0.08em" text-anchor="middle">ENTRANCE</text>

				<!-- Heatmap layers — pulsing opacity -->
				<rect x="10" y="6" width="300" height="148" rx="4"
					fill="url(#yc-heat-core)" class="yc-hm-pulse yc-hm-pulse-1" />
				<rect x="10" y="6" width="300" height="148" rx="4"
					fill="url(#yc-heat-left)" class="yc-hm-pulse yc-hm-pulse-2" />
				<rect x="10" y="6" width="300" height="148" rx="4"
					fill="url(#yc-heat-right)" class="yc-hm-pulse yc-hm-pulse-3" />

				<!-- Faint traffic flow lines (decorative) -->
				<line x1="160" y1="14" x2="140" y2="80" stroke="var(--yc-shimmer-40)" stroke-width="0.6" stroke-linecap="round" stroke-dasharray="3 4" />
				<line x1="160" y1="14" x2="180" y2="80" stroke="var(--yc-shimmer-40)" stroke-width="0.6" stroke-linecap="round" stroke-dasharray="3 4" />
				<line x1="160" y1="14" x2="160" y2="85" stroke="var(--yc-shimmer-40)" stroke-width="0.6" stroke-linecap="round" stroke-dasharray="3 4" />
				<line x1="160" y1="14" x2="110" y2="70" stroke="var(--yc-shimmer-40)" stroke-width="0.6" stroke-linecap="round" stroke-dasharray="3 4" />
				<line x1="160" y1="14" x2="210" y2="70" stroke="var(--yc-shimmer-40)" stroke-width="0.6" stroke-linecap="round" stroke-dasharray="3 4" />

				<!-- 3-zone matting overlay — fades in after 1.5s -->
				<g class="yc-hm-zones" class:yc-hm-zones-visible={showZones}>
					<!-- Zone 1: SCRAPE — closest to door -->
					<rect x="50" y="12" width="220" height="34" rx="2"
						fill="url(#yc-hm-grid)" stroke="var(--yc-maple-gold)" stroke-width="1.2"
						stroke-dasharray="4 2" opacity="0.85" />
					<text x="160" y="32" font-size="8.5" font-family="ui-monospace, 'SF Mono', monospace"
						fill="var(--yc-text-muted)" letter-spacing="0.1em" text-anchor="middle">SCRAPE</text>
					<text x="160" y="42" font-size="6.5" font-family="ui-monospace, 'SF Mono', monospace"
						fill="var(--yc-text-faint)" letter-spacing="0.05em" text-anchor="middle">grit + mud · 0–4 ft</text>

					<!-- Zone 2: WIPE — middle band -->
					<rect x="35" y="52" width="250" height="40" rx="2"
						fill="url(#yc-hm-pile)" stroke="var(--yc-shimmer-50)" stroke-width="1"
						stroke-dasharray="4 2" opacity="0.75" />
					<text x="160" y="74" font-size="8.5" font-family="ui-monospace, 'SF Mono', monospace"
						fill="var(--yc-text-muted)" letter-spacing="0.1em" text-anchor="middle">WIPE</text>
					<text x="160" y="84" font-size="6.5" font-family="ui-monospace, 'SF Mono', monospace"
						fill="var(--yc-text-faint)" letter-spacing="0.05em" text-anchor="middle">water + salt · 4–8 ft</text>

					<!-- Zone 3: DRY — furthest from door -->
					<rect x="25" y="98" width="270" height="40" rx="2"
						fill="var(--yc-griege-08)" stroke="var(--yc-shimmer-40)" stroke-width="0.8"
						stroke-dasharray="4 2" opacity="0.65" />
					<text x="160" y="120" font-size="8.5" font-family="ui-monospace, 'SF Mono', monospace"
						fill="var(--yc-text-muted)" letter-spacing="0.1em" text-anchor="middle">DRY</text>
					<text x="160" y="130" font-size="6.5" font-family="ui-monospace, 'SF Mono', monospace"
						fill="var(--yc-text-faint)" letter-spacing="0.05em" text-anchor="middle">finish floor · 8–12 ft</text>
				</g>
			</svg>
		</div>

		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Where It Goes</h4>
			<p class="yc-tab-text">Building entrances, elevator lobbies, hallway transitions, loading docks, vestibules, revolving door zones.</p>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Types</h4>
			<ul class="yc-tab-list">
				<li><strong>Recessed grid systems</strong> — aluminium frames with carpet, scraper, or rubber inserts set flush in a poured well (Construction Specialties Pedimat).</li>
				<li><strong>Surface scraper-and-wiper mats</strong> — high-absorbency tufted goods, glue-down or loose-lay (Forbo Coral, 3M Nomad).</li>
				<li><strong>Roll goods</strong> — cocoa or vinyl-loop, cut to size for vestibules and corridors.</li>
				<li><strong>Elevator cab mats</strong> — cut-to-size inserts, branded or unbranded, replaced on a regular cycle.</li>
				<li><strong>Anti-fatigue mats</strong> — cushioned mats for standing stations, reception desks, service counters.</li>
			</ul>
		</div>
	{/snippet}

	{#snippet install()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Install Methods</h4>
			<ul class="yc-tab-list">
				<li><strong>Recessed frame</strong> — aluminium frame set flush with finish floor, mat drops in. Requires floor recess during construction (3/8"–3/4" depth).</li>
				<li><strong>Surface-mount</strong> — lay directly on finish floor, anchor with double-sided tape or perimeter adhesive.</li>
				<li><strong>Roll goods</strong> — cut to size, loose-lay or perimeter glue in vestibules.</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Sizing</h4>
			<p class="yc-tab-text">ASHRAE recommends 10–15 feet of walk-off from every entrance. 3-zone system: scraper zone (outdoor/vestibule), transition zone (vestibule/lobby), wiper zone (lobby interior).</p>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Subfloor</h4>
			<ul class="yc-tab-list">
				<li>Recessed frames need slab depression poured during construction.</li>
				<li>Retrofit = cut-in with saw, pour new depression.</li>
				<li>Surface mats need flat, clean substrate.</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Integration</h4>
			<ul class="yc-tab-list">
				<li>Coordinate with architect for recess depths.</li>
				<li>Coordinate with GC for slab pours.</li>
				<li>Elevator cab mats — sized to cab dimensions, removable for cleaning.</li>
			</ul>
		</div>
	{/snippet}

	{#snippet maintain()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Routine Cleaning</h4>
			<ul class="yc-tab-list">
				<li><strong>Daily:</strong> vacuum surface debris.</li>
				<li><strong>Weekly:</strong> extract or pressure-wash (recessed systems lift out).</li>
				<li>Shake out surface mats daily in high-traffic entrances.</li>
				<li>Rotate mats in pairs — one in service, one drying.</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Seasonal</h4>
			<ul class="yc-tab-list">
				<li>Spring and fall — peak tracking season.</li>
				<li>Double mat coverage in snow/salt months.</li>
				<li>Switch to heavier scraper inserts in winter.</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Repairs</h4>
			<p class="yc-tab-text">Replace worn mat inserts in recessed frames (the frame lasts decades, inserts are consumable). Patch or replace surface mats when fibre is matted flat and no longer wicks moisture.</p>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Lifecycle</h4>
			<ul class="yc-tab-list">
				<li><strong>Recessed frames:</strong> 20–30 years.</li>
				<li><strong>Mat inserts:</strong> 2–5 years depending on traffic.</li>
				<li><strong>Surface mats:</strong> 1–3 years in heavy commercial.</li>
				<li>This is a consumable — budget for replacement cycles.</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Pros & Cons</h4>
			<ul class="yc-tab-list">
				<li><strong>Pro:</strong> protects every other floor in the building (ROI is indirect but massive).</li>
				<li><strong>Pro:</strong> reduces slip-and-fall liability at entrances.</li>
				<li><strong>Con:</strong> recessed systems require early coordination with architect/GC.</li>
				<li><strong>Con:</strong> inserts are a recurring cost.</li>
				<li><strong>Con:</strong> undersized matting = false economy (soil gets past and damages finish floors).</li>
			</ul>
		</div>
	{/snippet}
</YcModalTabs>
