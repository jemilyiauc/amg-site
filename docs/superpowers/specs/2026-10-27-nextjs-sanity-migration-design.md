# AMG → Next.js + Sanity — Design Spec

> **Date:** 2026-10-27
> **Branch:** `feat/nextjs-sanity`
> **Reference implementation:** AEF (`../au-site`, Next.js 16.2.3 · React 19.2.4 · `next-sanity` v13 · Tailwind 4 · standalone Studio v6 in `studio/`)
> **Status:** Ready for review — pending Emily's approval

---

## Why

The AMG site is a single Vite page with every word, logo and headshot hardcoded in `index.html`. Kate Hermosa (AMG) needs to update copy, the Request Access form wording, and the images — including the partner logo marquee and the "Curated by" team cards — without a developer.

AEF already solved this. AMG should work the same way so one person can maintain both sites with the same mental model.

## What success looks like

1. The migrated page is visually and behaviourally indistinguishable from today's site, desktop and mobile — except the footer social icons, which are hidden until Kate enters real URLs (see `siteSettings`).
2. Kate can open the AMG Studio, change any text or image on the page, publish, and see it live within seconds — no redeploy.
3. Kate cannot break the layout: she edits *inside* fixed sections; she cannot add, remove or reorder sections.
4. Request Access submissions keep landing in the same Google Sheet, in the same columns.

## Goals

- Rebuild the page as React components on AEF's stack (Next.js 16 App Router, React 19, Tailwind 4, `next-sanity`).
- A new, **separate** Sanity project for AMG with its own Studio in `studio/`, deployed as a Sanity-hosted Studio.
- Everything on the page that is content is editable (see Content model).
- Port AEF's operational features: on-demand revalidation webhook, publish allowlist, singleton guards, typegen, `/api/contact`-style form route.
- Seed the new dataset with today's content and images so the site is identical on day one.

## Non-goals

- **Page builder.** Kate swaps what's inside sections; she does not compose pages. (Her call: avoid design drift / breaking the page.)
- **Visual Editing / Presentation tool.** AEF has a spec but hasn't shipped it. Add to both sites later.
- **New pages** (e.g. a real About page), analytics, or any design change.
- **Editable form fields.** Kate edits the form's wording; the set of fields (name, company, email, note, opt-in) stays fixed in code, because the Google Sheet's columns depend on it.

## Anti-goals (would be a failure even if it "works")

- Any visible difference from the current site — spacing, fonts, animation timing, the light beam, the marquee loop, mobile overscroll colour.
- Form submissions silently stop reaching the sheet, or arrive in a different shape.
- A singleton gets duplicated or deleted from the Studio and the page renders blank.

---

## Constraints

- **Same repo, in place.** Next.js replaces Vite in `amg-site`. `index.html`, `src/`, `vite`, `tsconfig` (Vite flavour) go away; `public/` assets stay where they are.
- **Next.js 16 has breaking changes.** Copy AEF's `AGENTS.md` / `CLAUDE.md` rule: read `node_modules/next/dist/docs/` before writing Next code.
- **Mirror AEF's file layout and conventions** unless there's a reason not to: `app/`, `components/sections/`, `components/ui/`, `hooks/`, `sanity/lib/{client,live,image,queries}.ts`, `studio/`, `sanity.types.ts` via typegen, anchored singleton queries (`_id in ["x", "drafts.x"]`).
- **Apps Script contract is fixed.** Today the browser POSTs `application/x-www-form-urlencoded` to the Apps Script URL with keys `name`, `company`, `email`, `note`, `optin` (`"Yes"` / `"No"`). The new server route must forward exactly that shape. (AEF forwards JSON — do **not** copy that part.)
  - The script (`doPost`, owned by Emily, editable but **no change needed**) appends `[Timestamp, Name, Company, Email, Note, Email Opt-In]` and returns `{"result":"success"}`. An uncaught script error makes Google return an HTML error page, often still with HTTP 200.
  - **Success rule for the route:** the response parses as JSON *and* `result === "success"`. Anything else (non-JSON body, non-2xx, network error, timeout) is a failure → route returns 502 → modal shows the inline error. Server-side `fetch` follows Apps Script's 302 redirect to `script.googleusercontent.com`; that's expected.
- **Free Sanity plan** (assumed, same as AEF): no "can edit but not publish" role, hence the UI publish allowlist.

---

## Decisions

### Made by Emily

| Decision | Choice |
|---|---|
| Editor | Kate Hermosa (`kateh@artestmanagementgroup.com`) |
| Editable scope | All copy, the form's wording, all images incl. logo grid and team cards |
| Flexibility | Fixed sections; edit contents only |
| Sanity project | New, separate project (not a dataset inside AEF's `246d6vmw`) |

### Made by Claude (check these)

| Decision | Choice | Why |
|---|---|---|
| Styling | Port `src/style.css` into `app/globals.css` largely verbatim (alongside Tailwind 4), keyed to the same ids/classes. No Tailwind rewrite in this pass. | Fastest route to pixel parity. A Tailwind rewrite can follow once parity is locked. |
| Three.js | npm `three` in a client component, replacing the CDN `<script>` | Bundled, typed, no global `THREE: any`. Shader code moves over unchanged. |
| Form transport | Browser → `app/api/contact/route.ts` → Apps Script | Validation + rate limit (copy AEF's), URL leaves the client bundle, real success/error instead of `no-cors` fire-and-forget. |
| Form failure UX | On a non-2xx from the route, keep the form open, re-enable Submit, show a short inline error | Today failures are invisible; this is the minimum honest behaviour. |
| Studio hosting | `sanity deploy` (hosted Studio, e.g. `amg.sanity.studio`), like AEF | Matches AEF. |
| Publishers | `emily@testjarlabs.com`, `kateh@artestmanagementgroup.com` | Same list as AEF. |
| Seeding | One-off script in `studio/` (or `scripts/`) that uploads `public/portfoliopartners/*` and `public/team/*` and creates all documents with today's copy | Day-one parity; Kate starts from real content, not a blank Studio. |
| Missing-content behaviour | Same as AEF: log the failed query, render the section with whatever is present; form falls back to today's wording per field | Page never 500s because of the CMS. |
| Reference images in `public/` (`Homeref.png`, `cardref.png`, etc.) | Leave untouched | Out of scope; flagging that they're publicly served. |
| Tailwind preflight | Import Tailwind's theme + utilities only, **not** its preflight reset | Preflight would restyle today's markup and break parity. |
| Marquee distance | Animation distance derived from the rendered track width, not today's hardcoded `-2640px` | That value only works for exactly 12 logos; partners are now editable. |
| Team photo crop | Fixed aspect ratio on the card image, hotspot-cropped via `urlFor` | A new upload of a different shape can't change card height. |
| Footer "Request Access" | Opens the modal (today it's a dead `#`) | Matches the other three buttons. |
| Small fixed labels | Footer column headings ("Learn", "Connect") and the "Sending…" button state are editable too (`siteSettings.footer`, `requestAccessForm`) | Cheap, and keeps "everything is editable" true. |

---

## Content model

All singletons follow AEF's pattern: fixed `documentId` in `structure.ts`, removed from "create new", no duplicate/delete/unpublish actions, queries anchored on published + draft id.

Multi-line headings (hero, unlock, explore) are stored as **an array of strings, one per line** — the code joins them with `<br>`. Simpler than Portable Text for a few short lines, and Kate can't introduce formatting the design doesn't have.

### `homePage` (singleton)

| Section | Fields |
|---|---|
| `hero` | `headingLines: string[]`, `subheading: text`, `ctaLabel: string` |
| `portfolio` | `heading: string` ("Portfolio & partners") |
| `curated` | `heading: string` ("Curated by") |
| `approach` | `label: string` ("Our approach"), `body: text` |
| `unlock` | `headingLines: string[]`, `items: string[]` (the six bullets) |
| `explore` | `headingLines: string[]`, `body: text`, `ctaLabel: string` |

### `requestAccessForm` (singleton)

The modal is opened from four places (nav, hero, explore, footer), so it gets its own document rather than living in `homePage`.

`title`, `intro`, then for each of `name`, `company`, `email`, `note`: `{ label, placeholder }`; `optInText`, `submitLabel`, `successTitle`, `successBody`.

Required/optional status of each field stays in code.

### `siteSettings` (singleton)

- `navCtaLabel: string`
- `seo`: `title`, `description`, `ogTitle`, `ogDescription`, `ogImage` (image). Drives `generateMetadata`. JSON-LD stays in code.
- `footer`:
  - `learnLinks: { label, href }[]` — same href validation as AEF's CTAs (`/`, `#`, `http(s)://`, `mailto:`, `tel:`). The special href `#request-access` opens the modal.
  - `socials`: `linkedin`, `x`, `instagram` (urls) — managed by Kate in the CMS (Emily). An icon is hidden while its URL is empty, and the "Connect" column is hidden if all three are empty (Claude's call). Seeded **empty**, since today all three are dead `#` links — so the icons disappear on day one until Kate adds real URLs. This is the one intentional visible difference from today's site.
  - `copyright: string`

### `partner` (orderable collection — the marquee)

`name` (required, used as alt text), `logo` (image, required), `orderRank`. Code renders the list twice for the seamless loop, as today.

### `teamMember` (orderable collection — "Curated by" cards)

`name`, `role`, `bio: text`, `photo` (image, hotspot), `orderRank`. Alt text = name. Layout must hold for any count (today: 3).

### Studio structure

```
Content
├── Home Page
├── Request Access Form
├── Site Settings
├── ─────────
├── Team Members   (drag to reorder)
└── Partners       (drag to reorder)
```

---

## App architecture

```
app/
  layout.tsx            fonts (Zalando Sans via next/font/local), metadata from siteSettings, <SanityLive />
  page.tsx              fetches homePage, siteSettings, requestAccessForm, partners, team in parallel
  globals.css           ported style.css (+ Tailwind import)
  sitemap.ts, robots.ts replace public/sitemap.xml, public/robots.txt
  api/contact/route.ts  validate → forward urlencoded to GOOGLE_APPS_SCRIPT_URL
  api/revalidate/route.ts  Sanity webhook → revalidatePath("/")
components/
  Navbar.tsx, Footer.tsx
  LightBeamBackground.tsx   (client) Three.js shader + #glass-layer
  RequestAccessModal.tsx    (client) + a small context so any button can open it
  sections/  Hero, Portfolio (marquee), Curated (team), Approach, Unlock, Explore
hooks/       useScrollReveal, useNavbarScroll, useUnlockFade
sanity/lib/  client, live, image, queries   (copied from AEF, new queries)
studio/      sanity.config.ts, sanity.cli.ts, structure.ts, schemaTypes/
```

- Page is statically rendered; the webhook revalidates `/` on publish of any of the five types. `SanityLive` as in AEF.
- Client behaviour from `src/main.ts` moves into hooks/client components with the **same** thresholds, delays and class names (`scroll-hidden`/`scroll-visible`, 90 ms hero stagger, 70 ms card stagger, 0.45 viewport unlock fade, nav hide after 80 px).
- Images via `next/image` + `urlFor`; `cdn.sanity.io` in `remotePatterns`. Logos must keep transparency.

### Environment variables

| Var | Where |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` | app |
| `SANITY_API_READ_TOKEN` | app (server, for `defineLive`) |
| `SANITY_REVALIDATE_SECRET` | app + Sanity webhook |
| `GOOGLE_APPS_SCRIPT_URL` | app (server) — today's URL from `src/main.ts` |
| `SANITY_API_WRITE_TOKEN` | local only, for the seed script |

---

## Hosting & cutover

AMG is on **Netlify** (Emily), same as AEF. Assumed Netlify defaults (Claude): `main` auto-deploys to production; PRs get Deploy Previews.

- Next.js runs via Netlify's Next.js runtime (auto-detected); ISR and `revalidatePath` work there. The in-memory rate limiter copied from AEF is best-effort on serverless — accepted, same as AEF.
- **Cutover order** — everything below must be done *before* merging to `main`, or production renders blank:
  1. Sanity project created, dataset seeded, Kate invited.
  2. Env vars set in Netlify (production + deploy-preview contexts).
  3. Build settings switched from Vite (`dist`) to Next.js.
  4. Side-by-side check done on the PR's Deploy Preview.
  5. Merge → production. Then create the revalidate webhook against the production URL.

## Prerequisites (Emily)

1. Create the AMG Sanity project in sanity.io/manage (or approve Claude running `sanity init` with your login). Invite Kate.
2. Create read + write API tokens; add CORS origins for `localhost:3000` and production.
3. After deploy: create the webhook (filter `_type in ["homePage","siteSettings","requestAccessForm","partner","teamMember"]`, projection `{ "type": _type }`, secret = `SANITY_REVALIDATE_SECRET`).
4. Set the env vars in Netlify and switch the build settings from Vite to Next.js (see Hosting & cutover for order).

## Verification

- `next build` passes and reports `/` as static.
- Side-by-side screenshots of old (main) vs new at 1440 px and 390 px, top to bottom, plus a scroll-through check of reveals, unlock fade, nav hide/show, marquee loop, light-beam widening, modal open/close/Escape.
- Form route verified with **rejected** payloads (missing name, bad email) so testing writes nothing to the live sheet; one real submission only with Emily's go-ahead.
- Webhook revalidation proven end-to-end on Netlify (publish → webhook delivery log shows 200 → live page changes). AEF's own form-pages plan flagged that its `SANITY_REVALIDATE_SECRET` may never have been set, so this has not been proven on AEF either.
- In the Studio: edit a heading, reorder a partner, swap a team photo, publish → live within seconds. Try to duplicate/delete a singleton → not offered. Log in as a non-allowlisted user → no Publish button.

## Left to the builder

- Exact component boundaries and prop shapes; whether the modal state is context or a tiny store.
- How the seed script is run (NDJSON import vs. client script).
- Studio field descriptions/help text, icons, preview configs.
- Whether `globals.css` is split per component (CSS modules) as long as output is identical.
