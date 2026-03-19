import React, { useState, useRef, useEffect } from 'react';
import { BUSINESS_CATEGORIES, searchBusinessTypes } from '../data/businessTypes';

export default function BusinessTypePicker({ value, onChange }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setResults(searchBusinessTypes(query));
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = value
    ? searchBusinessTypes('').find(t => t.value === value)?.label || value
    : '';

  // Group results by category
  const grouped = {};
  results.forEach(r => {
    if (!grouped[r.category]) grouped[r.category] = [];
    grouped[r.category].push(r);
  });

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Business Type <span className="text-red-400">*</span>
      </label>
      <div
        className="relative cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <input
          type="text"
          placeholder="Search business types (e.g. plumber, restaurant, dentist)..."
          value={isOpen ? query : selectedLabel}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {value && !isOpen && (
        <p className="mt-1 text-xs text-gray-500">Schema type: <code className="text-brand-600">{value}</code></p>
      )}

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto">
          {Object.keys(grouped).length === 0 && !query.trim() ? (
            <div className="px-3 py-4 text-sm text-gray-500 text-center">
              No matching business types found. Try a different search term.
            </div>
          ) : (
            <>
              {Object.entries(grouped).map(([category, types]) => (
                <div key={category}>
                  <div className="sticky top-0 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                    {category}
                  </div>
                  {types.map(t => (
                    <button
                      key={t.value}
                      onClick={() => { onChange(t.value); setQuery(''); setIsOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-brand-50 transition-colors ${
                        value === t.value ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {t.label}
                      {value === t.value && <span className="float-right text-brand-500">&#10003;</span>}
                    </button>
                  ))}
                </div>
              ))}
              {query.trim() && !results.find(r => r.value.toLowerCase() === query.trim().toLowerCase()) && (
                <div className="border-t border-gray-200">
                  <button
                    onClick={() => { onChange(query.trim()); setQuery(''); setIsOpen(false); }}
                    className="w-full text-left px-3 py-2.5 text-sm text-brand-600 hover:bg-brand-50 transition-colors"
                  >
                    Use custom type: <code className="font-mono bg-gray-100 px-1 rounded">{query.trim()}</code>
                  </button>
                  <p className="px-3 pb-2 text-xs text-gray-400">Schema.org has 800+ types — enter any valid type name</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
