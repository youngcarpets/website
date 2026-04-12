import { customerService, customerSchema } from '$lib/modules/customers';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { data: customer, error: fetchError } = await customerService.getById(
		locals.supabase,
		params.id
	);

	if (fetchError || !customer) {
		error(404, 'Customer not found');
	}

	// Convert nulls to empty strings for Zod schema compatibility
	const formData = Object.fromEntries(
		Object.entries(customer).map(([k, v]) => [k, v === null ? '' : v])
	);

	const form = await superValidate(formData, zod(customerSchema));
	return { customer, form };
};

export const actions: Actions = {
	update: async ({ request, params, locals }) => {
		const form = await superValidate(request, zod(customerSchema));
		if (!form.valid) return fail(400, { form });

		const { error: updateError } = await customerService.update(
			locals.supabase,
			params.id,
			form.data
		);
		if (updateError) return message(form, updateError.message, { status: 500 });

		return message(form, 'Customer updated');
	},

	delete: async ({ params, locals }) => {
		const { error: deleteError } = await customerService.remove(locals.supabase, params.id);
		if (deleteError) return fail(500, { error: deleteError.message });

		redirect(303, '/customers');
	}
};
