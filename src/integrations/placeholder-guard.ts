import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';

import { PLACEHOLDER_PATTERN } from '../lib/placeholders.ts';
import { IS_PREVIEW, PREVIEW_BANNER } from '../config/preview.ts';

/**
 * Fails a production build while any `TODO_` placeholder remains, and warns
 * (without failing) in development.
 *
 * It scans source files on disk rather than importing the config, so it also
 * catches placeholders inside content frontmatter and inside prose — travel
 * times, fares, rates and prices all live there.
 *
 * Two flags relax it, and they are not interchangeable:
 *
 *   PREVIEW=true          Warn and continue. For a client preview that will be
 *                         deployed — so it also makes the build noindex and
 *                         drops the sitemap. See src/config/preview.ts.
 *   ALLOW_PLACEHOLDERS=1  Warn and continue, but leave the output indexable
 *                         and identical to production otherwise. For local
 *                         Lighthouse runs only, where a noindex would
 *                         invalidate the SEO score. Never deploy it.
 *
 * Neither is set by CI or by the production deployment.
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

				/*
				 * Preview mode: warn and carry on, so the client can be shown the
				 * site before the owner has supplied the missing details. The
				 * badges still render — the client seeing "? address" is the
				 * point. The same flag makes the build noindex and drops the
				 * sitemap, so this leniency cannot be had without them.
				 */
				if (IS_PREVIEW) {
					logger.warn(`${PREVIEW_BANNER}\n\n` + `${summary} still unset:\n${format(findings)}`);
					return;
				}

				/*
				 * Build despite placeholders but otherwise identical to
				 * production — indexable, with a sitemap. This exists for local
				 * Lighthouse runs, where preview mode's noindex would invalidate
				 * the SEO score. Not for deploying.
				 */
				if (process.env.ALLOW_PLACEHOLDERS === '1') {
					logger.warn(
						`Building with ${summary} because ALLOW_PLACEHOLDERS=1.\n` +
							`This output is indexable and must not be deployed. For a preview\n` +
							`someone will actually visit, use PREVIEW=true instead.\n${format(findings)}`,
					);
					return;
				}

				throw new Error(
					`Refusing to build: ${summary} still in the source.\n\n` +
						`${format(findings)}\n\n` +
						`Fill these in (most live in src/config/site.ts and src/content/), or\n` +
						`set PREVIEW=true to deploy a noindexed client preview that keeps the\n` +
						`placeholder badges visible.`,
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
