// Shared application types and enums

export type DocumentStatus = 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'void';
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';

export interface SelectOption {
	value: string;
	label: string;
}

export type BadgeVariant = 'cyan' | 'green' | 'red' | 'yellow' | 'gray' | 'purple' | 'blue';
