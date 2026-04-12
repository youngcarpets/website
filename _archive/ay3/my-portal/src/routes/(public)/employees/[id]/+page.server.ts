import { employeeService, employeeSchema } from '$lib/modules/employees';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { data: employee, error: fetchError } = await employeeService.getById(
		locals.supabase,
		params.id
	);

	if (fetchError || !employee) {
		error(404, 'Employee not found');
	}

	const formData = Object.fromEntries(
		Object.entries(employee).map(([k, v]) => [k, v === null ? '' : v])
	);

	const form = await superValidate(formData, zod(employeeSchema));
	return { employee, form };
};

export const actions: Actions = {
	update: async ({ request, params, locals }) => {
		const form = await superValidate(request, zod(employeeSchema));
		if (!form.valid) return fail(400, { form });

		const { error: updateError } = await employeeService.update(
			locals.supabase,
			params.id,
			form.data
		);
		if (updateError) return message(form, updateError.message, { status: 500 });

		return message(form, 'Employee updated');
	},

	delete: async ({ params, locals }) => {
		const { error: deleteError } = await employeeService.remove(locals.supabase, params.id);
		if (deleteError) return fail(500, { error: deleteError.message });

		redirect(303, '/employees');
	}
};
