import { SITE, CONTACT } from '../config/site';
import { isPlaceholder } from './placeholders';

/**
 * Structured data.
 *
 * Google is how divers find the dive centre, so this is treated as a feature
 * rather than a chore. Unconfirmed values are omitted rather than emitted as
 * `TODO_` strings — publishing a placeholder as though it were data is worse
 * than publishing nothing, and a production build cannot ship placeholders
 * anyway.
 */

/** Drops keys whose values are undefined, null, empty, or still placeholders. */
function clean<T extends Record<string, unknown>>(input: T): Partial<T> {
	return Object.fromEntries(
		Object.entries(input).filter(([, value]) => {
			if (value === undefined || value === null) return false;
			if (typeof value === 'string') return value.length > 0 && !isPlaceholder(value);
			if (Array.isArray(value)) return value.length > 0;
			return true;
		}),
	) as Partial<T>;
}

const absolute = (path: string, site: URL | undefined) =>
	site ? new URL(path, site).href : undefined;

function address() {
	return clean({
		'@type': 'PostalAddress',
		streetAddress: CONTACT.address,
		addressLocality: SITE.place.island,
		addressRegion: SITE.place.province,
		addressCountry: 'PH',
	});
}

function geo() {
	if (isPlaceholder(SITE.place.latitude) || isPlaceholder(SITE.place.longitude)) return undefined;
	return {
		'@type': 'GeoCoordinates',
		latitude: SITE.place.latitude,
		longitude: SITE.place.longitude,
	};
}

/**
 * The dive centre itself, with its courses as an offer catalogue. A local
 * business rather than a bare Service, so it can carry the address, map and
 * phone that local search results show.
 */
export function diveCentreSchema(options: {
	site: URL | undefined;
	ogImage: string;
	courses: { title: string; suitableFor: string }[];
}) {
	const { site, ogImage, courses } = options;

	return clean({
		'@context': 'https://schema.org',
		'@type': 'SportsActivityLocation',
		'@id': absolute('/#dive-centre', site),
		name: SITE.name,
		description: SITE.description,
		url: absolute('/', site),
		image: absolute(ogImage, site),
		address: address(),
		geo: geo(),
		hasMap: CONTACT.mapsUrl,
		email: CONTACT.email,
		telephone: `+${CONTACT.whatsapp}`,
		sameAs: [CONTACT.facebook, CONTACT.instagram].filter((url) => !isPlaceholder(url)),
		areaServed: clean({
			'@type': 'Place',
			name: `${SITE.place.island}, ${SITE.place.province}, ${SITE.place.country}`,
		}),
		hasOfferCatalog: {
			'@type': 'OfferCatalog',
			name: 'Dives and courses',
			itemListElement: courses.map((course) => ({
				'@type': 'Offer',
				itemOffered: clean({
					'@type': 'Service',
					name: course.title,
					description: course.suitableFor,
				}),
			})),
		},
	});
}

/** Helps search engines render the site name and breadcrumb. */
export function websiteSchema(site: URL | undefined) {
	return clean({
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': absolute('/#website', site),
		name: SITE.name,
		url: absolute('/', site),
		inLanguage: SITE.locale,
	});
}
