import { customerService } from '$lib/modules/customers';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: customers, error } = await customerService.getAll(locals.supabase, {
		orderBy: 'name',
		ascending: true
	});

	return {
		customers,
		error: error?.message
	};
};

export const actions: Actions = {
	toggle: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const active = formData.get('active') === 'true';

		if (!id) return fail(400, { error: 'Customer ID required' });

		const { error } = await customerService.toggleActive(locals.supabase, id, active);
		if (error) return fail(500, { error: error.message });

		return { success: true };
	}
};
