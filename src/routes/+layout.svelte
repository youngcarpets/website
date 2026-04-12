<script lang="ts">
	import { afterNavigate, onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { version } from '$app/environment';
	import type { Snippet } from 'svelte';
	import bg from '$lib/assets/hero/bg.jpg?enhanced';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let mobileMenuOpen = $state(false);
	let theme = $state<'dark' | 'light'>('dark');
	let isInitialLoad = $state(true);

	$effect(() => {
		document.documentElement.dataset.theme = theme;
	});

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

<enhanced:img src={bg} alt="" class="site-bg" />

<span class="site-version">v{version}</span>

<header>
	<nav class="site-nav" aria-label="Primary">
		<div class="site-nav-left">
			<a href={resolve('/')} class="site-nav-brand">YOUNG</a>
		</div>
		<div class="site-nav-right">
			<button
				class="site-theme"
				type="button"
				onclick={() => (theme = theme === 'dark' ? 'light' : 'dark')}
				aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
				aria-pressed={theme === 'light'}
			>
				<span class="site-theme-icon" aria-hidden="true">
					{#if theme === 'light'}
						<svg
							viewBox="0 0 24 24"
							width="18"
							height="18"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
						</svg>
					{:else}
						<svg
							viewBox="0 0 24 24"
							width="18"
							height="18"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<circle cx="12" cy="12" r="4" />
							<path d="M12 2v2" />
							<path d="M12 20v2" />
							<path d="M4.93 4.93l1.41 1.41" />
							<path d="M17.66 17.66l1.41 1.41" />
							<path d="M2 12h2" />
							<path d="M20 12h2" />
							<path d="M4.93 19.07l1.41-1.41" />
							<path d="M17.66 6.34l1.41-1.41" />
						</svg>
					{/if}
				</span>
			</button>
			<button
				class="site-hamburger"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-label="Toggle menu"
				aria-expanded={mobileMenuOpen}
			>
				<span class="site-hamburger-bar" class:open={mobileMenuOpen}></span>
				<span class="site-hamburger-bar" class:open={mobileMenuOpen}></span>
				<span class="site-hamburger-bar" class:open={mobileMenuOpen}></span>
			</button>
		</div>
		{#if mobileMenuOpen}
			<div class="site-nav-menu">
				<a href="#services" onclick={() => (mobileMenuOpen = false)}>Services</a>
				<a href="#gallery" onclick={() => (mobileMenuOpen = false)}>Gallery</a>
				<a href="#about" onclick={() => (mobileMenuOpen = false)}>About</a>
				<a href="#quote" onclick={() => (mobileMenuOpen = false)}>Quote</a>
			</div>
		{/if}
	</nav>
</header>

<main id="main" tabindex="-1">
	{@render children()}
</main>

<footer></footer>

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
		background: #0b0b0d;
		color: #e6e6e8;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	:global(.site-bg) {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		z-index: -1;
		pointer-events: none;
		opacity: 0.55;
		filter: invert(0.92) hue-rotate(180deg) brightness(0.7) contrast(1.1) saturate(0.25);
		-webkit-mask-image: radial-gradient(
			ellipse 65% 55% at 50% 45%,
			#000 0%,
			rgba(0, 0, 0, 0.92) 25%,
			rgba(0, 0, 0, 0.65) 50%,
			rgba(0, 0, 0, 0.3) 70%,
			rgba(0, 0, 0, 0.08) 85%,
			transparent 100%
		);
		mask-image: radial-gradient(
			ellipse 65% 55% at 50% 45%,
			#000 0%,
			rgba(0, 0, 0, 0.92) 25%,
			rgba(0, 0, 0, 0.65) 50%,
			rgba(0, 0, 0, 0.3) 70%,
			rgba(0, 0, 0, 0.08) 85%,
			transparent 100%
		);
	}

	.site-version {
		position: fixed;
		top: 6px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 200;
		font-family: ui-monospace, 'SF Mono', 'Cascadia Code', Consolas, monospace;
		font-size: 0.55rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		color: rgba(180, 160, 220, 0.9);
		background: rgba(60, 40, 90, 0.5);
		border: 1px solid rgba(160, 130, 210, 0.35);
		border-radius: 6px;
		padding: 0.15rem 0.5rem;
		pointer-events: none;
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

	@font-face {
		font-family: 'Square721Nav';
		src: url('/fonts/square721.ttf') format('truetype');
		font-weight: 400;
		font-style: normal;
		font-display: block;
	}

	.site-nav {
		position: fixed;
		top: 12px;
		left: 12px;
		right: 12px;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 0.6rem 1rem;
		border-radius: 16px;
		background: rgba(18, 18, 21, 0.55);
		border: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(24px) saturate(1.8);
		-webkit-backdrop-filter: blur(24px) saturate(1.8);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.08),
			0 8px 24px rgba(0, 0, 0, 0.45);
	}

	.site-nav-left {
		display: flex;
		align-items: baseline;
		min-width: 0;
	}

	.site-nav-brand {
		font-family: 'Square721Nav', ui-serif, Georgia, serif;
		font-size: 1.1rem;
		font-weight: 400;
		letter-spacing: 0.1em;
		color: #e6e6e8;
		text-decoration: none;
	}

	.site-nav-right {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.site-hamburger {
		width: 44px;
		height: 44px;
		background: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 5px;
		padding: 0;
	}

	.site-hamburger-bar {
		width: 20px;
		height: 2px;
		background: #e6e6e8;
		border-radius: 2px;
		transition: all 0.3s ease;
	}

	.site-hamburger-bar.open:nth-child(1) {
		transform: rotate(45deg) translate(5px, 5px);
	}
	.site-hamburger-bar.open:nth-child(2) {
		opacity: 0;
	}
	.site-hamburger-bar.open:nth-child(3) {
		transform: rotate(-45deg) translate(5px, -5px);
	}

	.site-nav-menu {
		width: 100%;
		display: flex;
		flex-direction: column;
		padding-top: 0.5rem;
		gap: 0.25rem;
	}

	.site-nav-menu a {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(200, 200, 200, 0.6);
		padding: 0.75rem 0.5rem;
		text-decoration: none;
		border-radius: 8px;
		min-height: 44px;
		display: flex;
		align-items: center;
		transition:
			color 0.2s,
			background 0.2s;
	}

	.site-nav-menu a:hover,
	.site-nav-menu a:focus-visible {
		color: #d4b87a;
		background: rgba(212, 184, 122, 0.08);
	}

	.site-theme {
		min-width: 44px;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 9999px;
		color: #e6e6e8;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition:
			color 180ms cubic-bezier(0.4, 0, 0.2, 1),
			background-color 180ms cubic-bezier(0.4, 0, 0.2, 1),
			border-color 180ms cubic-bezier(0.4, 0, 0.2, 1),
			transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.site-theme:hover {
		background: color-mix(in oklab, currentColor 8%, transparent);
		border-color: color-mix(in oklab, currentColor 18%, transparent);
		transform: scale(1.04);
	}

	.site-theme:focus-visible {
		outline: none;
		border-color: color-mix(in oklab, currentColor 45%, transparent);
		box-shadow: 0 0 0 3px color-mix(in oklab, currentColor 22%, transparent);
	}

	.site-theme:active {
		transform: scale(0.96);
	}

	.site-theme-icon {
		display: inline-flex;
		width: 18px;
		height: 18px;
	}

	@media (prefers-reduced-motion: reduce) {
		.site-theme,
		.site-theme:hover,
		.site-theme:active {
			transition: none;
			transform: none;
		}
	}

	:global(:root[data-theme='light'] body) {
		background: #faf7f0;
		color: #2a241a;
	}

	:global(:root[data-theme='light'] .site-bg) {
		filter: contrast(1.18) brightness(1.1) saturate(0.15) sepia(0.12);
	}

	:global(:root[data-theme='light']) .site-nav {
		background: rgba(250, 247, 240, 0.75);
		border-color: rgba(90, 77, 53, 0.12);
		box-shadow: 0 4px 16px rgba(90, 77, 53, 0.08);
	}

	:global(:root[data-theme='light']) .site-nav-brand {
		color: #2a241a;
	}

	:global(:root[data-theme='light']) .site-hamburger-bar {
		background: #2a241a;
	}

	:global(:root[data-theme='light']) .site-theme {
		color: #2a241a;
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
