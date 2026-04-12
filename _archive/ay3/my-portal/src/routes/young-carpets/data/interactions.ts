// Young Carpets — modal interaction data (types + arrays).
// Pure data only. State variables ($state) and timer logic stay in +page.svelte.
// Extracted from +page.svelte on 2026-04-08 (v1.24.x refactor).

// ── Carpet-tile pattern morph ──
// 6 install patterns × 36 tiles (6×6 grid). The transform calculations live
// inline in the component since they're pure functions of the tile index + active pattern.
export type TilePattern = 'monolithic' | 'quarter' | 'brick' | 'herring' | 'random' | 'ashlar';
export const tilePatternList: { id: TilePattern; label: string }[] = [
	{ id: 'monolithic', label: 'MONOLITHIC' },
	{ id: 'quarter', label: 'QUARTER' },
	{ id: 'brick', label: 'BRICK' },
	{ id: 'herring', label: 'HERRINGBONE' },
	{ id: 'random', label: 'RANDOM' },
	{ id: 'ashlar', label: 'ASHLAR' }
];

// ── LVT/VCT/SCT three-tab segmented control ──
export type VinylTab = 'lvt' | 'vct' | 'sct';
export const vinylTabs: { id: VinylTab; label: string }[] = [
	{ id: 'lvt', label: 'LVT' },
	{ id: 'vct', label: 'VCT' },
	{ id: 'sct', label: 'SCT' }
];

// ── Carpet use-case gallery ──
// Horizontal scroll-snap gallery showing 5 stylized scenes where broadloom belongs.
// Auto-advances every 4s; pauses on touch. Timer state stays in component.
export type CarpetUseCase = {
	label: string;
	blurb: string;
	scene: 'office' | 'ballroom' | 'lecture' | 'theatre' | 'corridor';
};
export const carpetUseCases: CarpetUseCase[] = [
	{
		label: 'Corporate Office',
		blurb: 'Open-plan workstation pods. Acoustic dampening for the cubicle field.',
		scene: 'office'
	},
	{
		label: 'Hotel Ballroom',
		blurb: 'Double-stick over cushion. Underfoot comfort for events.',
		scene: 'ballroom'
	},
	{
		label: 'Lecture Hall',
		blurb: 'Tiered seating, broadloom risers and aisles. University standard.',
		scene: 'lecture'
	},
	{
		label: 'Theatre',
		blurb: 'Aisles, lobbies, mezzanines. Pattern-coloured for sightline guidance.',
		scene: 'theatre'
	},
	{
		label: 'Long Corridor',
		blurb: 'Power-stretched seams disappear. Heat-welded for the wear lines.',
		scene: 'corridor'
	}
];

// ── Slip rating ramp (ceramic modal) ──
// R-rating data per DIN 51130. Angles are representative midpoints; angleLabel
// shows the actual standard range. (Confirmed via slip-rating expert sub-agent
// against floorslip.co.uk + safetydirectamerica.com.)
export type SlipRating = 'r9' | 'r10' | 'r11' | 'r12' | 'r13';
export const slipRatings: { id: SlipRating; angle: number; angleLabel: string; label: string; uses: string }[] = [
	{ id: 'r9',  angle: 8,  angleLabel: '6–10°',  label: 'R9',  uses: 'Interior dry, low slope. Office lobbies above grade, retail floors, dry corridors.' },
	{ id: 'r10', angle: 15, angleLabel: '10–19°', label: 'R10', uses: 'Washrooms, staff cafeterias, change rooms (dry side), entry past the mat-off zone.' },
	{ id: 'r11', angle: 23, angleLabel: '19–27°', label: 'R11', uses: 'Commercial kitchens, laundries, snowbelt entry mat-off zones, pool change rooms wet side.' },
	{ id: 'r12', angle: 31, angleLabel: '27–35°', label: 'R12', uses: 'Wet food processing, meat / fish prep, healthcare decontamination, pool surrounds.' },
	{ id: 'r13', angle: 38, angleLabel: '> 35°',  label: 'R13', uses: 'Abattoirs, grease-heavy industrial kitchens, chemical processing with standing slurry.' }
];

// ── Rubber 3-segment toggle (rubber modal) ──
export type RubberSegment = 'fitness' | 'healthcare' | 'industrial';
export const rubberSegments: { id: RubberSegment; label: string }[] = [
	{ id: 'fitness', label: 'FITNESS' },
	{ id: 'healthcare', label: 'HEALTHCARE' },
	{ id: 'industrial', label: 'INDUSTRIAL' }
];
export const rubberContent: Record<RubberSegment, {
	hero: string;
	why: string;
	install: string[];
	bestFor: string[];
	suppliers: string[];
}> = {
	fitness: {
		hero: 'High-density vulcanized rubber. Drop weights, run, lift.',
		why: 'Impact absorption protects platforms and slabs. Sound dampening keeps the building quiet. Slip-resistant under sweat.',
		install: [
			'Interlocking tile (8–12mm) — dry-lay over concrete, perimeter glue',
			'Rolled rubber sheet — full glue-down, butted seams',
			'Poured-in-place granulated — seamless under platforms',
			'Drop-zone pads (2–4") — under Olympic platforms'
		],
		bestFor: [
			'University fitness centres',
			'Varsity weight rooms',
			'Corporate gyms',
			'Municipal recreation centres'
		],
		suppliers: ['Mondo', 'Ecore', 'Regupol', 'Tarkett Sports', 'Johnsonite']
	},
	healthcare: {
		hero: 'Sheet rubber with heat-welded seams + integral coved walls.',
		why: 'Comfort for staff who stand 12-hour shifts. Sound dampening for patient rest. Continuous surface meets infection-control standards.',
		install: [
			'Sheet rubber — heat-welded seams, continuous waterproof membrane',
			'Integral coved base — sheet rolled up the wall, no horizontal seam',
			'Static-dissipative variants for imaging and electronics labs'
		],
		bestFor: [
			'Patient rooms, corridors, nurses’ stations',
			'MRI suites (non-magnetic)',
			'Pharmacy, long-term care, dental, veterinary'
		],
		suppliers: ['Nora', 'Artigo', 'Mondo', 'Johnsonite', 'Forbo']
	},
	industrial: {
		hero: 'Slip-rated, oil-resistant, anti-fatigue.',
		why: 'Productive shifts depend on the floor. Workstations get matting. Stairwells get cast-nosing treads. Wet zones get the right compound.',
		install: [
			'Anti-fatigue matting — drop-in, washable, modular',
			'Tile or sheet rubber — glue-down, slip-rated',
			'Rubber stair treads + risers with cast-in nosings'
		],
		bestFor: [
			'Mechanical rooms, manufacturing, lab benches',
			'School + transit stairwells',
			'Parking garage stair towers',
			'Electrical rooms'
		],
		suppliers: ['Johnsonite', 'Roppe', 'Musson', 'Flexco']
	}
};

// ── Hardwood flip cards (hardwood modal) ──
export type HardwoodCard = 'solid' | 'engineered' | 'parquet' | 'bamboo' | 'cork' | 'reclaimed';
export const hardwoodCards: {
	id: HardwoodCard;
	label: string;
	front: string;
	thickness: string;
	bestFor: string;
	install: string;
}[] = [
	{
		id: 'solid',
		label: 'SOLID',
		front: '3/4" solid plank, single species top to bottom',
		thickness: '3/4" (19mm) — refinishable 3–5× over its life',
		bestFor: 'Showrooms, executive offices, heritage buildings, university common rooms',
		install: 'Nail-down over plywood subfloor. Site-finished or pre-finished.'
	},
	{
		id: 'engineered',
		label: 'ENGINEERED',
		front: 'Multi-ply veneer with real wood wear layer',
		thickness: '2–6mm wear layer over 9–14mm cross-ply core',
		bestFor: 'Commercial offices, hospitality, retail. Slab-on-grade and radiant heat OK.',
		install: 'Glue-down full-spread urethane, or click-lock floating with underlayment.'
	},
	{
		id: 'parquet',
		label: 'PARQUET',
		front: 'Herringbone, chevron, basketweave, Versailles panels',
		thickness: 'Solid block or engineered (varies by pattern)',
		bestFor: 'Boutique hotels, restaurants, luxury retail, executive boardrooms',
		install: 'Pattern-laid by hand. Glue-down standard. Statement floors.'
	},
	{
		id: 'bamboo',
		label: 'BAMBOO',
		front: 'Strand-woven compressed bamboo — harder than most hardwoods',
		thickness: '14mm strand-woven (Janka 3000+) or 15mm horizontal/vertical (Janka 1300)',
		bestFor: 'Green-rated commercial offices, retail, education. LEED credit eligible.',
		install: 'Glue-down or floating click-lock. Acclimate 72 hrs. Avoid below-grade slabs without moisture barrier.'
	},
	{
		id: 'cork',
		label: 'CORK',
		front: 'Harvested bark — natural sound and thermal insulation underfoot',
		thickness: '6mm tile or 10–12mm floating plank with HDF core',
		bestFor: 'Libraries, museums, recording studios, meditation rooms, senior living corridors',
		install: 'Glue-down tile or floating click-lock plank. Seal with 2–3 coats polyurethane for commercial wear.'
	},
	{
		id: 'reclaimed',
		label: 'RECLAIMED',
		front: 'Salvaged barn board, factory timbers, old-growth species no longer harvested',
		thickness: 'Variable — milled to 3/4" solid or re-sawn to 4–6mm engineered veneer',
		bestFor: 'Heritage restorations, craft breweries, boutique hotels, LEED material-reuse credit',
		install: 'Nail-down or glue-down. Expect character variation — nail holes, checking, patina. Each board is unique.'
	}
];

// ── Vinyl content (lvt modal segmented control bodies) ──
export const vinylContent: Record<VinylTab, {
	tagline: string;
	whatItIs: string;
	bestFor: string[];
	install: string[];
	suppliers: string[];
}> = {
	lvt: {
		tagline: 'Luxury Vinyl Tile / Plank',
		whatItIs:
			'Multi-layer flexible vinyl with a high-resolution print film and a 20–30 mil commercial wear layer. The most-specified resilient flooring in commercial work today.',
		bestFor: [
			'Healthcare corridors (with welded seams)',
			'Retail, hospitality, education',
			'Multi-tenant office, multi-storey builds (acoustic-backed)'
		],
		install: [
			'Glue-down dryback — most stable, full-spread or pressure-sensitive',
			'Click-lock floating — no adhesive, allows substrate movement',
			'Loose-lay rigid core — perimeter glue, fast replacement'
		],
		suppliers: ['Tarkett', 'Shaw Contract', 'Mohawk', 'Armstrong', 'COREtec', 'Karndean']
	},
	vct: {
		tagline: 'Vinyl Composition Tile',
		whatItIs:
			'Rigid 12×12 tile, mostly limestone filler with a small percentage of vinyl binder. Requires stripping and waxing — a feature, not a bug, for institutions with maintenance staff.',
		bestFor: [
			'Schools (gym corridors, classrooms)',
			'Hospital back-of-house, lab support, mech rooms',
			'Transit stations, government cafeterias',
			'Big-box retail back-of-house'
		],
		install: [
			'Full-spread acrylic adhesive — the only real method',
			'Straight grid layout standard',
			'Quarter-turn occasionally specified for visual interest'
		],
		suppliers: ['Armstrong (Azrock)', 'Tarkett', 'Mannington']
	},
	sct: {
		tagline: 'Solid Vinyl Tile / Sheet',
		whatItIs:
			'Homogeneous vinyl through the entire thickness — no print film, no separate wear layer. The colour and pattern run all the way through. Specified where extreme wear, chemical resistance, or seam-welding for hygiene matters.',
		bestFor: [
			'Operating theatres, ICUs, isolation rooms',
			'Pharmacy clean rooms, lab spaces',
			'Commercial kitchens, food prep, decon zones'
		],
		install: [
			'Heat-welded seams — continuous waterproof membrane',
			'Flash-coved walls — sheet rolled up the wall, no floor/wall seam',
			'Glue-down tile format with full-spread adhesive'
		],
		suppliers: ['Forbo (Sphera)', 'Tarkett iQ', 'Gerflor (Mipolam)', 'Nora', 'Altro']
	}
};

// ── More… sub-card accordion grid ──
export type MoreSubcard = 'vct' | 'sct' | 'marmoleum' | 'epoxy' | 'raised' | 'treads' | 'base' | 'esd';
export const moreSubcards: { id: MoreSubcard; label: string; desc: string }[] = [
	{
		id: 'vct',
		label: 'VCT',
		desc: 'Vinyl Composition Tile — rigid 12×12, mostly limestone filler. Requires strip-and-wax maintenance. Schools, hospital back-of-house, transit stations, government cafeterias. Armstrong (Azrock), Tarkett, Mannington.'
	},
	{
		id: 'sct',
		label: 'SCT / Homogeneous',
		desc: 'Solid vinyl through the full thickness — no print film, no separate wear layer. Heat-welded seams and flash-coved walls for operating theatres, ICUs, clean rooms, and commercial kitchens. Forbo (Sphera), Tarkett iQ, Gerflor (Mipolam), Nora, Altro.'
	},
	{
		id: 'marmoleum',
		label: 'Marmoleum / Linoleum',
		desc: 'Natural linoleum made from linseed oil, wood flour, and jute. Forbo Marmoleum tiles and sheet — the original sustainable floor. Hypoallergenic, bacteriostatic, carbon-neutral. Colour runs through the full thickness. Schools, healthcare, offices, museums. Forbo.'
	},
	{
		id: 'epoxy',
		label: 'Epoxy',
		desc: 'Chemical-resistant resinous flooring for labs, mech rooms, pharmaceutical, and food processing. Self-levelling and broadcast systems. Sika, Stonhard, Florock, Dur-A-Flex.'
	},
	{
		id: 'raised',
		label: 'Raised Access',
		desc: 'Modular pedestal-supported panels for cable management. Data centres, trading floors, command centres, modern offices. Tate, Haworth TecCrete.'
	},
	{
		id: 'treads',
		label: 'Stair Treads',
		desc: 'Moulded rubber and vinyl treads with cast-in slip-resistant nosings. Every institutional stairwell in Ottawa. Johnsonite, Roppe, Musson.'
	},
	{
		id: 'base',
		label: 'Wall Base',
		desc: '4" and 6" coved or straight vinyl and rubber base for every commercial floor. Johnsonite, Roppe, Tarkett.'
	},
	{
		id: 'esd',
		label: 'ESD / Static',
		desc: 'Static-dissipative tile for electronics manufacturing, server rooms, MRI control rooms, and electronic labs. Installed and tested to ANSI/ESD S20.20 with conductive adhesive and a copper grounding strip. 3M, Staticworx, Forbo Colorex.'
	}
];
