import type { Tables, TablesInsert, TablesUpdate } from '$lib/types/database';

export type Customer = Tables<'customers'>;
export type CustomerInsert = TablesInsert<'customers'>;
export type CustomerUpdate = TablesUpdate<'customers'>;
