import { getEntry } from 'astro:content';

/**
 * Fetches a page entry, failing with a message that covers both reasons it
 * can be absent.
 *
 * "Missing src/content/pages/x.md" is misleading when the file is sitting
 * right there: the other cause is a stale content store, which happens if
 * `.astro/` is deleted while the dev server is running. The server keeps
 * serving from an emptied store and every collection reads as empty.
 */
export async function requirePage(id: string) {
	const entry = await getEntry('pages', id);

	if (!entry) {
		throw new Error(
			`No "${id}" entry in the pages collection.\n\n` +
				`Expected: src/content/pages/${id}.md\n\n` +
				`If that file does exist, the content store is stale — this happens when\n` +
				`.astro/ is removed while the dev server is running. Fix it with:\n` +
				`  npx astro dev stop && rm -rf .astro && npm run dev`,
		);
	}

	return entry;
}
