# Local Business JSON-LD Schema Generator

Free, client-side JSON-LD structured data generator for local SEO. Generates valid schema markup for 8 page types with 130+ business type options.

## Features

- **8 page templates**: Homepage, Location, Service, Service+Location Combo, Multi-Location Hub, Blog, FAQ, Organization Only
- **130+ business types**: Complete Schema.org LocalBusiness hierarchy with searchable dropdown
- **GBP-aware**: Handles businesses with/without Google Business Profile, SABs with hidden addresses
- **Real-time validation**: Checks required fields, URL/phone/date formats, and best practices
- **One-click copy**: Copy JSON-LD or full `<script>` tag to clipboard
- **External validator links**: Direct links to Schema.org Validator and Google Rich Results Test
- **Completeness score**: Visual indicator showing how well your schema covers recommended properties
- **Persistent forms**: Data saved to localStorage so you don't lose work

## Tech Stack

- React 19 + Vite 7
- Tailwind CSS 4
- 100% client-side (no backend)

## Development

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
```

Output goes to `dist/` folder.

### Cloudflare Pages

1. Push to GitHub
2. In Cloudflare Pages: connect repo, set build command to `npm run build`, output directory to `dist`
3. Deploy
