// Young Carpets — team roster (sales / accounting / office).
// Extracted from +page.svelte on 2026-04-08 (v1.24.x refactor).

export type TeamRow = {
	name: string;
	phone: string | null;
	email: string | null;
	note?: string;
	fax?: boolean;
};

export type TeamGroup = {
	label: string;
	rows: TeamRow[];
};

export const teamGroups: TeamGroup[] = [
	{
		label: 'Sales',
		rows: [
			{ name: 'Ryan Young', phone: '613-277-7926', email: 'ryoung@youngcarpets.com' },
			{ name: 'Derek Young', phone: '613-612-8487', email: 'dyoung@youngcarpets.com' },
			{ name: 'Peter Helis', phone: '613-864-6998', email: 'phelis@youngcarpets.com' },
			{ name: 'Mike Noel', phone: '613-222-5987', email: 'mnoel@youngcarpets.com' },
			{ name: 'Clayton Bradley', phone: '613-290-5075', email: 'cbradley@youngcarpets.com' },
			{ name: "Alan O'Connor", phone: '613-791-3252', email: 'aoconnor@youngcarpets.com' }
		]
	},
	{
		label: 'Accounting',
		rows: [
			{ name: 'Alan Young', phone: '613-878-9911', email: 'accounting@youngcarpets.com' },
			{ name: 'Accounts Payable', phone: null, email: 'ap@youngcarpets.com', note: 'Send invoices to' }
		]
	},
	{
		label: 'Office',
		rows: [
			{ name: 'Main Line', phone: '613-744-2744', email: null },
			{ name: 'Fax', phone: '613-744-2995', email: null, fax: true },
			{ name: 'Email', phone: null, email: 'info@youngcarpets.com' }
		]
	}
];
