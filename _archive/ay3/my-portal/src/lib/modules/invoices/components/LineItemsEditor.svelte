<script lang="ts">
	import { formatCurrency } from '$lib/utils/format';
	import { calculateLineTotal } from '$lib/utils/money';
	import type { TaxRate } from '../types/invoice.types';

	let {
		items = $bindable([]),
		taxRates = []
	}: {
		items: {
			description: string;
			quantity: number;
			unit_price: number;
			discount_percent: number;
			tax_rate_id: string | null;
			tax_name: string | null;
			tax_rate: number;
			sort_order: number;
		}[];
		taxRates: TaxRate[];
	} = $props();

	function addItem() {
		items = [
			...items,
			{
				description: '',
				quantity: 1,
				unit_price: 0,
				discount_percent: 0,
				tax_rate_id: taxRates.find((t) => t.is_default)?.id ?? null,
				tax_name: taxRates.find((t) => t.is_default)?.name ?? null,
				tax_rate: taxRates.find((t) => t.is_default)?.rate ?? 0,
				sort_order: items.length
			}
		];
	}

	function removeItem(index: number) {
		items = items.filter((_, i) => i !== index);
	}

	function updateTaxRate(index: number, taxRateId: string) {
		const taxRate = taxRates.find((t) => t.id === taxRateId);
		items[index] = {
			...items[index],
			tax_rate_id: taxRateId || null,
			tax_name: taxRate?.name ?? null,
			tax_rate: taxRate?.rate ?? 0
		};
		items = [...items];
	}
</script>

<div>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
					<th class="text-left pb-2 pr-2" style="min-width: 200px">Description</th>
					<th class="text-right pb-2 px-2" style="width: 80px">Qty</th>
					<th class="text-right pb-2 px-2" style="width: 100px">Price</th>
					<th class="text-right pb-2 px-2" style="width: 80px">Disc %</th>
					<th class="text-left pb-2 px-2" style="width: 120px">Tax</th>
					<th class="text-right pb-2 px-2" style="width: 100px">Total</th>
					<th class="pb-2 pl-2" style="width: 40px"></th>
				</tr>
			</thead>
			<tbody>
				{#each items as item, i (i)}
					{@const lineTotal = calculateLineTotal(item.quantity, item.unit_price, item.discount_percent)}
					<tr class="border-t border-[var(--color-glass-border)]">
						<td class="py-2 pr-2">
							<input
								type="text"
								class="input-glass !py-1.5 text-sm"
								placeholder="Item description"
								bind:value={items[i].description}
							/>
						</td>
						<td class="py-2 px-2">
							<input
								type="number"
								class="input-glass !py-1.5 text-sm text-right"
								min="0"
								step="0.001"
								bind:value={items[i].quantity}
							/>
						</td>
						<td class="py-2 px-2">
							<input
								type="number"
								class="input-glass !py-1.5 text-sm text-right"
								min="0"
								step="0.01"
								bind:value={items[i].unit_price}
							/>
						</td>
						<td class="py-2 px-2">
							<input
								type="number"
								class="input-glass !py-1.5 text-sm text-right"
								min="0"
								max="100"
								step="0.01"
								bind:value={items[i].discount_percent}
							/>
						</td>
						<td class="py-2 px-2">
							<select
								class="input-glass !py-1.5 text-sm"
								value={item.tax_rate_id ?? ''}
								onchange={(e) => updateTaxRate(i, (e.target as HTMLSelectElement).value)}
							>
								<option value="">No tax</option>
								{#each taxRates as tr}
									<option value={tr.id}>{tr.name} ({tr.rate}%)</option>
								{/each}
							</select>
						</td>
						<td class="py-2 px-2 text-right text-[var(--color-text-secondary)]">
							{formatCurrency(lineTotal)}
						</td>
						<td class="py-2 pl-2">
							{#if items.length > 1}
								<button
									type="button"
									class="text-[var(--color-text-muted)] hover:text-[var(--color-danger)] text-lg"
									onclick={() => removeItem(i)}
								>
									&times;
								</button>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<button type="button" class="btn-secondary mt-3 text-sm" onclick={addItem}>
		+ Add Line Item
	</button>
</div>
