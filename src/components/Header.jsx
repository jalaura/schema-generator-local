import React, { useState, useRef, useEffect } from 'react';

export default function Header({ onNewClient, onSaveClient, savedClients = [], onLoadClient, onDeleteClient }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const SavedDropdown = ({ mobile }) => (
    savedClients.length > 0 ? (
      <div className="relative" ref={mobile ? undefined : dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={mobile
            ? "w-full flex items-center justify-between gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-brand-800 text-brand-200 hover:bg-brand-700 transition-colors"
            : "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-brand-800 text-brand-200 hover:bg-brand-700 transition-colors"
          }
        >
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Saved ({savedClients.length})
          </span>
          <svg className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        {dropdownOpen && (
          <div className={`${mobile ? 'mt-1' : 'absolute right-0 mt-2'} w-full min-w-[16rem] bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1`}>
            {savedClients.map((client, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 group">
                <button
                  onClick={() => { onLoadClient(i); setDropdownOpen(false); setMobileMenuOpen(false); }}
                  className="flex-1 text-left text-sm text-gray-700 truncate pr-2"
                  title={`Load ${client.name}`}
                >
                  {client.name}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteClient(i); }}
                  className="text-gray-400 hover:text-red-500 transition-all p-0.5 sm:opacity-0 sm:group-hover:opacity-100"
                  title="Delete"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    ) : null
  );

  return (
    <header className="bg-brand-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <a href="/" className="inline-block">
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight truncate">
                <span className="text-brand-300">&lt;/&gt;</span>Stackable Local Business Schema Generator
              </h1>
            </a>
            <p className="mt-1 text-brand-200 text-xs sm:text-sm">
              Generate valid JSON-LD structured data for local SEO — free, no login required
            </p>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden ml-2 p-2 rounded-md bg-brand-800 text-brand-200 hover:bg-brand-700"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-3">
            {onNewClient && (
              <button
                onClick={onNewClient}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-green-600 text-white hover:bg-green-500 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                New Client
              </button>
            )}
            {onSaveClient && (
              <button
                onClick={onSaveClient}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                Save Client
              </button>
            )}
            <SavedDropdown mobile={false} />
            <a
              href="/docs"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-brand-800 text-brand-200 hover:bg-brand-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              Docs
            </a>
            <a
              href="https://validator.schema.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-brand-800 text-brand-200 hover:bg-brand-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Schema.org Validator
            </a>
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-brand-800 text-brand-200 hover:bg-brand-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Google Rich Results
            </a>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-4 pt-4 border-t border-brand-800 flex flex-col gap-2">
            <div className="flex gap-2">
              {onNewClient && (
                <button
                  onClick={() => { onNewClient(); setMobileMenuOpen(false); }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  New Client
                </button>
              )}
              {onSaveClient && (
                <button
                  onClick={() => { onSaveClient(); setMobileMenuOpen(false); }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                  Save Client
                </button>
              )}
            </div>
            <SavedDropdown mobile={true} />
            <div className="flex gap-2">
              <a href="/docs" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-brand-800 text-brand-200 hover:bg-brand-700 transition-colors">
                Docs
              </a>
              <a href="https://validator.schema.org/" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-brand-800 text-brand-200 hover:bg-brand-700 transition-colors">
                Validator
              </a>
              <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md bg-brand-800 text-brand-200 hover:bg-brand-700 transition-colors">
                Rich Results
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
