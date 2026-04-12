#!/usr/bin/env node
/**
 * check-tokens.mjs — verify every var(--yc-*) reference resolves to a defined token.
 *
 * Background: SVG `fill="var(--missing)"` falls back to the CSS initial value
 * (`black` for fill), and CSS `color: var(--missing)` falls back to the
 * inherited value. Both fail SILENTLY at the visual layer with no console
 * warning. The matting modal shipped with the foot ellipse rendered as solid
 * black on a near-black panel because `var(--yc-griege-90)` was never
 * defined — the rung ladder skips -90 (and -12). This script catches that
 * class of bug at script-run time, not at "user reports invisible element"
 * time.
 *
 * Usage:
 *   npm run check:tokens
 *
 * Exit codes:
 *   0 — every reference resolves
 *   1 — at least one reference is missing a definition (details printed)
 *
 * What it does:
 *   1. Reads src/lib/styles/young-carpets-tokens.css and extracts every
 *      `--yc-*` token name that appears as a definition (LHS of `:`).
 *   2. Walks src/routes/young-carpets/+page.svelte and any *.svelte under
 *      src/lib/components/, finds every `var(--yc-*)` reference, and
 *      reports any reference whose name is not in the definition set.
 *
 * What it does NOT do:
 *   - Check tokens defined inline in component <style> blocks.
 *   - Block commits. Manual check, not a hook.
 *   - Check non-yc tokens (Tailwind / Bits UI custom properties).
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const TOKENS_FILE = join(ROOT, 'src', 'lib', 'styles', 'young-carpets-tokens.css');
const SCAN_PATHS = [
	join(ROOT, 'src', 'routes', 'young-carpets', '+page.svelte'),
	join(ROOT, 'src', 'lib', 'components')
];

function extractDefinedTokens(text) {
	const tokens = new Set();
	// CSS-side: `--yc-name: value;` (in tokens.css OR inline <style> blocks)
	const cssRe = /(--yc-[a-z0-9-]+)\s*:/gi;
	let m;
	while ((m = cssRe.exec(text)) !== null) tokens.add(m[1]);
	// JS-side: `setProperty('--yc-name', ...)` (runtime-injected tokens like
	// --yc-scroll, --yc-product-image, --yc-tilt-x/y). Treat these as
	// definitions because they're guaranteed to be set before any CSS
	// var() reference resolves them.
	const jsRe = /setProperty\(\s*['"`](--yc-[a-z0-9-]+)['"`]/gi;
	while ((m = jsRe.exec(text)) !== null) tokens.add(m[1]);
	return tokens;
}

function* walk(path) {
	const stat = statSync(path);
	if (stat.isFile()) {
		yield path;
		return;
	}
	for (const entry of readdirSync(path)) {
		const sub = join(path, entry);
		const subStat = statSync(sub);
		if (subStat.isDirectory()) yield* walk(sub);
		else if (sub.endsWith('.svelte') || sub.endsWith('.css') || sub.endsWith('.ts')) yield sub;
	}
}

function extractReferences(filePath) {
	let text = readFileSync(filePath, 'utf8');
	// Strip HTML and CSS block comments so token names mentioned IN comments
	// (e.g., "v1.23.9: was var(--yc-griege-12) which doesn't exist") don't
	// register as real references. Replace with same-shape whitespace so line
	// numbers in the error report stay accurate.
	text = text.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ''));
	text = text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ''));
	const lines = text.split(/\r?\n/);
	const refs = [];
	const re = /var\(\s*(--yc-[a-z0-9-]+)\s*[,)]/gi;
	lines.forEach((line, i) => {
		let m;
		re.lastIndex = 0;
		while ((m = re.exec(line)) !== null) {
			refs.push({ name: m[1], file: filePath, line: i + 1, snippet: line.trim() });
		}
	});
	return refs;
}

// Step 1a: extract from the central tokens file
const definedTokens = new Set();
try {
	const tokensText = readFileSync(TOKENS_FILE, 'utf8');
	for (const t of extractDefinedTokens(tokensText)) definedTokens.add(t);
} catch (e) {
	console.error(`x Could not read tokens file: ${TOKENS_FILE}`);
	console.error(`  ${e.message}`);
	process.exit(1);
}
const tokensFromCentralFile = definedTokens.size;

// Step 1b: ALSO scan source files for inline definitions (e.g., per-component
// --yc-card-glow rules) and JS setProperty() calls. Both are valid sources of
// truth and the bug would be a missing reference, not a missing central def.
const allRefs = [];
let scannedFiles = 0;
for (const scanPath of SCAN_PATHS) {
	try {
		for (const file of walk(scanPath)) {
			scannedFiles++;
			const text = readFileSync(file, 'utf8');
			for (const t of extractDefinedTokens(text)) definedTokens.add(t);
			allRefs.push(...extractReferences(file));
		}
	} catch (e) {
		// Path may not exist — ignore
	}
}
const inlineDefs = definedTokens.size - tokensFromCentralFile;
console.log(`Loaded ${tokensFromCentralFile} central tokens from ${relative(ROOT, TOKENS_FILE)}`);
if (inlineDefs > 0) {
	console.log(`Loaded ${inlineDefs} inline / runtime tokens from ${scannedFiles} source file(s)`);
}

const missing = allRefs.filter((r) => !definedTokens.has(r.name));
const usedNames = new Set(allRefs.map((r) => r.name));

console.log(`Scanned ${allRefs.length} var(--yc-*) references across ${SCAN_PATHS.length} location(s)`);
console.log(`Found ${usedNames.size} unique token references in source`);

if (missing.length === 0) {
	console.log(`\nAll var(--yc-*) references resolve to a defined token.`);
	process.exit(0);
}

console.error(`\nx ${missing.length} reference${missing.length === 1 ? '' : 's'} to undefined tokens:`);
const grouped = new Map();
for (const r of missing) {
	if (!grouped.has(r.name)) grouped.set(r.name, []);
	grouped.get(r.name).push(r);
}
for (const [name, occurrences] of grouped) {
	console.error(`\n  ${name}  (${occurrences.length} reference${occurrences.length === 1 ? '' : 's'})`);
	for (const r of occurrences) {
		console.error(`    ${relative(ROOT, r.file)}:${r.line}`);
		console.error(`      ${r.snippet.length > 100 ? r.snippet.slice(0, 100) + '...' : r.snippet}`);
	}
}
console.error(`\n  Hint: SVG fill/stroke with an undefined var() falls back to BLACK silently.`);
console.error(`  Hint: define the missing tokens in young-carpets-tokens.css OR update the references.`);
process.exit(1);
