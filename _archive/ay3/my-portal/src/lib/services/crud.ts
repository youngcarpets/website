import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Generic CRUD service factory.
 *
 * Every method wraps Supabase calls in try/catch so network failures
 * (DNS, CORS, dropped connection, server unreachable) are returned as
 * a structured error instead of becoming unhandled promise rejections.
 *
 * The contract is always `{ data, error }` — callers should check `error`
 * first and never destructure data without it being checked.
 */
export function createCrudService<
	Row extends Record<string, unknown>,
	Insert extends Record<string, unknown> = Partial<Row>,
	Update extends Record<string, unknown> = Partial<Insert>
>(tableName: string) {
	function networkError(e: unknown) {
		const message =
			e instanceof Error
				? `Network error: ${e.message}`
				: 'Network error: unknown failure reaching Supabase';
		return { message };
	}

	return {
		async getAll(
			supabase: SupabaseClient,
			options?: { orderBy?: string; ascending?: boolean; limit?: number }
		) {
			try {
				let query = supabase.from(tableName).select('*');

				if (options?.orderBy) {
					query = query.order(options.orderBy, { ascending: options.ascending ?? false });
				}
				if (options?.limit) {
					query = query.limit(options.limit);
				}

				const { data, error } = await query;
				return { data: (data ?? []) as Row[], error };
			} catch (e) {
				return { data: [] as Row[], error: networkError(e) };
			}
		},

		async getById(supabase: SupabaseClient, id: string) {
			try {
				const { data, error } = await supabase
					.from(tableName)
					.select('*')
					.eq('id', id)
					.single();
				return { data: data as Row | null, error };
			} catch (e) {
				return { data: null as Row | null, error: networkError(e) };
			}
		},

		async create(supabase: SupabaseClient, record: Insert) {
			try {
				const { data, error } = await supabase
					.from(tableName)
					.insert(record as Record<string, unknown>)
					.select()
					.single();
				return { data: data as Row | null, error };
			} catch (e) {
				return { data: null as Row | null, error: networkError(e) };
			}
		},

		async update(supabase: SupabaseClient, id: string, record: Update) {
			try {
				const { data, error } = await supabase
					.from(tableName)
					.update(record as Record<string, unknown>)
					.eq('id', id)
					.select()
					.single();
				return { data: data as Row | null, error };
			} catch (e) {
				return { data: null as Row | null, error: networkError(e) };
			}
		},

		async remove(supabase: SupabaseClient, id: string) {
			try {
				const { error } = await supabase.from(tableName).delete().eq('id', id);
				return { error };
			} catch (e) {
				return { error: networkError(e) };
			}
		}
	};
}
