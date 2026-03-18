import React, { useState } from 'react';
import { syntaxHighlight } from '../utils/validator';

export default function JsonPreview({ schema, validation }) {
  const [copied, setCopied] = useState(false);
  const [showScript, setShowScript] = useState(false);

  const jsonString = schema ? JSON.stringify(schema, null, 2) : '';
  const highlighted = schema ? syntaxHighlight(schema) : '';

  const scriptTag = schema
    ? `<script type="application/ld+json">\n${jsonString}\n</script>`
    : '';

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openInValidator = () => {
    // Schema.org validator doesn't accept URL params, open it for manual paste
    window.open('https://validator.schema.org/', '_blank');
  };

  const openInRichResults = () => {
    window.open('https://search.google.com/test/rich-results', '_blank');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 rounded-t-lg">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">JSON-LD Output</span>
          {validation && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              validation.errors.length === 0 ? 'bg-green-900/50 text-green-300' :
              'bg-red-900/50 text-red-300'
            }`}>
              {validation.errors.length === 0 ? '✓ Valid' : `${validation.errors.length} error${validation.errors.length !== 1 ? 's' : ''}`}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowScript(!showScript)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              showScript ? 'bg-brand-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            title="Toggle <script> tags"
          >
            &lt;script&gt;
          </button>
          <button
            onClick={() => handleCopy(showScript ? scriptTag : jsonString)}
            className="px-2 py-1 text-xs bg-slate-700 text-slate-300 hover:bg-slate-600 rounded transition-colors"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code output */}
      <div className="schema-output flex-1 overflow-auto bg-slate-900 rounded-b-lg">
        {schema ? (
          <pre className="p-4 text-sm leading-relaxed">
            {showScript && <span className="text-slate-500">&lt;script type="application/ld+json"&gt;\n</span>}
            <code dangerouslySetInnerHTML={{ __html: highlighted }} />
            {showScript && <span className="text-slate-500">\n&lt;/script&gt;</span>}
          </pre>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-sm text-center px-6">
            <p className="mb-2">Enter your <strong className="text-slate-300">Business Name</strong> and <strong className="text-slate-300">Website URL</strong> to see your schema appear here in real time.</p>
            <p className="text-xs text-slate-600">JSON-LD is a code snippet that tells Google about your business. You'll paste it into your website's HTML.</p>
          </div>
        )}
      </div>

      {/* Validation summary */}
      {validation && (validation.errors.length > 0 || validation.warnings.length > 0) && (
        <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
          {validation.errors.map((e, i) => (
            <div key={`e${i}`} className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs">
              <span className="text-red-500 mt-0.5 shrink-0">✕</span>
              <div>
                <span className="font-medium text-red-700">{e.field}</span>
                <span className="text-red-600 ml-1">— {e.message}</span>
              </div>
            </div>
          ))}
          {validation.warnings.map((w, i) => (
            <div key={`w${i}`} className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs">
              <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
              <div>
                <span className="font-medium text-amber-700">{w.field}</span>
                <span className="text-amber-600 ml-1">— {w.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Validator links */}
      {schema && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => handleCopy(jsonString).then(openInValidator)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Copy & Test in Schema.org
          </button>
          <button
            onClick={() => handleCopy(jsonString).then(openInRichResults)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Copy & Test in Google
          </button>
        </div>
      )}

      {/* Deployment hint */}
      {schema && (
        <p className="mt-2 text-xs text-gray-500 text-center">
          Click <strong>&lt;script&gt;</strong> above, then <strong>Copy</strong> and paste into your page's <code className="bg-gray-100 px-1 rounded">&lt;head&gt;</code> section.
        </p>
      )}

      {/* Score */}
      {validation && schema && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Schema Completeness</span>
            <span className={`text-sm font-bold ${
              validation.score >= 80 ? 'text-green-600' :
              validation.score >= 50 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {validation.score}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                validation.score >= 80 ? 'bg-green-500' :
                validation.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${validation.score}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {validation.errors.length} error{validation.errors.length !== 1 ? 's' : ''}, {validation.warnings.length} suggestion{validation.warnings.length !== 1 ? 's' : ''}
            {validation.errors.length === 0 && validation.warnings.length > 0 && (
              <span className="ml-1">— your schema is valid! Suggestions are optional improvements.</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
