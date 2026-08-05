import type { APIRoute } from 'astro';

import { IS_PREVIEW } from '../config/preview';

/**
 * Generated rather than kept in public/, so the sitemap URL always matches
 * whatever `site` the build was configured with — and so preview builds can
 * lock crawlers out entirely.
 */
export const GET: APIRoute = ({ site }) => {
	if (IS_PREVIEW) {
		const body = [
			'# Preview build — placeholder content, not for indexing.',
			'User-agent: *',
			'Disallow: /',
			'',
		].join('\n');

		return new Response(body, {
			headers: { 'Content-Type': 'text/plain; charset=utf-8' },
		});
	}

	const sitemap = site ? new URL('sitemap-index.xml', site).href : '/sitemap-index.xml';

	const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemap}`, ''].join('\n');

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
