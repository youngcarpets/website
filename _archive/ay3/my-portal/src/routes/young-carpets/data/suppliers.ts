// Young Carpets — supplier catalog + URL lookup helper.
// Extracted from +page.svelte on 2026-04-08 (v1.24.x refactor).

export type Supplier = {
	name: string;
	url: string;
	// Optional logo path under /static/young-carpets/suppliers/. Until the
	// asset exists, the carousel renders a typographic wordmark fallback
	// in the brand's name. Drop an SVG/PNG at the path and flip this field.
	logo: string | null;
};

export const suppliers: Supplier[] = [
	{ name: 'Tarkett', url: 'https://commercial.tarkett.com/', logo: null },
	{ name: 'Beaulieu Canada', url: 'https://beaulieucanada.com/en', logo: null },
	{ name: 'Interface', url: 'https://www.interface.com/', logo: null },
	{ name: 'Forbo', url: 'https://www.forbo.com/flooring/en-gl/', logo: null },
	{ name: 'Shaw Contract', url: 'https://www.shawcontract.com/en-ca', logo: null },
	{ name: 'Mohawk Group', url: 'https://www.mohawkgroup.com/', logo: null },
	{ name: 'Patcraft', url: 'https://www.patcraft.com/', logo: null },
	{ name: 'Gerflor', url: 'https://www.gerflorcanada.com/ca', logo: null },
	{ name: 'Johnsonite', url: 'https://commercial.tarkett.com/johnsonite', logo: null },
	{ name: 'COREtec', url: 'https://coretecfloors.com/en-us', logo: null },
	{ name: 'Nora', url: 'https://www.nora.com/canada/en', logo: null },
	{ name: 'Armstrong Flooring', url: 'https://www.armstrongflooring.com/commercial', logo: null },
	// User-supplied additions (round 2)
	{ name: 'ViFloor', url: 'https://www.vifloor.com/', logo: null },
	{ name: 'Fuzion Flooring', url: 'https://www.fuzionflooring.com/', logo: null },
	{ name: 'Centura', url: 'https://www.centura.ca/en', logo: null },
	{ name: 'Euro Tile & Stone', url: 'https://eurotilestone.com/', logo: null },
	{ name: 'Olympia Tile', url: 'https://www.olympiatile.com/', logo: null },
	{ name: 'Ceratec', url: 'https://www.ceratec.com/en/', logo: null },
	{ name: 'Céragrès', url: 'https://www.ceragres.ca/', logo: null }
];

// Supplier name → URL lookup for the modal-body supplier chips.
// Pulls primarily from suppliers[] (already verified URLs); falls back to
// this hardcoded second list for sub-brands not in the supplier carousel.
export const extraSupplierUrls: Record<string, string> = {
	'Mannington': 'https://www.manningtoncommercial.com/',
	'Karndean': 'https://www.karndean.com/en-ca',
	'Milliken': 'https://www.millikenfloors.com/',
	'Mirage': 'https://miragefloors.com/en-ca/',
	'Lauzon': 'https://lauzonflooring.com/en-ca/',
	'Preverco': 'https://www.preverco.com/en/',
	'Mercier': 'https://mercier-wood-flooring.com/en/',
	'Bruce / Armstrong': 'https://www.bruce.com/',
	'Shaw Hardwood': 'https://shawfloors.com/flooring/hardwood',
	'Mondo': 'https://www.mondoworldwide.com/',
	'Ecore': 'https://ecoreintl.com/',
	'Regupol': 'https://www.regupol.com/en/',
	'Tarkett Sports': 'https://tarkettsports.com/',
	'Artigo': 'https://www.artigo.com/en/',
	'Roppe': 'https://www.roppe.com/',
	'Musson': 'https://www.mussonrubber.com/',
	'Flexco': 'https://www.flexcofloors.com/',
	'Daltile': 'https://www.daltile.com/',
	'Crossville': 'https://crossvilleinc.com/',
	'Polyflor': 'https://www.polyflor.com/',
	'Altro': 'https://www.altro.com/',
	'Sika': 'https://can.sika.com/',
	'Stonhard': 'https://www.stonhard.com/',
	'Florock': 'https://www.florock.net/',
	'Dur-A-Flex': 'https://www.dur-a-flex.com/',
	'Tate': 'https://www.tateinc.com/',
	'Haworth TecCrete': 'https://www.haworth.com/ca/en/products/raised-access-floors/teccrete.html',
	'Construction Specialties': 'https://www.c-sgroup.com/',
	'Pedimat': 'https://www.c-sgroup.com/entrance-flooring',
	'Forbo Coral': 'https://www.forbo.com/flooring/en-gl/products/entrance-flooring/',
	'Staticworx': 'https://www.staticworx.com/',
	'Forbo Colorex': 'https://www.forbo.com/flooring/en-gl/products/static-control-flooring/',
	'Tarkett iQ': 'https://commercial.tarkett.com/en_US/node/heterogeneous-and-homogeneous-vinyl-flooring-iq-12010',
	'Forbo (Sphera)': 'https://www.forbo.com/flooring/en-gl/products/homogeneous-vinyl/',
	'Gerflor (Mipolam)': 'https://www.gerflorcanada.com/professionals/products/heterogeneous/mipolam-symbioz-1500.html',
	'Armstrong (Azrock)': 'https://www.armstrongflooring.com/commercial/en-us/commercial-flooring-products/vct-flooring.html',
	'Tandus Centiva': 'https://www.tandus-centiva.com/'
};

export function supplierUrl(name: string): string | null {
	// Strip parenthetical sub-brand notes for lookup ('Tarkett (confirmed)'
	// → 'Tarkett'; 'Forbo (Sphera)' stays since the parenthetical is the
	// actual sub-product, but we also try the bare name).
	const trimmed = name.trim();
	if (extraSupplierUrls[trimmed]) return extraSupplierUrls[trimmed];
	const direct = suppliers.find((s) => s.name === trimmed);
	if (direct) return direct.url;
	const bare = trimmed.replace(/\s*[\(\[].*[\)\]]\s*/g, '').trim();
	if (bare !== trimmed) {
		if (extraSupplierUrls[bare]) return extraSupplierUrls[bare];
		const fuzzy = suppliers.find((s) => s.name === bare);
		if (fuzzy) return fuzzy.url;
	}
	return null;
}
