<!--
	DevColorPicker — floating palette overlay for dev pages.
	Lets the user swap core CSS custom properties (background, accent, text)
	to quickly preview alternate color schemes across any page.
	Dev-only. Created 2026-04-09 (v1.24.x).
-->
<script lang="ts">
	let open = $state(false);
	let posX = $state(0);
	let posY = $state(0);
	let dragging = $state(false);
	let dragOffset = { x: 0, y: 0 };
	let hasMoved = $state(false);
	let dcpEl: HTMLDivElement | null = $state(null);

	function onPointerDown(e: PointerEvent) {
		if (open) { open = false; return; } // close panel on click when open
		dragging = true;
		hasMoved = false;
		const rect = dcpEl!.getBoundingClientRect();
		dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	}
	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		hasMoved = true;
		posX = Math.max(0, Math.min(window.innerWidth - 52, e.clientX - dragOffset.x));
		posY = Math.max(0, Math.min(window.innerHeight - 52, e.clientY - dragOffset.y));
	}
	function onPointerUp() {
		dragging = false;
		if (!hasMoved) open = !open;
	}

	type Palette = {
		name: string;
		bg: string;
		text: string;
		muted: string;
		accent: string;
		accentBg: string;
		card: string;
		border: string;
	};

	const palettes: Palette[] = [
		{
			name: 'Default (Griege + Gold)',
			bg: '#080706',
			text: '#c2b39a',
			muted: 'rgba(194,179,154,0.6)',
			accent: '#ffe27a',
			accentBg: 'rgba(255,226,122,0.10)',
			card: 'rgba(8,7,6,0.45)',
			border: 'rgba(194,179,154,0.2)'
		},
		{
			name: 'Midnight Blue',
			bg: '#0a0e1a',
			text: '#b0bec5',
			muted: 'rgba(176,190,197,0.6)',
			accent: '#64b5f6',
			accentBg: 'rgba(100,181,246,0.10)',
			card: 'rgba(10,14,26,0.55)',
			border: 'rgba(176,190,197,0.18)'
		},
		{
			name: 'Forest',
			bg: '#070d08',
			text: '#a8c0a0',
			muted: 'rgba(168,192,160,0.6)',
			accent: '#81c784',
			accentBg: 'rgba(129,199,132,0.10)',
			card: 'rgba(7,13,8,0.50)',
			border: 'rgba(168,192,160,0.18)'
		},
		{
			name: 'Warm Charcoal',
			bg: '#1a1412',
			text: '#d4c4b0',
			muted: 'rgba(212,196,176,0.6)',
			accent: '#ff8a65',
			accentBg: 'rgba(255,138,101,0.10)',
			card: 'rgba(26,20,18,0.50)',
			border: 'rgba(212,196,176,0.18)'
		},
		{
			name: 'Slate + Rose',
			bg: '#12111a',
			text: '#c5c0d0',
			muted: 'rgba(197,192,208,0.6)',
			accent: '#f48fb1',
			accentBg: 'rgba(244,143,177,0.10)',
			card: 'rgba(18,17,26,0.50)',
			border: 'rgba(197,192,208,0.18)'
		},
		{
			name: 'Cream + Navy',
			bg: '#faf7f0',
			text: '#1d1d1f',
			muted: '#5a5249',
			accent: '#1a3a5c',
			accentBg: 'rgba(26,58,92,0.08)',
			card: 'rgba(255,255,255,0.85)',
			border: 'rgba(90,77,53,0.15)'
		},
		{
			name: 'Pure White + Black',
			bg: '#ffffff',
			text: '#111111',
			muted: '#555555',
			accent: '#000000',
			accentBg: 'rgba(0,0,0,0.05)',
			card: 'rgba(245,245,245,0.9)',
			border: 'rgba(0,0,0,0.12)'
		},
		{
			name: 'Olive + Brass',
			bg: '#0d0e08',
			text: '#b8b298',
			muted: 'rgba(184,178,152,0.6)',
			accent: '#c9a84c',
			accentBg: 'rgba(201,168,76,0.10)',
			card: 'rgba(13,14,8,0.50)',
			border: 'rgba(184,178,152,0.18)'
		}
	];

	let activePalette: Palette | null = $state(null);

	function apply(p: Palette) {
		activePalette = p;
		const root = document.documentElement;
		root.style.setProperty('--dev-bg', p.bg);
		root.style.setProperty('--dev-text', p.text);
		root.style.setProperty('--dev-muted', p.muted);
		root.style.setProperty('--dev-accent', p.accent);
		root.style.setProperty('--dev-accent-bg', p.accentBg);
		root.style.setProperty('--dev-card', p.card);
		root.style.setProperty('--dev-border', p.border);
		root.classList.add('dev-palette-active');
	}

	function reset() {
		activePalette = null;
		const root = document.documentElement;
		root.style.removeProperty('--dev-bg');
		root.style.removeProperty('--dev-text');
		root.style.removeProperty('--dev-muted');
		root.style.removeProperty('--dev-accent');
		root.style.removeProperty('--dev-accent-bg');
		root.style.removeProperty('--dev-card');
		root.style.removeProperty('--dev-border');
		root.classList.remove('dev-palette-active');
	}
</script>

<div
	class="dcp"
	class:dcp--open={open}
	class:dcp--placed={hasMoved}
	bind:this={dcpEl}
	style={hasMoved ? `left:${posX}px;top:${posY}px;` : ''}
>
	<button
		type="button"
		class="dcp-toggle"
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		aria-label={open ? 'Close color picker' : 'Open color picker'}
	>
		{open ? '✕' : '🎨'}
	</button>

	{#if open}
		<div class="dcp-panel">
			<p class="dcp-title">Palette</p>
			<button
				type="button"
				class="dcp-swatch dcp-swatch--reset"
				class:dcp-swatch--active={!activePalette}
				onclick={reset}
			>
				Reset
			</button>
			{#each palettes as p}
				<button
					type="button"
					class="dcp-swatch"
					class:dcp-swatch--active={activePalette === p}
					onclick={() => apply(p)}
				>
					<span class="dcp-dot" style="background:{p.bg}; border-color:{p.accent}"></span>
					<span class="dcp-dot" style="background:{p.accent}"></span>
					<span class="dcp-label">{p.name}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.dcp {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		touch-action: none;
		z-index: 10000;
		font-family: ui-monospace, 'SF Mono', monospace;
	}
	.dcp-toggle {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: 1px solid rgba(194,179,154,0.3);
		background: rgba(8,7,6,0.85);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		color: #ffe27a;
		font-size: 1.1rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 16px rgba(0,0,0,0.3);
		transition: transform 200ms, background 200ms;
	}
	.dcp-toggle {
		cursor: grab;
	}
	.dcp-toggle:hover {
		transform: scale(1.1);
	}
	.dcp--placed {
		bottom: auto;
		right: auto;
	}
	.dcp-panel {
		position: absolute;
		bottom: 54px;
		right: 0;
	}
	.dcp--placed .dcp-panel {
		right: auto;
		left: 0;
		width: 220px;
		max-height: 70vh;
		overflow-y: auto;
		background: rgba(8,7,6,0.92);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 1px solid rgba(194,179,154,0.2);
		border-radius: 14px;
		padding: 0.75rem;
		box-shadow: 0 8px 32px rgba(0,0,0,0.4);
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
	.dcp-title {
		font-size: 0.6rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: rgba(194,179,154,0.6);
		margin: 0 0 0.25rem;
	}
	.dcp-swatch {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 0.5rem;
		border: 1px solid transparent;
		border-radius: 8px;
		background: transparent;
		cursor: pointer;
		transition: background 150ms, border-color 150ms;
		text-align: left;
	}
	.dcp-swatch:hover {
		background: rgba(194,179,154,0.08);
	}
	.dcp-swatch--active {
		border-color: #ffe27a;
		background: rgba(255,226,122,0.08);
	}
	.dcp-swatch--reset {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: rgba(194,179,154,0.7);
		justify-content: center;
		margin-bottom: 0.25rem;
	}
	.dcp-dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 1.5px solid rgba(194,179,154,0.3);
		flex-shrink: 0;
	}
	.dcp-label {
		font-size: 0.6rem;
		color: rgba(194,179,154,0.8);
		letter-spacing: 0.02em;
		line-height: 1.3;
	}

	:global(:root[data-theme='light']) .dcp-toggle {
		background: rgba(255,255,255,0.9);
		border-color: rgba(90,77,53,0.2);
		color: #7a5d10;
		box-shadow: 0 4px 16px rgba(90,77,53,0.15);
	}
	:global(:root[data-theme='light']) .dcp-panel {
		background: rgba(255,255,255,0.95);
		border-color: rgba(90,77,53,0.15);
		box-shadow: 0 8px 32px rgba(90,77,53,0.12);
	}
	:global(:root[data-theme='light']) .dcp-title {
		color: #5a5249;
	}
	:global(:root[data-theme='light']) .dcp-swatch:hover {
		background: rgba(90,77,53,0.06);
	}
	:global(:root[data-theme='light']) .dcp-swatch--active {
		border-color: #7a5d10;
		background: rgba(122,93,16,0.06);
	}
	:global(:root[data-theme='light']) .dcp-swatch--reset {
		color: #5a5249;
	}
	:global(:root[data-theme='light']) .dcp-label {
		color: #3d3832;
	}
	:global(:root[data-theme='light']) .dcp-dot {
		border-color: rgba(90,77,53,0.3);
	}
</style>

<!-- Global overrides when a dev palette is active -->
<svelte:head>
	{@html `<style>
		:root.dev-palette-active {
			--yc-ink: var(--dev-bg, #080706) !important;
			--yc-griege-text: var(--dev-text, #c2b39a) !important;
			--yc-maple-gold: var(--dev-accent, #ffe27a) !important;
			--yc-maple-gold-10: var(--dev-accent-bg, rgba(255,226,122,0.10)) !important;
			--yc-maple-gold-45: var(--dev-accent, #ffe27a) !important;
			--yc-ink-45: var(--dev-card, rgba(8,7,6,0.45)) !important;
			--yc-griege-20: var(--dev-border, rgba(194,179,154,0.2)) !important;
			--yc-text: var(--dev-text) !important;
			--yc-text-muted: var(--dev-muted) !important;
		}
		:root.dev-palette-active body,
		:root.dev-palette-active .yc-page {
			background: var(--dev-bg) !important;
			color: var(--dev-text) !important;
		}
	</` + `style>`}
</svelte:head>
