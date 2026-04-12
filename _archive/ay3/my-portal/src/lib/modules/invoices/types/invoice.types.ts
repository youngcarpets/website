import type { Tables, TablesInsert, TablesUpdate } from '$lib/types/database';

export type Invoice = Tables<'invoices'>;
export type InvoiceInsert = TablesInsert<'invoices'>;
export type InvoiceUpdate = TablesUpdate<'invoices'>;

export type LineItem = Tables<'line_items'>;
export type LineItemInsert = TablesInsert<'line_items'>;

export type TaxRate = Tables<'tax_rates'>;
export type DocumentSettings = Tables<'document_settings'>;

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'void';

export interface InvoiceWithCustomer extends Invoice {
	customers: {
		name: string;
		email?: string | null;
		phone?: string | null;
		billing_street?: string | null;
		billing_city?: string | null;
		billing_state?: string | null;
		billing_postcode?: string | null;
		billing_country?: string | null;
	} | null;
}
