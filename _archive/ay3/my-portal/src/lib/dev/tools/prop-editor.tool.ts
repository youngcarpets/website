// Prop Editor tool — operates on any ShowcaseEntry that exposes editableProps.
// The panel renders all editable props grouped by section (Color/Shape/Effects/Layout).

import type { ShowcaseEntry } from '$lib/dev/types';
import type { Tool } from '$lib/dev/workspace/types';

export const propEditorTool: Tool<ShowcaseEntry> = {
	id: 'prop-editor',
	name: 'Inspector',
	icon: 'sliders',
	applicableTo: (subject) => (subject?.editableProps?.length ?? 0) > 0,
	panel: () => import('./PropEditorPanel.svelte')
};
