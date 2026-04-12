import { invoiceService } from '$lib/modules/invoices';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const status = url.searchParams.get('status') ?? 'all';

	const { data: invoices, error } = await invoiceService.getAll(locals.supabase, {
		status: status === 'all' ? undefined : status
	});

	return {
		invoices,
		currentFilter: status,
		error: error?.message
	};
};
