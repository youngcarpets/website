import type { SupabaseClient } from '@supabase/supabase-js';
import type { Invoice, InvoiceWithCustomer, LineItemInsert, TaxRate } from '../types/invoice.types';
import type { InvoiceFormData } from '../schemas/invoice.schema';
import { round2, calculateLineTotal, calculateTaxAmount } from '$lib/utils/money';

// Single source of truth for invoice status values.
// Mirrors the (eventual) Postgres invoice_status enum — keep in sync.
export const INVOICE_STATUSES = ['draft', 'sent', 'partially_paid', 'paid', 'overdue', 'void'] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export function isInvoiceStatus(value: string): value is InvoiceStatus {
	return (INVOICE_STATUSES as readonly string[]).includes(value);
}

export const invoiceService = {
	async getAll(supabase: SupabaseClient, filters?: { status?: string }) {
		let query = supabase
			.from('invoices')
			.select('*, customers(name)')
			.eq('is_archived', false)
			.order('created_at', { ascending: false });

		if (filters?.status && filters.status !== 'all') {
			query = query.eq('status', filters.status);
		}

		const { data, error } = await query;
		return { data: (data ?? []) as InvoiceWithCustomer[], error };
	},

	async getById(supabase: SupabaseClient, id: string) {
		const { data: invoice, error: invoiceError } = await supabase
			.from('invoices')
			.select('*, customers(name, email, phone, billing_street, billing_city, billing_state, billing_postcode, billing_country)')
			.eq('id', id)
			.single();

		if (invoiceError) return { data: null, lineItems: [], error: invoiceError };

		const { data: lineItems, error: lineItemsError } = await supabase
			.from('line_items')
			.select('*')
			.eq('invoice_id', id)
			.order('sort_order', { ascending: true });

		return {
			data: invoice as InvoiceWithCustomer,
			lineItems: lineItems ?? [],
			error: lineItemsError
		};
	},

	async create(supabase: SupabaseClient, formData: InvoiceFormData, taxRates: TaxRate[]) {
		const { line_items: items, ...invoiceData } = formData;
		const totals = calculateInvoiceTotals(items, taxRates);

		const { data: invoice, error: invoiceError } = await supabase
			.from('invoices')
			.insert({
				customer_id: invoiceData.customer_id,
				issue_date: invoiceData.issue_date,
				due_date: invoiceData.due_date,
				reference: invoiceData.reference || null,
				notes: invoiceData.notes || null,
				internal_notes: invoiceData.internal_notes || null,
				subtotal: totals.subtotal,
				tax_total: totals.taxTotal,
				total: totals.total,
				amount_due: totals.total
			})
			.select()
			.single();

		if (invoiceError || !invoice) return { data: null, error: invoiceError };

		const lineItemRows = buildLineItemRows(items, taxRates, invoice.id);

		const { error: lineItemsError } = await supabase
			.from('line_items')
			.insert(lineItemRows);

		return { data: invoice as Invoice, error: lineItemsError };
	},

	async update(supabase: SupabaseClient, id: string, formData: InvoiceFormData, taxRates: TaxRate[]) {
		const { line_items: items, ...invoiceData } = formData;
		const totals = calculateInvoiceTotals(items, taxRates);

		const { error: invoiceError } = await supabase
			.from('invoices')
			.update({
				customer_id: invoiceData.customer_id,
				issue_date: invoiceData.issue_date,
				due_date: invoiceData.due_date,
				reference: invoiceData.reference || null,
				notes: invoiceData.notes || null,
				internal_notes: invoiceData.internal_notes || null,
				subtotal: totals.subtotal,
				tax_total: totals.taxTotal,
				total: totals.total,
				amount_due: round2(totals.total)
			})
			.eq('id', id);

		if (invoiceError) return { error: invoiceError };

		// Delete existing line items and re-insert
		const { error: deleteError } = await supabase
			.from('line_items')
			.delete()
			.eq('invoice_id', id);
		if (deleteError) return { error: deleteError };

		const lineItemRows = buildLineItemRows(items, taxRates, id);

		const { error: lineItemsError } = await supabase
			.from('line_items')
			.insert(lineItemRows);

		return { error: lineItemsError };
	},

	async updateStatus(supabase: SupabaseClient, id: string, status: string) {
		// Validate against the canonical status enum before touching the DB.
		if (!isInvoiceStatus(status)) {
			return { error: { message: `Invalid invoice status: ${status}` } };
		}
		const updates: Record<string, unknown> = { status };

		if (status === 'sent') {
			// Assign invoice number on first send via atomic RPC
			const { data: numData, error: numError } = await supabase.rpc('next_invoice_number');
			if (numError) return { error: numError };
			if (!numData) return { error: { message: 'next_invoice_number returned no value' } };
			updates.invoice_number = numData;
			updates.sent_at = new Date().toISOString();
		} else if (status === 'paid') {
			updates.paid_at = new Date().toISOString();
			// Set amount_paid = total — fetch authoritative total from DB
			const { data: inv, error: invError } = await supabase
				.from('invoices')
				.select('total')
				.eq('id', id)
				.single();
			if (invError) return { error: invError };
			if (!inv) return { error: { message: `Invoice ${id} not found` } };
			updates.amount_paid = inv.total;
			updates.amount_due = 0;
		}

		const { error } = await supabase.from('invoices').update(updates).eq('id', id);
		return { error };
	},

	async getTaxRates(supabase: SupabaseClient) {
		const { data, error } = await supabase
			.from('tax_rates')
			.select('*')
			.eq('is_active', true)
			.order('name');
		return { data: (data ?? []) as TaxRate[], error };
	}
};

// Build the line_items insert rows from form data + tax rate lookup.
// Used by both create() and update() — DRY helper extracted 2026-04-08 (v1.24.x refactor).
function buildLineItemRows(
	items: InvoiceFormData['line_items'],
	taxRates: TaxRate[],
	invoiceId: string
): LineItemInsert[] {
	return items.map((item, i) => {
		const taxRate = taxRates.find((t) => t.id === item.tax_rate_id);
		const lineTotal = calculateLineTotal(item.quantity, item.unit_price, item.discount_percent);
		const taxAmount = taxRate ? calculateTaxAmount(lineTotal, taxRate.rate) : 0;

		return {
			invoice_id: invoiceId,
			description: item.description,
			quantity: item.quantity,
			unit_price: item.unit_price,
			discount_percent: item.discount_percent,
			tax_rate_id: item.tax_rate_id,
			tax_name: taxRate?.name ?? null,
			tax_rate: taxRate?.rate ?? 0,
			tax_amount: taxAmount,
			line_total: lineTotal,
			sort_order: i
		};
	});
}

function calculateInvoiceTotals(
	items: InvoiceFormData['line_items'],
	taxRates: TaxRate[]
) {
	let subtotal = 0;
	let taxTotal = 0;

	for (const item of items) {
		const lineTotal = calculateLineTotal(item.quantity, item.unit_price, item.discount_percent);
		const taxRate = taxRates.find((t) => t.id === item.tax_rate_id);
		const taxAmount = taxRate ? calculateTaxAmount(lineTotal, taxRate.rate) : 0;
		subtotal += lineTotal;
		taxTotal += taxAmount;
	}

	return {
		subtotal: round2(subtotal),
		taxTotal: round2(taxTotal),
		total: round2(subtotal + taxTotal)
	};
}
