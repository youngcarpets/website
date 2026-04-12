// Shared dev-mode types — used by all workspaces and tools.
// Lifted from lib/dev/playground/types.ts so non-playground workspaces
// (Database, future Pages/Theme/Media) can share the same vocabulary.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = import('svelte').Component<any, any, any>;

export type ShowcaseCategory = 'navigation' | 'inputs' | 'display' | 'feedback' | 'overlay';

export type EditablePropType = 'color' | 'slider' | 'toggle' | 'select';

export type EditableSection = 'Color' | 'Shape' | 'Effects' | 'Layout';

export interface EditableProp {
	id: string;
	cssVar: string;
	label: string;
	section: EditableSection;
	type: EditablePropType;
	default: string | number | boolean;
	min?: number;
	max?: number;
	step?: number;
	unit?: string;
	options?: readonly { label: string; value: string | number }[];
	/**
	 * If true, applies on every input event (live drag).
	 * If false, applies only on `change` (release).
	 * Set false for GPU-expensive props like blur/saturation/shadow.
	 * Default: true.
	 */
	live?: boolean;
}

export interface PropSpec {
	name: string;
	type: 'string' | 'number' | 'boolean' | 'enum' | 'color';
	default: unknown;
	options?: readonly string[];
	description?: string;
}

export interface ShowcaseEntry {
	id: string;
	name: string;
	category: ShowcaseCategory;
	description: string;
	load: () => Promise<{ default: AnyComponent }>;
	propSpec?: readonly PropSpec[];
	defaultProps?: Record<string, unknown>;
	editableProps?: readonly EditableProp[];
	variants?: ReadonlyArray<{ name: string; props: Record<string, unknown> }>;
}
