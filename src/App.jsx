import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import TemplateSelector from './components/TemplateSelector';
import SchemaForm from './components/SchemaForm';
import JsonPreview from './components/JsonPreview';
import DocsPage from './pages/DocsPage';
import { TEMPLATES } from './templates/schemas';
import { validateSchema } from './utils/validator';

const DEFAULT_DATA = {
  gbpStatus: 'yes-address',
  businessType: 'Organization',
  brandName: '',
  brandDomain: '',
  brandDescription: '',
  brandLogoUrl: '',
  brandPhone: '',
  brandEmail: '',
  addressCountry: 'US',
  hqStreet: '',
  hqCity: '',
  hqState: '',
  hqZip: '',
  facebookUrl: '',
  instagramUrl: '',
  twitterUrl: '',
  youtubeUrl: '',
  linkedinUrl: '',
  yelpUrl: '',
  tiktokUrl: '',
  pinterestUrl: '',
  wikidataUrl: '',
  foursquareUrl: '',
  appleBusinessUrl: '',
  foundingDate: '',
  locationCity: '',
  locationState: '',
  locationStateAbbr: '',
  locationSlug: '',
  locationStreet: '',
  locationZip: '',
  locationPhone: '',
  locationEmail: '',
  locationLat: '',
  locationLng: '',
  locationPageUrl: '',
  locationImage: '',
  locationWiki: '',
  stateWiki: '',
  serviceName: '',
  serviceSlug: '',
  serviceDescription: '',
  serviceType: '',
  serviceCategory: '',
  servicePageUrl: '',
  serviceImage: '',
  serviceWiki: '',
  servicePrice: '',
  servicePriceCurrency: 'USD',
  pageTitle: '',
  pageDescription: '',
  pageUrl: '',
  pageImage: '',
  datePublished: '',
  dateModified: '',
  wordCount: '',
  articleSection: '',
  authorName: '',
  authorUrl: '',
  authorTitle: '',
  authorLinkedinUrl: '',
  authorTwitterUrl: '',
  blogSectionName: 'Blog',
  blogSectionSlug: 'blog',
  faqSectionName: 'FAQ',
  faqSectionSlug: 'faq',
  topic1Name: '',
  topic1Wiki: '',
  topic2Name: '',
  topic2Wiki: '',
  topics: [{ name: '', wiki: '' }, { name: '', wiki: '' }, { name: '', wiki: '' }],
  services: [],
  slogan: '',
  aggregateRatingValue: '',
  aggregateRatingCount: '',
  currenciesAccepted: 'USD',
  knowsAboutText: '',
  hqLat: '',
  hqLng: '',
  areaServed: [],
  homepageSAB: false,
  hoursDays: '["Monday","Tuesday","Wednesday","Thursday","Friday"]',
  hoursDaysPreset: 'Mon-Fri',
  hoursOpen: '08:00',
  hoursClose: '17:00',
  priceRange: '',
  paymentAccepted: '',
  hasMap: '',
  searchUrlTemplate: '',
  contactPointPhone: '',
  contactPointType: 'customer service',
  contactLanguages: '',
  enableBreadcrumb: true,
  breadcrumb1Name: '',
  breadcrumb1Url: '',
  breadcrumb2Name: '',
  breadcrumb2Url: '',
  breadcrumb3Name: '',
  breadcrumb3Url: '',
  breadcrumb4Name: '',
  locations: [],
  faqs: [{ question: '', answer: '' }, { question: '', answer: '' }, { question: '', answer: '' }],
};

// Persist form data to localStorage
function migrateTopics(data) {
  if (!data.topics || data.topics.length === 0) {
    const migrated = [];
    if (data.topic1Name) migrated.push({ name: data.topic1Name, wiki: data.topic1Wiki || '' });
    if (data.topic2Name) migrated.push({ name: data.topic2Name, wiki: data.topic2Wiki || '' });
    while (migrated.length < 3) migrated.push({ name: '', wiki: '' });
    data.topics = migrated;
  }
  return data;
}

function loadSavedData() {
  try {
    const saved = localStorage.getItem('schema-generator-data');
    if (saved) return migrateTopics({ ...DEFAULT_DATA, ...JSON.parse(saved) });
  } catch {}
  return { ...DEFAULT_DATA };
}

function loadSavedTemplate() {
  try {
    return localStorage.getItem('schema-generator-template') || 'homepage';
  } catch {
    return 'homepage';
  }
}

function loadSavedClients() {
  try {
    const saved = localStorage.getItem('schema-generator-clients');
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

function saveSavedClients(clients) {
  try {
    localStorage.setItem('schema-generator-clients', JSON.stringify(clients));
  } catch {}
}

export default function App() {
  const [templateId, setTemplateId] = useState(loadSavedTemplate);
  const [formData, setFormData] = useState(loadSavedData);
  const [page, setPage] = useState(window.location.pathname === '/docs' ? 'docs' : 'generator');
  const [savedClients, setSavedClients] = useState(loadSavedClients);

  // Listen for path changes (popstate for back/forward)
  useEffect(() => {
    const handleNav = () => {
      setPage(window.location.pathname === '/docs' ? 'docs' : 'generator');
    };
    window.addEventListener('popstate', handleNav);
    return () => window.removeEventListener('popstate', handleNav);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('schema-generator-data', JSON.stringify(formData));
      localStorage.setItem('schema-generator-template', templateId);
    } catch {}
  }, [formData, templateId]);

  const template = TEMPLATES.find(t => t.id === templateId);

  // Generate schema
  const schema = useMemo(() => {
    if (!template || !formData.brandName || !formData.brandDomain) return null;
    try {
      const stripSlash = (s) => s ? s.replace(/\/+$/, '') : s;
      const normalized = {
        ...formData,
        brandDomain: stripSlash(formData.brandDomain),
        locationPageUrl: stripSlash(formData.locationPageUrl),
        servicePageUrl: stripSlash(formData.servicePageUrl),
        pageUrl: stripSlash(formData.pageUrl),
      };
      return template.generate(normalized);
    } catch (err) {
      console.error('Schema generation error:', err);
      return null;
    }
  }, [formData, templateId]);

  // Validate
  const validation = useMemo(() => {
    if (!schema) return null;
    return validateSchema(schema, templateId);
  }, [schema, templateId]);

  const handleReset = () => {
    if (window.confirm('Reset all form fields? This cannot be undone.')) {
      setFormData({ ...DEFAULT_DATA });
    }
  };

  const handleNewClient = () => {
    if (window.confirm('Start fresh for a new client? All current form data will be cleared and the template will reset to Homepage.')) {
      setFormData({ ...DEFAULT_DATA });
      setTemplateId('homepage');
      try {
        localStorage.removeItem('schema-generator-data');
        localStorage.removeItem('schema-generator-template');
      } catch {}
      window.scrollTo(0, 0);
    }
  };

  const handleSaveClient = () => {
    const name = formData.brandName?.trim();
    if (!name) {
      alert('Please enter a Business Name before saving.');
      return;
    }
    const existing = savedClients.findIndex(c => c.name === name);
    const entry = { name, data: formData, templateId, savedAt: new Date().toISOString() };
    let updated;
    if (existing >= 0) {
      if (!window.confirm(`Update saved session for "${name}"?`)) return;
      updated = [...savedClients];
      updated[existing] = entry;
    } else {
      updated = [...savedClients, entry];
    }
    setSavedClients(updated);
    saveSavedClients(updated);
  };

  const handleLoadClient = (index) => {
    const client = savedClients[index];
    if (!client) return;
    setFormData(migrateTopics({ ...DEFAULT_DATA, ...client.data }));
    setTemplateId(client.templateId || 'homepage');
    window.scrollTo(0, 0);
  };

  const handleDeleteClient = (index) => {
    const client = savedClients[index];
    if (!client) return;
    if (!window.confirm(`Delete saved session for "${client.name}"?`)) return;
    const updated = savedClients.filter((_, i) => i !== index);
    setSavedClients(updated);
    saveSavedClients(updated);
  };

  // Docs page
  if (page === 'docs') {
    return <DocsPage />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onNewClient={handleNewClient}
        onSaveClient={handleSaveClient}
        savedClients={savedClients}
        onLoadClient={handleLoadClient}
        onDeleteClient={handleDeleteClient}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        {/* Template Selector */}
        <div className="mb-6">
          <TemplateSelector selected={templateId} onSelect={setTemplateId} />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Form */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">2. Fill in Your Details</h2>
              <button
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Quick start hint */}
            {!formData.brandName && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                <strong>Quick start:</strong> Enter your business name and website URL to see the JSON-LD preview update in real time. Hover over the <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-200 text-blue-700 text-[10px] font-bold leading-none mx-0.5">?</span> icons for help on any field.
              </div>
            )}

            <SchemaForm
              data={formData}
              onChange={setFormData}
              template={template}
            />
          </div>

          {/* Right: Preview */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">3. Generated JSON-LD</h2>
            <div className="sticky top-4">
              <JsonPreview schema={schema} validation={validation} />
            </div>
          </div>
        </div>

        {/* Tips section */}
        <div className="mt-12 mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Implementation Tips</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Where to place it</h4>
              <p>Paste the <code className="text-xs bg-gray-200 px-1 rounded">&lt;script&gt;</code> tag in your page's <code className="text-xs bg-gray-200 px-1 rounded">&lt;head&gt;</code> or <code className="text-xs bg-gray-200 px-1 rounded">&lt;body&gt;</code> — Google processes both equally.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-1">NAP consistency</h4>
              <p>Your name, address, and phone must match exactly across your schema, GBP, Yelp, and all directory listings.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Content must match</h4>
              <p>Only include schema for information visible on the page. Google can issue manual actions for misleading markup.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Test before deploying</h4>
              <p>Always validate with the Schema.org Validator (syntax) and Google Rich Results Test (eligibility).</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-1">AI search visibility</h4>
              <p>Schema with sameAs links to Wikipedia/Wikidata gets 2.5x higher citation rates in AI-generated answers.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Keep it updated</h4>
              <p>Update <code className="text-xs bg-gray-200 px-1 rounded">dateModified</code> whenever you change page content — AI systems use this for freshness.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-gray-500">
          <span>Local Business Schema Generator — Built for Local SEO professionals</span>
          <div className="flex gap-4">
            <a href="/docs" className="hover:text-brand-600" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/docs'); setPage('docs'); window.scrollTo(0, 0); }}>Documentation</a>
            <a href="https://schema.org/LocalBusiness" target="_blank" rel="noopener" className="hover:text-brand-600">Schema.org Reference</a>
            <a href="https://developers.google.com/search/docs/appearance/structured-data/local-business" target="_blank" rel="noopener" className="hover:text-brand-600">Google Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
