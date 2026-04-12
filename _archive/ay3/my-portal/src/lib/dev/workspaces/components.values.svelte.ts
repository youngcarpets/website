// Per-subject editable-prop value store for the Components workspace.
//
// The canvas reads from this map; tool panels write to it.
// Seeded from each ShowcaseEntry's editableProps defaults on first read.

import type { ShowcaseEntry } from '$lib/dev/types';

type PropValue = string | number | boolean;

const store = $state<Record<string, Record<string, PropValue>>>({});

function seed(entry: ShowcaseEntry): Record<string, PropValue> {
	const seeded: Record<string, PropValue> = {};
	for (const p of entry.editableProps ?? []) seeded[p.id] = p.default;
	return seeded;
}

/**
 * Get (or initialize) the value bag for a component.
 * Always returns a stable reference into the store, so writing
 * `values[p.id] = x` triggers reactivity in any consumer.
 */
export function getValues(entry: ShowcaseEntry): Record<string, PropValue> {
	if (!store[entry.id]) store[entry.id] = seed(entry);
	return store[entry.id];
}

/** Reset a single prop to its default. */
export function resetValue(entry: ShowcaseEntry, propId: string): void {
	const def = entry.editableProps?.find((p) => p.id === propId)?.default;
	if (def !== undefined) {
		const v = getValues(entry);
		v[propId] = def;
	}
}

/** Reset every editable prop on this component. */
export function resetAll(entry: ShowcaseEntry): void {
	store[entry.id] = seed(entry);
}
