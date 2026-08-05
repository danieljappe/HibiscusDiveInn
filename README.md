# Hibiscus Dive Inn

Static marketing site for a small dive inn on Bantayan Island, Cebu, Philippines.
Two pages, no booking system — enquiries go to WhatsApp.

Built with [Astro](https://astro.build), plain CSS, and no client-side framework.
The production build ships **zero JavaScript** apart from a small inline fallback
for the depth rail.

---

## Running it

You need [Node](https://nodejs.org) 22 or newer. The version is pinned in `.nvmrc`,
so `nvm use` will pick it up.

```bash
npm install
npm run dev        # http://localhost:4321
```

| Command                       | What it does                                          |
| ----------------------------- | ----------------------------------------------------- |
| `npm run dev`                 | Development server, with placeholder warnings         |
| `npm run build`               | Production build. **Fails** while any `TODO_` remains |
| `npm run build:preview`       | Build anyway, placeholders and all. Never deploy this |
| `npm run preview`             | Serve the last build locally                          |
| `npm run check`               | Type-check components and validate content files      |
| `npm run check:contrast`      | Verify every colour pairing against WCAG AA           |
| `npm run placeholders`        | List every value still to confirm with the owner      |
| `npm run images:placeholders` | Create stand-in photos for anything missing           |
| `npm run images:og`           | Create the social sharing cards                       |
| `npm run format`              | Format everything with Prettier                       |

Astro 7 runs the dev server as a background daemon. `npx astro dev stop` stops it,
and `npx astro dev logs` shows its output.

> If the dev server starts reporting collections as empty or content files as
> missing when they are plainly there, its content store is stale. Fix it with
> `npx astro dev stop && rm -rf .astro && npm run dev`.

---

## Deploying

Cloudflare Pages builds from `main` automatically. Settings:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node version:** 22

Every pull request runs formatting, type-checking, the contrast audit and a full
build through GitHub Actions (`.github/workflows/ci.yml`).

**The production build deliberately fails while any `TODO_` placeholder remains.**
That is the safety net: it makes it impossible to ship a page with an invented
ferry time or an unset phone number on it. Run `npm run placeholders` to see
what is outstanding.

---

## Before launch

Nothing can go live until these are filled in. `npm run placeholders` prints the
current list with file names and line numbers.

### 1. Contact details — `src/config/site.ts`

The two WhatsApp numbers are already set and correct:

- **Inn** `+63 977 328 4208` — rooms and general enquiries
- **Dive centre** `+63 939 845 0270` — courses and dive enquiries

Still needed in the same file: `TODO_SITE_URL` (the real domain), `TODO_EMAIL`,
`TODO_ADDRESS`, `TODO_MAPS_URL`, `TODO_FACEBOOK_URL`, `TODO_INSTAGRAM_URL`,
`TODO_LATITUDE` / `TODO_LONGITUDE`, and `TODO_CLOUDFLARE_ANALYTICS_TOKEN`.

Analytics stays switched off until that last one is set, so the site currently
loads no third-party scripts at all and needs no cookie banner.

### 2. Prices, times and dive data — `src/content/`

Room rates, course prices, the bus journey time and fare, the bus and ferry
timetables, dive site names, depths, difficulties, boat times, what you see at
each site, the certifying agency, and the instructor's name, certifications and
bio.

**None of these were invented.** Every one is a placeholder precisely because
guessing at a ferry time or a depth is worse than shipping nothing.

---

## Changing the content

All the words live in `src/content/`. Nothing is written into the page
components, so a text change is a one-file edit.

```
src/content/
  rooms/                 one file per room
    single.md
    double.md
    four-person.md
  dive-sites/            one file per dive site
  courses/               one file per course or dive type
  pages/
    about.md             homepage "About" section
    diving-teaser.md     homepage diving section
    getting-here.md      the journey, including bus and ferry times
    diving-intro.md      /diving header
    equipment.md         what is provided, what to bring
    instructor.md        the instructor's bio and certifications
```

Each file has a block of settings at the top between `---` lines, then the body
text underneath. Changing the body text is safe. If you change a setting name or
delete one, `npm run check` will tell you exactly what broke rather than the site
quietly rendering wrong.

Prices, ordering and photo filenames are all settings in those blocks. Room and
course order on the page is controlled by the `order:` number — lower first.

The rooms are accordions and the course pathway (Open Water → Advanced Open
Water) is declared by `followsFrom:` in `advanced.md`, so the link between them
survives renaming.

---

## Photographs

There are no real photographs yet. Every image on the site is a solid colour
block at the exact size the real photo should be, so dropping a real one in is
a straight file replacement — same filename, into `src/assets/images/`, and
nothing else changes.

`npm run images:placeholders` regenerates any that are missing and never
overwrites a real photo.

The list below is the source of truth (it mirrors `src/config/images.ts`).

| File                       | Size        | What it should show                                                                                                                                    |
| -------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `hero-house-reef.jpg`      | 2400 × 1600 | The strongest single photo — shoreline, jetty, or a wide underwater shot of the house reef. Landscape, with room at the top where the resort name sits |
| `room-single.jpg`          | 1600 × 1200 | The single room, from the doorway, bed and window in frame                                                                                             |
| `room-double.jpg`          | 1600 × 1200 | The double room, from the doorway so the whole room reads in one frame                                                                                 |
| `room-four-person.jpg`     | 1600 × 1200 | The four-person room, wide enough to show all the beds                                                                                                 |
| `diving-teaser.jpg`        | 1600 × 1000 | Underwater, with a diver in it. Darker and bluer is better — it carries the transition into the dark half of the site                                  |
| `diving-header.jpg`        | 2400 × 1400 | The best underwater photo — wide, deep blue, ideally a diver for scale                                                                                 |
| `dive-site-house-reef.jpg` | 1600 × 1200 | The house reef underwater — coral, fish, whatever is characteristic                                                                                    |
| `dive-site-two.jpg`        | 1600 × 1200 | The second dive site. Rename the file once the site has a name                                                                                         |
| `dive-site-three.jpg`      | 1600 × 1200 | The third dive site. Rename the file once the site has a name                                                                                          |
| `instructor.jpg`           | 1200 × 1500 | Portrait of the instructor. A real photo of a person, not stock — this relationship is what guests are buying. Portrait orientation                    |

Social sharing cards live in `public/` at 1200 × 630: `og-default.png` and
`og-diving.png`. They are currently plain colour with the name on them. Replace
them with real crops when the photos arrive.

---

## For the owner — sending photos and text changes

You do not need to touch any of the above. Send Daniel:

**Photos.** The originals, straight off the camera or phone — do not resize,
crop or compress them first. Bigger is genuinely better; they get shrunk
automatically. Say which room or dive site each one is of. The list of what is
needed is the table above.

**Text.** Just write it in an email or a message, saying which part of the site
it belongs to ("the About bit", "the Open Water course"). It does not need
formatting.

**Prices, times and fares.** These are the ones actually holding up launch. For
each: what it costs, what the price includes, and whether it changes by season.
For the journey: how long the bus from Cebu City to Santa Fe takes, what it
costs, and roughly when the buses and ferries run.

**Dive sites.** For each one: its name, how deep it is, how hard it is, how long
the boat takes to get there, and what you actually see down there.

Nothing invented has been put on this site. Where a number is not known it shows
as an obvious placeholder, and the site refuses to publish while any remain.

---

## How it is put together

- **`src/config/site.ts`** — contact details, both WhatsApp numbers, metadata
- **`src/config/images.ts`** — the photo manifest above
- **`src/config/depths.ts`** — the depth rail's tick positions
- **`src/content.config.ts`** — the rules each content file must follow
- **`src/styles/tokens.css`** — colours, type scale, spacing
- **`src/components/`** — layout and page sections
- **`src/integrations/placeholder-guard.ts`** — what fails the build

The design runs on depth: the homepage sits at the surface in sand tones, and
`/diving` is submerged in dark blue. The depth rail down the left edge marks how
far you have descended. It is decoration with meaning, hidden below 360px wide,
and switched off entirely under `prefers-reduced-motion`. It is never the only
way to reach a section.
