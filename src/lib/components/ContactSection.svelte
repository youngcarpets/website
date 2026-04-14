<script lang="ts">
	import { teamGroups } from '$lib/content/team';

	let sectionEl: HTMLElement | undefined = $state();
	let visible = $state(false);

	$effect(() => {
		if (!sectionEl) return;
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						visible = true;
						io.disconnect();
					}
				}
			},
			{ threshold: 0.1 }
		);
		io.observe(sectionEl);
		return () => io.disconnect();
	});
</script>

<section id="contact" class="contact" aria-label="Contact" bind:this={sectionEl}>
	<h2 class="section-heading">Contact</h2>

	<div class="contact-team" class:contact-team--visible={visible}>
		{#each teamGroups as group (group.label)}
			<div class="contact-group">
				<h3 class="contact-group-label">{group.label}</h3>
				<ul class="contact-list">
					{#each group.members as member (member.email)}
						<li class="contact-row">
							<a href="mailto:{member.email}" class="contact-row-link">
								{#if member.note}
									<span class="contact-note">{member.note}</span>
								{/if}
								<span class="contact-name">{member.name}</span>
								{#if member.phone}
									<span class="contact-phone">{member.phone}</span>
								{/if}
								<span class="contact-email">{member.email}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>

	<div class="contact-map-wrapper" class:contact-map-wrapper--visible={visible}>
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
		max-width: 640px;
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

	/* ── Team ── */
	.contact-team {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
		opacity: 0;
		transform: translateY(12px);
		transition:
			opacity 600ms var(--ease-out),
			transform 600ms var(--ease-out);
	}

	.contact-team--visible {
		opacity: 1;
		transform: translateY(0);
	}

	.contact-group {
		background: rgba(18, 18, 21, 0.18);
		border: 1px solid var(--color-border-glass);
		backdrop-filter: blur(8px) saturate(1.4);
		-webkit-backdrop-filter: blur(8px) saturate(1.4);
		box-shadow: var(--glass-shadow);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.contact-group-label {
		font-family: var(--font-body);
		font-size: 0.65rem;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-text-subtle);
		padding: 0.75rem 0.875rem 0.5rem;
		margin: 0;
		border-bottom: 1px solid var(--color-border-glass);
	}

	.contact-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.contact-row-link {
		display: flex;
		flex-direction: column;
		padding: 0.5rem 0.65rem;
		text-decoration: none;
		min-height: 44px;
		justify-content: center;
		border-bottom: 1px solid var(--color-border-glass);
		user-select: text;
	}

	.contact-row:last-child .contact-row-link {
		border-bottom: none;
	}

	.contact-note {
		font-size: 0.6rem;
		color: var(--color-text-subtle);
		display: block;
	}

	.contact-name {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-text);
		line-height: 1.4;
	}

	.contact-phone,
	.contact-email {
		display: block;
		font-size: 0.65rem;
		color: var(--color-text-muted);
		font-feature-settings: 'tnum';
		line-height: 1.4;
	}

	/* ── Map ── */
	.contact-map-wrapper {
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border-glass);
		overflow: hidden;
		box-shadow: var(--glass-shadow);
		aspect-ratio: 16 / 9;
		position: relative;
		opacity: 0;
		transform: translateY(12px);
		transition:
			opacity 600ms var(--ease-out) 200ms,
			transform 600ms var(--ease-out) 200ms;
	}

	.contact-map-wrapper--visible {
		opacity: 1;
		transform: translateY(0);
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
		text-decoration: none;
	}

	@media (min-width: 521px) {
		.contact {
			padding: 4rem 1.5rem;
		}

		.contact-team {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.contact-team,
		.contact-map-wrapper {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
