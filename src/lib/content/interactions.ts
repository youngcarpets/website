export type TilePattern = 'monolithic' | 'quarter' | 'brick' | 'herring' | 'random' | 'ashlar';
export const tilePatternList: { id: TilePattern; label: string }[] = [
	{ id: 'monolithic', label: 'MONOLITHIC' },
	{ id: 'quarter', label: 'QUARTER' },
	{ id: 'brick', label: 'BRICK' },
	{ id: 'herring', label: 'HERRINGBONE' },
	{ id: 'random', label: 'RANDOM' },
	{ id: 'ashlar', label: 'ASHLAR' }
];
