/**
 * Lists every unresolved `TODO_` placeholder, grouped by file.
 *
 * This is the list to send the owner when asking for the missing details.
 * Run with `npm run placeholders`.
 */

import { findPlaceholders } from '../src/integrations/placeholder-guard.ts';

const findings = findPlaceholders(process.cwd());

if (findings.length === 0) {
	console.log('\n  No placeholders left. Everything has been confirmed.\n');
	process.exit(0);
}

const byFile = new Map();
for (const finding of findings) {
	if (!byFile.has(finding.file)) byFile.set(finding.file, []);
	byFile.get(finding.file).push(finding);
}

console.log(`\n  ${findings.length} value(s) still to confirm with the owner:\n`);
for (const [file, items] of byFile) {
	console.log(`  ${file}`);
	for (const item of items) {
		console.log(`      line ${String(item.line).padStart(3)}  ${item.token}`);
	}
	console.log('');
}
