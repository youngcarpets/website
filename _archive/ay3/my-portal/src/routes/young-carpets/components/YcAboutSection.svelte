<!--
	YcAboutSection — about copy + 2 stat counters.
	Counters use the countUp action which animates on scroll-into-view.
	Extracted from +page.svelte on 2026-04-08 (v1.24.x refactor).
-->
<script lang="ts">
	import { reveal, countUp } from '$lib/actions';
</script>

<section id="about" class="yc-section yc-section--about" use:reveal>
	<div class="yc-container">
		<p class="yc-section-eyebrow">Since 1991</p>
		<h2 class="yc-section-title">About</h2>
		<div class="yc-about-wrap">
			<p class="yc-about-text">
				Young Carpets Inc. has supplied and installed commercial flooring in Ottawa since 1991.
				The company works on commercial projects only &mdash; offices, institutional buildings,
				healthcare, retail, and industrial &mdash; across the National Capital Region.
			</p>
		</div>

		<div class="yc-stats">
			<div class="yc-stat">
				<div
					class="yc-stat-number"
					use:countUp
					data-target="250"
					data-suffix="+"
					aria-label="250 plus combined years of experience"
				>0+</div>
				<div class="yc-stat-label">
					Combined years of experience across our sales team.
				</div>
			</div>
			<div class="yc-stat">
				<div
					class="yc-stat-number"
					use:countUp
					data-target="50000"
					data-suffix="+"
					aria-label="50,000 plus commercial flooring jobs completed"
				>0+</div>
				<div class="yc-stat-label">
					Commercial flooring jobs completed across Ottawa and surrounding areas.
				</div>
			</div>
		</div>
	</div>
</section>
