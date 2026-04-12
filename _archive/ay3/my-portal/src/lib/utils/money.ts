// Safe money arithmetic — avoids floating point issues by rounding to 2 decimals

export function round2(n: number): number {
	return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function calculateLineTotal(
	quantity: number,
	unitPrice: number,
	discountPercent = 0
): number {
	const subtotal = quantity * unitPrice;
	const discount = subtotal * (discountPercent / 100);
	return round2(subtotal - discount);
}

export function calculateTaxAmount(amount: number, taxRatePercent: number): number {
	return round2(amount * (taxRatePercent / 100));
}

export function calculateSubtotal(lineTotals: number[]): number {
	return round2(lineTotals.reduce((sum, t) => sum + t, 0));
}

export function calculateGrandTotal(subtotal: number, taxAmount: number): number {
	return round2(subtotal + taxAmount);
}
