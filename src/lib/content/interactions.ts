export type TilePattern = 'monolithic' | 'quarter' | 'brick' | 'herring' | 'random' | 'ashlar';
export const tilePatternList: { id: TilePattern; label: string }[] = [
	{ id: 'monolithic', label: 'MONOLITHIC' },
	{ id: 'quarter', label: 'QUARTER' },
	{ id: 'brick', label: 'BRICK' },
	{ id: 'herring', label: 'HERRINGBONE' },
	{ id: 'random', label: 'RANDOM' },
	{ id: 'ashlar', label: 'ASHLAR' }
];

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
		install:
			'Glue-down or floating click-lock. Acclimate 72 hrs. Avoid below-grade slabs without moisture barrier.'
	},
	{
		id: 'cork',
		label: 'CORK',
		front: 'Harvested bark — natural sound and thermal insulation underfoot',
		thickness: '6mm tile or 10–12mm floating plank with HDF core',
		bestFor: 'Libraries, museums, recording studios, meditation rooms, senior living corridors',
		install:
			'Glue-down tile or floating click-lock plank. Seal with 2–3 coats polyurethane for commercial wear.'
	},
	{
		id: 'reclaimed',
		label: 'RECLAIMED',
		front: 'Salvaged barn board, factory timbers, old-growth species no longer harvested',
		thickness: 'Variable — milled to 3/4" solid or re-sawn to 4–6mm engineered veneer',
		bestFor: 'Heritage restorations, craft breweries, boutique hotels, LEED material-reuse credit',
		install:
			'Nail-down or glue-down. Expect character variation — nail holes, checking, patina. Each board is unique.'
	}
];
