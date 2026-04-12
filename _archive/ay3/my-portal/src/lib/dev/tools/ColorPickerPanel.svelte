<script lang="ts">
	import type { ShowcaseEntry, EditableProp } from '$lib/dev/types';
	import type { ToolContext } from '$lib/dev/workspace/types';
	import { getValues } from '$lib/dev/workspaces/components.values.svelte';

	type Props = { subject: ShowcaseEntry; ctx: ToolContext };
	let { subject, ctx }: Props = $props();

	const values = $derived(getValues(subject));
	const colorProps = $derived(
		(subject.editableProps ?? []).filter((p): p is EditableProp => p.type === 'color')
	);

	// Default to first color prop
	let activePropId = $state<string>('');
	$effect(() => {
		if (!activePropId && colorProps.length > 0) {
			activePropId = colorProps[0].id;
		}
	});

	const activeProp = $derived(colorProps.find((p) => p.id === activePropId) ?? colorProps[0]);
	const currentColor = $derived(
		activeProp ? (values[activeProp.id] as string) : '#00C2FF'
	);

	// Electric accent palette — bright neon swatches optimized for glows/accents
	const swatches = [
		{ name: 'Cyan',    value: '#00C2FF' },
		{ name: 'Mint',    value: '#00FF94' },
		{ name: 'Amber',   value: '#FFB020' },
		{ name: 'Violet',  value: '#C77DFF' },
		{ name: 'Teal',    value: '#00E5D5' },
		{ name: 'Indigo',  value: '#7B7FFF' },
		{ name: 'Magenta', value: '#FF3D9A' },
		{ name: 'Red',     value: '#FF4060' },
		{ name: 'Lime',    value: '#B3FF00' },
		{ name: 'Sky',     value: '#5AC8FA' },
		{ name: 'Pink',    value: '#FF6FB5' },
		{ name: 'Orange',  value: '#FF9500' }
	];

	function setColor(hex: string) {
		if (!activeProp) return;
		values[activeProp.id] = hex;
	}
</script>

<div class="picker">
	<header class="picker__header">
		<div>
			<div class="picker__eyebrow">Color</div>
			<h3 class="picker__title">{subject.name}</h3>
		</div>
	</header>

	{#if colorProps.length > 1}
		<div class="prop-tabs" role="tablist" aria-label="Color properties">
			{#each colorProps as p (p.id)}
				<button
					class="prop-tab"
					class:prop-tab--active={activePropId === p.id}
					onclick={() => (activePropId = p.id)}
					role="tab"
					aria-selected={activePropId === p.id}
					type="button"
				>
					<span class="prop-tab__dot" style="background: {values[p.id]}"></span>
					{p.label}
				</button>
			{/each}
		</div>
	{/if}

	<!-- Big preview -->
	<div class="preview" style="--c: {currentColor}">
		<div class="preview__chip"></div>
		<div class="preview__meta">
			<div class="preview__hex">{currentColor.toUpperCase()}</div>
			<div class="preview__label">{activeProp?.label ?? ''}</div>
		</div>
	</div>

	<!-- Big swatch grid — thumb-friendly -->
	<div class="swatches" role="listbox" aria-label="Color swatches">
		{#each swatches as sw (sw.value)}
			<button
				class="swatch"
				class:swatch--active={currentColor.toUpperCase() === sw.value.toUpperCase()}
				style="--sw: {sw.value}"
				onclick={() => setColor(sw.value)}
				title={sw.name}
				aria-label={sw.name}
				type="button"
			></button>
		{/each}
	</div>

	<!-- Hex + native picker row -->
	<div class="input-row">
		<input
			type="text"
			class="hex-input"
			value={currentColor}
			maxlength="7"
			placeholder="#RRGGBB"
			oninput={(e) => {
				const v = (e.target as HTMLInputElement).value;
				if (/^#[0-9A-Fa-f]{6}$/.test(v)) setColor(v);
			}}
			aria-label="Hex color"
		/>
		<label class="native">
			<input
				type="color"
				value={currentColor}
				oninput={(e) => setColor((e.target as HTMLInputElement).value)}
				aria-label="Native color picker"
			/>
			<span>Picker</span>
		</label>
	</div>

	<button class="exit" onclick={() => ctx.exit()} type="button">Done</button>
</div>

<style>
	.picker {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 16px 18px 24px;
		height: 100%;
		overflow-y: auto;
	}
	.picker__header { padding-bottom: 4px; }
	.picker__eyebrow {
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: rgba(0, 0, 0, 0.45);
		font-weight: 600;
	}
	.picker__title {
		margin: 2px 0 0;
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: rgba(0, 0, 0, 0.85);
	}

	.prop-tabs {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}
	.prop-tab {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 10px;
		font-size: 0.6875rem;
		font-weight: 500;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.04);
		border: 1px solid rgba(0, 0, 0, 0.06);
		color: rgba(0, 0, 0, 0.65);
		cursor: pointer;
		transition: all 160ms;
	}
	.prop-tab--active {
		background: white;
		color: rgba(0, 0, 0, 0.9);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
	}
	.prop-tab__dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
	}

	.preview {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px;
		border-radius: 16px;
		background: rgba(0, 0, 0, 0.03);
		border: 1px solid rgba(0, 0, 0, 0.05);
	}
	.preview__chip {
		width: 56px;
		height: 56px;
		border-radius: 14px;
		background: var(--c);
		box-shadow:
			0 0 0 1px rgba(0, 0, 0, 0.08),
			0 8px 24px -8px var(--c),
			inset 0 1px 0 rgba(255, 255, 255, 0.4);
	}
	.preview__hex {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.9375rem;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.85);
		letter-spacing: 0.02em;
	}
	.preview__label {
		font-size: 0.6875rem;
		color: rgba(0, 0, 0, 0.5);
		margin-top: 2px;
	}

	.swatches {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 10px;
	}
	.swatch {
		aspect-ratio: 1 / 1;
		border-radius: 12px;
		background: var(--sw);
		border: none;
		cursor: pointer;
		position: relative;
		box-shadow:
			0 0 0 1px rgba(0, 0, 0, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.4);
		transition: transform 180ms cubic-bezier(0.32, 0.72, 0, 1), box-shadow 180ms;
		min-height: 44px;
	}
	.swatch:hover { transform: scale(1.06); }
	.swatch:active { transform: scale(0.94); }
	.swatch--active {
		box-shadow:
			0 0 0 2px white,
			0 0 0 4px var(--sw),
			0 0 24px -4px var(--sw);
	}

	.input-row {
		display: flex;
		gap: 8px;
		align-items: stretch;
	}
	.hex-input {
		flex: 1;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.875rem;
		padding: 12px 14px;
		border-radius: 12px;
		background: rgba(0, 0, 0, 0.03);
		border: 1px solid rgba(0, 0, 0, 0.06);
		color: rgba(0, 0, 0, 0.85);
		min-width: 0;
		text-transform: uppercase;
	}
	.native {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 0 14px;
		border-radius: 12px;
		background: rgba(0, 0, 0, 0.04);
		border: 1px solid rgba(0, 0, 0, 0.06);
		font-size: 0.75rem;
		color: rgba(0, 0, 0, 0.65);
		cursor: pointer;
		overflow: hidden;
		position: relative;
	}
	.native input[type='color'] {
		position: absolute;
		inset: -8px;
		width: calc(100% + 16px);
		height: calc(100% + 16px);
		border: none;
		background: none;
		cursor: pointer;
		opacity: 0;
	}

	.exit {
		margin-top: 4px;
		padding: 14px;
		border-radius: 14px;
		background: rgba(0, 0, 0, 0.85);
		color: white;
		border: none;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: transform 140ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.exit:active { transform: scale(0.98); }
</style>
