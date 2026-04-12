<script lang="ts">
	// Floating glass nav bar — pinned right side, vertically centered.
	// Holds workspace switchers + utility row. Apple Liquid Glass aesthetic.
	// See c:\Users\alany\.claude\plans\typed-enchanting-sunbeam.md for the spec.

	import { listWorkspaces } from '$lib/dev/workspace/registry';
	import { dev, switchWorkspace, exitTool } from '$lib/dev/workspace/state.svelte';
	import { longpress } from './longpress';
	import { devIcons as icons } from './icons';

	type Props = {
		ontoast?: (msg: string) => void;
	};
	let { ontoast }: Props = $props();

	const allWorkspaces = $derived(listWorkspaces());
	const realWorkspaces = $derived(allWorkspaces.filter((w) => !w.placeholder));
	const placeholderWorkspaces = $derived(allWorkspaces.filter((w) => w.placeholder));

	function handleClick(id: string, isPlaceholder: boolean, name: string) {
		if (isPlaceholder) {
			ontoast?.(`${name} — coming soon`);
			return;
		}
		switchWorkspace(id);
	}
</script>

<nav class="rail" aria-label="Dev workspaces">
	<!-- Real workspaces -->
	<div class="rail__group">
		{#each realWorkspaces as ws (ws.id)}
			{@const active = dev.workspaceId === ws.id}
			<button
				class="item"
				class:item--active={active}
				type="button"
				aria-pressed={active}
				aria-label={ws.name}
				use:longpress={{ on: () => {} }}
				onclick={() => handleClick(ws.id, false, ws.name)}
			>
				<svg
					viewBox="0 0 24 24"
					width="20"
					height="20"
					fill="none"
					stroke="currentColor"
					stroke-width="1.6"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					{@html icons[ws.icon] ?? icons.sliders}
				</svg>
				<span class="tip">{ws.name}</span>
			</button>
		{/each}
	</div>

	<div class="rail__divider" aria-hidden="true"></div>

	<!-- Placeholder workspaces -->
	<div class="rail__group">
		{#each placeholderWorkspaces as ws (ws.id)}
			<button
				class="item item--placeholder"
				type="button"
				aria-disabled="true"
				aria-label="{ws.name} — coming soon"
				use:longpress={{ on: () => {} }}
				onclick={() => handleClick(ws.id, true, ws.name)}
			>
				<svg
					viewBox="0 0 24 24"
					width="20"
					height="20"
					fill="none"
					stroke="currentColor"
					stroke-width="1.6"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					{@html icons[ws.icon] ?? icons.gear}
				</svg>
				<span class="dot" aria-hidden="true"></span>
				<span class="tip">{ws.name} · soon</span>
			</button>
		{/each}
	</div>

	<div class="rail__divider" aria-hidden="true"></div>

	<!-- Utility row -->
	<div class="rail__group rail__group--utility">
		<button
			class="item item--utility"
			type="button"
			aria-label={dev.isDark ? 'Switch to light mode' : 'Switch to dark mode'}
			aria-pressed={dev.isDark}
			onclick={() => (dev.isDark = !dev.isDark)}
		>
			<svg
				viewBox="0 0 24 24"
				width="18"
				height="18"
				fill="none"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				{@html dev.isDark ? icons.moon : icons.sun}
			</svg>
			<span class="tip">{dev.isDark ? 'Light' : 'Dark'}</span>
		</button>

		<button
			class="item item--utility"
			type="button"
			aria-label={dev.infoVisible ? 'Hide info chrome' : 'Show info chrome'}
			aria-pressed={dev.infoVisible}
			onclick={() => (dev.infoVisible = !dev.infoVisible)}
		>
			<svg
				viewBox="0 0 24 24"
				width="18"
				height="18"
				fill="none"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				{@html icons.eye}
			</svg>
			<span class="tip">Info</span>
		</button>

		{#if dev.toolId}
			<button
				class="item item--utility item--exit"
				type="button"
				aria-label="Exit tool"
				onclick={() => exitTool()}
			>
				<svg
					viewBox="0 0 24 24"
					width="18"
					height="18"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					{@html icons.x}
				</svg>
				<span class="tip">Exit</span>
			</button>
		{/if}
	</div>
</nav>

<style>
	/* ── Motion tokens (scoped to this component for now;
	     promoted to a shared file in chunk 5) ── */
	.rail {
		--ease-spring: cubic-bezier(0.32, 0.72, 0, 1);
		--ease-snap: cubic-bezier(0.22, 1, 0.36, 1);
		--d-fast: 140ms;
		--d-base: 240ms;
		--accent: #00C2FF;
		--glow-soft: 0 0 24px -2px var(--accent);
		--glow-strong: 0 0 40px -4px var(--accent), 0 0 0 2px color-mix(in srgb, var(--accent) 60%, transparent);

		position: fixed;
		right: max(12px, env(safe-area-inset-right));
		top: 50%;
		transform: translateY(-50%);
		z-index: 100;

		display: flex;
		flex-direction: column;
		gap: 6px;
		width: 64px;
		padding: 12px 8px;

		background: rgba(255, 255, 255, 0.55);
		backdrop-filter: blur(24px) saturate(180%);
		-webkit-backdrop-filter: blur(24px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.55);
		border-radius: 28px;
		box-shadow:
			0 24px 60px -24px rgba(0, 0, 0, 0.28),
			0 4px 14px -4px rgba(0, 0, 0, 0.10),
			inset 0 1px 0 rgba(255, 255, 255, 0.7);
	}

	.rail__group {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.rail__group--utility { gap: 2px; }

	.rail__divider {
		height: 1px;
		margin: 4px 6px;
		background: linear-gradient(
			to right,
			transparent,
			rgba(0, 0, 0, 0.10),
			transparent
		);
	}

	/* ── Item base ── */
	.item {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		padding: 0;
		border: none;
		background: transparent;
		color: rgba(0, 0, 0, 0.65);
		border-radius: 14px;
		cursor: pointer;
		user-select: none;
		-webkit-touch-callout: none;
		transition:
			background var(--d-fast) var(--ease-snap),
			color var(--d-fast) var(--ease-snap),
			transform var(--d-fast) var(--ease-snap),
			box-shadow var(--d-base) var(--ease-spring);
	}

	.item:hover:not(:disabled):not(.item--placeholder) {
		background: rgba(255, 255, 255, 0.6);
		color: rgba(0, 0, 0, 0.9);
	}
	.item:active:not(:disabled) {
		transform: scale(0.92);
	}
	.item:focus-visible {
		outline: none;
		box-shadow: 0 0 0 2px var(--accent);
	}

	/* ── Active workspace ── */
	.item--active {
		color: var(--accent);
		background: color-mix(in srgb, var(--accent) 8%, transparent);
		box-shadow:
			0 0 0 2px var(--accent),
			var(--glow-soft);
		animation: glow-pop 600ms var(--ease-spring);
	}

	@keyframes glow-pop {
		0%   { box-shadow: 0 0 0 2px var(--accent), var(--glow-soft); }
		50%  { box-shadow: 0 0 0 2px var(--accent), var(--glow-strong); }
		100% { box-shadow: 0 0 0 2px var(--accent), var(--glow-soft); }
	}

	/* ── Placeholder ── */
	.item--placeholder {
		opacity: 0.45;
		cursor: default;
	}
	.item--placeholder:hover {
		background: rgba(255, 255, 255, 0.3);
		opacity: 0.6;
	}
	.dot {
		position: absolute;
		bottom: 6px;
		right: 6px;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.35);
	}

	/* ── Utility ── */
	.item--utility {
		color: rgba(0, 0, 0, 0.55);
		width: 48px;
		height: 40px;
		border-radius: 12px;
	}
	.item--exit {
		color: rgba(255, 60, 80, 0.85);
		background: rgba(255, 60, 80, 0.06);
	}
	.item--exit:hover {
		background: rgba(255, 60, 80, 0.14);
		color: rgba(255, 60, 80, 1);
	}

	/* ── Tooltip label (slides in from the LEFT — toward page interior) ── */
	.tip {
		position: absolute;
		right: calc(100% + 10px);
		top: 50%;
		transform: translateY(-50%) translateX(6px);
		opacity: 0;
		pointer-events: none;
		white-space: nowrap;
		font-size: 0.75rem;
		font-weight: 500;
		padding: 6px 10px;
		border-radius: 8px;
		background: rgba(20, 20, 20, 0.92);
		color: white;
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
		transition:
			opacity 200ms var(--ease-spring),
			transform 200ms var(--ease-spring);
	}
	.item:hover .tip {
		opacity: 1;
		transform: translateY(-50%) translateX(0);
	}
	/* :global() because data-longpress is set at runtime by the longpress action */
	:global(.item[data-longpress='true']) .tip {
		opacity: 1;
		transform: translateY(-50%) translateX(0);
	}

	/* ── Mobile (≤480px) ── */
	@media (max-width: 480px) {
		.rail {
			width: 52px;
			padding: 10px 6px;
			gap: 4px;
			border-radius: 22px;
		}
		.item, .item--utility {
			width: 40px;
			height: 40px;
			border-radius: 12px;
		}
		.tip { font-size: 0.6875rem; padding: 5px 9px; }
	}

	/* ── Reduced motion ── */
	@media (prefers-reduced-motion: reduce) {
		.item, .tip { transition: none; }
		.item:active:not(:disabled) { transform: none; }
		.item--active { animation: none; }
	}

	/* ── Reduced transparency ── */
	@media (prefers-reduced-transparency: reduce) {
		.rail {
			background: rgba(255, 255, 255, 0.95);
			backdrop-filter: none;
			-webkit-backdrop-filter: none;
		}
	}
</style>
