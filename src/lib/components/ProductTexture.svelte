<script lang="ts">
	import type { Product } from '$lib/content/products';

	interface Props {
		material: Product['material'];
	}

	let { material }: Props = $props();
</script>

{#if material === 'carpet-tile'}
	<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
		{#each [0, 1, 2] as row (row)}
			{#each [0, 1, 2] as col (col)}
				<rect
					x={10 + col * 28}
					y={10 + row * 28}
					width="24"
					height="24"
					rx="3"
					fill="none"
					stroke="currentColor"
					stroke-width="0.8"
				/>
			{/each}
		{/each}
	</svg>
{:else if material === 'lvt'}
	<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
		{#each [0, 1, 2, 3] as row (row)}
			{#each [0, 1] as col (col)}
				<rect
					x={12 + col * 40}
					y={8 + row * 24 + (col % 2 === 1 ? 12 : 0)}
					width="36"
					height="20"
					rx="2"
					fill="none"
					stroke="currentColor"
					stroke-width="0.7"
				/>
			{/each}
		{/each}
	</svg>
{:else if material === 'carpet'}
	<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
		{#each Array.from({ length: 12 }, (__, idx) => idx) as i (i)}
			<line
				x1={15 + i * 6}
				y1={85 - [38, 22, 45, 30, 48, 15, 42, 28, 50, 35, 20, 40][i]!}
				x2={15 + i * 6}
				y2="88"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
			/>
		{/each}
	</svg>
{:else if material === 'ceramic'}
	<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
		{#each [0, 1, 2] as row (row)}
			{#each [0, 1, 2] as col (col)}
				<rect
					x={10 + col * 28}
					y={10 + row * 28}
					width="24"
					height="24"
					rx="1"
					fill="none"
					stroke="currentColor"
					stroke-width="0.6"
					transform={row === 1 && col === 1 ? 'rotate(45 34 34)' : ''}
				/>
			{/each}
		{/each}
	</svg>
{:else if material === 'rubber'}
	<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
		{#each Array.from({ length: 36 }, (__, idx) => idx) as i (i)}
			<circle cx={15 + (i % 6) * 14} cy={15 + Math.floor(i / 6) * 14} r="2" fill="currentColor" />
		{/each}
	</svg>
{:else if material === 'matting'}
	<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
		{#each [0, 1, 2, 3] as row (row)}
			<line
				x1="10"
				y1={20 + row * 20}
				x2="90"
				y2={20 + row * 20}
				stroke="currentColor"
				stroke-width="1.5"
			/>
		{/each}
		{#each [0, 1, 2, 3] as col (col)}
			<line
				x1={20 + col * 20}
				y1="10"
				x2={20 + col * 20}
				y2="90"
				stroke="currentColor"
				stroke-width="1.5"
			/>
		{/each}
	</svg>
{:else if material === 'hardwood'}
	<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
		{#each [0, 1, 2, 3] as row (row)}
			<rect
				x="10"
				y={12 + row * 22}
				width={60 + row * 8}
				height="18"
				rx="2"
				fill="none"
				stroke="currentColor"
				stroke-width="0.7"
			/>
		{/each}
	</svg>
{:else if material === 'sheet'}
	<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
		<rect
			x="10"
			y="30"
			width="80"
			height="60"
			rx="2"
			fill="none"
			stroke="currentColor"
			stroke-width="0.7"
		/>
		<path d="M10 30 Q10 15 25 15 L25 30" fill="none" stroke="currentColor" stroke-width="0.7" />
		<line
			x1="50"
			y1="30"
			x2="50"
			y2="90"
			stroke="currentColor"
			stroke-width="0.5"
			stroke-dasharray="2 3"
		/>
	</svg>
{:else}
	<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
		<rect
			x="15"
			y="15"
			width="30"
			height="30"
			rx="3"
			fill="none"
			stroke="currentColor"
			stroke-width="0.7"
		/>
		<rect
			x="55"
			y="15"
			width="30"
			height="30"
			rx="3"
			fill="none"
			stroke="currentColor"
			stroke-width="0.7"
		/>
		<rect
			x="15"
			y="55"
			width="30"
			height="30"
			rx="3"
			fill="none"
			stroke="currentColor"
			stroke-width="0.7"
		/>
		<rect
			x="55"
			y="55"
			width="30"
			height="30"
			rx="3"
			fill="none"
			stroke="currentColor"
			stroke-width="0.7"
		/>
		<text x="50" y="54" text-anchor="middle" font-size="14" fill="currentColor">+</text>
	</svg>
{/if}
