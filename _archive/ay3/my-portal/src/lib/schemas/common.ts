import { z } from 'zod';

export const emailSchema = z.string().email('Valid email required');

export const phoneSchema = z.string().max(20).optional();

export const abnSchema = z
	.string()
	.regex(/^\d{11}$/, 'ABN must be 11 digits')
	.optional()
	.or(z.literal(''));

export const addressSchema = z.object({
	street: z.string().optional().default(''),
	city: z.string().optional().default(''),
	state: z.string().optional().default(''),
	postcode: z.string().optional().default(''),
	country: z.string().optional().default('AU')
});

export type Address = z.infer<typeof addressSchema>;
