<script lang="ts">
	import bg from '$lib/assets/hero/bg.jpg?enhanced';
</script>

<svelte:head>
	<title>Young Carpets</title>
	<meta name="description" content="Young Carpets — flooring in Ontario." />
</svelte:head>

<section class="hero">
	<enhanced:img src={bg} alt="" class="hero-bg" />
	<h1>hello</h1>
</section>

<style>
	.hero {
		position: relative;
		min-height: 70vh;
		display: grid;
		place-items: center;
		overflow: hidden;
	}
	.hero :global(.hero-bg) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		z-index: 0;
	}
	.hero h1 {
		position: relative;
		z-index: 1;
	}
</style>
