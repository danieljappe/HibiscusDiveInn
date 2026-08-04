import { CHANNELS, ENQUIRY_TEMPLATES, type ContactChannel } from '../config/site';

/**
 * Builds the prefilled WhatsApp message.
 *
 * A `context` — "the Garden Room", "the Open Water course" — is inserted as a
 * subject line above the template, so the owner can see what the enquiry is
 * about before reading the rest.
 */
export function buildEnquiry(channel: ContactChannel, context?: string): string {
	const template = ENQUIRY_TEMPLATES[channel];
	if (!context) return template;

	const [greeting, ...rest] = template.split('\n');
	return [greeting, '', `Asking about: ${context}`, ...rest].join('\n');
}

/** wa.me deep link with the message URL-encoded. */
export function whatsappHref(channel: ContactChannel, context?: string): string {
	const number = CHANNELS[channel].number;
	return `https://wa.me/${number}?text=${encodeURIComponent(buildEnquiry(channel, context))}`;
}

/** Subject line for the mailto: fallback. */
export function mailtoHref(email: string, channel: ContactChannel, context?: string): string {
	const subject = context ? `Enquiry: ${context}` : 'Enquiry';
	const body = buildEnquiry(channel, context);
	return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
