<script lang="ts">
	import { registry, categories } from './registry';
	import ComponentEditor from './ComponentEditor.svelte';
	import {
		loadPresets,
		addPreset,
		deletePreset,
		toggleFav,
		sortPresets,
		loadActivePreset,
		setActivePreset,
		type Preset
	} from './presets';
	import './theme.css';

	type EditorState = Record<string, string | number | boolean>;

	let isDark = $state(true);
	let activeCategory = $state<'all' | 'navigation' | 'inputs' | 'display' | 'feedback' | 'overlay'>('all');
	let selectedId = $state(registry[0].id);
	let editorOpen = $state(false);

	const filtered = $derived(
		activeCategory === 'all' ? registry : registry.filter((e) => e.category === activeCategory)
	);
	const selected = $derived(registry.find((e) => e.id === selectedId) ?? registry[0]);
	const editable = $derived(selected.editableProps ?? []);

	// Editor state — keyed by prop id, holds current value
	let editorState = $state<EditorState>({});

	// History stack (per component) for undo/redo
	let history = $state<EditorState[]>([]);
	let historyIdx = $state(-1);
	let suppressHistory = false;

	const canUndo = $derived(historyIdx > 0);
	const canRedo = $derived(historyIdx >= 0 && historyIdx < history.length - 1);

	// Preset state
	let presets = $state<Preset[]>([]);
	let activePresetName = $state<string | null>(null);
	const sortedPresets = $derived(sortPresets(presets));

	// Reset editor state + history + presets when component changes
	$effect(() => {
		const id = selected.id;
		// Build defaults
		const defaults: EditorState = {};
		for (const p of editable) defaults[p.id] = p.default;
		// Load presets for this component
		const loaded = loadPresets(id);
		const activeName = loadActivePreset(id);
		const active = activeName ? loaded.find((p) => p.name === activeName) : null;
		// Use active preset state if found, otherwise defaults
		const next: EditorState = active ? { ...defaults, ...active.state } : defaults;
		suppressHistory = true;
		editorState = next;
		history = [{ ...next }];
		historyIdx = 0;
		presets = loaded;
		activePresetName = active?.name ?? null;
		queueMicrotask(() => (suppressHistory = false));
	});

	// Push to history on every editorState mutation
	$effect(() => {
		// Track all keys (force dependency)
		for (const p of editable) void editorState[p.id];
		if (suppressHistory) return;
		// Truncate redo branch + push current
		const snapshot: EditorState = { ...editorState };
		const trimmed = history.slice(0, historyIdx + 1);
		trimmed.push(snapshot);
		// Cap at 50
		if (trimmed.length > 50) trimmed.shift();
		history = trimmed;
		historyIdx = trimmed.length - 1;
	});

	function undo() {
		if (!canUndo) return;
		suppressHistory = true;
		historyIdx -= 1;
		editorState = { ...history[historyIdx] };
		queueMicrotask(() => (suppressHistory = false));
	}

	function redo() {
		if (!canRedo) return;
		suppressHistory = true;
		historyIdx += 1;
		editorState = { ...history[historyIdx] };
		queueMicrotask(() => (suppressHistory = false));
	}

	// Compute inline style string from editor state (canvas stage)
	const editorStyle = $derived(() => {
		const parts: string[] = [];
		for (const p of editable) {
			const val = editorState[p.id];
			if (val === undefined) continue;
			const cssValue = typeof val === 'number' && p.unit ? `${val}${p.unit}` : String(val);
			parts.push(`${p.cssVar}: ${cssValue}`);
		}
		return parts.join('; ');
	});

	// Page-level propagation: only the accent color flows to the whole UI.
	// Other props (blur, shadow, padding) stay scoped to canvas to avoid melting the page.
	const pageStyle = $derived(() => {
		const accent = editorState.accent;
		if (typeof accent === 'string' && accent.length > 0) {
			return `--accent: ${accent}; --accent-glow: 0 0 20px ${accent}55;`;
		}
		return '';
	});

	function pickCategory(id: typeof activeCategory) {
		activeCategory = id;
		if (!filtered.some((e) => e.id === selectedId)) {
			const first = registry.find((e) => id === 'all' || e.category === id);
			if (first) selectedId = first.id;
		}
	}

	function resetProp(id: string) {
		const prop = editable.find((p) => p.id === id);
		if (prop) editorState[id] = prop.default;
	}

	function resetAll() {
		for (const p of editable) editorState[p.id] = p.default;
	}

	function savePreset(name: string) {
		const trimmed = name.trim();
		if (!trimmed) return;
		const updated = addPreset(selected.id, trimmed, editorState);
		presets = updated;
		activePresetName = trimmed;
		setActivePreset(selected.id, trimmed);
	}

	function loadPreset(name: string) {
		const found = presets.find((p) => p.name === name);
		if (!found) return;
		const defaults: EditorState = {};
		for (const p of editable) defaults[p.id] = p.default;
		suppressHistory = true;
		editorState = { ...defaults, ...found.state };
		activePresetName = name;
		setActivePreset(selected.id, name);
		queueMicrotask(() => (suppressHistory = false));
	}

	function removePreset(name: string) {
		presets = deletePreset(selected.id, name);
		if (activePresetName === name) {
			activePresetName = null;
			setActivePreset(selected.id, null);
		}
	}

	function favPreset(name: string) {
		presets = toggleFav(selected.id, name);
	}

	async function copyCss() {
		const parts: string[] = [];
		for (const p of editable) {
			const val = editorState[p.id];
			if (val === undefined) continue;
			const cssValue = typeof val === 'number' && p.unit ? `${val}${p.unit}` : String(val);
			parts.push(`  ${p.cssVar}: ${cssValue};`);
		}
		const css = `/* ${selected.name} */\n.component {\n${parts.join('\n')}\n}`;
		try {
			await navigator.clipboard.writeText(css);
		} catch {
			console.warn('Clipboard not available');
		}
	}
</script>

<div class="playground-page" class:playground-page--dark={isDark} style={pageStyle()}>
	<div class="accent-bar"></div>

	<div class="container">
		<header class="header">
			<div>
				<a class="back-link" href="/dev">← Back to Dev</a>
				<h1 class="title">Component Playground</h1>
				<p class="subtitle">Preview and customize portal UI components</p>
			</div>
			<button
				class="theme-toggle"
				onclick={() => (isDark = !isDark)}
				aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
				title={isDark ? 'Light mode' : 'Dark mode'}
			>
				{isDark ? '☾' : '☀'}
			</button>
		</header>

		<!-- Selector -->
		<section class="panel selector-panel">
			<div class="category-row">
				{#each categories as cat}
					<button
						class="cat-pill"
						class:cat-pill--active={activeCategory === cat.id}
						onclick={() => pickCategory(cat.id)}
					>
						{cat.label}
					</button>
				{/each}
			</div>
			<div class="picker-row">
				<select class="picker" bind:value={selectedId}>
					{#each filtered as entry}
						<option value={entry.id}>{entry.name}</option>
					{/each}
				</select>
				<span class="count">{filtered.length} of {registry.length}</span>
			</div>
		</section>

		<!-- Canvas -->
		<section class="panel canvas-panel">
			<div class="canvas-header">
				<div>
					<div class="canvas-label">{selected.category}</div>
					<h2 class="canvas-title">{selected.name}</h2>
					<p class="canvas-desc">{selected.description}</p>
				</div>
				{#if editable.length > 0}
					<button
						class="edit-btn"
						class:edit-btn--active={editorOpen}
						onclick={() => (editorOpen = !editorOpen)}
					>
						<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
							<path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
						</svg>
						{editorOpen ? 'Editing' : 'Customize'}
					</button>
				{/if}
			</div>
			<div class="canvas-stage" style={editorStyle()}>
				{#await selected.load()}
					<div class="loading">Loading…</div>
				{:then mod}
					{@const Comp = mod.default}
					<Comp {...(selected.defaultProps ?? {})} />
				{:catch err}
					<div class="error">Failed to load: {err.message}</div>
				{/await}
			</div>
		</section>
	</div>

	<ComponentEditor
		componentName={selected.name}
		props={editable}
		values={editorState}
		open={editorOpen}
		canUndo={canUndo}
		canRedo={canRedo}
		presets={sortedPresets}
		activePresetName={activePresetName}
		onclose={() => (editorOpen = false)}
		onreset={resetProp}
		onresetAll={resetAll}
		oncopyCss={copyCss}
		onundo={undo}
		onredo={redo}
		onsavePreset={savePreset}
		onloadPreset={loadPreset}
		onremovePreset={removePreset}
		onfavPreset={favPreset}
	/>
</div>

<style>
	.playground-page {
		position: relative;
		min-height: 100vh;
		background: var(--surface);
		transition: background 400ms var(--ease-apple);
	}

	/* Subtle ambient glow — neutral with one electric hint */
	.playground-page::before {
		content: '';
		position: fixed;
		inset: 0;
		background:
			radial-gradient(ellipse at 20% -10%, color-mix(in srgb, var(--accent) 5%, transparent) 0%, transparent 55%),
			radial-gradient(ellipse at 80% 100%, color-mix(in srgb, var(--accent) 3%, transparent) 0%, transparent 50%);
		pointer-events: none;
		z-index: 0;
	}

	.playground-page--dark::before {
		background:
			radial-gradient(ellipse at 20% -10%, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 55%),
			radial-gradient(ellipse at 80% 100%, color-mix(in srgb, var(--accent) 5%, transparent) 0%, transparent 50%);
	}

	/* Single electric accent stripe — not a rainbow */
	.accent-bar {
		height: 2px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			var(--accent) 50%,
			transparent 100%
		);
		opacity: 0.6;
		position: sticky;
		top: 0;
		z-index: 50;
	}

	.container {
		position: relative;
		z-index: 1;
		max-width: 72rem;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.back-link {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--text-tertiary);
		text-decoration: none;
		transition: color 200ms;
	}

	.back-link:hover {
		color: var(--text-secondary);
	}

	.title {
		font-size: 1.875rem;
		font-weight: 700;
		letter-spacing: -0.025em;
		color: var(--text-primary);
		margin-top: 0.25rem;
	}

	.subtitle {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		margin-top: 0.25rem;
	}

	/* iOS-style theme toggle (icon button) */
	.theme-toggle {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.125rem;
		background: var(--surface-card);
		border: 1px solid var(--border-subtle);
		border-radius: 50%;
		cursor: pointer;
		color: var(--text-secondary);
		box-shadow: var(--shadow-sm);
		transition: all 250ms var(--ease-apple);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}

	.theme-toggle:active,
	.theme-toggle:hover {
		background: var(--surface-card-hover);
		color: var(--accent);
		box-shadow: var(--shadow-sm), var(--accent-glow);
	}

	/* ── Glass panel ── */
	.panel {
		position: relative;
		background: var(--surface-card);
		backdrop-filter: blur(24px) saturate(1.4);
		-webkit-backdrop-filter: blur(24px) saturate(1.4);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-xl);
		padding: 1.25rem 1.5rem;
		box-shadow: var(--shadow-lg);
	}

	.panel::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%);
		pointer-events: none;
	}

	.selector-panel {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
	}

	.category-row {
		display: flex;
		gap: 0.25rem;
		padding: 0.25rem;
		background: var(--border-subtle);
		border-radius: 12px;
		flex-wrap: wrap;
	}

	.cat-pill {
		padding: 0.5rem 0.875rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-secondary);
		background: transparent;
		border: none;
		border-radius: 9px;
		cursor: pointer;
		transition: all 200ms var(--ease-apple);
	}

	.cat-pill:active,
	.cat-pill:hover {
		color: var(--text-primary);
	}

	.cat-pill--active {
		background: var(--surface-warm);
		color: var(--accent);
		font-weight: 600;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 12px color-mix(in srgb, var(--accent) 20%, transparent);
	}

	.picker-row {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.picker {
		flex: 1;
		padding: 0.625rem 0.875rem;
		font-size: 0.875rem;
		color: var(--text-primary);
		background: var(--surface-warm);
		border: 1px solid var(--border-subtle);
		border-radius: 10px;
		outline: none;
		font-family: inherit;
		cursor: pointer;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238C857D' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.75rem center;
		padding-right: 2rem;
		transition: all 200ms var(--ease-apple);
	}

	.picker:focus {
		border-color: var(--accent);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent);
	}

	.count {
		font-size: 0.75rem;
		color: var(--text-tertiary);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	/* ── Canvas ── */
	.canvas-panel {
		padding: 1.5rem;
	}

	.canvas-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 1.25rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border-subtle);
	}

	.canvas-label {
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-tertiary);
	}

	.canvas-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-top: 0.25rem;
	}

	.canvas-desc {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		margin-top: 0.25rem;
	}

	.edit-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.875rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		background: var(--surface-warm);
		border: 1px solid var(--border-subtle);
		border-radius: 9999px;
		cursor: pointer;
		transition: all 250ms var(--ease-apple);
		flex-shrink: 0;
	}

	.edit-btn:active,
	.edit-btn:hover {
		color: var(--accent);
		border-color: var(--accent);
		box-shadow: var(--accent-glow);
	}

	.edit-btn--active {
		color: var(--accent);
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 10%, var(--surface-warm));
		box-shadow: var(--accent-glow);
	}

	.canvas-stage {
		position: relative;
		min-height: 280px;
		padding: 1.5rem;
		background: var(--surface-warm);
		border: 1px dashed var(--border-medium);
		border-radius: var(--radius-lg);
		overflow: hidden;
		/* Perf agent: paint isolation reduces repaint cost ~50-70% */
		contain: layout style paint;
		/* Force GPU layer for backdrop-filter children */
		transform: translateZ(0);
		will-change: contents;
	}

	.loading,
	.error {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		font-size: 0.875rem;
		color: var(--text-tertiary);
	}

	.error {
		color: var(--red);
	}

	@media (max-width: 768px) {
		.container { padding: 1rem; }
		.title { font-size: 1.5rem; }
		.picker-row { flex-direction: column; align-items: stretch; }
		.canvas-header { flex-direction: column; }
	}
</style>
