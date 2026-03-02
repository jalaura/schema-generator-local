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
    const type = entity['@type'];
    const prefix = `@graph[${i}] (${type || 'unknown'})`;

    if (!type) {
      errors.push({ field: prefix, message: 'Missing @type property' });
      return;
    }

    // Check @id exists
    if (!entity['@id'] && !['BreadcrumbList', 'OpeningHoursSpecification'].includes(type)) {
      warnings.push({ field: prefix, message: 'Missing @id — recommended for entity linking' });
    }

    // Type-specific validation
    switch (type) {
      case 'Organization':
        validateOrganization(entity, prefix, errors, warnings);
        break;
      case 'WebSite':
        validateWebSite(entity, prefix, errors, warnings);
        break;
      case 'WebPage':
        validateWebPage(entity, prefix, errors, warnings);
        break;
      case 'Article':
      case 'BlogPosting':
      case 'NewsArticle':
        validateArticle(entity, prefix, errors, warnings);
        break;
      case 'BreadcrumbList':
        validateBreadcrumb(entity, prefix, errors, warnings);
        break;
      case 'FAQPage':
        validateFAQ(entity, prefix, errors, warnings);
        break;
      case 'Service':
        validateService(entity, prefix, errors, warnings);
        break;
      default:
        // Assume LocalBusiness subtype
        validateLocalBusiness(entity, prefix, errors, warnings);
        break;
    }
  });

  // Calculate completeness score
  const maxErrors = Math.max(errors.length + warnings.length, 1);
  const score = Math.max(0, Math.round(100 - (errors.length * 15 + warnings.length * 5)));

  return { errors, warnings, score: Math.min(100, score) };
}

function validateOrganization(entity, prefix, errors, warnings) {
  if (!entity.name) errors.push({ field: `${prefix}.name`, message: 'Organization name is required' });
  if (!entity.url) warnings.push({ field: `${prefix}.url`, message: 'Organization URL is recommended' });
  if (entity.url && !URL_REGEX.test(entity.url)) errors.push({ field: `${prefix}.url`, message: 'URL must start with http:// or https://' });
  if (!entity.logo) warnings.push({ field: `${prefix}.logo`, message: 'Logo is recommended for brand recognition' });
  if (!entity.telephone) warnings.push({ field: `${prefix}.telephone`, message: 'Phone number is recommended' });
  if (entity.telephone && !PHONE_REGEX.test(entity.telephone)) warnings.push({ field: `${prefix}.telephone`, message: 'Phone should be E.164 format: +1XXXXXXXXXX' });
  if (!entity.sameAs || entity.sameAs.length === 0) warnings.push({ field: `${prefix}.sameAs`, message: 'sameAs links to social profiles are recommended for entity signals' });
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
  if (!entity.openingHoursSpecification) warnings.push({ field: `${prefix}.openingHoursSpecification`, message: 'Business hours are recommended' });
  if (!entity.image) warnings.push({ field: `${prefix}.image`, message: 'Business image is recommended' });
  if (!entity.priceRange) warnings.push({ field: `${prefix}.priceRange`, message: 'Price range ($-$$$$) is recommended' });
  if (!entity.areaServed) warnings.push({ field: `${prefix}.areaServed`, message: 'areaServed is recommended for local SEO signals' });
  if (entity['@type'] === 'LocalBusiness') {
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
  if (!entity.author) warnings.push({ field: `${prefix}.author`, message: 'Author is recommended for E-E-A-T signals' });
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
