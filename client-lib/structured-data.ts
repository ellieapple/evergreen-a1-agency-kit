/**
 * structured-data.ts — Evergreen A1 Marketing
 * Drop into /lib/ in every Next.js client project.
 *
 * Usage:
 *   import { StructuredData, buildLocalBusinessSchema, buildFAQSchema } from "@/lib/structured-data"
 *   <StructuredData schema={[localBizSchema, faqSchema, breadcrumbSchema]} />
 */

// ─── 1. LOCAL BUSINESS ───────────────────────────────────────
interface LocalBusinessProps {
  name: string; type: string; url: string; telephone: string; email?: string
  description: string
  address: { streetAddress: string; addressLocality: string; addressRegion: string; postalCode: string; addressCountry: "US" }
  geo: { latitude: number; longitude: number }
  openingHours: string[] // ["Mo-Fr 08:00-17:00", "Sa 09:00-14:00"]
  areaServed: string[]
  priceRange?: string
  aggregateRating?: { ratingValue: number; reviewCount: number; bestRating?: number }
  sameAs: string[]
  logo?: string; image?: string; foundingYear?: number; slogan?: string
  hasMap?: string; currenciesAccepted?: string; paymentAccepted?: string; keywords?: string[]
  licenseNumber?: string; licenseName?: string
}

export function buildLocalBusinessSchema(props: LocalBusinessProps): object {
  return {
    "@context": "https://schema.org", "@type": props.type,
    "@id": `${props.url}/#business`,
    name: props.name, url: props.url, telephone: props.telephone,
    ...(props.email && { email: props.email }),
    description: props.description,
    address: { "@type": "PostalAddress", streetAddress: props.address.streetAddress, addressLocality: props.address.addressLocality, addressRegion: props.address.addressRegion, postalCode: props.address.postalCode, addressCountry: props.address.addressCountry },
    geo: { "@type": "GeoCoordinates", latitude: props.geo.latitude, longitude: props.geo.longitude },
    openingHoursSpecification: props.openingHours.map(h => parseOpeningHours(h)),
    areaServed: props.areaServed.map(a => ({ "@type": "City", name: a })),
    ...(props.priceRange && { priceRange: props.priceRange }),
    ...(props.aggregateRating && { aggregateRating: { "@type": "AggregateRating", ratingValue: props.aggregateRating.ratingValue, reviewCount: props.aggregateRating.reviewCount, bestRating: props.aggregateRating.bestRating ?? 5, worstRating: 1 } }),
    sameAs: props.sameAs,
    ...(props.logo && { logo: { "@type": "ImageObject", url: props.logo } }),
    ...(props.image && { image: props.image }),
    ...(props.foundingYear && { foundingDate: String(props.foundingYear) }),
    ...(props.slogan && { slogan: props.slogan }),
    ...(props.hasMap && { hasMap: props.hasMap }),
    ...(props.keywords && { keywords: props.keywords.join(", ") }),
    ...(props.licenseNumber && { hasCredential: { "@type": "EducationalOccupationalCredential", credentialCategory: "license", name: props.licenseName ?? "Business License", identifier: props.licenseNumber } }),
    contactPoint: { "@type": "ContactPoint", telephone: props.telephone, contactType: "customer service", areaServed: "US", availableLanguage: "English" },
  }
}

function parseOpeningHours(hours: string) {
  const [days, times] = hours.split(" "); const [opens, closes] = times.split("-")
  const dayMap: Record<string, string> = { Mo:"Monday",Tu:"Tuesday",We:"Wednesday",Th:"Thursday",Fr:"Friday",Sa:"Saturday",Su:"Sunday" }
  const order = ["Mo","Tu","We","Th","Fr","Sa","Su"]
  const dayRange = days.includes("-") ? (() => { const [s,e]=days.split("-"); return order.slice(order.indexOf(s),order.indexOf(e)+1).map(d=>dayMap[d]) })() : [dayMap[days]]
  return { "@type": "OpeningHoursSpecification", dayOfWeek: dayRange, opens, closes }
}

// ─── 2. SERVICE ───────────────────────────────────────────────
export function buildServiceSchema(p: { name: string; description: string; url: string; provider: { name: string; url: string; telephone: string }; areaServed: string[]; category?: string; hasOfferCatalog?: Array<{name:string;description:string}>; aggregateRating?: {ratingValue:number;reviewCount:number} }): object {
  return {
    "@context": "https://schema.org", "@type": "Service",
    name: p.name, description: p.description, url: p.url,
    provider: { "@type": "LocalBusiness", name: p.provider.name, url: p.provider.url, telephone: p.provider.telephone },
    areaServed: p.areaServed.map(a => ({ "@type": "City", name: a })),
    ...(p.category && { serviceType: p.category }),
    ...(p.hasOfferCatalog && { hasOfferCatalog: { "@type": "OfferCatalog", name: `${p.name} Services`, itemListElement: p.hasOfferCatalog.map((item,idx) => ({ "@type": "Offer", position: idx+1, itemOffered: { "@type": "Service", name: item.name, description: item.description } })) } }),
    ...(p.aggregateRating && { aggregateRating: { "@type": "AggregateRating", ratingValue: p.aggregateRating.ratingValue, reviewCount: p.aggregateRating.reviewCount, bestRating: 5, worstRating: 1 } }),
  }
}

// ─── 3. FAQ ───────────────────────────────────────────────────
export function buildFAQSchema(items: Array<{question:string;answer:string}>): object {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(i => ({ "@type": "Question", name: i.question, acceptedAnswer: { "@type": "Answer", text: i.answer } })) }
}

// ─── 4. BREADCRUMB ────────────────────────────────────────────
export function buildBreadcrumbSchema(items: Array<{name:string;url:string}>): object {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item,idx) => ({ "@type": "ListItem", position: idx+1, name: item.name, item: item.url })) }
}

// ─── 5. HOWTO ─────────────────────────────────────────────────
export function buildHowToSchema(p: { name:string; description:string; totalTime?:string; steps:Array<{name:string;text:string;image?:string}>; supply?:string[]; tool?:string[] }): object {
  return {
    "@context": "https://schema.org", "@type": "HowTo",
    name: p.name, description: p.description,
    ...(p.totalTime && { totalTime: p.totalTime }),
    ...(p.supply && { supply: p.supply.map(s => ({ "@type": "HowToSupply", name: s })) }),
    ...(p.tool && { tool: p.tool.map(t => ({ "@type": "HowToTool", name: t })) }),
    step: p.steps.map((s,idx) => ({ "@type": "HowToStep", position: idx+1, name: s.name, text: s.text, ...(s.image && { image: { "@type": "ImageObject", url: s.image } }) }))
  }
}

// ─── 6. REVIEW ────────────────────────────────────────────────
export function buildReviewSchema(p: { itemName:string; itemType:string; itemUrl:string; reviews:Array<{author:string;datePublished:string;reviewBody:string;ratingValue:number;platform?:string}> }): object {
  return { "@context": "https://schema.org", "@type": p.itemType, name: p.itemName, url: p.itemUrl,
    review: p.reviews.map(r => ({ "@type": "Review", author: { "@type": "Person", name: r.author }, datePublished: r.datePublished, reviewBody: r.reviewBody, reviewRating: { "@type": "Rating", ratingValue: r.ratingValue, bestRating: 5, worstRating: 1 }, ...(r.platform && { publisher: { "@type": "Organization", name: r.platform } }) })) }
}

// ─── 7. EVENT ─────────────────────────────────────────────────
export function buildEventSchema(p: { name:string; description:string; startDate:string; endDate?:string; location:{name:string;address:string;city:string;state:string;postalCode:string}; organizer:{name:string;url:string}; image?:string; eventStatus?:string; offers?:{price:string;priceCurrency:string;url?:string;availability?:string}; performer?:string }): object {
  return {
    "@context": "https://schema.org", "@type": "Event",
    name: p.name, description: p.description, startDate: p.startDate,
    ...(p.endDate && { endDate: p.endDate }),
    eventStatus: `https://schema.org/${p.eventStatus ?? "EventScheduled"}`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: p.location.name, address: { "@type": "PostalAddress", streetAddress: p.location.address, addressLocality: p.location.city, addressRegion: p.location.state, postalCode: p.location.postalCode, addressCountry: "US" } },
    organizer: { "@type": "Organization", name: p.organizer.name, url: p.organizer.url },
    ...(p.image && { image: p.image }),
    ...(p.offers && { offers: { "@type": "Offer", price: p.offers.price, priceCurrency: p.offers.priceCurrency, availability: `https://schema.org/${p.offers.availability ?? "InStock"}`, ...(p.offers.url && { url: p.offers.url }) } }),
    ...(p.performer && { performer: { "@type": "PerformingGroup", name: p.performer } })
  }
}

// ─── 8. ARTICLE / BLOG POST ───────────────────────────────────
export function buildArticleSchema(p: { headline:string; description:string; url:string; datePublished:string; dateModified:string; author:{name:string;url?:string}; publisher:{name:string;url:string;logo:string}; image:string; keywords?:string[]; articleSection?:string; wordCount?:number }): object {
  return {
    "@context": "https://schema.org", "@type": "BlogPosting",
    headline: p.headline, description: p.description, url: p.url,
    datePublished: p.datePublished, dateModified: p.dateModified,
    author: { "@type": "Person", name: p.author.name, ...(p.author.url && { url: p.author.url }) },
    publisher: { "@type": "Organization", name: p.publisher.name, url: p.publisher.url, logo: { "@type": "ImageObject", url: p.publisher.logo } },
    image: { "@type": "ImageObject", url: p.image, width: 1200, height: 630 },
    mainEntityOfPage: { "@type": "WebPage", "@id": p.url },
    ...(p.keywords && { keywords: p.keywords.join(", ") }),
    ...(p.articleSection && { articleSection: p.articleSection }),
    ...(p.wordCount && { wordCount: p.wordCount })
  }
}

// ─── 9. WEBSITE ───────────────────────────────────────────────
export function buildWebsiteSchema(siteUrl: string, siteName: string): object {
  return { "@context": "https://schema.org", "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: siteName, potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/?s={search_term_string}` }, "query-input": "required name=search_term_string" } }
}

// ─── 10. ORGANIZATION ─────────────────────────────────────────
export function buildOrganizationSchema(p: { name:string; url:string; logo:string; description:string; foundingYear?:number; founders?:string[]; sameAs:string[]; contactPoint?:{telephone:string;contactType:string} }): object {
  return {
    "@context": "https://schema.org", "@type": "Organization", "@id": `${p.url}/#organization`,
    name: p.name, url: p.url, logo: { "@type": "ImageObject", url: p.logo },
    description: p.description, sameAs: p.sameAs,
    ...(p.foundingYear && { foundingDate: String(p.foundingYear) }),
    ...(p.founders && { founder: p.founders.map(f => ({ "@type": "Person", name: f })) }),
    ...(p.contactPoint && { contactPoint: { "@type": "ContactPoint", telephone: p.contactPoint.telephone, contactType: p.contactPoint.contactType } })
  }
}

// ─── 11. ITEM LIST ────────────────────────────────────────────
export function buildItemListSchema(p: { name:string; description:string; url:string; items:Array<{name:string;url:string;description?:string}> }): object {
  return { "@context": "https://schema.org", "@type": "ItemList", name: p.name, description: p.description, url: p.url, itemListElement: p.items.map((item,idx) => ({ "@type": "ListItem", position: idx+1, name: item.name, url: item.url, ...(item.description && { description: item.description }) })) }
}

// ─── REACT COMPONENT ──────────────────────────────────────────
// Usage: <StructuredData schema={[schema1, schema2, schema3]} />
export function StructuredData({ schema }: { schema: object | object[] }) {
  const schemas = Array.isArray(schema) ? schema : [schema]
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s, null, 2) }} />
      ))}
    </>
  )
}

// ─── PRE-BUILT CLIENT CONFIGS ─────────────────────────────────
// Fill in [PLACEHOLDERS] and import in each client project

export const JLA_BUSINESS_SCHEMA = buildLocalBusinessSchema({
  name: "JLA Custom Homes", type: "GeneralContractor", url: "https://[DOMAIN].com",
  telephone: "[PHONE]", email: "[EMAIL]",
  description: "JLA Custom Homes builds luxury custom homes in Evergreen, Conifer, Bailey, and Jefferson County, CO. Specializing in bespoke design, premium craftsmanship, and full-service project management.",
  address: { streetAddress: "[STREET]", addressLocality: "Evergreen", addressRegion: "CO", postalCode: "[ZIP]", addressCountry: "US" },
  geo: { latitude: 39.6333, longitude: -105.3191 },
  openingHours: ["Mo-Fr 08:00-17:00"],
  areaServed: ["Evergreen", "Conifer", "Bailey", "Morrison", "Littleton"],
  priceRange: "$$$$", slogan: "[TAGLINE]",
  sameAs: ["[GBP_URL]","[FACEBOOK_URL]","[INSTAGRAM_URL]","[HOUZZ_URL]"],
  keywords: ["custom home builder", "luxury homes", "mountain homes", "Colorado custom homes"],
})

export const TRI_PEAKS_BUSINESS_SCHEMA = buildLocalBusinessSchema({
  name: "Tri Peaks Electric Service", type: "ElectricalContractor", url: "https://[DOMAIN].com",
  telephone: "(720) 436-5746",
  description: "Licensed and insured electrical contractor serving Bailey, Conifer, Evergreen, and Park County, CO. 19 years experience. Lead electrician on every job. Residential wiring, panel upgrades, EV charger installation, emergency electrical.",
  address: { streetAddress: "[STREET]", addressLocality: "Bailey", addressRegion: "CO", postalCode: "[ZIP]", addressCountry: "US" },
  geo: { latitude: 39.4100, longitude: -105.4769 },
  openingHours: ["Mo-Fr 07:00-18:00", "Sa 08:00-14:00"],
  areaServed: ["Bailey", "Conifer", "Evergreen", "Fairplay", "Shawnee", "Park County"],
  priceRange: "$$",
  sameAs: ["[GBP_URL]","[FACEBOOK_URL]","[ANGI_URL]","[HOMEADVISOR_URL]","[BBB_URL]"],
  keywords: ["electrician Bailey CO", "electrical contractor", "panel upgrade", "EV charger installation"],
  licenseNumber: "[CO LICENSE #]", licenseName: "Colorado Electrical Contractor License",
})

export const CACTUS_JACKS_BUSINESS_SCHEMA = buildLocalBusinessSchema({
  name: "Cactus Jack's", type: "BarOrPub", url: "https://[DOMAIN].com",
  telephone: "[PHONE]",
  description: "Evergreen's favorite neighborhood bar and restaurant. Live music, weekly events, craft cocktails, and great food in downtown Evergreen, CO.",
  address: { streetAddress: "[STREET]", addressLocality: "Evergreen", addressRegion: "CO", postalCode: "[ZIP]", addressCountry: "US" },
  geo: { latitude: 39.6333, longitude: -105.3191 },
  openingHours: ["Mo-Th 11:00-22:00", "Fr-Sa 11:00-00:00", "Su 10:00-21:00"],
  areaServed: ["Evergreen", "Morrison", "Conifer", "Bergen Park"],
  priceRange: "$$",
  sameAs: ["[GBP_URL]","[FACEBOOK_URL]","[INSTAGRAM_URL]","[YELP_URL]","[TRIPADVISOR_URL]"],
  keywords: ["bar Evergreen CO", "live music Evergreen", "restaurant Evergreen", "events Evergreen"],
})

export const LISA_BUSINESS_SCHEMA = buildLocalBusinessSchema({
  name: "Lisa Dauphinais, DO", type: "Physician", url: "https://[DOMAIN].com",
  telephone: "[PHONE]",
  description: "Board-certified osteopathic physician offering osteopathic manipulative medicine (OMM) in Evergreen, CO. Treating musculoskeletal pain, headaches, sports injuries, and chronic conditions.",
  address: { streetAddress: "[STREET]", addressLocality: "Evergreen", addressRegion: "CO", postalCode: "[ZIP]", addressCountry: "US" },
  geo: { latitude: 39.6333, longitude: -105.3191 },
  openingHours: ["[FILL IN HOURS]"],
  areaServed: ["Evergreen", "Conifer", "Morrison", "Golden"],
  sameAs: ["[GBP_URL]","[HEALTHGRADES_URL]","[VITALS_URL]","[DOXIMITY_URL]"],
  keywords: ["osteopathic manipulation", "OMM", "osteopath Evergreen CO", "musculoskeletal pain"],
})
