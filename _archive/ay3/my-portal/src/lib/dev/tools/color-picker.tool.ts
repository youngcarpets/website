// Color Picker tool — focused color editor.
// Applicable when the subject has at least one editable prop of type 'color'.

import type { ShowcaseEntry } from '$lib/dev/types';
import type { Tool } from '$lib/dev/workspace/types';

export const colorPickerTool: Tool<ShowcaseEntry> = {
	id: 'color-picker',
	name: 'Color',
	icon: 'droplet',
	applicableTo: (subject) =>
		(subject?.editableProps ?? []).some((p) => p.type === 'color'),
	panel: () => import('./ColorPickerPanel.svelte')
};
