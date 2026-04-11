<script lang="ts">
	import { afterNavigate, onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let isInitialLoad = $state(true);

	afterNavigate(() => {
		if (isInitialLoad) {
			isInitialLoad = false;
			return;
		}
		const h1 = document.querySelector<HTMLHeadingElement>('main h1');
		h1?.focus();
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<a class="skip-link" href="#main">Skip to main content</a>

<header>
	<nav aria-label="Primary">
		<a href={resolve('/')}>Young Carpets</a>
	</nav>
</header>

<main id="main" tabindex="-1">
	{@render children()}
</main>

<footer>
	<p>&copy; {new Date().getFullYear()} Young Carpets</p>
</footer>

<style>
	:global(:root) {
		--fast: 120ms;
		--base: 200ms;
		--slow: 320ms;
		--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
		--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
	}

	:global(body) {
		margin: 0;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	.skip-link {
		position: absolute;
		left: -9999px;
		top: 0;
		padding: 0.75rem 1rem;
		background: #000;
		color: #fff;
		text-decoration: none;
		z-index: 100;
	}

	.skip-link:focus {
		left: 0;
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}

	main {
		min-height: 60vh;
	}

	main:focus {
		outline: none;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(*),
		:global(*::before),
		:global(*::after),
		:global(::view-transition-old(*)),
		:global(::view-transition-new(*)) {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
			scroll-behavior: auto !important;
		}
	}
</style>
