import type { APIRoute } from 'astro';

/**
 * Generated rather than kept in public/, so the sitemap URL always matches
 * whatever `site` the build was configured with.
 */
export const GET: APIRoute = ({ site }) => {
	const sitemap = site ? new URL('sitemap-index.xml', site).href : '/sitemap-index.xml';

	const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemap}`, ''].join('\n');

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
