<script lang="ts">
	import { Badge } from '$lib/components/ui';
	import type { BadgeVariant } from '$lib/types/common';

	let { status }: { status: string } = $props();

	const statusConfig: Record<string, { variant: BadgeVariant; label: string }> = {
		draft: { variant: 'gray', label: 'Draft' },
		sent: { variant: 'blue', label: 'Sent' },
		viewed: { variant: 'purple', label: 'Viewed' },
		partial: { variant: 'yellow', label: 'Partial' },
		paid: { variant: 'green', label: 'Paid' },
		void: { variant: 'gray', label: 'Void' },
		overdue: { variant: 'red', label: 'Overdue' }
	};

	let config = $derived(statusConfig[status] ?? { variant: 'gray' as BadgeVariant, label: status });
</script>

<Badge variant={config.variant}>{config.label}</Badge>
