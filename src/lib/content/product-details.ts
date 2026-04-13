import type { Product } from './products';

export type SpecRow = { label: string; value: string };

export type ProductDetails = {
	lead: string;
	specs: SpecRow[];
	installRows: SpecRow[];
	careRows: SpecRow[];
	careFootnote: string;
	featureLabel: string;
	featureHint?: string;
};

export const productDetails: Partial<Record<Product['material'], ProductDetails>> = {
	'carpet-tile': {
		lead: 'Modular squares & planks that swap out one tile at a time — no full-room tearup.',
		specs: [
			{ label: 'Sizes', value: '18×18 · 24×24 · 18×36 · plank' },
			{ label: 'Wear', value: 'Nylon or PET, loop or cut-pile' },
			{ label: 'Install', value: 'Peel-stick, glue-down, or loose-lay' },
			{ label: 'Traffic', value: 'Heavy commercial' },
			{ label: 'Fire', value: 'Class 1 (ASTM E648)' },
			{ label: 'For', value: 'Offices, schools, healthcare, retail' },
			{ label: 'Maintain', value: 'Vacuum + spot-replace damaged tiles' },
			{ label: 'Life', value: '15–25 yr in commercial settings' }
		],
		installRows: [
			{ label: 'Glue-down', value: 'Permanent, most common' },
			{ label: 'Tackifier', value: 'Repositionable, access floors' },
			{ label: 'Peel & stick', value: 'Factory adhesive, fastest' },
			{ label: 'Adhesive-free', value: 'Zero VOC connectors' }
		],
		careRows: [
			{ label: 'Daily', value: 'Vacuum, beater bar off for loop' },
			{ label: 'Spills', value: 'Spot-clean within 24 hrs' },
			{ label: 'Quarterly', value: 'Extraction or encap cleaning' },
			{ label: 'Annual', value: 'Hot-water extraction' }
		],
		careFootnote:
			'10–15 yr life, moderate traffic. Typical warranty: 10-yr wear + 15-yr structural.',
		featureLabel: 'Install patterns',
		featureHint: '(interactive)'
	},
	lvt: {
		lead: 'Multi-layer luxury vinyl tile and plank. High-resolution print film under a clear urethane wear layer. The most-specified resilient flooring in commercial work.',
		specs: [
			{ label: 'Format', value: 'Tile, plank, herringbone' },
			{ label: 'Wear', value: '20–30 mil urethane, Class III commercial' },
			{ label: 'Core', value: 'Rigid SPC or flexible dryback' },
			{ label: 'Install', value: 'Glue-down, click-lock, or loose-lay' },
			{ label: 'Traffic', value: 'Moderate to heavy commercial' },
			{ label: 'Fire', value: 'Class 1 (ASTM E648)' },
			{ label: 'For', value: 'Healthcare, retail, hospitality, office, education' },
			{ label: 'Life', value: '15–20 yr commercial' }
		],
		installRows: [
			{ label: 'Glue-down', value: 'Full-spread urethane, most stable' },
			{ label: 'Click-lock', value: 'Floating, no adhesive, fast install' },
			{ label: 'Loose-lay', value: 'Perimeter glue only, fast replacement' }
		],
		careRows: [
			{ label: 'Daily', value: 'Dust mop or vacuum, no beater bar' },
			{ label: 'Weekly', value: 'Damp mop, pH-neutral cleaner' },
			{ label: 'Quarterly', value: 'Scrub-and-recoat high-traffic areas' },
			{ label: 'Spills', value: 'No wax needed — wear layer is the finish' }
		],
		careFootnote:
			'15–20 yr commercial life. Wear layer thickness determines life: 20 mil light, 28–30 mil heavy.',
		featureLabel: 'Layer construction',
		featureHint: '(interactive)'
	},
	carpet: {
		lead: 'Wall-to-wall broadloom carpet — continuous 12\u2019 rolls, the original commercial soft-surface floor covering.',
		specs: [
			{ label: 'Sizes', value: '12\u2019 wide rolls, custom lengths' },
			{ label: 'Wear', value: 'Nylon, PET, or olefin face fibre' },
			{ label: 'Install', value: 'Direct glue, double-stick, or stretch-in' },
			{ label: 'Traffic', value: 'Moderate to heavy commercial' },
			{ label: 'Fire', value: 'Class 1 (ASTM E648)' },
			{ label: 'For', value: 'Offices, hotels, theatres, corridors' },
			{ label: 'Maintain', value: 'Vacuum daily + annual extraction' },
			{ label: 'Life', value: '7\u201315 yr depending on traffic' }
		],
		installRows: [
			{
				label: 'Direct glue',
				value: 'Full-spread adhesive, firm underfoot, most commercial installs'
			},
			{
				label: 'Double-stick',
				value: 'Pad adhered to subfloor, carpet to pad \u2014 hotels & theatres for acoustics'
			},
			{
				label: 'Stretch-in',
				value: 'Power-stretched over perimeter tackstrip, residential and light commercial'
			}
		],
		careRows: [
			{ label: 'Daily', value: 'Vacuum with CRI-approved upright' },
			{ label: 'Spills', value: 'Blot immediately \u2014 never rub' },
			{ label: 'Quarterly', value: 'Interim encapsulation or bonnet clean' },
			{ label: 'Annual', value: 'Hot-water extraction, truck-mount preferred' }
		],
		careFootnote:
			'10\u201315 yr moderate traffic, 7\u201310 yr heavy; nylon outperforms PET and olefin over time.',
		featureLabel: 'Sound dampening',
		featureHint: '(interactive)'
	},
	ceramic: {
		lead: 'Porcelain and ceramic tile for commercial floors and walls \u2014 waterproof, fireproof, and virtually indestructible.',
		specs: [
			{ label: 'Sizes', value: 'Mosaic to large-format (up to 48\u2033)' },
			{ label: 'Body', value: 'Porcelain (<0.5% absorption) or ceramic bisque' },
			{ label: 'Install', value: 'Thinset mortar, membrane, or heated mat' },
			{ label: 'Slip', value: 'DCOF \u2265 0.42 wet, DIN R9\u2013R13' },
			{ label: 'Fire', value: 'Non-combustible, zero VOC' },
			{ label: 'For', value: 'Lobbies, washrooms, kitchens, pool decks' },
			{ label: 'Maintain', value: 'Dust mop daily + pH-neutral damp mop' },
			{ label: 'Life', value: '25\u201350+ yr for porcelain' }
		],
		installRows: [
			{ label: 'Thinset mortar', value: 'Standard method over cement board or concrete slab' },
			{
				label: 'Large-format',
				value: 'Back-butter + directional trowel per TTMAC for tiles >15\u2033'
			},
			{
				label: 'DITRA membrane',
				value: 'Schluter crack-isolation and waterproofing underlayment'
			},
			{ label: 'Heated mat', value: 'Schluter DITRA-HEAT electric in-floor comfort system' }
		],
		careRows: [
			{ label: 'Daily', value: 'Dust mop or auto-scrub' },
			{ label: 'Weekly', value: 'Damp mop with pH-neutral cleaner' },
			{ label: 'Grout', value: 'Nylon-brush scrub periodically \u2014 never metal' },
			{ label: 'Sealing', value: 'Annual for cement grout; epoxy grout needs none' }
		],
		careFootnote:
			'Tile is nearly indestructible \u2014 grout is the weak link; plan to re-grout every 10\u201315 yr in heavy traffic.',
		featureLabel: 'Grout anatomy',
		featureHint: '(interactive)'
	},
	rubber: {
		lead: 'Vulcanized rubber flooring \u2014 dense, resilient, and slip-resistant, often made from recycled tire crumb.',
		specs: [
			{ label: 'Sizes', value: 'Tile, sheet, stair treads' },
			{ label: 'Surface', value: 'Vulcanized natural or synthetic rubber' },
			{ label: 'Install', value: 'Epoxy/PU glue-down, contact cement stairs' },
			{ label: 'Rating', value: 'ASTM F1344, D2047 slip resistance' },
			{ label: 'Fire', value: 'Class 1, ADA-compliant' },
			{ label: 'For', value: 'Gyms, hospitals, labs, schools, industrial' },
			{ label: 'Maintain', value: 'pH-neutral mop, no wax \u2014 self-finishing' },
			{ label: 'Life', value: '15\u201330 yr depending on use' }
		],
		installRows: [
			{ label: 'Glue-down', value: 'Epoxy or polyurethane for heavy-use areas' },
			{ label: 'Contact cement', value: 'Stair treads and nosing applications' },
			{ label: 'Seaming', value: 'Butt seams tight, no overlap' },
			{ label: 'Subfloor', value: 'Concrete, dry \u2264 5 lbs MVER, clean and level' }
		],
		careRows: [
			{ label: 'Daily', value: 'Auto-scrub or damp mop, pH-neutral cleaner' },
			{ label: 'Weekly', value: 'Soft-bristle scrub in fitness areas' },
			{ label: 'Repairs', value: 'Pull and replace tiles; patch sheet goods' },
			{ label: 'Avoid', value: 'Petroleum-based cleaners \u2014 degrades rubber' }
		],
		careFootnote:
			'Rubber darkens and hardens with age but retains slip resistance; off-gassing fades after 2\u20134 weeks.',
		featureLabel: 'Impact absorption',
		featureHint: '(interactive)'
	},
	matting: {
		lead: 'Entrance walk-off systems engineered to trap dirt, moisture, and debris \u2014 stops 80%+ of tracked-in soil before it reaches the finish floor.',
		specs: [
			{ label: 'Sizes', value: 'Custom-cut to entrance, 10\u201315 ft depth' },
			{ label: 'Surface', value: 'Scraper, wiper, or combination inserts' },
			{ label: 'Install', value: 'Recessed frame, surface-mount, or loose-lay' },
			{ label: 'Rating', value: 'ASHRAE 10\u201315 ft walk-off recommended' },
			{ label: 'Fire', value: 'Varies by insert material' },
			{ label: 'For', value: 'Entrances, lobbies, vestibules, elevators' },
			{ label: 'Maintain', value: 'Vacuum daily, extract weekly, rotate pairs' },
			{ label: 'Life', value: 'Frames 20\u201330 yr, inserts 2\u20135 yr' }
		],
		installRows: [
			{ label: 'Recessed frame', value: 'Aluminium frame flush with floor, mat drops in' },
			{ label: 'Surface-mount', value: 'Tape or perimeter adhesive on finish floor' },
			{ label: 'Roll goods', value: 'Cut to size, loose-lay or perimeter glue' }
		],
		careRows: [
			{ label: 'Daily', value: 'Vacuum debris, shake out high-traffic mats' },
			{ label: 'Weekly', value: 'Extract or pressure-wash; rotate mat pairs' },
			{ label: 'Seasonal', value: 'Double coverage in snow/salt months' },
			{ label: 'Repairs', value: 'Replace worn inserts \u2014 frames last decades' }
		],
		careFootnote:
			'Matting is a consumable \u2014 budget for replacement cycles; undersized systems let soil through to damage finish floors.',
		featureLabel: 'Entry zones',
		featureHint: '(interactive)'
	},
	hardwood: {
		lead: 'Real wood flooring \u2014 solid planks, engineered veneer, parquet, bamboo, cork, and reclaimed old-growth.',
		specs: [
			{ label: 'Species', value: 'Oak, maple, walnut, cherry, bamboo, cork, reclaimed' },
			{ label: 'Finish', value: 'Site-finished or factory UV-cured' },
			{ label: 'Install', value: 'Nail-down, glue-down, floating click-lock' },
			{ label: 'Traffic', value: 'Moderate to heavy commercial' },
			{ label: 'Width', value: '2\u00BC\u2033 strip to 7\u2033+ wide plank' },
			{ label: 'For', value: 'Offices, showrooms, heritage, boutique hospitality' },
			{ label: 'Maintain', value: 'Dust mop daily, refinish every 3\u20135 yr' },
			{ label: 'Life', value: '20\u2013100+ yr (solid refinishable)' }
		],
		installRows: [
			{ label: 'Nail-down', value: '\u00BE\u2033 solid over plywood subfloor, traditional method' },
			{ label: 'Glue-down', value: 'Engineered over concrete, full-spread urethane' },
			{
				label: 'Click-lock',
				value: 'Engineered floating with underlayment, fastest install'
			},
			{ label: 'Pattern-laid', value: 'Parquet herringbone/chevron, hand-laid glue-down' }
		],
		careRows: [
			{ label: 'Daily', value: 'Dust mop with microfibre' },
			{ label: 'Weekly', value: 'Vacuum on hard-floor setting' },
			{ label: 'Periodic', value: 'Screen-and-recoat every 3\u20135 yr in commercial' },
			{ label: 'Deep', value: 'Full sand-and-refinish every 10\u201315 yr' }
		],
		careFootnote:
			'Solid \u00BE\u2033 can be refinished 3\u20135 times; engineered depends on wear layer (2 mm = 1 refinish, 4 mm+ = 2\u20133).',
		featureLabel: 'Wood types',
		featureHint: '(interactive)'
	},
	sheet: {
		lead: 'Continuous sheet vinyl in 6\u2019\u201312\u2019 rolls \u2014 heat-welded seams create a monolithic, waterproof membrane for clinical and wet-area environments.',
		specs: [
			{
				label: 'Format',
				value: '6\u2019\u201312\u2019 wide rolls, homogeneous or heterogeneous'
			},
			{ label: 'Wear', value: 'PUR surface or embedded aggregate (safety)' },
			{ label: 'Install', value: 'Full-spread adhesive, flash-cove walls' },
			{ label: 'Seams', value: 'Heat-welded with colour-matched rod' },
			{ label: 'Slip', value: 'ASTM D2047; safety flooring for wet areas' },
			{ label: 'For', value: 'Healthcare, kitchens, clean rooms, pools' },
			{ label: 'Maintain', value: 'Auto-scrub or damp mop, no wax needed' },
			{ label: 'Life', value: '10\u201325 yr depending on use intensity' }
		],
		installRows: [
			{
				label: 'Full-spread',
				value: 'Acrylic or polyurethane adhesive over levelled subfloor'
			},
			{ label: 'Flash-cove', value: 'Sheet rolled up wall 4\u20136\u2033, no floor/wall seam' },
			{
				label: 'Heat-weld',
				value: 'Automatic or hand-held gun with matching weld rod'
			}
		],
		careRows: [
			{ label: 'Daily', value: 'Auto-scrub or damp mop, pH-neutral cleaner' },
			{
				label: 'Safety',
				value: 'Scrub with stiff pad \u2014 dirt sits in aggregate texture'
			},
			{
				label: 'Repairs',
				value: 'Cut-and-weld patch for small damage, panel replace for large'
			}
		],
		careFootnote:
			'15\u201325 yr moderate commercial; 10\u201315 yr in surgical suites or heavy wet use where aggressive chemical cleaning accelerates wear.',
		featureLabel: 'Cove anatomy',
		featureHint: '(interactive)'
	}
};
