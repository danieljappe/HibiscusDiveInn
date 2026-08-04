/**
 * Depth rail tick positions.
 *
 * The rail is decoration with meaning: each page section is pinned to a depth,
 * and the rail's marker descends as the visitor scrolls. Depths are authored
 * here rather than in components so they can be retuned in one file.
 *
 * The brief fixes four homepage ticks (0, -4, -12, -30). `about` at -2m and
 * `getting-here` at -20m are interpolated to keep the scale monotonic across
 * all six sections.
 */

export type DepthTick = {
	/** Matches the section's DOM id. */
	id: string;
	/** Metres below the surface, as a positive number. 0 is the surface. */
	depth: number;
	/** Short label announced beside the tick. */
	label: string;
};

export const HOME_DEPTHS: readonly DepthTick[] = [
	{ id: 'hero', depth: 0, label: 'Surface' },
	{ id: 'about', depth: 2, label: 'About' },
	{ id: 'rooms', depth: 4, label: 'Rooms' },
	{ id: 'diving', depth: 12, label: 'Diving' },
	{ id: 'getting-here', depth: 20, label: 'Getting here' },
	{ id: 'contact', depth: 30, label: 'Contact' },
];

/**
 * `/diving` continues from -12m, where the homepage teaser sat.
 *
 * Dive site ticks are spaced evenly between DIVE_SITE_RANGE until real depth
 * data exists. This spacing is a design choice, not measured data — once a
 * site's `depthMaxM` is filled in, the rail sorts and positions by that
 * instead. See `raildepthsForSites`.
 */
export const DIVE_SITE_RANGE = { shallowest: 14, deepest: 30 } as const;

export const DIVING_DEPTHS: readonly DepthTick[] = [
	{ id: 'diving-intro', depth: 12, label: 'Descent' },
	{ id: 'dive-sites', depth: 14, label: 'Dive sites' },
	{ id: 'courses', depth: 32, label: 'Courses' },
	{ id: 'equipment', depth: 36, label: 'Equipment' },
	{ id: 'instructor', depth: 40, label: 'Instructor' },
	{ id: 'dive-contact', depth: 44, label: 'Get in touch' },
];

/**
 * Positions dive sites on the rail. Uses real `depthMaxM` values when every
 * site has one; otherwise falls back to even spacing by authored order.
 */
export function railDepthsForSites<T extends { id: string; depthMaxM?: number }>(
	sites: readonly T[],
): DepthTick[] {
	const haveRealDepths = sites.length > 0 && sites.every((s) => typeof s.depthMaxM === 'number');

	if (haveRealDepths) {
		return [...sites]
			.sort((a, b) => (a.depthMaxM as number) - (b.depthMaxM as number))
			.map((site) => ({ id: site.id, depth: site.depthMaxM as number, label: site.id }));
	}

	const { shallowest, deepest } = DIVE_SITE_RANGE;
	const step = sites.length > 1 ? (deepest - shallowest) / (sites.length - 1) : 0;
	return sites.map((site, index) => ({
		id: site.id,
		depth: Math.round(shallowest + step * index),
		label: site.id,
	}));
}
