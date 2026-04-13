export type Product = {
	name: string;
	nameHtml?: string;
	code?: string;
	blurb: string;
	details?: string;
	material:
		| 'carpet'
		| 'carpet-tile'
		| 'lvt'
		| 'hardwood'
		| 'rubber'
		| 'ceramic'
		| 'sheet'
		| 'matting'
		| 'more'
		| 'accessories'
		| 'installation';
};

export const featureProducts: Product[] = [
	{
		name: 'Carpet Tile',
		code: 'CPTT',
		blurb: 'Modular tile — try 6 install patterns inside.',
		details:
			'Modular carpet tile in 24×24, 18×36, and plank formats. Tap to play with monolithic, quarter-turn, brick, herringbone, ashlar, and random install layouts. Glue-down, tackified release, and peel-and-stick installations.',
		material: 'carpet-tile'
	},
	{
		name: 'LVT',
		code: 'LVT',
		blurb: 'Luxury vinyl tile & plank — the new standard in resilient.',
		details:
			'Multi-layer luxury vinyl tile and plank with high-resolution print films and 20–30 mil commercial wear layers. Glue-down, click-lock, and loose-lay rigid core.',
		material: 'lvt'
	},
	{
		name: 'Carpet',
		code: 'CPT',
		blurb: 'Broadloom for offices, institutions, ballrooms, and theatres.',
		details:
			'Full-service supply and installation of broadloom carpet from every major commercial mill. Direct glue-down, double-stick over cushion, power-stretched seams.',
		material: 'carpet'
	},
	{
		name: 'Ceramic',
		code: 'CT',
		blurb: 'Porcelain and ceramic for entrances, lobbies, and wet zones.',
		details:
			'Porcelain and ceramic for entrances, lobbies, washrooms, kitchens, healthcare wet zones, and pool decks. Schluter membrane systems, heated underlayment, large-format protocol per TTMAC.',
		material: 'ceramic'
	},
	{
		name: 'Rubber',
		code: 'RBR',
		blurb: 'Fitness, healthcare, industrial — pick the use case.',
		details:
			'Rubber flooring for free-weight gyms, hospital corridors with integral coved bases, and slip-rated industrial spaces.',
		material: 'rubber'
	},
	{
		name: 'Matting',
		code: 'MAT',
		blurb: 'Entrance, elevator, hallway — the floor you walk on first.',
		details:
			'Entrance and walk-off matting for lobbies, elevators, and corridors. Recessed grid systems, surface scraper-and-wiper mats, and roll goods.',
		material: 'matting'
	},
	{
		name: 'Wood+',
		nameHtml: 'Wood<span class="product-name-plus">\u200a+</span>',
		code: 'WD',
		blurb: 'Solid, engineered, parquet, bamboo, cork, reclaimed.',
		details:
			'Solid and engineered hardwood from Quebec mills for showrooms, executive offices, and design-led commercial. Plus bamboo, cork, and reclaimed wood.',
		material: 'hardwood'
	},
	{
		name: 'Sheet Vinyl',
		code: 'SVF',
		blurb: 'Heat-welded seams, integral coved walls — for the rooms where joints fail.',
		details:
			'Sheet vinyl and safety flooring for operating theatres, ICUs, dental clinics, commercial kitchens, and lab spaces. Heat-welded seams, flash-coved bases.',
		material: 'sheet'
	},
	{
		name: 'More…',
		blurb: 'Epoxy, raised access, treads, base, ESD — and a dozen more.',
		details:
			'Our actual product list runs to dozens of categories. If you have a spec, send it. If you have a problem, describe it. We will tell you what works.',
		material: 'more'
	},
	{
		name: 'Accessories',
		blurb: 'Wall base, stair treads, trims, transitions.',
		details:
			'Wall base, millwork, stair treads, nosings, transition strips, and corner guards. Everything that finishes the floor.',
		material: 'accessories'
	},
	{
		name: 'Installation',
		blurb: 'Adhesives, floor prep, moisture mitigation.',
		details: 'Adhesives, floor prep compounds, moisture mitigation systems, and setting materials.',
		material: 'installation'
	}
];
