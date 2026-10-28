# AMG site

The Artest Management Group site at https://www.artestmanagementgroup.com. It's a Next.js 16 app, and all of its copy and images come from Sanity. The setup mirrors the AEF site (`au-site`).

- **Site:** Next.js app in the repo root. Deploys on Netlify from `main` (see `netlify.toml`).
- **Studio:** Sanity Studio in `studio/`, project `t6w8cnoy`, dataset `production`. Kate and Emily edit content here.
- **Request Access form:** posts to `/api/contact`, which forwards to a Google Apps Script that appends a row to the Google Sheet.

> Next.js 16 has breaking changes. Read `node_modules/next/dist/docs/` before writing Next code (see `AGENTS.md`).

## Run it locally

```bash
cp .env.example .env.local   # fill in the values
npm install
npm run dev                  # http://localhost:3000

cd studio && npm install && npx sanity dev   # http://localhost:3333
```

| Variable | What it's for |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` | Which Sanity project the site reads |
| `SANITY_API_READ_TOKEN` | Viewer token, server-only, used by `defineLive` |
| `SANITY_REVALIDATE_SECRET` | Must match the publish webhook's secret |
| `GOOGLE_APPS_SCRIPT_URL` | The Apps Script web app the form forwards to |

In Netlify, set the same variables under Site settings → Environment variables, for both the Production and Deploy Preview contexts.

## What editors can change

Everything on the page is edited inside fixed sections. Editors can't add, remove or reorder sections.

| Studio item | Controls |
|---|---|
| Home Page | Hero, section headings, Our approach, Unlock list, Explore alignment |
| Request Access Form | All form wording. The fields themselves are fixed, because the Sheet's columns depend on them |
| Site Settings | Navbar button, SEO and share image, footer (links, social URLs, copyright) |
| Team Members | "Curated by" cards. Drag to reorder |
| Partners | Marquee logos. Drag to reorder |

Only `emily@testjarlabs.com` and `kateh@artestmanagementgroup.com` see Publish (`studio/sanity.config.ts`). If a field is empty or Sanity is unreachable, the page still renders. The form and SEO fall back to the original copy.

## Publishing → live

Publishing in the Studio calls a Sanity webhook. The webhook POSTs to `/api/revalidate`, which re-renders `/`, so changes go live within seconds with no redeploy.

Set the webhook up in sanity.io/manage → API → Webhooks:

- URL: `https://www.artestmanagementgroup.com/api/revalidate`
- Dataset: `production`
- Trigger on: create, update, delete
- Filter: `_type in ["homePage", "siteSettings", "requestAccessForm", "partner", "teamMember"]`
- Projection: `{ "type": _type }`
- Secret: the same value as `SANITY_REVALIDATE_SECRET`

## Common tasks

```bash
npm test            # unit tests (form validation, defaults, marquee, socials)
npm run typegen     # after changing a schema or a query in sanity/lib/queries.ts
cd studio && npx sanity deploy                                  # publish Studio changes
cd studio && npx sanity exec scripts/seed.ts --with-user-token  # bootstrap a fresh dataset
```

**Warning:** `seed.ts` overwrites the singletons, partners and team members with the original content. Only run it on an empty dataset.
