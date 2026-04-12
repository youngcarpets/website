<script lang="ts">
	let {}: Record<string, never> = $props();
</script>

<div class="grid">
	<article class="card">
		<div class="card__accent"></div>
		<div class="card__body">
			<div class="card__label">Customer</div>
			<div class="card__title">Acme Corp</div>
			<div class="card__meta">12 invoices · $24,580 outstanding</div>
		</div>
	</article>

	<article class="card">
		<div class="card__accent"></div>
		<div class="card__body">
			<div class="card__label">Revenue</div>
			<div class="card__title">$48,212</div>
			<div class="card__meta">+12% from last month</div>
		</div>
	</article>

	<article class="card">
		<div class="card__accent"></div>
		<div class="card__body">
			<div class="card__label">Team</div>
			<div class="card__title">8 employees</div>
			<div class="card__meta">3 active shifts</div>
		</div>
	</article>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
		padding: 1rem 0;
		max-width: 720px;
		margin: 0 auto;
	}

	.card {
		position: relative;
		background: color-mix(in srgb, var(--c-accent, #00C2FF) var(--c-tint, 6%), var(--surface-card));
		backdrop-filter: blur(var(--c-blur, 20px)) saturate(var(--c-sat, 130%));
		-webkit-backdrop-filter: blur(var(--c-blur, 20px)) saturate(var(--c-sat, 130%));
		border: 1px solid color-mix(in srgb, var(--c-accent, #00C2FF) var(--c-border, 12%), transparent);
		border-radius: var(--c-radius, 20px);
		padding: var(--c-pad, 20px);
		box-shadow:
			0 calc(var(--c-shadow, 16px) / 4) calc(var(--c-shadow, 16px)) rgba(0, 0, 0, 0.18),
			0 0 var(--c-glow, 30px) color-mix(in srgb, var(--c-accent, #00C2FF) 22%, transparent);
		overflow: hidden;
		transition: transform 350ms var(--ease-apple);
	}

	.card:active,
	.card:hover {
		transform: translateY(-2px);
	}

	.card__accent {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--c-accent, #00C2FF);
		box-shadow: 0 0 12px var(--c-accent, #00C2FF);
	}

	.card__body {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.card__label {
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-tertiary);
	}

	.card__title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary);
		letter-spacing: -0.01em;
	}

	.card__meta {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		margin-top: 0.25rem;
	}
</style>
