/**
 * Verifies every foreground/background pairing the site actually uses against
 * WCAG 2.1 AA. The brief says to verify contrast rather than assume it, and
 * --signal in particular is a trap: it is unusable as text on sand.
 *
 * Run with `npm run check:contrast`.
 */

const PALETTE = {
	abyss: '#08202E',
	midwater: '#1A5A6E',
	shallow: '#6FB3B0',
	sand: '#DCD3C3',
	shell: '#F6F2EA',
	signal: '#FFA83C',
	// Derived tokens from tokens.css
	'surface/bg-sunk': '#CFC5B2',
	'surface/fg-muted': '#4A5A63',
	'surface/rule': '#B5A992',
	'surface/rail-tick': '#63717A',
	'surface/cta-hover': '#F09420',
	'deep/bg-raised': '#0E2F42',
	'deep/fg-muted': '#A9C2CC',
	'deep/rule': '#24505F',
	'deep/rail-tick': '#7D9AA6',
	'deep/cta-hover': '#FFBB63',
};

/** Text pairings: [foreground, background, label, minimum ratio] */
const PAIRS = [
	// --- surface theme (homepage) ---
	['abyss', 'sand', 'body text', 4.5],
	['abyss', 'shell', 'text on cards', 4.5],
	['surface/fg-muted', 'sand', 'muted text', 4.5],
	['surface/fg-muted', 'shell', 'muted text on cards', 4.5],
	['midwater', 'sand', 'links', 4.5],
	['midwater', 'shell', 'links on cards', 4.5],
	['abyss', 'signal', 'CTA label on amber fill', 4.5],
	['abyss', 'surface/cta-hover', 'CTA label, hovered', 4.5],
	['abyss', 'surface/bg-sunk', 'text on sunk surface', 4.5],

	// --- deep theme (/diving) ---
	['shell', 'abyss', 'body text', 4.5],
	['shell', 'deep/bg-raised', 'text on cards', 4.5],
	['deep/fg-muted', 'abyss', 'muted text', 4.5],
	['deep/fg-muted', 'deep/bg-raised', 'muted text on cards', 4.5],
	['shallow', 'abyss', 'links', 4.5],
	['shallow', 'deep/bg-raised', 'links on cards', 4.5],
	['signal', 'abyss', 'link hover / rail marker', 4.5],
	['signal', 'deep/bg-raised', 'link hover on cards', 4.5],
	['abyss', 'signal', 'CTA label on amber fill', 4.5],
	['abyss', 'deep/cta-hover', 'CTA label, hovered', 4.5],

	// --- non-text: focus rings and borders need 3:1 ---
	['abyss', 'sand', 'focus ring on page', 3],
	['abyss', 'shell', 'focus ring on cards', 3],
	['signal', 'abyss', 'focus ring on page', 3],
	['signal', 'deep/bg-raised', 'focus ring on cards', 3],

	/*
	 * Depth rail glyphs. They are aria-hidden decoration that duplicates
	 * headings, so WCAG 1.4.3 does not bind, but they still have to be
	 * legible — held to the 3:1 non-text bar.
	 */
	['surface/rail-tick', 'sand', 'rail depth ticks', 3],
	['deep/rail-tick', 'abyss', 'rail depth ticks', 3],
];

/**
 * Decorative separators. WCAG 1.4.11 covers UI components and meaningful
 * graphics; a divider that carries no information is exempt. Reported so a
 * change that makes one invisible is at least visible here.
 */
const DECORATIVE = [
	['surface/rule', 'sand', 'hairline rule'],
	['deep/rule', 'abyss', 'hairline rule'],
];

/** Pairings that must NOT be used. Guards against regressions. */
const FORBIDDEN = [['signal', 'sand', '--signal as text or hairline on the homepage']];

function toLinear(channel) {
	const c = channel / 255;
	return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
	const value = hex.replace('#', '');
	const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
	return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrast(a, b) {
	const [x, y] = [luminance(PALETTE[a]), luminance(PALETTE[b])].sort((m, n) => n - m);
	return (x + 0.05) / (y + 0.05);
}

let failures = 0;
console.log('\n  Contrast audit — WCAG 2.1\n');

for (const [fg, bg, label, min] of PAIRS) {
	const ratio = contrast(fg, bg);
	const pass = ratio >= min;
	if (!pass) failures++;
	const mark = pass ? '  ok ' : 'FAIL';
	console.log(
		`  ${mark}  ${ratio.toFixed(2).padStart(5)}:1  (min ${min})  ${fg} on ${bg} — ${label}`,
	);
}

console.log('');
for (const [fg, bg, label] of DECORATIVE) {
	const ratio = contrast(fg, bg);
	console.log(`  deco  ${ratio.toFixed(2).padStart(5)}:1  (n/a)      ${fg} on ${bg} — ${label}`);
}

console.log('');
for (const [fg, bg, why] of FORBIDDEN) {
	const ratio = contrast(fg, bg);
	console.log(`  note  ${ratio.toFixed(2).padStart(5)}:1  ${fg} on ${bg} — forbidden: ${why}`);
	if (ratio >= 4.5) {
		console.log('        ^ this pairing now passes; the note above is stale.');
	}
}

if (failures > 0) {
	console.error(`\n  ${failures} pairing(s) below the minimum.\n`);
	process.exit(1);
}
console.log(`\n  All ${PAIRS.length} pairings pass.\n`);
