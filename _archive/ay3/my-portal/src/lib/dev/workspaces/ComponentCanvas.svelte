<script lang="ts">
	import type { ShowcaseEntry } from '$lib/dev/types';
	import { getValues } from './components.values.svelte';

	type Props = { subject: ShowcaseEntry | null };
	let { subject }: Props = $props();

	// Lazy-load the showcase component
	let LoadedComponent = $state<unknown>(null);
	let loadedFor = $state<string | null>(null);

	$effect(() => {
		if (!subject) {
			LoadedComponent = null;
			loadedFor = null;
			return;
		}
		const targetId = subject.id;
		void subject.load().then((m) => {
			if (loadedFor !== targetId) {
				LoadedComponent = m.default;
				loadedFor = targetId;
			}
		});
	});

	// Compose CSS variable string from current values
	const styleString = $derived.by(() => {
		if (!subject) return '';
		const values = getValues(subject);
		const parts: string[] = [];
		for (const p of subject.editableProps ?? []) {
			const v = values[p.id];
			parts.push(`${p.cssVar}: ${v}${typeof v === 'number' && p.unit ? p.unit : ''}`);
		}
		return parts.join('; ');
	});
</script>

<div class="canvas">
	{#if subject && LoadedComponent}
		{@const SC = LoadedComponent as ReturnType<typeof Object.assign>}
		<div class="canvas__stage" style={styleString}>
			<SC {...(subject.defaultProps ?? {})} />
		</div>
		<div class="canvas__caption">
			<span class="canvas__name">{subject.name}</span>
			<span class="canvas__desc">{subject.description}</span>
		</div>
	{:else if !subject}
		<div class="canvas__empty">Pick a component from the list →</div>
	{:else}
		<div class="canvas__empty">Loading…</div>
	{/if}
</div>

<style>
	.canvas {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 24px;
		padding: 48px 24px;
		min-height: 100%;
	}
	.canvas__stage {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 280px;
		min-height: 120px;
		padding: 32px;
		border-radius: 24px;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3));
		box-shadow: 0 20px 60px -30px rgba(0, 0, 0, 0.18);
	}
	.canvas__caption {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.canvas__name {
		font-size: 0.8125rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: rgba(0, 0, 0, 0.78);
	}
	.canvas__desc {
		font-size: 0.6875rem;
		color: rgba(0, 0, 0, 0.5);
	}
	.canvas__empty {
		color: rgba(0, 0, 0, 0.4);
		font-size: 0.875rem;
	}
</style>
