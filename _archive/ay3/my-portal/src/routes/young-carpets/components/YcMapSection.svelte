<!--
	YcMapSection — "Find Us" location section with embed iframe preview that
	opens a fullscreen map modal on click. The modal itself stays in +page.svelte
	(it owns mapModalOpen state). This component just renders the preview tile.
	Extracted from +page.svelte on 2026-04-08 (v1.24.x refactor).
-->
<script lang="ts">
	import { reveal } from '$lib/actions';

	type Props = {
		onOpen: () => void;
	};

	let { onOpen }: Props = $props();
</script>

<section id="map" class="yc-map-section" use:reveal>
	<div class="yc-container">
		<p class="yc-section-eyebrow">Find Us</p>
		<h2 class="yc-section-title">Our Location</h2>
		<p class="yc-map-address">
			Unit 316 &mdash; 1228 Old Innes Road, Ottawa, ON K1B 3V3
		</p>

		<button
			type="button"
			class="yc-map-preview"
			onclick={onOpen}
			aria-label="Open larger map of Young Carpets Inc."
		>
			<iframe
				class="yc-map-preview-iframe"
				title="Young Carpets Inc. — preview"
				src="https://www.google.com/maps?q=1228+Old+Innes+Rd+Unit+316+Ottawa+ON+K1B+3V3&output=embed&z=15"
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
				tabindex="-1"
				aria-hidden="true"
			></iframe>
			<span class="yc-map-preview-overlay" aria-hidden="true">
				<span class="yc-map-preview-pill">Tap to expand</span>
			</span>
		</button>
	</div>
</section>
