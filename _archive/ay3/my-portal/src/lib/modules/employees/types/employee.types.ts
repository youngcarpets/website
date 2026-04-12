import type { Tables, TablesInsert, TablesUpdate } from '$lib/types/database';

export type Employee = Tables<'employees'>;
export type EmployeeInsert = TablesInsert<'employees'>;
export type EmployeeUpdate = TablesUpdate<'employees'>;
