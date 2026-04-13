import type { Product } from './products';

type Material = Product['material'];

export interface Supplier {
	name: string;
	slug: string;
	url: string;
	materials: Material[];
}

export const suppliers: Supplier[] = [
	{
		name: 'Tarkett',
		slug: 'tarkett',
		url: 'https://commercial.tarkett.com/',
		materials: [
			'carpet-tile',
			'lvt',
			'carpet',
			'rubber',
			'sheet',
			'matting',
			'accessories',
			'installation'
		]
	},
	{
		name: 'Beaulieu Canada',
		slug: 'beaulieu',
		url: 'https://beaulieucanada.com/en',
		materials: ['carpet-tile', 'carpet', 'lvt', 'sheet', 'hardwood']
	},
	{
		name: 'Interface',
		slug: 'interface',
		url: 'https://www.interface.com/',
		materials: ['carpet-tile', 'lvt', 'rubber', 'accessories']
	},
	{
		name: 'Forbo',
		slug: 'forbo',
		url: 'https://www.forbo.com/flooring/en-gl/',
		materials: ['carpet-tile', 'lvt', 'sheet', 'matting']
	},
	{
		name: 'Shaw Contract',
		slug: 'shaw-contract',
		url: 'https://www.shawcontract.com/en-ca',
		materials: ['carpet-tile', 'carpet', 'lvt', 'ceramic', 'hardwood', 'sheet', 'accessories']
	},
	{
		name: 'Mohawk Group',
		slug: 'mohawk-group',
		url: 'https://www.mohawkgroup.com/',
		materials: ['carpet-tile', 'carpet', 'lvt', 'rubber', 'hardwood', 'sheet', 'accessories']
	},
	{
		name: 'Gerflor',
		slug: 'gerflor',
		url: 'https://www.gerflorcanada.com/ca',
		materials: ['lvt', 'sheet']
	},
	{
		name: 'Vifloor',
		slug: 'vifloor',
		url: 'https://www.vifloor.com/',
		materials: ['carpet-tile', 'carpet', 'lvt', 'matting', 'sheet']
	},
	{
		name: 'Fuzion Flooring',
		slug: 'fuzion',
		url: 'https://www.fuzionflooring.com/',
		materials: ['carpet-tile', 'lvt', 'hardwood', 'accessories']
	},
	{
		name: 'Centura',
		slug: 'centura',
		url: 'https://www.centura.ca/en',
		materials: [
			'carpet-tile',
			'carpet',
			'lvt',
			'ceramic',
			'rubber',
			'matting',
			'hardwood',
			'sheet',
			'accessories',
			'installation'
		]
	},
	{
		name: 'Euro Tile & Stone',
		slug: 'euro-tile',
		url: 'https://eurotilestone.com/',
		materials: ['ceramic', 'accessories', 'installation', 'more']
	},
	{
		name: 'Olympia Tile',
		slug: 'olympia',
		url: 'https://www.olympiatile.com/',
		materials: ['ceramic', 'lvt', 'accessories', 'installation', 'more']
	},
	{
		name: 'Ceratec Surfaces',
		slug: 'ceratec',
		url: 'https://www.ceratec.com/en/',
		materials: ['ceramic', 'lvt', 'sheet', 'accessories', 'installation']
	},
	{
		name: 'Ceragres',
		slug: 'ceragres',
		url: 'https://www.ceragres.ca/',
		materials: ['ceramic', 'accessories', 'installation', 'more']
	},
	{
		name: 'Stone Tile International',
		slug: 'stone-tile',
		url: 'https://www.stone-tile.com/',
		materials: ['ceramic', 'hardwood', 'more']
	},
	{
		name: 'Mat Tech',
		slug: 'mat-tech',
		url: 'https://www.mattech.ca/',
		materials: ['matting']
	},
	{
		name: 'Mannington Commercial',
		slug: 'mannington',
		url: 'https://www.manningtonflooring.com/commercial',
		materials: ['carpet-tile', 'carpet', 'lvt', 'rubber', 'sheet', 'accessories']
	},
	{
		name: 'CIOT',
		slug: 'ciot',
		url: 'https://www.ciot.com/',
		materials: ['ceramic', 'hardwood', 'accessories', 'installation', 'more']
	}
];

export function suppliersByMaterial(material: Material): Supplier[] {
	return suppliers.filter((s) => s.materials.includes(material));
}
