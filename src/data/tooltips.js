// Tooltip descriptions for all form fields
// Each key matches the field's "name" prop or a section identifier

export const FIELD_TIPS = {
  // GBP Status
  gbpStatus: "Google Business Profile (GBP) determines how your LocalBusiness schema is structured. If you have a verified GBP with a public address, you'll get the most complete schema. Service Area Businesses (SABs) hide the street address. Businesses without a GBP can still use schema markup.",

  // Business Type
  businessType: "The Schema.org type that best matches your business. Google uses this to understand your business category. Choose the most specific type available — e.g. 'Plumber' instead of generic 'LocalBusiness'. This maps to the @type property in your schema.",

  // Organization / Brand Info
  brandName: "Your official business name, exactly as it appears on your Google Business Profile and other directories. NAP (Name, Address, Phone) consistency is critical for local SEO — use the identical spelling everywhere.",
  brandDomain: "Your website's root URL without a trailing slash (e.g. https://acmeplumbing.com). This becomes the base for all @id references in your schema graph, linking entities together across pages.",
  brandDescription: "A brief 1-2 sentence description of what your business does. This appears in the Organization schema and helps search engines and AI systems understand your business at a glance.",
  brandLogoUrl: "Direct URL to your business logo image. Google recommends a high-resolution image (at least 112x112px). This creates an ImageObject entity linked to your Organization.",
  brandPhone: "Your primary business phone in E.164 international format (e.g. +18005551234). This should match your GBP listing and all directory citations exactly for NAP consistency.",
  brandEmail: "Your primary business contact email. This is added to the Organization entity and can appear in knowledge panels.",
  foundingDate: "The year your business was established. This builds trust signals and can appear in knowledge panels. Google values established businesses in local results.",

  // HQ Address
  hqStreet: "Your headquarters or primary business street address. For multi-location businesses, this is the main office address that goes in the Organization entity.",
  hqCity: "The city where your headquarters is located.",
  hqState: "State abbreviation for your headquarters (e.g. CO, TX, CA). Used in the PostalAddress of your Organization entity.",
  hqZip: "ZIP/postal code for your headquarters.",
  addressCountry: "Two-letter ISO country code (e.g. US, CA, GB). Defaults to US. Tells Google which country your business operates in.",

  // Social Profiles
  facebookUrl: "Your Facebook business page URL. Added to the sameAs array, which helps Google connect your social profiles to your business entity and can populate knowledge panels.",
  instagramUrl: "Your Instagram business profile URL. Part of sameAs — strengthens your entity's presence across the web.",
  twitterUrl: "Your X (formerly Twitter) profile URL. Part of sameAs — Google uses these to verify and connect your online identity.",
  youtubeUrl: "Your YouTube channel URL. Part of sameAs — video content signals authority and can appear in search results.",
  linkedinUrl: "Your LinkedIn company page URL. Part of sameAs — adds professional credibility to your entity profile.",
  yelpUrl: "Your Yelp business listing URL. Part of sameAs — especially important for local businesses as Yelp is a major citation source.",

  // Location Details
  locationCity: "The city name for this location. Used in the LocalBusiness address and areaServed. Must match your GBP listing exactly.",
  locationState: "Full state name (e.g. 'Tennessee' not 'TN'). Used in areaServed for entity disambiguation. Google uses this to understand your geographic coverage.",
  locationStateAbbr: "Two-letter state abbreviation (e.g. TN). Used in the PostalAddress addressRegion field. Must match your GBP and citation listings.",
  locationSlug: "URL-friendly version of the city-state (e.g. 'nashville-tn'). Used to build unique @id references for each location's schema entities.",
  locationStreet: "Street address for this location. Hidden for SAB businesses. Must exactly match your GBP listing — even small differences (St vs Street) can hurt local rankings.",
  locationZip: "ZIP code for this location. Part of the PostalAddress and helps with geographic precision in local search results.",
  locationPhone: "Local phone number for this specific location in E.164 format. If different from your main number, helps Google associate the right phone with the right location.",
  locationLat: "Latitude coordinate for this location (e.g. 36.1627). Combined with longitude, creates a GeoCoordinates entity that helps Google pinpoint your business on Maps.",
  locationLng: "Longitude coordinate for this location (e.g. -86.7816). Use Google Maps to find exact coordinates — right-click any location and copy the coordinates.",
  locationPageUrl: "The full URL of this location's dedicated page on your website. Becomes the 'url' property of the LocalBusiness entity.",
  locationImage: "URL of a photo representing this location (storefront, office, team). Google may display this image in local search results and Maps.",
  locationWiki: "Wikipedia URL for this city (e.g. https://en.wikipedia.org/wiki/Nashville,_Tennessee). Links your location to the Knowledge Graph via sameAs, increasing AI citation rates by up to 2.5x.",
  stateWiki: "Wikipedia URL for the state. Adds another layer of entity disambiguation to your areaServed, strengthening geographic signals.",

  // Business Hours
  hoursDaysPreset: "Select which days your business is open. This creates OpeningHoursSpecification in your schema, which Google uses for local pack results and Maps info.",
  hoursOpen: "Opening time in 24-hour format (e.g. 08:00). Part of your OpeningHoursSpecification. Must match your GBP hours.",
  hoursClose: "Closing time in 24-hour format (e.g. 17:00). Part of your OpeningHoursSpecification. Must match your GBP hours.",
  priceRange: "Price tier indicator ($, $$, $$$, or $$$$). Helps users gauge affordability and can appear in local search results alongside your listing.",
  paymentAccepted: "Comma-separated list of payment methods you accept (e.g. 'Cash, Credit Card, PayPal'). Provides useful information in structured data.",

  // Service Details
  serviceName: "The name of the specific service you offer. This becomes the name of the Service entity. Be specific — 'Emergency Plumbing Repair' is better than 'Plumbing'.",
  serviceSlug: "URL-friendly version of the service name (e.g. 'emergency-plumbing-repair'). Used to build unique @id references for the Service entity.",
  serviceDescription: "Detailed description of what this service includes. This helps AI systems understand and cite your services when answering related queries.",
  serviceType: "The type or category label for this service (e.g. 'Emergency Repair'). Maps to the serviceType property in Schema.org.",
  serviceCategory: "Broader category this service belongs to (e.g. 'Plumbing'). Helps Google classify your service within its taxonomy.",
  servicePageUrl: "Full URL of the dedicated service page on your website. Links the Service entity to its canonical page.",
  serviceImage: "URL of an image representing this service. May appear in rich results for service-related searches.",
  serviceWiki: "Wikipedia URL for this type of service (e.g. https://en.wikipedia.org/wiki/Plumbing). Connects your service to the Knowledge Graph for entity disambiguation.",

  // Page / Article Details
  pageTitle: "The H1 title of this page. Maps to the 'headline' property in Article schema. Keep it under 110 characters for optimal display in search results.",
  pageDescription: "Meta description for the page. Used in the Article 'description' property. This often appears as the snippet in search results — make it compelling.",
  pageUrl: "The canonical URL of this page. Becomes the mainEntityOfPage and is used to build unique @id references for the page's schema entities.",
  pageImage: "URL of the main image for this page (hero image, featured image). Used in Article schema and can appear as a thumbnail in search results.",
  datePublished: "The date this page was first published (ISO 8601). Important for Article schema — Google uses this for freshness signals and may display it in search results.",
  dateModified: "The date this page was last updated. Critical for AI search — ChatGPT, Perplexity, and Google AI Overviews use this to determine content freshness. Update it whenever you revise the page.",

  // Author Details
  authorName: "The name of the content author. Creates a Person entity linked to your Organization. Named authors boost E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals.",
  authorUrl: "URL of the author's profile page on your site (e.g. /team/john-smith/). Links the Person entity to their bio page, strengthening author authority.",
  authorTitle: "The author's job title or role (e.g. 'Senior Plumbing Technician'). Maps to the jobTitle property and reinforces topical expertise.",
  blogSectionName: "Display name for the blog/resource section in breadcrumbs (e.g. 'Blog', 'Resources', 'Articles'). Appears in BreadcrumbList navigation.",
  blogSectionSlug: "URL slug for the blog section (e.g. 'blog', 'resources'). Used in breadcrumb URLs to match your site structure.",

  // Topic Entities
  topic1Name: "Primary topic this content is about. Creates a 'Thing' entity in the article's 'about' property, helping Google understand the topical focus of your content.",
  topic1Wiki: "Wikipedia URL for Topic 1 (e.g. https://en.wikipedia.org/wiki/Roofing). Connects your content to Knowledge Graph entities — key for AI search citations.",
  topic2Name: "Secondary topic this content covers. Additional about entities give Google and AI systems a richer understanding of your content's scope.",
  topic2Wiki: "Wikipedia URL for Topic 2. More Knowledge Graph connections = better entity disambiguation and higher chances of AI citation.",

  // Breadcrumb
  enableBreadcrumb: "BreadcrumbList schema helps Google understand your site hierarchy and can display breadcrumb navigation in search results. Recommended for all page types.",
  breadcrumb1Name: "First level of your breadcrumb trail (usually 'Home'). Breadcrumbs show search engines and AI the navigational path to this page.",
  breadcrumb1Url: "URL for the first breadcrumb level (usually your homepage URL).",
  breadcrumb2Name: "Second level of your breadcrumb (e.g. 'Services', 'Locations', 'Blog'). Should match your site's actual navigation structure.",
  breadcrumb2Url: "URL for the second breadcrumb level.",
  breadcrumb3Name: "Third level of your breadcrumb (e.g. specific service or subcategory). Leave blank if your page is only 2 levels deep.",
  breadcrumb3Url: "URL for the third breadcrumb level.",
  breadcrumb4Name: "Final breadcrumb level — the current page. No URL needed since this represents where the user currently is.",

  // FAQ
  faqQuestion: "A question your customers commonly ask. FAQ schema helps AI assistants (ChatGPT, Perplexity, Google AI Overviews) extract and cite your answers directly. Write questions naturally, as users would ask them.",
  faqAnswer: "The answer to this FAQ question. Be thorough but concise — AI systems prefer clear, direct answers. Include relevant details that demonstrate expertise.",

  // FAQ Page Settings
  faqSectionName: "Display name for the FAQ section in breadcrumbs. Only used with the dedicated FAQ page template.",
  faqSectionSlug: "URL slug for the FAQ section (e.g. 'faq'). Used in breadcrumb URLs.",

  // Search Action
  searchUrlTemplate: "Your site's search URL with {search_term_string} as the query placeholder. Enables Google's Sitelinks Search Box, which adds a search field directly in your search result. Leave blank if your site doesn't have search functionality.",

  // Geo Coordinates (HQ)
  hqLat: "Latitude coordinate for your business headquarters (e.g. 45.7833). Creates a GeoCoordinates entity for map accuracy in local search results.",
  hqLng: "Longitude coordinate for your business headquarters (e.g. -108.5007). Right-click on Google Maps to find exact coordinates.",

  // Additional Business Signals
  slogan: "Your business tagline or slogan. Maps to the slogan property in Schema.org and can appear in knowledge panels.",
  knowsAboutText: "Comma-separated list of topics your business specializes in (e.g. 'Roofing, Solar Energy, Hail Damage Repair'). Creates knowsAbout entries that help Google understand your expertise areas.",
  aggregateRatingValue: "Your average star rating from a third-party review platform (Google, Yelp, BBB). Maps to the aggregateRating property. Use the exact value from the platform.",
  aggregateRatingCount: "Total number of reviews on the platform you're citing. Must match the real count — Google can verify this against your GBP listing.",
  currenciesAccepted: "Currency codes your business accepts (e.g. USD, CAD). Defaults to USD.",

  // Advanced Properties
  hasMap: "Your Google Maps URL or Google Business Profile URL (e.g. https://maps.google.com/?cid=...). Creates the hasMap property linking your LocalBusiness to Google Maps.",
  contactPointPhone: "A dedicated customer service phone number. Creates a ContactPoint entity separate from your main business phone — useful for businesses with different departments.",
  contactPointType: "The type of contact point (e.g. 'customer service', 'technical support', 'sales'). Helps Google understand what this phone number is for.",
  contactLanguages: "Languages spoken at this contact point (comma-separated). Useful for multilingual businesses — Google may display this in knowledge panels.",
};

// Section-level tooltips
export const SECTION_TIPS = {
  gbpStatus: "Your GBP status determines the schema structure. Businesses with verified GBP profiles get richer LocalBusiness markup. SABs use a special pattern with publicAccess: false.",
  businessType: "Choose the most specific Schema.org business type for your industry. A specific type (e.g. Plumber, Dentist) performs better than the generic 'LocalBusiness' in search results.",
  orgInfo: "Core business information that appears in the Organization entity — the foundation of all your schema markup. This data should match your GBP and directory listings exactly.",
  hqAddress: "Your headquarters or primary business address. For single-location businesses, this may be the same as your location address. For multi-location businesses, this is the corporate office.",
  socialProfiles: "Social media URLs are added to the Organization's sameAs array. Google uses these to verify your online identity, populate knowledge panels, and strengthen your entity profile across the web.",
  locationDetails: "Location-specific data creates a LocalBusiness entity linked to your Organization. Each field should match your GBP listing exactly — inconsistencies between schema, GBP, and citations can hurt rankings.",
  businessHours: "Opening hours appear in local search results and Maps. Must match your GBP hours exactly. Inconsistent hours between schema and GBP is a common local SEO mistake.",
  serviceDetails: "Service entities describe what you offer. For 'service in city' pages, the service is linked to the LocalBusiness. For standalone service pages, it's linked to the Organization.",
  pageArticle: "Page and article details create the Article entity. The headline, dates, and description are key signals for both traditional search results and AI-generated answers.",
  authorDetails: "Author information strengthens E-E-A-T signals. Google values content attributed to named experts, especially for YMYL (Your Money or Your Life) topics.",
  topicEntities: "Topic entities connect your content to the Knowledge Graph via Wikipedia/Wikidata. Research shows schema with sameAs links gets up to 2.5x higher citation rates in AI answers.",
  breadcrumb: "BreadcrumbList shows Google your page hierarchy. It can display as breadcrumb navigation in search results and helps with site structure understanding.",
  faq: "FAQ schema can be added to any page type. While Google now limits FAQ rich results to government/health sites, the schema still helps AI search engines (ChatGPT, Perplexity, Google AI Overviews) extract and cite your content.",
  searchAction: "SearchAction enables Google's Sitelinks Search Box — a search field that appears directly in your search result on Google. Only works for sites with their own search functionality.",
  serviceArea: "Define the geographic areas your business serves. Especially important for Service Area Businesses (SABs) that travel to customers rather than having a storefront.",
  servicesOffered: "List specific services your business offers. Creates a hasOfferCatalog with Service entities — helps Google and AI systems understand exactly what you provide.",
  additionalSignals: "Extra entity signals that strengthen your schema. knowsAbout topics, slogan, and aggregate ratings all contribute to richer knowledge panel data.",
  advanced: "Additional properties like Google Maps links and contact points. These aren't required but provide richer data for knowledge panels and local search features.",
};
