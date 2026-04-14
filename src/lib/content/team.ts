export interface TeamMember {
	name: string;
	phone?: string;
	email: string;
	note?: string;
}

export interface TeamGroup {
	label: string;
	members: TeamMember[];
}

export const teamGroups: TeamGroup[] = [
	{
		label: 'Sales',
		members: [
			{ name: 'Ryan Young', phone: '613-277-7926', email: 'ryoung@youngcarpets.com' },
			{ name: 'Derek Young', phone: '613-612-8487', email: 'dyoung@youngcarpets.com' },
			{ name: 'Peter Helis', phone: '613-864-6998', email: 'phelis@youngcarpets.com' },
			{ name: 'Mike Noel', phone: '613-222-5987', email: 'mnoel@youngcarpets.com' },
			{
				name: 'Clayton Bradley',
				phone: '613-290-5075',
				email: 'cbradley@youngcarpets.com'
			},
			{
				name: "Alan O'Connor",
				phone: '613-791-3252',
				email: 'aoconnor@youngcarpets.com'
			}
		]
	},
	{
		label: 'Accounting',
		members: [
			{ name: 'Alan Young', phone: '613-878-9911', email: 'accounting@youngcarpets.com' },
			{
				name: 'Accounts Payable',
				email: 'ap@youngcarpets.com',
				note: 'Send invoices to'
			}
		]
	}
];
