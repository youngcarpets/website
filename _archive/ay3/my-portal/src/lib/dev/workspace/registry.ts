// Workspace registry. Add new workspaces here.
//
// Workspaces are stored type-erased so the registry has a flat shape.
// Use getWorkspace<S>() to narrow to a concrete subject type at the call site.

import type { AnyWorkspace, Workspace } from './types';
import { designWorkspace } from '$lib/dev/workspaces/components.workspace';
import { databaseWorkspace } from '$lib/dev/workspaces/database.workspace';
import { debugWorkspace } from '$lib/dev/workspaces/debug.workspace';
import { placeholderWorkspace } from '$lib/dev/workspaces/placeholder.workspace';

const workspaces: AnyWorkspace[] = [
	// Real workspaces (active or stub-with-canvas)
	designWorkspace as AnyWorkspace,
	databaseWorkspace as AnyWorkspace,
	debugWorkspace as AnyWorkspace,
	// Placeholder workspaces — appear dimmed in the right rail
	placeholderWorkspace('pages', 'Pages', 'document'),
	placeholderWorkspace('theme', 'Theme', 'droplet'),
	placeholderWorkspace('media', 'Media', 'image'),
	placeholderWorkspace('settings', 'Settings', 'gear')
];

export function registerWorkspace(ws: AnyWorkspace): void {
	if (workspaces.some((w) => w.id === ws.id)) {
		throw new Error(`Workspace already registered: ${ws.id}`);
	}
	workspaces.push(ws);
}

export function listWorkspaces(): readonly AnyWorkspace[] {
	return workspaces;
}

export function getWorkspace<S = unknown>(id: string): Workspace<S> | undefined {
	return workspaces.find((w) => w.id === id) as Workspace<S> | undefined;
}
