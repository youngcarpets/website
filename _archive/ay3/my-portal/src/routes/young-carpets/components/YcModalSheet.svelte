<!--
	YcModalSheet — 3-tab modal for sheet vinyl.
	Tab 1 (Product): concise identity — what it is, construction, ratings.
	Tab 2 (Installation): cove-build animated sequence + install methods.
	Tab 3 (Maintenance): cleaning, repairs, lifecycle.
	Rendered inside YcProductModal when openProduct.material === 'sheet'.
	Restructured 2026-04-09 (v1.24.x) from single-panel to 3-tab layout.

	IMPORTANT: All cove geometry math is LOVE'd per feedback_preserve_svg_animations.
	Do NOT change CV.* constants, path strings, or sweep flags without explicit approval.
-->
<script lang="ts">
	import YcModalTabs from './YcModalTabs.svelte';

	// ── Sheet vinyl cove-build reveal (modal interaction) ──
	// 4-step anatomy reveal: 0=bare, 1=cap, 2=cove stick, 3=sheet, 4=heat weld.
	// Auto-plays on modal open; user can replay by tapping "Replay anatomy".
	const CV = {
		cornerX: 60,
		cornerY: 160,
		r: 22,
		floorRight: 230,
		capY: 100,
		inset: 3,
		seamX: 160
	};
	const CV_ARC_TOP_X = CV.cornerX;
	const CV_ARC_TOP_Y = CV.cornerY - CV.r;
	const CV_ARC_RIGHT_X = CV.cornerX + CV.r;
	const CV_ARC_RIGHT_Y = CV.cornerY;
	const CV_SHEET_R = CV.r - CV.inset;
	const CV_SHEET_FLOOR_Y = CV.cornerY - CV.inset;
	const CV_SHEET_WALL_X = CV.cornerX + CV.inset;
	const CV_SHEET_ARC_FLOOR_X = CV_ARC_RIGHT_X;
	const CV_SHEET_ARC_FLOOR_Y = CV_SHEET_FLOOR_Y;
	const CV_SHEET_ARC_WALL_X = CV_SHEET_WALL_X;
	const CV_SHEET_ARC_WALL_Y = CV_ARC_TOP_Y;
	const COVE_STICK_D = `M ${CV_ARC_TOP_X} ${CV_ARC_TOP_Y} L ${CV.cornerX} ${CV.cornerY} L ${CV_ARC_RIGHT_X} ${CV_ARC_RIGHT_Y} A ${CV.r} ${CV.r} 0 0 1 ${CV_ARC_TOP_X} ${CV_ARC_TOP_Y} Z`;
	const BORDER_PIECE_D = `M ${CV_SHEET_WALL_X} ${CV.capY} L ${CV_SHEET_ARC_WALL_X} ${CV_SHEET_ARC_WALL_Y} A ${CV_SHEET_R} ${CV_SHEET_R} 0 0 0 ${CV_SHEET_ARC_FLOOR_X} ${CV_SHEET_ARC_FLOOR_Y} L ${CV.seamX} ${CV_SHEET_FLOOR_Y}`;
	const FIELD_PIECE_D = `M ${CV.floorRight} ${CV_SHEET_FLOOR_Y} L ${CV.seamX} ${CV_SHEET_FLOOR_Y}`;
	const SHEET_BORDER_LEN = 150;
	const SHEET_FIELD_LEN = 70;

	let coveStep: number = $state(0);
	let coveTimer: ReturnType<typeof setTimeout> | null = null;
	function playCoveSequence() {
		if (coveTimer) clearTimeout(coveTimer);
		coveStep = 0;
		const advance = (n: number) => {
			coveStep = n;
			if (n < 4) coveTimer = setTimeout(() => advance(n + 1), 700);
		};
		coveTimer = setTimeout(() => advance(1), 350);
	}
	$effect(() => {
		playCoveSequence();
		return () => {
			if (coveTimer) {
				clearTimeout(coveTimer);
				coveTimer = null;
			}
		};
	});
</script>

<YcModalTabs>
	{#snippet product()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">What It Is</h4>
			<p class="yc-tab-text">Continuous sheet vinyl in 6'–12' wide rolls. Heat-welded seams create a monolithic, waterproof membrane. Includes safety flooring (Altro) with embedded slip-resistant aggregate for extreme wet-area traction.</p>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Where It Goes</h4>
			<ul class="yc-tab-list">
				<li>Operating theatres, ICUs, isolation rooms</li>
				<li>Dental clinics, dialysis bays, veterinary</li>
				<li>Commercial kitchens, pharmaceutical clean rooms</li>
				<li>Wet barefoot areas (pools, change rooms)</li>
				<li>Hospital corridors</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Construction</h4>
			<p class="yc-tab-text">Homogeneous (colour through full thickness — Forbo Sphera, Tarkett iQ) or heterogeneous (layered with print film — wider design options). Safety flooring has aluminium oxide or carborundum particles embedded in the wear surface.</p>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Ratings & Certifications</h4>
			<ul class="yc-tab-list">
				<li>ASTM F1913 (sheet vinyl)</li>
				<li>FloorScore, GreenGuard Gold</li>
				<li>ASTM D2047 slip resistance</li>
				<li>Class 1 fire rating</li>
			</ul>
		</div>
	{/snippet}

	{#snippet install()}
		<!-- ── Sheet vinyl cove-build animated sequence ── -->
		<div class="yc-modal-stage yc-cove" data-yc-anim>
			<svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<!-- Substrate: wall (left) + slab (bottom). Always visible. -->
				<defs>
					<pattern id="yc-cove-hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
						<line x1="0" y1="0" x2="0" y2="6" stroke="var(--yc-shimmer-18)" stroke-width="1" />
					</pattern>
				</defs>
				<!-- Wall substrate fill -->
				<rect x="36" y="20" width="24" height="140" fill="url(#yc-cove-hatch)" />
				<!-- Slab substrate fill -->
				<rect x="60" y="160" width="170" height="20" fill="url(#yc-cove-hatch)" />
				<!-- Wall edge -->
				<line x1="60" y1="20" x2="60" y2="160" stroke="var(--yc-shimmer-50)" stroke-width="1.4" />
				<!-- Slab edge -->
				<line x1="60" y1="160" x2="230" y2="160" stroke="var(--yc-shimmer-50)" stroke-width="1.4" />

				<!-- Step 1: Cap strip — installed first, fastened to wall. -->
				<g
					class="yc-cove-step"
					class:yc-cove-step--in={coveStep >= 1}
				>
					<rect x="50" y="96" width="22" height="8" rx="1.5"
						fill="var(--yc-maple-gold-60)"
						stroke="var(--yc-maple-gold)"
						stroke-width="0.8" />
					<line x1="74" y1="100" x2="93" y2="100" stroke="var(--yc-shimmer-45)" stroke-width="0.6" />
					<text x="97" y="103" font-size="9" font-family="ui-monospace, 'SF Mono', monospace"
						fill="var(--yc-text-muted)" letter-spacing="0.05em">CAP STRIP</text>
				</g>

				<!-- Step 2: Cove stick — concave-faced fillet sits in the inside corner. -->
				<g
					class="yc-cove-step"
					class:yc-cove-step--in={coveStep >= 2}
				>
					<path d={COVE_STICK_D}
						fill="var(--yc-griege-50)"
						stroke="var(--yc-griege-65)"
						stroke-width="0.8" />
					<circle cx="82" cy="138" r="0.9" fill="var(--yc-text-muted)" />
					<line x1="82" y1="138" x2="66.4" y2="153.6" stroke="var(--yc-text-muted)" stroke-width="0.6" />
					<polygon points="66.4,153.6 67.5,150.4 69.6,152.5" fill="var(--yc-text-muted)" />
					<text x="86" y="134" font-size="9" font-family="ui-monospace, 'SF Mono', monospace"
						fill="var(--yc-text-muted)" letter-spacing="0.05em">COVE STICK</text>
					<text x="86" y="144" font-size="7" font-family="ui-monospace, 'SF Mono', monospace"
						fill="var(--yc-text-muted)" letter-spacing="0.05em">R 7/8&quot;</text>
				</g>

				<!-- Step 3: Sheet vinyl — TWO pieces meeting at the seam. -->
				<g
					class="yc-cove-step"
					class:yc-cove-step--in={coveStep >= 3}
				>
					<path
						class="yc-cove-sheet-stroke"
						d={BORDER_PIECE_D}
						fill="none"
						stroke="var(--yc-griege-95)"
						stroke-width="4"
						stroke-linecap="butt"
						stroke-linejoin="round"
						stroke-dasharray={SHEET_BORDER_LEN}
						stroke-dashoffset={SHEET_BORDER_LEN} />
					<path
						class="yc-cove-sheet-stroke"
						d={FIELD_PIECE_D}
						fill="none"
						stroke="var(--yc-griege-95)"
						stroke-width="4"
						stroke-linecap="butt"
						stroke-linejoin="round"
						stroke-dasharray={SHEET_FIELD_LEN}
						stroke-dashoffset={SHEET_FIELD_LEN} />
					<line x1="180" y1="124" x2="180" y2="153" stroke="var(--yc-shimmer-45)" stroke-width="0.6" />
					<text x="180" y="120" font-size="9" font-family="ui-monospace, 'SF Mono', monospace"
						fill="var(--yc-text-muted)" letter-spacing="0.05em" text-anchor="middle">SHEET VINYL</text>
				</g>

				<!-- Step 4: Heat-welded seam in the floor (dashed gold). -->
				<g
					class="yc-cove-step"
					class:yc-cove-step--in={coveStep >= 4}
				>
					<line x1="160" y1="148" x2="160" y2="158"
						stroke="var(--yc-maple-gold)"
						stroke-width="1.2"
						stroke-dasharray="2 2" />
					<line x1="160" y1="160" x2="180" y2="190" stroke="var(--yc-shimmer-45)" stroke-width="0.6" />
					<text x="184" y="194" font-size="9" font-family="ui-monospace, 'SF Mono', monospace"
						fill="var(--yc-text-muted)" letter-spacing="0.05em">HEAT WELD</text>
				</g>
			</svg>
			<p class="yc-cove-caption">
				Monolithic floor-to-wall &mdash; no seam, no shadow line, nowhere for bacteria to hide.
			</p>
			<button
				type="button"
				class="yc-cove-replay"
				onclick={playCoveSequence}
				aria-label="Replay the cove anatomy reveal"
			>
				Replay anatomy
			</button>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Install Methods</h4>
			<p class="yc-tab-text">Full-spread acrylic or polyurethane adhesive. Flash-cove walls — sheet rolled up the wall 4"–6", no horizontal floor/wall seam (eliminates bacteria harbourage). Heat-welded seams — automatic or hand-held heat gun with matching weld rod.</p>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Subfloor Prep</h4>
			<ul class="yc-tab-list">
				<li>Must be immaculate — every imperfection telegraphs through sheet</li>
				<li>Self-levelling compound over entire surface</li>
				<li>ASTM F2170 moisture test (≤ 80% RH)</li>
				<li>Remove all contaminants; patch divots and screw heads flush</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Seaming</h4>
			<ul class="yc-tab-list">
				<li>Seam placement planned to minimize traffic crossing</li>
				<li>Weld rod colour-matched</li>
				<li>Trim excess weld rod with spatula knife after cooling</li>
				<li>Seam quality is the single biggest variable in sheet vinyl performance</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Safety Flooring Specifics</h4>
			<p class="yc-tab-text">Same install as standard sheet but adhesive must be compatible with aggregate backing. Altro and similar products use manufacturer-specific adhesive systems.</p>
		</div>
	{/snippet}

	{#snippet maintain()}
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Routine Cleaning</h4>
			<ul class="yc-tab-list">
				<li><strong>Daily:</strong> auto-scrub or damp mop with pH-neutral cleaner only</li>
				<li>No wax, no polish on heterogeneous or safety vinyl — the factory finish IS the maintenance layer</li>
				<li>Homogeneous can accept polish if specified; buff or burnish to restore sheen</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Safety Flooring</h4>
			<p class="yc-tab-text">Aggregate texture requires scrubbing, not just mopping — dirt sits in the texture. Use manufacturer-specified cleaner and stiff pad.</p>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Repairs</h4>
			<ul class="yc-tab-list">
				<li><strong>Small damage:</strong> weld patch — cut out damaged area, inset matching piece, heat-weld edges</li>
				<li><strong>Large damage:</strong> seam-to-seam replacement panel</li>
				<li><strong>Flash-cove damage:</strong> re-form and re-weld the affected section</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Lifecycle</h4>
			<ul class="yc-tab-list">
				<li><strong>Moderate commercial:</strong> 15–25 years</li>
				<li><strong>Operating theatres:</strong> 10–15 years (aggressive chemical cleaning accelerates wear)</li>
				<li><strong>Safety flooring:</strong> 10–15 years in heavy wet use</li>
				<li>Homogeneous outlasts heterogeneous (no print film to wear through)</li>
			</ul>
		</div>
		<div class="yc-tab-section">
			<h4 class="yc-tab-heading">Pros & Cons</h4>
			<ul class="yc-tab-list">
				<li><strong>Pro:</strong> seamless, waterproof, hygienic — monolithic floor-to-wall, nowhere for bacteria</li>
				<li><strong>Pro:</strong> safety flooring eliminates slip-and-fall in wet areas</li>
				<li><strong>Pro:</strong> quiet underfoot, resilient, warm compared to tile</li>
				<li><strong>Con:</strong> every subfloor imperfection shows — prep cost is high</li>
				<li><strong>Con:</strong> heat-welding requires skilled installer (not commodity labour)</li>
				<li><strong>Con:</strong> limited pattern selection vs LVT or tile</li>
				<li><strong>Con:</strong> heavy rolls — logistics and material handling on site</li>
			</ul>
		</div>
	{/snippet}
</YcModalTabs>
