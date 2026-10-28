# AMG → Next.js + Sanity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Vite single page with a Next.js 16 app whose every word and image comes from a new AMG Sanity project, looking identical to today's site.

**Architecture:** Parity first, CMS second. Tasks 1–3 rebuild today's page as React components with hardcoded content and a server-side form route, and are checked pixel-for-pixel against `main`. Tasks 4–6 add the Studio, seed it with today's content, and swap the hardcoded content for Sanity queries. Tasks 7–8 add revalidation, pin Netlify build settings and cut over.

**Tech Stack:** Next.js 16.2.x · React 19.2 · Tailwind 4 (no preflight) · `next-sanity` 13 · `@sanity/image-url` 2 · Sanity Studio 6 + `@sanity/orderable-document-list` · `three` · Vitest (pure logic only) · Netlify.

**Spec:** `docs/superpowers/specs/2026-10-27-nextjs-sanity-migration-design.md`

**Reference implementation:** `../au-site` (AEF). Where a step says "copy from AEF", copy the file and change only what the step names.

## Global Constraints

- Next.js 16 has breaking changes: read the relevant guide in `node_modules/next/dist/docs/` before writing Next code. Copy AEF's `AGENTS.md` + `CLAUDE.md` into the repo root in Task 1.
- Match AEF versions: `next` 16.2.3, `react`/`react-dom` 19.2.4, `next-sanity` ^13.1.1, `@sanity/image-url` ^2.1.1, Studio `sanity` ^6.10.1, `apiVersion: "2026-02-01"`.
- DOM ids and class names from `index.html` are kept verbatim so the ported CSS applies unchanged. No visual change except the hidden-when-empty footer socials.
- Tailwind 4 is imported **without preflight** (theme + utilities layers only). Ported CSS stays unlayered so it wins.
- Apps Script contract: POST `application/x-www-form-urlencoded`, keys `name`, `company`, `email`, `note`, `optin` (`"Yes"`/`"No"`). Success = JSON body with `result === "success"`.
- Publishers: `emily@testjarlabs.com`, `kateh@artestmanagementgroup.com`.
- Singletons (`homePage`, `siteSettings`, `requestAccessForm`): fixed `documentId` = type name; queries anchored `_id in ["<type>", "drafts.<type>"]`.
- Canonical URL: `https://www.artestmanagementgroup.com/`.
- Work on the existing branch `feat/nextjs-sanity`. Commit at the end of every task.

## Review Focus

1. **Partner count ≠ 12** (Kate adds or removes logos) → the marquee still loops seamlessly at today's speed. Pinned in Task 2 (`marqueeDurationSeconds` test + `-50%` keyframe) and Task 6 Step 6.
2. **Team photo with a different shape** (landscape or square upload) → card height and face crop unchanged. Pinned in Task 6 Step 6.
3. **Apps Script fails but returns HTTP 200 with an HTML page** → the modal stays open with the error message and the entered values intact. Pinned in Task 3 (`isAppsScriptSuccess` tests + manual check).
4. **CMS unreachable or a singleton missing/empty** → the page still builds and renders. Empty sections render without crashing, and the form shows today's wording. Pinned in Task 6 Step 5 (build against a nonexistent dataset).
5. **Only some social URLs set** → only those icons show; the "Connect" column disappears when all are empty. Pinned in Task 6 (`visibleSocials` test).

---

## File map

```
AGENTS.md, CLAUDE.md                 copied from AEF
package.json, tsconfig.json, next.config.ts, postcss.config.mjs, eslint.config.mjs, vitest.config.ts
netlify.toml                         pins Next build settings (Task 7)
app/layout.tsx                       font, metadata, JSON-LD, <SanityLive />, RequestAccessProvider + modal
app/page.tsx                         fetches content, renders sections
app/globals.css                      ported from src/style.css
app/sitemap.ts, app/robots.ts
app/api/contact/route.ts
app/api/revalidate/route.ts
components/Navbar.tsx, Footer.tsx, LightBeamBackground.tsx, PageEffects.tsx
components/request-access/RequestAccessProvider.tsx, RequestAccessButton.tsx, RequestAccessModal.tsx
components/sections/HeroSection.tsx, PortfolioSection.tsx, CuratedSection.tsx,
                    ApproachSection.tsx, UnlockSection.tsx, ExploreSection.tsx
components/ui/Lines.tsx              string[] → lines joined by <br>
hooks/useScrollReveal.ts, useNavbarScroll.ts, useUnlockFade.ts
lib/contact.ts (+ .test.ts)          validation, Apps Script body, success rule, rate limiter
lib/requestAccessDefaults.ts (+ .test.ts)
lib/marquee.ts (+ .test.ts)
lib/socials.ts (+ .test.ts)
sanity/lib/client.ts, live.ts, image.ts, queries.ts
sanity.types.ts                      generated
studio/                              package.json, sanity.config.ts, sanity.cli.ts, structure.ts,
                                     schemaTypes/{index,homePage,siteSettings,requestAccessForm,partner,teamMember}.ts,
                                     schemaTypes/shared/link.ts, scripts/seed.ts
```

Deleted: `index.html`, `src/`, `vite` dependency, `public/robots.txt`, `public/sitemap.xml`.

---

### Task 1: Next.js scaffold with ported styles

**Files:**
- Create: `AGENTS.md`, `CLAUDE.md`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `app/layout.tsx`, `app/page.tsx` (placeholder), `app/globals.css`
- Modify: `package.json`, `tsconfig.json`, `.gitignore`
- Delete: `index.html`, `src/main.ts`, `src/counter.ts`, `src/assets/*`, `src/style.css` (after porting)

**Interfaces:**
- Produces: `app/globals.css` with every rule from `src/style.css`; CSS var `--sans` resolves to the `next/font` Zalando Sans variable `--font-zalando`.

- [ ] **Step 1:** Replace `package.json` scripts/deps with AEF's (`dev`, `build`, `start`, `lint`, `typegen`), minus `@next/third-parties`. Add `"test": "vitest run"`. Dev deps add `vitest`. Remove `vite`. Run `npm install`.
- [ ] **Step 2:** Copy AEF's `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `AGENTS.md`, `CLAUDE.md`. Copy `next.config.ts` (keeps the `cdn.sanity.io` remote pattern). Add `.next/`, `.env*`, `next-env.d.ts`, `*.tsbuildinfo` to `.gitignore`.
- [ ] **Step 3:** Create `app/globals.css`. It starts with
  ```css
  @layer theme, base, components, utilities;
  @import "tailwindcss/theme.css" layer(theme);
  @import "tailwindcss/utilities.css" layer(utilities);
  ```
  followed by the full contents of `src/style.css`, unchanged except:
  - The two `@font-face` blocks are removed.
  - `--sans` becomes `var(--font-zalando), system-ui, -apple-system, sans-serif`.
  - The marquee keyframe `to` becomes `translateX(-50%)`. The track holds two identical halves, so this is correct for any logo count.
  - `.marquee-track`'s `animation` duration becomes `var(--marquee-duration, 60s)`, and the track gets `width: max-content`.
  - `.card-img img` gets `aspect-ratio: 660 / 885; object-fit: cover`. (660 × 885 is today's photo size, so nothing changes visually.)
- [ ] **Step 4:** `app/layout.tsx`:
  - Load `next/font/local` with both TTFs from `public/fonts/` (normal + italic, weight `"100 900"`), `variable: "--font-zalando"`.
  - Set `<html lang="en">` with the font variable class.
  - Copy the static `metadata` (title, description, canonical, OG, Twitter, icon `/AMG_logo.png`) and the JSON-LD `<script>` verbatim from `index.html`.
  - Render the fixed `#vanta-bg` and `#glass-layer` divs, then `<div id="app">{children}</div>`.
- [ ] **Step 5:** Delete `index.html` and `src/`. Placeholder `app/page.tsx` renders `<main />`.
- [ ] **Step 6:** Run `npm run build && npm run lint`. Expected: both succeed, and the route table shows `○ /` (static).
- [ ] **Step 7:** Commit: `chore: replace Vite with Next.js 16 scaffold and port styles`.

---

### Task 2: Static page as React components

Today's page rebuilt with hardcoded content, no Sanity yet.

**Files:**
- Create: everything under `components/` except `request-access/RequestAccessModal.tsx` submission logic (Task 3); `hooks/*`; `lib/marquee.ts`, `lib/marquee.test.ts`; `components/ui/Lines.tsx`
- Modify: `app/page.tsx`, `app/layout.tsx`, `package.json` (add `three`, `@types/three`)

**Interfaces:**
- Produces (props are nullable everywhere because Sanity results are; Task 6 swaps these hand-written types for generated ones with the same field names):
  - `HeroSection({ hero }: { hero: { headingLines?: string[] | null; subheading?: string | null; ctaLabel?: string | null } | null })`
  - `PortfolioSection({ heading, partners }: { heading?: string | null; partners: { _id: string; name: string | null; logoUrl: string | null }[] })`
  - `CuratedSection({ heading, team }: { heading?: string | null; team: { _id: string; name: string | null; role: string | null; bio: string | null; photoUrl: string | null }[] })`
  - `ApproachSection({ approach }: { approach: { label?: string | null; body?: string | null } | null })`
  - `UnlockSection({ unlock }: { unlock: { headingLines?: string[] | null; items?: string[] | null } | null })`
  - `ExploreSection({ explore }: { explore: { headingLines?: string[] | null; body?: string | null; ctaLabel?: string | null } | null })`
  - `Navbar({ ctaLabel }: { ctaLabel?: string | null })`
  - `Footer({ footer }: { footer: FooterContent | null })`, where `FooterContent = { learnHeading?, connectHeading?, learnLinks?: { label, href }[], socials?: { linkedin?, x?, instagram? }, copyright? }`. All leaves are `string | null`.
  - `Lines({ lines }: { lines?: string[] | null })`
  - `RequestAccessProvider` (client, holds `isOpen`), `useRequestAccess(): { open(): void; close(): void; isOpen: boolean }`, `RequestAccessButton({ label, className }: { label: string; className: string })`
  - `marqueeDurationSeconds(count: number): number` in `lib/marquee.ts`

- [ ] **Step 1: Write the failing test** `lib/marquee.test.ts`:
  ```ts
  expect(marqueeDurationSeconds(12)).toBe(60); // today's speed: 5s per logo
  expect(marqueeDurationSeconds(3)).toBe(15);
  expect(marqueeDurationSeconds(0)).toBe(60);  // never 0s / NaN
  ```
- [ ] **Step 2:** `npm test`. Expected: FAIL, module not found.
- [ ] **Step 3:** Implement `marqueeDurationSeconds`: `count * 5`, or 60 when `count < 1`.
- [ ] **Step 4:** `npm test`. Expected: PASS.
- [ ] **Step 5:** Build the section components with the exact markup, ids and classes from the old `index.html` (`git show main:index.html`).
  - `Lines` renders `lines` joined with `<br>`.
  - `PortfolioSection` renders `[...partners, ...partners]` with `aria-hidden` on the second half, and sets `style={{ "--marquee-duration": `${marqueeDurationSeconds(partners.length)}s` }}` on `.marquee-track`. Logos use `<img>` with the same eslint-disable as AEF's marquee.
  - Team photos use `next/image` with `width={660} height={885}`.
  - Any "Request Access" link becomes `RequestAccessButton`, which renders an `<a href="#" class=…>`, calls `preventDefault`, then `open()`.
  - Footer links with `href === "#request-access"` render as `RequestAccessButton`. Every other link renders a plain `<a>`.
- [ ] **Step 6:** Client behaviour, ported from `git show main:src/main.ts` with identical numbers:
  - `useScrollReveal()`: same selector list. It adds `scroll-hidden` on mount and toggles `scroll-hidden`/`scroll-visible` both ways at threshold 0.1. Delays: hero H1/P/A at 0/90/180 ms, `.card` at index × 70 ms.
  - `useNavbarScroll()`: toggles `nav-hidden` when scrolling down past 80 px.
  - `useUnlockFade()`: sets `#unlock li` opacity from `(innerHeight - top) / (innerHeight * 0.45)`, clamped to 0–1.
  - `PageEffects` (client) calls all three hooks and renders `null`.
  - `LightBeamBackground` (client) mounts the Three.js renderer into `#vanta-bg`, copying the shaders, uniforms and resize/scroll handlers verbatim. It cancels the animation frame, removes listeners and disposes the renderer on unmount. Move `#vanta-bg` out of `layout.tsx` into this component.
- [ ] **Step 7:** `RequestAccessModal` (client, mounted once in layout inside the provider): today's markup and classes. Open/close via context, plus overlay click, the × button and Escape. Lock body scroll while open, reset the form on every open. Submit shows the success state locally for now (Task 3 wires the route). Form copy comes from a `content` prop typed `RequestAccessContent`. Define that type in `lib/requestAccessDefaults.ts` now, with today's strings as `REQUEST_ACCESS_DEFAULTS` (see Task 3 for the field list).
- [ ] **Step 8:** `app/page.tsx` renders the sections in today's order with a hardcoded `const content = { … }` holding today's copy. Partner logos and team photos come from `/portfoliopartners/*.png` and `/team/*.webp`. Socials are `#` for this task only.
- [ ] **Step 9: Visual parity check.**
  - In another directory, run `git worktree add ../amg-main main && cd ../amg-main && npm i && npx vite --port 5173`. Run this branch with `npm run dev` (port 3000).
  - Compare both at 1440×900 and 390×844, at the top and after scrolling to each section: hero, marquee, cards, approach, unlock, explore, footer. Also check the modal open/close/Escape, nav hide/show, unlock fade, the beam widening on scroll, and mobile overscroll colour.
  - Expected: no visible differences. If the beam colour differs (Three.js colour management changed since r134), set `renderer.outputColorSpace = THREE.LinearSRGBColorSpace` and recheck.
- [ ] **Step 10:** `npm run build && npm run lint && npm test`. Expected: all pass, `/` static. Commit: `feat: rebuild AMG page as React components`.

---

### Task 3: Contact route and form wiring

**Files:**
- Create: `lib/contact.ts`, `lib/contact.test.ts`, `lib/requestAccessDefaults.test.ts`, `app/api/contact/route.ts`
- Modify: `lib/requestAccessDefaults.ts`, `components/request-access/RequestAccessModal.tsx`

**Interfaces:**
- Produces in `lib/contact.ts`:
  - `type RequestAccessInput = { name: string; company: string; email: string; note: string; optin: boolean }`
  - `validateRequestAccess(body: unknown): { ok: true; value: RequestAccessInput } | { ok: false; error: string }`
  - `toAppsScriptBody(input: RequestAccessInput): URLSearchParams`
  - `isAppsScriptSuccess(status: number, bodyText: string): boolean`
  - `createRateLimiter(max: number, windowMs: number): (key: string, now: number) => boolean`. Returns true when limited.
- Produces in `lib/requestAccessDefaults.ts`:
  - `type RequestAccessContent`, with fields `title, intro, name{label,placeholder}, company{…}, email{…}, note{…}, optInText, submitLabel, sendingLabel, errorMessage, successTitle, successBody`, all `string`
  - `REQUEST_ACCESS_DEFAULTS: RequestAccessContent`
  - `withRequestAccessDefaults(cms: DeepPartialNullable<RequestAccessContent> | null): RequestAccessContent`. `DeepPartialNullable<T>` is defined and exported in the same file: every key optional, every leaf `string | null`. Task 6's generated query result type must be assignable to it.
- Consumes: `RequestAccessModal` from Task 2.

- [ ] **Step 1: Write failing tests** `lib/contact.test.ts`:
  ```ts
  // validateRequestAccess
  ok({ name: " Ada ", email: "a@b.co" })  → value { name: "Ada", company: "", email: "a@b.co", note: "", optin: false }
  error({ email: "a@b.co" })              → "Name is required."
  error({ name: "x".repeat(101), email: "a@b.co" }) → "Name must be 100 characters or fewer."
  error({ name: "Ada", email: "nope" })   → "Enter a valid email address."
  error({ name: "Ada", email: "a@b.co", company: "x".repeat(201) }) → "Company must be 200 characters or fewer."
  error({ name: "Ada", email: "a@b.co", note: "x".repeat(5001) })   → "Note must be 5000 characters or fewer."
  error(null) → "Invalid request body."
  // toAppsScriptBody
  toAppsScriptBody({ name: "Ada", company: "", email: "a@b.co", note: "hi", optin: true }).toString()
    === "name=Ada&company=&email=a%40b.co&note=hi&optin=Yes"
  ...optin: false → optin=No
  // isAppsScriptSuccess
  (200, '{"result":"success"}') → true
  (200, '<!DOCTYPE html><html>…Error…') → false
  (200, '{"result":"error"}') → false
  (500, '{"result":"success"}') → false
  // createRateLimiter(5, 60_000)
  5 calls at t=0 → false each; 6th at t=0 → true; call at t=60_001 → false
  ```
  `lib/requestAccessDefaults.test.ts`:
  ```ts
  withRequestAccessDefaults(null) deep-equals REQUEST_ACCESS_DEFAULTS
  withRequestAccessDefaults({ title: "Apply", name: { label: "Full name" } })
    → title "Apply", name.label "Full name", name.placeholder === DEFAULTS.name.placeholder, rest defaults
  withRequestAccessDefaults({ title: "  " }) → title === DEFAULTS.title   // blank counts as missing
  ```
- [ ] **Step 2:** `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implement `lib/contact.ts` and `withRequestAccessDefaults`. Use AEF's email regex. Trim all strings. `optin` is `body.optin === true`. `REQUEST_ACCESS_DEFAULTS` uses today's strings verbatim from `index.html` (title "Request Access", intro "Tell us a bit about yourself and we'll be in touch.", labels and placeholders as written, submit "Submit", sending "Sending…", success "Request received" / "We'll review your information and be in touch shortly."), plus `errorMessage: "Something went wrong. Please try again."`.
- [ ] **Step 4:** `npm test`. Expected: PASS.
- [ ] **Step 5:** `app/api/contact/route.ts` `POST`:
  - Rate limit by the first `x-forwarded-for` IP (module-level limiter, 5 per 60 s) → 429 `{ error: "Too many requests. Please try again later." }`.
  - Validation failure → 400 `{ error }`.
  - Missing `GOOGLE_APPS_SCRIPT_URL` → 500 `{ error: "Server configuration error." }`.
  - Otherwise `fetch(url, { method: "POST", body: toAppsScriptBody(v), signal: AbortSignal.timeout(10_000) })`, then read `res.text()`. If `!isAppsScriptSuccess(res.status, text)` or the fetch throws → `console.error` + 502 `{ error: "Failed to save submission." }`. Success → 200 `{ ok: true }`.
- [ ] **Step 6:** Modal submit:
  - Disable the button and show `sendingLabel`, then POST JSON `{ name, company, email, note, optin }` to `/api/contact`.
  - On 2xx → success state.
  - Otherwise → re-enable the button, keep the values, and show `content.errorMessage` in a `<p class="modal-error" role="alert">` above the submit button.
  - Add a `.modal-error` rule to `globals.css`: 14px, `#ff8a8a`, margin-bottom 12px.
  - The modal's `content` prop now goes through `withRequestAccessDefaults`.
- [ ] **Step 7: Verify without writing to the sheet.**
  - Put today's URL (from `git show main:src/main.ts`) in `.env.local` as `GOOGLE_APPS_SCRIPT_URL`. Run `npm run dev`.
  - `curl -s -XPOST localhost:3000/api/contact -d '{"email":"a@b.co"}' -H 'content-type: application/json'` → `{"error":"Name is required."}`, 400.
  - Same with `"email":"bad"` plus a name → 400 email error.
  - With `GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/invalid/exec` and a valid body → 502. In the browser, the modal shows the error and keeps the typed values.
  - **Do not send a valid body to the real URL.** The one live submission happens in Task 8 with Emily's go-ahead.
- [ ] **Step 8:** `npm run build && npm run lint && npm test`. Commit: `feat: send Request Access through a validated server route`.

---

### Task 4: Sanity Studio

**Project creation (Claude, via the CLI with Emily's existing login — Emily's choice):**
- Run `npx sanity@latest init --bare -y --project-name "Artest Management Group" --dataset production --visibility public`. Public is the same as AEF; the client reads without a token. If AEF's project belongs to an organization, pass the same `--organization <id>`, taken from `npx sanity projects list --json` or from sanity.io/manage.
- Record the printed `projectId`.
- Then: `npx sanity cors add http://localhost:3000 --credentials` and the same for `http://localhost:3333`. Production origins are added in Task 8.
- `npx sanity users invite kateh@artestmanagementgroup.com --role administrator`. The free plan has no narrower role; the publish allowlist is the guardrail.

**Files:**
- Create: `studio/package.json` (copy AEF's, renamed `amg-studio`, plus `@sanity/icons` and dev dep `lexorank`), `studio/sanity.config.ts`, `studio/sanity.cli.ts`, `studio/structure.ts`, `studio/tsconfig.json`, `studio/eslint.config.mjs`, `studio/.gitignore` (copy AEF's), `studio/schemaTypes/*`

**Interfaces:**
- Produces schema types with these exact names and fields (types per spec "Content model"):
  - `homePage`:
    - `hero{headingLines[], subheading, ctaLabel}`
    - `portfolio{heading}`
    - `curated{heading}`
    - `approach{label, body}`
    - `unlock{headingLines[], items[]}`
    - `explore{headingLines[], body, ctaLabel}`
  - `siteSettings`:
    - `navCtaLabel`
    - `seo{title, description, ogTitle, ogDescription, ogImage}`
    - `footer{learnHeading, learnLinks[]{label, href}, connectHeading, socials{linkedin, x, instagram}, copyright}`
  - `requestAccessForm`: same field names as `RequestAccessContent` (Task 3)
  - `partner`: `name, logo, orderRank`
  - `teamMember`: `name, role, bio, photo{hotspot}, orderRank`

- [ ] **Step 1:** `sanity.config.ts`: copy AEF's, then change:
  - title `"Artest Management Group"`, the new `projectId`
  - `SINGLETON_TYPES = ["homePage", "siteSettings", "requestAccessForm"]`
  - The same `PUBLISHER_EMAILS`, `actions` and `newDocumentOptions` logic.
- [ ] **Step 2:** `sanity.cli.ts`: copy AEF's `api` + `typegen` blocks with the new `projectId`. Use `deployment: { autoUpdates: true }`; the `appId` gets added by the first deploy. `structure.ts` uses the order in the spec's "Studio structure" section (Home Page, Request Access Form, Site Settings, divider, Team Members and Partners as orderable lists).
- [ ] **Step 3:** Schemas:
  - `schemaTypes/shared/link.ts` exports AEF's `ctaFields` href validation as a `linkFields` factory.
  - Required fields: all headings, `ctaLabel`s, partner `name`/`logo`, teamMember `name`/`role`/`photo`.
  - `headingLines` and `unlock.items` are `array of string` with `min(1)`. Description on `headingLines`: "One entry per line."
  - Socials use `type: "url"` with no `required`. Description: "Leave empty to hide the icon."
  - Each singleton has `preview: { prepare: () => ({ title: "<Title>" }) }`.
- [ ] **Step 4:** `cd studio && npm install && npx sanity schema validate && npx sanity build`. Expected: no errors.
- [ ] **Step 5:** `npm run typegen` from the root. Expected: `sanity.types.ts` is created (it may contain only schema types until the queries in Task 6 exist).
- [ ] **Step 6:** `npx sanity dev`, sign in as Emily, and check:
  - The structure matches.
  - "Create new" doesn't offer the three singletons.
  - A singleton's menu has no Duplicate/Delete/Unpublish.
  - Partners and Team Members are drag-orderable.
- [ ] **Step 7:** Commit: `feat(studio): add AMG Sanity Studio with singletons and orderable collections`.

---

### Task 5: Seed today's content

**Files:**
- Create: `studio/scripts/seed.ts`

**Interfaces:**
- Consumes: schema from Task 4.
- Produces: documents with fixed ids:
  - `homePage`, `siteSettings`, `requestAccessForm`
  - `partner-<slug>` for the 12 logos in today's order (BuildOps … Lakers)
  - `teamMember-metta`, `teamMember-stephen-stokols`, `teamMember-nektar-baziotis`

- [ ] **Step 1:** Write the script, run via `npx sanity exec scripts/seed.ts --with-user-token`. That uses Emily's CLI login, so no write token is needed; this replaces the spec's `SANITY_API_WRITE_TOKEN`.
  - Use `getCliClient()`.
  - Upload each image from `../public/portfoliopartners/*`, `../public/team/*` and `../public/AMGSocialBanner.jpg` with `client.assets.upload("image", stream, { filename })`.
  - Write all documents in one transaction with `createOrReplace`, so re-running is safe.
  - Order: `orderRank` from `LexoRank.min().genNext()`, chained in today's order.
  - Copy all text verbatim from `git show main:index.html`. `footer.learnLinks` = Home `/`, About `#`, Request Access `#request-access`. Socials are left unset. Copyright: "© 2026 Artest Management Group, Inc."
  - SEO is seeded from today's `<title>`, description and OG tags.
- [ ] **Step 2:** Run it. Then `npx sanity documents query 'count(*[_type in ["partner","teamMember","homePage","siteSettings","requestAccessForm"] && !(_id in path("drafts.**"))])'`. Expected: `18`.
- [ ] **Step 3:** Run it a second time and repeat the query. Expected: still `18`.
- [ ] **Step 4:** In the Studio, the three singletons open with today's copy, and the partners and team show in today's order with images. Commit: `feat(studio): seed AMG content and images`.

---

### Task 6: Render the page from Sanity

**Files:**
- Create: `sanity/lib/client.ts`, `live.ts`, `image.ts` (copy from AEF), `sanity/lib/queries.ts`, `lib/socials.ts`, `lib/socials.test.ts`, `app/sitemap.ts`, `app/robots.ts`, `.env.example`
- Modify: `app/page.tsx`, `app/layout.tsx`, the section/footer/navbar prop types, `sanity.types.ts` (regenerated)
- Delete: `public/robots.txt`, `public/sitemap.xml`

**Interfaces:**
- Produces in `queries.ts`:
  - `HOME_PAGE_QUERY` and `SITE_SETTINGS_QUERY`: anchored singletons, projecting every schema field
  - `REQUEST_ACCESS_FORM_QUERY`: same pattern
  - `PARTNERS_QUERY`: `*[_type=="partner"]|order(orderRank){_id, name, logo}`
  - `TEAM_QUERY`: `*[_type=="teamMember"]|order(orderRank){_id, name, role, bio, photo}`
- Produces `visibleSocials(socials: { linkedin?: string | null; x?: string | null; instagram?: string | null } | null | undefined): { key: "linkedin" | "x" | "instagram"; url: string }[]` in `lib/socials.ts`
- Consumes: component props from Task 2, `withRequestAccessDefaults` from Task 3.

- [ ] **Step 1: Failing test** `lib/socials.test.ts`:
  ```ts
  visibleSocials(null) → []
  visibleSocials({ linkedin: "https://linkedin.com/company/amg", x: "", instagram: null })
    → [{ key: "linkedin", url: "https://linkedin.com/company/amg" }]
  visibleSocials({ linkedin: "a", x: "b", instagram: "c" }).map(s => s.key) → ["linkedin", "x", "instagram"]
  visibleSocials({ x: "   " }) → []
  ```
- [ ] **Step 2:** `npm test` → FAIL. Implement it. `npm test` → PASS.
- [ ] **Step 3:** Write the queries and run `npm run typegen`.
  - `page.tsx` fetches all five queries with `sanityFetch` in `Promise.all`. Each one gets a `.catch` that logs `"<QUERY> failed"` and returns `null` or `[]`, as in AEF's `app/page.tsx`.
  - Map partners to `logoUrl = urlFor(logo).height(240).url()` and team to `photoUrl = urlFor(photo).width(660).height(885).fit("crop").url()`, which respects the hotspot.
  - Remove the hardcoded `content`.
  - Footer: socials come from `visibleSocials`, and the "Connect" column is hidden when that returns `[]`.
- [ ] **Step 4:** Layout:
  - Replace static `metadata` with `generateMetadata()` that reads `SITE_SETTINGS_QUERY`, falling back to today's strings for each missing field. `ogImage` becomes a 1200×630 crop URL. Canonical, `og:url` and JSON-LD stay hardcoded.
  - Fetch `REQUEST_ACCESS_FORM_QUERY` and pass it through `withRequestAccessDefaults` into the modal.
  - Fetch `navCtaLabel` for `Navbar`.
  - Add `<SanityLive />`.
  - `sitemap.ts`/`robots.ts`: copy AEF's, with the AMG base URL and route `""` only.
  - `.env.example` lists every variable from the spec's env table except `SANITY_API_WRITE_TOKEN`.
- [ ] **Step 5: CMS-down check.** Run `NEXT_PUBLIC_SANITY_DATASET=does-not-exist npm run build && npm start`. Expected:
  - The build succeeds, with the query-failed logs.
  - The page renders with empty sections and no crash.
  - The modal shows `REQUEST_ACCESS_DEFAULTS` copy, and the metadata title is today's title.
- [ ] **Step 6: Parity and editing check** against the real dataset. Repeat Task 2 Step 9; expected: identical except the footer social icons and "Connect" column are hidden. Then in the Studio (local dev, refresh the page):
  - Edit a hero line → changes.
  - Drag a partner to first → marquee order changes.
  - Unpublish 9 partners temporarily (3 left) → the loop is still seamless and the speed per logo is unchanged. Then re-publish them.
  - Swap a team photo for a landscape image → card height unchanged, and the face area is chosen by the hotspot. Then revert.
  - Set the LinkedIn URL only → only that icon shows. Then clear it.
- [ ] **Step 7:** `npm run build && npm run lint && npm test`; `/` is static. Commit: `feat: render AMG page content from Sanity`.

---

### Task 7: Revalidation webhook and Netlify config

**Files:**
- Create: `app/api/revalidate/route.ts`, `netlify.toml`
- Modify: `README.md` (replace or create it with: setup, env vars, `npm run dev`, `cd studio && npx sanity dev`, typegen, seed, webhook config)

- [ ] **Step 1:** Copy AEF's revalidate route. `pathsForType` returns `["/"]` for `homePage`, `siteSettings`, `requestAccessForm`, `partner` and `teamMember`, and `[]` otherwise. Update the doc comment's filter list to those five.
- [ ] **Step 2:** `netlify.toml`:
  ```toml
  [build]
    command = "npm run build"
    publish = ".next"
  ```
  This overrides the Vite UI settings (`dist`), so the PR's Deploy Preview builds as Next.js with no manual preset switch.
- [ ] **Step 3:** With `SANITY_REVALIDATE_SECRET` set locally, run `curl -s -o /dev/null -w '%{http_code}' -XPOST localhost:3000/api/revalidate -d '{"type":"homePage"}'`. Expected: `401`.
- [ ] **Step 4:** `npm run build && npm run lint && npm test`. Commit: `feat: add Sanity revalidation webhook and Netlify build config`.

---

### Task 8: Deploy and cut over

Mostly Emily's actions; Claude verifies each.

- [ ] **Step 1 (Emily):** In Netlify, set these env vars for the Production and Deploy Preview contexts:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET=production`
  - `SANITY_API_READ_TOKEN` (Viewer token from sanity.io/manage)
  - `SANITY_REVALIDATE_SECRET` (`openssl rand -base64 32`)
  - `GOOGLE_APPS_SCRIPT_URL`
- [ ] **Step 2:** `cd studio && npx sanity deploy` (hostname e.g. `amg`), then commit the `appId` that appears in `sanity.cli.ts`. Add the Studio URL and the Netlify preview domain to CORS.
- [ ] **Step 3:** Push the branch and open a PR to `main`. Expected: the Netlify Deploy Preview builds. Repeat the Task 6 Step 6 parity check against the preview URL at 1440 and 390 widths.
- [ ] **Step 4 (with Emily's go-ahead):** Submit the form once on the preview with a clearly marked test entry (name "TEST – delete me"). Expected:
  - The modal shows success.
  - A new row in the sheet has Opt-In "Yes" or "No" as entered.
  - Emily deletes the row.
- [ ] **Step 5 (Emily):** Merge. Expected: the production deploy succeeds and the live site matches the preview.
- [ ] **Step 6 (Emily):** Create the webhook in sanity.io/manage:
  - URL `https://www.artestmanagementgroup.com/api/revalidate`, dataset `production`, trigger on create/update/delete
  - Filter `_type in ["homePage","siteSettings","requestAccessForm","partner","teamMember"]`
  - Projection `{ "type": _type }`
  - Secret = `SANITY_REVALIDATE_SECRET`
- [ ] **Step 7: End-to-end.**
  - Publish a small copy change in the deployed Studio. Expected: the webhook's attempts log shows `200`, and production shows the change within ~10 s without a redeploy. Revert it.
  - Sign in as a non-allowlisted test user (or ask Kate to confirm she *does* see Publish). The Publish button visibility should match the allowlist.
