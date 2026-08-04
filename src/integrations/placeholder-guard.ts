import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';

import { PLACEHOLDER_PATTERN } from '../lib/placeholders.ts';

/**
 * Fails a production build while any `TODO_` placeholder remains, and warns
 * (without failing) in development.
 *
 * It scans source files on disk rather than importing the config, so it also
 * catches placeholders inside content frontmatter and inside prose — travel
 * times, fares, rates and prices all live there.
 *
 * Escape hatch: set ALLOW_PLACEHOLDERS=1 to build anyway. This exists so a
 * preview build can be produced for Lighthouse before the owner has supplied
 * real figures. Neither CI nor Cloudflare Pages sets it.
 */

/** Directories scanned, relative to the project root. */
const SCANNED_DIRS = ['src/config', 'src/content'];
const SCANNED_EXTENSIONS = ['.ts', '.md', '.mdx', '.json', '.yaml', '.yml'];

export type Finding = {
	file: string;
	line: number;
	token: string;
};

function walk(dir: string): string[] {
	let entries: string[];
	try {
		entries = readdirSync(dir);
	} catch {
		return []; // Directory does not exist yet.
	}

	return entries.flatMap((entry) => {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) return walk(full);
		return SCANNED_EXTENSIONS.some((ext) => full.endsWith(ext)) ? [full] : [];
	});
}

export function findPlaceholders(rootDir: string): Finding[] {
	const findings: Finding[] = [];

	for (const relativeDir of SCANNED_DIRS) {
		for (const file of walk(join(rootDir, relativeDir))) {
			const lines = readFileSync(file, 'utf8').split('\n');
			lines.forEach((text, index) => {
				const matches = text.match(PLACEHOLDER_PATTERN);
				if (!matches) return;
				for (const token of new Set(matches)) {
					findings.push({ file: relative(rootDir, file), line: index + 1, token });
				}
			});
		}
	}

	return findings;
}

function format(findings: Finding[]): string {
	const byFile = new Map<string, Finding[]>();
	for (const finding of findings) {
		const list = byFile.get(finding.file) ?? [];
		list.push(finding);
		byFile.set(finding.file, list);
	}

	return [...byFile.entries()]
		.map(([file, items]) => {
			const rows = items.map((item) => `    ${item.token}  (line ${item.line})`).join('\n');
			return `  ${file}\n${rows}`;
		})
		.join('\n');
}

export default function placeholderGuard(): AstroIntegration {
	return {
		name: 'hibiscus:placeholder-guard',
		hooks: {
			'astro:build:start': ({ logger }) => {
				const rootDir = process.cwd();
				const findings = findPlaceholders(rootDir);
				if (findings.length === 0) {
					logger.info('No TODO_ placeholders remain. Safe to ship.');
					return;
				}

				const summary = `${findings.length} unresolved placeholder${
					findings.length === 1 ? '' : 's'
				}`;

				if (process.env.ALLOW_PLACEHOLDERS === '1') {
					logger.warn(
						`Building with ${summary} because ALLOW_PLACEHOLDERS=1.\n` +
							`This output must not be deployed.\n${format(findings)}`,
					);
					return;
				}

				throw new Error(
					`Refusing to build: ${summary} still in the source.\n\n` +
						`${format(findings)}\n\n` +
						`Fill these in (most live in src/config/site.ts and src/content/), or set\n` +
						`ALLOW_PLACEHOLDERS=1 to produce a preview build that must not be deployed.`,
				);
			},

			'astro:server:setup': ({ logger }) => {
				const findings = findPlaceholders(process.cwd());
				if (findings.length === 0) return;
				logger.warn(
					`${findings.length} unresolved TODO_ placeholder${findings.length === 1 ? '' : 's'} ` +
						`— shown inline on the page as badges.\n${format(findings)}`,
				);
			},
		},
	};
}

/** Exposed for the standalone `npm run placeholders` report. */
export function reportPlaceholders(rootUrl: URL): Finding[] {
	return findPlaceholders(fileURLToPath(rootUrl));
}
