<!--
	YcModalCeramic — 3-tab modal for ceramic / porcelain tile.
	Tab 1 (Product): identity, grout joint cross-section animation, porcelain note, ratings.
	Tab 2 (Installation): methods, grout types, subfloor prep, tools.
	Tab 3 (Maintenance): cleaning, repairs, lifecycle, pros & cons.
	Rendered inside YcProductModal when openProduct.material === 'ceramic'.
	Restructured 2026-04-09 (v1.24.x) from single-panel to 3-tab layout.

	IMPORTANT: SVG anatomy is LOVE'd per feedback_preserve_svg_animations.
	Do NOT change layer geometry or step ordering without explicit approval.
-->
<script lang="ts">
	import YcModalTabs from './YcModalTabs.svelte';

	// ── Grout joint cross-section reveal (modal interaction) ──
	// 5-step anatomy reveal: 0=bare, 1=substrate, 2=thinset, 3=tile body,
	// 4=grout joint, 5=grout sealer.
	// Auto-plays on modal open; user can replay by tapping "Replay anatomy".

	let groutStep: number = $state(0);
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
		playGroutSequence();
		return () => {
			if (groutTimer) {
				clearTimeout(groutTimer);
				groutTimer = null;
			}
		};
	});
</script>

<YcModalTabs>
	{#snippet product()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">What It Is</h4>
			<p class="yc-tab-text">Porcelain and ceramic tile for commercial floors and walls. Porcelain is denser (water absorption &lt; 0.5%) and harder than standard ceramic.</p>
		</div>

		<!-- ── Grout joint cross-section animated sequence ── -->
		<div class="yc-modal-stage yc-grout" data-yc-anim>
			<svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<defs>
					<pattern id="yc-grout-hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
						<line x1="0" y1="0" x2="0" y2="6" stroke="var(--yc-shimmer-18)" stroke-width="1" />
					</pattern>
				</defs>

				<!-- Step 1: Substrate / concrete slab (hatched) -->
				<g
					class="yc-cove-step"
					class:yc-cove-step--in={groutStep >= 1}
				>
					<rect x="10" y="120" width="220" height="50" fill="url(#yc-grout-hatch)" />
					<rect x="10" y="120" width="220" height="50" fill="none"
						stroke="var(--yc-shimmer-50)" stroke-width="1" />
					<!-- label -->
					<line x1="165" y1="145" x2="185" y2="145" stroke="var(--yc-shimmer-45)" stroke-width="0.6" />
					<text x="188" y="148" font-size="9" font-family="ui-monospace, 'SF Mono', monospace"
						fill="var(--yc-text-muted)" letter-spacing="0.05em">SLAB</text>
				</g>

				<!-- Step 2: Thinset mortar bed -->
				<g
					class="yc-cove-step"
					class:yc-cove-step--in={groutStep >= 2}
				>
					<rect x="10" y="108" width="220" height="12" fill="var(--yc-griege-50)"
						stroke="var(--yc-griege-65)" stroke-width="0.6" />
					<!-- mortar texture dots -->
					<circle cx="30" cy="114" r="0.8" fill="var(--yc-shimmer-35)" />
					<circle cx="60" cy="112" r="0.6" fill="var(--yc-shimmer-35)" />
					<circle cx="95" cy="115" r="0.7" fill="var(--yc-shimmer-35)" />
					<circle cx="140" cy="113" r="0.8" fill="var(--yc-shimmer-35)" />
					<circle cx="175" cy="111" r="0.6" fill="var(--yc-shimmer-35)" />
					<circle cx="210" cy="114" r="0.7" fill="var(--yc-shimmer-35)" />
					<!-- label -->
					<line x1="165" y1="114" x2="185" y2="127" stroke="var(--yc-shimmer-45)" stroke-width="0.6" />
					<text x="188" y="130" font-size="9" font-family="ui-monospace, 'SF Mono', monospace"
						fill="var(--yc-text-muted)" letter-spacing="0.05em">THINSET</text>
				</g>

				<!-- Step 3: Tile bodies (two tiles with a gap between) -->
				<g
					class="yc-cove-step"
					class:yc-cove-step--in={groutStep >= 3}
				>
					<!-- Left tile -->
					<rect x="10" y="72" width="102" height="36" fill="var(--yc-griege-35)"
						stroke="var(--yc-shimmer-50)" stroke-width="0.8" rx="1" />
					<!-- Right tile -->
					<rect x="128" y="72" width="102" height="36" fill="var(--yc-griege-35)"
						stroke="var(--yc-shimmer-50)" stroke-width="0.8" rx="1" />
					<!-- label -->
					<line x1="45" y1="90" x2="45" y2="60" stroke="var(--yc-shimmer-45)" stroke-width="0.6" />
					<text x="14" y="55" font-size="9" font-family="ui-monospace, 'SF Mono', monospace"
						fill="var(--yc-text-muted)" letter-spacing="0.05em">TILE BODY</text>
				</g>

				<!-- Step 4: Grout joint (fills the gap between tiles) -->
				<g
					class="yc-cove-step"
					class:yc-cove-step--in={groutStep >= 4}
				>
					<rect x="112" y="72" width="16" height="36" fill="var(--yc-shimmer-25)"
						stroke="var(--yc-shimmer-40)" stroke-width="0.6" />
					<!-- grout texture -->
					<circle cx="118" cy="82" r="0.5" fill="var(--yc-shimmer-45)" />
					<circle cx="122" cy="90" r="0.4" fill="var(--yc-shimmer-45)" />
					<circle cx="116" cy="98" r="0.5" fill="var(--yc-shimmer-45)" />
					<!-- label -->
					<line x1="120" y1="42" x2="120" y2="70" stroke="var(--yc-shimmer-45)" stroke-width="0.6" />
					<text x="96" y="37" font-size="9" font-family="ui-monospace, 'SF Mono', monospace"
						fill="var(--yc-text-muted)" letter-spacing="0.05em">GROUT</text>
				</g>

				<!-- Step 5: Grout sealer (thin film on top of grout) -->
				<g
					class="yc-cove-step"
					class:yc-cove-step--in={groutStep >= 5}
				>
					<rect x="112" y="70" width="16" height="3" fill="var(--yc-maple-gold-60)"
						stroke="var(--yc-maple-gold)" stroke-width="0.4" rx="0.5" />
					<!-- label -->
					<line x1="130" y1="71.5" x2="148" y2="40" stroke="var(--yc-shimmer-45)" stroke-width="0.6" />
					<text x="150" y="37" font-size="9" font-family="ui-monospace, 'SF Mono', monospace"
						fill="var(--yc-text-muted)" letter-spacing="0.05em">SEALER</text>
				</g>
			</svg>

			<p class="yc-grout-caption">Side-view cutaway — layers build bottom-up as installed on site.</p>

			<button
				type="button"
				class="yc-cove-replay"
				onclick={() => playGroutSequence()}
			>
				&#x21bb;&ensp;Replay anatomy
			</button>
		</div>

		<div class="yc-porcelain-note">
			<strong>Porcelain vs Ceramic body</strong>
			<p>
				<b>Porcelain</b> — dense body fired at higher temperature. Colour runs all the way through the
				tile, so a chip reveals the same colour as the surface. Lower water absorption (&lt;&thinsp;0.5&thinsp;%).
			</p>
			<p>
				<b>Ceramic</b> — glaze layer on top of a different-coloured bisque body.
				A chip exposes the contrast underneath. Higher water absorption, typically used in
				lighter-traffic or wall applications.
			</p>
		</div>

		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Where It Goes</h4>
			<ul class="yc-tab-list">
				<li>Entrances, lobbies, washrooms</li>
				<li>Commercial kitchens, healthcare wet zones</li>
				<li>Pool decks, exterior walkways (frost-rated porcelain)</li>
			</ul>
		</div>

		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Ratings</h4>
			<ul class="yc-tab-list">
				<li>ANSI A137.1 (tile standard)</li>
				<li>DCOF &ge; 0.42 (wet slip resistance)</li>
				<li>Mohs 7+ hardness (porcelain)</li>
				<li>PEI IV–V commercial wear</li>
				<li>DIN 51130 slip ratings (R9–R13)</li>
			</ul>
		</div>
	{/snippet}

	{#snippet install()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Install Methods</h4>
			<ul class="yc-tab-list">
				<li><strong>Thinset mortar</strong> — over cement board or concrete (standard method).</li>
				<li><strong>Large-format protocol</strong> — per TTMAC: back-butter + directional trowel for tiles &gt; 15".</li>
				<li><strong>Schluter DITRA membrane</strong> — crack isolation and waterproofing.</li>
				<li><strong>Heated underlayment</strong> — Schluter DITRA-HEAT for comfort.</li>
			</ul>
		</div>

		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Grout</h4>
			<ul class="yc-tab-list">
				<li><strong>Unsanded</strong> — for joints &lt; 1/8".</li>
				<li><strong>Sanded</strong> — for joints 1/8"–1/2".</li>
				<li><strong>Epoxy grout</strong> — for kitchens, labs, pools (chemical/stain resistant, no sealer needed).</li>
				<li>Grout colour selection critical — lighter shows dirt, darker hides but limits design.</li>
			</ul>
		</div>

		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Subfloor Prep</h4>
			<ul class="yc-tab-list">
				<li>Concrete must be cured 28+ days</li>
				<li>Deflection tolerance L/360</li>
				<li>Level to 1/8" in 10'</li>
				<li>Moisture testing per ASTM F2170</li>
				<li>Crack isolation membrane over control joints</li>
			</ul>
		</div>

		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Tools</h4>
			<ul class="yc-tab-list">
				<li>Wet saw with diamond blade</li>
				<li>Tile levelling clips (Levtec, Raimondi) — mandatory for large format</li>
				<li>Notched trowel size per tile size (1/4"&times;3/8" for most commercial)</li>
			</ul>
		</div>
	{/snippet}

	{#snippet maintain()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Routine Cleaning</h4>
			<ul class="yc-tab-list">
				<li><strong>Daily:</strong> dust mop or auto-scrub</li>
				<li><strong>Weekly:</strong> damp mop with pH-neutral cleaner</li>
				<li><strong>Grout lines:</strong> periodic scrub with nylon brush — never metal</li>
				<li><strong>Grout sealing:</strong> annually for cement-based grout; epoxy grout needs no sealer</li>
			</ul>
		</div>

		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Repairs</h4>
			<ul class="yc-tab-list">
				<li>Individual tile replacement — score grout, chisel out tile, re-set with thinset</li>
				<li>Match grout colour to existing</li>
				<li>Keep 5–10% attic stock (tile runs/lots vary in shade)</li>
			</ul>
		</div>

		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Lifecycle</h4>
			<ul class="yc-tab-list">
				<li><strong>Commercial life:</strong> 25–50+ years for porcelain</li>
				<li>Tile itself is nearly indestructible — grout is the weak link</li>
				<li>Re-grouting every 10–15 years in heavy traffic</li>
			</ul>
		</div>

		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Pros & Cons</h4>
			<ul class="yc-tab-list">
				<li><strong>Pro:</strong> virtually zero maintenance, waterproof, fireproof, no VOC</li>
				<li><strong>Pro:</strong> unlimited design — wood-look, stone-look, concrete-look planks</li>
				<li><strong>Con:</strong> hard and cold underfoot (fatigue for standing staff)</li>
				<li><strong>Con:</strong> grout maintenance is ongoing and visible</li>
				<li><strong>Con:</strong> brittle under point impact — heavy dropped objects will crack tiles</li>
			</ul>
		</div>
	{/snippet}
</YcModalTabs>
