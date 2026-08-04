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
		file: 'hero-house-reef.jpg',
		width: 2400,
		height: 1600,
		placeholderColour: '#1A5A6E',
		brief:
			'The strongest single photo you have — the shoreline, the jetty, or a wide underwater shot of the house reef. Landscape, shot wide, with room at the top where the resort name sits.',
		usedOn: 'Homepage hero',
	},
	{
		file: 'room-single.jpg',
		width: 1600,
		height: 1200,
		placeholderColour: '#6FB3B0',
		brief: 'The single room, shot from the doorway with the bed and the window in frame.',
		usedOn: 'Homepage, rooms section',
	},
	{
		file: 'room-double.jpg',
		width: 1600,
		height: 1200,
		placeholderColour: '#4E8F94',
		brief: 'The double room, shot from the doorway so the whole room reads in one frame.',
		usedOn: 'Homepage, rooms section',
	},
	{
		file: 'room-four-person.jpg',
		width: 1600,
		height: 1200,
		placeholderColour: '#2E6E7E',
		brief: 'The four-person room, wide enough to show all the beds.',
		usedOn: 'Homepage, rooms section',
	},
	{
		file: 'diving-teaser.jpg',
		width: 1600,
		height: 1000,
		placeholderColour: '#0E2F42',
		brief:
			'An underwater photo with a diver in it. This one carries the transition into the dark half of the site, so darker and bluer is better than bright and sunny.',
		usedOn: 'Homepage, diving teaser',
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
