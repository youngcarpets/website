<script lang="ts">
	import type { EditableProp, EditableSection, ShowcaseEntry } from '$lib/dev/types';
	import type { ToolContext } from '$lib/dev/workspace/types';
	import { getValues, resetValue, resetAll } from '$lib/dev/workspaces/components.values.svelte';

	type Props = { subject: ShowcaseEntry; ctx: ToolContext };
	let { subject, ctx }: Props = $props();

	const values = $derived(getValues(subject));

	const grouped = $derived.by(() => {
		const map = new Map<EditableSection, EditableProp[]>();
		for (const p of subject.editableProps ?? []) {
			if (!map.has(p.section)) map.set(p.section, []);
			map.get(p.section)!.push(p);
		}
		return Array.from(map.entries());
	});
</script>

<div class="panel">
	<header class="panel__header">
		<div>
			<div class="panel__eyebrow">Inspector</div>
			<h3 class="panel__title">{subject.name}</h3>
		</div>
		<button
			class="reset-all"
			onclick={() => {
				resetAll(subject);
				ctx.notify('All props reset');
			}}
			title="Reset all props"
		>
			Reset all
		</button>
	</header>

	<div class="panel__body">
		{#each grouped as [section, items] (section)}
			<section class="group">
				<h4 class="group__title">{section}</h4>
				{#each items as p (p.id)}
					<div class="control">
						<div class="control__head">
							<label class="control__label" for="ctrl-{subject.id}-{p.id}">{p.label}</label>
							<button
								class="control__reset"
								onclick={() => resetValue(subject, p.id)}
								aria-label="Reset {p.label}"
								title="Reset"
							>
								↻
							</button>
						</div>

						{#if p.type === 'color'}
							<div class="color-row">
								<div class="color-swatch" style="background: {values[p.id]}"></div>
								<input
									id="ctrl-{subject.id}-{p.id}"
									type="text"
									class="hex-input"
									value={values[p.id] as string}
									maxlength="7"
									oninput={(e) => {
										const v = (e.target as HTMLInputElement).value;
										if (/^#[0-9A-Fa-f]{6}$/.test(v)) values[p.id] = v;
									}}
								/>
								<label class="native-color">
									<input
										type="color"
										value={values[p.id] as string}
										oninput={(e) => (values[p.id] = (e.target as HTMLInputElement).value)}
										aria-label="Native color picker"
									/>
								</label>
							</div>
						{:else if p.type === 'slider'}
							<div class="slider-row">
								<input
									id="ctrl-{subject.id}-{p.id}"
									type="range"
									class="slider"
									min={p.min ?? 0}
									max={p.max ?? 100}
									step={p.step ?? 1}
									value={values[p.id] as number}
									oninput={p.live === false
										? undefined
										: (e) => (values[p.id] = Number((e.target as HTMLInputElement).value))}
									onchange={p.live === false
										? (e) => (values[p.id] = Number((e.target as HTMLInputElement).value))
										: undefined}
								/>
								<span class="slider-val">{values[p.id]}{p.unit ?? ''}</span>
							</div>
						{:else if p.type === 'toggle'}
							<button
								id="ctrl-{subject.id}-{p.id}"
								class="ios-toggle"
								class:ios-toggle--on={values[p.id]}
								onclick={() => (values[p.id] = !values[p.id])}
								role="switch"
								aria-checked={values[p.id] === true}
								aria-label={p.label}
								type="button"
							>
								<span class="ios-toggle__thumb"></span>
							</button>
						{:else if p.type === 'select' && p.options}
							<select
								id="ctrl-{subject.id}-{p.id}"
								class="select"
								value={values[p.id]}
								onchange={(e) => (values[p.id] = (e.target as HTMLSelectElement).value)}
							>
								{#each p.options as opt (opt.value)}
									<option value={opt.value}>{opt.label}</option>
								{/each}
							</select>
						{/if}
					</div>
				{/each}
			</section>
		{/each}
	</div>
</div>

<style>
	.panel {
		display: flex;
		flex-direction: column;
		height: 100%;
		gap: 0;
	}
	.panel__header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		padding: 16px 18px 12px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
	}
	.panel__eyebrow {
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: rgba(0, 0, 0, 0.45);
		font-weight: 600;
	}
	.panel__title {
		margin: 2px 0 0;
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: rgba(0, 0, 0, 0.85);
	}
	.reset-all {
		font-size: 0.6875rem;
		font-weight: 500;
		padding: 6px 10px;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.04);
		border: 1px solid rgba(0, 0, 0, 0.06);
		color: rgba(0, 0, 0, 0.6);
		cursor: pointer;
		transition: background 140ms;
	}
	.reset-all:hover { background: rgba(0, 0, 0, 0.08); }

	.panel__body {
		padding: 12px 18px 24px;
		overflow-y: auto;
		flex: 1;
	}
	.group { margin-bottom: 18px; }
	.group__title {
		font-size: 0.625rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: rgba(0, 0, 0, 0.4);
		margin: 0 0 10px;
	}
	.control { margin-bottom: 14px; }
	.control__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 6px;
	}
	.control__label {
		font-size: 0.75rem;
		color: rgba(0, 0, 0, 0.7);
		font-weight: 500;
	}
	.control__reset {
		background: none;
		border: none;
		color: rgba(0, 0, 0, 0.35);
		cursor: pointer;
		font-size: 0.875rem;
		padding: 0 4px;
		border-radius: 4px;
	}
	.control__reset:hover { color: rgba(0, 0, 0, 0.7); }

	.color-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.color-swatch {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		border: 1px solid rgba(0, 0, 0, 0.08);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4);
	}
	.hex-input {
		flex: 1;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.75rem;
		padding: 8px 10px;
		border-radius: 8px;
		background: rgba(0, 0, 0, 0.03);
		border: 1px solid rgba(0, 0, 0, 0.06);
		color: rgba(0, 0, 0, 0.85);
		min-width: 0;
	}
	.native-color {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: rgba(0, 0, 0, 0.04);
		border: 1px solid rgba(0, 0, 0, 0.06);
		cursor: pointer;
		overflow: hidden;
	}
	.native-color input[type='color'] {
		width: 60px;
		height: 60px;
		border: none;
		background: none;
		cursor: pointer;
		transform: scale(1.5);
	}

	.slider-row {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.slider {
		flex: 1;
		appearance: none;
		height: 4px;
		background: rgba(0, 0, 0, 0.08);
		border-radius: 999px;
		outline: none;
	}
	.slider::-webkit-slider-thumb {
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.06);
		cursor: pointer;
	}
	.slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: white;
		border: none;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.06);
		cursor: pointer;
	}
	.slider-val {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.6875rem;
		color: rgba(0, 0, 0, 0.55);
		min-width: 44px;
		text-align: right;
	}

	.ios-toggle {
		width: 44px;
		height: 26px;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.12);
		border: none;
		position: relative;
		cursor: pointer;
		transition: background 200ms;
	}
	.ios-toggle--on { background: #34C759; }
	.ios-toggle__thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		transition: transform 220ms cubic-bezier(0.32, 0.72, 0, 1);
	}
	.ios-toggle--on .ios-toggle__thumb { transform: translateX(18px); }

	.select {
		width: 100%;
		padding: 8px 12px;
		border-radius: 8px;
		background: rgba(0, 0, 0, 0.03);
		border: 1px solid rgba(0, 0, 0, 0.06);
		font-size: 0.8125rem;
		color: rgba(0, 0, 0, 0.85);
	}
</style>
