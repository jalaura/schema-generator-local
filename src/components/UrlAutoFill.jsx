import React, { useState } from 'react';

// Fields that auto-fill is allowed to set
const FILLABLE_FIELDS = [
  'pageTitle', 'pageDescription', 'pageUrl', 'pageImage',
  'datePublished', 'dateModified',
  'authorName', 'authorUrl', 'authorTitle',
  'topic1Name', 'topic2Name',
];

const FIELD_LABELS = {
  pageTitle: 'Page Title',
  pageDescription: 'Description',
  pageUrl: 'Canonical URL',
  pageImage: 'Featured Image',
  datePublished: 'Date Published',
  dateModified: 'Date Modified',
  authorName: 'Author Name',
  authorUrl: 'Author URL',
  authorTitle: 'Author Job Title',
  topic1Name: 'Topic 1',
  topic2Name: 'Topic 2',
};

export default function UrlAutoFill({ data, onChange }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [filled, setFilled] = useState(false);

  const handleFetch = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Enter a URL to scrape.');
      return;
    }

    // Basic URL validation
    try {
      const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        setError('URL must start with http:// or https://');
        return;
      }
    } catch {
      setError('Invalid URL format.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setFilled(false);

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed.startsWith('http') ? trimmed : `https://${trimmed}` }),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error || 'Failed to fetch page.');
        setLoading(false);
        return;
      }

      setResult(json.data);
      applyData(json.data);
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const applyData = (scraped) => {
    const updates = {};

    // Only fill non-empty scraped values into the form
    for (const field of FILLABLE_FIELDS) {
      if (scraped[field] && typeof scraped[field] === 'string' && scraped[field].trim()) {
        updates[field] = scraped[field].trim();
      }
    }

    // Handle FAQs — merge scraped FAQs with existing
    let newFaqs = data.faqs || [];
    if (scraped.faqs && scraped.faqs.length > 0) {
      // Replace empty default FAQs or append
      const hasContent = newFaqs.some(f => f.question.trim() || f.answer.trim());
      if (!hasContent) {
        newFaqs = scraped.faqs;
      } else {
        newFaqs = [...newFaqs.filter(f => f.question.trim() || f.answer.trim()), ...scraped.faqs];
      }
      updates.faqs = newFaqs;
    }

    if (Object.keys(updates).length > 0) {
      onChange({ ...data, ...updates });
      setFilled(true);
    } else {
      setError('No metadata could be extracted from this page.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFetch();
    }
  };

  // Count what was filled
  const filledFields = result
    ? FILLABLE_FIELDS.filter(f => result[f] && result[f].trim()).map(f => FIELD_LABELS[f] || f)
    : [];
  const faqCount = result?.faqs?.length || 0;

  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <span className="text-sm font-semibold text-indigo-900">Auto-Fill from URL</span>
        <span className="text-xs text-indigo-500">Paste a live page URL to extract metadata</span>
      </div>

      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://example.com/blog/your-article"
          className="flex-1 px-3 py-2 text-sm border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white placeholder-gray-400"
          disabled={loading}
        />
        <button
          onClick={handleFetch}
          disabled={loading || !url.trim()}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Fetching...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Fetch &amp; Fill
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-2 flex items-start gap-1.5 text-xs text-red-600">
          <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Success */}
      {filled && filledFields.length > 0 && (
        <div className="mt-2 p-2.5 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center gap-1.5 text-xs font-medium text-green-800 mb-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Auto-filled {filledFields.length} field{filledFields.length !== 1 ? 's' : ''}
            {faqCount > 0 && ` + ${faqCount} FAQ${faqCount !== 1 ? 's' : ''}`}
          </div>
          <div className="text-xs text-green-700">
            {filledFields.join(' · ')}
            {faqCount > 0 && ` · ${faqCount} FAQ question${faqCount !== 1 ? 's' : ''}`}
          </div>
          <div className="text-xs text-green-600 mt-1 italic">
            Review the fields below and edit as needed. Organization/brand fields were not changed.
          </div>
        </div>
      )}

      {/* No data found */}
      {filled && filledFields.length === 0 && faqCount === 0 && (
        <div className="mt-2 text-xs text-amber-600">
          Page was fetched but no extractable metadata was found. Try filling in the fields manually.
        </div>
      )}
    </div>
  );
}
