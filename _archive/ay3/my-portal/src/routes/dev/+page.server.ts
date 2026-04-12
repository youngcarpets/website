import { supabase } from '$lib/supabaseClient';
import type { Actions, PageServerLoad } from './$types';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { env } from '$env/dynamic/public';
import os from 'os';

const DEBUG_DIR = join(process.cwd(), '.debug');
const PROJECT_ROOT = join(process.cwd(), '..');

function writeDebug(filename: string, data: unknown) {
	mkdirSync(DEBUG_DIR, { recursive: true });
	const output = {
		timestamp: new Date().toISOString(),
		...( typeof data === 'object' && data !== null ? data : { result: data })
	};
	writeFileSync(join(DEBUG_DIR, filename), JSON.stringify(output, null, 2));
}

// Get all table names and row counts on load
export const load: PageServerLoad = async () => {
	const tables = ['employees', 'customers', 'invoices', 'line_items', 'tax_rates', 'document_settings', 'number_sequences'] as const;

	const tableInfo = await Promise.all(
		tables.map(async (table) => {
			const { data, error, count } = await supabase
				.from(table)
				.select('*', { count: 'exact', head: true });
			return {
				name: table,
				count: count ?? 0,
				error: error?.message ?? null
			};
		})
	);

	const connectionTest = {
		url: 'Connected',
		tables: tableInfo,
		timestamp: new Date().toISOString()
	};

	writeDebug('connection.json', connectionTest);

	const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));

	// Git info
	let gitCommit = '', gitBranch = '', gitCommitMsg = '';
	try {
		gitCommit = execSync('git rev-parse --short HEAD', { cwd: PROJECT_ROOT }).toString().trim();
		gitBranch = execSync('git branch --show-current', { cwd: PROJECT_ROOT }).toString().trim();
		gitCommitMsg = execSync('git log -1 --pretty=%s', { cwd: PROJECT_ROOT }).toString().trim();
	} catch { /* not a git repo */ }

	// Network info
	const nets = os.networkInterfaces();
	let lanIp = '—';
	for (const ifaces of Object.values(nets)) {
		for (const iface of ifaces ?? []) {
			if (iface.family === 'IPv4' && !iface.internal) {
				lanIp = iface.address;
				break;
			}
		}
		if (lanIp !== '—') break;
	}

	// Supabase URL (masked)
	const supabaseUrl = env.PUBLIC_SUPABASE_URL ?? '—';
	const supabaseHost = supabaseUrl !== '—' ? new URL(supabaseUrl).hostname : '—';

	const systemInfo = {
		version: pkg.version,
		gitCommit,
		gitBranch,
		gitCommitMsg,
		nodeVersion: process.version,
		platform: `${os.type()} ${os.release()}`,
		localhost: `localhost:${process.env.PORT ?? '5173'}`,
		lanUrl: lanIp !== '—' ? `${lanIp}:${process.env.PORT ?? '5173'}` : '—',
		supabaseHost,
		supabaseStatus: tableInfo.some(t => t.error) ? 'Partial' : 'Connected',
		tableCount: tableInfo.length,
		totalRows: tableInfo.reduce((sum, t) => sum + t.count, 0),
	};

	return { tables: tableInfo, timestamp: connectionTest.timestamp, ...systemInfo };
};

export const actions: Actions = {
	// Run a select query on any table
	query: async ({ request }) => {
		const form = await request.formData();
		const table = form.get('table') as string;
		const columns = (form.get('columns') as string) || '*';
		const limit = parseInt((form.get('limit') as string) || '10');
		const orderBy = (form.get('orderBy') as string) || 'created_at';
		const orderDir = (form.get('orderDir') as string) || 'desc';

		const startTime = performance.now();
		const { data, error, count } = await supabase
			.from(table)
			.select(columns, { count: 'exact' })
			.order(orderBy, { ascending: orderDir === 'asc' })
			.limit(limit);
		const duration = Math.round(performance.now() - startTime);

		const result = {
			action: 'query',
			table,
			columns,
			limit,
			orderBy,
			orderDir,
			duration_ms: duration,
			total_rows: count,
			returned_rows: data?.length ?? 0,
			data: data ?? [],
			error: error ? { message: error.message, code: error.code, details: error.details } : null
		};

		writeDebug('last-query.json', result);
		return result;
	},

	// Insert a row
	insert: async ({ request }) => {
		const form = await request.formData();
		const table = form.get('table') as string;
		const jsonData = form.get('data') as string;

		let parsed: Record<string, unknown>;
		try {
			parsed = JSON.parse(jsonData);
		} catch {
			const result = { action: 'insert', table, error: { message: 'Invalid JSON' }, data: null };
			writeDebug('last-insert.json', result);
			return result;
		}

		const startTime = performance.now();
		const { data, error } = await supabase.from(table).insert(parsed).select();
		const duration = Math.round(performance.now() - startTime);

		const result = {
			action: 'insert',
			table,
			input: parsed,
			duration_ms: duration,
			data: data ?? [],
			error: error ? { message: error.message, code: error.code, details: error.details } : null
		};

		writeDebug('last-insert.json', result);
		return result;
	},

	// Update a row
	update: async ({ request }) => {
		const form = await request.formData();
		const table = form.get('table') as string;
		const id = form.get('id') as string;
		const jsonData = form.get('data') as string;

		let parsed: Record<string, unknown>;
		try {
			parsed = JSON.parse(jsonData);
		} catch {
			const result = { action: 'update', table, error: { message: 'Invalid JSON' }, data: null };
			writeDebug('last-update.json', result);
			return result;
		}

		const startTime = performance.now();
		const { data, error } = await supabase.from(table).update(parsed).eq('id', id).select();
		const duration = Math.round(performance.now() - startTime);

		const result = {
			action: 'update',
			table,
			id,
			input: parsed,
			duration_ms: duration,
			data: data ?? [],
			error: error ? { message: error.message, code: error.code, details: error.details } : null
		};

		writeDebug('last-update.json', result);
		return result;
	},

	// Delete a row
	delete: async ({ request }) => {
		const form = await request.formData();
		const table = form.get('table') as string;
		const id = form.get('id') as string;

		const startTime = performance.now();
		const { data, error } = await supabase.from(table).delete().eq('id', id).select();
		const duration = Math.round(performance.now() - startTime);

		const result = {
			action: 'delete',
			table,
			id,
			duration_ms: duration,
			data: data ?? [],
			error: error ? { message: error.message, code: error.code, details: error.details } : null
		};

		writeDebug('last-delete.json', result);
		return result;
	}
};
