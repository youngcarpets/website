import { createCrudService } from '$lib/services/crud';
import type { Customer, CustomerInsert, CustomerUpdate } from '../types/customer.types';
import type { SupabaseClient } from '@supabase/supabase-js';

const baseCrud = createCrudService<Customer, CustomerInsert, CustomerUpdate>('customers');

export const customerService = {
	...baseCrud,

	async getActive(supabase: SupabaseClient) {
		const { data, error } = await supabase
			.from('customers')
			.select('*')
			.eq('is_active', true)
			.order('name', { ascending: true });
		return { data: (data ?? []) as Customer[], error };
	},

	async search(supabase: SupabaseClient, query: string) {
		const { data, error } = await supabase
			.from('customers')
			.select('id, name, email')
			.eq('is_active', true)
			.ilike('name', `%${query}%`)
			.order('name', { ascending: true })
			.limit(10);
		return { data: data ?? [], error };
	},

	async toggleActive(supabase: SupabaseClient, id: string, isActive: boolean) {
		const { error } = await supabase
			.from('customers')
			.update({ is_active: isActive })
			.eq('id', id);
		return { error };
	}
};
