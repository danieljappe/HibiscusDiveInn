// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import placeholderGuard from './src/integrations/placeholder-guard.ts';
import { SITE } from './src/config/site.ts';

/**
 * Static output, deployed to Cloudflare Pages.
 *
 * `site` is required for canonical URLs and the sitemap. It is a TODO_
 * placeholder until the domain is confirmed, so a fallback is used to keep the
 * build running — the placeholder guard is what refuses to ship it.
 */
const siteUrl = SITE.url.startsWith('TODO_') ? 'https://example.invalid' : SITE.url;

// https://astro.build/config
export default defineConfig({
	site: siteUrl,
	output: 'static',
	trailingSlash: 'never',
	integrations: [sitemap(), placeholderGuard()],
	build: {
		inlineStylesheets: 'auto',
	},
	image: {
		// AVIF and WebP, generated at build time.
		responsiveStyles: true,
	},
	compressHTML: true,
});
