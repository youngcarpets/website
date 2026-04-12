<!--
	YcProductModal — thin shell that renders the product header (code/name/badges/blurb)
	plus one of 9 per-material body components based on openProduct.material.
	Each body owns its own state, helpers, and effects — they mount/unmount with the modal.

	Refactored 2026-04-08 (v1.24.x) to delegate per-material logic into per-material
	child components. State no longer persists across modal opens — each open mounts
	a fresh body component.
-->
<script lang="ts">
	import type { Product } from '../data/products';
	import YcModalCarpet from './YcModalCarpet.svelte';
	import YcModalCarpetTile from './YcModalCarpetTile.svelte';
	import YcModalLvt from './YcModalLvt.svelte';
	import YcModalCeramic from './YcModalCeramic.svelte';
	import YcModalRubber from './YcModalRubber.svelte';
	import YcModalMatting from './YcModalMatting.svelte';
	import YcModalHardwood from './YcModalHardwood.svelte';
	import YcModalSheet from './YcModalSheet.svelte';
	import YcModalMore from './YcModalMore.svelte';

	type Props = {
		openProduct: Product | null;
		onClose: () => void;
	};

	let { openProduct, onClose }: Props = $props();

	// ── ESC key closes the modal ──
	$effect(() => {
		if (typeof window === 'undefined') return;
		if (!openProduct) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

{#if openProduct}
	<!-- ── Product modal ── -->
	<div
		class="yc-modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="yc-modal-title"
		aria-describedby="yc-modal-blurb"
		onclick={onClose}
	>
		<div class="yc-modal-body" onclick={(e) => e.stopPropagation()} role="document">
			<button
				type="button"
				class="yc-modal-close"
				onclick={onClose}
				aria-label="Close"
			>
				&times;
			</button>
			<p class="yc-product-code">{openProduct.code}</p>
			{#if openProduct.nameHtml}
				<h3 id="yc-modal-title" class="yc-modal-title">{@html openProduct.nameHtml}</h3>
			{:else}
				<h3 id="yc-modal-title" class="yc-modal-title">{openProduct.name}</h3>
			{/if}
			<div class="yc-product-badges yc-product-badges--lg" aria-hidden="true">
				{#each openProduct.badges as b}
					<span class="yc-badge">{b}</span>
				{/each}
			</div>
			<p class="yc-modal-blurb">{openProduct.blurb}</p>

			{#if openProduct.material === 'carpet'}
				<YcModalCarpet />
			{:else if openProduct.material === 'matting'}
				<YcModalMatting />
			{:else if openProduct.material === 'more'}
				<YcModalMore />
			{:else if openProduct.material === 'sheet'}
				<YcModalSheet />
			{:else if openProduct.material === 'ceramic'}
				<YcModalCeramic />
			{:else if openProduct.material === 'rubber'}
				<YcModalRubber />
			{:else if openProduct.material === 'hardwood'}
				<YcModalHardwood />
			{:else if openProduct.material === 'lvt'}
				<YcModalLvt />
			{:else if openProduct.material === 'carpet-tile'}
				<YcModalCarpetTile />
			{/if}

			{#if openProduct.details}
				<p class="yc-modal-details">{openProduct.details}</p>
			{/if}
			<div class="yc-modal-cta">
				<a href="tel:+16137442744" class="yc-modal-cta-btn">Call 613-744-2744</a>
				<a
					href={`mailto:info@youngcarpets.com?subject=Inquiry: ${openProduct.name}`}
					class="yc-modal-cta-btn yc-modal-cta-btn--ghost">Email about {openProduct.name}</a
				>
			</div>
		</div>
	</div>
{/if}
