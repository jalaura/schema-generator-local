import React, { useState, useEffect } from 'react';

const sections = [
  { id: 'intro', label: 'Introduction' },
  { id: 'why-schema', label: 'Why Schema Markup?' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'templates', label: 'Page Templates' },
  { id: 'fields', label: 'Field Reference' },
  { id: 'graph', label: 'The @graph Pattern' },
  { id: 'gbp', label: 'GBP Status Modes' },
  { id: 'nap', label: 'NAP Consistency' },
  { id: 'breadcrumbs', label: 'BreadcrumbList' },
  { id: 'faq', label: 'FAQ Schema' },
  { id: 'sameas', label: 'sameAs & Knowledge Graph' },
  { id: 'eeat', label: 'E-E-A-T Signals' },
  { id: 'ai-search', label: 'AI Search (GEO/AEO)' },
  { id: 'testing', label: 'Testing & Validation' },
  { id: 'implementation', label: 'Implementation Guide' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'glossary', label: 'Glossary' },
];

function SideNav({ active }) {
  return (
    <nav className="hidden lg:block sticky top-6 w-56 shrink-0">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Documentation</h3>
      <ul className="space-y-0.5 text-sm">
        {sections.map(s => (
          <li key={s.id}>
            <a
              href={`#doc-${s.id}`}
              className={`block px-3 py-1.5 rounded-md transition-colors ${
                active === s.id
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function H2({ id, children }) {
  return (
    <h2 id={`doc-${id}`} className="text-xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-6 flex items-center gap-2">
      <a href={`#doc-${id}`} className="text-brand-400 hover:text-brand-600 text-base">#</a>
      {children}
    </h2>
  );
}

function H3({ children }) {
  return <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">{children}</h3>;
}

function P({ children }) {
  return <p className="text-sm text-gray-600 leading-relaxed mb-3">{children}</p>;
}

function Code({ children }) {
  return <code className="text-xs bg-gray-100 text-brand-700 px-1.5 py-0.5 rounded font-mono">{children}</code>;
}

function CodeBlock({ children, title }) {
  return (
    <div className="my-4">
      {title && <div className="text-xs text-gray-500 font-medium mb-1">{title}</div>}
      <pre className="bg-gray-900 text-gray-100 text-xs p-4 rounded-lg overflow-x-auto leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function Tip({ children }) {
  return (
    <div className="my-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
      <span className="font-semibold">Tip:</span> {children}
    </div>
  );
}

function Warning({ children }) {
  return (
    <div className="my-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
      <span className="font-semibold">Warning:</span> {children}
    </div>
  );
}

function TableRow({ label, description }) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-2 pr-4 text-sm font-medium text-gray-800 whitespace-nowrap align-top">{label}</td>
      <td className="py-2 text-sm text-gray-600">{description}</td>
    </tr>
  );
}

export default function DocsPage() {
  const [active, setActive] = useState('intro');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('doc-', '');
            setActive(id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    sections.forEach(s => {
      const el = document.getElementById(`doc-${s.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-brand-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <a href="#/" className="inline-block">
                <h1 className="text-2xl font-bold tracking-tight">
                  <span className="text-brand-300">&lt;/&gt;</span> Schema Generator Docs
                </h1>
              </a>
              <p className="mt-1 text-brand-200 text-sm">
                Everything you need to master JSON-LD structured data for local SEO
              </p>
            </div>
            <a
              href="#/"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-brand-800 text-brand-200 hover:bg-brand-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Generator
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <SideNav active={active} />

          <article className="flex-1 min-w-0 max-w-3xl">
            {/* Intro */}
            <H2 id="intro">Introduction</H2>
            <P>
              The Local Business Schema Generator creates valid JSON-LD structured data markup following Schema.org specifications. JSON-LD (JavaScript Object Notation for Linked Data) is Google's recommended format for structured data. It tells search engines and AI systems exactly what your business is, where it operates, what services it offers, and how your content is organized.
            </P>
            <P>
              This tool generates schema for 8 common local business page types using the <Code>@graph</Code> pattern, which bundles multiple connected entities into a single script tag. Every entity is linked together with <Code>@id</Code> references, creating a mini knowledge graph for each page.
            </P>
            <P>
              Whether you're an SEO professional managing dozens of clients, a business owner wanting better search visibility, or a developer implementing structured data, this tool handles the complexity so you can focus on getting the markup right.
            </P>

            {/* Why Schema */}
            <H2 id="why-schema">Why Schema Markup Matters</H2>

            <H3>Search Engine Benefits</H3>
            <P>
              Structured data helps Google understand your pages beyond just reading the text. With proper schema, Google can identify your business name, address, phone number, services, hours, and relationships between pages. This understanding can lead to rich results (enhanced search listings), knowledge panel appearances, and better local pack rankings.
            </P>

            <H3>AI Search Visibility</H3>
            <P>
              AI-powered search engines like Google AI Overviews, ChatGPT with browsing, and Perplexity rely heavily on structured data to understand and cite content. Research shows that pages with comprehensive schema markup and sameAs links to Wikipedia/Wikidata receive significantly higher citation rates in AI-generated answers. This is called Generative Engine Optimization (GEO) or Answer Engine Optimization (AEO).
            </P>

            <H3>What Schema Won't Do</H3>
            <P>
              Schema markup is not a ranking factor by itself. It won't fix thin content, poor site speed, or a weak backlink profile. Think of it as making your existing good content more understandable and citable by machines. The content on your page must match what your schema describes, as Google can issue manual actions for misleading markup.
            </P>

            {/* Getting Started */}
            <H2 id="getting-started">Getting Started</H2>
            <P>
              Using the generator follows a simple three-step process:
            </P>

            <H3>Step 1: Choose a Page Template</H3>
            <P>
              Select the template that matches the type of page you're creating schema for. Each template generates different combinations of schema entities optimized for that page type. If unsure, start with "Homepage" for your main page.
            </P>

            <H3>Step 2: Fill in Your Details</H3>
            <P>
              Enter your business information in the form fields. The JSON-LD preview on the right updates in real time as you type. Required fields are marked, but fill in as many optional fields as possible for richer markup. Hover over the <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-200 text-blue-700 text-[10px] font-bold leading-none mx-0.5">?</span> icon next to any field for a detailed explanation.
            </P>

            <H3>Step 3: Copy and Implement</H3>
            <P>
              Once the preview shows valid JSON-LD (green checkmarks), click "Copy" to copy the entire script tag. Paste it into your page's <Code>&lt;head&gt;</Code> or <Code>&lt;body&gt;</Code>. Google processes both locations equally.
            </P>

            <Tip>
              Use the "New Client" button in the header when switching between clients. It clears all form data and resets the template to Homepage, giving you a fresh start.
            </Tip>

            {/* Templates */}
            <H2 id="templates">Page Templates</H2>
            <P>
              Each template generates a specific combination of schema entities designed for that page type. Here's what each one produces:
            </P>

            <div className="my-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 pr-4 font-semibold text-gray-800">Template</th>
                    <th className="text-left py-2 font-semibold text-gray-800">Entities Generated</th>
                  </tr>
                </thead>
                <tbody>
                  <TableRow label="Homepage" description="Organization, LocalBusiness, WebSite, WebPage, SearchAction, BreadcrumbList, FAQPage (optional)" />
                  <TableRow label="Location Page" description="Organization, LocalBusiness (with full address, geo, hours), WebPage, BreadcrumbList, FAQPage (optional)" />
                  <TableRow label="Service Page" description="Organization, Service (linked to Organization), WebPage, BreadcrumbList, FAQPage (optional)" />
                  <TableRow label="Service + Location" description="Organization, LocalBusiness, Service (linked to LocalBusiness), WebPage, BreadcrumbList, FAQPage (optional)" />
                  <TableRow label="Multi-Location Hub" description="Organization (with multiple location sub-entities), WebSite, WebPage, BreadcrumbList, FAQPage (optional)" />
                  <TableRow label="Blog / Article" description="Organization, Article (with author Person), WebPage, BreadcrumbList, FAQPage (optional)" />
                  <TableRow label="FAQ Page" description="Organization, FAQPage (with Question/Answer pairs), WebPage, BreadcrumbList" />
                  <TableRow label="Organization Only" description="Organization (standalone entity with social profiles, logo, contact)" />
                </tbody>
              </table>
            </div>

            <P>
              All templates except "Organization Only" include optional FAQ and BreadcrumbList sections. You can toggle these on or off based on whether your page has FAQ content or needs breadcrumb navigation.
            </P>

            {/* Fields */}
            <H2 id="fields">Field Reference</H2>
            <P>
              Below is a reference for every field group in the generator, explaining what each section does and how the fields map to schema properties.
            </P>

            <H3>GBP Status</H3>
            <P>
              Your Google Business Profile status determines how the LocalBusiness entity is structured. This is the first choice you make because it affects whether street addresses are included, whether the business is marked as a Service Area Business, and whether the full LocalBusiness entity is generated at all.
            </P>

            <H3>Business Type</H3>
            <P>
              Schema.org defines over 130 specific local business subtypes (Plumber, Dentist, Restaurant, RealEstateAgent, etc.). Choosing the most specific type helps Google categorize your business correctly. The dropdown includes all official Schema.org LocalBusiness subtypes. If your exact business type isn't listed, use the generic "LocalBusiness".
            </P>

            <H3>Organization / Brand Info</H3>
            <P>
              These fields create the core Organization entity. The <Code>brandName</Code> becomes the organization's <Code>name</Code>, <Code>brandDomain</Code> sets the base URL and <Code>@id</Code> root, and <Code>brandDescription</Code> provides the <Code>description</Code>. The logo URL creates an <Code>ImageObject</Code> entity linked via the <Code>logo</Code> property.
            </P>

            <H3>HQ Address</H3>
            <P>
              For multi-location businesses, this is the corporate/headquarters address that goes on the Organization entity. For single-location businesses, this may duplicate the location address. The address creates a <Code>PostalAddress</Code> entity.
            </P>

            <H3>Social Profiles</H3>
            <P>
              Every social URL you enter is added to the Organization's <Code>sameAs</Code> array. Google uses sameAs to verify your identity across the web and populate knowledge panels. Include all active profiles: Facebook, Instagram, X (Twitter), YouTube, LinkedIn, and Yelp.
            </P>

            <H3>Location Details</H3>
            <P>
              Location fields create or extend the LocalBusiness entity with a specific physical location. The latitude/longitude creates a <Code>GeoCoordinates</Code> entity. The city Wikipedia URL connects your location to the Knowledge Graph via sameAs. The location page URL becomes the entity's <Code>url</Code> property.
            </P>

            <H3>Business Hours</H3>
            <P>
              Hours create <Code>OpeningHoursSpecification</Code> entities. Choose a day preset (Mon-Fri, Mon-Sat, or Every Day) and set opening/closing times. These must match your GBP hours exactly. Inconsistent hours between schema and GBP is one of the most common local SEO mistakes.
            </P>

            <H3>Service Details</H3>
            <P>
              Service fields create a <Code>Service</Code> entity. On service-only pages, the service is linked to the Organization via <Code>provider</Code>. On service+location combo pages, it's linked to the LocalBusiness instead. The service Wikipedia URL connects to the Knowledge Graph for entity disambiguation.
            </P>

            <H3>Page / Article Details</H3>
            <P>
              Used primarily by the Blog/Article template. Creates an <Code>Article</Code> entity with headline, description, dates, and image. The <Code>datePublished</Code> and <Code>dateModified</Code> fields are critical for freshness signals, especially for AI search systems that prioritize recent content.
            </P>

            <H3>Author Details</H3>
            <P>
              Creates a <Code>Person</Code> entity linked to the Article. Named authors with profile pages strengthen E-E-A-T signals. The <Code>jobTitle</Code> property reinforces topical expertise, which is especially important for YMYL (Your Money or Your Life) content.
            </P>

            <H3>Topic Entities</H3>
            <P>
              Topic 1 and Topic 2 create <Code>Thing</Code> entities in the article's <Code>about</Code> property. Each topic can link to its Wikipedia article via sameAs. These Knowledge Graph connections are a key factor in getting your content cited by AI search engines.
            </P>

            <H3>Advanced Properties</H3>
            <P>
              Additional fields like the Google Maps URL (<Code>hasMap</Code>), dedicated contact point phone, contact type, and languages spoken. These aren't required but provide richer data for knowledge panels and local search features.
            </P>

            {/* @graph Pattern */}
            <H2 id="graph">The @graph Pattern</H2>
            <P>
              Instead of creating separate <Code>&lt;script type="application/ld+json"&gt;</Code> tags for each entity, this generator uses the <Code>@graph</Code> pattern. A single JSON-LD block contains an array of entities, all connected by <Code>@id</Code> references.
            </P>

            <CodeBlock title="Example @graph structure">
{`{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      "name": "Acme Plumbing",
      "url": "https://example.com"
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://example.com/#localBusiness",
      "name": "Acme Plumbing",
      "parentOrganization": {
        "@id": "https://example.com/#organization"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://example.com/#webpage",
      "about": {
        "@id": "https://example.com/#localBusiness"
      }
    }
  ]
}`}
            </CodeBlock>

            <P>
              The <Code>@id</Code> acts as an internal identifier. When one entity references another using <Code>{`{"@id": "..."}`}</Code>, Google understands they're connected. This creates a mini knowledge graph for your page, showing the relationships between your Organization, LocalBusiness, WebPage, Services, and more.
            </P>

            <Tip>
              The @id values use your domain as a prefix (e.g., <Code>https://example.com/#organization</Code>) to ensure uniqueness. The fragment identifier (#) after the URL is just a naming convention; these are not real page anchors.
            </Tip>

            {/* GBP Status Modes */}
            <H2 id="gbp">GBP Status Modes</H2>
            <P>
              Your Google Business Profile status fundamentally changes the schema structure. The generator supports four modes:
            </P>

            <H3>1. Verified GBP with Public Address</H3>
            <P>
              Full LocalBusiness entity with complete street address, GeoCoordinates, OpeningHoursSpecification, and all contact details. This is the richest schema and gives the best chance of appearing in local pack results. Your address is visible in the markup.
            </P>

            <H3>2. Verified GBP — Service Area Business (SAB)</H3>
            <P>
              The LocalBusiness entity is generated but the street address is omitted. The schema includes <Code>"publicAccess": false</Code> to signal this is a service area business. GeoCoordinates still use the city center or a representative point. The <Code>areaServed</Code> property lists your service area.
            </P>

            <H3>3. No GBP but Has a Physical Address</H3>
            <P>
              Creates a standard LocalBusiness entity with address but without the additional GBP-specific optimizations. Use this if your business has a physical location but hasn't set up a Google Business Profile yet.
            </P>

            <H3>4. Online-Only / No Physical Location</H3>
            <P>
              Only generates an Organization entity (no LocalBusiness). Suitable for online-only businesses, SaaS companies, or businesses that don't serve customers at a physical location. Social profiles and website information are still included.
            </P>

            {/* NAP Consistency */}
            <H2 id="nap">NAP Consistency</H2>
            <P>
              NAP stands for Name, Address, and Phone number. NAP consistency means your business information is identical everywhere it appears online: your website, schema markup, Google Business Profile, Yelp, Facebook, Apple Maps, and every other directory listing.
            </P>

            <Warning>
              Even small differences can hurt your local rankings. "123 Main St" vs "123 Main Street", or "(555) 123-4567" vs "555-123-4567" are inconsistencies that confuse search engines. Your schema must match your GBP listing character for character.
            </Warning>

            <P>
              The generator uses the phone number in E.164 international format (e.g., <Code>+18005551234</Code>) as the canonical format for schema. Make sure this exact format matches what you've entered in your GBP listing. The business name should be your legal/official name, not a keyword-stuffed version.
            </P>

            {/* BreadcrumbList */}
            <H2 id="breadcrumbs">BreadcrumbList Schema</H2>
            <P>
              BreadcrumbList schema tells search engines the navigational hierarchy of your page. It can appear as breadcrumb navigation in search results, helping users understand where the page sits in your site structure.
            </P>

            <CodeBlock title="BreadcrumbList example">
{`{
  "@type": "BreadcrumbList",
  "@id": "https://example.com/services/plumbing/#breadcrumb",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Services",
      "item": "https://example.com/services/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Plumbing"
    }
  ]
}`}
            </CodeBlock>

            <P>
              The generator can auto-generate breadcrumbs based on the template type, or you can enter custom breadcrumb levels (up to 4 levels deep). The last item (current page) doesn't need a URL. Toggle the breadcrumb section on or off using the checkbox.
            </P>

            {/* FAQ Schema */}
            <H2 id="faq">FAQ Schema</H2>
            <P>
              FAQPage schema marks up question-and-answer content on your page. While Google now limits FAQ rich results to government and health authority sites, the schema remains valuable because AI search engines (ChatGPT, Perplexity, Google AI Overviews) actively use FAQ markup to extract and cite answers.
            </P>

            <P>
              You can add FAQ schema to any page type, not just dedicated FAQ pages. If your service page, location page, or blog post has FAQ content, add the questions and answers. The generator supports up to 10 Q&A pairs per page. Write questions naturally, as users would ask them, and provide thorough but concise answers.
            </P>

            <Tip>
              FAQ schema only works if the questions and answers are actually visible on the page. Don't add FAQ schema for content that doesn't appear on the page, as this is considered misleading markup by Google.
            </Tip>

            {/* sameAs */}
            <H2 id="sameas">sameAs & the Knowledge Graph</H2>
            <P>
              The <Code>sameAs</Code> property is one of the most powerful tools for connecting your business to Google's Knowledge Graph. It tells search engines "this entity is the same as the entity described at these other URLs."
            </P>

            <H3>Social Profiles as sameAs</H3>
            <P>
              Your Facebook, Instagram, X, YouTube, LinkedIn, and Yelp URLs are added to the Organization's sameAs array. Google uses these to verify your online identity and can pull information from these profiles into your knowledge panel.
            </P>

            <H3>Wikipedia/Wikidata Links</H3>
            <P>
              The generator includes optional Wikipedia URL fields for locations, services, and content topics. Linking to Wikipedia articles via sameAs connects your entities to the Knowledge Graph, which is built largely from Wikidata. This is critical for AI search visibility, as research shows significantly higher citation rates for content with Knowledge Graph connections.
            </P>

            <P>
              For locations, link to the Wikipedia article for your city. For services, link to the Wikipedia article describing that type of service. For blog topics, link to the relevant Wikipedia articles about the subjects you're covering.
            </P>

            {/* E-E-A-T */}
            <H2 id="eeat">E-E-A-T Signals in Schema</H2>
            <P>
              E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trustworthiness. While E-E-A-T is not a direct ranking factor, Google's quality raters use it to evaluate search results, and structured data can reinforce these signals.
            </P>

            <H3>Experience & Expertise</H3>
            <P>
              Author schema with <Code>jobTitle</Code> demonstrates expertise. A blog post authored by "John Smith, Licensed Master Plumber" carries more weight than anonymous content. The author's profile page URL (<Code>authorUrl</Code>) should lead to a bio page that details their qualifications.
            </P>

            <H3>Authoritativeness</H3>
            <P>
              The Organization entity with its <Code>foundingDate</Code>, comprehensive sameAs links, and Knowledge Graph connections signals authority. Multi-location schema shows business scale. Service schema with detailed descriptions demonstrates domain coverage.
            </P>

            <H3>Trustworthiness</H3>
            <P>
              NAP consistency across schema and all citations builds trust. Complete and accurate business information (hours, address, phone) that matches your GBP listing tells Google your data is reliable. Including your GBP/Maps URL via <Code>hasMap</Code> provides another verification point.
            </P>

            {/* AI Search */}
            <H2 id="ai-search">AI Search Optimization (GEO/AEO)</H2>
            <P>
              Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO) are emerging disciplines focused on getting your content cited by AI-powered search engines. Schema markup plays a central role.
            </P>

            <H3>How AI Systems Use Schema</H3>
            <P>
              When ChatGPT, Perplexity, or Google AI Overviews crawl your page, they parse your JSON-LD to understand entities, relationships, and facts. FAQ schema gives them pre-formatted question-answer pairs ready to cite. Article schema with dates tells them how fresh your content is. sameAs links to Wikipedia help them disambiguate your entities.
            </P>

            <H3>Key Schema Properties for AI</H3>
            <P>
              <Code>dateModified</Code> is critical because AI systems prioritize fresh content. Update this every time you revise a page. <Code>sameAs</Code> with Wikipedia/Wikidata URLs dramatically increases citation likelihood. <Code>about</Code> entities with topic names and Wikipedia links help AI understand your content's scope. FAQ markup provides direct answers that AI can quote.
            </P>

            <H3>Entity Stacking</H3>
            <P>
              The @graph pattern itself is a form of entity stacking, as it combines multiple related entities (Organization, LocalBusiness, Service, WebPage, Article) into a connected graph. Each entity reinforces the others, giving AI systems a comprehensive picture of your business and content.
            </P>

            {/* Testing */}
            <H2 id="testing">Testing & Validation</H2>
            <P>
              Always validate your schema before deploying it. There are two complementary tools:
            </P>

            <H3>Schema.org Validator</H3>
            <P>
              Available at <Code>validator.schema.org</Code>, this tool checks your JSON-LD against the Schema.org specification. It validates syntax, property names, expected value types, and structural requirements. Use it to catch errors like wrong property names or invalid data types.
            </P>

            <H3>Google Rich Results Test</H3>
            <P>
              Available at <Code>search.google.com/test/rich-results</Code>, this tool checks whether your schema qualifies for Google's rich results (enhanced search listings). It's stricter than the Schema.org validator because Google has additional requirements beyond the base specification.
            </P>

            <P>
              The generator includes a built-in validation panel that checks for common issues like missing required fields, invalid URLs, and structural problems. Green checkmarks indicate valid entities; warnings suggest improvements.
            </P>

            <Warning>
              A passing validation doesn't guarantee rich results. Google decides which results get enhanced treatment based on many factors including content quality, site authority, and user behavior signals.
            </Warning>

            {/* Implementation */}
            <H2 id="implementation">Implementation Guide</H2>

            <H3>Where to Place the Script Tag</H3>
            <P>
              Paste the generated <Code>&lt;script type="application/ld+json"&gt;</Code> tag in your page's <Code>&lt;head&gt;</Code> or <Code>&lt;body&gt;</Code>. Google processes both locations equally, but placing it in the <Code>&lt;head&gt;</Code> is cleaner and ensures it's parsed before the page renders.
            </P>

            <H3>One Script Tag Per Page</H3>
            <P>
              The @graph pattern means you only need one JSON-LD script tag per page, containing all entities. Don't split entities into separate script tags as this can cause parsing issues and makes maintenance harder.
            </P>

            <H3>CMS-Specific Tips</H3>
            <P>
              <strong>WordPress:</strong> Use a plugin like Rank Math or Yoast for basic schema, then add custom JSON-LD via a theme's header template or a custom HTML block. Some themes have a "custom scripts in head" option.
            </P>
            <P>
              <strong>Shopify:</strong> Edit your theme's <Code>theme.liquid</Code> file and add the script tag before <Code>&lt;/head&gt;</Code>.
            </P>
            <P>
              <strong>Static Sites / React / Next.js:</strong> Add the JSON-LD as a script tag in your page component. In Next.js, use the <Code>&lt;Head&gt;</Code> component or the new metadata API.
            </P>
            <P>
              <strong>Google Tag Manager:</strong> You can deploy JSON-LD via GTM using a Custom HTML tag triggered on specific pages. This is useful when you don't have direct access to the page template.
            </P>

            <H3>Multi-Location Workflow</H3>
            <P>
              For businesses with multiple locations, use this workflow: First, fill in the Organization/Brand fields (these stay the same across all locations). Then, for each location, change the location-specific fields and generate a new script tag. Each location page gets its own unique JSON-LD with that location's address, phone, coordinates, and page URL.
            </P>

            {/* Troubleshooting */}
            <H2 id="troubleshooting">Troubleshooting</H2>

            <H3>Preview Shows "Enter brand name and domain to generate"</H3>
            <P>
              The Business Name and Website URL fields are required to generate any schema. Fill these in first, and the preview will start updating in real time.
            </P>

            <H3>Validation Errors for URLs</H3>
            <P>
              All URLs must include the protocol (<Code>https://</Code>). Common mistake: entering "example.com" instead of "https://example.com". The Website URL field should be your root domain without a trailing slash.
            </P>

            <H3>Phone Number Format</H3>
            <P>
              Phone numbers should be in E.164 international format: a plus sign, country code, and number with no spaces, dashes, or parentheses. For US numbers: <Code>+18005551234</Code>. The generator does not auto-format phone numbers, so enter them in this exact format.
            </P>

            <H3>Business Type Dropdown Not Showing</H3>
            <P>
              If the dropdown is hidden or cut off, try scrolling up slightly. The dropdown has a high z-index but can occasionally be affected by browser zoom levels or very narrow viewports.
            </P>

            <H3>FAQ Schema Not Appearing in Preview</H3>
            <P>
              FAQ entities are only added when at least one question-answer pair has both fields filled in. Empty Q&A rows are filtered out. Make sure you've entered text in both the Question and Answer fields.
            </P>

            <H3>Rich Results Not Showing in Google</H3>
            <P>
              Even with valid schema, Google doesn't guarantee rich results. Common reasons: the schema was just deployed (wait 1-2 weeks for re-crawling), the page doesn't rank well enough, Google has chosen not to display rich results for that query, or the content doesn't match the schema (misleading markup).
            </P>

            {/* Glossary */}
            <H2 id="glossary">Glossary</H2>
            <div className="my-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 pr-4 font-semibold text-gray-800">Term</th>
                    <th className="text-left py-2 font-semibold text-gray-800">Definition</th>
                  </tr>
                </thead>
                <tbody>
                  <TableRow label="JSON-LD" description="JavaScript Object Notation for Linked Data. Google's preferred format for structured data markup embedded in web pages." />
                  <TableRow label="@graph" description="A JSON-LD pattern that bundles multiple entities into a single script tag, connected by @id references." />
                  <TableRow label="@id" description="A unique identifier for an entity within a JSON-LD graph. Used to reference one entity from another." />
                  <TableRow label="@type" description="Declares the Schema.org type of an entity (e.g., Organization, LocalBusiness, Service)." />
                  <TableRow label="sameAs" description="A property that links an entity to equivalent representations on other websites (social profiles, Wikipedia, etc.)." />
                  <TableRow label="Schema.org" description="A collaborative vocabulary (Google, Bing, Yahoo, Yandex) that defines types and properties for structured data." />
                  <TableRow label="Rich Results" description="Enhanced search result formats (stars, FAQs, breadcrumbs, etc.) triggered by valid structured data." />
                  <TableRow label="Knowledge Graph" description="Google's database of entities and relationships, built from structured data, Wikipedia, and other authoritative sources." />
                  <TableRow label="Knowledge Panel" description="The information box that appears on the right side of Google search results for recognized entities." />
                  <TableRow label="GBP" description="Google Business Profile (formerly Google My Business / GMB). The listing that appears in Google Maps and local search results." />
                  <TableRow label="SAB" description="Service Area Business. A business that serves customers at their locations rather than at a physical storefront." />
                  <TableRow label="NAP" description="Name, Address, Phone number. The core business information that must be consistent across all online directories." />
                  <TableRow label="E-E-A-T" description="Experience, Expertise, Authoritativeness, Trustworthiness. Google's quality guidelines for evaluating content." />
                  <TableRow label="YMYL" description="Your Money or Your Life. Content categories (health, finance, legal) where Google applies stricter quality standards." />
                  <TableRow label="GEO" description="Generative Engine Optimization. Optimizing content to be cited by AI-powered search engines." />
                  <TableRow label="AEO" description="Answer Engine Optimization. Optimizing content to appear in AI-generated answers and featured snippets." />
                  <TableRow label="Entity Stacking" description="The practice of combining multiple connected schema entities to create a richer knowledge graph representation." />
                  <TableRow label="E.164" description="International phone number format: +[country code][number] with no spaces or punctuation (e.g., +18005551234)." />
                  <TableRow label="Canonical URL" description="The preferred URL for a page when multiple URLs might serve the same content. Used in schema as the page's primary identifier." />
                  <TableRow label="PostalAddress" description="A Schema.org type for structured address data with properties like streetAddress, addressLocality, addressRegion, postalCode." />
                  <TableRow label="GeoCoordinates" description="A Schema.org type for latitude/longitude positioning, used to pinpoint business locations on maps." />
                  <TableRow label="OpeningHoursSpecification" description="A Schema.org type that defines business operating hours for specific days of the week." />
                </tbody>
              </table>
            </div>

            {/* Back to generator */}
            <div className="mt-12 mb-8 p-6 bg-brand-50 border border-brand-200 rounded-xl text-center">
              <h3 className="text-lg font-semibold text-brand-900 mb-2">Ready to generate your schema?</h3>
              <p className="text-sm text-brand-700 mb-4">Head back to the generator and start building your JSON-LD structured data.</p>
              <a
                href="#/"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg bg-brand-700 text-white hover:bg-brand-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Open the Generator
              </a>
            </div>
          </article>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-gray-500">
          <span>Local Business Schema Generator — Documentation</span>
          <div className="flex gap-4">
            <a href="#/" className="hover:text-brand-600">Generator</a>
            <a href="https://schema.org/LocalBusiness" target="_blank" rel="noopener" className="hover:text-brand-600">Schema.org Reference</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
