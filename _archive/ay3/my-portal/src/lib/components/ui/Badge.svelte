<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { BadgeVariant } from '$lib/types/common';

	let {
		variant = 'cyan',
		children
	}: {
		variant?: BadgeVariant;
		children: Snippet;
	} = $props();

	const variantClasses: Record<BadgeVariant, string> = {
		cyan: 'bg-[var(--color-cyan-glow)] text-[var(--color-cyan-accent)]',
		green: 'bg-[rgba(34,197,94,0.15)] text-[var(--color-success)]',
		red: 'bg-[rgba(239,68,68,0.15)] text-[var(--color-danger)]',
		yellow: 'bg-[rgba(234,179,8,0.15)] text-[#eab308]',
		gray: 'bg-[rgba(161,161,170,0.15)] text-[var(--color-text-muted)]',
		purple: 'bg-[rgba(168,85,247,0.15)] text-[#a855f7]',
		blue: 'bg-[rgba(59,130,246,0.15)] text-[#3b82f6]'
	};
</script>

<span class="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium {variantClasses[variant]}">
	{@render children()}
</span>
