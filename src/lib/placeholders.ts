/**
 * Placeholder convention
 * ----------------------
 * Any value that has not been confirmed with the owner is written as an
 * unmistakable `TODO_` token, e.g. `TODO_EMAIL`, `TODO_RATE_GARDEN`.
 *
 * These are legal during development and are rendered as a visible inline
 * badge. They are fatal in a production build — see
 * `src/integrations/placeholder-guard.ts`.
 */

export const PLACEHOLDER_PREFIX = 'TODO_';

/** Matches a placeholder token wherever it appears, including inside prose. */
export const PLACEHOLDER_PATTERN = /TODO_[A-Z0-9_]+/g;

/** True when a value is an unresolved placeholder. */
export function isPlaceholder(value: unknown): value is string {
	return typeof value === 'string' && value.startsWith(PLACEHOLDER_PREFIX);
}

/** True when a string contains a placeholder anywhere inside it. */
export function containsPlaceholder(value: unknown): value is string {
	if (typeof value !== 'string') return false;
	PLACEHOLDER_PATTERN.lastIndex = 0;
	return PLACEHOLDER_PATTERN.test(value);
}

/**
 * Turns `TODO_RATE_GARDEN` into `rate garden` for the dev badge, so the badge
 * reads as a question the owner can answer rather than as a constant name.
 */
export function humanisePlaceholder(value: string): string {
	return value.slice(PLACEHOLDER_PREFIX.length).toLowerCase().replace(/_/g, ' ');
}
