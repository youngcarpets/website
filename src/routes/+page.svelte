<script lang="ts">
	import { onMount } from 'svelte';
	import { countUp } from '$lib/actions/countUp';

	const LETTERS = ['Y', 'O', 'U', 'N', 'G'] as const;

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
		<div class="hero-block" class:hero-block--ready={wordmarkReady}>
			<h1 class="wordmark" class:wordmark--ready={wordmarkReady} aria-label="Young">
				{#each LETTERS as ch, i (ch + i)}
					<span class="wordmark__char" style="--young-i: {i};" aria-hidden="true">{ch}</span>
				{/each}
			</h1>
			<svg
				class="hero-subtitle"
				class:hero-subtitle--ready={wordmarkReady}
				viewBox="0 0 400 28"
				width="100%"
				role="img"
				aria-label="Commercial Flooring"
			>
				<text
					x="14"
					y="20"
					fill="currentColor"
					font-weight="500"
					textLength="340"
					lengthAdjust="spacing"
				>
					COMMERCIAL FLOORING
				</text>
				<g transform="translate(374, 13.5) scale(0.004032)">
					<path
						fill="currentColor"
						d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z"
					/>
				</g>
			</svg>
		</div>
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
				<div class="stats-label">Years in business (est. 1991)</div>
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

	/* YOUNG + COMMERCIAL FLOORING block — same width, rectangle */
	.hero-block {
		display: inline-flex;
		flex-direction: column;
		align-items: stretch;
		visibility: hidden;
	}

	.hero-block--ready {
		visibility: visible;
	}

	.wordmark {
		font-family: var(--font-brand);
		font-size: 5.5rem;
		font-weight: 400;
		line-height: 1.05;
		color: var(--color-text);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		margin: 0;
		display: block;
		text-align: center;
		white-space: nowrap;
	}

	.wordmark__char {
		display: inline-block;
		opacity: 0;
		transform: translateY(28px) scale(0.92);
	}

	.wordmark--ready .wordmark__char {
		animation: wordmark-letter-in 1000ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
		animation-delay: calc(var(--young-i, 0) * 120ms);
		will-change: transform, opacity;
	}

	@keyframes wordmark-letter-in {
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.hero-subtitle {
		width: 100%;
		color: var(--color-text);
		opacity: 0;
		transform: translateY(8px);
		overflow: visible;
	}

	.hero-subtitle text {
		font-family:
			-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
		font-size: 18px;
	}

	.hero-subtitle--ready {
		animation: hero-fade-up 600ms var(--ease-out) 800ms forwards;
	}

	@keyframes hero-fade-up {
		to {
			opacity: 0.7;
			transform: translateY(0);
		}
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

	@media (max-width: 768px) {
		.wordmark {
			font-size: 3.75rem;
			letter-spacing: 0.12em;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-block {
			visibility: visible;
		}
		.wordmark__char,
		.wordmark--ready .wordmark__char {
			opacity: 1;
			transform: none;
			animation: none;
		}
		.hero-subtitle {
			opacity: 0.7;
			transform: none;
		}
		.hero-subtitle--ready {
			animation: none;
		}
	}
</style>
