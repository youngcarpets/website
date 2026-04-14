<script lang="ts">
	import { afterNavigate, onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { version } from '$app/environment';
	import type { Snippet } from 'svelte';
	import '@fontsource-variable/inter';
	import '../app.css';
	import bg from '$lib/assets/hero/bg.jpg?enhanced';
	import BrandMark from '$lib/components/BrandMark.svelte';

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

<svelte:head>
	<meta property="og:site_name" content="Young Carpets Inc." />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="en_CA" />
	<meta name="author" content="Young Carpets Inc." />
	<meta name="geo.region" content="CA-ON" />
	<meta name="geo.placename" content="Ottawa" />
</svelte:head>

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
				<a href="#products" onclick={() => (mobileMenuOpen = false)}>Products</a>
				<a href="#services" onclick={() => (mobileMenuOpen = false)}>Services</a>
				<a href="#suppliers" onclick={() => (mobileMenuOpen = false)}>Suppliers</a>
				<a href="#contact" onclick={() => (mobileMenuOpen = false)}>Contact</a>
			</div>
		{/if}
	</nav>
</header>

<main id="main" tabindex="-1">
	{@render children()}
</main>

<footer class="site-footer">
	<div class="site-footer-inner">
		<div class="site-footer-brand-block">
			<BrandMark size="footer" />
		</div>

		<div class="site-footer-grid">
			<div class="site-footer-col">
				<div class="site-footer-address-row">
					<span class="site-footer-list-key" aria-label="Address"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle
								cx="12"
								cy="10"
								r="3"
							/></svg
						></span
					>
					<address class="site-footer-address">
						Young Carpets Inc.<br />
						Unit 316-1228 Old Innes Rd<br />
						Ottawa, ON K1B 3V3<br />
						Canada
					</address>
				</div>
			</div>

			<div class="site-footer-col">
				<ul class="site-footer-list">
					<li>
						<span class="site-footer-list-key" aria-label="Phone"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><path
									d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
								/></svg
							></span
						>
						<span class="site-footer-list-val">613-744-2744</span>
					</li>
					<li>
						<span class="site-footer-list-key" aria-label="Email"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><rect width="20" height="16" x="2" y="4" rx="2" /><path
									d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
								/></svg
							></span
						>
						<span class="site-footer-list-val">info@youngcarpets.com</span>
					</li>
					<li>
						<span class="site-footer-list-key" aria-label="Office hours"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg
							></span
						>
						<span class="site-footer-list-val">Mon–Fri 8 AM – 4 PM</span>
					</li>
				</ul>
			</div>
		</div>

		<div class="site-footer-bottom">
			<p class="site-footer-copy">&copy; 2026 Young Carpets Inc.</p>
		</div>
	</div>
</footer>

<style>
	:global(.site-bg) {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		z-index: -1;
		pointer-events: none;
		opacity: 0.45;
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

	:global(:root[data-theme='light'] .site-bg) {
		filter: contrast(1.18) brightness(1.1) saturate(0.15) sepia(0.12);
	}

	.site-version {
		position: fixed;
		top: calc(6px + env(safe-area-inset-top, 0px));
		left: 50%;
		transform: translateX(-50%);
		z-index: 200;
		font-family: var(--font-mono);
		font-size: 0.55rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		color: rgba(180, 160, 220, 0.9);
		background: rgba(60, 40, 90, 0.5);
		border: 1px solid rgba(160, 130, 210, 0.35);
		border-radius: var(--radius-xs);
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

	main:focus:not(:focus-visible) {
		outline: none;
	}

	@font-face {
		font-family: 'Square721Nav';
		src: url('/fonts/square721.ttf') format('truetype');
		font-weight: 400;
		font-style: normal;
		font-display: block;
	}

	/* --- Nav ------------------------------------------------ */

	.site-nav {
		position: fixed;
		top: calc(12px + env(safe-area-inset-top, 0px));
		left: calc(12px + env(safe-area-inset-left, 0px));
		right: calc(12px + env(safe-area-inset-right, 0px));
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 0.6rem 1rem;
		border-radius: var(--radius-lg);
		background: rgba(18, 18, 21, 0.18);
		border: 1px solid var(--color-border-glass);
		backdrop-filter: blur(8px) saturate(1.4);
		-webkit-backdrop-filter: blur(8px) saturate(1.4);
		box-shadow: var(--glass-shadow);
	}

	.site-nav-left {
		display: flex;
		align-items: baseline;
		min-width: 0;
	}

	.site-nav-brand {
		font-family: var(--font-brand);
		font-size: 1.1rem;
		font-weight: 400;
		letter-spacing: 0.1em;
		color: var(--color-text);
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
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 5px;
		padding: 0;
		border-radius: var(--radius-sm);
	}

	.site-hamburger:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 2px;
	}

	.site-hamburger-bar {
		width: 20px;
		height: 2px;
		background: var(--color-text);
		border-radius: 2px;
		transition: all var(--slow) ease;
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
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-ghost);
		padding: 0.75rem 0.5rem;
		text-decoration: none;
		border-radius: var(--radius-sm);
		min-height: 44px;
		display: flex;
		align-items: center;
		transition:
			color var(--base),
			background var(--base);
	}

	.site-nav-menu a:focus-visible {
		color: var(--color-text);
		background: var(--hover-bg);
	}

	@media (hover: hover) {
		.site-nav-menu a:hover {
			color: var(--color-text);
			background: var(--hover-bg);
		}
	}

	/* --- Theme Toggle --------------------------------------- */

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
		color: var(--color-text);
		-webkit-tap-highlight-color: transparent;
		transition:
			color 180ms cubic-bezier(0.4, 0, 0.2, 1),
			background-color 180ms cubic-bezier(0.4, 0, 0.2, 1),
			border-color 180ms cubic-bezier(0.4, 0, 0.2, 1),
			transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	@media (hover: hover) {
		.site-theme:hover {
			background: color-mix(in oklab, currentColor 8%, transparent);
			border-color: color-mix(in oklab, currentColor 18%, transparent);
			transform: scale(1.04);
		}
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

	/* --- Footer --------------------------------------------- */

	.site-footer {
		background: rgba(18, 18, 21, 0.22);
		backdrop-filter: blur(12px) saturate(1.4);
		-webkit-backdrop-filter: blur(12px) saturate(1.4);
		color: var(--color-text-muted);
		padding: 2.5rem 0 calc(1.5rem + env(safe-area-inset-bottom, 0px));
		position: relative;
		z-index: 1;
		border-top: 1px solid var(--color-border-glass);
		font-size: 14px;
		line-height: 1.55;
		-webkit-font-smoothing: antialiased;
		letter-spacing: -0.005em;
	}

	.site-footer-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 calc(1rem + env(safe-area-inset-right, 0px)) 0
			calc(1rem + env(safe-area-inset-left, 0px));
	}

	.site-footer-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2.5rem 2rem;
		padding-bottom: 2.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	.site-footer-brand-block {
		display: flex;
		flex-direction: column;
		align-items: start;
		margin-bottom: 1.5rem;
		margin-top: -0.75rem;
	}

	.site-footer-address-row {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.site-footer-address-row .site-footer-list-key {
		margin-top: 0.15rem;
		color: rgba(230, 230, 232, 0.8);
	}

	.site-footer-address {
		font-style: normal;
		margin: 0;
		color: var(--color-text-subtle);
		font-size: 0.82rem;
		line-height: 1.6;
		user-select: text;
	}

	.site-footer-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.site-footer-list li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.site-footer-list-key {
		display: flex;
		align-items: center;
		color: rgba(230, 230, 232, 0.8);
	}

	.site-footer-list-val {
		font-size: 0.82rem;
		color: var(--color-text-subtle);
		font-feature-settings: 'tnum';
		user-select: text;
		text-decoration: none;
	}

	.site-footer-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		padding-top: 1.5rem;
	}

	.site-footer-copy {
		margin: 0;
		font-size: 0.75rem;
		color: var(--color-text-subtle);
	}

	/* 960px */
	@media (max-width: 960px) {
		.site-footer-grid {
			grid-template-columns: 1fr 1fr;
			gap: 2.25rem 1.5rem;
		}
	}

	/* 520px */
	@media (max-width: 520px) {
		.site-footer-brand-block {
			align-items: center;
			text-align: center;
		}
	}
</style>
