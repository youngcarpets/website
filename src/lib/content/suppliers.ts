export interface Supplier {
	name: string;
	slug: string;
	url: string;
}

export const suppliers: Supplier[] = [
	{ name: 'Tarkett', slug: 'tarkett', url: 'https://commercial.tarkett.com/' },
	{ name: 'Beaulieu Canada', slug: 'beaulieu', url: 'https://beaulieucanada.com/en' },
	{ name: 'Interface', slug: 'interface', url: 'https://www.interface.com/' },
	{ name: 'Forbo', slug: 'forbo', url: 'https://www.forbo.com/flooring/en-gl/' },
	{ name: 'Shaw Contract', slug: 'shaw-contract', url: 'https://www.shawcontract.com/en-ca' },
	{ name: 'Mohawk Group', slug: 'mohawk-group', url: 'https://www.mohawkgroup.com/' },
	{ name: 'Gerflor', slug: 'gerflor', url: 'https://www.gerflorcanada.com/ca' },
	{ name: 'Vifloor', slug: 'vifloor', url: 'https://www.vifloor.com/' },
	{ name: 'Fuzion Flooring', slug: 'fuzion', url: 'https://www.fuzionflooring.com/' },
	{ name: 'Centura', slug: 'centura', url: 'https://www.centura.ca/en' },
	{ name: 'Euro Tile & Stone', slug: 'euro-tile', url: 'https://eurotilestone.com/' },
	{ name: 'Olympia Tile', slug: 'olympia', url: 'https://www.olympiatile.com/' },
	{ name: 'Ceratec Surfaces', slug: 'ceratec', url: 'https://www.ceratec.com/en/' },
	{ name: 'Ceragres', slug: 'ceragres', url: 'https://www.ceragres.ca/' },
	{ name: 'Stone Tile International', slug: 'stone-tile', url: 'https://www.stone-tile.com/' },
	{ name: 'Mat Tech', slug: 'mat-tech', url: 'https://www.mattech.ca/' },
	{
		name: 'Mannington Commercial',
		slug: 'mannington',
		url: 'https://www.manningtonflooring.com/commercial'
	},
	{ name: 'CIOT', slug: 'ciot', url: 'https://www.cfrancis.ca/' }
];
