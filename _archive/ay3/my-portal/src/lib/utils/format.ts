const currencyFormatter = new Intl.NumberFormat('en-AU', {
	style: 'currency',
	currency: 'AUD',
	minimumFractionDigits: 2
});

const shortDateFormatter = new Intl.DateTimeFormat('en-AU', {
	day: '2-digit',
	month: 'short',
	year: 'numeric'
});

const longDateFormatter = new Intl.DateTimeFormat('en-AU', {
	day: 'numeric',
	month: 'long',
	year: 'numeric'
});

export function formatCurrency(amount: number): string {
	return currencyFormatter.format(amount);
}

export function formatDate(date: string | Date, style: 'short' | 'long' = 'short'): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return style === 'long' ? longDateFormatter.format(d) : shortDateFormatter.format(d);
}

export function formatNumber(n: number, decimals = 2): string {
	return n.toFixed(decimals);
}
