<!-- src/lib/components/ThemeToggle.svelte
     Shared theme toggle button. Svelte 5 runes only.
     - 44×44 tap target (a11y minimum, WCAG 2.5.5)
     - Inline sun/moon SVG (no icon library, no dependency)
     - currentColor strokes so it inherits from parent
     - aria-pressed reflects "is light mode active"
     - Source: theme-toggle-plan.md (Structure agent, 2026-04-07)
-->
<script lang="ts">
	import { theme, toggleTheme, initTheme } from '$lib/stores/theme.svelte';

	// Lazy-init on first mount of any toggle in the tree.
	$effect(() => {
		initTheme();
	});

	const isLight = $derived(theme.mode === 'light');
	const label = $derived(isLight ? 'Switch to dark mode' : 'Switch to light mode');
</script>

<button
	type="button"
	class="theme-toggle"
	onclick={toggleTheme}
	aria-label={label}
	aria-pressed={isLight}
	title={label}
>
	<span class="theme-toggle__icon" aria-hidden="true">
		{#if isLight}
			<!-- Moon (currently in light mode → tap to go dark) -->
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
			<!-- Sun (currently in dark mode → tap to go light) -->
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

<style>
	.theme-toggle {
		min-width: 44px;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		border: 1px solid transparent;
		border-radius: 9999px;
		background: transparent;
		color: currentColor;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition:
			color 180ms cubic-bezier(0.4, 0, 0.2, 1),
			background-color 180ms cubic-bezier(0.4, 0, 0.2, 1),
			border-color 180ms cubic-bezier(0.4, 0, 0.2, 1),
			transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.theme-toggle:hover {
		/* currentColor-based so it works in both themes.
		   color-mix() with transparent gives a translucent tint of whatever
		   the parent text color is. Falls back to a neutral gray if
		   color-mix is unsupported (very old browsers). */
		background: color-mix(in oklab, currentColor 8%, transparent);
		border-color: color-mix(in oklab, currentColor 18%, transparent);
		transform: scale(1.04);
	}

	.theme-toggle:focus-visible {
		outline: none;
		border-color: color-mix(in oklab, currentColor 45%, transparent);
		box-shadow: 0 0 0 3px color-mix(in oklab, currentColor 22%, transparent);
	}

	.theme-toggle:active {
		transform: scale(0.96);
	}

	.theme-toggle__icon {
		display: inline-flex;
		width: 18px;
		height: 18px;
	}

	@media (prefers-reduced-motion: reduce) {
		.theme-toggle,
		.theme-toggle:hover,
		.theme-toggle:active {
			transition: none;
			transform: none;
		}
	}
</style>
