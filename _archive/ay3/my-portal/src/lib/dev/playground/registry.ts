import type { ShowcaseEntry } from './types';

export const registry: readonly ShowcaseEntry[] = [
	{
		id: 'floating-navbar',
		name: 'Floating Navbar',
		category: 'navigation',
		description: 'Sticky top nav with liquid-glass backdrop and accent bar.',
		load: () => import('./showcases/FloatingNavbar.showcase.svelte'),
		defaultProps: { title: 'AY3 Portal' },
		editableProps: [
			{ id: 'accent', cssVar: '--c-accent', label: 'Accent Color',  section: 'Color',   type: 'color',  default: '#00C2FF' },
			{ id: 'tint',   cssVar: '--c-tint',   label: 'Tint Strength', section: 'Color',   type: 'slider', default: 8,  min: 0, max: 30, step: 1, unit: '%' },
			{ id: 'radius', cssVar: '--c-radius', label: 'Pill Radius',   section: 'Shape',   type: 'slider', default: 9999, min: 0, max: 9999, step: 1, unit: 'px' },
			{ id: 'pad',    cssVar: '--c-pad',    label: 'Padding',       section: 'Shape',   type: 'slider', default: 10, min: 6, max: 20, step: 1, unit: 'px' },
			{ id: 'blur',   cssVar: '--c-blur',   label: 'Glass Blur',    section: 'Effects', type: 'slider', default: 24, min: 0, max: 25, step: 1, unit: 'px', live: false },
			{ id: 'glow',   cssVar: '--c-glow',   label: 'Hover Glow',    section: 'Effects', type: 'slider', default: 24, min: 0, max: 60, step: 2, unit: 'px', live: false }
		]
	},
	{
		id: 'primary-button',
		name: 'Primary Button',
		category: 'inputs',
		description: 'Capsule button with colored shadow and hover lift.',
		load: () => import('./showcases/PrimaryButton.showcase.svelte'),
		defaultProps: { label: 'Click me' },
		editableProps: [
			{ id: 'accent', cssVar: '--c-accent', label: 'Accent Color',   section: 'Color',   type: 'color',  default: '#00C2FF' },
			{ id: 'radius', cssVar: '--c-radius', label: 'Border Radius',  section: 'Shape',   type: 'slider', default: 9999, min: 0, max: 9999, step: 1, unit: 'px' },
			{ id: 'padX',   cssVar: '--c-pad-x',  label: 'Padding X',      section: 'Shape',   type: 'slider', default: 24, min: 8, max: 48, step: 2, unit: 'px' },
			{ id: 'padY',   cssVar: '--c-pad-y',  label: 'Padding Y',      section: 'Shape',   type: 'slider', default: 10, min: 6, max: 20, step: 1, unit: 'px' },
			{ id: 'glow',   cssVar: '--c-glow',   label: 'Glow',           section: 'Effects', type: 'slider', default: 16, min: 0, max: 40, step: 2, unit: 'px', live: false }
		]
	},
	{
		id: 'glass-input',
		name: 'Glass Input',
		category: 'inputs',
		description: 'Soft neutral input with colored focus ring.',
		load: () => import('./showcases/GlassInput.showcase.svelte'),
		defaultProps: { placeholder: 'Type something...' },
		editableProps: [
			{ id: 'accent', cssVar: '--c-accent', label: 'Focus Color',   section: 'Color', type: 'color',  default: '#00C2FF' },
			{ id: 'radius', cssVar: '--c-radius', label: 'Border Radius', section: 'Shape', type: 'slider', default: 10, min: 0, max: 30, step: 1, unit: 'px' },
			{ id: 'pad',    cssVar: '--c-pad',    label: 'Padding',       section: 'Shape', type: 'slider', default: 10, min: 6, max: 20, step: 1, unit: 'px' }
		]
	},
	{
		id: 'pill',
		name: 'Pill / Tag',
		category: 'display',
		description: 'Rounded-full label with electric outline glow.',
		load: () => import('./showcases/Pill.showcase.svelte'),
		defaultProps: { label: 'Active' },
		editableProps: [
			{ id: 'accent', cssVar: '--c-accent', label: 'Accent Color',  section: 'Color',   type: 'color',  default: '#00C2FF' },
			{ id: 'tint',   cssVar: '--c-tint',   label: 'Tint Strength', section: 'Color',   type: 'slider', default: 10, min: 0, max: 40, step: 1, unit: '%' },
			{ id: 'radius', cssVar: '--c-radius', label: 'Border Radius', section: 'Shape',   type: 'slider', default: 9999, min: 0, max: 9999, step: 1, unit: 'px' },
			{ id: 'glow',   cssVar: '--c-glow',   label: 'Outline Glow',  section: 'Effects', type: 'slider', default: 0,  min: 0, max: 24, step: 1, unit: 'px', live: false }
		]
	},
	{
		id: 'badge',
		name: 'Badge',
		category: 'display',
		description: 'Small status indicator with electric glow.',
		load: () => import('./showcases/Badge.showcase.svelte'),
		defaultProps: { label: 'New' },
		editableProps: [
			{ id: 'accent', cssVar: '--c-accent', label: 'Accent Color', section: 'Color',   type: 'color',  default: '#00C2FF' },
			{ id: 'radius', cssVar: '--c-radius', label: 'Border Radius', section: 'Shape',  type: 'slider', default: 9999, min: 0, max: 9999, step: 1, unit: 'px' },
			{ id: 'glow',   cssVar: '--c-glow',   label: 'Glow',         section: 'Effects', type: 'slider', default: 8, min: 0, max: 24, step: 1, unit: 'px', live: false }
		]
	},
	{
		id: 'glass-card',
		name: 'Glass Card',
		category: 'display',
		description: 'Frosted glass panel with multi-layer shadow.',
		load: () => import('./showcases/GlassCard.showcase.svelte'),
		defaultProps: {},
		editableProps: [
			// Cheap (live): color, tint, radius, padding, border
			{ id: 'accent', cssVar: '--c-accent', label: 'Accent Color',  section: 'Color',   type: 'color',  default: '#00C2FF' },
			{ id: 'tint',   cssVar: '--c-tint',   label: 'Tint Strength', section: 'Color',   type: 'slider', default: 6,  min: 0, max: 30, step: 1, unit: '%' },
			{ id: 'radius', cssVar: '--c-radius', label: 'Border Radius', section: 'Shape',   type: 'slider', default: 20, min: 0, max: 40, step: 1, unit: 'px' },
			{ id: 'pad',    cssVar: '--c-pad',    label: 'Padding',       section: 'Shape',   type: 'slider', default: 20, min: 8, max: 48, step: 2, unit: 'px' },
			{ id: 'border', cssVar: '--c-border', label: 'Border Opacity', section: 'Color',  type: 'slider', default: 12, min: 0, max: 50, step: 1, unit: '%' },
			// Expensive (apply on release): blur, saturation, shadow blur
			{ id: 'blur',   cssVar: '--c-blur',   label: 'Glass Blur',    section: 'Effects', type: 'slider', default: 20, min: 0, max: 25, step: 1, unit: 'px', live: false },
			{ id: 'sat',    cssVar: '--c-sat',    label: 'Saturation',    section: 'Effects', type: 'slider', default: 130, min: 100, max: 180, step: 5, unit: '%', live: false },
			{ id: 'shadow', cssVar: '--c-shadow', label: 'Shadow Depth',  section: 'Effects', type: 'slider', default: 16, min: 0, max: 32, step: 2, unit: 'px', live: false },
			{ id: 'glow',   cssVar: '--c-glow',   label: 'Accent Glow',   section: 'Effects', type: 'slider', default: 30, min: 0, max: 60, step: 2, unit: 'px', live: false }
		]
	},
	{
		id: 'modal',
		name: 'Modal',
		category: 'overlay',
		description: 'Centered dialog with backdrop blur and glow.',
		load: () => import('./showcases/Modal.showcase.svelte'),
		defaultProps: {},
		editableProps: [
			{ id: 'accent', cssVar: '--c-accent', label: 'Accent Color',   section: 'Color',   type: 'color',  default: '#00C2FF' },
			{ id: 'radius', cssVar: '--c-radius', label: 'Corner Radius',  section: 'Shape',   type: 'slider', default: 24, min: 0, max: 40, step: 1, unit: 'px' },
			{ id: 'pad',    cssVar: '--c-pad',    label: 'Padding',        section: 'Shape',   type: 'slider', default: 28, min: 16, max: 48, step: 2, unit: 'px' },
			{ id: 'blur',   cssVar: '--c-blur',   label: 'Backdrop Blur',  section: 'Effects', type: 'slider', default: 8,  min: 0, max: 25, step: 1, unit: 'px', live: false },
			{ id: 'glow',   cssVar: '--c-glow',   label: 'Border Glow',    section: 'Effects', type: 'slider', default: 24, min: 0, max: 60, step: 2, unit: 'px', live: false }
		]
	},
	{
		id: 'toast',
		name: 'Toast',
		category: 'feedback',
		description: 'Floating notification with electric status accents.',
		load: () => import('./showcases/Toast.showcase.svelte'),
		defaultProps: {},
		editableProps: [
			{ id: 'accent', cssVar: '--c-accent', label: 'Accent Color',  section: 'Color',   type: 'color',  default: '#00C2FF' },
			{ id: 'radius', cssVar: '--c-radius', label: 'Border Radius', section: 'Shape',   type: 'slider', default: 12, min: 0, max: 24, step: 1, unit: 'px' },
			{ id: 'glow',   cssVar: '--c-glow',   label: 'Glow',          section: 'Effects', type: 'slider', default: 8,  min: 0, max: 24, step: 1, unit: 'px', live: false }
		]
	}
] as const;

export const categories: ReadonlyArray<{ id: 'all' | 'navigation' | 'inputs' | 'display' | 'feedback' | 'overlay'; label: string }> = [
	{ id: 'all', label: 'All' },
	{ id: 'navigation', label: 'Navigation' },
	{ id: 'inputs', label: 'Inputs' },
	{ id: 'display', label: 'Display' },
	{ id: 'feedback', label: 'Feedback' },
	{ id: 'overlay', label: 'Overlay' }
] as const;
