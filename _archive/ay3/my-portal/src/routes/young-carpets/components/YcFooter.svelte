<!--
	YcFooter — Young Carpets site footer.
	Static brand block + 3 contact columns.
	v1.24.28 (2026-04-08): removed footer maple badge per user — was tied to
	iOS motion permission flow which triggered an unwanted Cloudflare-tunnel
	interaction on phone preview. Hero badge still owns the motion permission.
-->
<script lang="ts">
	import { dev } from '$app/environment';
</script>

<footer class="yc-footer">
	<div class="yc-container">
		{#if dev}
			<div class="yc-dev-versions">
				<a href="/young-carpets/dev/v7" class="yc-back-link">V7</a>
				<a href="/young-carpets/dev/v8" class="yc-back-link">V8</a>
				<a href="/young-carpets/dev/v9" class="yc-back-link">V9</a>
				<a href="/young-carpets/dev/v10" class="yc-back-link">V10</a>
				<a href="/young-carpets/dev/v11" class="yc-back-link">V11</a>
				<a href="/young-carpets/dev/v12" class="yc-back-link">V12</a>
			</div>
		{/if}
		<div class="yc-footer-grid">
			<div class="yc-footer-brand-block">
				<div class="yc-footer-brand">
					<span class="yc-footer-brand-name">YOUNG</span>
					<span class="yc-footer-brand-sub">Commercial Flooring</span>
				</div>
				</div>

			<div class="yc-footer-col">
				<p class="yc-footer-col-title">Visit</p>
				<address class="yc-footer-address">
					Unit 316 &mdash; 1228 Old Innes Road<br />
					Ottawa, ON K1B 3V3<br />
					Canada
				</address>
			</div>

			<div class="yc-footer-col">
				<p class="yc-footer-col-title">Contact</p>
				<ul class="yc-footer-list">
					<li>
						<span class="yc-footer-list-key">Phone</span>
						<a href="tel:+16137442744" class="yc-footer-list-val">613-744-2744</a>
					</li>
					<li>
						<span class="yc-footer-list-key">Fax</span>
						<span class="yc-footer-list-val">613-744-2995</span>
					</li>
					<li>
						<span class="yc-footer-list-key">Email</span>
						<a href="mailto:info@youngcarpets.com" class="yc-footer-list-val"
							>info@youngcarpets.com</a
						>
					</li>
					<li>
						<span class="yc-footer-list-key">AP</span>
						<a href="mailto:ap@youngcarpets.com" class="yc-footer-list-val"
							>ap@youngcarpets.com</a
						>
					</li>
				</ul>
			</div>

			<div class="yc-footer-col">
				<p class="yc-footer-col-title">Hours</p>
				<ul class="yc-footer-list">
					<li>
						<span class="yc-footer-list-key">Office</span>
						<span class="yc-footer-list-val">Mon&ndash;Fri 7:00&thinsp;&ndash;&thinsp;16:00</span>
					</li>
					<li>
						<span class="yc-footer-list-key">Installation</span>
						<span class="yc-footer-list-val">24/7, 365</span>
					</li>
				</ul>
			</div>
		</div>

		<div class="yc-footer-bottom">
			<p class="yc-footer-copy">&copy; 2026 Young Carpets Inc.</p>
			<a href="/" class="yc-back-link">&larr; Portal</a>
		</div>
	</div>
</footer>
