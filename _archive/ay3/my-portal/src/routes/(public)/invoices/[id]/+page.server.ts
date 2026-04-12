import { invoiceService } from '$lib/modules/invoices';
import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const result = await invoiceService.getById(locals.supabase, params.id);

	if (result.error || !result.data) {
		error(404, 'Invoice not found');
	}

	const { data: taxRates } = await invoiceService.getTaxRates(locals.supabase);

	return {
		invoice: result.data,
		lineItems: result.lineItems,
		taxRates
	};
};

export const actions: Actions = {
	send: async ({ params, locals }) => {
		const { error: err } = await invoiceService.updateStatus(locals.supabase, params.id, 'sent');
		if (err) return fail(500, { error: err.message });
		return { success: 'Invoice sent' };
	},

	markPaid: async ({ params, locals }) => {
		const { error: err } = await invoiceService.updateStatus(locals.supabase, params.id, 'paid');
		if (err) return fail(500, { error: err.message });
		return { success: 'Invoice marked as paid' };
	},

	void: async ({ params, locals }) => {
		const { error: err } = await invoiceService.updateStatus(locals.supabase, params.id, 'void');
		if (err) return fail(500, { error: err.message });
		return { success: 'Invoice voided' };
	}
};
