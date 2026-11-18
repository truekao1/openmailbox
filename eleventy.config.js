import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HtmlBasePlugin } from "@11ty/eleventy";
import site from "./src/_data/site.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function originAndPrefix(base) {
  const root = String(base || "").replace(/\/$/, "");
  try {
    const { origin, pathname } = new URL(root);
    const prefix = !pathname || pathname === "/" ? "" : pathname.replace(/\/$/, "");
    return { origin, prefix, root };
  } catch {
    return { origin: root, prefix: "", root };
  }
}

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addWatchTarget("data/cities/");
  eleventyConfig.addWatchTarget("src/assets/");

  eleventyConfig.addFilter("isoDate", (value) => {
    if (!value) return "";
    return String(value).slice(0, 10);
  });

  eleventyConfig.addFilter("displayDate", (value) => {
    if (!value) return "";
    const d = new Date(`${String(value).slice(0, 10)}T12:00:00`);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("hoursSummary", (hours) => {
    if (!hours) return "Confirm with the store";
    if (hours.summary) return hours.summary;
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const values = days.map((day) => (hours[day] || "").trim());
    const groups = [];
    let i = 0;
    while (i < 7) {
      let j = i;
      while (j + 1 < 7 && values[j + 1] === values[i] && values[i]) j += 1;
      if (values[i]) {
        const label = i === j ? labels[i] : `${labels[i]}–${labels[j]}`;
        groups.push(`${label} ${values[i]}`);
      }
      i = j + 1;
    }
    return groups.join("; ") || "Confirm with the store";
  });

  eleventyConfig.addFilter("telHref", (phone) => {
    if (!phone) return "";
    const digits = String(phone).replace(/[^\d+]/g, "");
    return digits ? `tel:${digits}` : "";
  });

  eleventyConfig.addFilter("slugifyId", (name) =>
    String(name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  );

  eleventyConfig.addFilter("jsonLd", (obj) =>
    JSON.stringify(obj).replace(/</g, "\\u003c")
  );

  eleventyConfig.addFilter("absoluteUrl", (pathname, base) => {
    const { origin, prefix, root } = originAndPrefix(base);
    if (!pathname) return `${root}/`;
    if (/^https?:\/\//.test(pathname)) return pathname;
    const pathName = pathname.startsWith("/") ? pathname : `/${pathname}`;
    if (prefix && (pathName === prefix || pathName.startsWith(`${prefix}/`))) {
      return `${origin}${pathName}`;
    }
    return `${root}${pathName}`;
  });

  eleventyConfig.addFilter("cityPath", (city) => {
    const state = String(city.state || "").toLowerCase();
    const slug =
      city.citySlug ||
      String(city.city || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
    return `/${state}/${slug}/`;
  });

  eleventyConfig.addFilter("joinList", (items) => {
    if (!Array.isArray(items) || !items.length) return "";
    return items.join(", ");
  });

  eleventyConfig.addFilter("affiliateHref", (program) => {
    if (!program) return "";
    const tracked = String(program.url || "").trim();
    if (tracked) return tracked;
    return program.publicUrl || "";
  });

  eleventyConfig.addFilter("affiliateIsTracked", (program) =>
    Boolean(program && String(program.url || "").trim())
  );

  const dayMap = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  };

  function parseClockRange(value) {
    if (!value) return null;
    const text = String(value);
    if (/^not published$/i.test(text.trim())) return null;
    if (/^closed$/i.test(text.trim())) return null;
    const re =
      /(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)|midnight|noon)\s*[–-]\s*(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)|midnight)/i;
    const m = text.match(re);
    if (!m) return null;
    const to24 = (s) => {
      const t = s.trim().toLowerCase();
      if (t === "midnight") return "00:00";
      if (t === "noon") return "12:00";
      const mm = t.match(/(\d{1,2}):(\d{2})\s*(am|pm)/);
      if (!mm) return null;
      let h = Number(mm[1]);
      const min = mm[2];
      const ap = mm[3];
      if (ap === "pm" && h !== 12) h += 12;
      if (ap === "am" && h === 12) h = 0;
      return `${String(h).padStart(2, "0")}:${min}`;
    };
    let opens = to24(m[1]);
    let closes = to24(m[2]);
    if (!opens || !closes) return null;
    if (closes === "00:00" && /midnight/i.test(m[2])) closes = "23:59";
    return { opens, closes };
  }

  function listingToLocalBusiness(listing) {
    const url = listing.website || listing.bookingUrl;
    const business = {
      "@type": "LocalBusiness",
      name: listing.name,
      url,
      telephone: listing.phone || undefined,
      areaServed: listing.area,
      description:
        listing.carriersNotes ||
        listing.feeNotes ||
        listing.visitNotes ||
        undefined,
    };
    if (listing.address) {
      business.address = {
        "@type": "PostalAddress",
        streetAddress: listing.address,
      };
    }
    const hours = [];
    if (listing.hours) {
      for (const [day, value] of Object.entries(dayMap)) {
        const raw = listing.hours[day];
        if (!raw) continue;
        if (/24\s*hours|24\/7/i.test(raw) && !/not\s+published|closed/i.test(raw)) {
          hours.push({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: value,
            opens: "00:00",
            closes: "23:59",
          });
          continue;
        }
        const range = parseClockRange(raw);
        if (range) {
          hours.push({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: value,
            opens: range.opens,
            closes: range.closes,
          });
        }
      }
    }
    if (hours.length) business.openingHoursSpecification = hours;
    return business;
  }

  eleventyConfig.addFilter("defaultCityFaqs", (city) => [
    {
      q: `Where can I get a mailbox with 24-hour access in ${city.city}?`,
      a: `Use the 24-hour access filter on this page. We only flag a store when its own public page says the mailbox lobby is available around the clock. Staffed store hours are listed separately and are often shorter. Confirm lobby access when you rent, because that detail can change.`,
    },
    {
      q: "Will a private mailbox accept UPS, FedEx, Amazon, and USPS packages?",
      a: "A USPS PO Box generally does not accept packages from other carriers. Private mailbox stores often do. We list the carriers a store names on its public page, and we only flag “all carriers” when that page says it accepts packages from all carriers or all major carriers. Confirm any size or signing limits with the store.",
    },
    {
      q: "Do these stores offer mail scanning?",
      a: "Only if their public page says so. Most neighborhood mailbox stores hold physical mail for pickup and may forward it. Open-and-scan service is more common with virtual mailbox providers. Compare those options on the virtual mailboxes page.",
    },
    {
      q: "How do I know a location is not on a waitlist?",
      a: "We do not treat box availability as live inventory. If a store does not publish that boxes are available, we leave the “no waitlist” flag off. Call or use the store’s signup page to confirm a box is actually open.",
    },
    {
      q: "What is USPS Form 1583, and why do mailbox stores ask for it?",
      a: "Commercial mail receiving agencies have to collect USPS Form 1583 and identification before they can receive mail for you. That is a USPS requirement, not a license issued by this directory. Each store or virtual mailbox provider explains its own signup steps.",
    },
    {
      q: `Should I rent a storefront box in ${city.city} or a virtual mailbox?`,
      a: "A storefront box is useful if you want to pick up mail in person, especially after hours at a 24-hour lobby. A virtual mailbox gives you a real street address and lets you view, scan, forward, or shred mail online, which helps if you travel or cannot visit the store. Features and prices for Anytime Mailbox, iPostal1, PostScan Mail, and Traveling Mailbox are compared on our virtual mailboxes page, using only what those companies publish.",
    },
    {
      q: "How does OpenMailbox verify these listings?",
      a: "We only publish facts we found on a public page — usually the business’s own website or an official location page. Each listing has source links and a last-checked date. We do not invent hours, carriers, or services. If a site was down or a detail was unclear, we left it out.",
    },
  ]);

  eleventyConfig.addFilter("cityJsonLd", (city, siteObj) => {
    const pageUrl = `${siteObj.url}/${String(city.state).toLowerCase()}/${city.citySlug}/`;
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `Private mailboxes in ${city.city}, ${city.state} — 24-hour access, all-carrier packages, and scanning`,
      url: pageUrl,
      isPartOf: { "@type": "WebSite", name: siteObj.name, url: siteObj.url },
      about: {
        "@type": "ItemList",
        name: `Private mailbox stores in ${city.city}, ${city.state}`,
        numberOfItems: (city.listings || []).length,
        itemListElement: (city.listings || []).map((listing, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: listingToLocalBusiness(listing),
        })),
      },
    };
  });

  eleventyConfig.addFilter("faqJsonLd", (faqs, pageUrl) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: pageUrl,
    mainEntity: (faqs || []).map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  }));

  eleventyConfig.addFilter("breadcrumbJsonLd", (crumbs, siteObj) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: (crumbs || []).map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.url
        ? crumb.url.startsWith("http")
          ? crumb.url
          : `${siteObj.url}${crumb.url.startsWith("/") ? crumb.url : `/${crumb.url}`}`
        : undefined,
    })),
  }));

  eleventyConfig.addFilter("homeJsonLd", (siteObj, cities) => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteObj.name,
    url: siteObj.url,
    description: siteObj.description,
    publisher: { "@type": "Organization", name: siteObj.name, url: siteObj.url },
    hasPart: {
      "@type": "ItemList",
      name: "Cities with private mailbox listings",
      numberOfItems: (cities || []).length,
      itemListElement: (cities || []).map((city, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${city.city}, ${city.state}`,
        url: `${siteObj.url}/${String(city.state).toLowerCase()}/${city.citySlug}/`,
      })),
    },
  }));

  eleventyConfig.addFilter("virtualJsonLd", (providers, siteObj) => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Virtual mailbox services compared",
    url: `${siteObj.url}/virtual-mailboxes/`,
    numberOfItems: (providers || []).length,
    itemListElement: (providers || []).map((provider, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: provider.name,
      url: `${siteObj.url}/virtual-mailboxes/#${provider.id}`,
    })),
  }));

  eleventyConfig.addCollection("cities", () => {
    const dir = path.join(__dirname, "data", "cities");
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((name) => name.endsWith(".json"))
      .map((name) => {
        const raw = fs.readFileSync(path.join(dir, name), "utf8");
        const data = JSON.parse(raw);
        data._file = name;
        if (!data.citySlug) {
          data.citySlug = String(data.city || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-");
        }
        return data;
      })
      .sort((a, b) =>
        `${a.city}, ${a.state}`.localeCompare(`${b.city}, ${b.state}`)
      );
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: site.pathPrefix,
  };
}
