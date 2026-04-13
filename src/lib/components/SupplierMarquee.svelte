<script lang="ts">
	import { suppliers, suppliersByMaterial } from '$lib/content/suppliers';
	import type { Product } from '$lib/content/products';

	interface Props {
		material?: Product['material'];
		compact?: boolean;
	}

	let { material, compact = false }: Props = $props();

	const filtered = $derived(material ? suppliersByMaterial(material) : suppliers);
</script>

{#if !compact}
	<section id="suppliers" class="suppliers" aria-label="Suppliers">
		<h2 class="suppliers-heading">
			<span class="heading-accent">Trusted Brands</span>
			<span class="heading-dim">Include:</span>
		</h2>
		<div class="marquee" aria-hidden="true">
			<div class="marquee-track">
				{#each filtered as supplier (supplier.slug)}
					<span class="marquee-item">{supplier.name}</span>
				{/each}
				{#each filtered as supplier (`${supplier.slug}-dup`)}
					<span class="marquee-item">{supplier.name}</span>
				{/each}
			</div>
		</div>
		<ul class="suppliers-sr-only">
			{#each filtered as supplier (supplier.slug)}
				<li>{supplier.name}</li>
			{/each}
		</ul>
	</section>
{:else}
	<div class="compact-suppliers" aria-label="Suppliers for this product">
		<div class="compact-marquee" aria-hidden="true">
			<div class="compact-track">
				{#each filtered as supplier (supplier.slug)}
					<span class="compact-item">{supplier.name}</span>
				{/each}
				{#each filtered as supplier (`${supplier.slug}-dup`)}
					<span class="compact-item">{supplier.name}</span>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	/* === Full-size (main page) === */
	.suppliers {
		padding: 2rem 1rem 1rem;
		overflow: hidden;
	}

	.heading-accent {
		color: #f5f5f7;
		text-shadow: 0 0 12px rgba(212, 184, 122, 0.15);
	}

	.heading-dim {
		opacity: 0.7;
	}

	.suppliers-heading {
		font-family: var(--font-body);
		font-size: 0.8rem;
		font-weight: 200;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: var(--color-text);
		text-align: center;
		margin-bottom: 0.25rem;
	}

	.marquee {
		position: relative;
		width: 100%;
		background: rgba(0, 0, 0, 0.35);
		padding: 0.75rem 0;
		mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
		-webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
	}

	.marquee-track {
		display: flex;
		gap: 2rem;
		width: max-content;
		animation: marquee-scroll 70s linear infinite;
	}

	.marquee-item {
		flex-shrink: 0;
		font-family: var(--font-body);
		font-size: 0.85rem;
		font-weight: 300;
		letter-spacing: 0.05em;
		color: var(--color-text-subtle);
		white-space: nowrap;
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-border-glass);
		border-radius: var(--radius-sm);
		background: var(--glass-bg);
		backdrop-filter: blur(8px) saturate(1.4);
		-webkit-backdrop-filter: blur(8px) saturate(1.4);
	}

	@keyframes marquee-scroll {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	@media (hover: hover) {
		.marquee:hover .marquee-track {
			animation-play-state: paused;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee-track {
			animation: none;
			flex-wrap: wrap;
			justify-content: center;
			width: auto;
		}

		.marquee {
			mask-image: none;
			-webkit-mask-image: none;
		}
	}

	.suppliers-sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (min-width: 521px) {
		.suppliers {
			padding: 2.5rem 1.5rem 1.5rem;
		}

		.suppliers-heading {
			font-size: 0.95rem;
			margin-bottom: 0.25rem;
		}

		.marquee-item {
			font-size: 0.95rem;
			padding: 0.6rem 1.25rem;
		}

		.marquee-track {
			gap: 2.5rem;
		}
	}

	/* === Compact (product modal) === */
	.compact-suppliers {
		overflow: hidden;
		margin: 0.6rem 0 0;
	}

	.compact-marquee {
		position: relative;
		width: 100%;
		padding: 0.4rem 0;
		mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
		-webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
	}

	.compact-track {
		display: flex;
		gap: 0.6rem;
		width: max-content;
		animation: marquee-scroll 30s linear infinite;
	}

	.compact-item {
		flex-shrink: 0;
		font-family: var(--font-body);
		font-size: 0.65rem;
		font-weight: 400;
		letter-spacing: 0.04em;
		color: var(--color-text-muted);
		white-space: nowrap;
		padding: 0.25rem 0.55rem;
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: var(--radius-sm);
	}

	@media (hover: hover) {
		.compact-marquee:hover .compact-track {
			animation-play-state: paused;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.compact-track {
			animation: none;
			flex-wrap: wrap;
			justify-content: center;
			width: auto;
		}

		.compact-marquee {
			mask-image: none;
			-webkit-mask-image: none;
		}
	}
</style>
