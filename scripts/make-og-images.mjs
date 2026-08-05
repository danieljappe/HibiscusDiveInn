/**
 * Generates the Open Graph / Twitter card images.
 *
 * These are placeholders like every other image here: palette colours and the
 * resort name, no photograph. They exist because a social card with no image
 * is worse than one with a plain one, and because the dimensions and file
 * names need to be settled before launch.
 *
 * Replace them with real 1200x630 crops of the hero and diving photographs
 * once those arrive — same filenames, no code change.
 *
 * Run with `npm run images:og`.
 */

import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const OUT = join(process.cwd(), 'public');
mkdirSync(OUT, { recursive: true });

const WIDTH = 1200;
const HEIGHT = 630;

const cards = [
	{
		file: 'og-default.png',
		background: '#DCD3C3',
		ink: '#08202E',
		muted: '#4A5A63',
		rule: '#B5A992',
		title: 'Hibiscus Dive Inn',
		subtitle: 'Bantayan Island · Cebu · Philippines',
	},
	{
		file: 'og-diving.png',
		background: '#08202E',
		ink: '#F6F2EA',
		muted: '#A9C2CC',
		rule: '#24505F',
		title: 'Diving Bantayan',
		subtitle: 'House reef · Small groups · One instructor',
	},
];

const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

for (const card of cards) {
	const path = join(OUT, card.file);

	if (existsSync(path)) {
		console.log(`  skip     ${card.file} (already present)`);
		continue;
	}

	/*
	 * System sans-serif rather than the site's own faces: this is rasterised
	 * once here, so the fonts only need to exist on the machine that runs the
	 * script, and requiring Bricolage to be installed would be a trap.
	 */
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
	<rect width="${WIDTH}" height="${HEIGHT}" fill="${card.background}"/>
	<rect x="96" y="300" width="120" height="3" fill="${card.rule}"/>
	<text x="96" y="260" font-family="Helvetica, Arial, sans-serif" font-size="86"
		font-weight="700" fill="${card.ink}">${escape(card.title)}</text>
	<text x="96" y="360" font-family="Helvetica, Arial, sans-serif" font-size="30"
		fill="${card.muted}">${escape(card.subtitle)}</text>
	<text x="96" y="548" font-family="Helvetica, Arial, sans-serif" font-size="22"
		fill="${card.muted}" letter-spacing="2">PLACEHOLDER — REPLACE WITH A PHOTOGRAPH</text>
</svg>`;

	await sharp(Buffer.from(svg)).png().toFile(path);
	console.log(`  created  ${card.file}  ${WIDTH}x${HEIGHT}`);
}

console.log('\n  Open Graph cards written to public/.\n');
