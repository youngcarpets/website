<script lang="ts">
	let {
		name,
		label,
		type = 'text',
		value = $bindable(''),
		error = '',
		required = false,
		placeholder = '',
		disabled = false
	}: {
		name: string;
		label: string;
		type?: 'text' | 'email' | 'number' | 'date' | 'tel';
		value?: string | number;
		error?: string;
		required?: boolean;
		placeholder?: string;
		disabled?: boolean;
	} = $props();
</script>

<div>
	<label for={name} class="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">
		{label}{#if required}<span class="text-[var(--color-danger)] ml-0.5">*</span>{/if}
	</label>
	<input
		id={name}
		{name}
		{type}
		{required}
		{placeholder}
		{disabled}
		bind:value
		class="input-glass"
		class:!border-[var(--color-danger)]={!!error}
	/>
	{#if error}
		<p class="text-xs text-[var(--color-danger)] mt-1">{error}</p>
	{/if}
</div>
