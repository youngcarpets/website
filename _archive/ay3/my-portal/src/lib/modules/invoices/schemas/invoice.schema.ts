import { z } from 'zod';

export const lineItemSchema = z.object({
	description: z.string().min(1, 'Description required'),
	quantity: z.coerce.number().positive('Must be positive'),
	unit_price: z.coerce.number().min(0, 'Must be 0 or more'),
	discount_percent: z.coerce.number().min(0).max(100).default(0),
	tax_rate_id: z.string().nullable().default(null),
	tax_name: z.string().nullable().default(null),
	tax_rate: z.coerce.number().min(0).default(0),
	sort_order: z.coerce.number().int().default(0)
});

export const invoiceSchema = z
	.object({
		customer_id: z.string().min(1, 'Select a customer'),
		issue_date: z.string().min(1, 'Issue date required'),
		due_date: z.string().min(1, 'Due date required'),
		reference: z.string().optional().default(''),
		notes: z.string().optional().default(''),
		internal_notes: z.string().optional().default(''),
		line_items: z.array(lineItemSchema).min(1, 'Add at least one line item')
	})
	.refine((d) => d.due_date >= d.issue_date, {
		message: 'Due date must be on or after issue date',
		path: ['due_date']
	});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
export type LineItemFormData = z.infer<typeof lineItemSchema>;
