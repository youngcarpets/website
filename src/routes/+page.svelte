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
	<h1 class="wordmark" class:wordmark--ready={wordmarkReady} aria-label="Young">
		{#each LETTERS as ch, i (ch + i)}
			<span class="wordmark__char" style="--young-i: {i};" aria-hidden="true">{ch}</span>
		{/each}
	</h1>
</section>

<style>
	.hero {
		min-height: 52vh;
		display: grid;
		place-items: center;
		padding: 6rem 1rem 2rem;
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
		animation: wordmark-letter-in 700ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
		animation-delay: calc(var(--young-i, 0) * 80ms);
		will-change: transform, opacity;
	}

	@keyframes wordmark-letter-in {
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
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
	}
</style>
