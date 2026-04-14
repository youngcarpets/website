<script lang="ts">
	import { teamGroups } from '$lib/content/team';
	import { illuminateOnScroll } from '$lib/actions/illuminateOnScroll';

	const salesMembers = teamGroups.find((g) => g.label === 'Sales')!.members;
	const accountingMembers = teamGroups.find((g) => g.label === 'Accounting')!.members;

	let salesGridEl: HTMLElement | undefined = $state();
	let accountingEl: HTMLElement | undefined = $state();
	let salesVisible = $state(false);
	let accountingVisible = $state(false);

	$effect(() => {
		if (!salesGridEl) return;
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						salesVisible = true;
						io.disconnect();
					}
				}
			},
			{ threshold: 0.15 }
		);
		io.observe(salesGridEl);
		return () => io.disconnect();
	});

	$effect(() => {
		if (!accountingEl) return;
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						accountingVisible = true;
						io.disconnect();
					}
				}
			},
			{ threshold: 0.15 }
		);
		io.observe(accountingEl);
		return () => io.disconnect();
	});
</script>

<section id="contact" class="contact" aria-label="Contact">
	<h2 class="section-heading">Contact</h2>

	<h3 class="sales-label">Sales</h3>
	<div class="sales-grid" bind:this={salesGridEl}>
		{#each salesMembers as member, i (member.email)}
			<a
				href="mailto:{member.email}"
				class="contact-card"
				class:contact-card--visible={salesVisible}
				style:transition-delay="{salesVisible ? i * 70 : 0}ms"
				use:illuminateOnScroll
			>
				<span class="card-name">{member.name}</span>
				<span class="card-phone">{member.phone}</span>
				<span class="card-email">{member.email}</span>
			</a>
		{/each}
	</div>

	<div class="info-row" bind:this={accountingEl}>
		<a
			href="mailto:info@youngcarpets.com"
			class="contact-card company-card"
			class:contact-card--visible={accountingVisible}
			use:illuminateOnScroll
		>
			<span class="card-label">Head Office</span>
			<span class="card-name">Young Carpets Inc.</span>
			<span class="card-phone">Unit 316 - 1228 Old Innes Rd</span>
			<span class="card-phone">Ottawa, ON K1B 3V3</span>
			<span class="card-phone">Canada</span>
			<span class="card-phone" style="margin-top: 0.25rem">613-744-2744</span>
			<span class="card-email">info@youngcarpets.com</span>
		</a>
		<div
			class="contact-card accounting-card"
			class:contact-card--visible={accountingVisible}
			style:transition-delay="{accountingVisible ? 70 : 0}ms"
			use:illuminateOnScroll
		>
			<span class="card-label">Accounting</span>
			{#each accountingMembers as member (member.email)}
				<a href="mailto:{member.email}" class="accounting-row">
					{#if member.note}
						<span class="card-note">{member.note}</span>
					{/if}
					<span class="card-name">{member.name}</span>
					{#if member.phone}
						<span class="card-phone">{member.phone}</span>
					{/if}
					<span class="card-email">{member.email}</span>
				</a>
			{/each}
		</div>
	</div>

	<div class="contact-map-wrapper" class:contact-map-wrapper--visible={accountingVisible}>
		<iframe
			src="https://www.google.com/maps?q=1228+Old+Innes+Rd,+Ottawa,+ON+K1B+3V3&output=embed"
			title="Young Carpets location"
			loading="lazy"
			referrerpolicy="no-referrer-when-downgrade"
			class="contact-map"
		></iframe>
		<a
			href="https://maps.google.com/?q=1228+Old+Innes+Rd,+Ottawa,+ON+K1B+3V3"
			target="_blank"
			rel="noopener noreferrer"
			class="contact-map-link">View larger map &rarr;</a
		>
	</div>
</section>

<style>
	.contact {
		padding: 2rem 0.75rem;
		max-width: 720px;
		margin: 0 auto;
		scroll-margin-top: 5rem;
	}

	.section-heading {
		font-family: var(--font-body);
		font-size: 1.5rem;
		font-weight: 200;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: var(--color-text);
		text-align: center;
		margin-bottom: 1rem;
	}

	.sales-label {
		font-family: var(--font-body);
		font-size: 0.65rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-text-subtle);
		margin: 0 0 0.375rem 0.25rem;
	}

	/* ── Sales grid ── */
	.sales-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.contact-card {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0.75rem 0.875rem;
		min-height: 80px;
		text-decoration: none;
		border-radius: var(--radius-lg);
		background: rgba(18, 18, 21, 0.55);
		border: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(24px) saturate(1.8);
		-webkit-backdrop-filter: blur(24px) saturate(1.8);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.08),
			0 8px 24px rgba(0, 0, 0, 0.45);
		opacity: 0;
		translate: 0 12px;
		transition:
			background var(--base) var(--ease-out),
			border-color var(--base) var(--ease-out),
			transform var(--base) var(--ease-out),
			box-shadow var(--base) var(--ease-out),
			opacity var(--slow) var(--ease-out),
			translate var(--slow) var(--ease-out);
	}

	.contact-card--visible {
		opacity: 1;
		translate: 0 0;
	}

	@media (hover: hover) {
		.contact-card:hover {
			background: rgba(var(--color-accent-rgb), 0.08);
			border-color: rgba(var(--color-accent-rgb), 0.35);
			transform: translateY(-2px);
			box-shadow:
				inset 0 1px 0 rgba(255, 255, 255, 0.12),
				0 12px 32px rgba(0, 0, 0, 0.55),
				0 0 0 1px rgba(var(--color-accent-rgb), 0.15);
		}
	}

	.contact-card:global(.illuminated) {
		box-shadow: var(--glass-shadow), var(--illuminate-glow);
		border-color: rgba(var(--illuminate-color), 0.3);
	}

	.contact-card:global(.illuminated) .card-name {
		opacity: 1;
	}

	.contact-card:global(.illuminated) .card-phone,
	.contact-card:global(.illuminated) .card-email {
		color: var(--color-text);
		opacity: 0.7;
	}

	.contact-card:focus-visible {
		background: rgba(var(--color-accent-rgb), 0.08);
		border-color: rgba(var(--color-accent-rgb), 0.35);
		outline: 2px solid rgba(var(--color-accent-rgb), 0.7);
		outline-offset: 2px;
	}

	.contact-card:active {
		transform: translateY(0);
		background: rgba(var(--color-accent-rgb), 0.12);
	}

	/* ── Info row (company + accounting side by side) ── */
	.info-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.company-card,
	.accounting-card {
		min-height: auto;
		justify-content: flex-start;
	}

	.card-label {
		font-size: 0.55rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-text-subtle);
		margin-bottom: 0.375rem;
	}

	/* ── Accounting ── */
	.accounting-row {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		padding: 0.375rem 0;
		min-height: 24px;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: var(--radius-sm);
	}

	.accounting-row:first-of-type {
		border-top: none;
	}

	.accounting-row:focus-visible {
		outline: 2px solid rgba(var(--color-accent-rgb), 0.7);
		outline-offset: 2px;
	}

	@media (hover: hover) {
		.accounting-row:hover .card-name {
			color: rgba(var(--color-accent-rgb), 0.9);
		}
	}

	/* ── Shared text styles ── */
	.card-note {
		font-size: 0.6rem;
		color: var(--color-text-subtle);
		display: block;
	}

	.card-name {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-text);
		line-height: 1.4;
	}

	.card-phone,
	.card-email {
		display: block;
		font-size: 0.65rem;
		color: var(--color-text-muted);
		font-feature-settings: 'tnum';
		line-height: 1.4;
	}

	/* ── Map ── */
	.contact-map-wrapper {
		margin-top: 0.5rem;
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border-glass);
		overflow: hidden;
		box-shadow: var(--glass-shadow);
		aspect-ratio: 16 / 9;
		position: relative;
		opacity: 0;
		translate: 0 12px;
		transition:
			opacity var(--slow) var(--ease-out) 200ms,
			translate var(--slow) var(--ease-out) 200ms;
	}

	.contact-map-wrapper--visible {
		opacity: 1;
		translate: 0 0;
	}

	.contact-map {
		width: 100%;
		height: 100%;
		border: none;
		display: block;
	}

	.contact-map-link {
		position: absolute;
		bottom: 0.5rem;
		right: 0.5rem;
		font-size: 0.65rem;
		color: var(--color-text-muted);
		background: rgba(11, 11, 13, 0.85);
		border: 1px solid var(--color-border-glass);
		border-radius: var(--radius-sm);
		padding: 0.25rem 0.5rem;
		min-height: 24px;
		text-decoration: none;
	}

	.contact-map-link:focus-visible {
		outline: 2px solid rgba(var(--color-accent-rgb), 0.7);
		outline-offset: 2px;
	}

	@media (min-width: 521px) {
		.contact {
			padding: 4rem 1.5rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.contact-card,
		.contact-map-wrapper {
			opacity: 1;
			translate: 0 0;
			transition: none;
		}

		.contact-card:hover {
			transform: none;
		}
	}
</style>
