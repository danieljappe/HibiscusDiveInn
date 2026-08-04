/**
 * Generates a solid-colour stand-in for every photo in the manifest that does
 * not exist yet, at the exact dimensions the real photo should be.
 *
 * They are real JPEGs, so astro:assets processes them exactly as it will
 * process the real photographs — same srcset, same AVIF/WebP output, same
 * layout. Dropping a real photo in over the top changes nothing else.
 *
 * Existing files are never overwritten, so this is safe to re-run once real
 * photos start arriving. Run with `npm run images:placeholders`.
 */

import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

import { IMAGE_MANIFEST } from '../src/config/images.ts';

const outputDir = join(process.cwd(), 'src/assets/images');
mkdirSync(outputDir, { recursive: true });

let created = 0;
let skipped = 0;

for (const spec of IMAGE_MANIFEST) {
	const path = join(outputDir, spec.file);

	if (existsSync(path)) {
		console.log(`  skip     ${spec.file} (already present)`);
		skipped++;
		continue;
	}

	await sharp({
		create: {
			width: spec.width,
			height: spec.height,
			channels: 3,
			background: spec.placeholderColour,
		},
	})
		.jpeg({ quality: 80 })
		.toFile(path);

	console.log(`  created  ${spec.file}  ${spec.width}x${spec.height}  ${spec.placeholderColour}`);
	created++;
}

console.log(`\n  ${created} placeholder(s) created, ${skipped} left alone.`);
if (created > 0) {
	console.log('  These are stand-ins. See the photo brief table in README.md.\n');
}
