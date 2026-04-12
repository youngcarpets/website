<!--
	YcMapModal — fullscreen map modal opened by YcMapSection's preview tile.
	State (open/close) lives in the parent — this component is purely presentational.
	Extracted from +page.svelte on 2026-04-08 (v1.24.x refactor).
-->
<script lang="ts">
	type Props = {
		open: boolean;
		onClose: () => void;
	};

	let { open, onClose }: Props = $props();
</script>

{#if open}
	<div
		class="yc-modal yc-map-modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="yc-map-modal-title"
		onclick={onClose}
	>
		<div
			class="yc-modal-body yc-map-modal-body"
			onclick={(e) => e.stopPropagation()}
			role="document"
		>
			<button
				type="button"
				class="yc-modal-close"
				onclick={onClose}
				aria-label="Close map"
			>
				&times;
			</button>
			<h3 id="yc-map-modal-title" class="yc-modal-title yc-modal-title--map">Our Location</h3>
			<div class="yc-map-modal-frame">
				<iframe
					title="Young Carpets Inc. — Ottawa location, full map"
					src="https://www.google.com/maps?q=1228+Old+Innes+Rd+Unit+316+Ottawa+ON+K1B+3V3&output=embed&z=16"
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					allowfullscreen
				></iframe>
			</div>
			<div class="yc-map-modal-panel">
				<p class="yc-map-modal-address">
					Unit 316 &mdash; 1228 Old Innes Road<br />
					Ottawa, ON K1B 3V3
				</p>
				<div class="yc-modal-cta">
					<a
						href="https://www.google.com/maps/dir/?api=1&destination=1228+Old+Innes+Rd+Unit+316+Ottawa+ON+K1B+3V3"
						target="_blank"
						rel="noopener noreferrer"
						class="yc-modal-cta-btn"
					>
						Directions
					</a>
					<a href="tel:+16137442744" class="yc-modal-cta-btn yc-modal-cta-btn--ghost">
						Call 613-744-2744
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}
