/**
 * Site-wide config. `url` is the only deploy switch. Canonical tags,
 * Open Graph, JSON-LD, robots.txt, sitemap.xml, and the Eleventy path
 * prefix all follow it. Do not add a trailing slash.
 *
 * GitHub Pages project site:
 *   https://truekao1.github.io/openmailbox
 *
 * Affiliate `url` values stay empty until a program issues a tracked
 * link. Templates then fall back to `publicUrl` as a plain
 * (non-affiliate) link. Do not present an empty or public URL as a
 * tracked affiliate link. `featuredVirtual` is the list of affiliate
 * ids shown in the shared city and homepage callout once those
 * programs have a tracked URL, so new nightly city pages inherit them
 * automatically.
 */
const url = normalizeSiteUrl("https://truekao1.github.io/openmailbox");

function normalizeSiteUrl(value) {
  const parsed = new URL(value);
  parsed.hash = "";
  parsed.search = "";
  parsed.pathname = parsed.pathname.replace(/\/+$/, "");
  if (!parsed.pathname || parsed.pathname === "/") return parsed.origin;
  return parsed.origin + parsed.pathname;
}

function pathPrefixFromUrl(value) {
  const { pathname } = new URL(value);
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function isTrackedAffiliate(program) {
  return Boolean(program && String(program.url || "").trim());
}

const featuredVirtual = ["ipostal1", "travelingMailbox"];

const affiliates = {
  anytimeMailbox: {
    id: "anytimeMailbox",
    name: "Anytime Mailbox",
    url: "",
    publicUrl: "https://www.anytimemailbox.com/",
    programUrl: "https://www.anytimemailbox.com/affiliate-program",
  },
  ipostal1: {
    id: "ipostal1",
    name: "iPostal1",
    url: "https://ipostal1.com/?ref=8020",
    publicUrl: "https://ipostal1.com/",
    programUrl: "https://ipostal1.com/affiliate-signup.php",
    featuredTitle: "A mailbox you can open online",
    featuredBody:
      "iPostal1 gives you a real street address and a digital mailbox you can check from anywhere — useful when a local store is closed or a PO Box is waitlisted. Official personal plans start at $9.99 a month for 30 mail items (as published, last checked November 18, 2026). Some addresses cost more, and scans, forwarding, or extra items can add fees. Those plans have no contract.",
  },
  postscanMail: {
    id: "postscanMail",
    name: "PostScan Mail",
    url: "",
    publicUrl: "https://www.postscanmail.com/",
    programUrl: "https://www.postscanmail.com/affiliate-program.html",
  },
  travelingMailbox: {
    id: "travelingMailbox",
    name: "Traveling Mailbox",
    url: "https://travelingmailbox.com/?ref=3950",
    publicUrl: "https://travelingmailbox.com/",
    programUrl: "https://travelingmailbox.com/affiliates",
    featuredTitle: "A mailbox you can check from anywhere",
    featuredBody:
      "Traveling Mailbox gives you a real street address, scans the outside of each envelope, and lets you view mail online or in its iOS and Android apps — then you can ask them to scan the contents, forward the item, shred it, return it, or hold it. Official Basic plans start at $15 a month for 40 incoming envelopes and 35 page scans (as published, last checked November 20, 2026). Some addresses cost more, and extra envelopes, page scans, or forwarding can add fees. Subscriptions are month to month, with no contract.",
  },
};

const featuredVirtualPrograms = featuredVirtual
  .map((id) => affiliates[id])
  .filter(isTrackedAffiliate);
const featuredVirtualIds = featuredVirtualPrograms.map((program) => program.id);

export default {
  name: "OpenMailbox",
  tagline: "Find a private mailbox with 24-hour access, all-carrier packages, or a virtual mailbox you can open online.",
  description:
    "A directory of private mailbox stores and virtual mailbox services, filtered for the things people actually fail to find: 24-hour lobby access, packages from every carrier, mail scanning, and locations that are not on a waitlist.",
  url,
  pathPrefix: pathPrefixFromUrl(url),
  locale: "en_US",
  language: "en",
  emailListings: "azb31pt9@mail.grokbot.com",
  emailContact: "azb31pt9@mail.grokbot.com",
  emailsArePlaceholders: false,
  disclosure:
    "Some links are affiliate links; we may earn a commission at no cost to you. Until a program issues a tracked URL, that button goes to the company’s public website and is not an affiliate link.",
  disclosureShort:
    "Some links are affiliate links; we may earn a commission at no cost to you.",
  featuredVirtual,
  featuredVirtualPrograms,
  featuredVirtualIds,
  affiliates,
};
