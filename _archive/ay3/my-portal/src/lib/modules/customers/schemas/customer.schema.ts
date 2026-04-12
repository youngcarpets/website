import { z } from 'zod';

export const customerSchema = z.object({
	name: z.string().min(1, 'Business or customer name is required'),
	contact_name: z.string().optional().default(''),
	email: z.string().email('Valid email required').optional().or(z.literal('')),
	phone: z.string().max(20).optional().default(''),
	abn: z.string().regex(/^\d{11}$/, 'ABN must be 11 digits').optional().or(z.literal('')),
	payment_terms: z.coerce.number().int().min(0).default(30),
	notes: z.string().optional().default(''),
	billing_street: z.string().optional().default(''),
	billing_city: z.string().optional().default(''),
	billing_state: z.string().optional().default(''),
	billing_postcode: z.string().optional().default(''),
	billing_country: z.string().optional().default('AU'),
	shipping_street: z.string().optional().default(''),
	shipping_city: z.string().optional().default(''),
	shipping_state: z.string().optional().default(''),
	shipping_postcode: z.string().optional().default(''),
	shipping_country: z.string().optional().default('')
});

export type CustomerFormData = z.infer<typeof customerSchema>;
