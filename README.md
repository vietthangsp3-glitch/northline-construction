# NORTHLINE Construction & Development

NORTHLINE is a production-oriented portfolio website for a fictional premium U.S. construction and development company. It is static-first, accessible, responsive, inexpensive to host, and structured so local content can later be replaced by a headless CMS.

## Tech stack

- Next.js 16 App Router and React 19
- Strict TypeScript
- Tailwind CSS 4 plus a restrained token-based CSS layer
- Geist through `next/font`
- `next/image` with AVIF and WebP delivery
- Zod server-side form validation
- Local typed content with no database or CMS dependency

Server Components are the default. Client JavaScript is limited to the sticky/mobile navigation, project filtering, and form state.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Quality checks:

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

## Routes

- `/` - flagship homepage
- `/about` and `/team` - company and leadership
- `/projects` and `/projects/[slug]` - filterable portfolio and case studies
- `/services` and `/services/[slug]` - expertise overview and service pages
- `/insights` and `/insights/[slug]` - article archive and articles
- `/contact` and `/request-a-quote` - inquiry forms
- `/privacy`, `/terms`, custom 404, sitemap, robots, manifest, and generated Open Graph image

## Project structure

```text
src/
|-- app/          Routes, metadata files, server actions, and global styles
|-- components/   Layout, forms, homepage sections, projects, and UI primitives
|-- data/         Typed content available at build time
|-- lib/          Site configuration and shared utilities
|-- types/        Content contracts independent of the data source
```

## Content editing

- Projects: `src/data/projects.ts`
- Services: `src/data/services.ts`
- Team members: `src/data/team.ts`
- Insights: `src/data/insights.ts`
- Testimonials: `src/data/testimonials.ts`

Keep slugs unique, provide descriptive image alt text, and reference related records by slug. Dynamic project, service, and insight pages are generated automatically.

## Environment variables

Copy `.env.example` to `.env.local` when a local override is needed.

- `NEXT_PUBLIC_SITE_URL`: canonical HTTPS production origin used by metadata, structured data, sitemap, and robots. It defaults to `https://northlinebuild.com`.

No secrets are required for the current version. All environment files except `.env.example` are ignored by Git.

## Forms

Contact and quote forms use React Server Actions and Zod validation. Incoming values are normalized and validated on the server, select values are allow-listed, and action bodies are capped at 32 KB.

Valid inquiries are first persisted to Supabase PostgreSQL through its Data REST API. Demo deployments use `INQUIRY_DELIVERY_MODE=database-only` (also the safe default), so the form reports success after the database confirms the insert and does not call an email provider.

To enable transactional email later, set `INQUIRY_DELIVERY_MODE=email` and configure Resend. In email mode, the delivery status and provider message ID are written back to the inquiry record, and the form only reports success after Resend returns a delivery ID.

Apply `supabase/migrations/202608190001_create_inquiries.sql` in the Supabase SQL Editor or migration workflow. Configure `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `INQUIRY_HASH_SECRET` for persistence. Resend variables are optional unless `INQUIRY_DELIVERY_MODE=email`. These values are server-only and must never use the `NEXT_PUBLIC_` prefix.

The PostgreSQL `create_inquiry` function atomically enforces five submissions per ten-minute window before inserting a row. The request identifier is HMAC-SHA256 hashed before storage; raw IP addresses are never retained. Row Level Security is enabled, browser roles receive no table or function access, and only the server-side service role can execute the write path. A honeypot provides an additional low-cost spam signal.

## SEO and social sharing

The application includes per-page metadata, canonical URLs, Organization, Breadcrumb, and Article JSON-LD, an image sitemap, robots rules, a web manifest, favicon, and a generated 1200 by 630 Open Graph image.

## Security

The app disables the framework signature and sends HSTS, nosniff, frame-denial, strict referrer, opener isolation, DNS prefetch, and restrictive browser-permission headers.

A hard Content Security Policy is intentionally deferred until the final deployment and email/analytics providers are known. Next.js emits inline framework scripts; adding an untested generic CSP can break hydration. If CSP is required, deploy a nonce-based policy and verify every production route before enforcing it.

## Performance

- Static generation for content pages
- One self-hosted variable font
- Stable image dimensions and responsive image sizes
- Hero images only are prioritized
- CSS motion with reduced-motion support
- No database, authentication, smooth-scroll library, or UI framework

## Deployment

### Vercel

Import the repository, use `npm run build`, and set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin. Attach the custom domain in the project settings and update DNS with the records Vercel provides.

### Cloudflare

Use the current Cloudflare adapter for Next.js rather than assuming a static export: Server Actions require a compatible runtime. Set the same site URL variable and verify the contact forms in the preview deployment.

## Future CMS

Page components consume the contracts in `src/types/content.ts`. A future Sanity, Contentful, or Strapi adapter can map remote records to those contracts without redesigning the UI.

## Optional production integrations

- Transactional email delivery and provider-level rate limiting
- Cloudflare Turnstile for higher-volume public forms
- Privacy-respecting analytics and consent handling where legally required
- A nonce-based Content Security Policy matched to final providers
