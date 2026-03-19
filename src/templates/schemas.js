// Schema template generators — one per page type
// Each returns a clean JSON-LD object based on form data

function clean(obj) {
  // Recursively remove empty strings, null, undefined, empty arrays
  if (Array.isArray(obj)) {
    const cleaned = obj.map(clean).filter(v => v !== null && v !== undefined && v !== '');
    return cleaned.length > 0 ? cleaned : undefined;
  }
  if (obj && typeof obj === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      const v = clean(value);
      if (v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)) {
        cleaned[key] = v;
      }
    }
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }
  return obj;
}

function normalizeUrl(url) {
  if (!url) return '';
  // Strip trailing slashes, then collapse any double slashes (except after protocol)
  return url.replace(/\/+$/, '').replace(/([^:])\/\/+/g, '$1/');
}

function toISODateTime(dateStr) {
  if (!dateStr) return undefined;
  // Already has time component — return as-is
  if (dateStr.includes('T')) return dateStr;
  // Date-only (YYYY-MM-DD) — append midnight with no offset
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return `${dateStr}T00:00:00`;
  return dateStr;
}

function buildSameAs(data) {
  return [
    data.facebookUrl, data.instagramUrl, data.twitterUrl,
    data.youtubeUrl, data.linkedinUrl, data.yelpUrl
  ].filter(Boolean);
}

function buildOrganization(data) {
  const org = {
    "@type": "Organization",
    "@id": `${data.brandDomain}/#organization`,
    "name": data.brandName,
    "url": data.brandDomain,
    "description": data.brandDescription || undefined,
    "image": data.brandLogoUrl || undefined,
    "logo": data.brandLogoUrl ? {
      "@type": "ImageObject",
      "@id": `${data.brandDomain}/#logo`,
      "contentUrl": data.brandLogoUrl,
      "url": data.brandDomain,
      "caption": data.brandName
    } : undefined,
    "telephone": data.brandPhone || undefined,
    "email": data.brandEmail || undefined,
  };

  // Only add address if has physical address
  if (data.hqStreet || data.hqCity) {
    org.address = clean({
      "@type": "PostalAddress",
      "streetAddress": data.hqStreet || undefined,
      "addressLocality": data.hqCity,
      "addressRegion": data.hqState,
      "postalCode": data.hqZip || undefined,
      "addressCountry": data.addressCountry || "US"
    });
  }

  if (data.foundingDate) org.foundingDate = data.foundingDate;
  if (data.numberOfEmployees) {
    org.numberOfEmployees = {
      "@type": "QuantitativeValue",
      "value": data.numberOfEmployees
    };
  }

  const sameAs = buildSameAs(data);
  if (sameAs.length > 0) org.sameAs = sameAs;

  if (data.contactPointPhone) {
    org.contactPoint = clean({
      "@type": "ContactPoint",
      "telephone": data.contactPointPhone,
      "contactType": data.contactPointType || "customer service",
      "availableLanguage": data.contactLanguages ? data.contactLanguages.split(',').map(s => s.trim()) : undefined
    });
  }

  if (data.areaServed && data.areaServed.length > 0) {
    org.areaServed = data.areaServed.map(area => clean({
      "@type": area.type || "State",
      "name": area.name,
      "sameAs": area.sameAs || undefined
    }));
    if (org.areaServed.length === 1) org.areaServed = org.areaServed[0];
  }

  if (data.knowsAbout && data.knowsAbout.length > 0) {
    org.knowsAbout = data.knowsAbout.filter(Boolean);
  }

  return org;
}

function buildLocalBusiness(data, loc = {}) {
  const slug = loc.slug || data.locationSlug || '';
  const locationPath = slug ? `/locations/${slug}` : '/locations';
  const biz = {
    "@type": data.businessType || "LocalBusiness",
    "@id": normalizeUrl(`${data.brandDomain}${locationPath}/#localbusiness`),
    "name": loc.name ? `${data.brandName} - ${loc.name}` : data.brandName,
    "image": loc.image || data.locationImage || undefined,
    "url": loc.pageUrl || data.locationPageUrl || data.brandDomain,
    "telephone": loc.phone || data.locationPhone || data.brandPhone || undefined,
    "parentOrganization": { "@id": `${data.brandDomain}/#organization` },
  };

  // Address handling based on GBP status
  if (data.gbpStatus === 'no-address') {
    // Online only — use Organization instead, this shouldn't be called
  } else if (data.gbpStatus === 'sab-hidden') {
    // SAB — city/state only, no street
    biz.address = clean({
      "@type": "PostalAddress",
      "addressLocality": loc.city || data.locationCity,
      "addressRegion": loc.stateAbbr || data.locationStateAbbr,
      "addressCountry": data.addressCountry || "US"
    });
    biz.publicAccess = false;
  } else {
    // Full address
    biz.address = clean({
      "@type": "PostalAddress",
      "streetAddress": loc.street || data.locationStreet || undefined,
      "addressLocality": loc.city || data.locationCity,
      "addressRegion": loc.stateAbbr || data.locationStateAbbr,
      "postalCode": loc.zip || data.locationZip || undefined,
      "addressCountry": data.addressCountry || "US"
    });
  }

  // Geo
  const lat = loc.lat || data.locationLat;
  const lng = loc.lng || data.locationLng;
  if (lat && lng) {
    biz.geo = { "@type": "GeoCoordinates", "latitude": lat, "longitude": lng };
  }

  // Area served
  const cityName = loc.city || data.locationCity;
  const stateName = loc.state || data.locationState;
  const cityWiki = loc.cityWiki || data.locationWiki;
  const stateWiki = loc.stateWiki || data.stateWiki;

  const areas = [];
  if (cityName) areas.push(clean({ "@type": "City", "name": cityName, "sameAs": cityWiki || undefined }));
  if (stateName) areas.push(clean({ "@type": "State", "name": stateName, "sameAs": stateWiki || undefined }));
  if (areas.length > 0) biz.areaServed = areas;

  // Hours — supports multiple blocks (e.g. Mon-Fri 8-5, Sat 9-3)
  let hoursBlocks = data.hoursBlocks || [];
  // Backward compat: migrate old flat fields
  if (hoursBlocks.length === 0 && data.hoursDays && data.hoursOpen && data.hoursClose) {
    let days;
    try { days = JSON.parse(data.hoursDays); } catch { days = []; }
    hoursBlocks = [{ days: Array.isArray(days) ? days : [], opens: data.hoursOpen, closes: data.hoursClose }];
  }
  const validBlocks = hoursBlocks.filter(b => b.days && b.days.length > 0 && b.opens && b.closes);
  if (validBlocks.length > 0) {
    biz.openingHoursSpecification = validBlocks.map(b => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": b.days,
      "opens": b.opens,
      "closes": b.closes
    }));
  }

  if (data.priceRange) biz.priceRange = data.priceRange;
  if (data.paymentAccepted) biz.paymentAccepted = data.paymentAccepted;
  if (data.hasMap) biz.hasMap = data.hasMap;

  return biz;
}

function buildService(data) {
  return clean({
    "@type": "Service",
    "@id": data.locationSlug
      ? `${data.brandDomain}/#service-${data.serviceSlug}-${data.locationSlug}`
      : `${data.brandDomain}/#service-${data.serviceSlug}`,
    "name": data.locationCity
      ? `${data.serviceName} in ${data.locationCity} ${data.locationStateAbbr || ''}`
      : data.serviceName,
    "description": data.serviceDescription || undefined,
    "image": data.serviceImage || undefined,
    "url": data.servicePageUrl || data.pageUrl || undefined,
    "serviceType": data.serviceType || undefined,
    "category": data.serviceCategory || undefined,
    "provider": data.locationSlug
      ? { "@id": normalizeUrl(`${data.brandDomain}/locations/${data.locationSlug}/#localbusiness`) }
      : { "@id": `${data.brandDomain}/#organization` },
    "areaServed": data.locationCity ? clean({
      "@type": "City",
      "name": data.locationCity,
      "sameAs": data.locationWiki || undefined
    }) : data.locationState ? clean({
      "@type": "State",
      "name": data.locationState,
      "sameAs": data.stateWiki || undefined
    }) : undefined
  });
}

function buildBreadcrumb(items, id) {
  return {
    "@type": "BreadcrumbList",
    "@id": id,
    "itemListElement": items.map((item, i) => clean({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": i < items.length - 1 ? item.url : undefined
    }))
  };
}

function buildArticle(data, aboutEntities = []) {
  const article = {
    "@type": "Article",
    "@id": `${data.pageUrl || data.brandDomain}#article`,
    "headline": data.pageTitle,
    "description": data.pageDescription || undefined,
    "image": data.pageImage || undefined,
    "datePublished": toISODateTime(data.datePublished),
    "dateModified": toISODateTime(data.dateModified),
  };

  if (data.authorName) {
    article.author = clean({
      "@type": "Person",
      "name": data.authorName,
      "url": data.authorUrl || undefined,
      "jobTitle": data.authorTitle || undefined,
      "worksFor": { "@id": `${data.brandDomain}/#organization` }
    });
  } else {
    article.author = { "@id": `${data.brandDomain}/#organization` };
  }

  article.publisher = { "@id": `${data.brandDomain}/#organization` };
  article.mainEntityOfPage = data.pageUrl || data.brandDomain;

  if (aboutEntities.length > 0) {
    article.about = aboutEntities.map(e => clean({
      "@type": "Thing",
      "name": e.name,
      "sameAs": e.sameAs || undefined
    }));
  }

  return article;
}

function buildWebSite(data) {
  const ws = {
    "@type": "WebSite",
    "@id": `${data.brandDomain}/#website`,
    "url": data.brandDomain,
    "name": data.brandName,
    "publisher": { "@id": `${data.brandDomain}/#organization` },
  };
  if (data.searchUrlTemplate) {
    ws.potentialAction = {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": data.searchUrlTemplate
      },
      "query-input": "required name=search_term_string"
    };
  }
  return ws;
}

function buildFAQ(data) {
  const questions = (data.faqs || []).filter(f => f.question && f.answer);
  if (questions.length === 0) return null;
  return {
    "@type": "FAQPage",
    "@id": `${data.pageUrl || data.brandDomain}#faqpage`,
    "mainEntity": questions.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };
}

// ========== SHARED HELPERS ==========

// Build breadcrumb from custom user fields, falling back to auto-generated items
function buildCustomBreadcrumb(data, defaultItems, breadcrumbId) {
  if (data.enableBreadcrumb === false) return null;

  // Check if user has custom breadcrumb values
  const hasCustom = data.breadcrumb1Name || data.breadcrumb2Name || data.breadcrumb3Name || data.breadcrumb4Name;

  if (hasCustom) {
    const items = [];
    if (data.breadcrumb1Name) items.push({ name: data.breadcrumb1Name, url: data.breadcrumb1Url });
    if (data.breadcrumb2Name) items.push({ name: data.breadcrumb2Name, url: data.breadcrumb2Url });
    if (data.breadcrumb3Name) items.push({ name: data.breadcrumb3Name, url: data.breadcrumb3Url });
    if (data.breadcrumb4Name) items.push({ name: data.breadcrumb4Name }); // Last item = current page, no URL
    return buildBreadcrumb(items, breadcrumbId);
  }

  // Fall back to auto-generated default
  return buildBreadcrumb(defaultItems, breadcrumbId);
}

// Optionally add FAQ to any graph if user has FAQ questions
function maybeAddFAQ(graph, data) {
  const faq = buildFAQ(data);
  if (faq) graph.push(faq);
}

// Collect about entities from topic fields
function collectAboutEntities(data) {
  const aboutEntities = [];
  if (data.topic1Name) aboutEntities.push({ name: data.topic1Name, sameAs: data.topic1Wiki });
  if (data.topic2Name) aboutEntities.push({ name: data.topic2Name, sameAs: data.topic2Wiki });
  return aboutEntities;
}

// ========== TEMPLATE GENERATORS ==========

export function generateHomepage(data) {
  const graph = [buildOrganization(data), buildWebSite(data)];

  // Breadcrumb
  const bc = buildCustomBreadcrumb(data, [
    { name: "Home" }
  ], `${data.brandDomain}/#breadcrumb`);
  if (bc) graph.push(bc);

  graph.push({
    "@type": "WebPage",
    "@id": `${data.brandDomain}/#webpage`,
    "url": data.brandDomain,
    "name": `${data.brandName}${data.brandDescription ? ' — ' + data.brandDescription : ''}`,
    "isPartOf": { "@id": `${data.brandDomain}/#website` },
    "about": { "@id": `${data.brandDomain}/#organization` },
    ...(bc ? { "breadcrumb": { "@id": `${data.brandDomain}/#breadcrumb` } } : {})
  });

  // FAQ
  maybeAddFAQ(graph, data);

  return clean({ "@context": "https://schema.org", "@graph": graph });
}

export function generateLocationPage(data) {
  const graph = [buildOrganization(data)];

  if (data.gbpStatus !== 'no-address') {
    graph.push(buildLocalBusiness(data));
  }

  // Breadcrumb
  const bcId = `${data.locationPageUrl || data.brandDomain}#breadcrumb`;
  const bc = buildCustomBreadcrumb(data, [
    { name: "Home", url: `${data.brandDomain}/` },
    { name: "Locations", url: `${data.brandDomain}/locations/` },
    { name: `${data.locationCity || ''} ${data.locationStateAbbr || ''}`.trim() }
  ], bcId);
  if (bc) graph.push(bc);

  // Article
  const aboutEntities = collectAboutEntities(data);
  if (data.locationCity && !aboutEntities.find(e => e.name?.includes(data.locationCity))) {
    aboutEntities.push({ name: `${data.locationCity}, ${data.locationState || ''}`, sameAs: data.locationWiki });
  }
  graph.push(buildArticle(data, aboutEntities));

  // FAQ
  maybeAddFAQ(graph, data);

  return clean({ "@context": "https://schema.org", "@graph": graph });
}

export function generateServicePage(data) {
  const graph = [buildOrganization(data)];

  graph.push(buildService(data));

  // Breadcrumb
  const bcId = `${data.servicePageUrl || data.brandDomain}#breadcrumb`;
  const bc = buildCustomBreadcrumb(data, [
    { name: "Home", url: `${data.brandDomain}/` },
    { name: "Services", url: `${data.brandDomain}/services/` },
    { name: data.serviceName || "Service" }
  ], bcId);
  if (bc) graph.push(bc);

  const aboutEntities = collectAboutEntities(data);
  if (data.serviceName && !aboutEntities.find(e => e.name === data.serviceName)) {
    aboutEntities.push({ name: data.serviceName, sameAs: data.serviceWiki });
  }
  graph.push(buildArticle(data, aboutEntities));

  // FAQ
  maybeAddFAQ(graph, data);

  return clean({ "@context": "https://schema.org", "@graph": graph });
}

export function generateServiceLocationCombo(data) {
  const graph = [buildOrganization(data)];

  if (data.gbpStatus !== 'no-address') {
    graph.push(buildLocalBusiness(data));
  }

  graph.push(buildService(data));

  // Breadcrumb
  const bcId = `${data.pageUrl || data.brandDomain}#breadcrumb`;
  const bc = buildCustomBreadcrumb(data, [
    { name: "Home", url: `${data.brandDomain}/` },
    { name: "Services", url: `${data.brandDomain}/services/` },
    { name: data.serviceName || "Service", url: data.servicePageUrl },
    { name: `${data.locationCity || ''} ${data.locationStateAbbr || ''}`.trim() }
  ], bcId);
  if (bc) graph.push(bc);

  const aboutEntities = collectAboutEntities(data);
  if (data.serviceName && !aboutEntities.find(e => e.name === data.serviceName)) {
    aboutEntities.push({ name: data.serviceName, sameAs: data.serviceWiki });
  }
  if (data.locationCity && !aboutEntities.find(e => e.name?.includes(data.locationCity))) {
    aboutEntities.push({ name: `${data.locationCity}, ${data.locationState || ''}`, sameAs: data.locationWiki });
  }
  graph.push(buildArticle(data, aboutEntities));

  // FAQ
  maybeAddFAQ(graph, data);

  return clean({ "@context": "https://schema.org", "@graph": graph });
}

export function generateMultiLocationHub(data) {
  const graph = [buildOrganization(data)];

  // Add each location
  (data.locations || []).forEach(loc => {
    if (loc.city) {
      graph.push(buildLocalBusiness(data, loc));
    }
  });

  // Breadcrumb
  const bcId = `${data.brandDomain}/locations/#breadcrumb`;
  const bc = buildCustomBreadcrumb(data, [
    { name: "Home", url: `${data.brandDomain}/` },
    { name: "Locations" }
  ], bcId);
  if (bc) graph.push(bc);

  graph.push(clean({
    "@type": "WebPage",
    "@id": `${data.brandDomain}/locations/#webpage`,
    "url": `${data.brandDomain}/locations/`,
    "name": `${data.brandName} Locations`,
    "description": `${data.brandName} service locations across the United States.`,
    "isPartOf": { "@id": `${data.brandDomain}/#website` },
    "about": { "@id": `${data.brandDomain}/#organization` },
    ...(bc ? { "breadcrumb": { "@id": bcId } } : {})
  }));

  // FAQ
  maybeAddFAQ(graph, data);

  return clean({ "@context": "https://schema.org", "@graph": graph });
}

export function generateBlogArticle(data) {
  const graph = [buildOrganization(data)];

  // Breadcrumb
  const bcId = `${data.pageUrl || data.brandDomain}#breadcrumb`;
  const bc = buildCustomBreadcrumb(data, [
    { name: "Home", url: `${data.brandDomain}/` },
    { name: data.blogSectionName || "Blog", url: `${data.brandDomain}/${data.blogSectionSlug || 'blog'}/` },
    { name: data.pageTitle || "Article" }
  ], bcId);
  if (bc) graph.push(bc);

  const aboutEntities = collectAboutEntities(data);
  graph.push(buildArticle(data, aboutEntities));

  // FAQ
  maybeAddFAQ(graph, data);

  return clean({ "@context": "https://schema.org", "@graph": graph });
}

export function generateFaqPage(data) {
  const graph = [buildOrganization(data)];

  // Breadcrumb
  const bcId = `${data.pageUrl || data.brandDomain}#breadcrumb`;
  const bc = buildCustomBreadcrumb(data, [
    { name: "Home", url: `${data.brandDomain}/` },
    { name: data.faqSectionName || "FAQ", url: `${data.brandDomain}/${data.faqSectionSlug || 'faq'}/` },
    { name: data.pageTitle || "FAQ" }
  ], bcId);
  if (bc) graph.push(bc);

  // FAQ (always included for the FAQ template)
  maybeAddFAQ(graph, data);

  const aboutEntities = collectAboutEntities(data);
  graph.push(buildArticle(data, aboutEntities));

  return clean({ "@context": "https://schema.org", "@graph": graph });
}

// For Organization-only (no-GBP businesses)
export function generateOrganizationOnly(data) {
  const graph = [buildOrganization(data), buildWebSite(data)];

  // Add services if provided
  if (data.serviceName) {
    graph.push(buildService(data));
  }

  // Breadcrumb
  const bc = buildCustomBreadcrumb(data, [
    { name: "Home" }
  ], `${data.brandDomain}/#breadcrumb`);
  if (bc) graph.push(bc);

  graph.push({
    "@type": "WebPage",
    "@id": `${data.brandDomain}/#webpage`,
    "url": data.brandDomain,
    "name": data.brandName,
    "isPartOf": { "@id": `${data.brandDomain}/#website` },
    "about": { "@id": `${data.brandDomain}/#organization` },
    ...(bc ? { "breadcrumb": { "@id": `${data.brandDomain}/#breadcrumb` } } : {})
  });

  // FAQ
  maybeAddFAQ(graph, data);

  return clean({ "@context": "https://schema.org", "@graph": graph });
}

// Template registry
export const TEMPLATES = [
  {
    id: 'homepage',
    name: 'Homepage',
    description: 'Organization + WebSite + WebPage — for your main homepage',
    icon: '🏠',
    generate: generateHomepage,
    requiresLocation: false,
    requiresService: false,
  },
  {
    id: 'location',
    name: 'Location Page',
    description: 'LocalBusiness + BreadcrumbList + Article — for individual city/location pages',
    icon: '📍',
    generate: generateLocationPage,
    requiresLocation: true,
    requiresService: false,
  },
  {
    id: 'service',
    name: 'Service Page',
    description: 'Service + BreadcrumbList + Article — for individual service pages',
    icon: '🔧',
    generate: generateServicePage,
    requiresLocation: false,
    requiresService: true,
  },
  {
    id: 'service-location',
    name: 'Service + Location Combo',
    description: 'LocalBusiness + Service + BreadcrumbList + Article — for "service in city" pages',
    icon: '📍🔧',
    generate: generateServiceLocationCombo,
    requiresLocation: true,
    requiresService: true,
  },
  {
    id: 'multi-location',
    name: 'Multi-Location Hub',
    description: 'Organization + multiple LocalBusiness entities — for your locations index page',
    icon: '🗺️',
    generate: generateMultiLocationHub,
    requiresLocation: true,
    requiresService: false,
    multiLocation: true,
  },
  {
    id: 'blog',
    name: 'Blog / Resource Article',
    description: 'Article + BreadcrumbList — for blog posts and resource pages',
    icon: '📝',
    generate: generateBlogArticle,
    requiresLocation: false,
    requiresService: false,
  },
  {
    id: 'faq',
    name: 'FAQ Page',
    description: 'FAQPage + Article + BreadcrumbList — for FAQ and Q&A pages',
    icon: '❓',
    generate: generateFaqPage,
    requiresLocation: false,
    requiresService: false,
  },
  {
    id: 'org-only',
    name: 'Organization Only (No GBP)',
    description: 'Organization + WebSite + Service — for online-only businesses without physical addresses',
    icon: '🌐',
    generate: generateOrganizationOnly,
    requiresLocation: false,
    requiresService: true,
  },
];
