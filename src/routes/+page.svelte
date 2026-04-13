<script lang="ts">
	import { onMount } from 'svelte';
	import { countUp } from '$lib/actions/countUp';
	import BrandMark from '$lib/components/BrandMark.svelte';

	let wordmarkReady = $state(false);

	onMount(() => {
		let cancelled = false;
		const start = async () => {
			try {
				if ('fonts' in document) {
					await document.fonts.load('5.5rem "Square721Nav"');
					await document.fonts.ready;
				}
			} catch {
				/* reveal anyway if font load fails */
			}
			if (!cancelled) wordmarkReady = true;
		};
		requestAnimationFrame(start);
		return () => {
			cancelled = true;
		};
	});
</script>

<svelte:head>
	<title>Young Carpets</title>
	<meta name="description" content="Young Carpets — flooring in Ontario." />
</svelte:head>

<section class="hero">
	<div class="hero-title">
		<BrandMark size="hero" animated ready={wordmarkReady} tag="h1" />
	</div>
</section>

<section id="products" class="section-placeholder" aria-label="Products"></section>
<section id="services" class="section-placeholder" aria-label="Services"></section>
<section id="suppliers" class="section-placeholder" aria-label="Suppliers"></section>

<section id="contact" class="section-placeholder" aria-label="Contact">
	<div class="stats-bar">
		<div class="stats-counters">
			<div class="stats-item">
				<div
					class="stats-number"
					use:countUp
					data-target="35"
					data-suffix="+"
					aria-label="35 plus years in business"
				>
					0+
				</div>
				<div class="stats-label">Years in business<br />(est. 1991)</div>
			</div>
			<div class="stats-item">
				<div
					class="stats-number"
					use:countUp
					data-target="50000"
					data-suffix="+"
					aria-label="50,000 plus jobs completed"
				>
					0+
				</div>
				<div class="stats-label">Jobs completed across the region</div>
			</div>
			<div class="stats-item">
				<div
					class="stats-number"
					use:countUp
					data-target="250"
					data-suffix="+"
					aria-label="250 plus combined years of experience"
				>
					0+
				</div>
				<div class="stats-label">Combined years of experience</div>
			</div>
		</div>
	</div>
</section>

<style>
	.section-placeholder {
		min-height: 0;
	}

	.hero {
		min-height: 52vh;
		display: grid;
		place-items: center;
		padding: 6rem 1rem 2rem;
	}

	.hero-title {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	/* --- Stats / Counters ----------------------------------- */

	.stats-bar {
		display: flex;
		justify-content: center;
		padding: 2rem 1rem;
		max-width: 640px;
		margin: 0 auto;
	}

	.stats-counters {
		display: flex;
		gap: 0.5rem;
		width: 100%;
	}

	.stats-item {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 1.25rem 0.5rem;
		border-radius: var(--radius-lg);
		background: rgba(18, 18, 21, 0.18);
		border: 1px solid var(--color-border-glass);
		backdrop-filter: blur(8px) saturate(1.4);
		-webkit-backdrop-filter: blur(8px) saturate(1.4);
		box-shadow: var(--glass-shadow);
	}

	.stats-number {
		font-family: var(--font-body);
		font-size: 1.3rem;
		font-weight: 200;
		letter-spacing: 0.02em;
		color: var(--color-text);
		line-height: 1.1;
		white-space: nowrap;
	}

	.stats-label {
		font-size: 0.65rem;
		font-weight: 400;
		color: var(--color-text-muted);
		margin-top: 0.35rem;
		line-height: 1.3;
	}

	@media (min-width: 521px) {
		.stats-item {
			padding: 1.5rem 1rem;
		}

		.stats-number {
			font-size: 2rem;
			letter-spacing: 0.04em;
		}

		.stats-label {
			font-size: 0.8rem;
			margin-top: 0.5rem;
			line-height: 1.4;
		}

		.stats-counters {
			gap: 1rem;
		}
	}
</style>
