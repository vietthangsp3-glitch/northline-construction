# NORTHLINE Construction & Development

NORTHLINE is a production-oriented portfolio website and secured content studio for a fictional premium U.S. construction and development company. The public experience remains static-first while Supabase-backed admin routes manage portfolio, service, media, settings, and inquiry data.

## Tech stack

- Next.js 16 App Router and React 19
- Strict TypeScript
- Tailwind CSS 4 plus a restrained token-based CSS layer
- Geist through `next/font`
- `next/image` with AVIF and WebP delivery
- Zod server-side form validation
- Supabase Auth, PostgreSQL, Storage, and Row Level Security
- OpenNext deployment on Cloudflare Workers

Server Components are the default. Privileged data access and mutations stay server-side; browser JavaScript is limited to interactions that need it.

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
- `/admin/login` - Supabase Auth sign-in
- `/admin/dashboard` - live business/content overview
- `/admin/inquiries` and `/admin/inquiries/[id]` - inquiry workflow and internal notes
- `/admin/content/homepage` - guarded visual homepage editor and preview
- `/admin/content/testimonials` - testimonial publishing and ordering
- `/admin/projects`, `/admin/services` - portfolio and service editors with Storage media pickers
- `/admin/media` - searchable Supabase Storage media library
- `/admin/settings`, `/admin/settings/seo` - business, footer, global SEO, and social previews

## Project structure

```text
src/
|-- app/          Routes, metadata files, server actions, and global styles
|-- components/   Public and admin UI components
|-- data/         Typed content available at build time
|-- lib/          Supabase clients, authorization, data access, and shared utilities
|-- types/        Content contracts independent of the data source
```

## Content editing

- Projects: `src/data/projects.ts`
- Services: `src/data/services.ts`
- Team members: `src/data/team.ts`
- Insights: `src/data/insights.ts`
- Testimonials: `src/data/testimonials.ts`

The local project/service files remain a safe public fallback. Approved admins can import them into PostgreSQL from the admin lists; CMS records then override matching slugs. Draft or archived records suppress the matching fallback item.

## Environment variables

Copy `.env.example` to `.env.local` when a local override is needed.

- `NEXT_PUBLIC_SITE_URL`: canonical HTTPS production origin.
- `NEXT_PUBLIC_SUPABASE_URL`: public Supabase project URL used by the SSR client.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase publishable key; safe to expose and required for the recommended SSR setup.
- `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `INQUIRY_HASH_SECRET`: server-only inquiry persistence and trusted fallback configuration.
- `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`: stable server-only key shared by Cloudflare deployments.

All environment files except `.env.example` are ignored by Git. Never add the Supabase secret key or service-role credentials to a `NEXT_PUBLIC_` variable.

## Forms

Contact and quote forms use React Server Actions and Zod validation. Incoming values are normalized and validated on the server and select values are allow-listed. The global action limit is 8 MB for validated admin image uploads; inquiry fields retain strict per-field limits.

Valid inquiries are first persisted to Supabase PostgreSQL through its Data REST API. Demo deployments use `INQUIRY_DELIVERY_MODE=database-only` (also the safe default), so the form reports success after the database confirms the insert and does not call an email provider.

To enable transactional email later, set `INQUIRY_DELIVERY_MODE=email` and configure Resend. In email mode, the delivery status and provider message ID are written back to the inquiry record, and the form only reports success after Resend returns a delivery ID.

Apply `supabase/migrations/202608190001_create_inquiries.sql` in the Supabase SQL Editor or migration workflow. Configure `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `INQUIRY_HASH_SECRET` for persistence. Resend variables are optional unless `INQUIRY_DELIVERY_MODE=email`. These values are server-only and must never use the `NEXT_PUBLIC_` prefix.

The PostgreSQL `create_inquiry` function atomically enforces five submissions per ten-minute window before inserting a row. The request identifier is HMAC-SHA256 hashed before storage; raw IP addresses are never retained. Row Level Security is enabled, browser roles receive no table or function access, and only the server-side service role can execute the write path. A honeypot provides an additional low-cost spam signal.

## Admin setup

1. Apply `supabase/migrations/202608190002_create_admin_cms.sql` after the inquiry migration.
2. Apply `supabase/migrations/202608190003_safe_visual_cms.sql` to add testimonials and the additional project/service SEO fields. The migration is non-destructive and safe to run again.
3. In Supabase Authentication, create or invite the first administrator.
4. Approve that exact Auth user in the SQL Editor:

```sql
insert into public.admin_profiles (user_id, role, display_name)
select id, 'owner', 'Northline Owner'
from auth.users
where email = 'vietthangsp3@gmail.com';
```

5. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` locally and in Cloudflare. Keep server-only variables as encrypted Worker secrets.
6. Sign in at `/admin/login`, then use “Import current portfolio” once to make the starter projects and services editable.

Supabase Auth owns passwords and session rotation. The app stores the session in cookies through `@supabase/ssr`, verifies the user through the Auth server, and separately requires an active `admin_profiles` row. Proxy refresh is only an optimistic session step; every protected page and Server Action repeats authorization. Supabase Auth rate limits provide the first login-throttling layer.

The `project-media` bucket is public-read for website delivery but all upload, update, and delete operations require an approved active admin through Storage RLS. New assets use controlled prefixes under `site/homepage`, `site/projects`, `site/services`, `site/testimonials`, and `site/seo`. Image binaries stay in Storage; PostgreSQL stores metadata and object paths only. Referenced media is protected from deletion where practical.

## SEO and social sharing

The application includes per-page metadata, canonical URLs, Organization, Breadcrumb, and Article JSON-LD, an image sitemap, robots rules, a web manifest, favicon, and a generated 1200 by 630 Open Graph image.

## Security

The app disables the framework signature and sends HSTS, nosniff, frame-denial, strict referrer, opener isolation, DNS prefetch, and restrictive browser-permission headers.

A hard Content Security Policy is intentionally deferred until the final deployment and email/analytics providers are known. Next.js emits inline framework scripts; adding an untested generic CSP can break hydration. If CSP is required, deploy a nonce-based policy and verify every production route before enforcing it.

## Performance

- Static generation with 60-second revalidation for CMS-backed public routes, plus immediate path revalidation after Admin mutations where the runtime cache supports it
- One self-hosted variable font
- Stable image dimensions and responsive image sizes
- Hero images only are prioritized
- CSS motion with reduced-motion support
- Paginated inquiry reads and no heavyweight admin UI framework

## Deployment

### Vercel

Import the repository, use `npm run build`, and set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin. Attach the custom domain in the project settings and update DNS with the records Vercel provides.

### Cloudflare

The application uses OpenNext and Cloudflare Workers. Configure public build variables and encrypted server-only secrets in Cloudflare, keep `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` stable, then run `npm run deploy`. Supabase remains the backend for Auth, PostgreSQL, and Storage; no Cloudflare database or object store is required.

## Optional production integrations

- Transactional email delivery and provider-level rate limiting
- Cloudflare Turnstile for higher-volume public forms
- Privacy-respecting analytics and consent handling where legally required
- A nonce-based Content Security Policy matched to final providers
