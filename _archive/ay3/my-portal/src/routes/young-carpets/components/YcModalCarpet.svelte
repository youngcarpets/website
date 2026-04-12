<!--
	YcModalCarpet — 3-tab modal for broadloom carpet.
	Tab 1 (Product): concise identity — what it is, noise path animation, where it goes, ratings.
	Tab 2 (Installation): install methods, seaming, subfloor prep, jobsite conditions.
	Tab 3 (Maintenance): cleaning, repairs, lifecycle, pros & cons.
	Rendered inside YcProductModal when openProduct.material === 'carpet'.
	Restructured 2026-04-09 (v1.24.x) from single-panel to 3-tab layout.
-->
<script lang="ts">
	import YcModalTabs from './YcModalTabs.svelte';

	let dampened: boolean = $state(false);
	let autoFired: boolean = $state(false);

	$effect(() => {
		const prm =
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prm) {
			dampened = true;
			autoFired = true;
			return;
		}
		if (autoFired) return;
		const t = setTimeout(() => {
			dampened = true;
			autoFired = true;
		}, 3000);
		return () => clearTimeout(t);
	});
</script>

<YcModalTabs>
	{#snippet product()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">What It Is</h4>
			<p class="yc-tab-text">Wall-to-wall broadloom carpet — continuous rolls, typically 12' wide. The original commercial floor covering.</p>
		</div>

		<!-- ── Noise path animation ── -->
		<div class="yc-modal-stage yc-noise" data-yc-anim>
			<!-- ── Toggle pills ── -->
			<div class="yc-noise-pills">
				<button
					type="button"
					class="yc-tile-morph-pill"
					class:yc-tile-morph-pill--active={!dampened}
					onclick={() => (dampened = false)}
				>HARD FLOOR</button>
				<button
					type="button"
					class="yc-tile-morph-pill"
					class:yc-tile-morph-pill--active={dampened}
					onclick={() => { dampened = true; autoFired = true; }}
				>CARPET + PAD</button>
			</div>

			<!-- ── SVG cross-section ── -->
			<svg viewBox="0 0 280 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<!-- ── Upper room (above slab) ── -->
				<rect x="10" y="10" width="260" height="76" fill="var(--yc-griege-06)" rx="3" />

				<!-- Room label — upper -->
				<text
					x="24" y="26"
					font-family="ui-monospace, 'SF Mono', monospace"
					font-size="7" fill="var(--yc-text-muted)" letter-spacing="0.05em"
				>UPPER UNIT</text>

				<!-- Hard floor surface (always visible) -->
				<rect x="10" y="78" width="260" height="4" fill="var(--yc-griege-40)" rx="1" />

				<!-- Carpet + pad layer (fades in when dampened) -->
				<g class="yc-noise-floor-layer" class:yc-noise-floor-layer--visible={dampened}>
					<!-- Pad layer -->
					<rect x="10" y="74" width="260" height="4" fill="var(--yc-shimmer-25)" rx="1" />
					<!-- Carpet layer -->
					<rect x="10" y="70" width="260" height="4" fill="var(--yc-shimmer-45)" rx="1" />
					<!-- Carpet texture — short fibre lines -->
					{#each Array(26) as _, i}
						<line
							x1={20 + i * 10} y1="70"
							x2={20 + i * 10} y2="67"
							stroke="var(--yc-shimmer-55)" stroke-width="1.2" stroke-linecap="round"
						/>
					{/each}
					<!-- Carpet label -->
					<text
						x="140" y="66"
						text-anchor="middle"
						font-family="ui-monospace, 'SF Mono', monospace"
						font-size="6" fill="var(--yc-shimmer-70)" letter-spacing="0.05em"
					>CARPET + PAD</text>
				</g>

				<!-- Concrete slab -->
				<rect x="10" y="82" width="260" height="12" fill="var(--yc-griege-25)" />
				<line x1="10" y1="82" x2="270" y2="82" stroke="var(--yc-griege-40)" stroke-width="0.8" />
				<line x1="10" y1="94" x2="270" y2="94" stroke="var(--yc-griege-40)" stroke-width="0.8" />
				<!-- Slab texture — aggregate dots -->
				{#each Array(18) as _, i}
					<circle cx={22 + i * 14} cy="88" r="1.2" fill="var(--yc-griege-40)" opacity="0.5" />
				{/each}

				<!-- ── Lower room (below slab) ── -->
				<rect x="10" y="94" width="260" height="86" fill="var(--yc-griege-04)" rx="3" />

				<!-- Room label — lower -->
				<text
					x="24" y="108"
					font-family="ui-monospace, 'SF Mono', monospace"
					font-size="7" fill="var(--yc-text-muted)" letter-spacing="0.05em"
				>LOWER UNIT</text>

				<!-- Furniture hint — lower room -->
				<rect x="30" y="150" width="40" height="22" fill="none" stroke="var(--yc-griege-20)" stroke-width="0.8" rx="2" />
				<rect x="200" y="155" width="50" height="17" fill="none" stroke="var(--yc-griege-20)" stroke-width="0.8" rx="2" />

				<!-- ── Footstep icon (upper room) ── -->
				<g transform="translate(140 42)">
					<!-- Shoe sole print -->
					<ellipse cx="0" cy="0" rx="7" ry="10" fill="none" stroke="var(--yc-griege-60)" stroke-width="1.2" class="yc-wave yc-footstep-pulse" />
					<ellipse cx="0" cy="0" rx="4" ry="6" fill="var(--yc-griege-40)" opacity="0.6" />
					<!-- Impact lines -->
					<line x1="-10" y1="4" x2="-13" y2="6" stroke="var(--yc-griege-50)" stroke-width="0.8" class="yc-wave yc-footstep-pulse" />
					<line x1="10" y1="4" x2="13" y2="6" stroke="var(--yc-griege-50)" stroke-width="0.8" class="yc-wave yc-footstep-pulse" />
				</g>

				<!-- ── Sound waves (arcs radiating downward from footstep) ── -->
				<!-- Wave 1 — closest to impact -->
				<path
					d="M 122 58 Q 140 72, 158 58"
					fill="none" stroke="var(--yc-maple-gold)" stroke-width="1.2" stroke-linecap="round"
					class="yc-wave" class:yc-wave--damped={dampened}
					style="animation-delay: 0s"
				/>
				<!-- Wave 2 -->
				<path
					d="M 116 66 Q 140 84, 164 66"
					fill="none" stroke="var(--yc-maple-gold)" stroke-width="1" stroke-linecap="round"
					class="yc-wave" class:yc-wave--damped={dampened}
					style="animation-delay: 0.25s"
				/>
				<!-- Wave 3 — enters slab zone -->
				<path
					d="M 110 76 Q 140 98, 170 76"
					fill="none" stroke="var(--yc-maple-gold)" stroke-width="0.8" stroke-linecap="round"
					class="yc-wave" class:yc-wave--damped={dampened}
					style="animation-delay: 0.5s"
				/>
				<!-- Wave 4 — in lower room (only visible when NOT dampened) -->
				<path
					d="M 106 100 Q 140 120, 174 100"
					fill="none" stroke="var(--yc-maple-gold)" stroke-width="0.7" stroke-linecap="round"
					class="yc-wave" class:yc-wave--damped={dampened}
					style="animation-delay: 0.75s"
				/>
				<!-- Wave 5 — deep into lower room -->
				<path
					d="M 102 114 Q 140 138, 178 114"
					fill="none" stroke="var(--yc-maple-gold)" stroke-width="0.6" stroke-linecap="round"
					class="yc-wave" class:yc-wave--damped={dampened}
					style="animation-delay: 1s"
				/>

				<!-- ── IIC rating badge ── -->
				<g transform="translate(230 138)">
					<rect x="-22" y="-10" width="44" height="22" rx="4"
						fill="var(--yc-griege-10)" stroke="var(--yc-griege-30)" stroke-width="0.8" />
					<text
						x="0" y="-1"
						text-anchor="middle"
						font-family="ui-monospace, 'SF Mono', monospace"
						font-size="7" fill="var(--yc-text-muted)" letter-spacing="0.05em"
					>IIC</text>
					<text
						x="0" y="9"
						text-anchor="middle"
						font-family="ui-monospace, 'SF Mono', monospace"
						font-size="9" font-weight="700" letter-spacing="0.05em"
					>
						{#if dampened}
							<tspan fill="var(--yc-maple-gold)">55+</tspan>
						{:else}
							<tspan fill="var(--yc-text-muted)">25</tspan>
						{/if}
					</text>
				</g>
			</svg>
		</div>

		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Where It Goes</h4>
			<ul class="yc-tab-list">
				<li>Corporate offices, conference rooms</li>
				<li>Hotel ballrooms, guest-room corridors</li>
				<li>Lecture halls, theatres, auditoriums</li>
				<li>Long corridors, lobbies, aged-care facilities</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Ratings & Certifications</h4>
			<ul class="yc-tab-list">
				<li>CRI Green Label Plus (indoor air quality)</li>
				<li>ASTM E648 — critical radiant flux, Class 1 for commercial</li>
				<li>IIC / STC ratings for impact and airborne sound transmission</li>
			</ul>
		</div>
	{/snippet}

	{#snippet install()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Install Methods</h4>
			<ul class="yc-tab-list">
				<li><strong>Direct glue-down</strong> — full-spread adhesive, most commercial installs. Firm underfoot, minimal movement.</li>
				<li><strong>Double-stick over cushion</strong> — pad adhered to subfloor, carpet adhered to pad. Hotels and theatres for comfort and acoustics.</li>
				<li><strong>Power-stretch over tackstrip</strong> — residential method, some commercial. Carpet stretched tight and hooked onto perimeter tackstrip.</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Seaming</h4>
			<ul class="yc-tab-list">
				<li>Hot-melt seam tape with seaming iron — standard commercial method</li>
				<li>Seam placement along traffic flow, never across</li>
				<li>Peak seams on cushion-back installs</li>
				<li>Row-cut direction critical for pattern match</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Subfloor Prep</h4>
			<ul class="yc-tab-list">
				<li>Concrete — ASTM F2170 moisture test (≤ 80% RH)</li>
				<li>Remove old adhesive residue, patch and level</li>
				<li>Wood subfloor — screw loose boards, eliminate squeaks</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Jobsite Conditions</h4>
			<ul class="yc-tab-list">
				<li>65–85°F ambient temperature</li>
				<li>Acclimate rolls standing upright 24–48 hrs</li>
				<li>Unroll and allow to relax before cutting</li>
			</ul>
		</div>
	{/snippet}

	{#snippet maintain()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Routine Cleaning</h4>
			<ul class="yc-tab-list">
				<li><strong>Daily:</strong> vacuum with CRI-approved upright</li>
				<li><strong>Spills:</strong> spot-clean immediately — blot, never rub</li>
				<li><strong>Quarterly:</strong> interim cleaning (encapsulation or bonnet)</li>
				<li><strong>Annual:</strong> hot-water extraction (truck-mount preferred)</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Repairs</h4>
			<ul class="yc-tab-list">
				<li>Re-stretch buckled areas with power stretcher</li>
				<li>Patch burns/stains with cookie-cutter and seam tape from remnant</li>
				<li>Re-seam splits with hot-melt tape</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Lifecycle</h4>
			<ul class="yc-tab-list">
				<li><strong>Moderate traffic:</strong> 10–15 years commercial life</li>
				<li><strong>Heavy traffic:</strong> 7–10 years (corridors, entrances)</li>
				<li><strong>Appearance retention:</strong> nylon outperforms PET/olefin over time</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Pros & Cons</h4>
			<ul class="yc-tab-list">
				<li><strong>Pro:</strong> acoustic dampening (IIC improvement), thermal insulation, slip resistance</li>
				<li><strong>Pro:</strong> lowest installed cost per sq ft for soft flooring</li>
				<li><strong>Con:</strong> staining and moisture absorption — not for wet areas</li>
				<li><strong>Con:</strong> limited pattern options vs carpet tile</li>
				<li><strong>Con:</strong> full-width replacement for damage (no individual tile swap)</li>
			</ul>
		</div>
	{/snippet}
</YcModalTabs>
