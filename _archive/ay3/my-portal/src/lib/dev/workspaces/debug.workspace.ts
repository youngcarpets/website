// Debug workspace (stub — future chunk fills in real diagnostics).
//
// Subjects = same components as Design workspace, but for inspection rather than editing.
// Tools will be: render-counter, click-log, error-report, console-tail, perf-trace.
// Plus a section to print reports for fixing errors.

import type { ShowcaseEntry } from '$lib/dev/types';
import type { Workspace, Tool } from '$lib/dev/workspace/types';
import { registry } from '$lib/dev/playground/registry';

const tools: readonly Tool<ShowcaseEntry>[] = [
	// future: renderCounterTool, clickLogTool, errorReportTool, consoleTailTool
];

export const debugWorkspace: Workspace<ShowcaseEntry> = {
	id: 'debug',
	name: 'Debug',
	icon: 'bug',
	loadSubjects: () => registry,
	toolsFor: (subject) => {
		if (!subject) return [];
		return tools.filter((t) => t.applicableTo(subject));
	},
	canvas: () => import('./PlaceholderCanvas.svelte'),
	subjectLabel: (s) => s.name
};
