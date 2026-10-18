/**
 * Every photograph the site needs.
 *
 * No real photos exist yet, so `npm run images:placeholders` generates a
 * solid-colour JPEG for each entry at the target dimensions. Filenames match
 * what the real photograph should be, so swapping one in is a straight
 * overwrite — no code or content change.
 *
 * This list is also what gets sent to the owner when asking for photos, via
 * the table in the README.
 */

export type ImageSpec = {
	/** Filename in src/assets/images. */
	file: string;
	/** Target pixel dimensions of the photo we want from the owner. */
	width: number;
	height: number;
	/** Palette colour used for the stand-in, so placeholders read as deliberate. */
	placeholderColour: string;
	/** What the photograph should actually show. Written for a non-developer. */
	brief: string;
	/** Where it appears. */
	usedOn: string;
};

export const IMAGE_MANIFEST: readonly ImageSpec[] = [
	{
		file: 'diving-header.jpg',
		width: 2400,
		height: 1400,
		placeholderColour: '#08202E',
		brief:
			'The best underwater photo you have — wide, deep blue, ideally with a diver for scale. It sits behind the heading at the top of the page.',
		usedOn: 'Page header',
	},
	{
		file: 'dive-site-house-reef.jpg',
		width: 1600,
		height: 1200,
		placeholderColour: '#1A5A6E',
		brief: 'The house reef underwater — coral, fish, whatever is characteristic of it.',
		usedOn: 'Dive sites',
	},
	{
		file: 'dive-site-two.jpg',
		width: 1600,
		height: 1200,
		placeholderColour: '#16495C',
		brief: 'The second dive site. Rename the file once the site has a name.',
		usedOn: 'Dive sites',
	},
	{
		file: 'dive-site-three.jpg',
		width: 1600,
		height: 1200,
		placeholderColour: '#123A4A',
		brief: 'The third dive site. Rename the file once the site has a name.',
		usedOn: 'Dive sites',
	},
	{
		file: 'instructor.jpg',
		width: 1200,
		height: 1500,
		placeholderColour: '#2E6E7E',
		brief:
			'A portrait of the instructor. A real photo of a person, not a stock image — this relationship is what guests are actually buying. Portrait orientation.',
		usedOn: 'Instructor section',
	},
];

/** Looks up a spec by filename. Throws early if a content file names an unknown image. */
export function imageSpec(file: string): ImageSpec {
	const spec = IMAGE_MANIFEST.find((entry) => entry.file === file);
	if (!spec) {
		throw new Error(
			`Unknown image "${file}". Add it to IMAGE_MANIFEST in src/config/images.ts, ` +
				`then run "npm run images:placeholders".`,
		);
	}
	return spec;
}
