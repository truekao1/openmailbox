/**
 * Virtual mailbox comparison facts, taken only from official public
 * pages and dated when last checked. Do not invent a rate or allowance.
 */
export default [
  {
    id: "anytimeMailbox",
    name: "Anytime Mailbox",
    lastChecked: "2026-11-18",
    officialSite: "https://www.anytimemailbox.com/",
    startingPrice:
      "The homepage FAQ says the cheapest plans are $4.99, the average plan is $9.99 per month, and some vanity addresses can cost up to $50. The same homepage “Pick a Service Plan” section, and the virtual mailbox landing page, say prices or plans start at $9.99. Exact price depends on the address you choose.",
    plans: [
      {
        name: "Address-specific plans (no single national rate card)",
        price: "Published starting figures range from $4.99 to $9.99/month; vanity addresses up to $50",
        details:
          "Plans are set by the local mail-center operator. Confirm the live plan card for the address you want.",
      },
    ],
    features: [
      "Real street address at 2,500+ locations",
      "24/7 online access to mail on web or app",
      "Open and scan mail to PDF, plus forwarding, shredding or recycling, and scheduled pickup",
      "Check deposit at select locations",
      "Free unlimited online storage (homepage)",
      "Notifications by app, text, or email",
      "USPS Form 1583 and two IDs required to receive mail",
      "30-day money-back guarantee, cancel anytime (landing page)",
    ],
    allowances:
      "A landing page section titled “All Virtual Mailbox Plans Include” lists: 30 incoming mail per month, $0.35 per additional page; Open & Scan includes 5 pages per month, $0.50 per additional page; 1 recipient included, $10 per additional person; local pickup available at all locations, some charge a $2 pickup fee; forwarding $5.00 per shipping bundle. The homepage also says there are no hidden additional fees and that each plan shows included services and extra-action fees before you sign up. Allowances can still vary by operator, so confirm the location’s own plan card.",
    notes:
      "International customers can use a U.S. address. The company says it does not recommend using the mailbox as an official business address for LLC, IRS, or bank documents without checking the institution first.",
    sources: [
      { label: "Anytime Mailbox homepage", url: "https://www.anytimemailbox.com/" },
      {
        label: "Virtual mailbox landing page",
        url: "https://www.anytimemailbox.com/lp/virtual-mailbox-2",
      },
    ],
  },
  {
    id: "ipostal1",
    name: "iPostal1",
    lastChecked: "2026-11-18",
    officialSite: "https://ipostal1.com/",
    startingPrice:
      "Virtual Mailing Address plans start at $9.99 per month for 30 mail items, or $99 per year (two months free). Business-name plans are listed separately and start at $14.99 per month.",
    plans: [
      { name: "30 mail items / month", price: "$9.99/month or $99/year", details: "Virtual Mailing Address (personal). Yearly price is two months free versus $119.88." },
      { name: "60 mail items / month", price: "$14.99/month or $149/year", details: "Virtual Mailing Address (personal)." },
      { name: "120 mail items / month", price: "$24.99/month or $249/year", details: "Virtual Mailing Address (personal)." },
      { name: "240 mail items / month", price: "$39.99/month or $399/year", details: "Virtual Mailing Address (personal)." },
    ],
    features: [
      "Real physical street address and a personal digital mailbox (web or app)",
      "24/7 digital access and unlimited secure cloud storage for scans and voice messages",
      "Picture of the outside of every mail item, plus sender information and email alerts",
      "Up to 6 recipient names per address on Virtual Mailing Address plans (no company name)",
      "Flexible forwarding with a choice of carriers, ship dates, and service level",
      "Letter consolidation at no charge; package or letter-pack consolidation $1.95; magazines $1.95 for any number",
      "No contract; change monthly plans any time",
      "Full refund of the mailbox rental fee within the first 30 days on request, if the account was not used",
    ],
    allowances:
      "Plan pricing varies by Standard, Select, Premium, or Prestige location, plus applicable taxes. Items above the plan maximum are $0.35 each. Mail content scanning or shredding is $2.25 for up to 10 pages, then $0.25 per page (prepaid bundles are also listed). Some locations charge a nominal fee to pick up mail or packages. Included storage: 30 days for mail and letter packs and for packages under 1,728 cu in; 10 days for packages 1,728–4,895 cu in; 5 days for larger packages. Check deposit by mail, offered at most U.S. locations, is $4.95 to deposit up to 5 checks, plus check-scan and trackable shipping costs.",
    notes:
      "Virtual Business Address and Virtual Office plans (company name, and optional phone and fax) are priced on separate official pages, starting at $14.99 and $39.99 per month respectively. International shipping is not available at all locations.",
    sources: [
      {
        label: "Virtual Mailing Address plans and pricing",
        url: "https://ipostal1.com/virtual-mailing-address-plans-pricing.php",
      },
      { label: "Mailbox rental overview", url: "https://ipostal1.com/mailbox-rental.php" },
    ],
  },
  {
    id: "postscanMail",
    name: "PostScan Mail",
    lastChecked: "2026-11-18",
    officialSite: "https://www.postscanmail.com/",
    startingPrice:
      "Starter mailbox plans are published as low as $10 per month (or $8.33 per month when billed annually). Exact monthly prices are “as low as” figures and can be higher at some addresses.",
    plans: [
      { name: "Starter (monthly)", price: "As low as $10/month", details: "30 letters or packages per month; 1 recipient." },
      { name: "Standard (monthly)", price: "As low as $20/month", details: "60 items per month; 5 free Open & Scans; 2 recipients." },
      { name: "Premium (monthly)", price: "As low as $30/month", details: "120 items per month; 10 free Open & Scans; 4 recipients." },
      { name: "Starter (annual)", price: "$8.33/month equivalent", details: "Same 30-item monthly allowance; 2 recipients. The pricing page also labels annual billing as “2 months free.”" },
      { name: "Basic Locker", price: "$4.95/month", details: "$3 processing per item; $2 forwarding per item; first 7 days of package storage free, then $0.10 per pound per day." },
      { name: "Premium Locker", price: "$9.95/month", details: "$2 processing per item; $1 forwarding per item; first 14 days of package storage free, then $0.10 per pound per day." },
    ],
    features: [
      "Professional U.S. street address",
      "24/7 online access and unlimited cloud storage",
      "Instant notifications, content scans as PDFs, AI mail summaries, and a mobile app",
      "Local pickup (most locations free; some may charge a nominal fee)",
      "Consolidation and forwarding, plus junk-mail discarding",
      "Personal or LLC business use is listed among included features",
    ],
    allowances:
      "Additional received items over the plan’s incoming-mail limit: $0.50 per extra envelope or package scan. Additional Open & Scan: $2.00 per envelope for up to 10 pages, then $0.25 per additional page. Mail forwarding: $2.00 for the first item, then $0.50 per additional item, plus the cost of shipping. Mail storage: first 14 days free, or 30 days with an annual plan, then $0.05 per envelope per day. Package storage: first 3 days free, or 7 days with an annual plan, then $0.10 per pound per day. Additional recipients: $5.00 per month per additional recipient or user. Additional mailboxes: $5.00 per month. Mail shredding: $1.00 per item for the first 10 pages, then $0.15 per additional page. Oversized packages (more than 25 lbs or more than 110 inches in length and girth): $0.25 per pound. AI mail summary: 10 free per month, then $0.25 each. HIPAA compliance: $25.00 per month, billed annually, then $0.50 per received mail item.",
    notes:
      "The official pricing page shows several higher “as low as” prices for the same plan names, so the figure that applies is the one on the address you select. Annual Standard and Premium plan cards were only partly visible in the layout we captured; we do not invent those missing annual prices here.",
    sources: [
      { label: "PostScan Mail pricing", url: "https://www.postscanmail.com/pricing.html" },
    ],
  },
  {
    id: "travelingMailbox",
    name: "Traveling Mailbox",
    lastChecked: "2026-11-18",
    officialSite: "https://travelingmailbox.com/",
    startingPrice:
      "The Basic Plan is $15 per month. An official Extended Plan product page also says addresses in a larger city such as New York, NY or Dallas, TX can add $4.95 per month, and that plan includes a choice of 11 addresses.",
    plans: [
      { name: "Basic Plan", price: "$15/month", details: "40 incoming envelopes, 35 page scans, and 3 mailbox recipients per month." },
      { name: "Extended Plan", price: "$25/month, or $250/year on the annual product page", details: "100 incoming envelopes, 80 page scans, and 5 mailbox recipients, including a business recipient. The monthly Extended Plan product page also includes one free ScanPAK per month." },
      { name: "Small Business Plan", price: "$55/month", details: "200 incoming envelopes, 180 page scans, and 10 mailbox recipients per month." },
    ],
    features: [
      "Postal mail scanning, mail and package forwarding, check deposit, package and envelope storage, and free envelope shredding",
      "Junk mail can be marked as junk and does not count toward plan limits",
      "Unlimited cloud storage and the ability to change plans at any time",
      "Forwarding worldwide via USPS, FedEx, or UPS, with free consolidation",
      "No contracts; month-to-month, or annual billing for two months free (annual plans are refundable on a monthly schedule)",
      "Most people use the Sanford, NC home-base location; other addresses are available",
      "10% monthly discount for active-duty military and veterans",
    ],
    allowances:
      "Envelope scans of the outside of each received envelope do not count against the page-scan allotment. Additional incoming envelopes are $0.25 each over the plan limit. Additional page scans are $0.50 per page over the allotment. Forwarding is postage plus $2 per shipment, not per piece. Check deposit is $4.95 per check plus postage. Package storage is free for 30 days, then $0.10 per pound per day. Physical envelopes are held free for 30 days; after that, mail not placed on hold is shredded on site, and a hold is $1 per envelope per month. A note on the same pricing page also says “the first 30 days of storage is free! (60 Days total of free storage.).” Confirm the current storage rule with the company if it matters for your mail. Plan cards say “Your Scans Rollover,” but a footnote on the same page says unused envelope and page scans roll over on Extended, Small Business, and Enterprise plans only.",
    notes:
      "Anyone from any state may use the service. Business names can be added to any of the listed plans. Setup is described as issuing an address within minutes after checkout.",
    sources: [
      { label: "Traveling Mailbox pricing", url: "https://travelingmailbox.com/pricing" },
      { label: "Extended Plan + ScanPAK", url: "https://travelingmailbox.com/product/extended-plan" },
      { label: "Extended Plan + ScanPAK (annual)", url: "https://travelingmailbox.com/product/extended-plan-scanpak-annual" },
    ],
  },
];
