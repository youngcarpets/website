<!--
	YcCard — generic Young Carpets card primitive.

	Wraps the shared yc-card pattern: glass surface + cushion shadow + cardPointer
	tilt + shine span + i-stagger CSS var. Variant prop selects the visual style
	(product / service / team / scene). Consumers pass content via children snippet.

	NOT YET MIGRATED — the existing YcProductsSection / YcServicesSection / YcContactSection
	markup still inlines `.yc-product-card`, `.yc-card`, `.yc-team-row` directly.
	This component is the migration target for whoever picks up the YcCard
	unification chunk later. The CSS for each variant lives in
	`lib/styles/young-carpets.css` and is shared across all 3 sites.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cardPointer } from '$lib/actions';

	type Props = {
		variant: 'product' | 'service' | 'team' | 'scene';
		index?: number;
		tilt?: boolean;
		shine?: boolean;
		ariaLabel?: string;
		onclick?: () => void;
		children: Snippet;
	};

	let {
		variant,
		index = 0,
		tilt = true,
		shine = true,
		ariaLabel,
		onclick,
		children
	}: Props = $props();

	const baseClass = $derived(
		variant === 'product'
			? 'yc-product-card'
			: variant === 'service'
				? 'yc-card'
				: variant === 'team'
					? 'yc-team-row'
					: 'yc-card'
	);
</script>

{#if onclick}
	<button
		type="button"
		class={baseClass}
		data-variant={variant}
		style="--i: {index}"
		use:cardPointer
		{onclick}
		aria-label={ariaLabel}
	>
		{#if shine}<span class="yc-card-shine" aria-hidden="true"></span>{/if}
		{@render children()}
	</button>
{:else}
	<div
		class={baseClass}
		data-variant={variant}
		style="--i: {index}"
		use:cardPointer
	>
		{#if shine}<span class="yc-card-shine" aria-hidden="true"></span>{/if}
		{@render children()}
	</div>
{/if}
