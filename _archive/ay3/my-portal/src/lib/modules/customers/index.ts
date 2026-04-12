export { default as CustomerForm } from './components/CustomerForm.svelte';
export { default as CustomerTable } from './components/CustomerTable.svelte';
export { default as CustomerSelect } from './components/CustomerSelect.svelte';
export { customerService } from './services/customer.service';
export { customerSchema, type CustomerFormData } from './schemas/customer.schema';
export type { Customer, CustomerInsert, CustomerUpdate } from './types/customer.types';
