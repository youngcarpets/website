// Tool registry. Add new tools here.
//
// Tools are kept separate from workspaces so a single tool (e.g. color picker)
// can apply to subjects from multiple workspaces. The workspace decides which
// tools it offers via Workspace.toolsFor(subject).

import type { AnyTool, Tool } from '$lib/dev/workspace/types';
import { propEditorTool } from './prop-editor.tool';
import { colorPickerTool } from './color-picker.tool';

const tools: AnyTool[] = [
	propEditorTool as AnyTool,
	colorPickerTool as AnyTool
];

export function registerTool(tool: AnyTool): void {
	if (tools.some((t) => t.id === tool.id)) {
		throw new Error(`Tool already registered: ${tool.id}`);
	}
	tools.push(tool);
}

export function listTools(): readonly AnyTool[] {
	return tools;
}

export function getTool<S = unknown>(id: string): Tool<S> | undefined {
	return tools.find((t) => t.id === id) as Tool<S> | undefined;
}
