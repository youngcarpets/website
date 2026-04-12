import { employeeService, employeeSchema } from '$lib/modules/employees';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: employees, error } = await employeeService.getAll(locals.supabase, {
		orderBy: 'created_at',
		ascending: false
	});

	const form = await superValidate(zod(employeeSchema));

	return {
		employees,
		form,
		error: error?.message
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const form = await superValidate(request, zod(employeeSchema));
		if (!form.valid) return fail(400, { form });

		const { error } = await employeeService.create(locals.supabase, form.data);
		if (error) return message(form, error.message, { status: 500 });

		return message(form, 'Employee added');
	},

	update: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		const form = await superValidate(formData, zod(employeeSchema));
		if (!form.valid) return fail(400, { form });

		const { error } = await employeeService.update(locals.supabase, id, form.data);
		if (error) return message(form, error.message, { status: 500 });

		return message(form, 'Employee updated');
	},

	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400, { error: 'Employee ID required' });

		const { error } = await employeeService.remove(locals.supabase, id);
		if (error) return fail(500, { error: error.message });

		return { success: 'Employee deleted' };
	}
};
