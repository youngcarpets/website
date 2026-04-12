// Young Carpets — feature product catalog (data only).
// Extracted from +page.svelte on 2026-04-08 (v1.24.x refactor).

export type Product = {
	name: string;
	/** Optional HTML-rich display name (rendered with {@html}).
	 *  Falls back to `name` when absent. Plain `name` is used for
	 *  aria-labels, email subjects, and other text-only contexts. */
	nameHtml?: string;
	code: string;
	badges: string[];
	blurb: string;
	details?: string;
	/** Material key — drives which inline SVG backdrop to render
	 *  AND which interactive modal body component renders inside the modal. */
	material:
		| 'carpet'
		| 'carpet-tile'
		| 'lvt'
		| 'hardwood'
		| 'rubber'
		| 'ceramic'
		| 'sheet'
		| 'matting'
		| 'more';
	image?: string | null;
};

// Nine feature products — square cards rendered prominently in a
// 2-col grid on mobile. Order set by user 2026-04-09:
//   1 carpet-tile · 2 lvt · 3 carpet · 4 ceramic · 5 rubber ·
//   6 matting · 7 wood⁺ · 8 sheet vinyl · 9 more
// MATTING is its own card because YCI does substantial entrance/elevator/
// hallway matting work. SDT used to live here as card #9 but was demoted
// to the More accordion (v1.22.1) — SDT is old-school and dated for the
// front of the marketing site, even though YCI still installs the 3M
// static-dissipative tile with the "NO WAX" witness tile ritual.
// Per mobile handoff spec (.claude/agents/resources/products-section-spec.md),
// badges[] is used minimally — install techniques, use cases, and supplier
// brands surface INSIDE the per-material modal body rather than on the card.
export const featureProducts: Product[] = [
	{
		name: 'Carpet Tile',
		code: 'CPT-T',
		badges: [],
		blurb: 'Modular tile — try 6 install patterns inside.',
		details:
			'Modular carpet tile in 24×24, 18×36, and plank formats. Tap to play with monolithic, quarter-turn, brick, herringbone, ashlar, and random install layouts. Glue-down, tackified release, and peel-and-stick installations.',
		material: 'carpet-tile',
		image: null
	},
	{
		name: 'LVT',
		code: 'VNL',
		badges: [],
		blurb: 'Luxury vinyl tile & plank — the new standard in resilient.',
		details:
			'Multi-layer luxury vinyl tile and plank with high-resolution print films and 20–30 mil commercial wear layers. Glue-down, click-lock, and loose-lay rigid core. The most-specified resilient flooring in commercial work today. Tarkett, Shaw Contract, Mohawk, Armstrong, COREtec, Karndean.',
		material: 'lvt',
		image: null
	},
	{
		name: 'Carpet',
		code: 'CPT',
		badges: [],
		blurb: 'Broadloom for offices, institutions, ballrooms, and theatres.',
		details:
			'Full-service supply and installation of broadloom carpet from every major commercial mill. Direct glue-down, double-stick over cushion, power-stretched seams. Sample boards and on-site mockups available for design teams.',
		material: 'carpet',
		image: null
	},
	{
		name: 'Ceramic',
		code: 'CT',
		badges: [],
		blurb: 'Pattern morph + slip-rating slider inside.',
		details:
			'Porcelain and ceramic for entrances, lobbies, washrooms, kitchens, healthcare wet zones, and pool decks. Schluter membrane systems, heated underlayment, large-format protocol per TTMAC.',
		material: 'ceramic',
		image: null
	},
	{
		name: 'Rubber',
		code: 'RB',
		badges: [],
		blurb: 'Fitness, healthcare, industrial — pick the use case.',
		details:
			'Rubber flooring for free-weight gyms, hospital corridors with integral coved bases, and slip-rated industrial spaces. Mondo, Nora, Ecore, Johnsonite, Regupol.',
		material: 'rubber',
		image: null
	},
	{
		name: 'Matting',
		code: 'MAT',
		badges: [],
		blurb: 'Entrance, elevator, hallway — the floor you walk on first.',
		details:
			'Entrance and walk-off matting for lobbies, elevators, and corridors. Recessed grid systems, surface scraper-and-wiper mats, and roll goods. Construction Specialties Pedimat, Forbo Coral, Mat Tech, Johnsonite, 3M Nomad. Stops 80%+ of the dirt and water before it ever hits your finish floor.',
		material: 'matting',
		image: null
	},
	{
		name: 'Wood+',
		nameHtml: 'Wood<span class="yc-name-plus">&hairsp;+</span>',
		code: 'WD',
		badges: [],
		blurb: 'Solid, engineered, parquet, bamboo, cork, reclaimed.',
		details:
			'Solid and engineered hardwood from Quebec mills (Mirage, Lauzon, Preverco, Mercier) for showrooms, executive offices, and design-led commercial. Site-finished or pre-finished. Plus bamboo, cork, and reclaimed wood for sustainability-driven specs. Scheduled screen-and-recoat maintenance and after-hours refinishing across the National Capital Region.',
		material: 'hardwood',
		image: null
	},
	{
		name: 'Sheet Vinyl',
		code: 'SHT',
		badges: [],
		blurb: 'Heat-welded seams, integral coved walls — for the rooms where joints fail.',
		details:
			'Sheet vinyl and safety flooring for operating theatres, ICUs, dental clinics, commercial kitchens, dialysis bays, hospital corridors, wet barefoot areas, and lab spaces. Includes Altro slip-resistant sheet with embedded aggregate for extreme wet-area traction. Heat-welded seams, flash-coved bases, ASTM moisture testing, full substrate prep. Forbo, Tarkett, Gerflor, Altro, Armstrong.',
		material: 'sheet',
		image: null
	},
	{
		name: 'More…',
		code: '+',
		badges: [],
		blurb: 'Epoxy, raised access, treads, base, ESD — and a dozen more.',
		details:
			'Our actual product list runs to dozens of categories — this page shows the most common ones. If you have a spec, send it. If you have a problem, describe it. We will tell you what works.',
		material: 'more',
		image: null
	}
];

// Secondary product list — rendered as compact glass chips below the feature grid.
export const otherProducts: { name: string; code: string }[] = [
	{ name: 'VCT', code: 'VCT' },
	{ name: 'Sheet Flooring', code: 'SHT' },
	{ name: 'Linoleum', code: 'LIN' },
	{ name: 'Safety Flooring', code: 'SAF' },
	{ name: 'Porcelain', code: 'PORC' },
	{ name: 'Stone', code: 'STN' },
	{ name: 'Bamboo', code: 'BMB' },
	{ name: 'Cork', code: 'CRK' },
	{ name: 'Sports Flooring', code: 'SPT' },
	{ name: 'Epoxy', code: 'EPX' },
	{ name: 'Matting', code: 'MAT' },
	{ name: 'Entrance Matting', code: 'EMAT' },
	{ name: 'Stair Treads & Risers', code: 'STR' },
	{ name: 'Stair Nosings', code: 'NOS' },
	{ name: 'Vinyl Base', code: 'VB' },
	{ name: 'Rubber Base', code: 'RBB' },
	{ name: 'Transition Strips', code: 'TRN' },
	{ name: 'Subfloors', code: 'SUB' }
];
