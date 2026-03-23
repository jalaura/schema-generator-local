// Schema validation engine
// Checks JSON syntax, required fields, formats, and best practices

const URL_REGEX = /^https?:\/\/.+/;
const PHONE_REGEX = /^\+\d{10,15}$/;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/;

export function validateSchema(json, templateId) {
  const errors = [];
  const warnings = [];

  if (!json || typeof json !== 'object') {
    errors.push({ field: 'root', message: 'Generated schema is empty or invalid' });
    return { errors, warnings, score: 0 };
  }

  // Check @context
  if (json['@context'] !== 'https://schema.org') {
    errors.push({ field: '@context', message: 'Missing or invalid @context — must be "https://schema.org"' });
  }

  // Check @graph exists
  if (!json['@graph'] || !Array.isArray(json['@graph'])) {
    errors.push({ field: '@graph', message: 'Missing @graph array' });
    return { errors, warnings, score: 0 };
  }

  const graph = json['@graph'];

  // Validate each entity in the graph
  graph.forEach((entity, i) => {
    const rawType = entity['@type'];
    // Handle array @type (e.g. ["RoofingContractor", "LocalBusiness"])
    const type = Array.isArray(rawType) ? rawType[0] : rawType;
    // Show additionalType in the label when present (e.g. "LocalBusiness (FlooringContractor)")
    const additionalType = entity['additionalType'];
    const additionalLabel = additionalType && typeof additionalType === 'string'
      ? additionalType.replace('https://schema.org/', '')
      : null;
    const typeLabel = Array.isArray(rawType)
      ? rawType.join(', ')
      : (additionalLabel ? `${rawType} (${additionalLabel})` : rawType);
    const prefix = typeLabel || 'Unknown entity';

    if (!rawType) {
      errors.push({ field: prefix, message: 'Missing @type property' });
      return;
    }

    // Check @id exists
    const skipIdTypes = ['BreadcrumbList', 'OpeningHoursSpecification'];
    const hasSkipType = Array.isArray(rawType) ? rawType.some(t => skipIdTypes.includes(t)) : skipIdTypes.includes(rawType);
    if (!entity['@id'] && !hasSkipType) {
      warnings.push({ field: prefix, message: 'Missing identifier — this is auto-generated when you fill in the Website URL' });
    }

    // Check if this is a homepage entity using a specific business type (e.g. FlooringContractor)
    // on the Organization @id — validate as Organization, not LocalBusiness
    const isHomepageHybrid = entity['@id'] && entity['@id'].includes('#organization')
      && type !== 'Organization' && type !== 'WebSite' && type !== 'WebPage'
      && type !== 'Article' && type !== 'BreadcrumbList' && type !== 'FAQPage' && type !== 'Service';

    // Type-specific validation
    if (isHomepageHybrid) {
      // Homepage with specific business type — validate as Organization
      validateOrganization(entity, prefix, errors, warnings);
    } else if (type === 'Organization') {
      validateOrganization(entity, prefix, errors, warnings);
    } else if (type === 'WebSite') {
      validateWebSite(entity, prefix, errors, warnings);
    } else if (type === 'WebPage') {
      validateWebPage(entity, prefix, errors, warnings);
    } else if (['Article', 'BlogPosting', 'NewsArticle'].includes(type)) {
      validateArticle(entity, prefix, errors, warnings);
    } else if (type === 'BreadcrumbList') {
      validateBreadcrumb(entity, prefix, errors, warnings);
    } else if (type === 'FAQPage') {
      validateFAQ(entity, prefix, errors, warnings);
    } else if (type === 'Service') {
      validateService(entity, prefix, errors, warnings);
    } else {
      // Assume LocalBusiness subtype
      validateLocalBusiness(entity, prefix, errors, warnings);
    }
  });

  // Calculate completeness score — softer penalties (errors still strong, warnings lighter)
  let score = Math.max(0, Math.round(100 - (errors.length * 12 + warnings.length * 3)));

  // Bonus scoring for enhanced schema completeness — applies to ALL templates
  let bonus = 0;
  const firstEntity = graph[0];
  const rawType = firstEntity?.['@type'];
  const primaryType = Array.isArray(rawType) ? rawType[0] : rawType;
  const isSpecificType = primaryType && primaryType !== 'Organization' && primaryType !== 'LocalBusiness';

  // Business Type specified (not generic Organization/LocalBusiness): +5%
  if (isSpecificType) bonus += 5;

  // Find the LocalBusiness entity in the graph (if any)
  const lbEntity = graph.find(e => {
    const t = e?.['@type'];
    return t === 'LocalBusiness' || (Array.isArray(t) && t.includes('LocalBusiness') && e['@id']?.includes('#localbusiness'));
  });
  // Use the primary entity (org or LB) for bonus checks
  const bizEntity = lbEntity || firstEntity;

  // Geo coordinates filled: +5%
  if (bizEntity?.geo) bonus += 5;

  // Opening hours filled: +3%
  if (bizEntity?.openingHoursSpecification) bonus += 3;

  // At least 3 services in hasOfferCatalog: +5%
  if (bizEntity?.hasOfferCatalog?.itemListElement?.length >= 3) bonus += 5;

  // areaServed filled: +3%
  if (bizEntity?.areaServed) bonus += 3;

  // aggregateRating filled: +4%
  if (bizEntity?.aggregateRating) bonus += 4;

  // Homepage/org-only specific: topic entities with Wikipedia URLs
  if (templateId === 'homepage' || templateId === 'org-only') {
    const aboutEntities = firstEntity?.about;
    if (Array.isArray(aboutEntities) && aboutEntities.filter(e => e.sameAs).length >= 3) bonus += 3;
  }

  // Social profiles present: +2%
  if (firstEntity?.sameAs?.length >= 2) bonus += 2;

  // AI-critical social profiles (Foursquare, Apple Business Connect, Wikidata): +2%
  const allSameAs = (firstEntity?.sameAs || []).concat(bizEntity?.sameAs || []);
  const hasAiProfiles = allSameAs.some(u => u?.includes('foursquare.com') || u?.includes('wikidata.org') || u?.includes('maps.apple.com'));
  if (hasAiProfiles) bonus += 2;

  // Article author has sameAs (E-E-A-T): +2%
  const articleEntity = graph.find(e => e?.['@type'] === 'Article');
  if (articleEntity?.author?.sameAs?.length > 0) bonus += 2;

  // Article has wordCount: +1%
  if (articleEntity?.wordCount) bonus += 1;

  score += bonus;

  return { errors, warnings, score: Math.min(100, score) };
}

function validateOrganization(entity, prefix, errors, warnings) {
  if (!entity.name) errors.push({ field: `${prefix}.name`, message: 'Organization name is required' });
  if (!entity.url) warnings.push({ field: `${prefix}.url`, message: 'Organization URL is recommended' });
  if (entity.url && !URL_REGEX.test(entity.url)) errors.push({ field: `${prefix}.url`, message: 'URL must start with http:// or https://' });
  if (!entity.logo) warnings.push({ field: `${prefix}.logo`, message: 'Logo is recommended for brand recognition' });
  if (!entity.telephone) warnings.push({ field: `${prefix}.telephone`, message: 'Phone number is recommended' });
  if (entity.telephone && !PHONE_REGEX.test(entity.telephone)) warnings.push({ field: `${prefix}.telephone`, message: 'Phone should be international format: +1 followed by 10 digits (e.g. +18005551234)' });
  if (!entity.sameAs || entity.sameAs.length === 0) warnings.push({ field: `${prefix}.sameAs`, message: 'Social profile links are recommended — add them in the Social Profiles section' });
  if (entity.sameAs) {
    entity.sameAs.forEach((url, j) => {
      if (!URL_REGEX.test(url)) errors.push({ field: `${prefix}.sameAs[${j}]`, message: `Invalid sameAs URL: "${url}"` });
    });
  }
}

function validateLocalBusiness(entity, prefix, errors, warnings) {
  if (!entity.name) errors.push({ field: `${prefix}.name`, message: 'Business name is required' });
  if (!entity.address) errors.push({ field: `${prefix}.address`, message: 'Address is required for LocalBusiness (use Organization for no-address businesses)' });
  if (entity.address && !entity.address.addressLocality) errors.push({ field: `${prefix}.address.addressLocality`, message: 'City/locality is required in address' });
  if (!entity.telephone) warnings.push({ field: `${prefix}.telephone`, message: 'Phone number is recommended' });
  if (!entity.geo) warnings.push({ field: `${prefix}.geo`, message: 'Geo coordinates (lat/lng) are recommended for map accuracy' });
  if (!entity.openingHoursSpecification) warnings.push({ field: `${prefix}`, message: 'Business hours are recommended — open the Business Hours section to add them' });
  if (!entity.image) warnings.push({ field: `${prefix}.image`, message: 'Business image is recommended' });
  if (!entity.areaServed) warnings.push({ field: `${prefix}`, message: 'Area served is recommended — fill in Location Details to add it' });
  const entityType = entity['@type'];
  const isGenericLB = entityType === 'LocalBusiness' || (Array.isArray(entityType) && entityType.length === 1 && entityType[0] === 'LocalBusiness');
  if (isGenericLB) {
    warnings.push({ field: `${prefix}.@type`, message: 'Consider using a more specific subtype (e.g., Plumber, Restaurant, Dentist) instead of generic LocalBusiness' });
  }
}

function validateWebSite(entity, prefix, errors, warnings) {
  if (!entity.url) errors.push({ field: `${prefix}.url`, message: 'WebSite URL is required' });
  if (!entity.name) warnings.push({ field: `${prefix}.name`, message: 'WebSite name is recommended' });
  if (!entity.publisher) warnings.push({ field: `${prefix}.publisher`, message: 'Publisher reference is recommended' });
}

function validateWebPage(entity, prefix, errors, warnings) {
  if (!entity.url) warnings.push({ field: `${prefix}.url`, message: 'WebPage URL is recommended' });
  if (!entity.name) warnings.push({ field: `${prefix}.name`, message: 'WebPage name is recommended' });
}

function validateArticle(entity, prefix, errors, warnings) {
  if (!entity.headline) errors.push({ field: `${prefix}.headline`, message: 'Article headline is required' });
  if (entity.headline && entity.headline.length > 110) warnings.push({ field: `${prefix}.headline`, message: 'Headline exceeds 110 characters — may be truncated' });
  if (!entity.datePublished) warnings.push({ field: `${prefix}.datePublished`, message: 'Published date is recommended' });
  if (entity.datePublished && !ISO_DATE_REGEX.test(entity.datePublished)) errors.push({ field: `${prefix}.datePublished`, message: 'Date must be ISO 8601 format (YYYY-MM-DDTHH:MM:SS)' });
  if (!entity.dateModified) warnings.push({ field: `${prefix}.dateModified`, message: 'Modified date is recommended — signals freshness to search engines and AI' });
  if (!entity.author) warnings.push({ field: `${prefix}.author`, message: 'Author is recommended — helps Google trust your content (E-E-A-T)' });
  if (!entity.image) warnings.push({ field: `${prefix}.image`, message: 'Article image is recommended (min 1200px wide)' });
}

function validateBreadcrumb(entity, prefix, errors, warnings) {
  if (!entity.itemListElement || entity.itemListElement.length === 0) {
    errors.push({ field: `${prefix}.itemListElement`, message: 'Breadcrumb must have at least one item' });
  }
  if (entity.itemListElement) {
    entity.itemListElement.forEach((item, j) => {
      if (!item.name) errors.push({ field: `${prefix}.itemListElement[${j}].name`, message: 'Breadcrumb item name is required' });
      if (typeof item.position !== 'number') errors.push({ field: `${prefix}.itemListElement[${j}].position`, message: 'Breadcrumb position must be a number' });
    });
  }
}

function validateFAQ(entity, prefix, errors, warnings) {
  if (!entity.mainEntity || entity.mainEntity.length === 0) {
    errors.push({ field: `${prefix}.mainEntity`, message: 'FAQPage must have at least one question' });
  }
  if (entity.mainEntity) {
    entity.mainEntity.forEach((q, j) => {
      if (!q.name) errors.push({ field: `${prefix}.mainEntity[${j}].name`, message: `FAQ question ${j + 1} text is required` });
      if (!q.acceptedAnswer || !q.acceptedAnswer.text) errors.push({ field: `${prefix}.mainEntity[${j}].acceptedAnswer`, message: `FAQ answer ${j + 1} text is required` });
    });
  }
  if (entity.mainEntity && entity.mainEntity.length < 3) {
    warnings.push({ field: prefix, message: 'Consider adding at least 3-5 FAQ questions for better coverage' });
  }
}

function validateService(entity, prefix, errors, warnings) {
  if (!entity.name) errors.push({ field: `${prefix}.name`, message: 'Service name is required' });
  if (!entity.description) warnings.push({ field: `${prefix}.description`, message: 'Service description is recommended' });
  if (!entity.provider) warnings.push({ field: `${prefix}.provider`, message: 'Service provider is recommended' });
  if (!entity.areaServed) warnings.push({ field: `${prefix}.areaServed`, message: 'Area served is recommended for local services' });
}

// JSON syntax highlighting for the preview
export function syntaxHighlight(json) {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, null, 2);
  }
  return json
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
}
