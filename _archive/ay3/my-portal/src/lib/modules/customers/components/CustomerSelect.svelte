<script lang="ts">
	import type { Customer } from '../types/customer.types';

	let {
		customers = [],
		value = $bindable(''),
		error = '',
		onselect = (_c: Customer | null) => {}
	}: {
		customers?: Pick<Customer, 'id' | 'name' | 'email'>[];
		value?: string;
		error?: string;
		onselect?: (c: Customer | null) => void;
	} = $props();

	let search = $state('');
	let isOpen = $state(false);

	let filtered = $derived(
		search.length > 0
			? customers.filter((c) =>
					c.name.toLowerCase().includes(search.toLowerCase())
				)
			: customers
	);

	let selectedName = $derived(
		customers.find((c) => c.id === value)?.name ?? ''
	);

	function select(customer: Pick<Customer, 'id' | 'name' | 'email'>) {
		value = customer.id;
		search = '';
		isOpen = false;
		onselect(customer as Customer);
	}

	function clear() {
		value = '';
		search = '';
		onselect(null);
	}
</script>

<div class="relative">
	<label for="customer_select" class="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">
		Customer<span class="text-[var(--color-danger)] ml-0.5">*</span>
	</label>

	{#if value && selectedName}
		<div class="input-glass flex items-center justify-between">
			<span class="text-[var(--color-text-primary)]">{selectedName}</span>
			<button
				type="button"
				class="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] text-sm"
				onclick={clear}
			>
				Change
			</button>
		</div>
		<input type="hidden" name="customer_id" value={value} />
	{:else}
		<input
			id="customer_select"
			type="text"
			class="input-glass"
			class:!border-[var(--color-danger)]={!!error}
			placeholder="Search customers..."
			bind:value={search}
			onfocus={() => (isOpen = true)}
			onblur={() => setTimeout(() => (isOpen = false), 200)}
			autocomplete="off"
		/>
	{/if}

	{#if error}
		<p class="text-xs text-[var(--color-danger)] mt-1">{error}</p>
	{/if}

	{#if isOpen && filtered.length > 0}
		<div class="absolute z-40 mt-1 w-full glass p-1 max-h-48 overflow-y-auto">
			{#each filtered as customer (customer.id)}
				<button
					type="button"
					class="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-[var(--color-glass-hover)] transition-colors duration-150"
					onmousedown={() => select(customer)}
				>
					<span class="text-[var(--color-text-primary)]">{customer.name}</span>
					{#if customer.email}
						<span class="text-[var(--color-text-muted)] text-xs ml-2">{customer.email}</span>
					{/if}
				</button>
			{/each}
		</div>
	{/if}

	{#if isOpen && search.length > 0 && filtered.length === 0}
		<div class="absolute z-40 mt-1 w-full glass p-3 text-sm text-[var(--color-text-muted)]">
			No customers found
		</div>
	{/if}
</div>
