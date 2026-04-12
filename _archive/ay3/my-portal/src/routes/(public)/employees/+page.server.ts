import { employeeService } from '$lib/modules/employees';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: employees, error } = await employeeService.getAll(locals.supabase, {
		orderBy: 'name',
		ascending: true
	});

	return {
		employees,
		error: error?.message
	};
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400, { error: 'Employee ID required' });

		const { error } = await employeeService.remove(locals.supabase, id);
		if (error) return fail(500, { error: error.message });

		return { success: true };
	}
};
