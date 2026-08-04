# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Hibiscus Dive Inn — Build Brief

Static marketing site for a small dive resort on **Bantayan Island, Cebu, Philippines**.
Mobile-first. No booking system. Enquiries go to WhatsApp.

---

## 1. Scope

**In scope**

- Homepage (single scroll): hero, about, rooms, diving teaser, getting here, contact
- `/diving` — dedicated page for dive sites, courses, equipment, instructor
- WhatsApp deep link with a prefilled enquiry template as the primary call to action
- Static build, deployed to Cloudflare Pages

**Explicitly out of scope — do not build**

- Booking engine, availability calendar, date pickers
- Database, CMS, admin panel, authentication
- Payments of any kind
- Contact form with a backend (v1 uses WhatsApp + `mailto:` only)
- Cookie banner (see analytics below — none is required)
- Multi-language support

Phase 2 (a booking system with Payload + Postgres + PayMongo) has been designed
separately and is deferred until the resort is busier. Do not build toward it, but
do not make it harder either: keep content in structured files, not hardcoded in
components.

---

## 2. Stack

| Concern   | Choice                                                               |
| --------- | -------------------------------------------------------------------- |
| Framework | **Astro** (latest), static output, zero client JS by default         |
| Styling   | Plain CSS with custom properties. No Tailwind, no CSS-in-JS          |
| Content   | Astro Content Collections (markdown) + one typed config file         |
| Images    | `astro:assets` — AVIF/WebP, responsive `srcset`, lazy below the fold |
| Fonts     | Self-hosted via `@fontsource-variable`. No Google Fonts CDN request  |
| Analytics | Cloudflare Web Analytics (cookieless, so no consent banner)          |
| Host      | Cloudflare Pages, connected to the GitHub repo                       |

**No React, Vue, or Svelte.** If an island of interactivity is genuinely needed,
use a few lines of vanilla JS in a `<script>` tag.

Performance target: Lighthouse mobile 95+ across the board, < 100KB JS total
(realistically ~0), LCP under 2.0s on a throttled 4G connection. Guests will load
this on Philippine mobile data.

---

## 3. Design direction

The generic version of this site is a turquoise gradient hero, a palm-leaf divider,
and a serif headline over a beach photo. Do not build that.

### Concept: the site descends

The visual system is based on **depth**. The homepage sits at the surface — bright,
sand-toned, warm. The `/diving` page is submerged — dark, blue, quiet. Moving between
them should feel like descending. This is the organising idea; everything else serves it.

### Colour

```
--abyss     #08202E   deep water, /diving background
--midwater  #1A5A6E   section accents, /diving surfaces
--shallow   #6FB3B0   used sparingly, never as a large fill
--sand      #DCD3C3   homepage background
--shell     #F6F2EA   cards and raised surfaces on the homepage
--signal    #FFA83C   CTAs only — the high-vis amber of dive gear
```

`--signal` appears only on interactive elements. If it shows up as decoration,
it has been misused.

### Type

- **Display:** Bricolage Grotesque Variable — headings only, tight tracking at
  large sizes
- **Body:** Instrument Sans — everything readable
- **Data:** JetBrains Mono — depths, temperatures, course durations, dive site
  stats. Mono here is not decorative: it makes the dive data read like a dive
  computer or logbook, which is the vernacular of the audience

Type scale is fluid via `clamp()`. Body text minimum 17px on mobile.

### Signature element: the depth rail

A thin fixed rail down the left edge (right edge in RTL, though we ship LTR only),
marked with depth ticks in mono type. As the visitor scrolls, the rail's active
marker descends and the tick labels change:

```
 0m  ── surface / hero
-4m  ── rooms
-12m ── diving
-30m ── contact (deepest point of the page)
```

On `/diving`, the rail continues from -12m downward through the dive sites,
ordered by actual depth where that data exists.

This is the one memorable element. Constraints:

- Max 28px wide on mobile; it must never crowd content
- Hidden entirely below 360px viewport width
- Purely CSS scroll-driven where supported; a tiny `IntersectionObserver`
  fallback is acceptable
- Fully disabled under `prefers-reduced-motion: reduce` — the rail renders
  static, no movement
- It is decoration with meaning, not navigation. Do not make it the only way
  to reach a section

Everything else stays quiet. One bold idea, executed precisely.

---

## 4. Page structure

### `/` — homepage

1. **Hero** — full-bleed underwater or shoreline photograph, resort name in
   display type, one line of positioning copy, WhatsApp CTA. No carousel.
2. **About** — two or three short paragraphs. Who runs it, what kind of stay
   it is. Written plainly, not in brochure voice.
3. **Rooms** — a section, not a separate page. One card per room type:
   photo, name, capacity, short description, indicative nightly rate,
   "Ask about this room" CTA that deep-links to WhatsApp with the room name
   prefilled. Stacked single-column on mobile; two columns from 768px.
4. **Diving teaser** — three or four lines plus a photo, linking to `/diving`.
   The visual transition into darker tones starts here.
5. **Getting here** — Bantayan is awkward to reach and this will otherwise be
   the most common question. Cover: fly to Cebu (Mactan), overland to Hagnaya
   port, ferry to Santa Fe, then transfer to the resort. **Mark every leg with
   a placeholder for duration and cost — the exact route, timings and fares
   must be confirmed with the owner before launch. Do not invent them.**
6. **Contact** — WhatsApp primary, email secondary, map link, social links.

### `/diving`

Dark palette throughout.

1. Header — the case for diving Bantayan
2. **Dive sites** — one entry each: name, depth range, difficulty, what you see,
   boat time. Depth and difficulty in mono type.
3. **Courses** — open water, advanced, and so on. Duration and indicative price.
4. **Equipment & boat** — what is provided, what to bring
5. **The instructor** — photo, certifications, short bio. This is a
   one-instructor operation and that personal relationship is the actual product.
   Give it real space.
6. WhatsApp CTA with diving context prefilled

---

## 5. Content model

All copy lives in content files. No prose hardcoded in `.astro` components —
Daniel maintains this alone and edits must be one-file changes.

```
src/
  content/
    rooms/*.md         # one file per room type
    dive-sites/*.md    # one file per site
    courses/*.md       # one file per course
    pages/about.md
    pages/getting-here.md
  config/
    site.ts            # contact details, prices, social links, metadata
```

Define Zod schemas for every collection so a malformed edit fails the build
rather than shipping broken.

### Placeholders

All contact details are placeholders for now. Put every one in `src/config/site.ts`
using an unmistakable convention:

```ts
export const CONTACT = {
  whatsapp: 'TODO_WHATSAPP_E164', // e.g. 639171234567 — digits only, no +
  email: 'TODO_EMAIL',
  address: 'TODO_ADDRESS',
  mapsUrl: 'TODO_MAPS_URL',
  facebook: 'TODO_FACEBOOK_URL',
  instagram: 'TODO_INSTAGRAM_URL',
} as const;
```

Add a build-time check that **fails a production build** if any `TODO_` value
remains, with a message listing which keys are unset. Development builds should
warn and render a visible inline badge instead, so nothing placeholder-shaped
ships by accident.

Room rates, course prices, and travel times are also placeholders —
same convention, same treatment.

---

## 6. The WhatsApp CTA

Primary conversion mechanism. Build one `<WhatsAppLink>` component:

```
https://wa.me/{number}?text={encodeURIComponent(message)}
```

Default prefilled message:

```
Hi Hibiscus Dive Inn! I'd like to ask about a stay.

Dates:
Guests:
Diving: certified / not certified / want to learn
```

The component accepts a `context` prop so room cards and course entries prefill
their own subject line ("Asking about the Garden Room"). The point is that the
owner receives a structured enquiry rather than "hi is it free?" — this is where
most of the value of a booking form lives, at none of the cost.

Provide a `mailto:` fallback beneath it for visitors without WhatsApp.

---

## 7. Quality floor

- Mobile-first CSS. Author for 360px, enhance upward. Breakpoints at 768 and 1200
- Every interactive element has a visible `:focus-visible` state
- Semantic landmarks, one `<h1>` per page, alt text on every image
- Tap targets 44px minimum
- `prefers-reduced-motion` respected everywhere, not just the depth rail
- Colour contrast meets WCAG AA, including `--signal` on both backgrounds —
  verify, do not assume
- Works with JavaScript disabled

### SEO

- `LodgingBusiness` JSON-LD on the homepage, `TouristAttraction` or `Service`
  for dive offerings
- Open Graph and Twitter card images
- `sitemap.xml` and `robots.txt` via `@astrojs/sitemap`
- Descriptive title and meta description per page, geo-targeted to
  Bantayan Island and Cebu
- Canonical URLs

Google is how divers will find this resort. Treat structured data as a feature,
not a chore.

---

## 8. Repository

Single repo, no monorepo. Include:

- `README.md` — how to run, build, and deploy; where to change content;
  how to update contact details
- A section written for a non-developer explaining how to send new photos
  or text changes to Daniel
- `.nvmrc`, Prettier config, a `check` script running `astro check`
- GitHub Actions: typecheck and build on PR. Cloudflare Pages handles deploys
  from `main`

---

## 9. Acceptance

- [ ] Homepage and `/diving` complete, rooms as a homepage section
- [ ] Depth rail works, degrades on small screens, respects reduced motion
- [ ] All contact data behind `TODO_` placeholders; production build fails if unset
- [ ] Lighthouse mobile 95+ performance, accessibility, best practices, SEO
- [ ] No client JS beyond the depth rail fallback
- [ ] Content editable without touching a component
- [ ] Builds clean with `astro check`
