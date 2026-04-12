<!--
	YcServicesSection — 4-card services section.
	Pure leaf — fully static. Card hover tilt via cardPointer action.
	Extracted from +page.svelte on 2026-04-08 (v1.24.x refactor).
-->
<script lang="ts">
	import { reveal, cardPointer } from '$lib/actions';
</script>

<section id="what" class="yc-section yc-section--services" use:reveal>
	<div class="yc-container">
		<p class="yc-section-eyebrow">Supply &middot; Installation &middot; Maintenance</p>
		<h2 class="yc-section-title">Services</h2>
		<div class="yc-grid-services">
			<div class="yc-card" use:cardPointer>
				<span class="yc-card-shine" aria-hidden="true"></span>
				<h3>Commercial Installation</h3>
				<p>
					From new construction to renovations &mdash; offices, schools,
					healthcare facilities, retail spaces, gyms, and industrial buildings.
				</p>
			</div>
			<div class="yc-card" use:cardPointer>
				<span class="yc-card-shine" aria-hidden="true"></span>
				<h3>Consultation</h3>
				<p>
					Material selection and specification for commercial projects, with
					sample boards and on-site mockups for design teams.
				</p>
			</div>
			<div class="yc-card" use:cardPointer>
				<span class="yc-card-shine" aria-hidden="true"></span>
				<h3>Maintenance &amp; Repair</h3>
				<p>
					Hardwood maintenance, screening and recoats, repairs, and full
					replacement across the National Capital Region.
				</p>
			</div>
			<div class="yc-card" use:cardPointer>
				<span class="yc-card-shine" aria-hidden="true"></span>
				<h3>Seasonal Matting</h3>
				<p>
					We remove and store your entrance matting at the end of winter,
					then return it when the season comes back around.
				</p>
			</div>
		</div>
		<p class="yc-services-tagline">Flooring &mdash; we got you covered.</p>
	</div>
</section>
