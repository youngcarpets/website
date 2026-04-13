<script lang="ts">
	import { suppliers } from '$lib/content/suppliers';
</script>

<section id="suppliers" class="suppliers" aria-label="Suppliers">
	<h2 class="suppliers-heading">Our Suppliers</h2>
	<div class="marquee" aria-hidden="true">
		<div class="marquee-track">
			{#each suppliers as supplier (supplier.slug)}
				<span class="marquee-item">{supplier.name}</span>
			{/each}
			{#each suppliers as supplier (`${supplier.slug}-dup`)}
				<span class="marquee-item">{supplier.name}</span>
			{/each}
		</div>
	</div>
	<ul class="suppliers-sr-only">
		{#each suppliers as supplier (supplier.slug)}
			<li>{supplier.name}</li>
		{/each}
	</ul>
</section>

<style>
	.suppliers {
		padding: 3rem 1rem 2rem;
		overflow: hidden;
	}

	.suppliers-heading {
		font-family: var(--font-body);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.marquee {
		position: relative;
		width: 100%;
		mask-image: linear-gradient(
			to right,
			transparent,
			black 8%,
			black 92%,
			transparent
		);
		-webkit-mask-image: linear-gradient(
			to right,
			transparent,
			black 8%,
			black 92%,
			transparent
		);
	}

	.marquee-track {
		display: flex;
		gap: 2rem;
		width: max-content;
		animation: marquee-scroll 40s linear infinite;
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
			padding: 4rem 1.5rem 3rem;
		}

		.suppliers-heading {
			font-size: 0.85rem;
			margin-bottom: 2rem;
		}

		.marquee-item {
			font-size: 0.95rem;
			padding: 0.6rem 1.25rem;
		}

		.marquee-track {
			gap: 2.5rem;
		}
	}
</style>
