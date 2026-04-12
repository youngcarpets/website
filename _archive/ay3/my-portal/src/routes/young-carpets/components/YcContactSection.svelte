<!--
	YcContactSection — sales/accounting/office team roster with click-to-call
	and click-to-email links.
	Extracted from +page.svelte on 2026-04-08 (v1.24.x refactor).
-->
<script lang="ts">
	import { reveal, cardPointer } from '$lib/actions';
	import { teamGroups } from '../data/team';
</script>

<section id="contact" class="yc-section yc-section--contact" use:reveal>
	<div class="yc-container">
		<p class="yc-section-eyebrow">Get In Touch</p>
		<h2 class="yc-section-title">Our Team</h2>

		{#each teamGroups as group (group.label)}
			<div class="yc-team-group">
				<h3 class="yc-team-group-title">{group.label}</h3>
				<ul class="yc-team-list">
					{#each group.rows as row, ri (ri)}
						<li class="yc-team-row" use:cardPointer style="--i: {ri}">
							<span class="yc-card-shine" aria-hidden="true"></span>
							<div class="yc-team-name">
								{#if 'note' in row && row.note}
									<span class="yc-team-name-note">{row.note}</span>
								{/if}
								{row.name}
							</div>
							{#if row.phone}
								<a
									class="yc-team-phone"
									href={`tel:${row.phone.replace(/[^0-9+]/g, '')}`}
									aria-label={`Call ${row.name} at ${row.phone}`}
								>
									{row.phone}
								</a>
							{:else}
								<span class="yc-team-phone yc-team-phone--empty"></span>
							{/if}
							{#if row.email}
								<a
									class="yc-team-email"
									href={`mailto:${row.email}`}
									aria-label={`Email ${row.name} at ${row.email}`}
								>
									{row.email}
								</a>
							{:else}
								<span class="yc-team-email yc-team-email--empty"></span>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>
