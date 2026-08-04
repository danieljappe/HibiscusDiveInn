import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Content collections.
 *
 * Every schema is strict so a malformed edit fails the build rather than
 * shipping broken. Fields that are not yet confirmed by the owner are typed as
 * plain strings so they can hold a `TODO_` placeholder — the placeholder guard,
 * not Zod, is what stops those reaching production.
 */

/** A value awaiting confirmation, e.g. `TODO_RATE_GARDEN` or a real figure. */
const unconfirmed = z.string().min(1);

/** Filename of a photo in src/assets/images, e.g. `room-garden.jpg`. */
const imageFile = z.string().regex(/^[a-z0-9-]+\.(jpg|png|webp)$/, {
	message: 'Use a lowercase, hyphenated filename with an extension, e.g. room-garden.jpg',
});

const rooms = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/rooms' }),
	schema: z.object({
		title: z.string(),
		/** Display order in the rooms section. Lower is first. */
		order: z.number().int(),
		/** How many people the room sleeps. Confirmed: rooms are 1, 2 and 4 person. */
		sleeps: z.number().int().positive(),
		/** One or two sentences on the card. */
		summary: z.string().max(240),
		/** Indicative nightly rate. Placeholder until the owner confirms. */
		rate: unconfirmed,
		/** Qualifier shown beside the rate, e.g. "per night, two sharing". */
		rateNote: z.string().optional(),
		features: z.array(z.string()).default([]),
		image: imageFile,
		imageAlt: z.string().min(1),
		draft: z.boolean().default(false),
	}),
});

const diveSites = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/dive-sites' }),
	schema: z.object({
		title: z.string(),
		order: z.number().int(),
		/** Human-readable range shown in mono, e.g. "12-24 m". Unconfirmed. */
		depthRange: unconfirmed,
		/**
		 * Maximum depth in metres, used only to position the site on the depth
		 * rail. Leave unset until real data exists — the rail falls back to
		 * even spacing by `order`. See src/config/depths.ts.
		 */
		depthMaxM: z.number().positive().optional(),
		difficulty: z.enum(['TODO_DIFFICULTY', 'beginner', 'intermediate', 'advanced']),
		/** Boat time from the inn. Unconfirmed. */
		boatTime: unconfirmed,
		/** What you see down there. */
		highlights: z.array(z.string()).min(1),
		image: imageFile,
		imageAlt: z.string().min(1),
		draft: z.boolean().default(false),
	}),
});

const courses = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/courses' }),
	schema: z.object({
		title: z.string(),
		order: z.number().int(),
		/** Certifying agency. Unconfirmed — do not assume PADI or SSI. */
		agency: unconfirmed,
		/** e.g. "3-4 days". Unconfirmed. */
		duration: unconfirmed,
		/** Indicative price. Unconfirmed. */
		price: unconfirmed,
		priceNote: z.string().optional(),
		/** Who the course is for, in a sentence. */
		suitableFor: z.string(),
		prerequisites: z.string().optional(),
		includes: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
	}),
});

/** One leg of the journey to the inn. Durations and fares are unconfirmed. */
const journeyLeg = z.object({
	from: z.string(),
	to: z.string(),
	/** e.g. "Flight", "Van", "Ferry". */
	mode: z.string(),
	duration: unconfirmed,
	cost: unconfirmed,
	note: z.string().optional(),
});

const pages = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
	schema: z.object({
		title: z.string(),
		/** Optional short lead-in shown above the body copy. */
		intro: z.string().optional(),
		/**
		 * getting-here.md only. Every leg's duration and cost must be confirmed
		 * with the owner before launch.
		 */
		legs: z.array(journeyLeg).optional(),
		/** instructor.md only. */
		certifications: z.array(unconfirmed).optional(),
		instructorName: z.string().optional(),
		image: imageFile.optional(),
		imageAlt: z.string().optional(),
		/** equipment.md only. */
		provided: z.array(z.string()).optional(),
		bringYourOwn: z.array(z.string()).optional(),
	}),
});

export const collections = { rooms, diveSites, courses, pages };
