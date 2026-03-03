import React, { useState } from 'react';
import BusinessTypePicker from './BusinessTypePicker';
import Tooltip from './Tooltip';
import { FIELD_TIPS, SECTION_TIPS } from '../data/tooltips';
import UrlAutoFill from './UrlAutoFill';

function Field({ label, name, value, onChange, required, placeholder, type = 'text', hint, half, tip }) {
  const tooltip = tip || FIELD_TIPS[name];
  return (
    <div className={half ? 'sm:col-span-1' : 'sm:col-span-2'}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={e => onChange(name, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
      />
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function TextArea({ label, name, value, onChange, placeholder, hint, rows = 2, tip }) {
  const tooltip = tip || FIELD_TIPS[name];
  return (
    <div className="sm:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      <textarea
        name={name}
        value={value || ''}
        onChange={e => onChange(name, e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
      />
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function Section({ title, children, defaultOpen = true, sectionTip }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-lg overflow-visible">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors rounded-t-lg"
      >
        <span className="flex items-center">
          {title}
          {sectionTip && <Tooltip text={sectionTip} />}
        </span>
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>}
    </div>
  );
}

const DAYS_OPTIONS = [
  { label: 'Mon-Fri', value: '["Monday","Tuesday","Wednesday","Thursday","Friday"]' },
  { label: 'Mon-Sat', value: '["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]' },
  { label: 'Mon-Sun', value: '["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]' },
  { label: 'Custom', value: 'custom' },
];

const GBP_OPTIONS = [
  { value: 'yes-address', label: 'Yes — with public address', desc: 'Full LocalBusiness schema with complete address' },
  { value: 'sab-hidden', label: 'Yes — SAB (address hidden)', desc: 'LocalBusiness with city/state only + publicAccess: false' },
  { value: 'no-gbp-has-address', label: 'No GBP — but has an address', desc: 'LocalBusiness with address, note about creating GBP' },
  { value: 'no-address', label: 'No GBP — online only', desc: 'Organization schema only (no LocalBusiness)' },
];

export default function SchemaForm({ data, onChange, template }) {
  const tmpl = template || {};

  const set = (name, value) => onChange({ ...data, [name]: value });

  const setLocation = (index, field, value) => {
    const locs = [...(data.locations || [])];
    if (!locs[index]) locs[index] = {};
    locs[index][field] = value;
    onChange({ ...data, locations: locs });
  };

  const addLocation = () => {
    const locs = [...(data.locations || [])];
    locs.push({ city: '', stateAbbr: '', state: '', slug: '', street: '', zip: '', lat: '', lng: '', phone: '', cityWiki: '', image: '', pageUrl: '', name: '' });
    onChange({ ...data, locations: locs });
  };

  const removeLocation = (index) => {
    const locs = [...(data.locations || [])];
    locs.splice(index, 1);
    onChange({ ...data, locations: locs });
  };

  const setFaq = (index, field, value) => {
    const faqs = [...(data.faqs || [])];
    if (!faqs[index]) faqs[index] = {};
    faqs[index][field] = value;
    onChange({ ...data, faqs: faqs });
  };

  const addFaq = () => {
    const faqs = [...(data.faqs || [])];
    faqs.push({ question: '', answer: '' });
    onChange({ ...data, faqs: faqs });
  };

  const removeFaq = (index) => {
    const faqs = [...(data.faqs || [])];
    faqs.splice(index, 1);
    onChange({ ...data, faqs: faqs });
  };

  const showGBP = tmpl.requiresLocation || tmpl.id === 'service-location' || tmpl.id === 'location' || tmpl.id === 'multi-location';
  const showLocation = tmpl.requiresLocation && tmpl.id !== 'multi-location';
  const showMultiLocation = tmpl.multiLocation;
  const showService = tmpl.requiresService;
  const showBlog = tmpl.id === 'blog';
  const showOrgOnly = tmpl.id === 'org-only';
  // FAQ and Breadcrumb are available on ALL page types
  const showFaq = true;
  const showBreadcrumb = true;

  return (
    <div className="space-y-4">
      {/* GBP Status */}
      {(showGBP || showOrgOnly) && (
        <Section title="Google Business Profile Status" defaultOpen={true} sectionTip={SECTION_TIPS.gbpStatus}>
          <div className="sm:col-span-2 space-y-2">
            {GBP_OPTIONS.map(opt => (
              <label
                key={opt.value}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  data.gbpStatus === opt.value ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="gbpStatus"
                  value={opt.value}
                  checked={data.gbpStatus === opt.value}
                  onChange={() => set('gbpStatus', opt.value)}
                  className="mt-0.5 text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                  <p className="text-xs text-gray-500">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </Section>
      )}

      {/* Business Type */}
      {(showGBP || showOrgOnly) && data.gbpStatus !== 'no-address' && (
        <Section title="Business Type" defaultOpen={true} sectionTip={SECTION_TIPS.businessType}>
          <div className="sm:col-span-2">
            <BusinessTypePicker value={data.businessType} onChange={(v) => set('businessType', v)} />
          </div>
        </Section>
      )}

      {/* Organization / Brand Info */}
      <Section title="Organization / Brand Info" defaultOpen={true} sectionTip={SECTION_TIPS.orgInfo}>
        <Field label="Business Name" name="brandName" value={data.brandName} onChange={set} required placeholder="Acme Plumbing" />
        <Field label="Website URL" name="brandDomain" value={data.brandDomain} onChange={set} required placeholder="https://acmeplumbing.com" hint="No trailing slash" />
        <TextArea label="Business Description" name="brandDescription" value={data.brandDescription} onChange={set} placeholder="1-2 sentence description of your business" />
        <Field label="Logo URL" name="brandLogoUrl" value={data.brandLogoUrl} onChange={set} placeholder="https://acmeplumbing.com/logo.png" half />
        <Field label="Phone" name="brandPhone" value={data.brandPhone} onChange={set} placeholder="+18005551234" hint="E.164 format" half />
        <Field label="Email" name="brandEmail" value={data.brandEmail} onChange={set} placeholder="info@acmeplumbing.com" half />
        <Field label="Founding Date" name="foundingDate" value={data.foundingDate} onChange={set} placeholder="2010-01-15" type="date" half />
      </Section>

      {/* HQ Address */}
      <Section title="Headquarters Address" defaultOpen={false} sectionTip={SECTION_TIPS.hqAddress}>
        <Field label="Street Address" name="hqStreet" value={data.hqStreet} onChange={set} placeholder="123 Main Street" />
        <Field label="City" name="hqCity" value={data.hqCity} onChange={set} placeholder="Denver" half />
        <Field label="State" name="hqState" value={data.hqState} onChange={set} placeholder="CO" half />
        <Field label="ZIP Code" name="hqZip" value={data.hqZip} onChange={set} placeholder="80202" half />
        <Field label="Country" name="addressCountry" value={data.addressCountry || 'US'} onChange={set} placeholder="US" half />
      </Section>

      {/* Social Profiles */}
      <Section title="Social Profiles (sameAs)" defaultOpen={false} sectionTip={SECTION_TIPS.socialProfiles}>
        <Field label="Facebook" name="facebookUrl" value={data.facebookUrl} onChange={set} placeholder="https://facebook.com/acmeplumbing" half />
        <Field label="Instagram" name="instagramUrl" value={data.instagramUrl} onChange={set} placeholder="https://instagram.com/acmeplumbing" half />
        <Field label="X / Twitter" name="twitterUrl" value={data.twitterUrl} onChange={set} placeholder="https://x.com/acmeplumbing" half />
        <Field label="YouTube" name="youtubeUrl" value={data.youtubeUrl} onChange={set} placeholder="https://youtube.com/@acmeplumbing" half />
        <Field label="LinkedIn" name="linkedinUrl" value={data.linkedinUrl} onChange={set} placeholder="https://linkedin.com/company/acmeplumbing" half />
        <Field label="Yelp" name="yelpUrl" value={data.yelpUrl} onChange={set} placeholder="https://yelp.com/biz/acme-plumbing" half />
      </Section>

      {/* Single Location */}
      {showLocation && data.gbpStatus !== 'no-address' && (
        <Section title="Location Details" defaultOpen={true} sectionTip={SECTION_TIPS.locationDetails}>
          <Field label="City" name="locationCity" value={data.locationCity} onChange={set} required placeholder="Nashville" half />
          <Field label="State (Full)" name="locationState" value={data.locationState} onChange={set} placeholder="Tennessee" half />
          <Field label="State Abbreviation" name="locationStateAbbr" value={data.locationStateAbbr} onChange={set} placeholder="TN" half />
          <Field label="URL Slug" name="locationSlug" value={data.locationSlug} onChange={set} placeholder="nashville-tn" half />
          {data.gbpStatus !== 'sab-hidden' && (
            <Field label="Street Address" name="locationStreet" value={data.locationStreet} onChange={set} placeholder="456 Broadway Ave" />
          )}
          <Field label="ZIP Code" name="locationZip" value={data.locationZip} onChange={set} placeholder="37201" half />
          <Field label="Local Phone" name="locationPhone" value={data.locationPhone} onChange={set} placeholder="+16155551234" half />
          <Field label="Latitude" name="locationLat" value={data.locationLat} onChange={set} placeholder="36.1627" half />
          <Field label="Longitude" name="locationLng" value={data.locationLng} onChange={set} placeholder="-86.7816" half />
          <Field label="Location Page URL" name="locationPageUrl" value={data.locationPageUrl} onChange={set} placeholder="https://acmeplumbing.com/locations/nashville-tn/" />
          <Field label="Location Image URL" name="locationImage" value={data.locationImage} onChange={set} placeholder="https://acmeplumbing.com/nashville.jpg" />
          <Field label="City Wikipedia URL" name="locationWiki" value={data.locationWiki} onChange={set} placeholder="https://en.wikipedia.org/wiki/Nashville,_Tennessee" hint="Links to Wikidata for entity disambiguation" />
          <Field label="State Wikipedia URL" name="stateWiki" value={data.stateWiki} onChange={set} placeholder="https://en.wikipedia.org/wiki/Tennessee" half />
        </Section>
      )}

      {/* Multi Location */}
      {showMultiLocation && (
        <Section title="Locations" defaultOpen={true}>
          <div className="sm:col-span-2 space-y-4">
            {(data.locations || []).map((loc, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Location {i + 1}</span>
                  <button onClick={() => removeLocation(i)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input placeholder="City" value={loc.city || ''} onChange={e => setLocation(i, 'city', e.target.value)} className="w-full px-2 py-1.5 border rounded text-sm" />
                  </div>
                  <div>
                    <input placeholder="State Abbr (e.g. TN)" value={loc.stateAbbr || ''} onChange={e => setLocation(i, 'stateAbbr', e.target.value)} className="w-full px-2 py-1.5 border rounded text-sm" />
                  </div>
                  <div>
                    <input placeholder="State (full, e.g. Tennessee)" value={loc.state || ''} onChange={e => setLocation(i, 'state', e.target.value)} className="w-full px-2 py-1.5 border rounded text-sm" />
                  </div>
                  <div>
                    <input placeholder="Slug (e.g. nashville-tn)" value={loc.slug || ''} onChange={e => setLocation(i, 'slug', e.target.value)} className="w-full px-2 py-1.5 border rounded text-sm" />
                  </div>
                  <div>
                    <input placeholder="Street Address" value={loc.street || ''} onChange={e => setLocation(i, 'street', e.target.value)} className="w-full px-2 py-1.5 border rounded text-sm" />
                  </div>
                  <div>
                    <input placeholder="ZIP" value={loc.zip || ''} onChange={e => setLocation(i, 'zip', e.target.value)} className="w-full px-2 py-1.5 border rounded text-sm" />
                  </div>
                  <div>
                    <input placeholder="Phone (+1...)" value={loc.phone || ''} onChange={e => setLocation(i, 'phone', e.target.value)} className="w-full px-2 py-1.5 border rounded text-sm" />
                  </div>
                  <div>
                    <input placeholder="Page URL" value={loc.pageUrl || ''} onChange={e => setLocation(i, 'pageUrl', e.target.value)} className="w-full px-2 py-1.5 border rounded text-sm" />
                  </div>
                  <div>
                    <input placeholder="Latitude" value={loc.lat || ''} onChange={e => setLocation(i, 'lat', e.target.value)} className="w-full px-2 py-1.5 border rounded text-sm" />
                  </div>
                  <div>
                    <input placeholder="Longitude" value={loc.lng || ''} onChange={e => setLocation(i, 'lng', e.target.value)} className="w-full px-2 py-1.5 border rounded text-sm" />
                  </div>
                  <div className="col-span-2">
                    <input placeholder="City Wikipedia URL" value={loc.cityWiki || ''} onChange={e => setLocation(i, 'cityWiki', e.target.value)} className="w-full px-2 py-1.5 border rounded text-sm" />
                  </div>
                  <div className="col-span-2">
                    <input placeholder="Image URL" value={loc.image || ''} onChange={e => setLocation(i, 'image', e.target.value)} className="w-full px-2 py-1.5 border rounded text-sm" />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addLocation}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors"
            >
              + Add Location
            </button>
          </div>
        </Section>
      )}

      {/* Business Hours */}
      {(showGBP || showLocation || showMultiLocation) && data.gbpStatus !== 'no-address' && (
        <Section title="Business Hours" defaultOpen={false} sectionTip={SECTION_TIPS.businessHours}>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Days Open
              <Tooltip text={FIELD_TIPS.hoursDaysPreset} />
            </label>
            <select
              value={data.hoursDaysPreset || 'Mon-Fri'}
              onChange={e => {
                const preset = e.target.value;
                set('hoursDaysPreset', preset);
                const opt = DAYS_OPTIONS.find(d => d.label === preset);
                if (opt && opt.value !== 'custom') set('hoursDays', opt.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {DAYS_OPTIONS.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
            </select>
          </div>
          {data.hoursDaysPreset === 'Custom' && (
            <TextArea label="Custom Days (JSON array)" name="hoursDays" value={data.hoursDays} onChange={set} placeholder='["Monday","Tuesday","Wednesday"]' />
          )}
          <Field label="Opens" name="hoursOpen" value={data.hoursOpen} onChange={set} placeholder="08:00" half hint="24h format" />
          <Field label="Closes" name="hoursClose" value={data.hoursClose} onChange={set} placeholder="17:00" half hint="24h format" />
          <Field label="Price Range" name="priceRange" value={data.priceRange} onChange={set} placeholder="$$" half hint="$, $$, $$$, or $$$$" />
          <Field label="Payment Accepted" name="paymentAccepted" value={data.paymentAccepted} onChange={set} placeholder="Cash, Credit Card" half />
        </Section>
      )}

      {/* Service Info */}
      {showService && (
        <Section title="Service Details" defaultOpen={true} sectionTip={SECTION_TIPS.serviceDetails}>
          <Field label="Service Name" name="serviceName" value={data.serviceName} onChange={set} required placeholder="Roof Replacement" />
          <Field label="Service URL Slug" name="serviceSlug" value={data.serviceSlug} onChange={set} placeholder="roof-replacement" half />
          <TextArea label="Service Description" name="serviceDescription" value={data.serviceDescription} onChange={set} placeholder="Complete roof replacement services for residential and commercial properties" />
          <Field label="Service Type" name="serviceType" value={data.serviceType} onChange={set} placeholder="Roof Replacement" half />
          <Field label="Service Category" name="serviceCategory" value={data.serviceCategory} onChange={set} placeholder="Roofing" half />
          <Field label="Service Page URL" name="servicePageUrl" value={data.servicePageUrl} onChange={set} placeholder="https://acmeplumbing.com/services/roof-replacement/" />
          <Field label="Service Image URL" name="serviceImage" value={data.serviceImage} onChange={set} placeholder="https://acmeplumbing.com/roof-replacement.jpg" />
          <Field label="Service Wikipedia URL" name="serviceWiki" value={data.serviceWiki} onChange={set} placeholder="https://en.wikipedia.org/wiki/Roofing" hint="Optional — links service to Knowledge Graph entity" />
        </Section>
      )}

      {/* Page / Article Info */}
      <Section title="Page / Article Details" defaultOpen={tmpl.id === 'blog' || tmpl.id === 'faq'} sectionTip={SECTION_TIPS.pageArticle}>
        {/* URL Auto-Fill — extract metadata from a live page */}
        {(tmpl.id === 'blog' || tmpl.id === 'faq' || tmpl.id === 'homepage' || !tmpl.requiresLocation) && (
          <div className="sm:col-span-2">
            <UrlAutoFill data={data} onChange={onChange} />
          </div>
        )}
        <Field label="Page Title (H1)" name="pageTitle" value={data.pageTitle} onChange={set} placeholder="Trusted Nashville TN Roofing Contractors" />
        <TextArea label="Page Description" name="pageDescription" value={data.pageDescription} onChange={set} placeholder="Meta description for the page" />
        <Field label="Page URL" name="pageUrl" value={data.pageUrl} onChange={set} placeholder="https://acmeplumbing.com/locations/nashville-tn/" />
        <Field label="Page Image URL" name="pageImage" value={data.pageImage} onChange={set} placeholder="https://acmeplumbing.com/hero.jpg" />
        <Field label="Date Published" name="datePublished" value={data.datePublished} onChange={set} type="date" half />
        <Field label="Date Modified" name="dateModified" value={data.dateModified} onChange={set} type="date" half />
      </Section>

      {/* Author (for blog) */}
      {showBlog && (
        <Section title="Author Details" defaultOpen={true} sectionTip={SECTION_TIPS.authorDetails}>
          <Field label="Author Name" name="authorName" value={data.authorName} onChange={set} placeholder="John Smith" half />
          <Field label="Author URL" name="authorUrl" value={data.authorUrl} onChange={set} placeholder="https://acmeplumbing.com/team/john/" half />
          <Field label="Author Title" name="authorTitle" value={data.authorTitle} onChange={set} placeholder="Senior Roofing Specialist" half />
          <Field label="Blog Section Name" name="blogSectionName" value={data.blogSectionName} onChange={set} placeholder="Blog" half />
          <Field label="Blog Section Slug" name="blogSectionSlug" value={data.blogSectionSlug} onChange={set} placeholder="blog" half />
        </Section>
      )}

      {/* Topic Entities */}
      <Section title="Topic Entities (Knowledge Graph)" defaultOpen={false} sectionTip={SECTION_TIPS.topicEntities}>
        <Field label="Topic 1 Name" name="topic1Name" value={data.topic1Name} onChange={set} placeholder="Roof Replacement" half />
        <Field label="Topic 1 Wikipedia" name="topic1Wiki" value={data.topic1Wiki} onChange={set} placeholder="https://en.wikipedia.org/wiki/Roofing" half />
        <Field label="Topic 2 Name" name="topic2Name" value={data.topic2Name} onChange={set} placeholder="Solar Panel" half />
        <Field label="Topic 2 Wikipedia" name="topic2Wiki" value={data.topic2Wiki} onChange={set} placeholder="https://en.wikipedia.org/wiki/Solar_panel" half />
      </Section>

      {/* Breadcrumb — available on all page types */}
      {showBreadcrumb && (
        <Section title="Breadcrumb Navigation" defaultOpen={false} sectionTip={SECTION_TIPS.breadcrumb}>
          <div className="sm:col-span-2">
            <p className="text-xs text-gray-500 mb-3">Define the breadcrumb trail for this page. The generator will auto-build a default breadcrumb based on the page type, but you can customize it here.</p>
            <div className="flex items-center gap-2 mb-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.enableBreadcrumb !== false}
                  onChange={e => set('enableBreadcrumb', e.target.checked)}
                  className="text-brand-600 focus:ring-brand-500 rounded"
                />
                Include BreadcrumbList in schema
                <Tooltip text={FIELD_TIPS.enableBreadcrumb} />
              </label>
            </div>
          </div>
          {data.enableBreadcrumb !== false && (
            <>
              <Field label="Breadcrumb Level 1 Name" name="breadcrumb1Name" value={data.breadcrumb1Name} onChange={set} placeholder="Home" half />
              <Field label="Breadcrumb Level 1 URL" name="breadcrumb1Url" value={data.breadcrumb1Url} onChange={set} placeholder="https://acmeplumbing.com/" half />
              <Field label="Breadcrumb Level 2 Name" name="breadcrumb2Name" value={data.breadcrumb2Name} onChange={set} placeholder="Services" half />
              <Field label="Breadcrumb Level 2 URL" name="breadcrumb2Url" value={data.breadcrumb2Url} onChange={set} placeholder="https://acmeplumbing.com/services/" half />
              <Field label="Breadcrumb Level 3 Name" name="breadcrumb3Name" value={data.breadcrumb3Name} onChange={set} placeholder="Roof Repair" half />
              <Field label="Breadcrumb Level 3 URL" name="breadcrumb3Url" value={data.breadcrumb3Url} onChange={set} placeholder="https://acmeplumbing.com/services/roof-repair/" half />
              <Field label="Breadcrumb Level 4 (Current Page)" name="breadcrumb4Name" value={data.breadcrumb4Name} onChange={set} placeholder="Nashville TN" hint="Last item — no URL needed (current page)" />
            </>
          )}
        </Section>
      )}

      {/* FAQ Section — available on all page types */}
      {showFaq && (
        <Section title="FAQ Questions & Answers" defaultOpen={tmpl.id === 'faq'} sectionTip={SECTION_TIPS.faq}>
          <div className="sm:col-span-2 space-y-3">
            <p className="text-xs text-gray-500">Add FAQ questions to any page type. FAQ schema helps AI search engines extract your content and can generate rich results for eligible sites.</p>
            {(data.faqs || []).map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Q{i + 1}</span>
                  <button onClick={() => removeFaq(i)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                </div>
                <div className="mb-1">
                  <label className="text-xs text-gray-500">Question <Tooltip text={FIELD_TIPS.faqQuestion} /></label>
                </div>
                <input
                  placeholder="Question"
                  value={faq.question || ''}
                  onChange={e => setFaq(i, 'question', e.target.value)}
                  className="w-full px-2 py-1.5 border rounded text-sm mb-2"
                />
                <div className="mb-1">
                  <label className="text-xs text-gray-500">Answer <Tooltip text={FIELD_TIPS.faqAnswer} /></label>
                </div>
                <textarea
                  placeholder="Answer"
                  value={faq.answer || ''}
                  onChange={e => setFaq(i, 'answer', e.target.value)}
                  rows={2}
                  className="w-full px-2 py-1.5 border rounded text-sm"
                />
              </div>
            ))}
            <button
              onClick={addFaq}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors"
            >
              + Add Question
            </button>
          </div>
        </Section>
      )}

      {/* FAQ Page Settings — only for dedicated FAQ template */}
      {tmpl.id === 'faq' && (
        <Section title="FAQ Page Settings" defaultOpen={false}>
          <Field label="FAQ Section Name" name="faqSectionName" value={data.faqSectionName} onChange={set} placeholder="FAQ" half />
          <Field label="FAQ Section Slug" name="faqSectionSlug" value={data.faqSectionSlug} onChange={set} placeholder="faq" half />
        </Section>
      )}

      {/* Search Action (homepage) */}
      {tmpl.id === 'homepage' && (
        <Section title="Site Search (Sitelinks Search Box)" defaultOpen={false} sectionTip={SECTION_TIPS.searchAction}>
          <Field
            label="Search URL Template"
            name="searchUrlTemplate"
            value={data.searchUrlTemplate}
            onChange={set}
            placeholder="https://acmeplumbing.com/?s={search_term_string}"
            hint="Leave blank if your site has no search. Use {search_term_string} as the query placeholder."
          />
        </Section>
      )}

      {/* Google Maps link */}
      {showGBP && data.gbpStatus !== 'no-address' && (
        <Section title="Advanced Properties" defaultOpen={false} sectionTip={SECTION_TIPS.advanced}>
          <Field label="Google Maps Link" name="hasMap" value={data.hasMap} onChange={set} placeholder="https://maps.google.com/?cid=..." hint="Your Google Maps or GBP URL" />
          <Field label="Contact Phone" name="contactPointPhone" value={data.contactPointPhone} onChange={set} placeholder="+18005551234" half />
          <Field label="Contact Type" name="contactPointType" value={data.contactPointType} onChange={set} placeholder="customer service" half />
          <Field label="Languages" name="contactLanguages" value={data.contactLanguages} onChange={set} placeholder="English, Spanish" hint="Comma-separated" />
        </Section>
      )}
    </div>
  );
}
