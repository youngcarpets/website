<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';

	let { data, form: actionResult } = $props();

	// Section tabs (top-level: Playground / Database)
	type Section = 'playground' | 'database';
	const activeSection = $derived<Section>(
		(page.url.searchParams.get('tab') as Section) ?? 'database'
	);

	let selectedTable = $state('employees');
	let queryColumns = $state('*');
	let queryLimit = $state('10');
	let queryOrderBy = $state('created_at');
	let queryOrderDir = $state('desc');
	let insertData = $state('{\n  "name": "",\n  "email": ""\n}');
	let updateId = $state('');
	let updateData = $state('{\n  "name": ""\n}');
	let deleteId = $state('');
	let activeTab = $state<'query' | 'insert' | 'update' | 'delete'>('query');
	let isDark = $state(false);
	let sysExpanded = $state(false);
	let extOpen = $state(false);

	function toggleTheme() {
		isDark = !isDark;
	}

	const tables = data.tables;

	// Apple system colors for each table — bright, colorful accents
	// Glow color scheme — greens, blues, occasional orange
	const tableColors: Record<string, { accent: string; glow: string; bg: string }> = {
		employees:          { accent: '#007AFF', glow: 'rgba(0, 122, 255, 0.20)',  bg: 'rgba(0, 122, 255, 0.06)' },
		customers:          { accent: '#22c55e', glow: 'rgba(34, 197, 94, 0.20)',  bg: 'rgba(34, 197, 94, 0.06)' },
		invoices:           { accent: '#f59e0b', glow: 'rgba(245, 158, 11, 0.20)', bg: 'rgba(245, 158, 11, 0.06)' },
		line_items:         { accent: '#06b6d4', glow: 'rgba(6, 182, 212, 0.20)',  bg: 'rgba(6, 182, 212, 0.06)' },
		tax_rates:          { accent: '#10b981', glow: 'rgba(16, 185, 129, 0.20)', bg: 'rgba(16, 185, 129, 0.06)' },
		document_settings:  { accent: '#3b82f6', glow: 'rgba(59, 130, 246, 0.20)', bg: 'rgba(59, 130, 246, 0.06)' },
		number_sequences:   { accent: '#f97316', glow: 'rgba(249, 115, 22, 0.20)', bg: 'rgba(249, 115, 22, 0.06)' },
	};

	function getColor(name: string) {
		return tableColors[name] ?? { accent: '#8E8E93', glow: 'rgba(142, 142, 147, 0.20)', bg: 'rgba(142, 142, 147, 0.06)' };
	}

	const tabMeta: Record<string, { label: string; icon: string; color: string }> = {
		query:  { label: 'Query',  icon: '⌘', color: '#007AFF' },
		insert: { label: 'Insert', icon: '+', color: '#22c55e' },
		update: { label: 'Update', icon: '↻', color: '#f59e0b' },
		delete: { label: 'Delete', icon: '✕', color: '#FF3B30' },
	};
</script>

<!-- Scoped theme wrapper -->
<div class="dev-page" class:dev-page--dark={isDark}>
	<!-- Gradient accent bar -->
	<div class="accent-bar"></div>

	<div class="dev-container">
		<!-- Header -->
		<header class="dev-header">
			<div>
				<h1 class="dev-title">Dev Tools</h1>
				<p class="dev-subtitle">
					AY3 Portal <span class="version-badge">v{data.version}</span>
					<span class="separator">·</span>
					Database CRUD
					<span class="separator">·</span>
					Debug → <code class="debug-path">.debug/</code>
					<span class="separator">·</span>
					<a href="/young-carpets" class="dev-link">Young Carpets</a>
				</p>
			</div>
			<div class="header-right">
				<button
					class="theme-toggle"
					onclick={toggleTheme}
					aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
					title={isDark ? 'Light mode' : 'Dark mode'}
				>
					<div class="theme-toggle__track">
						<div class="theme-toggle__thumb">
							{#if isDark}
								<svg class="theme-toggle__icon" viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
									<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
								</svg>
							{:else}
								<svg class="theme-toggle__icon" viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
									<path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
								</svg>
							{/if}
						</div>
					</div>
				</button>
				<div class="dev-timestamp">
					<div class="status-dot"></div>
					Connected {data.timestamp}
				</div>
			</div>
		</header>

		<!-- System Eyebrow -->
		<section class="sys-eyebrow" class:sys-eyebrow--expanded={sysExpanded}>
			<button class="sys-eyebrow__bar" onclick={() => sysExpanded = !sysExpanded}>
				<div class="sys-eyebrow__items">
					<span class="sys-eyebrow__item sys-eyebrow__item--accent">v{data.version}</span>
					<span class="sys-eyebrow__sep"></span>
					<span class="sys-eyebrow__item sys-eyebrow__item--mono">{data.gitCommit}</span>
					<span class="sys-eyebrow__sep"></span>
					<span class="sys-eyebrow__item sys-eyebrow__item--mono">{data.gitBranch}</span>
					<span class="sys-eyebrow__sep"></span>
					<span class="sys-eyebrow__item sys-eyebrow__item--mono">{data.localhost}</span>
					<span class="sys-eyebrow__sep"></span>
					<span class="sys-eyebrow__dot" class:sys-eyebrow__dot--ok={data.supabaseStatus === 'Connected'} class:sys-eyebrow__dot--warn={data.supabaseStatus !== 'Connected'}></span>
				</div>
				<span class="sys-eyebrow__chevron">{sysExpanded ? '\u25B2' : '\u25BC'}</span>
			</button>
			{#if sysExpanded}
				<div class="sys-details">
					<div class="sys-details__grid">
						<div class="sys-details__item">
							<span class="sys-details__label">Last Commit</span>
							<span class="sys-details__value">{data.gitCommitMsg}</span>
						</div>
						<div class="sys-details__item">
							<span class="sys-details__label">Node</span>
							<span class="sys-details__value sys-details__value--mono">{data.nodeVersion}</span>
						</div>
						<div class="sys-details__item">
							<span class="sys-details__label">Platform</span>
							<span class="sys-details__value">{data.platform}</span>
						</div>
						<div class="sys-details__item">
							<span class="sys-details__label">LAN</span>
							<span class="sys-details__value sys-details__value--mono">{data.lanUrl}</span>
						</div>
						<div class="sys-details__item">
							<span class="sys-details__label">Supabase</span>
							<span class="sys-details__value sys-details__value--mono">{data.supabaseHost}</span>
						</div>
						<div class="sys-details__item">
							<span class="sys-details__label">Tables</span>
							<span class="sys-details__value">{data.tableCount} tables &middot; {data.totalRows} rows</span>
						</div>
					</div>
				</div>
			{/if}
		</section>

		<!-- External Projects (collapsible) -->
		<!-- External Projects: thin eyebrow → expandable badge dropdown (mobile-first) -->
		<div class="external-projects">
			<button
				type="button"
				class="external-projects__bar"
				aria-expanded={extOpen}
				aria-controls="external-projects-dropdown"
				onclick={() => (extOpen = !extOpen)}
			>
				<span class="external-projects__label">
					<span>External Projects</span>
					<span class="external-projects__count">· 2</span>
				</span>
				<svg
					class="external-projects__chevron"
					class:is-open={extOpen}
					viewBox="0 0 16 16"
					width="14"
					height="14"
					fill="currentColor"
					aria-hidden="true"
				>
					<path d="M3.5 5.5L8 10l4.5-4.5"
						stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
						stroke-linejoin="round" fill="none"/>
				</svg>
			</button>

			{#if extOpen}
				<div
					id="external-projects-dropdown"
					class="external-projects__dropdown"
					role="region"
					aria-label="External projects list"
				>
					<a
						class="external-projects__badge"
						href="https://onerrorgotowtf.github.io/yci-website"
						target="_blank"
						rel="noopener"
						style="--badge-accent: #28CD41;"
					>
						<span class="external-projects__badge-content">
							<span class="external-projects__badge-name">YCI Website</span>
							<span class="external-projects__badge-url">onerrorgotowtf.github.io/yci-website</span>
						</span>
						<svg
							class="external-projects__badge-icon"
							viewBox="0 0 16 16"
							width="14"
							height="14"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M6 3h7v7M13 3L5 11M3 13h6"/>
						</svg>
					</a>
					<a
						class="external-projects__badge"
						href="https://onerrorgotowtf.github.io/aiDashboard"
						target="_blank"
						rel="noopener"
						style="--badge-accent: #AF52DE;"
					>
						<span class="external-projects__badge-content">
							<span class="external-projects__badge-name">AI Dashboard</span>
							<span class="external-projects__badge-url">onerrorgotowtf.github.io/aiDashboard</span>
						</span>
						<svg
							class="external-projects__badge-icon"
							viewBox="0 0 16 16"
							width="14"
							height="14"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M6 3h7v7M13 3L5 11M3 13h6"/>
						</svg>
					</a>
				</div>
			{/if}
		</div>

		<!-- Section Tabs (top-level) -->
		<nav class="section-tabs" role="tablist" aria-label="Dev sections">
			<a
				class="section-tab"
				class:section-tab--active={activeSection === 'database'}
				href="?tab=database"
				data-sveltekit-replacestate
				data-sveltekit-noscroll
				role="tab"
				aria-selected={activeSection === 'database'}
				aria-current={activeSection === 'database' ? 'page' : undefined}
			>
				<span class="section-tab__icon">▦</span>
				Database
			</a>
			<a
				class="section-tab"
				class:section-tab--active={activeSection === 'playground'}
				href="?tab=playground"
				data-sveltekit-replacestate
				data-sveltekit-noscroll
				role="tab"
				aria-selected={activeSection === 'playground'}
				aria-current={activeSection === 'playground' ? 'page' : undefined}
			>
				<span class="section-tab__icon">✦</span>
				Playground
			</a>
		</nav>

		{#if activeSection === 'playground'}
			<!-- Playground Launcher -->
			<section class="panel" role="tabpanel" aria-label="Playground" in:fade={{ duration: 180 }}>
				<div class="panel-header">
					<h2 class="panel-title">Component Playground</h2>
					<span class="panel-count">1 tool</span>
				</div>
				<div class="table-grid">
					<a
						class="table-card"
						href="/dev/playground"
						style="--card-accent: #06b6d4; --card-glow: rgba(6, 182, 212, 0.20); --card-bg: rgba(6, 182, 212, 0.06);"
					>
						<div class="table-card__indicator"></div>
						<div class="table-card__content">
							<span class="table-card__name">Open Playground →</span>
							<span class="table-card__count">Preview &amp; live-edit UI components</span>
						</div>
					</a>
				</div>
			</section>
		{/if}

		{#if activeSection === 'database'}
		<div class="db-section" in:fade={{ duration: 180 }}>
		<!-- Database Tables -->
		<section class="panel">
			<div class="panel-header">
				<h2 class="panel-title">Database Tables</h2>
				<span class="panel-count">{tables.length} tables</span>
			</div>
			<div class="table-grid">
				{#each tables as table}
					{@const color = getColor(table.name)}
					<button
						class="table-card"
						class:table-card--active={selectedTable === table.name}
						style="--card-accent: {color.accent}; --card-glow: {color.glow}; --card-bg: {color.bg};"
						onclick={() => selectedTable = table.name}
					>
						<div class="table-card__indicator"></div>
						<div class="table-card__content">
							<span class="table-card__name">{table.name}</span>
							{#if table.error}
								<span class="table-card__count table-card__count--error">Error</span>
							{:else}
								<span class="table-card__count">{table.count} rows</span>
							{/if}
						</div>
						{#if selectedTable === table.name}
							<div class="table-card__glow"></div>
						{/if}
					</button>
				{/each}
			</div>
		</section>

		<!-- CRUD Panel -->
		<section class="panel">
			<!-- Tabs -->
			<div class="tab-bar">
				<div class="tab-group">
					{#each Object.entries(tabMeta) as [key, meta]}
						<button
							class="tab"
							class:tab--active={activeTab === key}
							style="--tab-color: {meta.color};"
							onclick={() => activeTab = key as typeof activeTab}
						>
							<span class="tab__icon">{meta.icon}</span>
							{meta.label}
						</button>
					{/each}
				</div>
				<div class="tab-target">
					<span class="tab-target__dot" style="background: {getColor(selectedTable).accent};"></span>
					{selectedTable}
				</div>
			</div>

			<div class="tab-content">
				<!-- Query Tab -->
				{#if activeTab === 'query'}
					<form method="POST" action="?/query" use:enhance>
						<input type="hidden" name="table" value={selectedTable} />
						<div class="form-grid form-grid--4">
							<div class="form-field">
								<label class="form-label" for="dev-q-columns">Columns</label>
								<input id="dev-q-columns" class="form-input" name="columns" bind:value={queryColumns} placeholder="*" />
							</div>
							<div class="form-field">
								<label class="form-label" for="dev-q-limit">Limit</label>
								<input id="dev-q-limit" class="form-input" name="limit" bind:value={queryLimit} placeholder="10" />
							</div>
							<div class="form-field">
								<label class="form-label" for="dev-q-orderby">Order By</label>
								<input id="dev-q-orderby" class="form-input" name="orderBy" bind:value={queryOrderBy} placeholder="created_at" />
							</div>
							<div class="form-field">
								<label class="form-label" for="dev-q-orderdir">Direction</label>
								<select id="dev-q-orderdir" class="form-input" name="orderDir" bind:value={queryOrderDir}>
									<option value="desc">DESC</option>
									<option value="asc">ASC</option>
								</select>
							</div>
						</div>
						<button type="submit" class="dev-btn dev-btn--primary" style="--btn-color: {tabMeta.query.color};">
							Run Query
						</button>
					</form>
				{/if}

				<!-- Insert Tab -->
				{#if activeTab === 'insert'}
					<form method="POST" action="?/insert" use:enhance>
						<input type="hidden" name="table" value={selectedTable} />
						<div class="form-field">
							<label class="form-label" for="dev-i-data">JSON Data</label>
							<textarea id="dev-i-data" class="form-input form-input--mono" name="data" bind:value={insertData} rows="6" placeholder={'{"name": "Test"}'}></textarea>
						</div>
						<button type="submit" class="dev-btn dev-btn--primary" style="--btn-color: {tabMeta.insert.color};">
							Insert Row
						</button>
					</form>
				{/if}

				<!-- Update Tab -->
				{#if activeTab === 'update'}
					<form method="POST" action="?/update" use:enhance>
						<input type="hidden" name="table" value={selectedTable} />
						<div class="form-grid form-grid--2">
							<div class="form-field">
								<label class="form-label" for="dev-u-id">Row ID</label>
								<input id="dev-u-id" class="form-input form-input--mono" name="id" bind:value={updateId} placeholder="uuid..." />
							</div>
						</div>
						<div class="form-field">
							<label class="form-label" for="dev-u-data">Update JSON</label>
							<textarea id="dev-u-data" class="form-input form-input--mono" name="data" bind:value={updateData} rows="4" placeholder={'{"name": "Updated"}'}></textarea>
						</div>
						<button type="submit" class="dev-btn dev-btn--primary" style="--btn-color: {tabMeta.update.color};">
							Update Row
						</button>
					</form>
				{/if}

				<!-- Delete Tab -->
				{#if activeTab === 'delete'}
					<form method="POST" action="?/delete" use:enhance>
						<input type="hidden" name="table" value={selectedTable} />
						<div class="form-field">
							<label class="form-label" for="dev-d-id">Row ID</label>
							<input id="dev-d-id" class="form-input form-input--mono" name="id" bind:value={deleteId} placeholder="uuid..." />
						</div>
						<button type="submit" class="dev-btn dev-btn--danger">
							Delete Row
						</button>
					</form>
				{/if}
			</div>
		</section>

		<!-- Response Panel -->
		{#if actionResult}
			<section class="panel panel--response">
				<div class="panel-header">
					<h2 class="panel-title">Response</h2>
					<div class="response-meta">
						{#if actionResult.duration_ms !== undefined}
							<span class="meta-chip">{actionResult.duration_ms}ms</span>
						{/if}
						{#if actionResult.total_rows !== undefined}
							<span class="meta-chip">{actionResult.total_rows} total</span>
						{/if}
						{#if actionResult.returned_rows !== undefined}
							<span class="meta-chip meta-chip--accent">{actionResult.returned_rows} returned</span>
						{/if}
					</div>
				</div>

				{#if actionResult.error}
					{@const err = actionResult.error as { message: string; code?: string }}
					<div class="error-banner">
						<div class="error-banner__icon">!</div>
						<div>
							<div class="error-banner__msg">{err.message}</div>
							{#if err.code}
								<div class="error-banner__code">Code: {err.code}</div>
							{/if}
						</div>
					</div>
				{/if}

				{#if actionResult.data && actionResult.data.length > 0}
					<div class="data-table-wrap">
						<table class="data-table">
							<thead>
								<tr>
									{#each Object.keys(actionResult.data[0]) as col}
										<th>{col}</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each actionResult.data as row, i}
									<tr>
										{#each Object.values(row) as val}
											<td title={String(val ?? '')}>
												{val === null ? '—' : val}
											</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else if actionResult.error === null || actionResult.error === undefined}
					<div class="empty-state">No rows returned</div>
				{/if}

				<!-- Raw JSON -->
				<details class="json-toggle">
					<summary class="json-toggle__trigger">
						Raw JSON <span class="json-toggle__hint">(also saved to .debug/)</span>
					</summary>
					<pre class="json-block">{JSON.stringify(actionResult, null, 2)}</pre>
				</details>
			</section>
		{/if}
		</div>
		{/if}
	</div>
</div>

<style>
	/* ═══════════════════════════════════════════
	   Apple Light Glass — Dev Page Scoped Styles
	   ═══════════════════════════════════════════ */

	.dev-page {
		--surface: #F5F5F7;
		--surface-warm: #FAF9F6;
		--surface-card: rgba(255, 255, 255, 0.72);
		--surface-card-hover: rgba(255, 255, 255, 0.88);
		--border-subtle: rgba(0, 0, 0, 0.06);
		--border-medium: rgba(0, 0, 0, 0.10);
		--text-primary: #1D1D1F;
		--text-secondary: #6E6E73;
		--text-tertiary: #AEAEB2;
		--radius-sm: 10px;
		--radius-md: 14px;
		--radius-lg: 20px;
		--radius-xl: 24px;
		--ease-apple: cubic-bezier(0.2, 0.8, 0.2, 1);
		--shadow-sm:
			0 1px 2px rgba(0, 0, 0, 0.04),
			0 1px 3px rgba(0, 0, 0, 0.02);
		--shadow-md:
			0 2px 8px rgba(0, 0, 0, 0.06),
			0 4px 16px rgba(0, 0, 0, 0.04);
		--shadow-lg:
			0 4px 12px rgba(0, 0, 0, 0.06),
			0 8px 32px rgba(0, 0, 0, 0.08),
			0 0 0 1px rgba(0, 0, 0, 0.02);
		--shadow-glow: 0 0 24px var(--card-glow, rgba(0,122,255,0.15));

		position: relative;
		min-height: 100vh;
		background: var(--surface);
		color: var(--text-primary);
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
		-webkit-font-smoothing: antialiased;
		transition: background 400ms var(--ease-apple), color 400ms var(--ease-apple);
	}

	/* ── Dark Mode Overrides ── */
	.dev-page--dark {
		--surface: #000000;
		--surface-warm: #1C1C1E;
		--surface-card: rgba(28, 28, 30, 0.80);
		--surface-card-hover: rgba(44, 44, 46, 0.88);
		--border-subtle: rgba(255, 255, 255, 0.08);
		--border-medium: rgba(255, 255, 255, 0.14);
		--text-primary: #FFFFFF;
		--text-secondary: rgba(235, 235, 245, 0.60);
		--text-tertiary: rgba(235, 235, 245, 0.30);
		--shadow-sm:
			0 1px 2px rgba(0, 0, 0, 0.20),
			0 1px 3px rgba(0, 0, 0, 0.12);
		--shadow-md:
			0 2px 8px rgba(0, 0, 0, 0.24),
			0 4px 16px rgba(0, 0, 0, 0.16);
		--shadow-lg:
			0 4px 12px rgba(0, 0, 0, 0.20),
			0 8px 32px rgba(0, 0, 0, 0.24),
			0 0 0 1px rgba(255, 255, 255, 0.04);
	}

	/* Subtle warm radial to break up the flat white */
	.dev-page::before {
		content: '';
		position: fixed;
		inset: 0;
		background:
			radial-gradient(ellipse at 25% -5%, rgba(0, 122, 255, 0.05) 0%, transparent 55%),
			radial-gradient(ellipse at 75% 10%, rgba(34, 197, 94, 0.04) 0%, transparent 50%),
			radial-gradient(ellipse at 50% 100%, rgba(245, 158, 11, 0.03) 0%, transparent 40%);
		pointer-events: none;
		z-index: 0;
	}

	.dev-page--dark::before {
		background:
			radial-gradient(ellipse at 25% -5%, rgba(0, 122, 255, 0.10) 0%, transparent 55%),
			radial-gradient(ellipse at 75% 10%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
			radial-gradient(ellipse at 50% 100%, rgba(245, 158, 11, 0.06) 0%, transparent 40%);
	}

	/* ── Accent Bar ── */
	.accent-bar {
		height: 3px;
		background: linear-gradient(
			90deg,
			#22c55e 0%,
			#06b6d4 30%,
			#007AFF 55%,
			#06b6d4 75%,
			#f59e0b 100%
		);
		position: sticky;
		top: 0;
		z-index: 50;
	}

	/* ── Container ── */
	.dev-container {
		position: relative;
		z-index: 1;
		max-width: 72rem;
		margin: 0 auto;
		padding: 2rem 2rem 4rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	/* ── Header ── */
	.dev-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		padding: 0.5rem 0 0.5rem;
	}

	.dev-title {
		font-size: 2rem;
		font-weight: 700;
		letter-spacing: -0.025em;
		color: var(--text-primary);
	}

	.dev-subtitle {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		margin-top: 0.25rem;
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}

	.version-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.125rem 0.5rem;
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.03em;
		background: rgba(0, 122, 255, 0.08);
		color: #007AFF;
		border-radius: 9999px;
	}

	.separator {
		color: var(--text-tertiary);
	}

	.debug-path {
		font-family: 'SF Mono', ui-monospace, monospace;
		font-size: 0.75rem;
		padding: 0.0625rem 0.375rem;
		background: rgba(0, 0, 0, 0.04);
		border-radius: 4px;
		color: var(--text-secondary);
	}

	.dev-link {
		display: inline-flex;
		align-items: center;
		min-height: 28px;
		padding: 0.25rem 0.7rem;
		border-radius: 9999px;
		color: #007AFF;
		font-weight: 600;
		text-decoration: none;
		background: rgba(0, 122, 255, 0.08);
		border: 1px solid rgba(0, 122, 255, 0.18);
		transition: background 200ms, border-color 200ms, transform 200ms;
	}

	.dev-link:hover {
		background: rgba(0, 122, 255, 0.14);
		border-color: rgba(0, 122, 255, 0.32);
	}

	.dev-timestamp {
		font-size: 0.75rem;
		color: var(--text-tertiary);
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}

	.status-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #28CD41;
		box-shadow: 0 0 6px rgba(40, 205, 65, 0.5);
	}

	/* ── Panels (Glass Cards) ── */
	.panel {
		background: var(--surface-card);
		backdrop-filter: blur(20px) saturate(1.3);
		-webkit-backdrop-filter: blur(20px) saturate(1.3);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-xl);
		padding: 1.5rem;
		box-shadow: var(--shadow-lg);
		transition: box-shadow 400ms var(--ease-apple);
	}

	/* ── Database section wrapper (transition target) ── */
	.db-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	/* ── Section Tabs (top-level: Playground / Database) ── */
	.section-tabs {
		display: flex;
		gap: 0.25rem;
		padding: 0.5rem 0.75rem;
		background: var(--surface-card);
		backdrop-filter: blur(20px) saturate(1.3);
		-webkit-backdrop-filter: blur(20px) saturate(1.3);
		border: 1px solid var(--border-subtle);
		border-radius: 14px;
		box-shadow: var(--shadow-sm);
		position: sticky;
		top: 0.5rem;
		z-index: 20;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	.section-tabs::-webkit-scrollbar { display: none; }

	.section-tab {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-secondary);
		text-decoration: none;
		border: none;
		background: transparent;
		border-radius: 10px;
		cursor: pointer;
		transition: all 200ms var(--ease-apple);
		white-space: nowrap;
		min-height: 44px;
		font-family: inherit;
	}

	.section-tab:hover {
		color: var(--text-primary);
		background: rgba(0, 0, 0, 0.03);
	}

	.section-tab--active {
		color: var(--text-primary);
		font-weight: 600;
		background: var(--surface-warm);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), inset 0 0 0 1px var(--border-subtle);
	}

	.section-tab__icon {
		font-size: 0.875rem;
		opacity: 0.5;
		transition: opacity 200ms var(--ease-apple);
	}

	.section-tab--active .section-tab__icon {
		opacity: 1;
		color: var(--color-cyan-accent, #06b6d4);
	}

	@media (max-width: 640px) {
		.section-tab {
			flex: 1;
			justify-content: center;
		}
	}

	/* ── Collapsible External Projects panel ── */
	/* ── External Projects: thin eyebrow → badge dropdown (mobile-first) ── */
	.external-projects {
		position: relative;
		margin-bottom: 1rem;
	}

	.external-projects__bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 34px;
		padding: 0 14px;
		background: var(--surface-card);
		border: 1px solid var(--border-subtle);
		border-radius: 12px;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-primary);
		cursor: pointer;
		transition: background 150ms var(--ease-apple), box-shadow 150ms var(--ease-apple), border-color 150ms var(--ease-apple);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
		font-family: inherit;
		text-align: left;
	}

	.external-projects__bar:hover {
		background: var(--surface-card-hover);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
		border-color: var(--border-medium);
	}

	.external-projects__bar:focus-visible {
		outline: 2px solid var(--accent-cyan, #00C2FF);
		outline-offset: 2px;
	}

	.external-projects__label {
		display: inline-flex;
		align-items: baseline;
		gap: 6px;
		color: var(--text-primary);
	}

	.external-projects__count {
		color: var(--text-tertiary);
		font-weight: 400;
		font-variant-numeric: tabular-nums;
	}

	.external-projects__chevron {
		color: var(--text-tertiary);
		transition: transform 200ms var(--ease-apple), color 150ms var(--ease-apple);
		flex-shrink: 0;
	}

	.external-projects__chevron.is-open {
		transform: rotate(180deg);
		color: var(--text-secondary);
	}

	.external-projects__dropdown {
		position: absolute;
		top: calc(100% + 6px);
		left: 0;
		right: 0;
		max-width: 100%;
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 8px;
		background: var(--surface-card);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border: 1px solid var(--border-subtle);
		border-radius: 14px;
		box-shadow: 0 12px 36px -12px rgba(0, 0, 0, 0.18), 0 4px 12px -4px rgba(0, 0, 0, 0.08);
		z-index: 50;
		max-height: 70vh;
		overflow-y: auto;
		transform-origin: top center;
		animation: extDropdownReveal 220ms var(--ease-apple);
		will-change: opacity, transform;
	}

	@keyframes extDropdownReveal {
		from { opacity: 0; transform: translateY(-6px) scale(0.985); }
		to   { opacity: 1; transform: translateY(0) scale(1); }
	}

	.external-projects__badge {
		position: relative;
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		min-height: 48px;
		padding: 8px 14px 8px 16px;
		background: rgba(255, 255, 255, 0.5);
		border: 1px solid var(--border-subtle);
		border-radius: 10px;
		text-decoration: none;
		color: inherit;
		cursor: pointer;
		transition: background 150ms var(--ease-apple), transform 150ms var(--ease-apple), box-shadow 200ms var(--ease-apple);
		overflow: hidden;
	}

	.external-projects__badge::before {
		content: '';
		position: absolute;
		left: 0;
		top: 6px;
		bottom: 6px;
		width: 3px;
		background: var(--badge-accent, #00C2FF);
		border-radius: 0 3px 3px 0;
		transition: width 150ms var(--ease-apple), box-shadow 200ms var(--ease-apple);
	}

	.external-projects__badge:hover {
		background: rgba(255, 255, 255, 0.78);
		transform: translateX(2px);
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--badge-accent, #00C2FF) 35%, transparent),
		            0 6px 18px -8px var(--badge-accent, #00C2FF);
	}

	.external-projects__badge:hover::before {
		width: 4px;
		box-shadow: 0 0 14px var(--badge-accent, #00C2FF);
	}

	.external-projects__badge:focus-visible {
		outline: 2px solid var(--badge-accent, #00C2FF);
		outline-offset: 2px;
	}

	.external-projects__badge:active {
		transform: translateX(2px) scale(0.985);
	}

	.external-projects__badge-content {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		min-width: 0;
	}

	.external-projects__badge-name {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--text-primary);
		line-height: 1.25;
		letter-spacing: -0.005em;
	}

	.external-projects__badge-url {
		font-size: 0.6875rem;
		font-weight: 500;
		color: var(--text-tertiary);
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		line-height: 1.2;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.external-projects__badge-icon {
		color: var(--text-tertiary);
		flex-shrink: 0;
		transition: transform 200ms var(--ease-apple), color 150ms var(--ease-apple);
	}

	.external-projects__badge:hover .external-projects__badge-icon {
		transform: translate(2px, -2px);
		color: var(--badge-accent, #00C2FF);
	}

	@media (prefers-reduced-motion: reduce) {
		.external-projects__bar,
		.external-projects__chevron,
		.external-projects__dropdown,
		.external-projects__badge,
		.external-projects__badge::before,
		.external-projects__badge-icon {
			transition-duration: 0.01ms !important;
			animation-duration: 0.01ms !important;
		}
	}

	@media (max-width: 480px) {
		.external-projects__dropdown {
			max-height: 60vh;
		}
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.panel-title {
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-tertiary);
	}

	.panel-count {
		font-size: 0.6875rem;
		color: var(--text-tertiary);
	}

	/* ── System Eyebrow ── */
	.sys-eyebrow {
		background: var(--surface-card);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-lg);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		overflow: hidden;
	}

	.sys-eyebrow__bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0.5rem 1rem;
		background: none;
		border: none;
		cursor: pointer;
		font-family: inherit;
		color: var(--text-secondary);
		transition: background 0.15s;
	}

	.sys-eyebrow__bar:hover {
		background: var(--surface-warm);
	}

	.sys-eyebrow__items {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		font-size: 0.75rem;
		font-weight: 500;
		min-width: 0;
		overflow: hidden;
	}

	.sys-eyebrow__item {
		white-space: nowrap;
		color: var(--text-secondary);
	}

	.sys-eyebrow__item--accent {
		color: #007AFF;
		font-weight: 700;
	}

	.sys-eyebrow__item--mono {
		font-family: 'SF Mono', ui-monospace, 'Cascadia Code', monospace;
		font-size: 0.6875rem;
	}

	.sys-eyebrow__sep {
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: var(--text-tertiary);
		flex-shrink: 0;
	}

	.sys-eyebrow__dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.sys-eyebrow__dot--ok {
		background: #28CD41;
		box-shadow: 0 0 6px rgba(40, 205, 65, 0.5);
	}

	.sys-eyebrow__dot--warn {
		background: #FF9500;
		box-shadow: 0 0 6px rgba(255, 149, 0, 0.5);
	}

	.sys-eyebrow__chevron {
		font-size: 0.5rem;
		color: var(--text-tertiary);
		flex-shrink: 0;
		margin-left: 0.5rem;
	}

	.sys-details {
		padding: 0.5rem 1rem 0.75rem;
		border-top: 1px solid var(--border-subtle);
	}

	.sys-details__grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.25rem 1.5rem;
	}

	.sys-details__item {
		display: flex;
		flex-direction: column;
		gap: 0.0625rem;
		padding: 0.375rem 0;
	}

	.sys-details__label {
		font-size: 0.5625rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-tertiary);
	}

	.sys-details__value {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.sys-details__value--mono {
		font-family: 'SF Mono', ui-monospace, 'Cascadia Code', monospace;
		font-size: 0.6875rem;
	}

	@media (max-width: 768px) {
		.sys-eyebrow__items { gap: 0.375rem; font-size: 0.6875rem; }
		.sys-eyebrow__item--mono { font-size: 0.625rem; }
		.sys-details__grid { grid-template-columns: repeat(2, 1fr); }
	}

	/* ── Table Cards Grid ── */
	.table-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
		gap: 0.75rem;
	}

	.table-card {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		background: var(--surface-warm);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 350ms var(--ease-apple);
		overflow: hidden;
		text-align: left;
		text-decoration: none;
		color: inherit;
		font-family: inherit;
	}

	.table-card:hover {
		background: var(--surface-card-hover);
		border-color: var(--border-medium);
		box-shadow: var(--shadow-md);
		transform: translateY(-1px);
	}

	.table-card--active {
		background: var(--card-bg) !important;
		border-color: var(--card-accent) !important;
		box-shadow: var(--shadow-glow), var(--shadow-md) !important;
	}

	.table-card__indicator {
		width: 4px;
		height: 28px;
		border-radius: 9999px;
		background: var(--card-accent);
		opacity: 0.35;
		flex-shrink: 0;
		transition: opacity 300ms var(--ease-apple);
	}

	.table-card--active .table-card__indicator {
		opacity: 1;
	}

	.table-card__content {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		min-width: 0;
	}

	.table-card__name {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.table-card__count {
		font-size: 0.6875rem;
		color: var(--text-secondary);
		font-variant-numeric: tabular-nums;
	}

	.table-card__count--error {
		color: #FF3B30;
	}

	.table-card__glow {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: radial-gradient(ellipse at center, var(--card-glow), transparent 70%);
		opacity: 0.5;
		pointer-events: none;
	}

	/* ── Tab Bar ── */
	.tab-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.25rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border-subtle);
	}

	.tab-group {
		display: flex;
		gap: 0.25rem;
		padding: 0.25rem;
		background: rgba(0, 0, 0, 0.03);
		border-radius: var(--radius-sm);
	}

	.tab {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.875rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-secondary);
		border-radius: 8px;
		cursor: pointer;
		border: none;
		background: transparent;
		transition: all 250ms var(--ease-apple);
	}

	.tab:hover {
		color: var(--text-primary);
		background: rgba(0, 0, 0, 0.03);
	}

	.tab--active {
		background: white !important;
		color: var(--tab-color, #007AFF) !important;
		font-weight: 600;
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.08),
			0 1px 2px rgba(0, 0, 0, 0.04);
	}

	.tab__icon {
		font-size: 0.875rem;
		opacity: 0.7;
	}

	.tab--active .tab__icon {
		opacity: 1;
	}

	.tab-target {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.tab-target__dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		box-shadow: 0 0 8px currentColor;
	}

	/* ── Tab Content ── */
	.tab-content {
		animation: fadeIn 250ms var(--ease-apple);
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(4px); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* ── Form ── */
	.form-grid {
		display: grid;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.form-grid--4 { grid-template-columns: repeat(4, 1fr); }
	.form-grid--2 { grid-template-columns: repeat(2, 1fr); }

	.form-field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		margin-bottom: 0.75rem;
	}

	.form-label {
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-tertiary);
	}

	.form-input {
		width: 100%;
		padding: 0.625rem 0.875rem;
		font-size: 0.875rem;
		color: var(--text-primary);
		background: var(--surface-warm);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-sm);
		outline: none;
		transition: all 250ms var(--ease-apple);
		font-family: inherit;
	}

	.form-input::placeholder {
		color: var(--text-tertiary);
	}

	.form-input:focus {
		border-color: #007AFF;
		box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.12), var(--shadow-sm);
		background: white;
	}

	.form-input--mono {
		font-family: 'SF Mono', ui-monospace, 'Cascadia Code', monospace;
		font-size: 0.8125rem;
	}

	textarea.form-input {
		resize: vertical;
		line-height: 1.5;
	}

	select.form-input {
		cursor: pointer;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%236E6E73' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.75rem center;
		padding-right: 2rem;
	}

	/* ── Buttons ── */
	.dev-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5625rem 1.25rem;
		font-size: 0.8125rem;
		font-weight: 600;
		border-radius: 9999px;
		cursor: pointer;
		border: none;
		transition: all 300ms var(--ease-apple);
		margin-top: 0.25rem;
	}

	.dev-btn--primary {
		background: var(--btn-color, #007AFF);
		color: white;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
	}

	.dev-btn--primary:hover {
		filter: brightness(1.1);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16);
		transform: translateY(-1px);
	}

	.dev-btn--primary:active {
		transform: translateY(0);
		filter: brightness(0.95);
	}

	.dev-btn--danger {
		background: transparent;
		color: #FF3B30;
		border: 1px solid rgba(255, 59, 48, 0.25);
	}

	.dev-btn--danger:hover {
		background: rgba(255, 59, 48, 0.06);
		border-color: rgba(255, 59, 48, 0.5);
	}

	/* ── Response Panel ── */
	.panel--response {
		animation: slideUp 350ms var(--ease-apple);
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(12px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.response-meta {
		display: flex;
		gap: 0.5rem;
	}

	.meta-chip {
		display: inline-flex;
		align-items: center;
		padding: 0.1875rem 0.5rem;
		font-size: 0.6875rem;
		font-weight: 500;
		color: var(--text-secondary);
		background: rgba(0, 0, 0, 0.03);
		border-radius: 9999px;
		font-variant-numeric: tabular-nums;
	}

	.meta-chip--accent {
		color: #007AFF;
		background: rgba(0, 122, 255, 0.08);
	}

	/* ── Error Banner ── */
	.error-banner {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		background: rgba(255, 59, 48, 0.05);
		border: 1px solid rgba(255, 59, 48, 0.15);
		border-radius: var(--radius-md);
		margin-bottom: 1rem;
	}

	.error-banner__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		font-size: 0.6875rem;
		font-weight: 700;
		color: white;
		background: #FF3B30;
		border-radius: 50%;
		flex-shrink: 0;
		margin-top: 1px;
	}

	.error-banner__msg {
		font-size: 0.8125rem;
		font-weight: 500;
		color: #FF3B30;
	}

	.error-banner__code {
		font-size: 0.75rem;
		color: var(--text-tertiary);
		margin-top: 0.125rem;
	}

	/* ── Data Table ── */
	.data-table-wrap {
		overflow-x: auto;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-subtle);
		background: white;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
	}

	.data-table th {
		text-align: left;
		padding: 0.625rem 1rem;
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-tertiary);
		background: rgba(0, 0, 0, 0.02);
		border-bottom: 1px solid var(--border-subtle);
	}

	.data-table td {
		padding: 0.625rem 1rem;
		font-size: 0.8125rem;
		font-family: 'SF Mono', ui-monospace, monospace;
		color: var(--text-secondary);
		border-bottom: 1px solid rgba(0, 0, 0, 0.03);
		max-width: 14rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.data-table tbody tr:last-child td {
		border-bottom: none;
	}

	.data-table tbody tr:hover td {
		background: rgba(0, 122, 255, 0.03);
	}

	/* ── Empty State ── */
	.empty-state {
		font-size: 0.8125rem;
		color: var(--text-tertiary);
		font-style: italic;
		padding: 1rem 0;
	}

	/* ── JSON Toggle ── */
	.json-toggle {
		margin-top: 1rem;
	}

	.json-toggle__trigger {
		font-size: 0.75rem;
		color: var(--text-tertiary);
		cursor: pointer;
		transition: color 200ms;
	}

	.json-toggle__trigger:hover {
		color: var(--text-secondary);
	}

	.json-toggle__hint {
		opacity: 0.6;
	}

	.json-block {
		margin-top: 0.75rem;
		padding: 1rem;
		font-family: 'SF Mono', ui-monospace, monospace;
		font-size: 0.75rem;
		line-height: 1.5;
		color: var(--text-secondary);
		background: rgba(0, 0, 0, 0.02);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-sm);
		overflow-x: auto;
		max-height: 16rem;
		overflow-y: auto;
	}

	/* ── Header Right ── */
	.header-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	/* ── Theme Toggle ── */
	.theme-toggle {
		position: relative;
		display: flex;
		align-items: center;
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.theme-toggle__track {
		width: 44px;
		height: 26px;
		border-radius: 9999px;
		background: rgba(0, 0, 0, 0.08);
		border: 1px solid var(--border-subtle);
		display: flex;
		align-items: center;
		padding: 2px;
		transition: all 350ms var(--ease-apple);
	}

	.dev-page--dark .theme-toggle__track {
		background: rgba(0, 122, 255, 0.30);
		border-color: rgba(0, 122, 255, 0.40);
	}

	.theme-toggle__thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.15),
			0 1px 2px rgba(0, 0, 0, 0.08);
		transform: translateX(0);
		transition: transform 350ms var(--ease-apple);
	}

	.dev-page--dark .theme-toggle__thumb {
		transform: translateX(18px);
		background: #1C1C1E;
	}

	.theme-toggle__icon {
		color: #FF9500;
		transition: color 350ms var(--ease-apple);
	}

	.dev-page--dark .theme-toggle__icon {
		color: #FFD60A;
	}

	.theme-toggle:hover .theme-toggle__track {
		box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.12);
	}

	.theme-toggle:active .theme-toggle__thumb {
		width: 24px;
		border-radius: 10px;
	}

	/* ── Dark Mode Element Overrides ── */
	.dev-page--dark .tab--active {
		background: #2C2C2E !important;
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.30),
			0 1px 2px rgba(0, 0, 0, 0.20);
	}

	.dev-page--dark .tab-group {
		background: rgba(255, 255, 255, 0.06);
	}

	.dev-page--dark .tab:hover {
		background: rgba(255, 255, 255, 0.06);
	}

	.dev-page--dark .form-input {
		background: #1C1C1E;
		color: var(--text-primary);
	}

	.dev-page--dark .form-input:focus {
		border-color: #0A84FF;
		box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.20), var(--shadow-sm);
		background: #2C2C2E;
	}

	.dev-page--dark .form-input::placeholder {
		color: rgba(235, 235, 245, 0.30);
	}

	.dev-page--dark .data-table-wrap {
		background: #1C1C1E;
	}

	.dev-page--dark .data-table th {
		background: rgba(255, 255, 255, 0.04);
	}

	.dev-page--dark .data-table tbody tr:hover td {
		background: rgba(10, 132, 255, 0.08);
	}

	.dev-page--dark .data-table td {
		border-bottom-color: rgba(255, 255, 255, 0.04);
	}

	.dev-page--dark .json-block {
		background: rgba(255, 255, 255, 0.04);
	}

	.dev-page--dark .version-badge {
		background: rgba(10, 132, 255, 0.15);
		color: #0A84FF;
	}

	.dev-page--dark .debug-path {
		background: rgba(255, 255, 255, 0.08);
	}

	.dev-page--dark .status-dot {
		background: #32D74B;
		box-shadow: 0 0 6px rgba(50, 215, 75, 0.5);
	}

	.dev-page--dark .error-banner {
		background: rgba(255, 69, 58, 0.10);
		border-color: rgba(255, 69, 58, 0.25);
	}

	.dev-page--dark .error-banner__msg {
		color: #FF453A;
	}

	.dev-page--dark .meta-chip--accent {
		color: #0A84FF;
		background: rgba(10, 132, 255, 0.15);
	}

	.dev-page--dark .dev-btn--danger {
		color: #FF453A;
		border-color: rgba(255, 69, 58, 0.30);
	}

	.dev-page--dark .dev-btn--danger:hover {
		background: rgba(255, 69, 58, 0.10);
		border-color: rgba(255, 69, 58, 0.5);
	}

	/* ── Responsive ── */
	@media (max-width: 768px) {
		.dev-container { padding: 0.75rem; gap: 1rem; }
		.dev-title { font-size: 1.5rem; }
		.dev-subtitle {
			flex-wrap: wrap;
			font-size: 0.75rem;
			row-gap: 0.5rem;
			column-gap: 0.5rem;
		}
		.dev-subtitle .separator { display: none; }
		.dev-link {
			min-height: 44px;
			padding: 0.6rem 1rem;
			font-size: 0.8rem;
		}
		.panel { padding: 1rem; border-radius: var(--radius-lg); }
		.table-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
		.table-card { padding: 0.75rem; }
		.table-card__name { font-size: 0.75rem; }
		.form-grid--4 { grid-template-columns: repeat(2, 1fr); }
		.tab-bar { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
		.dev-header { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
		.header-right { align-self: flex-start; }
	}
</style>
