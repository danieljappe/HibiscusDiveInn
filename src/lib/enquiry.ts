import { CONTACT, ENQUIRY_TEMPLATE } from '../config/site';

/**
 * Builds the prefilled WhatsApp message.
 *
 * A `context` — "the Open Water course", "a fun dive" — is inserted as a
 * subject line above the template, so the owner can see what the enquiry is
 * about before reading the rest.
 */
export function buildEnquiry(context?: string): string {
	if (!context) return ENQUIRY_TEMPLATE;

	const [greeting, ...rest] = ENQUIRY_TEMPLATE.split('\n');
	return [greeting, '', `Asking about: ${context}`, ...rest].join('\n');
}

/** wa.me deep link with the message URL-encoded. */
export function whatsappHref(context?: string): string {
	return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(buildEnquiry(context))}`;
}

/** Subject line for the mailto: fallback. */
export function mailtoHref(email: string, context?: string): string {
	const subject = context ? `Enquiry: ${context}` : 'Enquiry';
	const body = buildEnquiry(context);
	return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
