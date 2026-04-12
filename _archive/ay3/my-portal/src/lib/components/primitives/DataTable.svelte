<!--
	DataTable<T> — generic glass table primitive.

	Pass `rows` + a `columns` snippet that renders the header cells, and a
	`row` snippet that renders one tbody row given the row data + index.
	Empty state shown automatically when `rows` is empty.

	Generic over the row type via Svelte 5 generics. Theme-agnostic structure
	(uses .glass + .table-glass classes from app.css).
-->
<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import { EmptyState } from '$lib/components/ui';

	type Props = {
		rows: T[];
		emptyMessage?: string;
		header: Snippet;
		row: Snippet<[T, number]>;
	};

	let { rows, emptyMessage = 'No records yet.', header, row }: Props = $props();
</script>

{#if rows.length === 0}
	<EmptyState message={emptyMessage} />
{:else}
	<div class="glass overflow-hidden">
		<div class="overflow-x-auto">
			<table class="table-glass">
				<thead>
					<tr>
						{@render header()}
					</tr>
				</thead>
				<tbody>
					{#each rows as r, i (i)}
						{@render row(r, i)}
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}
