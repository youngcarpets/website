<!--
	YcModalMore — "More…" accordion sub-cards (epoxy / raised access / treads / base / ESD).
	Rendered inside YcProductModal when openProduct.material === 'more'.
	Owns its own expanded state (resets on each modal open).
	Extracted from YcProductModal on 2026-04-08 (v1.24.x).
-->
<script lang="ts">
	import { type MoreSubcard, moreSubcards } from '../data/interactions';

	let expandedMoreSub: MoreSubcard | null = $state(null);
	function toggleMoreSub(id: MoreSubcard) {
		expandedMoreSub = expandedMoreSub === id ? null : id;
	}
</script>

<!-- ── More… sub-card accordion grid ── -->
<div class="yc-more-grid">
	{#each moreSubcards as sub}
		<button
			type="button"
			class="yc-more-sub"
			class:yc-more-sub--expanded={expandedMoreSub === sub.id}
			onclick={() => toggleMoreSub(sub.id)}
			aria-expanded={expandedMoreSub === sub.id}
		>
			<span class="yc-more-sub-label">{sub.label}</span>
			<span class="yc-more-sub-chevron" aria-hidden="true">{expandedMoreSub === sub.id ? '−' : '+'}</span>
		</button>
		{#if expandedMoreSub === sub.id}
			<p class="yc-more-sub-desc" data-yc-anim>{sub.desc}</p>
		{/if}
	{/each}
</div>
<p class="yc-more-tagline">
	Don't see what you need? We probably install it. Send us your spec.
</p>
