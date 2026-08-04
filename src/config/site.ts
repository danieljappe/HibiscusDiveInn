/**
 * Every piece of site-wide data lives here. Nothing in this file should ever
 * need a component edit to change.
 *
 * Values carrying the TODO prefix are placeholders awaiting confirmation from
 * the owner. A production build refuses to run while any remain.
 */

export const SITE = {
	name: 'Hibiscus Dive Inn',
	/** Used in <title> after the page name. */
	shortName: 'Hibiscus Dive Inn',
	tagline: 'A small dive inn on Bantayan Island',
	/** Canonical origin, no trailing slash. Set before launch. */
	url: 'TODO_SITE_URL',
	locale: 'en',
	region: 'PH',
	description:
		'A small, owner-run dive inn on Bantayan Island, Cebu. Simple rooms, house reef diving and courses with a single instructor.',
	/** Geo-targeting for search. */
	place: {
		island: 'Bantayan Island',
		province: 'Cebu',
		country: 'Philippines',
		latitude: 'TODO_LATITUDE',
		longitude: 'TODO_LONGITUDE',
	},
} as const;

/**
 * Two WhatsApp lines. The inn number handles rooms and general enquiries; the
 * dive number handles courses and dive questions. Digits only, no `+`.
 */
export const CONTACT = {
	whatsappInn: '639773284208',
	whatsappDive: '639398450270',
	email: 'TODO_EMAIL',
	address: 'TODO_ADDRESS',
	mapsUrl: 'TODO_MAPS_URL',
	facebook: 'TODO_FACEBOOK_URL',
	instagram: 'TODO_INSTAGRAM_URL',
} as const;

export type ContactChannel = 'inn' | 'dive';

/** Resolves a channel to its number and the label shown next to it. */
export const CHANNELS = {
	inn: { number: CONTACT.whatsappInn, label: 'the inn' },
	dive: { number: CONTACT.whatsappDive, label: 'the dive centre' },
} as const satisfies Record<ContactChannel, { number: string; label: string }>;

/**
 * Cloudflare Web Analytics is cookieless, so no consent banner is needed.
 * The script is only injected once a real token is set — until then the site
 * ships with zero third-party JavaScript.
 */
export const ANALYTICS = {
	cloudflareToken: 'TODO_CLOUDFLARE_ANALYTICS_TOKEN',
} as const;

/** Default enquiry template, per the brief. */
export const ENQUIRY_TEMPLATE = [
	`Hi ${SITE.name}! I'd like to ask about a stay.`,
	'',
	'Dates:',
	'Guests:',
	'Diving: certified / not certified / want to learn',
].join('\n');
