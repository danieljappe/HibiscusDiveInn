/**
 * Philippine mobile numbers are stored as bare E.164 digits (no `+`) because
 * that is the format wa.me requires. Humans see them spaced.
 */

/** `639773284208` -> `+63 977 328 4208` */
export function formatPhone(e164Digits: string): string {
	const match = /^63(\d{3})(\d{3})(\d{4})$/.exec(e164Digits);
	if (!match) return e164Digits;
	return `+63 ${match[1]} ${match[2]} ${match[3]}`;
}

/** `639773284208` -> `+639773284208`, for `tel:` hrefs. */
export function telHref(e164Digits: string): string {
	return `tel:+${e164Digits}`;
}
