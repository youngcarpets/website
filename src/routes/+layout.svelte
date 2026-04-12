<script lang="ts">
	import { afterNavigate, onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { version } from '$app/environment';
	import type { Snippet } from 'svelte';
	import '@fontsource-variable/inter';
	import bg from '$lib/assets/hero/bg.jpg?enhanced';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let mobileMenuOpen = $state(false);
	let theme = $state<'dark' | 'light'>('dark');
	let isInitialLoad = $state(true);
	let footerOpen = $state(false);

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

<footer class="site-footer">
	<div class="site-footer-inner">
		<div class="site-footer-panel" class:open={footerOpen}>
			<div class="site-footer-panel-header">
				<button
					class="site-footer-close"
					onclick={() => (footerOpen = false)}
					aria-label="Close footer details"
				>
					<svg
						viewBox="0 0 24 24"
						width="16"
						height="16"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M18 6L6 18" />
						<path d="M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="site-footer-grid">
				<div class="site-footer-col">
					<address class="site-footer-address">
						Young Carpets Inc.<br />
						Unit 316 — 1228 Old Innes Road<br />
						Ottawa, ON K1B 3V3<br />
						Canada
					</address>
				</div>

				<div class="site-footer-col">
					<p class="site-footer-col-title">Contact</p>
					<ul class="site-footer-list">
						<li>
							<span class="site-footer-list-key">Phone</span>
							<span class="site-footer-list-val">613-744-2744</span>
						</li>
						<li>
							<span class="site-footer-list-key">Email</span>
							<span class="site-footer-list-val">info@youngcarpets.com</span>
						</li>
						<li>
							<span class="site-footer-list-key">AP</span>
							<span class="site-footer-list-val">ap@youngcarpets.com</span>
						</li>
					</ul>
				</div>

				<div class="site-footer-col">
					<p class="site-footer-col-title">Hours</p>
					<ul class="site-footer-list">
						<li>
							<span class="site-footer-list-key">Office</span>
							<span class="site-footer-list-val">Mon–Fri 8 AM – 4 PM</span>
						</li>
						<li>
							<span class="site-footer-list-key">Installation</span>
							<span class="site-footer-list-val">24/7, 365</span>
						</li>
					</ul>
				</div>
			</div>

			<div class="site-footer-bottom">
				<p class="site-footer-copy">&copy; 2026 Young Carpets Inc.</p>
			</div>
		</div>

		<button
			class="site-footer-bar"
			onclick={() => (footerOpen = !footerOpen)}
			aria-expanded={footerOpen}
			aria-label={footerOpen ? 'Collapse footer' : 'Expand footer for details'}
		>
			<div class="site-footer-bar-panel">
				<span class="site-footer-bar-brand">YOUNG</span>
				<span class="site-footer-bar-sub">Commercial Flooring</span>
			</div>
			<div class="site-footer-bar-panel">
				<span class="site-footer-bar-line">Unit 316 — 1228 Old Innes Rd</span>
				<span class="site-footer-bar-line">Ottawa, ON K1B 3V3</span>
			</div>
			<div class="site-footer-bar-panel">
				<span class="site-footer-bar-line">613-744-2744</span>
				<span class="site-footer-bar-line">info@youngcarpets.com</span>
			</div>
			<div class="site-footer-bar-panel">
				<span class="site-footer-bar-line">Mon–Fri 8 AM – 4 PM</span>
				<span class="site-footer-bar-line">Installation 24/7</span>
			</div>
			<svg
				class="site-footer-bar-chevron"
				class:open={footerOpen}
				viewBox="0 0 24 24"
				width="14"
				height="14"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M18 15l-6-6-6 6" />
			</svg>
		</button>
	</div>
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
		background: #0b0b0d;
		color: #e6e6e8;
		font-family: 'Inter Variable', system-ui, sans-serif;
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
		border-radius: 8px;
	}

	.site-hamburger:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 2px;
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
		color: #e6e6e8;
		background: rgba(255, 255, 255, 0.06);
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

	@media (prefers-reduced-transparency: reduce) {
		.site-nav {
			background: rgba(18, 18, 21, 0.95);
			backdrop-filter: none;
			-webkit-backdrop-filter: none;
			border-color: rgba(255, 255, 255, 0.2);
		}
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

	.site-footer {
		background: #07070a;
		color: #9a9aa1;
		position: relative;
		z-index: 1;
		border-top: 1px solid #2a2a2f;
		font-size: 14px;
		line-height: 1.55;
		-webkit-font-smoothing: antialiased;
		letter-spacing: -0.005em;
	}

	.site-footer-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.site-footer-bar {
		display: grid;
		grid-template-columns: auto 1fr 1fr 1fr auto;
		align-items: center;
		gap: 0 1.5rem;
		width: 100%;
		min-height: 44px;
		padding: 0.75rem 0;
		padding-bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px));
		background: transparent;
		border: none;
		cursor: pointer;
		color: #9a9aa1;
		font-size: 0.78rem;
		font-family: 'Inter Variable', system-ui, sans-serif;
		letter-spacing: -0.005em;
		text-align: left;
		-webkit-tap-highlight-color: transparent;
		-webkit-font-smoothing: antialiased;
	}

	.site-footer-bar:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 4px;
		border-radius: 8px;
	}

	.site-footer-bar-panel {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		line-height: 1.4;
	}

	.site-footer-bar-brand {
		font-family: 'Square721Nav', ui-serif, Georgia, serif;
		font-size: 1.1rem;
		letter-spacing: 0.18em;
		color: #e6e6e8;
	}

	.site-footer-bar-sub {
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.55rem;
		font-weight: 300;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: #9a9aa1;
	}

	.site-footer-bar-line {
		font-size: 0.75rem;
		color: #9a9aa1;
		white-space: nowrap;
	}

	.site-footer-bar-chevron {
		flex-shrink: 0;
		color: #6b6b73;
		transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.site-footer-bar-chevron.open {
		transform: rotate(180deg);
	}

	.site-footer-panel {
		max-height: 0;
		padding: 0;
		overflow: hidden;
		opacity: 0;
		transition:
			max-height 280ms cubic-bezier(0.2, 0.8, 0.2, 1),
			padding 280ms cubic-bezier(0.2, 0.8, 0.2, 1),
			opacity 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	.site-footer-panel.open {
		max-height: 600px;
		padding: 1.5rem 0 0;
		opacity: 1;
		transition:
			max-height 280ms cubic-bezier(0.2, 0.8, 0.2, 1),
			padding 280ms cubic-bezier(0.2, 0.8, 0.2, 1),
			opacity 280ms cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	.site-footer-panel-header {
		display: flex;
		justify-content: flex-end;
		padding-bottom: 0.5rem;
	}

	.site-footer-close {
		width: 44px;
		height: 44px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		color: #9a9aa1;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		opacity: 0;
		transform: scale(0.9);
		transition:
			opacity 200ms cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1),
			color 180ms cubic-bezier(0.4, 0, 0.2, 1),
			background 180ms cubic-bezier(0.4, 0, 0.2, 1),
			border-color 180ms cubic-bezier(0.4, 0, 0.2, 1);
		transition-delay: 0ms;
	}

	.site-footer-panel.open .site-footer-close {
		opacity: 1;
		transform: scale(1);
		transition:
			opacity 280ms cubic-bezier(0.34, 1.56, 0.64, 1),
			transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1),
			color 180ms cubic-bezier(0.4, 0, 0.2, 1),
			background 180ms cubic-bezier(0.4, 0, 0.2, 1),
			border-color 180ms cubic-bezier(0.4, 0, 0.2, 1);
		transition-delay: 80ms;
	}

	.site-footer-close:hover {
		color: #e6e6e8;
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.site-footer-close:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 2px;
	}

	.site-footer-grid {
		display: grid;
		grid-template-columns: 1fr 1.2fr 1fr;
		gap: 2.5rem 2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid #2a2a2f;
	}

	.site-footer-col {
		opacity: 0;
		transform: translateY(12px);
		transition:
			opacity 200ms cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
		transition-delay: 0ms;
	}

	.site-footer-panel.open .site-footer-col {
		opacity: 1;
		transform: translateY(0);
		transition:
			opacity 320ms cubic-bezier(0.34, 1.56, 0.64, 1),
			transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.site-footer-panel.open .site-footer-col:nth-child(1) {
		transition-delay: 0ms;
	}

	.site-footer-panel.open .site-footer-col:nth-child(2) {
		transition-delay: 60ms;
	}

	.site-footer-panel.open .site-footer-col:nth-child(3) {
		transition-delay: 120ms;
	}

	.site-footer-col-title {
		display: inline-block;
		margin: 0 0 0.85rem;
		padding: 0.3rem 0.7rem;
		font-family: ui-monospace, 'SF Mono', monospace;
		font-size: 0.6rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: #9a9aa1;
		border-radius: 8px;
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.site-footer-address {
		font-style: normal;
		margin: 0;
		color: #e6e6e8;
		font-size: 0.82rem;
		line-height: 1.6;
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
		display: grid;
		grid-template-columns: 48px 1fr;
		align-items: baseline;
		gap: 0.5rem;
	}

	.site-footer-list-key {
		font-size: 0.74rem;
		font-weight: 500;
		color: #8e8e96;
		text-transform: lowercase;
	}

	.site-footer-list-val {
		font-size: 0.82rem;
		color: #e6e6e8;
		font-feature-settings: 'tnum';
		user-select: text;
	}

	.site-footer-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		padding-top: 1.5rem;
		opacity: 0;
		transition: opacity 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
		transition-delay: 0ms;
	}

	.site-footer-panel.open .site-footer-bottom {
		opacity: 1;
		transition: opacity 280ms cubic-bezier(0.2, 0.8, 0.2, 1);
		transition-delay: 160ms;
	}

	.site-footer-copy {
		margin: 0;
		font-size: 0.75rem;
		color: #8e8e96;
	}

	@media (max-width: 880px) {
		.site-footer-grid {
			grid-template-columns: 1fr 1fr;
			gap: 2.25rem 1.5rem;
		}
	}

	@media (max-width: 880px) {
		.site-footer-bar {
			grid-template-columns: auto 1fr auto;
			gap: 0.5rem 1rem;
		}

		.site-footer-bar-panel:nth-child(3),
		.site-footer-bar-panel:nth-child(4) {
			display: none;
		}
	}

	@media (max-width: 520px) {
		.site-footer-bar {
			grid-template-columns: auto 1fr auto;
			gap: 0.4rem 0.75rem;
		}

		.site-footer-bar-panel:nth-child(2),
		.site-footer-bar-panel:nth-child(3),
		.site-footer-bar-panel:nth-child(4) {
			display: none;
		}

		.site-footer-grid {
			grid-template-columns: 1fr;
			gap: 1.75rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.site-footer-panel {
			transition: none;
		}
		.site-footer-bar-chevron {
			transition: none;
		}
		.site-footer-col {
			transition: none;
			opacity: 1;
			transform: none;
		}
		.site-footer-close {
			transition-property: color, background, border-color;
			transition-duration: 0.01ms;
			opacity: 1;
			transform: none;
		}
		.site-footer-bottom {
			transition: none;
			opacity: 1;
		}
	}
</style>
