<script lang="ts">
	import { onMount } from 'svelte';

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
		<p class="hero-label" class:hero-label--ready={wordmarkReady}>COMMERCIAL FLOORING</p>
		<h1 class="wordmark" class:wordmark--ready={wordmarkReady} aria-label="Young">
			{#each LETTERS as ch, i (ch + i)}
				<span class="wordmark__char" style="--young-i: {i};" aria-hidden="true">{ch}</span>
			{/each}
		</h1>
		<p class="hero-tagline" class:hero-tagline--ready={wordmarkReady}>
			Young Carpets Inc. — commercial flooring in Ottawa since 1991. Supply, installation,
			maintenance — for offices, institutions, and retail.
		</p>
	</div>
</section>

<style>
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

	.hero-label {
		font-family: 'Inter Variable', system-ui, sans-serif;
		font-size: 0.85rem;
		font-weight: 200;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(200, 200, 200, 0.7);
		margin: 0 0 16px;
		opacity: 0;
		transform: translateY(-12px);
	}

	.hero-label--ready {
		animation: hero-label-in 600ms cubic-bezier(0.22, 1, 0.36, 1) 200ms forwards;
	}

	@keyframes hero-label-in {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.wordmark {
		font-family: 'Square721Nav', ui-serif, Georgia, serif;
		font-size: 5.5rem;
		font-weight: 400;
		line-height: 1.05;
		color: #e6e6e8;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		margin: 0;
		display: inline-block;
		white-space: nowrap;
		visibility: hidden;
	}

	.wordmark--ready {
		visibility: visible;
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

	.hero-tagline {
		font-family: 'Inter Variable', system-ui, sans-serif;
		font-size: 1.15rem;
		font-weight: 200;
		letter-spacing: 0.03em;
		color: rgba(200, 200, 200, 0.7);
		margin: 16px 0 0;
		max-width: 420px;
		line-height: 1.5;
		opacity: 0;
		transform: translateY(12px);
	}

	.hero-tagline--ready {
		animation: hero-tagline-in 600ms cubic-bezier(0.22, 1, 0.36, 1) 1500ms forwards;
	}

	@keyframes hero-tagline-in {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 768px) {
		.wordmark {
			font-size: 3.75rem;
			letter-spacing: 0.12em;
		}
	}

	:global(:root[data-theme='light']) .wordmark {
		color: #2a241a;
	}

	:global(:root[data-theme='light']) .hero-label {
		color: rgba(40, 40, 40, 0.7);
	}

	:global(:root[data-theme='light']) .hero-tagline {
		color: rgba(40, 40, 40, 0.7);
	}

	@media (prefers-reduced-motion: reduce) {
		.wordmark {
			visibility: visible;
		}
		.wordmark__char,
		.wordmark--ready .wordmark__char {
			opacity: 1;
			transform: none;
			animation: none;
		}
		.hero-label {
			opacity: 1;
			transform: none;
		}
		.hero-label--ready {
			animation: none;
		}
		.hero-tagline {
			opacity: 1;
			transform: none;
		}
		.hero-tagline--ready {
			animation: none;
		}
	}
</style>
