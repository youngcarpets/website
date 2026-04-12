/**
 * Preset persistence for the playground component editor.
 * Per-component localStorage keys.
 */

export type PresetState = Record<string, string | number | boolean>;

export interface Preset {
	name: string;
	fav: boolean;
	state: PresetState;
	createdAt: string;
}

const PRESETS_KEY = (id: string) => `playground_presets_${id}`;
const ACTIVE_KEY = (id: string) => `playground_active_${id}`;

export function loadPresets(componentId: string): Preset[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		const raw = localStorage.getItem(PRESETS_KEY(componentId));
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export function savePresets(componentId: string, presets: Preset[]): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(PRESETS_KEY(componentId), JSON.stringify(presets));
	} catch {
		/* quota exceeded or disabled */
	}
}

export function loadActivePreset(componentId: string): string | null {
	if (typeof localStorage === 'undefined') return null;
	return localStorage.getItem(ACTIVE_KEY(componentId));
}

export function setActivePreset(componentId: string, name: string | null): void {
	if (typeof localStorage === 'undefined') return;
	if (name === null) {
		localStorage.removeItem(ACTIVE_KEY(componentId));
	} else {
		localStorage.setItem(ACTIVE_KEY(componentId), name);
	}
}

export function addPreset(componentId: string, name: string, state: PresetState): Preset[] {
	const presets = loadPresets(componentId);
	// Replace if name already exists
	const filtered = presets.filter((p) => p.name !== name);
	filtered.push({
		name,
		fav: false,
		state: { ...state },
		createdAt: new Date().toISOString()
	});
	savePresets(componentId, filtered);
	return filtered;
}

export function deletePreset(componentId: string, name: string): Preset[] {
	const presets = loadPresets(componentId).filter((p) => p.name !== name);
	savePresets(componentId, presets);
	return presets;
}

export function toggleFav(componentId: string, name: string): Preset[] {
	const presets = loadPresets(componentId).map((p) =>
		p.name === name ? { ...p, fav: !p.fav } : p
	);
	savePresets(componentId, presets);
	return presets;
}

/** Sort favorites first, then alphabetical */
export function sortPresets(presets: Preset[]): Preset[] {
	return [...presets].sort((a, b) => {
		if (a.fav !== b.fav) return a.fav ? -1 : 1;
		return a.name.localeCompare(b.name);
	});
}
