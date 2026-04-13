<script lang="ts">
	interface Props {
		size?: 'hero' | 'footer';
		animated?: boolean;
		ready?: boolean;
		tag?: 'h1' | 'div' | 'span';
	}

	let { size = 'hero', animated = false, ready = false, tag = 'div' }: Props = $props();

	const LETTERS = ['Y', 'O', 'U', 'N', 'G'] as const;

	let wordmarkWidth = $state(0);
</script>

<div class="brand-mark brand-mark--{size}" class:brand-mark--ready={!animated || ready}>
	{#if tag === 'h1'}
		<h1
			class="brand-mark__wordmark"
			class:brand-mark__wordmark--animated={animated}
			class:brand-mark__wordmark--ready={animated && ready}
			aria-label="Young"
			bind:clientWidth={wordmarkWidth}
		>
			{#each LETTERS as ch, i (ch + i)}
				<span
					class="brand-mark__char"
					class:brand-mark__char--animated={animated}
					style="--young-i: {i};"
					aria-hidden="true">{ch}</span
				>
			{/each}
		</h1>
	{:else}
		<div class="brand-mark__wordmark" aria-label="Young" bind:clientWidth={wordmarkWidth}>
			{#each LETTERS as ch, i (ch + i)}
				<span class="brand-mark__char" style="--young-i: {i};" aria-hidden="true">{ch}</span>
			{/each}
		</div>
	{/if}
	{#if wordmarkWidth > 0}
		<svg
			class="brand-mark__subtitle"
			class:brand-mark__subtitle--animated={animated}
			class:brand-mark__subtitle--ready={animated && ready}
			viewBox="0 0 400 34"
			width={wordmarkWidth}
			role="img"
			aria-label="Commercial Flooring"
		>
			<text
				x="14"
				y="25"
				fill="currentColor"
				font-weight="500"
				textLength="340"
				lengthAdjust="spacing"
			>
				COMMERCIAL FLOORING
			</text>
			<g transform="translate(374, 16) scale(0.0063)">
				<path
					fill="currentColor"
					d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z"
				/>
			</g>
		</svg>
	{/if}
</div>

<style>
	.brand-mark {
		display: inline-flex;
		flex-direction: column;
		align-items: start;
		visibility: hidden;
	}

	.brand-mark--ready {
		visibility: visible;
		filter: drop-shadow(0 4px 24px rgba(0, 0, 0, 0.5));
	}

	.brand-mark__wordmark {
		font-family: var(--font-brand);
		font-weight: 400;
		line-height: 1.05;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		margin: 0;
		display: block;
		text-align: center;
		white-space: nowrap;
		color: rgba(240, 240, 242, 0.95);
	}

	.brand-mark__char {
		display: inline-block;
	}

	.brand-mark__char--animated {
		opacity: 0;
		transform: translateY(28px) scale(0.92);
	}

	.brand-mark__wordmark--ready .brand-mark__char--animated {
		animation: brandmark-letter-in 1000ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
		animation-delay: calc(var(--young-i, 0) * 120ms);
		will-change: transform, opacity;
	}

	@keyframes brandmark-letter-in {
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.brand-mark__subtitle {
		color: var(--color-text);
		opacity: 0.7;
		overflow: visible;
	}

	.brand-mark__subtitle--animated {
		opacity: 0;
		transform: translateY(8px);
	}

	.brand-mark__subtitle--ready {
		animation: brandmark-fade-up 600ms var(--ease-out) 800ms forwards;
	}

	@keyframes brandmark-fade-up {
		to {
			opacity: 0.7;
			transform: translateY(0);
		}
	}

	.brand-mark__subtitle text {
		font-family:
			-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
		font-size: 24px;
		font-weight: 500;
	}

	/* --- Hero size --- */

	.brand-mark--hero .brand-mark__wordmark {
		font-size: 5.5rem;
	}

	/* --- Footer size --- */

	.brand-mark--footer .brand-mark__wordmark {
		font-size: 1.5rem;
	}

	/* --- Responsive --- */

	@media (max-width: 768px) {
		.brand-mark--hero .brand-mark__wordmark {
			font-size: 3.75rem;
			letter-spacing: 0.12em;
		}
	}

	/* --- Reduced motion --- */

	@media (prefers-reduced-motion: reduce) {
		.brand-mark {
			visibility: visible;
		}
		.brand-mark__char,
		.brand-mark__char--animated,
		.brand-mark__wordmark--ready .brand-mark__char--animated {
			opacity: 1;
			transform: none;
			animation: none;
		}
		.brand-mark__subtitle,
		.brand-mark__subtitle--animated {
			opacity: 0.7;
			transform: none;
		}
		.brand-mark__subtitle--ready {
			animation: none;
		}
	}
</style>
