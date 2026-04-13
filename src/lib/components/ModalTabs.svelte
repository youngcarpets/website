<script lang="ts">
	import { tick } from 'svelte';
	import type { Snippet } from 'svelte';

	type ModalTab = 'product' | 'install' | 'maintain';
	const tabs: { id: ModalTab; label: string }[] = [
		{ id: 'product', label: 'Product' },
		{ id: 'install', label: 'Installation' },
		{ id: 'maintain', label: 'Maintenance' }
	];

	interface Props {
		product: Snippet;
		install: Snippet;
		maintain: Snippet;
	}

	let { product, install, maintain }: Props = $props();
	let active: ModalTab = $state('product');
	let tablistEl: HTMLDivElement | undefined = $state();

	async function handleTabKeydown(e: KeyboardEvent, index: number) {
		let nextIndex: number | null = null;
		if (e.key === 'ArrowRight') {
			nextIndex = (index + 1) % tabs.length;
		} else if (e.key === 'ArrowLeft') {
			nextIndex = (index - 1 + tabs.length) % tabs.length;
		} else if (e.key === 'Home') {
			nextIndex = 0;
		} else if (e.key === 'End') {
			nextIndex = tabs.length - 1;
		}
		if (nextIndex !== null) {
			e.preventDefault();
			active = tabs[nextIndex]!.id;
			await tick();
			tablistEl?.querySelectorAll<HTMLElement>('[role="tab"]')[nextIndex]?.focus();
		}
	}
</script>

<div class="modal-tabs" role="tablist" aria-label="Product information" bind:this={tablistEl}>
	{#each tabs as t, i (t.id)}
		<button
			type="button"
			class="modal-tab"
			class:modal-tab--active={active === t.id}
			id="tab-{t.id}"
			role="tab"
			aria-selected={active === t.id}
			aria-controls="panel-{t.id}"
			tabindex={active === t.id ? 0 : -1}
			onclick={() => (active = t.id)}
			onkeydown={(e) => handleTabKeydown(e, i)}
		>
			{t.label}
		</button>
	{/each}
</div>

{#key active}
	<div class="modal-tab-panel" role="tabpanel" id="panel-{active}" aria-labelledby="tab-{active}">
		{#if active === 'product'}
			{@render product()}
		{:else if active === 'install'}
			{@render install()}
		{:else}
			{@render maintain()}
		{/if}
	</div>
{/key}

<style>
	.modal-tabs {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.35rem;
		margin: 0.75rem 0 1rem;
	}

	.modal-tab {
		font-family: var(--font-body);
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: var(--radius-sm);
		padding: 0.5rem 0.25rem;
		cursor: pointer;
		transition:
			color var(--base),
			background var(--base),
			border-color var(--base);
	}

	.modal-tab:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 2px;
	}

	.modal-tab:hover {
		color: var(--color-text);
		background: rgba(255, 255, 255, 0.04);
		border-color: rgba(255, 255, 255, 0.15);
	}

	.modal-tab--active {
		color: var(--color-text);
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.25);
	}

	.modal-tab-panel {
		min-height: 120px;
	}
</style>
