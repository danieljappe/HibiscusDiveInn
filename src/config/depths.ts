/**
 * Depth rail tick positions.
 *
 * The rail is decoration with meaning: each page section is pinned to a depth,
 * and the rail's marker descends as the visitor scrolls. Depths are authored
 * here rather than in components so they can be retuned in one file.
 *
 * The rail only appears on /diving; the homepage stays at the surface.
 */

export type DepthTick = {
	/** Matches the section's DOM id. */
	id: string;
	/** Metres below the surface, as a positive number. 0 is the surface. */
	depth: number;
	/** Short label announced beside the tick. */
	label: string;
};

/**
 * `/diving` continues from -12m, where the homepage teaser sat.
 *
 * Dive site ticks are spaced evenly between DIVE_SITE_RANGE until real depth
 * data exists. This spacing is a design choice, not measured data — once a
 * site's `depthMaxM` is filled in, the rail sorts and positions by that
 * instead. See `raildepthsForSites`.
 */
export const DIVE_SITE_RANGE = { shallowest: 14, deepest: 30 } as const;

/**
 * The fixed sections of /diving. Dive site ticks are generated from the
 * collection and inserted between the intro and the courses — see
 * `railDepthsForSites`.
 */
export const DIVING_INTRO_DEPTH: DepthTick = {
	id: 'diving-intro',
	depth: 12,
	label: 'Descent',
};

export const DIVING_TAIL_DEPTHS: readonly DepthTick[] = [
	{ id: 'courses', depth: 32, label: 'Courses' },
	{ id: 'equipment', depth: 36, label: 'Equipment' },
	{ id: 'instructor', depth: 40, label: 'Instructor' },
	{ id: 'dive-contact', depth: 44, label: 'Get in touch' },
];

/**
 * Positions dive sites on the rail. Uses real `depthMaxM` values when every
 * site has one; otherwise falls back to even spacing by authored order.
 */
export function railDepthsForSites<T extends { id: string; label: string; depthMaxM?: number }>(
	sites: readonly T[],
): DepthTick[] {
	const haveRealDepths = sites.length > 0 && sites.every((s) => typeof s.depthMaxM === 'number');

	if (haveRealDepths) {
		return [...sites]
			.sort((a, b) => (a.depthMaxM as number) - (b.depthMaxM as number))
			.map((site) => ({ id: site.id, depth: site.depthMaxM as number, label: site.label }));
	}

	const { shallowest, deepest } = DIVE_SITE_RANGE;
	const step = sites.length > 1 ? (deepest - shallowest) / (sites.length - 1) : 0;
	return sites.map((site, index) => ({
		id: site.id,
		depth: Math.round(shallowest + step * index),
		label: site.label,
	}));
}
