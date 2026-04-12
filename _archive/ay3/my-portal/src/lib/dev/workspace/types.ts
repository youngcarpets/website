// Workspace + Tool contracts for the modular dev page.
//
// A Workspace is a top-level mode (Components, Database, future Pages/Theme/Media).
// A Tool is a composable editor that operates on a workspace's subjects
// (color picker, prop editor, query builder, crud form, ...).
//
// Both are registered in lib/dev/workspace/registry.ts and lib/dev/tools/registry.ts.
// Adding a new workspace or tool = create one file + register it. No surgery on the shell.

import type { Component } from 'svelte';

export type Mode = 'browse' | 'focus';

/**
 * Context handed to a tool panel when it is mounted.
 * Lets the tool drive global dev state without importing the store directly.
 */
export interface ToolContext {
	exit: () => void;
	setMode: (m: Mode) => void;
	notify: (msg: string) => void;
}

/**
 * Dependencies a workspace may need to load its subjects
 * (e.g. server-loaded page data, supabase client, etc.).
 * `data` is `unknown` — each workspace narrows it to its own expected shape.
 */
export interface WorkspaceDeps {
	data: unknown;
}

/**
 * A composable tool. Generic over the subject type it operates on.
 * Panel components are lazy-loaded for code-splitting.
 */
export interface Tool<S> {
	readonly id: string;
	readonly name: string;
	readonly icon: string;
	applicableTo(subject: S): boolean;
	panel: () => Promise<{ default: Component<{ subject: S; ctx: ToolContext }> }>;
}

/**
 * A workspace owns a list of subjects and declares which tools apply to each.
 * Generic over the subject type.
 */
export interface Workspace<S> {
	readonly id: string;
	readonly name: string;
	readonly icon: string;
	loadSubjects(deps: WorkspaceDeps): Promise<readonly S[]> | readonly S[];
	toolsFor(subject: S | null): readonly Tool<S>[];
	canvas: () => Promise<{ default: Component<{ subject: S | null }> }>;
	subjectLabel?: (s: S) => string;
	/** Marks this workspace as a placeholder (not yet implemented). */
	readonly placeholder?: boolean;
}

/**
 * Type-erased workspace stored in the registry.
 * Use the typed accessor in registry.ts to narrow back to a concrete subject type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyWorkspace = Workspace<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyTool = Tool<any>;
