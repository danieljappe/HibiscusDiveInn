/**
 * Preview mode.
 *
 * `PREVIEW=true` produces a build that can be deployed for the client to look
 * at before the owner has supplied the outstanding details. It:
 *
 *   - downgrades the placeholder guard from a hard failure to a warning
 *   - adds <meta name="robots" content="noindex, nofollow">
 *   - serves a robots.txt that disallows everything
 *   - skips the sitemap
 *
 * A .pages.dev URL full of placeholder copy must not be indexed, so the three
 * crawler measures are tied to the same flag as the relaxed guard — you cannot
 * get the lenient build without also getting the noindex.
 *
 * PREVIEW must never be set on the production deployment. Unset, every one of
 * the behaviours above reverts and the build fails on any remaining TODO_.
 *
 * Read via process.env rather than import.meta.env. Both happen to resolve in
 * .astro frontmatter at build time (verified), but import.meta.env only
 * carries PUBLIC_-prefixed variables by contract, and this flag is deliberately
 * not public — it is consumed in astro.config, in an integration, and in
 * frontmatter, all of which run in Node.
 */

function readFlag(value: string | undefined): boolean {
	if (!value) return false;
	const normalised = value.trim().toLowerCase();
	return normalised === 'true' || normalised === '1';
}

export const IS_PREVIEW = readFlag(process.env.PREVIEW);

/** Shown in build output so a preview build is never mistaken for a real one. */
export const PREVIEW_BANNER =
	'PREVIEW=true — this build is noindex, has no sitemap, and tolerates placeholders. Do not use it for production.';
