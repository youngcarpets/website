<script lang="ts">
	let { title = 'AY3 Portal' }: { title?: string } = $props();
</script>

<div class="canvas-frame">
	<nav class="floating-navbar">
		<div class="floating-navbar__inner">
			<div class="floating-navbar__brand">
				<div class="floating-navbar__logo"></div>
				{title}
			</div>
			<div class="floating-navbar__links">
				<a href="#dashboard">Dashboard</a>
				<a href="#customers">Customers</a>
				<a href="#invoices">Invoices</a>
			</div>
			<button class="floating-navbar__cta">Sign in</button>
		</div>
	</nav>
	<div class="canvas-frame__content">
		<p>Page content scrolls beneath the floating navbar →</p>
	</div>
</div>

<style>
	.canvas-frame {
		position: relative;
		height: 320px;
		border-radius: 16px;
		overflow: hidden;
		background: var(--surface);
		transform: translateZ(0);
	}

	.canvas-frame__content {
		padding: 80px 24px 24px;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.floating-navbar {
		position: absolute;
		top: 12px;
		left: 12px;
		right: 12px;
		z-index: 10;
		background: color-mix(in srgb, var(--c-accent, #00C2FF) var(--c-tint, 8%), var(--surface-card));
		backdrop-filter: blur(var(--c-blur, 24px)) saturate(1.4);
		-webkit-backdrop-filter: blur(var(--c-blur, 24px)) saturate(1.4);
		border: 1px solid color-mix(in srgb, var(--c-accent, #00C2FF) 25%, var(--border-medium));
		border-radius: var(--c-radius, 9999px);
		box-shadow:
			0 4px 24px rgba(0, 0, 0, 0.25),
			0 0 var(--c-glow, 24px) color-mix(in srgb, var(--c-accent, #00C2FF) 30%, transparent);
		transition: box-shadow 350ms var(--ease-apple);
	}

	.floating-navbar:hover {
		box-shadow:
			0 4px 24px rgba(0, 0, 0, 0.25),
			0 0 calc(var(--c-glow, 24px) * 1.6) color-mix(in srgb, var(--c-accent, #00C2FF) 50%, transparent);
	}

	.floating-navbar__inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--c-pad, 10px) calc(var(--c-pad, 10px) + 4px) var(--c-pad, 10px) calc(var(--c-pad, 10px) * 2);
		gap: 1.5rem;
	}

	.floating-navbar__brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.floating-navbar__logo {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: var(--c-accent, #00C2FF);
		box-shadow: 0 0 12px color-mix(in srgb, var(--c-accent, #00C2FF) 70%, transparent);
	}

	.floating-navbar__links {
		display: flex;
		gap: 1.25rem;
	}

	.floating-navbar__links a {
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-secondary);
		text-decoration: none;
		transition: color 200ms;
	}

	.floating-navbar__links a:hover {
		color: var(--c-accent, #00C2FF);
	}

	.floating-navbar__cta {
		padding: 0.5rem 1rem;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--surface);
		background: var(--c-accent, #00C2FF);
		border: none;
		border-radius: 9999px;
		cursor: pointer;
		box-shadow: 0 0 16px color-mix(in srgb, var(--c-accent, #00C2FF) 40%, transparent);
	}
</style>
