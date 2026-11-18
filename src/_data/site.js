/**
 * Site-wide config. `url` is the only deploy switch. Canonical tags,
 * Open Graph, JSON-LD, robots.txt, sitemap.xml, and the Eleventy path
 * prefix all follow it. Do not add a trailing slash.
 *
 * GitHub Pages project site:
 *   https://truekao1.github.io/openmailbox
 *
 * Affiliate `url` values stay empty until a program issues a tracked
 * link. Templates must then fall back to `publicUrl` as a plain
 * (non-affiliate) link. Do not present an empty or public URL as a
 * tracked affiliate link.
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
    "OpenMailbox may earn a commission if you use an approved affiliate link, at no extra cost to you. Until a program approves a tracked URL, buttons go to that company’s public website and are not affiliate links.",
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
      url: "",
      publicUrl: "https://ipostal1.com/",
      programUrl: "https://ipostal1.com/affiliate-signup.php",
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
