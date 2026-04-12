import { employeeService, employeeSchema } from '$lib/modules/employees';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(employeeSchema));
	return { form };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const form = await superValidate(request, zod(employeeSchema));
		if (!form.valid) return fail(400, { form });

		const { error } = await employeeService.create(locals.supabase, form.data);
		if (error) return message(form, error.message, { status: 500 });

		redirect(303, '/employees');
	}
};
