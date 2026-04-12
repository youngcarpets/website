// Design workspace.
//
// "Design" in user terms = picking a component and adjusting its formatting/layout.
// Subjects = ShowcaseEntry from the existing playground registry.
// Tools = prop-editor + color-picker (more added later: preset, css-copy, spacing, ...).

import type { ShowcaseEntry } from '$lib/dev/types';
import type { Workspace, Tool } from '$lib/dev/workspace/types';
import { registry } from '$lib/dev/playground/registry';
import { propEditorTool } from '$lib/dev/tools/prop-editor.tool';
import { colorPickerTool } from '$lib/dev/tools/color-picker.tool';

const tools: readonly Tool<ShowcaseEntry>[] = [propEditorTool, colorPickerTool];

export const designWorkspace: Workspace<ShowcaseEntry> = {
	id: 'design',
	name: 'Design',
	icon: 'sliders',
	loadSubjects: () => registry,
	toolsFor: (subject) => {
		if (!subject) return [];
		return tools.filter((t) => t.applicableTo(subject));
	},
	canvas: () => import('./ComponentCanvas.svelte'),
	subjectLabel: (s) => s.name
};
