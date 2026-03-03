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

  // ── Strategy 1: JSON-LD FAQPage schema (highest confidence) ──
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
  if (faqs.length > 0) return faqs;

  // ── Strategy 2: FAQ accordion / toggle patterns ──
  // Common patterns: <details><summary>Q</summary>A</details>
  const detailsRegex = /<details[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi;
  let m;
  while ((m = detailsRegex.exec(html)) !== null) {
    const q = stripHtml(m[1]).trim();
    const a = stripHtml(m[2]).trim();
    if (q && a && q.length > 5 && a.length > 5) {
      faqs.push({ question: q, answer: a });
    }
  }
  if (faqs.length > 0) return faqs;

  // ── Strategy 3: FAQ-specific class/id containers ──
  // Look for sections with FAQ-related classes or IDs, then extract heading + content pairs
  // Match containers like <div class="faq-item">, <div class="accordion-item">, etc.
  const faqContainerRegex = /<(?:div|section|li)[^>]*(?:class|id)\s*=\s*["'][^"']*(?:faq[-_]?(?:item|entry|block|question|row|card)|accordion[-_]?(?:item|entry|block|panel|section))[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|section|li)>/gi;
  while ((m = faqContainerRegex.exec(html)) !== null) {
    const block = m[1];
    // Extract heading (h2-h6, strong, .question, button) as question
    const qMatch = block.match(/<(?:h[2-6]|strong|button)[^>]*>([\s\S]*?)<\/(?:h[2-6]|strong|button)>/i);
    if (qMatch) {
      const q = stripHtml(qMatch[1]).trim();
      // Everything after the heading element is the answer
      const afterQ = block.substring(block.indexOf(qMatch[0]) + qMatch[0].length);
      const a = stripHtml(afterQ).trim();
      if (q && a && q.length > 5 && a.length > 5) {
        faqs.push({ question: q, answer: truncateAnswer(a) });
      }
    }
  }
  if (faqs.length > 0) return faqs;

  // ── Strategy 4: Question-marked headings followed by content ──
  // Look for h2/h3 headings that end with "?" followed by paragraph content
  const headingQRegex = /<(h[2-4])[^>]*>([\s\S]*?\?)\s*<\/\1>\s*([\s\S]*?)(?=<(?:h[2-4])[^>]*>|<\/(?:article|section|main|div\s+class))/gi;
  while ((m = headingQRegex.exec(html)) !== null) {
    const q = stripHtml(m[2]).trim();
    // Extract text from the answer block (paragraphs, lists, etc.)
    const answerHtml = m[3];
    const a = stripHtml(answerHtml).trim();
    if (q && a && q.length > 10 && a.length > 10 && isLikelyQuestion(q)) {
      faqs.push({ question: q, answer: truncateAnswer(a) });
    }
  }
  if (faqs.length > 0) return faqs;

  // ── Strategy 5: Elementor / WP accordion widgets ──
  // Elementor: <div class="elementor-toggle-item">
  //   <div class="elementor-toggle-title">Q</div>
  //   <div class="elementor-toggle-content">A</div>
  const elementorRegex = /<[^>]*class\s*=\s*["'][^"']*elementor-(?:toggle|accordion)-title[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>\s*<[^>]*class\s*=\s*["'][^"']*elementor-(?:toggle|accordion)-content[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/gi;
  while ((m = elementorRegex.exec(html)) !== null) {
    const q = stripHtml(m[1]).trim();
    const a = stripHtml(m[2]).trim();
    if (q && a && q.length > 5 && a.length > 5) {
      faqs.push({ question: q, answer: truncateAnswer(a) });
    }
  }
  if (faqs.length > 0) return faqs;

  // ── Strategy 6: ARIA-based accordions ──
  // <button aria-expanded="true/false">Q</button> followed by <div role="region">A</div>
  const ariaRegex = /<button[^>]*aria-(?:expanded|controls)[^>]*>([\s\S]*?)<\/button>\s*<(?:div|section)[^>]*(?:role\s*=\s*["']region["']|aria-labelledby|class\s*=\s*["'][^"']*(?:panel|content|answer|collapse)[^"']*["'])[^>]*>([\s\S]*?)<\/(?:div|section)>/gi;
  while ((m = ariaRegex.exec(html)) !== null) {
    const q = stripHtml(m[1]).trim();
    const a = stripHtml(m[2]).trim();
    if (q && a && q.length > 5 && a.length > 5) {
      faqs.push({ question: q, answer: truncateAnswer(a) });
    }
  }
  if (faqs.length > 0) return faqs;

  // ── Strategy 7: Plain article subheadings as FAQ candidates ──
  // For articles with no FAQ section at all — scan h2/h3 headings and
  // use question-like ones (or all of them) as FAQ Q&A pairs.
  // The content between one heading and the next becomes the answer.
  const articleHtml = extractArticleBody(html);
  const headingPairRegex = /<(h[23])[^>]*>([\s\S]*?)<\/\1>([\s\S]*?)(?=<h[23][^>]*>|$)/gi;
  const candidateFaqs = [];
  while ((m = headingPairRegex.exec(articleHtml)) !== null) {
    const q = stripHtml(m[2]).trim();
    const rawAnswer = m[3];
    // Only extract text from <p>, <ul>, <ol>, <li> tags for a clean answer
    const a = extractParagraphText(rawAnswer);
    if (q && a && q.length > 10 && a.length > 20) {
      // Prefer question-like headings, but accept informational ones too
      // Rewrite non-question headings into question form
      const question = isLikelyQuestion(q) ? q : rewriteAsQuestion(q);
      if (question) {
        candidateFaqs.push({ question, answer: truncateAnswer(a) });
      }
    }
  }
  // Only return if we found at least 2 plausible Q&A pairs (avoids false positives)
  // Cap at 10 to keep schema reasonable
  if (candidateFaqs.length >= 2) {
    return candidateFaqs.slice(0, 10);
  }

  return faqs;
}

// Helper: check if text looks like a question
function isLikelyQuestion(text) {
  const lower = text.toLowerCase();
  return lower.endsWith('?') ||
    lower.startsWith('what ') || lower.startsWith('how ') ||
    lower.startsWith('why ') || lower.startsWith('when ') ||
    lower.startsWith('where ') || lower.startsWith('who ') ||
    lower.startsWith('can ') || lower.startsWith('is ') ||
    lower.startsWith('do ') || lower.startsWith('does ') ||
    lower.startsWith('should ') || lower.startsWith('will ') ||
    lower.startsWith('are ');
}

// Helper: extract the main article/content body area to avoid nav/footer noise
function extractArticleBody(html) {
  // Try <article>, <main>, or common content containers
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) return articleMatch[1];

  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) return mainMatch[1];

  // Common CMS content wrappers
  const contentMatch = html.match(/<div[^>]*class\s*=\s*["'][^"']*(?:entry-content|post-content|article-content|content-area|single-content|blog-content|page-content)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  if (contentMatch) return contentMatch[1];

  // Fallback: return everything between </header> and <footer>
  const bodyMatch = html.match(/<\/header>([\s\S]*?)<footer/i);
  if (bodyMatch) return bodyMatch[1];

  return html;
}

// Helper: extract clean text from paragraph and list elements only
function extractParagraphText(html) {
  const parts = [];
  const pRegex = /<(?:p|li)[^>]*>([\s\S]*?)<\/(?:p|li)>/gi;
  let m;
  while ((m = pRegex.exec(html)) !== null) {
    const text = stripHtml(m[1]).trim();
    if (text.length > 5) parts.push(text);
  }
  return parts.join(' ').trim();
}

// Helper: rewrite an informational heading into a question
function rewriteAsQuestion(heading) {
  const lower = heading.toLowerCase();

  // Skip generic headings that don't make good FAQs
  const skip = ['conclusion', 'summary', 'table of contents', 'references',
    'sources', 'about the author', 'related posts', 'share this',
    'final thoughts', 'key takeaways', 'introduction', 'overview'];
  if (skip.some(s => lower.includes(s))) return null;

  // Already a question
  if (heading.endsWith('?')) return heading;

  // Common patterns to convert:
  // "Benefits of X" → "What are the benefits of X?"
  // "How to X" → already question-like, just add "?"
  // "Types of X" → "What are the types of X?"
  // "X vs Y" → "What is the difference between X vs Y?"
  // "Tips for X" → "What are some tips for X?"
  // "Cost of X" → "How much does X cost?"

  if (lower.startsWith('how to ') || lower.startsWith('how ')) return heading + '?';
  if (lower.startsWith('why ') || lower.startsWith('when ') || lower.startsWith('where ')) return heading + '?';
  if (lower.startsWith('what ') || lower.startsWith('who ') || lower.startsWith('which ')) return heading + '?';

  if (lower.includes(' vs ') || lower.includes(' versus ')) return `What is the difference between ${heading}?`;
  if (lower.startsWith('benefits of ') || lower.startsWith('advantages of ')) return `What are the ${heading.toLowerCase()}?`;
  if (lower.startsWith('types of ') || lower.startsWith('kinds of ')) return `What are the ${heading.toLowerCase()}?`;
  if (lower.startsWith('tips for ') || lower.startsWith('tips on ')) return `What are some ${heading.toLowerCase()}?`;
  if (lower.startsWith('signs of ') || lower.startsWith('symptoms of ')) return `What are the ${heading.toLowerCase()}?`;
  if (lower.startsWith('cost of ') || lower.startsWith('price of ')) return `How much does ${heading.replace(/^(?:cost|price) of /i, '')} cost?`;
  if (lower.startsWith('steps to ')) return `What are the ${heading.toLowerCase()}?`;

  // Generic fallback: "What is/are [heading]?"
  // Use "are" for plural-sounding headings
  const pluralish = lower.endsWith('s') || lower.includes(' and ') || lower.startsWith('top ') || lower.startsWith('best ');
  return pluralish ? `What are ${heading}?` : `What is ${heading}?`;
}

// Helper: truncate long answers to a reasonable length for schema
function truncateAnswer(text) {
  if (text.length <= 500) return text;
  // Cut at last sentence boundary before 500 chars
  const cut = text.substring(0, 500);
  const lastPeriod = cut.lastIndexOf('.');
  if (lastPeriod > 200) return cut.substring(0, lastPeriod + 1);
  return cut + '...';
}
