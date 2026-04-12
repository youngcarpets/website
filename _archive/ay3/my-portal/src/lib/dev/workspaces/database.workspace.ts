// Database workspace (stub — chunk 4 fills in real subjects + tools).
//
// Subjects will be Supabase tables loaded via deps.data from +page.server.ts.
// Tools will be query-builder + crud-form (currently the legacy /dev page CRUD).

import type { Workspace, Tool } from '$lib/dev/workspace/types';

export interface TableSubject {
	id: string;
	name: string;
	count: number;
	error?: string;
}

const tools: readonly Tool<TableSubject>[] = [
	// chunk 4: queryBuilderTool, crudFormTool
];

export const databaseWorkspace: Workspace<TableSubject> = {
	id: 'database',
	name: 'Database',
	icon: 'cylinder',
	loadSubjects: () => [],
	toolsFor: (subject) => {
		if (!subject) return [];
		return tools.filter((t) => t.applicableTo(subject));
	},
	canvas: () => import('./PlaceholderCanvas.svelte'),
	subjectLabel: (s) => s.name
};
