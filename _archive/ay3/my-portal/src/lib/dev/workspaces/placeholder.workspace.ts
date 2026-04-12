// Placeholder workspace factory.
//
// Used for not-yet-implemented workspaces (Pages, Theme, Media, Settings).
// They appear in the right rail as dimmed, disabled items.
// Clicking them should NOT switch — the nav handles them by emitting a "soon" toast.

import type { Workspace } from '$lib/dev/workspace/types';

export function placeholderWorkspace(
	id: string,
	name: string,
	icon: string
): Workspace<unknown> {
	return {
		id,
		name,
		icon,
		placeholder: true,
		loadSubjects: () => [],
		toolsFor: () => [],
		canvas: () => import('./PlaceholderCanvas.svelte')
	};
}
