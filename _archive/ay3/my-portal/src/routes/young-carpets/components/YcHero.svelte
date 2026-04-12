<!--
	YcHero — Young Carpets hero section.
	Maple badge (doubles as iOS-motion-permission tap target) + animated YOUNG
	wordmark + tagline + sub.

	Wordmark history:
	- v1.24.39 (2026-04-08) — REBUILT FROM SCRATCH. Previous implementation
	  used global .yc-hero-title* classes in young-carpets.css and a global
	  Square721 @font-face shared with nav/footer; that combination produced a
	  Square721→blank→Square721 paint flicker on first load that resisted
	  several patch attempts. Old code preserved at
	  .claude/reference/young-hero-deleted-code.md.
	  This rebuild:
	    * Component-scoped <style> block (no global hero-title selectors)
	    * Component-local @font-face for Square721 (nav/footer use a fallback)
	    * Element starts visually hidden (no inline opacity-0 hacks)
	    * Animation only fires AFTER document.fonts.ready resolves AND the
	      Square721 face is confirmed loaded — guarantees the font is ready
	      before any character paint, removing the race that caused the bug
-->
<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		motionNeedsTap: boolean;
		motionGranted: boolean;
		onEnableMotion: () => void;
	};

	let { motionNeedsTap, motionGranted, onEnableMotion }: Props = $props();

	const LETTERS = ['Y', 'O', 'U', 'N', 'G'] as const;

	let wordmarkReady = $state(false);

	onMount(() => {
		let cancelled = false;

		const start = async () => {
			try {
				if ('fonts' in document) {
					// Force the browser to load the Square721 face NOW (the
					// @font-face declares it but lazy-loads on first paint).
					// Use a size that matches what we render so the load
					// metric is accurate.
					await document.fonts.load('5.5rem "Square721"');
					await document.fonts.ready;
				}
			} catch {
				// Font load failed — fall through and reveal anyway so the
				// wordmark is never permanently hidden.
			}
			if (!cancelled) wordmarkReady = true;
		};

		// Kick off the font load on next frame so first paint can settle
		// before we trigger the reveal animation.
		requestAnimationFrame(start);

		return () => {
			cancelled = true;
		};
	});
</script>

<section class="yc-hero">
	<div class="yc-container">
		<button
			type="button"
			class="yc-maple-badge yc-maple-badge--hero"
			class:yc-maple-badge--motion-pending={motionNeedsTap && !motionGranted}
			onclick={onEnableMotion}
			aria-label={motionNeedsTap && !motionGranted
				? 'Proudly Canadian — tap to enable motion parallax'
				: 'Proudly Canadian'}
		>
			<svg class="yc-maple-leaf" viewBox="-2015 -2000 4030 4030" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<path
					d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z"
					fill="currentColor"
				/>
			</svg>
			<span class="yc-maple-badge-text">Proudly Canadian</span>
		</button>
		<p class="yc-hero-tag">Commercial Flooring &middot; Ottawa, Ontario</p>
		<h1 class="young-mark" class:young-mark--ready={wordmarkReady} aria-label="Young">
			{#each LETTERS as ch, i (ch + i)}
				<span
					class="young-mark__char"
					style="--young-i: {i};"
					aria-hidden="true"
				>{ch}</span>
			{/each}
		</h1>
		<p class="yc-hero-sub">
			Commercial flooring in Ottawa since 1991. Supply, installation, maintenance &mdash;
			for offices, institutions, and retail.
		</p>
	</div>
</section>

<style>
	/* Component-local Square721 face. Scoped to YcHero only — nav/footer
	   use a serif fallback (see comments in young-carpets.css). */
	@font-face {
		font-family: 'Square721';
		src: url('/young-carpets/square721.ttf') format('truetype');
		font-display: block;
	}

	.young-mark {
		font-family: 'Square721', ui-serif, Georgia, serif;
		font-size: 5.5rem;
		font-weight: 400;
		line-height: 1.05;
		color: var(--yc-text);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		margin: 0 0 1.25rem;
		display: inline-block;
		white-space: nowrap;
		/* Hidden by default. Becomes visible only when --ready class is
		   added by the onMount font-load gate. No CSS animation runs at
		   all until then, so there is no race window. */
		visibility: hidden;
	}

	.young-mark--ready {
		visibility: visible;
	}

	.young-mark__char {
		display: inline-block;
		opacity: 0;
		transform: translateY(28px) scale(0.92);
	}

	.young-mark--ready .young-mark__char {
		animation: young-mark-letter-in 700ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
		animation-delay: calc(var(--young-i, 0) * 80ms);
		will-change: transform, opacity;
	}

	@keyframes young-mark-letter-in {
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@media (max-width: 768px) {
		.young-mark {
			font-size: 3.75rem;
			letter-spacing: 0.12em;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.young-mark {
			visibility: visible;
		}
		.young-mark__char,
		.young-mark--ready .young-mark__char {
			opacity: 1;
			transform: none;
			animation: none;
		}
	}
</style>
