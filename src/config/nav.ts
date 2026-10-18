/**
 * The menu, in page order. Each entry links to a section by its DOM id; the
 * depth shown beside it comes from the depth rail's ticks, so the menu and the
 * rail never disagree. See src/pages/index.astro.
 */
export const NAV_SECTIONS = [
	{ id: 'dive-sites', label: 'Dive sites' },
	{ id: 'courses', label: 'Courses' },
	{ id: 'equipment', label: 'Equipment' },
	{ id: 'instructor', label: 'The instructor' },
	{ id: 'getting-here', label: 'Getting here' },
	{ id: 'dive-contact', label: 'Contact' },
] as const;

export type NavItem = { id: string; label: string; depth?: number };
