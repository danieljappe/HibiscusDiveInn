/**
 * Every piece of site-wide data lives here. Nothing in this file should ever
 * need a component edit to change.
 *
 * Values carrying the TODO prefix are placeholders awaiting confirmation from
 * the owner. A production build refuses to run while any remain.
 */

export const SITE = {
	name: 'Island Divers',
	/** Used in <title> after the page name. */
	shortName: 'Island Divers',
	tagline: 'Diving on Bantayan Island',
	/** Canonical origin, no trailing slash. Set before launch. */
	url: 'TODO_SITE_URL',
	locale: 'en',
	region: 'PH',
	description:
		'Island Divers: small-group diving and dive courses on Bantayan Island, Cebu, with a house reef you can walk into and one instructor.',
	/** Geo-targeting for search. */
	place: {
		island: 'Bantayan Island',
		province: 'Cebu',
		country: 'Philippines',
		latitude: 'TODO_LATITUDE',
		longitude: 'TODO_LONGITUDE',
	},
} as const;

/** Digits only for WhatsApp, no `+`. */
export const CONTACT = {
	whatsapp: '639398450270',
	email: 'TODO_EMAIL',
	address: 'TODO_ADDRESS',
	/** Island Divers' Google Maps listing, which also carries its reviews. */
	mapsUrl: 'https://maps.app.goo.gl/c6YD1M7N8WPJANvx8',
	facebook: 'TODO_FACEBOOK_URL',
	instagram: 'TODO_INSTAGRAM_URL',
} as const;

/**
 * The owners' inn. It is a separate business with its own site, and this one
 * points to it once, for divers who need somewhere to stay.
 */
export const INN = {
	name: 'Hibiscus Coral Inn',
	/** The rooms site. Not live yet. */
	url: 'TODO_INN_SITE_URL',
} as const;

/**
 * Cloudflare Web Analytics is cookieless, so no consent banner is needed.
 * The script is only injected once a real token is set — until then the site
 * ships with zero third-party JavaScript.
 */
export const ANALYTICS = {
	cloudflareToken: 'TODO_CLOUDFLARE_ANALYTICS_TOKEN',
} as const;

/**
 * The prefilled enquiry. The whole point is that the owner receives a
 * structured enquiry rather than "hi is it free?".
 */
export const ENQUIRY_TEMPLATE = [
	`Hi ${SITE.name}! I'd like to ask about diving.`,
	'',
	'Dates:',
	'Divers:',
	'Experience: certified / not certified / want to learn',
].join('\n');
