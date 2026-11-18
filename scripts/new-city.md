# Nightly city research checklist

The goal of a nightly run is to ship **one useful city page**, not a long list of unverified names. Adding a city means adding one file under `data/cities/` and rebuilding.

## 1. Pick the city

Choose a place people actually search when a PO Box is waitlisted, closed after hours, or unable to take a UPS, FedEx, or Amazon package. Prefer metros with recurring complaints and public store pages over cities that already have a strong, current directory.

Filename: `data/cities/<st>-<city>.json`  
Examples: `ny-new-york.json`, `ca-los-angeles.json`, `il-chicago.json`  
Use the two-letter state, lowercase, then a hyphen, then the city slug.

Copy `scripts/city.template.json` and fill it in.

## 2. Find candidates

Search for public pages, not hearsay:

- `private mailbox rental <city> <ST>` / `mailbox 24 hour access <city>`
- `UPS Store mailbox <city>` and the official location plus mailbox-services pages
- Independent CMRA / pack-and-ship / postal center websites
- Virtual mailbox provider location directories (Anytime Mailbox, iPostal1, PostScan Mail, Traveling Mailbox) only when the location has a verifiable street address and published hours
- USPS PO Box or Premium PO Box pages only if you can verify lobby hours; do not flag all-carrier receiving unless the source says so

Skip a business if you cannot find its own page or an official locator page with an address and hours.

## 3. Verify every fact on a public page

For each listing, record only what the source says:

- Name, area, street address, phone, website, mailbox or booking URL
- Staffed hours by day. If the source only publishes Monday–Saturday, write Sunday as `Not published` — do not invent “Closed.”
- `carriers` as an array of the names the page uses (for example `["USPS", "UPS", "FedEx", "DHL"]`)
- Flags: `access24`, `allCarriers`, `mailScanning`, `noWaitlist`, `virtual`
- Fee notes, only if published
- `sources[]` with a label and the exact URL
- `lastChecked` as today’s date (`YYYY-MM-DD`)

**24-hour access** means the store’s own page says the mailbox lobby or facility is available around the clock. A generic UPS Store bullet that says “24-hour access (at participating locations)” is not enough by itself.

**All carriers** means the page says it accepts packages from all carriers or all major carriers. Still list the carrier names the page actually uses.

**Mail scanning** means open-and-scan or similar mail-content scanning for mailbox customers, not ordinary photocopy or passport-photo services.

**No waitlist** means the source says boxes are available. Do not treat availability as live inventory. If the page is silent, leave the flag false and tell the reader to confirm.

If two sources disagree, prefer the official site and say so in `hours.notes`. If you cannot verify a detail, omit it. If you cannot verify the business at all, do not list it.

Do not call businesses just to fill a spreadsheet unless a later playbook says otherwise. This checklist is written so a pass can be done from public pages.

## 4. Aim for quality, not a quota

Ten to twenty solid listings is enough for a first city page. Fewer is fine if that is all that can be verified. Zero invented rows is the hard rule.

Write a short, honest `intro` for the city. Mention any focus (a borough, a downtown, a nearby suburb you included) instead of implying citywide coverage you did not research.

## 5. Build and check

```bash
npm run check
```

That command validates the JSON, builds the site, and fails if a required field is missing or an internal link is broken. If it passes, commit the new city file (and the built site stays out of git).

## 6. After publish

Update `lastUpdated` on the city file when listings change. On later nights, recrawl the oldest `lastChecked` dates before adding a second city, so pages do not rot. Recheck 24-hour access and box availability claims especially; those are the details that drift.
