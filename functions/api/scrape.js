// Cloudflare Pages Function — server-side URL scraper
// Endpoint: POST /api/scrape  { url: "https://..." }

export async function onRequestPost(context) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const body = await context.request.json();
    const url = body.url?.trim();

    if (!url) {
      return new Response(JSON.stringify({ success: false, error: 'URL is required' }), { status: 400, headers });
    }

    // Validate URL
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return new Response(JSON.stringify({ success: false, error: 'Invalid URL format' }), { status: 400, headers });
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return new Response(JSON.stringify({ success: false, error: 'URL must be http or https' }), { status: 400, headers });
    }

    // Fetch the page
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let response;
    try {
      response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SchemaGenerator/1.0; +https://schema-generator.pages.dev)',
          'Accept': 'text/html,application/xhtml+xml',
        },
        redirect: 'follow',
      });
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        return new Response(JSON.stringify({ success: false, error: 'Request timed out (10s limit)' }), { status: 504, headers });
      }
      return new Response(JSON.stringify({ success: false, error: `Failed to fetch URL: ${err.message}` }), { status: 502, headers });
    }
    clearTimeout(timeout);

    if (!response.ok) {
      return new Response(JSON.stringify({ success: false, error: `URL returned HTTP ${response.status}` }), { status: 502, headers });
    }

    const html = await response.text();

    // Extract metadata
    const data = extractMetadata(html, url);

    return new Response(JSON.stringify({ success: true, data }), { status: 200, headers });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Internal error' }), { status: 500, headers });
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// ─── Extraction helpers ───

function extractMetadata(html, inputUrl) {
  const result = {
    pageTitle: '',
    pageDescription: '',
    pageUrl: '',
    pageImage: '',
    datePublished: '',
    dateModified: '',
    authorName: '',
    authorUrl: '',
    authorTitle: '',
    topic1Name: '',
    topic2Name: '',
    faqs: [],
  };

  // ── Meta tags ──
  const metas = extractAllMeta(html);

  // pageTitle: og:title > <title> > first <h1>
  result.pageTitle =
    metas['og:title'] ||
    extractTag(html, 'title') ||
    extractFirst(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
    '';
  result.pageTitle = stripHtml(result.pageTitle).trim();

  // pageDescription: og:description > meta description
  result.pageDescription =
    metas['og:description'] ||
    metas['description'] ||
    '';
  result.pageDescription = stripHtml(result.pageDescription).trim();

  // pageUrl: canonical > input URL
  result.pageUrl = extractCanonical(html) || inputUrl;

  // pageImage: og:image
  result.pageImage = metas['og:image'] || '';

  // datePublished: article:published_time > JSON-LD > <time>
  result.datePublished =
    normalizeDate(metas['article:published_time']) ||
    normalizeDate(extractJsonLdField(html, 'datePublished')) ||
    normalizeDate(extractTimeElement(html)) ||
    '';

  // dateModified: article:modified_time > JSON-LD
  result.dateModified =
    normalizeDate(metas['article:modified_time']) ||
    normalizeDate(extractJsonLdField(html, 'dateModified')) ||
    '';

  // authorName: article:author > JSON-LD author
  const jsonLdAuthor = extractJsonLdAuthor(html);
  result.authorName = metas['article:author'] || jsonLdAuthor.name || '';
  result.authorUrl = jsonLdAuthor.url || '';
  result.authorTitle = jsonLdAuthor.jobTitle || '';

  // Topics: article:tag > meta keywords > JSON-LD about
  const topics = extractTopics(html, metas);
  result.topic1Name = topics[0] || '';
  result.topic2Name = topics[1] || '';

  // FAQs: JSON-LD FAQPage
  result.faqs = extractFaqs(html);

  return result;
}

function extractAllMeta(html) {
  const metas = {};
  // Match <meta property="..." content="..."> and <meta name="..." content="...">
  const regex = /<meta\s+(?:[^>]*?\s)?(?:property|name)\s*=\s*["']([^"']+)["'][^>]*?\scontent\s*=\s*["']([^"']*)["'][^>]*?\/?>/gi;
  let m;
  while ((m = regex.exec(html)) !== null) {
    metas[m[1].toLowerCase()] = m[2];
  }
  // Also match reverse order: content before property/name
  const regex2 = /<meta\s+(?:[^>]*?\s)?content\s*=\s*["']([^"']*)["'][^>]*?\s(?:property|name)\s*=\s*["']([^"']+)["'][^>]*?\/?>/gi;
  while ((m = regex2.exec(html)) !== null) {
    if (!metas[m[2].toLowerCase()]) {
      metas[m[2].toLowerCase()] = m[1];
    }
  }
  return metas;
}

function extractTag(html, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = html.match(regex);
  return match ? match[1] : '';
}

function extractFirst(html, regex) {
  const match = html.match(regex);
  return match ? match[1] : '';
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]*\srel\s*=\s*["']canonical["'][^>]*\shref\s*=\s*["']([^"']+)["'][^>]*\/?>/i);
  if (match) return match[1];
  // Reverse order
  const match2 = html.match(/<link[^>]*\shref\s*=\s*["']([^"']+)["'][^>]*\srel\s*=\s*["']canonical["'][^>]*\/?>/i);
  return match2 ? match2[1] : '';
}

function extractTimeElement(html) {
  const match = html.match(/<time[^>]*\sdatetime\s*=\s*["']([^"']+)["'][^>]*>/i);
  return match ? match[1] : '';
}

function stripHtml(str) {
  return str.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ');
}

function normalizeDate(str) {
  if (!str) return '';
  try {
    const d = new Date(str);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  } catch {
    return '';
  }
}

// ── JSON-LD extraction ──

function findJsonLdBlocks(html) {
  const blocks = [];
  const regex = /<script\s+type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = regex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1]);
      blocks.push(parsed);
    } catch {}
  }
  return blocks;
}

function extractJsonLdField(html, field) {
  const blocks = findJsonLdBlocks(html);
  for (const block of blocks) {
    // Check @graph array
    if (block['@graph'] && Array.isArray(block['@graph'])) {
      for (const entity of block['@graph']) {
        if (entity[field]) return entity[field];
      }
    }
    // Check top level
    if (block[field]) return block[field];
  }
  return '';
}

function extractJsonLdAuthor(html) {
  const blocks = findJsonLdBlocks(html);
  for (const block of blocks) {
    const entities = block['@graph'] || [block];
    for (const entity of entities) {
      if (entity.author) {
        const author = Array.isArray(entity.author) ? entity.author[0] : entity.author;
        if (typeof author === 'string') return { name: author, url: '', jobTitle: '' };
        if (typeof author === 'object') {
          return {
            name: author.name || '',
            url: author.url || '',
            jobTitle: author.jobTitle || '',
          };
        }
      }
    }
  }
  return { name: '', url: '', jobTitle: '' };
}

function extractTopics(html, metas) {
  const topics = [];

  // 1. article:tag (can be multiple)
  const tagRegex = /<meta\s+(?:[^>]*?\s)?(?:property)\s*=\s*["']article:tag["'][^>]*?\scontent\s*=\s*["']([^"']*)["'][^>]*?\/?>/gi;
  let m;
  while ((m = tagRegex.exec(html)) !== null) {
    if (m[1].trim() && topics.length < 2) topics.push(m[1].trim());
  }
  if (topics.length >= 2) return topics;

  // 2. meta keywords (first 2)
  if (metas['keywords']) {
    const kws = metas['keywords'].split(',').map(k => k.trim()).filter(Boolean);
    for (const kw of kws) {
      if (topics.length < 2 && !topics.includes(kw)) topics.push(kw);
    }
  }
  if (topics.length >= 2) return topics;

  // 3. JSON-LD about entities
  const blocks = findJsonLdBlocks(html);
  for (const block of blocks) {
    const entities = block['@graph'] || [block];
    for (const entity of entities) {
      if (entity.about) {
        const aboutList = Array.isArray(entity.about) ? entity.about : [entity.about];
        for (const a of aboutList) {
          const name = typeof a === 'string' ? a : a.name || '';
          if (name && topics.length < 2 && !topics.includes(name)) topics.push(name);
        }
      }
    }
  }

  return topics;
}

function extractFaqs(html) {
  const faqs = [];
  const blocks = findJsonLdBlocks(html);

  for (const block of blocks) {
    const entities = block['@graph'] || [block];
    for (const entity of entities) {
      if (entity['@type'] === 'FAQPage' && entity.mainEntity) {
        const questions = Array.isArray(entity.mainEntity) ? entity.mainEntity : [entity.mainEntity];
        for (const q of questions) {
          if (q.name && q.acceptedAnswer) {
            const answer = typeof q.acceptedAnswer === 'string'
              ? q.acceptedAnswer
              : q.acceptedAnswer.text || '';
            if (q.name && answer) {
              faqs.push({ question: stripHtml(q.name).trim(), answer: stripHtml(answer).trim() });
            }
          }
        }
      }
    }
  }

  return faqs;
}
