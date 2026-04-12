<!--
	FormActions — submit + optional cancel button row for the bottom of every module form.
	Centralizes the {$delayed ? 'Saving...' : submitLabel} pattern.
-->
<script lang="ts">
	type Props = {
		submitLabel: string;
		/** Pass `$delayed` from superForm */
		delayed: boolean;
		oncancel?: () => void;
		savingLabel?: string;
	};

	let { submitLabel, delayed, oncancel, savingLabel = 'Saving...' }: Props = $props();
</script>

<div class="flex gap-3">
	<button type="submit" class="btn-primary" disabled={delayed}>
		{delayed ? savingLabel : submitLabel}
	</button>
	{#if oncancel}
		<button type="button" class="btn-secondary" onclick={oncancel}>Cancel</button>
	{/if}
</div>
