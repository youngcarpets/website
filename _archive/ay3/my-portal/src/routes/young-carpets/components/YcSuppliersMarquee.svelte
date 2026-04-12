<!--
	YcSuppliersMarquee — Young Carpets supplier logo carousel.
	Pure leaf — takes the suppliers array as a prop.
	Extracted from +page.svelte on 2026-04-08 (v1.24.x refactor).
-->
<script lang="ts">
	import { reveal } from '$lib/actions';
	import type { Supplier } from '../data/suppliers';

	type Props = {
		suppliers: Supplier[];
	};

	let { suppliers }: Props = $props();
</script>

<section id="suppliers" class="yc-section yc-section--suppliers" use:reveal>
	<div class="yc-container">
		<p class="yc-section-eyebrow">Authorized Dealer</p>
		<h2 class="yc-section-title">Brands We Work With</h2>
	</div>
	<div class="yc-marquee" aria-label="Suppliers carousel">
		<div class="yc-marquee-track">
			{#each [...suppliers, ...suppliers] as s, i (i)}
				<a
					class="yc-marquee-item"
					href={s.url}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={`Visit ${s.name}`}
				>
					{#if s.logo}
						<img src={s.logo} alt={s.name} loading="lazy" />
					{:else}
						<span class="yc-marquee-wordmark">{s.name}</span>
					{/if}
				</a>
			{/each}
		</div>
	</div>
	<div class="yc-container">
		<p class="yc-suppliers-note">
			Logos shown represent some of the manufacturers we supply and install.
		</p>
	</div>
</section>
