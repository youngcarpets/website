<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client as zodClient } from 'sveltekit-superforms/adapters';
	import { customerSchema } from '../schemas/customer.schema';
	import { FormField } from '$lib/components/ui';
	import { FormSection, FormActions } from '$lib/components/ui/forms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { CustomerFormData } from '../schemas/customer.schema';

	let {
		data,
		action = '?/create',
		submitLabel = 'Add Customer',
		oncancel
	}: {
		data: SuperValidated<CustomerFormData>;
		action?: string;
		submitLabel?: string;
		oncancel?: () => void;
	} = $props();

	const { form, errors, enhance, delayed } = superForm(data, {
		validators: zodClient(customerSchema),
		resetForm: action === '?/create'
	});

	let sameAsBilling = $state(true);
</script>

<form method="POST" {action} use:enhance>
	<FormSection title="Customer Details" columns={3}>
		<FormField
			name="name"
			label="Business / Customer Name"
			placeholder="Acme Pty Ltd"
			required
			bind:value={$form.name}
			error={$errors.name?.[0] ?? ''}
		/>
		<FormField
			name="contact_name"
			label="Contact Person"
			placeholder="Jane Smith"
			bind:value={$form.contact_name}
			error={$errors.contact_name?.[0] ?? ''}
		/>
		<FormField
			name="email"
			label="Email"
			type="email"
			placeholder="accounts@acme.com"
			bind:value={$form.email}
			error={$errors.email?.[0] ?? ''}
		/>
		<FormField
			name="phone"
			label="Phone"
			type="tel"
			placeholder="02 9000 0000"
			bind:value={$form.phone}
			error={$errors.phone?.[0] ?? ''}
		/>
		<FormField
			name="abn"
			label="ABN"
			placeholder="12345678901"
			bind:value={$form.abn}
			error={$errors.abn?.[0] ?? ''}
		/>
		<FormField
			name="payment_terms"
			label="Payment Terms (days)"
			type="number"
			placeholder="30"
			bind:value={$form.payment_terms}
			error={$errors.payment_terms?.[0] ?? ''}
		/>
	</FormSection>

	<!-- Notes is full-width below the section grid -->
	<div class="mb-4 -mt-2 px-4">
		<label for="notes" class="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Notes</label>
		<textarea
			id="notes"
			name="notes"
			bind:value={$form.notes}
			class="input-glass w-full"
			rows="2"
			placeholder="Internal notes about this customer..."
		></textarea>
	</div>

	<FormSection title="Billing Address" columns={4}>
		<div class="sm:col-span-2 lg:col-span-4">
			<FormField
				name="billing_street"
				label="Street"
				placeholder="123 Main Street"
				bind:value={$form.billing_street}
				error={$errors.billing_street?.[0] ?? ''}
			/>
		</div>
		<FormField
			name="billing_city"
			label="City"
			placeholder="Sydney"
			bind:value={$form.billing_city}
			error={$errors.billing_city?.[0] ?? ''}
		/>
		<FormField
			name="billing_state"
			label="State"
			placeholder="NSW"
			bind:value={$form.billing_state}
			error={$errors.billing_state?.[0] ?? ''}
		/>
		<FormField
			name="billing_postcode"
			label="Postcode"
			placeholder="2000"
			bind:value={$form.billing_postcode}
			error={$errors.billing_postcode?.[0] ?? ''}
		/>
		<FormField
			name="billing_country"
			label="Country"
			placeholder="AU"
			bind:value={$form.billing_country}
			error={$errors.billing_country?.[0] ?? ''}
		/>
	</FormSection>

	<FormSection title="Shipping Address" columns={4}>
		{#snippet titleAside()}
			<label class="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] cursor-pointer">
				<input type="checkbox" bind:checked={sameAsBilling} class="accent-[var(--color-cyan-accent)]" />
				Same as billing
			</label>
		{/snippet}

		{#if !sameAsBilling}
			<div class="sm:col-span-2 lg:col-span-4">
				<FormField
					name="shipping_street"
					label="Street"
					placeholder="456 Warehouse Rd"
					bind:value={$form.shipping_street}
					error={$errors.shipping_street?.[0] ?? ''}
				/>
			</div>
			<FormField
				name="shipping_city"
				label="City"
				placeholder="Melbourne"
				bind:value={$form.shipping_city}
				error={$errors.shipping_city?.[0] ?? ''}
			/>
			<FormField
				name="shipping_state"
				label="State"
				placeholder="VIC"
				bind:value={$form.shipping_state}
				error={$errors.shipping_state?.[0] ?? ''}
			/>
			<FormField
				name="shipping_postcode"
				label="Postcode"
				placeholder="3000"
				bind:value={$form.shipping_postcode}
				error={$errors.shipping_postcode?.[0] ?? ''}
			/>
			<FormField
				name="shipping_country"
				label="Country"
				placeholder="AU"
				bind:value={$form.shipping_country}
				error={$errors.shipping_country?.[0] ?? ''}
			/>
		{/if}
	</FormSection>

	<FormActions {submitLabel} delayed={$delayed} {oncancel} />
</form>
