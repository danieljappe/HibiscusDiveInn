// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import placeholderGuard from './src/integrations/placeholder-guard.ts';
import { IS_PREVIEW } from './src/config/preview.ts';

/**
 * Static output, deployed to Cloudflare Pages.
 *
 * TODO: swap this for the custom domain at launch, and set SITE.url in
 * src/config/site.ts to match. Until then the Cloudflare Pages preview
 * domain is used so canonical URLs, Open Graph tags and the sitemap all
 * resolve against somewhere real.
 */
const SITE_URL = 'https://hibiscus-dive-inn.pages.dev';

/**
 * PREVIEW_SITE points canonical and Open Graph URLs at a local origin when
 * auditing, so Lighthouse is measuring the document it actually fetched.
 */
const siteUrl = process.env.PREVIEW_SITE ?? SITE_URL;

// https://astro.build/config
export default defineConfig({
	site: siteUrl,
	output: 'static',
	trailingSlash: 'never',
	/*
	 * No sitemap in preview: a placeholder-filled build on a .pages.dev URL
	 * should not be handing crawlers a map of itself. robots.txt and the
	 * robots meta tag are switched over by the same flag.
	 */
	integrations: [...(IS_PREVIEW ? [] : [sitemap()]), placeholderGuard()],
	build: {
		inlineStylesheets: 'auto',
	},
	image: {
		// AVIF and WebP, generated at build time.
		responsiveStyles: true,
	},
	compressHTML: true,
});
