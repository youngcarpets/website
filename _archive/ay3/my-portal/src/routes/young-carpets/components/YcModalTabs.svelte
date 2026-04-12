<!--
	YcModalTabs — shared 3-tab bar for every product modal.
	Wraps per-product content into Product / Installation / Maintenance tabs.
	Each product modal renders its own content into the three snippet slots.
	Created 2026-04-09 (v1.24.x).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	type ModalTab = 'product' | 'install' | 'maintain';
	const tabs: { id: ModalTab; label: string }[] = [
		{ id: 'product',  label: 'Product' },
		{ id: 'install',  label: 'Installation' },
		{ id: 'maintain', label: 'Maintenance' }
	];

	type Props = {
		product: Snippet;
		install: Snippet;
		maintain: Snippet;
	};

	let { product, install, maintain }: Props = $props();
	let active: ModalTab = $state('product');
</script>

<div class="yc-modal-tabs" role="tablist" aria-label="Product information">
	{#each tabs as t}
		<button
			type="button"
			class="yc-modal-tab"
			class:yc-modal-tab--active={active === t.id}
			role="tab"
			aria-selected={active === t.id}
			onclick={() => (active = t.id)}
		>
			{t.label}
		</button>
	{/each}
</div>

{#key active}
	<div class="yc-modal-tab-panel" role="tabpanel" data-yc-anim>
		{#if active === 'product'}
			{@render product()}
		{:else if active === 'install'}
			{@render install()}
		{:else}
			{@render maintain()}
		{/if}
	</div>
{/key}
