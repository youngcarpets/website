<script lang="ts">
	import { GlassPanel, FormField } from '$lib/components/ui';
	import { CustomerSelect } from '$lib/modules/customers';
	import LineItemsEditor from './LineItemsEditor.svelte';
	import TotalsSummary from './TotalsSummary.svelte';
	import type { TaxRate } from '../types/invoice.types';
	import type { Customer } from '$lib/modules/customers';

	let {
		customers = [],
		taxRates = [],
		initialData = {
			customer_id: '',
			issue_date: new Date().toISOString().split('T')[0],
			due_date: '',
			reference: '',
			notes: '',
			internal_notes: '',
			line_items: [
				{ description: '', quantity: 1, unit_price: 0, discount_percent: 0, tax_rate_id: null, tax_name: null, tax_rate: 0, sort_order: 0 }
			]
		},
		action = '?/create',
		submitLabel = 'Save Draft'
	}: {
		customers?: Pick<Customer, 'id' | 'name' | 'email'>[];
		taxRates?: TaxRate[];
		initialData?: {
			customer_id: string;
			issue_date: string;
			due_date: string;
			reference: string;
			notes: string;
			internal_notes: string;
			line_items: {
				description: string;
				quantity: number;
				unit_price: number;
				discount_percent: number;
				tax_rate_id: string | null;
				tax_name: string | null;
				tax_rate: number;
				sort_order: number;
			}[];
		};
		action?: string;
		submitLabel?: string;
	} = $props();

	let formState = $state({ ...initialData });
	let lineItems = $state([...initialData.line_items]);
	let submitting = $state(false);

	function handleCustomerSelect(customer: Customer | null) {
		if (customer && customer.payment_terms && !formState.due_date) {
			const issue = new Date(formState.issue_date);
			issue.setDate(issue.getDate() + customer.payment_terms);
			formState.due_date = issue.toISOString().split('T')[0];
		}
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitting = true;

		const form = e.target as HTMLFormElement;
		const formData = new FormData();
		formData.set('data', JSON.stringify({
			...formState,
			line_items: lineItems
		}));

		const response = await fetch(form.action || action, {
			method: 'POST',
			body: formData
		});

		if (response.redirected) {
			window.location.href = response.url;
		} else {
			submitting = false;
		}
	}
</script>

<form method="POST" action={action} onsubmit={handleSubmit}>
	<!-- Customer & Dates -->
	<GlassPanel class="mb-4">
		<h2 class="text-lg font-semibold mb-4">Invoice Details</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<div class="sm:col-span-2">
				<CustomerSelect
					{customers}
					bind:value={formState.customer_id}
					onselect={handleCustomerSelect}
				/>
			</div>
			<FormField
				name="issue_date"
				label="Issue Date"
				type="date"
				required
				bind:value={formState.issue_date}
			/>
			<FormField
				name="due_date"
				label="Due Date"
				type="date"
				required
				bind:value={formState.due_date}
			/>
			<div class="sm:col-span-2 lg:col-span-4">
				<FormField
					name="reference"
					label="Reference / PO Number"
					placeholder="PO-12345"
					bind:value={formState.reference}
				/>
			</div>
		</div>
	</GlassPanel>

	<!-- Line Items -->
	<GlassPanel class="mb-4">
		<h2 class="text-lg font-semibold mb-4">Line Items</h2>
		<LineItemsEditor bind:items={lineItems} {taxRates} />
	</GlassPanel>

	<!-- Totals -->
	<GlassPanel class="mb-4">
		<TotalsSummary lineItems={lineItems} {taxRates} />
	</GlassPanel>

	<!-- Notes -->
	<GlassPanel class="mb-4">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div>
				<label for="notes" class="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Notes (visible to customer)</label>
				<textarea
					id="notes"
					name="notes"
					class="input-glass w-full"
					rows="3"
					placeholder="Payment details, thank you message..."
					bind:value={formState.notes}
				></textarea>
			</div>
			<div>
				<label for="internal_notes" class="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Internal Notes</label>
				<textarea
					id="internal_notes"
					name="internal_notes"
					class="input-glass w-full"
					rows="3"
					placeholder="Internal notes, not shown on invoice..."
					bind:value={formState.internal_notes}
				></textarea>
			</div>
		</div>
	</GlassPanel>

	<!-- Actions -->
	<div class="flex gap-3">
		<button type="submit" class="btn-primary" disabled={submitting}>
			{submitting ? 'Saving...' : submitLabel}
		</button>
		<a href="/invoices" class="btn-secondary inline-block">Cancel</a>
	</div>
</form>
