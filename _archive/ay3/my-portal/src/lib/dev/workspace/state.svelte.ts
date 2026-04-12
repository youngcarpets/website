// Global dev-mode state.
//
// Single source of truth for which workspace, subject, and tool are active,
// plus the browse/focus mode that drives the info-recedes behavior.
//
// URL is the persistence layer — see DevShell.svelte for the $effect that
// syncs ?ws=&sub=&tool= with this state on navigation.

import type { Mode } from './types';

interface DevState {
	mode: Mode;
	workspaceId: string;
	subjectId: string | null;
	toolId: string | null;
	infoVisible: boolean;
	isDark: boolean;
}

export const dev = $state<DevState>({
	mode: 'browse',
	workspaceId: 'design',
	subjectId: null,
	toolId: null,
	infoVisible: true,
	isDark: false
});

/**
 * Open a tool. Flips into focus mode automatically.
 * Pass null to clear (returns to browse).
 */
export function openTool(toolId: string | null) {
	dev.toolId = toolId;
	dev.mode = toolId === null ? 'browse' : 'focus';
}

/**
 * Pick a subject. Does NOT change mode — picking a subject in browse
 * stays in browse; picking while a tool is open keeps the tool focused
 * on the new subject.
 */
export function pickSubject(subjectId: string | null) {
	dev.subjectId = subjectId;
}

/**
 * Switch workspaces. Clears subject + tool and returns to browse.
 */
export function switchWorkspace(workspaceId: string) {
	dev.workspaceId = workspaceId;
	dev.subjectId = null;
	dev.toolId = null;
	dev.mode = 'browse';
}

/**
 * Exit the active tool, returning to browse mode.
 * Subject stays selected.
 */
export function exitTool() {
	dev.toolId = null;
	dev.mode = 'browse';
}
