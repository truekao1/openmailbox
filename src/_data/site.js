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
 * tracked affiliate link. `featuredVirtual` is the affiliate id shown
 * in the shared city and homepage callout once that program has a
 * tracked URL, so new nightly city pages inherit it automatically.
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
  featuredVirtual: "ipostal1",
  affiliates: {
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
      url: "",
      publicUrl: "https://travelingmailbox.com/",
      programUrl: "https://travelingmailbox.com/affiliates",
    },
  },
};
