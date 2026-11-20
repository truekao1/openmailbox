import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import site from "../src/_data/site.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const citiesDir = path.join(root, "data", "cities");
const distDir = path.join(root, "dist");

const errors = [];
const warnings = [];

function fail(msg) {
  errors.push(msg);
}

function isHttpUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function isDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
}

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const flagKeys = ["access24", "allCarriers", "mailScanning", "noWaitlist", "virtual"];

function checkCityFile(file) {
  const raw = fs.readFileSync(file, "utf8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    fail(`${path.basename(file)} is not valid JSON: ${err.message}`);
    return;
  }

  const expected = path.basename(file);
  const slugName = `${String(data.state || "").toLowerCase()}-${data.citySlug || ""}.json`;
  if (expected !== slugName) {
    warnings.push(`${expected} does not match suggested name ${slugName}`);
  }

  for (const field of ["slug", "city", "citySlug", "state", "stateName", "intro", "lastUpdated", "listings"]) {
    if (data[field] == null || data[field] === "") fail(`${expected}: missing ${field}`);
  }
  if (data.state && String(data.state).length !== 2) fail(`${expected}: state should be a two-letter code`);
  if (!isDate(data.lastUpdated)) fail(`${expected}: lastUpdated must be YYYY-MM-DD`);
  if (!Array.isArray(data.listings) || data.listings.length === 0) {
    fail(`${expected}: listings must be a non-empty array`);
    return;
  }
  if (data.listings.length < 10) {
    warnings.push(`${expected}: ${data.listings.length} listings (launch target is at least 10)`);
  }

  data.listings.forEach((listing, i) => {
    const label = `${expected} listing ${i + 1} (${listing.name || "unnamed"})`;
    for (const field of ["name", "area", "address", "hours", "carriers", "flags", "sources", "lastChecked"]) {
      if (listing[field] == null || listing[field] === "") fail(`${label}: missing ${field}`);
    }
    if (listing.website && !isHttpUrl(listing.website)) fail(`${label}: website is not an http(s) URL`);
    if (listing.bookingUrl && !isHttpUrl(listing.bookingUrl)) fail(`${label}: bookingUrl is not an http(s) URL`);
    if (!isDate(listing.lastChecked)) fail(`${label}: lastChecked must be YYYY-MM-DD`);
    if (!listing.hours || typeof listing.hours !== "object") {
      fail(`${label}: hours must be an object`);
    } else {
      for (const day of days) {
        if (listing.hours[day] == null || listing.hours[day] === "") {
          fail(`${label}: missing hours.${day}`);
        }
      }
    }
    if (!Array.isArray(listing.carriers) || listing.carriers.length === 0) {
      fail(`${label}: carriers must be a non-empty array of published carrier names`);
    }
    if (!listing.flags) {
      fail(`${label}: missing flags`);
    } else {
      for (const key of flagKeys) {
        if (typeof listing.flags[key] !== "boolean") fail(`${label}: flags.${key} must be a boolean`);
      }
    }
    if (!Array.isArray(listing.sources) || listing.sources.length === 0) {
      fail(`${label}: at least one source is required`);
    } else {
      listing.sources.forEach((source, j) => {
        if (!source.label) fail(`${label}: source ${j + 1} is missing a label`);
        if (!isHttpUrl(source.url)) fail(`${label}: source ${j + 1} needs a public http(s) URL`);
      });
    }
  });
}

if (!fs.existsSync(citiesDir)) {
  fail("data/cities does not exist");
} else {
  const files = fs.readdirSync(citiesDir).filter((name) => name.endsWith(".json"));
  if (!files.length) fail("no city JSON files found");
  files.forEach((name) => checkCityFile(path.join(citiesDir, name)));
}

const built = spawnSync("npm", ["run", "build"], { cwd: root, encoding: "utf8" });
if (built.status !== 0) {
  fail(`eleventy build failed:\n${built.stdout}\n${built.stderr}`);
}

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function mountPrefix() {
  const prefix = site.pathPrefix || "/";
  if (prefix === "/") return "";
  return prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
}

function stripMount(hrefPath) {
  const prefix = mountPrefix();
  if (!prefix || !hrefPath.startsWith("/")) return hrefPath;
  if (hrefPath === prefix || hrefPath.startsWith(`${prefix}/`)) {
    return hrefPath.slice(prefix.length) || "/";
  }
  return hrefPath;
}

function resolveInternal(fromFile, href) {
  const raw = href.split("#")[0].split("?")[0];
  if (!raw || raw.startsWith("mailto:") || raw.startsWith("tel:") || /^(https?:)?\/\//.test(raw)) {
    return null;
  }
  const clean = stripMount(raw);
  if (clean.endsWith(".xml") || clean.endsWith(".txt") || clean.endsWith(".html") || path.extname(clean)) {
    const abs = clean.startsWith("/")
      ? path.join(distDir, clean.slice(1))
      : path.join(path.dirname(fromFile), clean);
    return abs;
  }
  const rel = clean.startsWith("/") ? clean.slice(1) : path.relative(distDir, path.join(path.dirname(fromFile), clean));
  const base = path.join(distDir, rel);
  return [base, path.join(base, "index.html"), `${base}.html`];
}

if (fs.existsSync(distDir) && built.status === 0) {
  const htmlFiles = walk(distDir).filter((file) => file.endsWith(".html"));
  const hrefRe = /(?:href|src)="([^"]+)"/g;
  const prefix = mountPrefix();
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    let match;
    while ((match = hrefRe.exec(html))) {
      const href = match[1];
      if (prefix && href.startsWith("/") && !href.startsWith("//")) {
        if (href !== prefix && !href.startsWith(`${prefix}/`)) {
          fail(`root link missing path prefix in ${path.relative(distDir, file)}: ${href}`);
        }
      }
      const resolved = resolveInternal(file, href);
      if (!resolved) continue;
      const candidates = Array.isArray(resolved) ? resolved : [resolved];
      if (!candidates.some((candidate) => fs.existsSync(candidate))) {
        fail(`broken internal link in ${path.relative(distDir, file)}: ${href}`);
      }
    }

    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    blocks.forEach((block, i) => {
      try {
        JSON.parse(block[1]);
      } catch (err) {
        fail(`invalid JSON-LD in ${path.relative(distDir, file)} block ${i + 1}: ${err.message}`);
      }
    });
  }

  for (const required of [
    "index.html",
    "sitemap.xml",
    "robots.txt",
    "404.html",
    "about/index.html",
    "virtual-mailboxes/index.html",
    "affiliate-disclosure/index.html",
    "ny/new-york/index.html",
    "ca/los-angeles/index.html",
  ]) {
    if (!fs.existsSync(path.join(distDir, required))) fail(`missing dist/${required}`);
  }

  const base = String(site.url || "").replace(/\/$/, "");
  const sitemap = fs.readFileSync(path.join(distDir, "sitemap.xml"), "utf8");
  const robots = fs.readFileSync(path.join(distDir, "robots.txt"), "utf8");
  const home = fs.readFileSync(path.join(distDir, "index.html"), "utf8");
  const cityPage = fs.readFileSync(path.join(distDir, "ny/new-york/index.html"), "utf8");
  const comparePage = fs.readFileSync(path.join(distDir, "virtual-mailboxes/index.html"), "utf8");
  for (const loc of [
    `${base}/`,
    `${base}/about/`,
    `${base}/virtual-mailboxes/`,
    `${base}/ny/new-york/`,
    `${base}/ca/los-angeles/`,
  ]) {
    if (!sitemap.includes(`<loc>${loc}</loc>`)) fail(`sitemap.xml missing ${loc}`);
  }
  if (!robots.includes(`Sitemap: ${base}/sitemap.xml`)) {
    fail(`robots.txt missing Sitemap: ${base}/sitemap.xml`);
  }
  if (!home.includes(`${base}/`)) fail(`home page missing absolute URL ${base}/`);
  if (!home.includes(`"@type":"WebSite"`) && !home.includes(`"@type": "WebSite"`)) {
    fail("home page missing WebSite JSON-LD");
  }
  if (!cityPage.includes(`${base}/ny/new-york/`)) {
    fail(`city page missing absolute URL ${base}/ny/new-york/`);
  }
  if (!comparePage.includes("Anytime Mailbox") || !comparePage.includes("PostScan Mail") || !comparePage.includes("iPostal1") || !comparePage.includes("Traveling Mailbox")) {
    fail("virtual mailboxes page is missing one of the four comparison providers");
  }
  const trackedIpostal = "https://ipostal1.com/?ref=8020";
  const chicagoPage = fs.readFileSync(path.join(distDir, "il/chicago/index.html"), "utf8");
  const dallasPage = fs.existsSync(path.join(distDir, "tx/dallas/index.html"))
    ? fs.readFileSync(path.join(distDir, "tx/dallas/index.html"), "utf8")
    : "";
  for (const [label, html] of [
    ["home page", home],
    ["New York city page", cityPage],
    ["Chicago city page", chicagoPage],
    ["virtual mailboxes page", comparePage],
    ...(dallasPage ? [["Dallas city page", dallasPage]] : []),
  ]) {
    if (!html.includes(trackedIpostal)) fail(`${label} missing iPostal1 referral link ${trackedIpostal}`);
    if (!html.includes('rel="sponsored nofollow')) fail(`${label} missing rel="sponsored nofollow" on an affiliate link`);
    if (!html.includes("Some links are affiliate links")) fail(`${label} missing sitewide affiliate disclosure line`);
  }
  if (prefix && (home.includes(`${prefix}/${prefix.replace(/^\//, "")}`) || cityPage.includes(`${prefix}/${prefix.replace(/^\//, "")}`))) {
    fail("built HTML doubled the path prefix");
  }
}

if (warnings.length) {
  console.log("Warnings:");
  warnings.forEach((w) => console.log("  -", w));
}
if (errors.length) {
  console.error(`\n${errors.length} problem(s):`);
  errors.forEach((e) => console.error("  -", e));
  process.exit(1);
}

const cityCount = fs.readdirSync(citiesDir).filter((n) => n.endsWith(".json")).length;
console.log(`OK: ${cityCount} city file(s), build succeeded, internal links and JSON-LD parsed.`);
