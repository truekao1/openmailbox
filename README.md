# OpenMailbox

A small, fast, static directory of **private mailbox stores** and a comparison of **virtual mailbox** services, filtered for the constraints people actually fail to find: 24-hour lobby access, packages from every carrier, mail scanning, and locations that are not on a waitlist.

Brand name: **OpenMailbox**. The public URL in `src/_data/site.js` is `https://truekao1.github.io/openmailbox`. The Eleventy path prefix is derived from that URL. Do not put a personal name on the site.

This is an independent directory, not a post office, mailbox store, or virtual mailbox provider.

## Where it lives

Project path: `/workspace/sites/openmailbox`

Built files go to `dist/` and are published to GitHub Pages by `.github/workflows/pages.yml` on every push to `main`.

## How to build

```bash
npm install
npm run build        # writes dist/
npm start            # local preview
npm run check        # validates city JSON, builds, checks internal links and JSON-LD
```

The public base URL, contact mailbox, and affiliate links are all in one file: `src/_data/site.js`. Affiliate `url` values stay empty until a program issues a tracked link. Templates then fall back to each company’s public website and must not present that fallback as an affiliate URL.

## Data schema

Add a city by adding one file: `data/cities/<st>-<city>.json` (for example `data/cities/ny-new-york.json`). The nightly research checklist is in `scripts/new-city.md`. A starter file is in `scripts/city.template.json`.

Rules:

- Never invent a business, hour, carrier, fee, phone, or flag.
- Every fact needs a public source URL and a `lastChecked` date.
- `access24` is true only when the source says the mailbox lobby or facility is available around the clock. A generic “at participating locations” line is not enough.
- `allCarriers` is true only when the source says it accepts packages from all carriers or all major carriers. Still list the names the page uses.
- `mailScanning` is true only for open-and-scan or similar mail-content scanning, not ordinary photocopy services.
- `noWaitlist` is true only when the source says boxes are available. Do not treat availability as live inventory.
- If a site is down or a detail is unclear, leave the listing or the detail out. Use `Not published` for a day’s hours rather than inventing “Closed.”

## Launch content

- Home page
- Virtual mailbox comparison (Anytime Mailbox, iPostal1, PostScan Mail, Traveling Mailbox), with features and prices taken only from official public pages and cited
- New York, NY — 14 verified listings, last checked November 18, 2026
- Los Angeles, CA — 12 verified listings, last checked November 18, 2026, including one clearly labeled Beverly Hills store

## Affiliate programs

Application drafts (not sent) live in `AFFILIATES.md`. Program pages:

- Anytime Mailbox: https://www.anytimemailbox.com/affiliate-program
- iPostal1: https://ipostal1.com/affiliate-signup.php
- PostScan Mail: https://www.postscanmail.com/affiliate-program.html
- Traveling Mailbox: https://travelingmailbox.com/affiliates

## Stack

Eleventy 3 builds plain HTML, CSS, and a small vanilla JS filter into `dist/`. Pages are mobile-first, with unique titles and meta descriptions, canonical URLs, Open Graph tags, `sitemap.xml`, `robots.txt`, breadcrumbs, an affiliate disclosure, and JSON-LD (`WebSite` / `ItemList` on the home page; `CollectionPage` + `ItemList` + `LocalBusiness`, `FAQPage`, and `BreadcrumbList` on city pages).
