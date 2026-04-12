<script lang="ts">
	type Props = { subject: unknown };
	let { subject: _subject }: Props = $props();
</script>

<div class="ph">
	<div class="ph__halo"></div>
	<div class="ph__inner">
		<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<circle cx="12" cy="12" r="10"/>
			<path d="M8 12h8M12 8v8"/>
		</svg>
		<h3 class="ph__title">Coming soon</h3>
		<p class="ph__desc">This workspace is wired in but its tools are still being built.</p>
	</div>
</div>

<style>
	.ph {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100%;
		padding: 48px 24px;
		position: relative;
	}
	.ph__halo {
		position: absolute;
		inset: auto;
		width: 280px;
		height: 280px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(0, 194, 255, 0.10), transparent 60%);
		filter: blur(20px);
		pointer-events: none;
	}
	.ph__inner {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		text-align: center;
		color: rgba(0, 0, 0, 0.55);
	}
	.ph__title {
		margin: 4px 0 0;
		font-size: 1rem;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.78);
		letter-spacing: -0.01em;
	}
	.ph__desc {
		margin: 0;
		font-size: 0.8125rem;
		max-width: 280px;
		line-height: 1.5;
		color: rgba(0, 0, 0, 0.5);
	}
</style>
