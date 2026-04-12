<script lang="ts">
	import type { EditableProp, EditableSection } from './types';
	import type { Preset } from './presets';

	type Props = {
		componentName: string;
		props: readonly EditableProp[];
		values: Record<string, string | number | boolean>;
		open: boolean;
		canUndo: boolean;
		canRedo: boolean;
		presets: readonly Preset[];
		activePresetName: string | null;
		onclose: () => void;
		onreset: (id: string) => void;
		onresetAll: () => void;
		oncopyCss: () => void;
		onundo: () => void;
		onredo: () => void;
		onsavePreset: (name: string) => void;
		onloadPreset: (name: string) => void;
		onremovePreset: (name: string) => void;
		onfavPreset: (name: string) => void;
	};

	let {
		componentName,
		props: editable,
		values,
		open,
		canUndo,
		canRedo,
		presets,
		activePresetName,
		onclose,
		onreset,
		onresetAll,
		oncopyCss,
		onundo,
		onredo,
		onsavePreset,
		onloadPreset,
		onremovePreset,
		onfavPreset
	}: Props = $props();

	// Save dialog state
	let showSaveDialog = $state(false);
	let saveDialogName = $state('');

	function openSaveDialog() {
		saveDialogName = activePresetName ?? '';
		showSaveDialog = true;
	}

	function confirmSave() {
		if (saveDialogName.trim()) {
			onsavePreset(saveDialogName.trim());
			showSaveDialog = false;
			saveDialogName = '';
		}
	}

	// Group props by section
	const grouped = $derived(() => {
		const map = new Map<EditableSection, EditableProp[]>();
		for (const p of editable) {
			if (!map.has(p.section)) map.set(p.section, []);
			map.get(p.section)!.push(p);
		}
		return Array.from(map.entries());
	});

	// Electric accent swatches — bright neon colors for accents/glows/outlines
	const swatches = [
		{ name: 'Cyan',    value: '#00C2FF' },
		{ name: 'Mint',    value: '#00FF94' },
		{ name: 'Amber',   value: '#FFB020' },
		{ name: 'Violet',  value: '#C77DFF' },
		{ name: 'Teal',    value: '#00E5D5' },
		{ name: 'Indigo',  value: '#7B7FFF' },
		{ name: 'Magenta', value: '#FF3D9A' },
		{ name: 'Red',     value: '#FF4060' }
	];
</script>

<!-- Backdrop -->
{#if open}
	<button
		class="editor-backdrop"
		aria-label="Close editor"
		onclick={onclose}
	></button>
{/if}

<aside class="editor" class:editor--open={open} aria-hidden={!open}>
	<div class="editor__handle" aria-hidden="true"></div>

	<header class="editor__header">
		<div class="editor__title">
			<div class="editor__eyebrow">Customizing</div>
			<h3>{componentName}</h3>
		</div>
		<button class="icon-btn icon-btn--close" onclick={onclose} title="Close" aria-label="Close editor">
			<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
				<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854z"/>
			</svg>
		</button>
	</header>

	<div class="editor__toolbar">
		<button class="tool-btn" onclick={onundo} disabled={!canUndo} title="Undo" aria-label="Undo">
			<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
				<path d="M5.828 4H10.5a3.5 3.5 0 0 1 0 7H5v1h5.5a4.5 4.5 0 0 0 0-9H5.828l1.96-1.96a.5.5 0 0 0-.707-.708l-2.83 2.83a.5.5 0 0 0 0 .708l2.83 2.83a.5.5 0 1 0 .707-.708L5.828 4z"/>
			</svg>
			Undo
		</button>
		<button class="tool-btn" onclick={onredo} disabled={!canRedo} title="Redo" aria-label="Redo">
			<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
				<path d="M10.172 4H5.5a4.5 4.5 0 1 0 0 9H11v-1H5.5a3.5 3.5 0 1 1 0-7h4.672l-1.96 1.96a.5.5 0 1 0 .708.708l2.83-2.83a.5.5 0 0 0 0-.708l-2.83-2.83a.5.5 0 0 0-.708.708L10.172 4z"/>
			</svg>
			Redo
		</button>
		<div class="tool-spacer"></div>
		<button class="tool-btn tool-btn--save" onclick={openSaveDialog} title="Save preset">
			<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
				<path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4.5L11.5 1H2zm0 1h9.5L14 4.5V14H2V2zm5 1v3h4V3H7zm0 5v6h6V8H7z"/>
			</svg>
			Save
		</button>
		<button class="tool-btn" onclick={oncopyCss} title="Copy CSS">
			<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
				<path d="M5 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H7zM2 5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2z"/>
			</svg>
			Copy
		</button>
		<button class="tool-btn tool-btn--danger" onclick={onresetAll} title="Reset all">
			<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
				<path d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
				<path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
			</svg>
			Reset
		</button>
	</div>

	{#if presets.length > 0}
		<div class="presets-strip">
			<div class="presets-strip__label">PRESETS</div>
			<div class="presets-strip__row">
				{#each presets as preset (preset.name)}
					<div
						class="preset-chip"
						class:preset-chip--active={activePresetName === preset.name}
					>
						<button
							class="preset-chip__fav"
							class:preset-chip__fav--on={preset.fav}
							onclick={() => onfavPreset(preset.name)}
							title={preset.fav ? 'Unfavorite' : 'Favorite'}
							aria-label={preset.fav ? `Unfavorite ${preset.name}` : `Favorite ${preset.name}`}
						>
							{preset.fav ? '★' : '☆'}
						</button>
						<button
							class="preset-chip__name"
							onclick={() => onloadPreset(preset.name)}
							title="Load preset"
						>
							{preset.name}
						</button>
						<button
							class="preset-chip__del"
							onclick={() => onremovePreset(preset.name)}
							title="Delete preset"
							aria-label="Delete preset {preset.name}"
						>
							×
						</button>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="editor__body">
		{#if editable.length === 0}
			<div class="editor__empty">
				<p>No editable properties for this component yet.</p>
				<p class="editor__empty-hint">Editor support is being added incrementally.</p>
			</div>
		{:else}
			{#each grouped() as [section, items]}
				<section class="editor__section">
					<h4 class="editor__section-title">{section}</h4>
					{#each items as p}
						<div class="control">
							<div class="control__header">
								<label class="control__label" for="ctrl-{p.id}">{p.label}</label>
								<button
									class="control__reset"
									onclick={() => onreset(p.id)}
									title="Reset {p.label}"
									aria-label="Reset {p.label}"
								>
									↻
								</button>
							</div>

							{#if p.type === 'color'}
								<!-- Big preview rectangle -->
								<div
									class="color-preview"
									style="--prev: {values[p.id]};"
								>
									<span class="color-preview__hex">{values[p.id]}</span>
								</div>
								<!-- Bigger 4×2 swatch grid -->
								<div class="swatch-grid swatch-grid--big">
									{#each swatches as sw}
										<button
											class="swatch"
											class:swatch--active={values[p.id] === sw.value}
											style="--sw: {sw.value};"
											onclick={() => (values[p.id] = sw.value)}
											title={sw.name}
											aria-label={sw.name}
										></button>
									{/each}
								</div>
								<!-- Hex input + native picker -->
								<div class="color-input-row">
									<input
										id="ctrl-{p.id}"
										type="text"
										class="hex-input"
										value={values[p.id]}
										maxlength="7"
										placeholder="#RRGGBB"
										oninput={(e) => {
											const v = (e.target as HTMLInputElement).value;
											if (/^#[0-9A-Fa-f]{6}$/.test(v)) values[p.id] = v;
										}}
										aria-label="Hex color value"
									/>
									<label class="native-picker" title="Open native picker">
										<input
											type="color"
											value={values[p.id]}
											oninput={(e) => (values[p.id] = (e.target as HTMLInputElement).value)}
											aria-label="Native color picker"
										/>
										<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
											<path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
										</svg>
									</label>
								</div>
							{:else if p.type === 'slider'}
								<div class="slider-row">
									{#if p.live === false}
										<!-- Expensive prop: apply on release only (perf agent: backdrop-filter, shadow blur, saturation) -->
										<input
											id="ctrl-{p.id}"
											type="range"
											class="slider"
											min={p.min ?? 0}
											max={p.max ?? 100}
											step={p.step ?? 1}
											value={values[p.id]}
											onchange={(e) => (values[p.id] = Number((e.target as HTMLInputElement).value))}
											aria-label="{p.label} (applies on release)"
										/>
									{:else}
										<!-- Cheap prop: live drag -->
										<input
											id="ctrl-{p.id}"
											type="range"
											class="slider"
											min={p.min ?? 0}
											max={p.max ?? 100}
											step={p.step ?? 1}
											value={values[p.id]}
											oninput={(e) => (values[p.id] = Number((e.target as HTMLInputElement).value))}
										/>
									{/if}
									<span class="slider-value">
										{values[p.id]}{p.unit ?? ''}
										{#if p.live === false}<span class="slider-flag" title="Applies on release for performance">·</span>{/if}
									</span>
								</div>
							{:else if p.type === 'toggle'}
								<button
									id="ctrl-{p.id}"
									class="ios-toggle"
									class:ios-toggle--on={values[p.id]}
									onclick={() => (values[p.id] = !values[p.id])}
									role="switch"
									aria-checked={values[p.id] === true}
								>
									<span class="ios-toggle__thumb"></span>
								</button>
							{:else if p.type === 'select' && p.options}
								<select
									id="ctrl-{p.id}"
									class="select"
									value={values[p.id]}
									onchange={(e) => (values[p.id] = (e.target as HTMLSelectElement).value)}
								>
									{#each p.options as opt}
										<option value={opt.value}>{opt.label}</option>
									{/each}
								</select>
							{/if}
						</div>
					{/each}
				</section>
			{/each}
		{/if}
	</div>
</aside>

{#if showSaveDialog}
	<div
		class="save-dialog-backdrop"
		role="presentation"
		onclick={() => (showSaveDialog = false)}
	>
		<div
			class="save-dialog"
			role="dialog"
			aria-modal="true"
			aria-labelledby="save-dialog-title"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => {
				if (e.key === 'Escape') showSaveDialog = false;
				if (e.key === 'Enter') confirmSave();
			}}
		>
			<h3 id="save-dialog-title" class="save-dialog__title">Save Preset</h3>
			<p class="save-dialog__desc">Name this configuration to recall it later.</p>
			<input
				type="text"
				class="save-dialog__input"
				placeholder="e.g. Electric Cyan"
				bind:value={saveDialogName}
			/>
			<div class="save-dialog__actions">
				<button class="save-dialog__btn" onclick={() => (showSaveDialog = false)}>Cancel</button>
				<button
					class="save-dialog__btn save-dialog__btn--primary"
					onclick={confirmSave}
					disabled={!saveDialogName.trim()}
				>
					Save
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* ── Backdrop ── */
	.editor-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border: none;
		cursor: pointer;
		z-index: 80;
		animation: fadeIn 250ms var(--ease-apple);
	}

	/* ── Editor — Mobile: full-screen takeover sheet ── */
	.editor {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		top: 5vh;                       /* Almost full height */
		background: var(--surface);
		border-top: 1px solid var(--border-medium);
		border-radius: 28px 28px 0 0;
		box-shadow:
			0 -16px 64px rgba(0, 0, 0, 0.55),
			0 0 0 1px color-mix(in srgb, var(--accent) 20%, transparent),
			0 -2px 32px color-mix(in srgb, var(--accent) 12%, transparent);
		transform: translateY(100%);
		transition: transform 400ms var(--ease-apple);
		z-index: 90;
		display: flex;
		flex-direction: column;
		padding-bottom: env(safe-area-inset-bottom);
		overflow: hidden;
	}

	.editor--open {
		transform: translateY(0);
	}

	.editor::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%);
		opacity: 0.7;
		pointer-events: none;
	}

	/* Drag handle */
	.editor__handle {
		width: 44px;
		height: 5px;
		background: var(--border-medium);
		border-radius: 3px;
		margin: 10px auto 6px;
		flex-shrink: 0;
	}

	.editor__header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		padding: 0.5rem 1.5rem 1rem;
		border-bottom: 1px solid var(--border-subtle);
		flex-shrink: 0;
	}

	.editor__title {
		flex: 1;
		min-width: 0;
	}

	.editor__eyebrow {
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--accent);
	}

	.editor__title h3 {
		font-size: 1.375rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-top: 0.125rem;
		letter-spacing: -0.01em;
	}

	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		background: transparent;
		border: none;
		border-radius: 12px;
		color: var(--text-secondary);
		cursor: pointer;
		flex-shrink: 0;
		transition: all 200ms var(--ease-apple);
	}

	.icon-btn:active,
	.icon-btn:hover {
		background: var(--border-subtle);
		color: var(--text-primary);
	}

	.icon-btn--close {
		color: var(--text-tertiary);
	}

	/* ── Toolbar — Undo/Redo/Copy/Reset ── */
	.editor__toolbar {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.75rem 1.25rem;
		border-bottom: 1px solid var(--border-subtle);
		flex-shrink: 0;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	.tool-spacer {
		flex: 1;
	}

	.tool-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.875rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		background: var(--surface-card);
		border: 1px solid var(--border-subtle);
		border-radius: 9999px;
		cursor: pointer;
		flex-shrink: 0;
		transition: all 200ms var(--ease-apple);
	}

	.tool-btn:active,
	.tool-btn:hover:not(:disabled) {
		color: var(--accent);
		border-color: var(--accent);
		box-shadow: 0 0 12px color-mix(in srgb, var(--accent) 30%, transparent);
	}

	.tool-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.tool-btn--danger:active,
	.tool-btn--danger:hover {
		color: #FF4060;
		border-color: #FF4060;
		box-shadow: 0 0 12px rgba(255, 64, 96, 0.3);
	}

	.tool-btn--save {
		color: var(--accent);
		border-color: color-mix(in srgb, var(--accent) 40%, transparent);
	}

	/* ── Presets strip ── */
	.presets-strip {
		padding: 0.75rem 1.25rem;
		border-bottom: 1px solid var(--border-subtle);
		flex-shrink: 0;
	}

	.presets-strip__label {
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-tertiary);
		margin-bottom: 0.5rem;
	}

	.presets-strip__row {
		display: flex;
		gap: 0.5rem;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		padding-bottom: 0.25rem;
	}

	.presets-strip__row::-webkit-scrollbar { display: none; }

	.preset-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.375rem 0.25rem 0.5rem;
		background: var(--surface-card);
		border: 1px solid var(--border-subtle);
		border-radius: 9999px;
		flex-shrink: 0;
		transition: all 200ms var(--ease-apple);
	}

	.preset-chip--active {
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 10%, var(--surface-card));
		box-shadow: 0 0 12px color-mix(in srgb, var(--accent) 25%, transparent);
	}

	.preset-chip__fav,
	.preset-chip__del {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 22px;
		height: 22px;
		background: transparent;
		border: none;
		border-radius: 50%;
		color: var(--text-tertiary);
		cursor: pointer;
		font-size: 0.875rem;
		line-height: 1;
		transition: all 150ms var(--ease-apple);
	}

	.preset-chip__fav--on {
		color: #FFB020;
	}

	.preset-chip__fav:hover,
	.preset-chip__del:hover {
		background: var(--border-subtle);
		color: var(--text-primary);
	}

	.preset-chip__del:hover {
		color: #FF4060;
	}

	.preset-chip__name {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-primary);
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0.25rem 0.25rem;
		font-family: inherit;
	}

	/* ── Big color preview ── */
	.color-preview {
		position: relative;
		width: 100%;
		height: 72px;
		background: var(--prev);
		border-radius: 14px;
		border: 1px solid var(--border-subtle);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.15),
			0 2px 8px rgba(0, 0, 0, 0.18),
			0 0 24px color-mix(in srgb, var(--prev) 35%, transparent);
		margin-bottom: 0.625rem;
		display: flex;
		align-items: flex-end;
		padding: 0.625rem 0.75rem;
	}

	.color-preview__hex {
		font-family: 'SF Mono', ui-monospace, monospace;
		font-size: 0.6875rem;
		font-weight: 700;
		text-transform: uppercase;
		color: white;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
		letter-spacing: 0.05em;
	}

	.swatch-grid--big {
		grid-template-columns: repeat(4, 1fr);
		gap: 10px;
	}

	.swatch-grid--big .swatch {
		border-radius: 12px;
		min-height: 44px;
	}

	/* ── Hex input row ── */
	.color-input-row {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		margin-top: 0.625rem;
	}

	.hex-input {
		flex: 1;
		padding: 0.5rem 0.75rem;
		font-family: 'SF Mono', ui-monospace, monospace;
		font-size: 0.8125rem;
		font-weight: 600;
		text-transform: uppercase;
		color: var(--text-primary);
		background: var(--surface-card);
		border: 1px solid var(--border-subtle);
		border-radius: 10px;
		outline: none;
		letter-spacing: 0.05em;
		transition: all 200ms var(--ease-apple);
	}

	.hex-input:focus {
		border-color: var(--accent);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent);
	}

	.native-picker {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: var(--surface-card);
		border: 1px solid var(--border-subtle);
		border-radius: 10px;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 200ms var(--ease-apple);
		flex-shrink: 0;
	}

	.native-picker:hover {
		color: var(--accent);
		border-color: var(--accent);
	}

	.native-picker input[type="color"] {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
		pointer-events: none;
	}

	/* ── Save dialog ── */
	.save-dialog-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.65);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		animation: fadeIn 200ms var(--ease-apple);
	}

	.save-dialog {
		width: 90%;
		max-width: 380px;
		background: var(--surface);
		border: 1px solid color-mix(in srgb, var(--accent) 30%, var(--border-medium));
		border-radius: 20px;
		padding: 1.5rem;
		box-shadow:
			0 24px 64px rgba(0, 0, 0, 0.55),
			0 0 32px color-mix(in srgb, var(--accent) 25%, transparent);
		animation: dialogPop 250ms var(--ease-apple);
	}

	.save-dialog__title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 0.25rem;
	}

	.save-dialog__desc {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}

	.save-dialog__input {
		width: 100%;
		padding: 0.75rem 1rem;
		font-size: 0.9375rem;
		color: var(--text-primary);
		background: var(--surface-card);
		border: 1px solid var(--border-medium);
		border-radius: 12px;
		outline: none;
		font-family: inherit;
		margin-bottom: 1rem;
	}

	.save-dialog__input:focus {
		border-color: var(--accent);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent);
	}

	.save-dialog__actions {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
	}

	.save-dialog__btn {
		padding: 0.625rem 1.25rem;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--text-secondary);
		background: transparent;
		border: 1px solid var(--border-medium);
		border-radius: 9999px;
		cursor: pointer;
		font-family: inherit;
		transition: all 200ms var(--ease-apple);
	}

	.save-dialog__btn:hover {
		color: var(--text-primary);
		border-color: var(--text-secondary);
	}

	.save-dialog__btn--primary {
		color: var(--surface);
		background: var(--accent);
		border-color: var(--accent);
		box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 40%, transparent);
	}

	.save-dialog__btn--primary:hover {
		filter: brightness(1.1);
		color: var(--surface);
	}

	.save-dialog__btn--primary:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		filter: none;
	}

	@keyframes dialogPop {
		from { opacity: 0; transform: translateY(8px) scale(0.96); }
		to { opacity: 1; transform: translateY(0) scale(1); }
	}

	.editor__body {
		flex: 1;
		overflow-y: auto;
		padding: 1rem 1.25rem 1.5rem;
		-webkit-overflow-scrolling: touch;
	}

	.editor__empty {
		text-align: center;
		padding: 2rem 0;
		color: var(--text-tertiary);
		font-size: 0.875rem;
	}

	.editor__empty-hint {
		font-size: 0.75rem;
		margin-top: 0.5rem;
	}

	.editor__section {
		margin-bottom: 1.5rem;
	}

	.editor__section-title {
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-tertiary);
		margin-bottom: 0.625rem;
	}

	/* ── Control rows ── */
	.control {
		margin-bottom: 1rem;
	}

	.control__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.control__label {
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-primary);
	}

	.control__reset {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		border-radius: 6px;
		color: var(--text-tertiary);
		cursor: pointer;
		font-size: 0.875rem;
		transition: all 200ms var(--ease-apple);
	}

	.control__reset:active,
	.control__reset:hover {
		background: var(--border-subtle);
		color: var(--text-primary);
	}

	/* ── Color swatches ── */
	.swatch-grid {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		gap: 8px;
		margin-bottom: 0.625rem;
	}

	.swatch {
		aspect-ratio: 1;
		background: var(--sw);
		border: 2px solid transparent;
		border-radius: 10px;
		cursor: pointer;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
		transition: all 200ms var(--ease-apple);
	}

	.swatch:active {
		transform: scale(0.92);
	}

	.swatch--active {
		border-color: white;
		box-shadow: 0 0 0 2px var(--sw), 0 4px 12px rgba(0, 0, 0, 0.18);
		transform: scale(1.05);
	}


	/* ── iOS Slider ── */
	.slider-row {
		display: flex;
		align-items: center;
		gap: 0.875rem;
	}

	.slider {
		flex: 1;
		appearance: none;
		-webkit-appearance: none;
		height: 4px;
		background: var(--border-medium);
		border-radius: 2px;
		outline: none;
		cursor: pointer;
		padding: 12px 0;
		background-clip: content-box;
	}

	.slider::-webkit-slider-thumb {
		appearance: none;
		-webkit-appearance: none;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: white;
		border: none;
		cursor: grab;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 0 0 0.5px rgba(0, 0, 0, 0.04);
		transition: box-shadow 200ms var(--ease-apple), transform 100ms var(--ease-apple);
	}

	.slider::-webkit-slider-thumb:active {
		transform: scale(1.1);
		box-shadow: 0 4px 16px rgba(0, 122, 255, 0.30);
	}

	.slider::-moz-range-thumb {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: white;
		border: none;
		cursor: grab;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	.slider-value {
		font-size: 0.75rem;
		font-family: 'SF Mono', ui-monospace, monospace;
		color: var(--text-secondary);
		min-width: 56px;
		text-align: right;
		font-variant-numeric: tabular-nums;
		display: inline-flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.25rem;
	}

	.slider-flag {
		color: var(--accent);
		font-weight: 700;
	}

	/* ── iOS Toggle ── */
	.ios-toggle {
		position: relative;
		width: 52px;
		height: 32px;
		padding: 0;
		background: var(--border-medium);
		border: none;
		border-radius: 16px;
		cursor: pointer;
		transition: background 300ms var(--ease-apple);
	}

	.ios-toggle--on {
		background: #34C759;
	}

	.ios-toggle__thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 28px;
		height: 28px;
		background: white;
		border-radius: 50%;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
		transition: transform 300ms var(--ease-apple);
	}

	.ios-toggle--on .ios-toggle__thumb {
		transform: translateX(20px);
	}

	/* ── Select ── */
	.select {
		width: 100%;
		padding: 0.5rem 0.75rem;
		font-size: 0.8125rem;
		color: var(--text-primary);
		background: var(--surface-warm);
		border: 1px solid var(--border-subtle);
		border-radius: 10px;
		outline: none;
		font-family: inherit;
		cursor: pointer;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%236E6E73' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.75rem center;
		padding-right: 2rem;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	/* ── Desktop: centered modal ── */
	@media (min-width: 1024px) {
		.editor {
			top: 50%;
			left: 50%;
			right: auto;
			bottom: auto;
			width: 540px;
			max-height: 88vh;
			border-radius: 24px;
			border: 1px solid color-mix(in srgb, var(--accent) 25%, var(--border-medium));
			transform: translate(-50%, -50%) scale(0.96);
			opacity: 0;
		}

		.editor--open {
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}

		.editor__handle { display: none; }

		.editor::before {
			border-radius: 24px 24px 0 0;
		}
	}
</style>
