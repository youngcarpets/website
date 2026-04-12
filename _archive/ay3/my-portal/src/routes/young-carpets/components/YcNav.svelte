<!--
	YcNav — Young Carpets floating glass navbar.
	Static nav links + brand wordmark + theme toggle + scroll-to-hash on click.
	Extracted from +page.svelte on 2026-04-08 (v1.24.x refactor).
-->
<script lang="ts">
	import { scrollToHash } from '$lib/actions';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<nav class="yc-nav">
	<a href="/young-carpets" class="yc-nav-brand">
		<span class="yc-nav-brand-name">YOUNG</span>
	</a>
	<a class="yc-nav-link" href="#products" onclick={(e) => scrollToHash(e, '#products')}
		>Products</a
	>
	<a class="yc-nav-link" href="#what" onclick={(e) => scrollToHash(e, '#what')}>Services</a>
	<a class="yc-nav-link" href="#about" onclick={(e) => scrollToHash(e, '#about')}>About</a>
	<a class="yc-nav-link" href="#contact" onclick={(e) => scrollToHash(e, '#contact')}
		>Contact</a
	>
	<span class="yc-nav-divider" aria-hidden="true"></span>
	<ThemeToggle />
</nav>
