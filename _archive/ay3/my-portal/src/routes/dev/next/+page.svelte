<script lang="ts">
	// /dev/next — chunk 3 staging.
	// Floating right-side glass nav (RightRailNav) drives workspace switching.
	// Subject picker stays as a slim left rail; tools mount in the center over the canvas.
	// Becomes the real /dev page in chunk 6.

	import type { Component } from 'svelte';
	import type { ShowcaseEntry } from '$lib/dev/types';
	import type { Tool, ToolContext, AnyWorkspace } from '$lib/dev/workspace/types';
	import { getWorkspace } from '$lib/dev/workspace/registry';
	import { dev, openTool, pickSubject, exitTool } from '$lib/dev/workspace/state.svelte';
	import RightRailNav from '$lib/dev/components/RightRailNav.svelte';

	// Resolve active workspace from registry
	const activeWorkspace = $derived(
		getWorkspace<unknown>(dev.workspaceId) as AnyWorkspace | undefined
	);

	// Load subjects for active workspace (sync only for now — async support comes later)
	const subjects = $derived.by(() => {
		if (!activeWorkspace) return [] as readonly unknown[];
		const result = activeWorkspace.loadSubjects({ data: null });
		return Array.isArray(result) ? (result as readonly unknown[]) : [];
	});

	const activeSubject = $derived(
		(subjects as readonly { id?: string }[]).find((s) => s?.id === dev.subjectId) ?? null
	);

	const tools = $derived(activeWorkspace?.toolsFor(activeSubject) ?? []);
	const activeTool = $derived(tools.find((t) => t.id === dev.toolId) ?? null);

	// Lazy-load canvas component when workspace changes
	let CanvasComponent = $state<Component<{ subject: unknown }> | null>(null);
	$effect(() => {
		const ws = activeWorkspace;
		if (!ws) {
			CanvasComponent = null;
			return;
		}
		void ws.canvas().then((m) => {
			CanvasComponent = m.default as Component<{ subject: unknown }>;
		});
	});

	// Lazy-load tool panel when active tool changes
	let ToolPanel = $state<Component<{ subject: unknown; ctx: ToolContext }> | null>(null);
	$effect(() => {
		const t = activeTool as Tool<unknown> | null;
		if (!t) {
			ToolPanel = null;
			return;
		}
		void t.panel().then((m) => {
			ToolPanel = m.default as Component<{ subject: unknown; ctx: ToolContext }>;
		});
	});

	// Tool context handed to every tool panel
	const ctx: ToolContext = {
		exit: () => exitTool(),
		setMode: (m) => (dev.mode = m),
		notify: (msg) => showToast(msg)
	};

	// Tiny toast for placeholder feedback
	let toastMsg = $state<string | null>(null);
	let toastTimer: number | undefined;
	function showToast(msg: string) {
		toastMsg = msg;
		if (toastTimer !== undefined) clearTimeout(toastTimer);
		toastTimer = window.setTimeout(() => (toastMsg = null), 1800);
	}

	// Cancel any pending toast on unmount so it doesn't fire after teardown
	$effect(() => {
		return () => {
			if (toastTimer !== undefined) clearTimeout(toastTimer);
		};
	});
</script>

<svelte:head>
	<title>Dev / next (chunk 3)</title>
</svelte:head>

<div class="shell" class:shell--dark={dev.isDark} class:shell--focus={dev.mode === 'focus'}>
	<header class="eyebrow" class:eyebrow--hidden={!dev.infoVisible || dev.mode === 'focus'}>
		<div class="eyebrow__title">
			<strong>{activeWorkspace?.name ?? 'Dev'}</strong>
			<span class="eyebrow__hint">— chunk 3 staging</span>
		</div>
	</header>

	<div class="layout">
		<!-- Subject picker (slim left column) -->
		<aside class="picker">
			<h2 class="picker__head">{activeWorkspace?.name ?? '—'}</h2>
			{#if subjects.length === 0}
				<div class="picker__empty">No subjects yet</div>
			{:else}
				<ul class="picker__list">
					{#each subjects as s, i (i)}
						{@const sub = s as ShowcaseEntry}
						<li>
							<button
								class="picker__item"
								class:picker__item--active={dev.subjectId === sub.id}
								type="button"
								onclick={() => pickSubject(sub.id)}
							>
								<span class="picker__name">{sub.name}</span>
								{#if sub.category}
									<span class="picker__cat">{sub.category}</span>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</aside>

		<!-- Canvas -->
		<main class="canvas-wrap">
			{#if CanvasComponent}
				{@const C = CanvasComponent}
				<C subject={activeSubject} />
			{/if}
		</main>
	</div>

	<!-- Tool dock — pill row above the active tool panel -->
	{#if activeSubject && tools.length > 0}
		<aside class="dock" class:dock--open={dev.toolId !== null}>
			<div class="dock__pills">
				{#each tools as t (t.id)}
					<button
						class="dock__pill"
						class:dock__pill--active={dev.toolId === t.id}
						type="button"
						onclick={() => openTool(dev.toolId === t.id ? null : t.id)}
					>
						{t.name}
					</button>
				{/each}
			</div>
			{#if ToolPanel && activeSubject}
				{@const P = ToolPanel}
				<div class="dock__panel">
					<P subject={activeSubject} {ctx} />
				</div>
			{/if}
		</aside>
	{/if}

	<!-- Floating right rail -->
	<RightRailNav ontoast={(m) => showToast(m)} />

	<!-- Toast -->
	{#if toastMsg}
		<div class="toast" role="status" aria-live="polite">{toastMsg}</div>
	{/if}
</div>

<style>
	:global(html, body) { background: #F5F5F7; }

	.shell {
		min-height: 100vh;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
		color: rgba(0, 0, 0, 0.85);
		padding-right: 88px; /* leave room for the right rail */
		transition: padding 240ms cubic-bezier(0.32, 0.72, 0, 1);
	}
	@media (max-width: 480px) {
		.shell { padding-right: 72px; }
	}

	.eyebrow {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14px 24px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
		background: rgba(255, 255, 255, 0.6);
		backdrop-filter: blur(20px) saturate(180%);
		transition:
			opacity 280ms cubic-bezier(0.32, 0.72, 0, 1),
			transform 280ms cubic-bezier(0.32, 0.72, 0, 1),
			height 240ms cubic-bezier(0.4, 0, 0.2, 1);
	}
	.eyebrow--hidden {
		opacity: 0;
		transform: translateY(-8px);
		pointer-events: none;
		height: 0;
		padding: 0 24px;
		overflow: hidden;
		border-bottom-color: transparent;
	}
	.eyebrow__title { font-size: 0.875rem; font-weight: 500; color: rgba(0, 0, 0, 0.7); }
	.eyebrow__title strong { color: rgba(0, 0, 0, 0.9); font-weight: 600; }
	.eyebrow__hint { color: rgba(0, 0, 0, 0.4); font-size: 0.75rem; margin-left: 6px; }

	.layout {
		display: grid;
		grid-template-columns: 220px 1fr;
		gap: 16px;
		padding: 16px;
		min-height: calc(100vh - 50px);
		transition: opacity 280ms cubic-bezier(0.32, 0.72, 0, 1);
	}
	@media (max-width: 768px) {
		.layout { grid-template-columns: 1fr; }
	}

	.picker {
		background: rgba(255, 255, 255, 0.6);
		backdrop-filter: blur(20px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.55);
		border-radius: 18px;
		padding: 14px;
		transition: opacity 280ms cubic-bezier(0.32, 0.72, 0, 1);
	}
	.shell--focus .picker { opacity: 0.55; }

	.picker__head {
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: rgba(0, 0, 0, 0.45);
		margin: 0 0 10px;
		font-weight: 600;
	}
	.picker__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
	.picker__empty { font-size: 0.75rem; color: rgba(0, 0, 0, 0.4); padding: 8px 0; }
	.picker__item {
		width: 100%;
		text-align: left;
		padding: 10px 12px;
		border-radius: 10px;
		background: transparent;
		border: 1px solid transparent;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 2px;
		transition: background 140ms;
	}
	.picker__item:hover { background: rgba(0, 0, 0, 0.04); }
	.picker__item--active {
		background: white;
		border-color: rgba(0, 0, 0, 0.06);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
	}
	.picker__name { font-size: 0.8125rem; font-weight: 500; }
	.picker__cat { font-size: 0.625rem; text-transform: uppercase; letter-spacing: 0.06em; color: rgba(0, 0, 0, 0.4); }

	.canvas-wrap {
		background: rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(20px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.55);
		border-radius: 18px;
		overflow: hidden;
		min-height: 400px;
	}

	/* Tool dock — slides up from bottom on mobile, anchored bottom-center on desktop */
	.dock {
		position: fixed;
		left: 24px;
		right: 88px;
		bottom: 16px;
		max-width: 520px;
		margin-inline: auto;
		background: rgba(255, 255, 255, 0.78);
		backdrop-filter: blur(24px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.6);
		border-radius: 22px;
		box-shadow:
			0 24px 60px -24px rgba(0, 0, 0, 0.28),
			0 4px 14px -4px rgba(0, 0, 0, 0.10);
		display: flex;
		flex-direction: column;
		max-height: 60vh;
		overflow: hidden;
		transition:
			max-height 320ms cubic-bezier(0.32, 0.72, 0, 1),
			transform 320ms cubic-bezier(0.32, 0.72, 0, 1);
	}
	@media (max-width: 768px) {
		.dock { left: 12px; right: 72px; bottom: 12px; }
	}

	.dock__pills {
		display: flex;
		gap: 6px;
		padding: 10px 12px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
	}
	.dock__pill {
		padding: 8px 14px;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.04);
		border: 1px solid rgba(0, 0, 0, 0.06);
		font-size: 0.75rem;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.7);
		cursor: pointer;
		transition: all 160ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.dock__pill:active { transform: scale(0.96); }
	.dock__pill--active {
		background: rgba(0, 0, 0, 0.85);
		color: white;
		border-color: transparent;
	}

	.dock__panel {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
	}

	/* Toast */
	.toast {
		position: fixed;
		top: 24px;
		left: 50%;
		transform: translateX(-50%);
		padding: 10px 18px;
		background: rgba(20, 20, 20, 0.92);
		color: white;
		border-radius: 999px;
		font-size: 0.8125rem;
		font-weight: 500;
		box-shadow: 0 12px 32px -10px rgba(0, 0, 0, 0.4);
		z-index: 200;
		animation: toast-in 220ms cubic-bezier(0.32, 0.72, 0, 1);
	}
	@keyframes toast-in {
		from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
		to   { opacity: 1; transform: translateX(-50%) translateY(0); }
	}

	/* Focus mode info-recede transitions */
	.shell--focus .eyebrow {
		opacity: 0;
		transform: translateY(-8px);
	}
</style>
