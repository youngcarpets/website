import { invoiceService, invoiceSchema } from '$lib/modules/invoices';
import { customerService } from '$lib/modules/customers';
import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const result = await invoiceService.getById(locals.supabase, params.id);

	if (result.error || !result.data) {
		error(404, 'Invoice not found');
	}

	if (result.data.status !== 'draft') {
		error(403, 'Only draft invoices can be edited');
	}

	// Use allSettled so a single failure doesn't crash the whole page load.
	// Each result is checked individually and surfaced via the returned error field.
	const [customersResult, taxRatesResult] = await Promise.allSettled([
		customerService.getActive(locals.supabase),
		invoiceService.getTaxRates(locals.supabase)
	]);

	const customers =
		customersResult.status === 'fulfilled' && !customersResult.value.error
			? customersResult.value.data
			: [];
	const taxRates =
		taxRatesResult.status === 'fulfilled' && !taxRatesResult.value.error
			? taxRatesResult.value.data
			: [];
	const loadError =
		(customersResult.status === 'rejected' && 'Failed to load customers') ||
		(customersResult.status === 'fulfilled' && customersResult.value.error?.message) ||
		(taxRatesResult.status === 'rejected' && 'Failed to load tax rates') ||
		(taxRatesResult.status === 'fulfilled' && taxRatesResult.value.error?.message) ||
		null;

	return {
		invoice: result.data,
		lineItems: result.lineItems,
		customers,
		taxRates,
		loadError
	};
};

export const actions: Actions = {
	update: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const rawData = formData.get('data');

		if (typeof rawData !== 'string' || !rawData) return fail(400, { error: 'No form data' });

		let parsed: unknown;
		try {
			parsed = JSON.parse(rawData);
		} catch {
			return fail(400, { error: 'Invalid form data' });
		}

		// Server-side validation: never trust the client.
		const validation = invoiceSchema.safeParse(parsed);
		if (!validation.success) {
			return fail(400, {
				error: 'Validation failed',
				issues: validation.error.flatten()
			});
		}

		const { data: taxRates } = await invoiceService.getTaxRates(locals.supabase);
		const { error: updateError } = await invoiceService.update(
			locals.supabase,
			params.id,
			validation.data,
			taxRates
		);

		// Map raw Supabase error to a friendly message — don't leak internals.
		if (updateError) {
			console.error('[invoices/edit] update failed:', updateError);
			return fail(500, { error: 'Could not save the invoice. Please try again.' });
		}

		redirect(303, `/invoices/${params.id}`);
	}
};
