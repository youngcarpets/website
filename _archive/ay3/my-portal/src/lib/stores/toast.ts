import { writable } from 'svelte/store';

type Toast = {
	message: string;
	type: 'success' | 'error';
};

export const toast = writable<Toast | null>(null);

let timeout: ReturnType<typeof setTimeout>;

export function showToast(message: string, type: 'success' | 'error' = 'success') {
	clearTimeout(timeout);
	toast.set({ message, type });
	timeout = setTimeout(() => toast.set(null), 3000);
}
