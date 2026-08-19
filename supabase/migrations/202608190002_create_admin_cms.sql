create schema if not exists private;

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('owner', 'admin', 'editor')),
  display_name text not null check (char_length(display_name) between 2 and 100),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_profiles
    where user_id = (select auth.uid()) and active = true
  );
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.inquiry_notes (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  author_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 2 and 140),
  summary text not null check (char_length(summary) between 20 and 400),
  description text not null default '',
  story text[] not null default '{}',
  challenge text not null default '',
  approach text not null default '',
  outcome text not null default '',
  client_name text,
  location text not null default '',
  category text not null default 'Commercial',
  completion_year integer check (completion_year is null or completion_year between 1900 and 2200),
  project_size text,
  delivery_method text,
  services text[] not null default '{}',
  hero_image_path text,
  hero_image_url text,
  hero_image_alt text,
  hero_image_width integer,
  hero_image_height integer,
  metrics jsonb not null default '[]'::jsonb,
  seo_title text check (seo_title is null or char_length(seo_title) <= 70),
  seo_description text check (seo_description is null or char_length(seo_description) <= 180),
  og_image_path text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  storage_path text,
  public_url text not null,
  alt_text text not null default '',
  width integer,
  height integer,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 2 and 140),
  number text not null default '01' check (char_length(number) <= 8),
  summary text not null check (char_length(summary) between 20 and 400),
  description text not null default '',
  capabilities text[] not null default '{}',
  related_project_slugs text[] not null default '{}',
  image_path text,
  image_url text,
  image_alt text,
  image_width integer,
  image_height integer,
  seo_title text check (seo_title is null or char_length(seo_title) <= 70),
  seo_description text check (seo_description is null or char_length(seo_description) <= 180),
  active boolean not null default true,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content (
  key text primary key check (key ~ '^[a-z0-9]+(?:[._-][a-z0-9]+)*$'),
  section text not null,
  label text not null,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key check (key ~ '^[a-z0-9]+(?:[._-][a-z0-9]+)*$'),
  label text not null,
  value jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'project-media',
  storage_path text not null unique,
  public_url text not null,
  file_name text not null,
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp', 'image/avif')),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 8388608),
  width integer,
  height integer,
  alt_text text not null default '',
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists inquiry_notes_inquiry_idx on public.inquiry_notes(inquiry_id, created_at desc);
create index if not exists projects_public_idx on public.projects(status, featured, sort_order, updated_at desc);
create index if not exists project_images_project_idx on public.project_images(project_id, sort_order);
create index if not exists services_public_idx on public.services(active, sort_order, updated_at desc);
create index if not exists media_assets_created_idx on public.media_assets(created_at desc);

drop trigger if exists admin_profiles_updated_at on public.admin_profiles;
create trigger admin_profiles_updated_at before update on public.admin_profiles for each row execute function private.set_updated_at();
drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at before update on public.projects for each row execute function private.set_updated_at();
drop trigger if exists services_updated_at on public.services;
create trigger services_updated_at before update on public.services for each row execute function private.set_updated_at();
drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at before update on public.site_content for each row execute function private.set_updated_at();
drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings for each row execute function private.set_updated_at();
drop trigger if exists inquiries_updated_at on public.inquiries;
create trigger inquiries_updated_at before update on public.inquiries for each row execute function private.set_updated_at();

alter table public.admin_profiles enable row level security;
alter table public.inquiry_notes enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.services enable row level security;
alter table public.site_content enable row level security;
alter table public.site_settings enable row level security;
alter table public.media_assets enable row level security;

revoke all on public.admin_profiles, public.inquiry_notes, public.projects, public.project_images,
  public.services, public.site_content, public.site_settings, public.media_assets from anon, authenticated;
grant select on public.projects, public.project_images, public.services, public.site_content, public.site_settings to anon;
grant select, insert, update, delete on public.admin_profiles, public.inquiry_notes, public.projects,
  public.project_images, public.services, public.site_content, public.site_settings, public.media_assets to authenticated;
grant select, update on public.inquiries to authenticated;
grant select, insert, update, delete on public.admin_profiles, public.inquiry_notes, public.projects,
  public.project_images, public.services, public.site_content, public.site_settings, public.media_assets to service_role;

drop policy if exists "admins read profiles" on public.admin_profiles;
drop policy if exists "admins manage profiles" on public.admin_profiles;
drop policy if exists "admins manage inquiries" on public.inquiries;
drop policy if exists "admins update inquiries" on public.inquiries;
drop policy if exists "admins manage inquiry notes" on public.inquiry_notes;
drop policy if exists "public reads published projects" on public.projects;
drop policy if exists "authenticated reads projects" on public.projects;
drop policy if exists "admins manage projects" on public.projects;
drop policy if exists "public reads published project images" on public.project_images;
drop policy if exists "authenticated reads project images" on public.project_images;
drop policy if exists "admins manage project images" on public.project_images;
drop policy if exists "public reads active services" on public.services;
drop policy if exists "authenticated reads services" on public.services;
drop policy if exists "admins manage services" on public.services;
drop policy if exists "public reads site content" on public.site_content;
drop policy if exists "admins manage site content" on public.site_content;
drop policy if exists "public reads public settings" on public.site_settings;
drop policy if exists "authenticated reads settings" on public.site_settings;
drop policy if exists "admins manage settings" on public.site_settings;
drop policy if exists "admins manage media metadata" on public.media_assets;

create policy "admins read profiles" on public.admin_profiles for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy "admins manage profiles" on public.admin_profiles for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins manage inquiries" on public.inquiries for select to authenticated using ((select private.is_admin()));
create policy "admins update inquiries" on public.inquiries for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins manage inquiry notes" on public.inquiry_notes for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()) and author_id = (select auth.uid()));
create policy "public reads published projects" on public.projects for select to anon
  using (status = 'published');
create policy "authenticated reads projects" on public.projects for select to authenticated
  using (status = 'published' or (select private.is_admin()));
create policy "admins manage projects" on public.projects for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "public reads published project images" on public.project_images for select to anon
  using (exists (select 1 from public.projects p where p.id = project_id and p.status = 'published'));
create policy "authenticated reads project images" on public.project_images for select to authenticated
  using (exists (select 1 from public.projects p where p.id = project_id));
create policy "admins manage project images" on public.project_images for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "public reads active services" on public.services for select to anon using (active = true);
create policy "authenticated reads services" on public.services for select to authenticated
  using (active = true or (select private.is_admin()));
create policy "admins manage services" on public.services for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "public reads site content" on public.site_content for select to anon, authenticated using (true);
create policy "admins manage site content" on public.site_content for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "public reads public settings" on public.site_settings for select to anon using (is_public = true);
create policy "authenticated reads settings" on public.site_settings for select to authenticated
  using (is_public = true or (select private.is_admin()));
create policy "admins manage settings" on public.site_settings for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins manage media metadata" on public.media_assets for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-media', 'project-media', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public reads project media" on storage.objects;
drop policy if exists "admins upload project media" on storage.objects;
drop policy if exists "admins update project media" on storage.objects;
drop policy if exists "admins delete project media" on storage.objects;

create policy "public reads project media" on storage.objects for select to public
  using (bucket_id = 'project-media');
create policy "admins upload project media" on storage.objects for insert to authenticated
  with check (bucket_id = 'project-media' and (select private.is_admin()));
create policy "admins update project media" on storage.objects for update to authenticated
  using (bucket_id = 'project-media' and (select private.is_admin()))
  with check (bucket_id = 'project-media' and (select private.is_admin()));
create policy "admins delete project media" on storage.objects for delete to authenticated
  using (bucket_id = 'project-media' and (select private.is_admin()));

insert into public.site_content (key, section, label, value) values
  ('home.hero', 'Homepage', 'Hero', '{"heading":"We Build What''s Next.","description":"Construction shaped by clarity, craft, and accountability.","cta":"Start a Project"}'::jsonb),
  ('home.about', 'Homepage', 'About', '{"heading":"Built on responsibility.","body":"Northline brings disciplined leadership to complex construction."}'::jsonb),
  ('home.stats', 'Homepage', 'Company statistics', '{"items":[{"value":"42","label":"Years building"},{"value":"18","label":"Markets served"},{"value":"94%","label":"Repeat clients"}]}'::jsonb),
  ('home.testimonials', 'Homepage', 'Testimonials', '{"items":[]}'::jsonb)
on conflict (key) do nothing;

insert into public.site_settings (key, label, value, is_public) values
  ('business', 'Business information', '{"name":"Northline Construction & Development","email":"hello@northlinebuild.com","phone":"+1 212 555 0147","address":"110 West 40th Street, New York, NY 10018","hours":"Monday–Friday, 8:00–17:00"}'::jsonb, true),
  ('social', 'Social links', '{"linkedin":"","instagram":""}'::jsonb, true),
  ('seo', 'Default SEO', '{"title":"Northline Construction & Development","description":"Building exceptional spaces through precision, craftsmanship, and uncompromising standards."}'::jsonb, true)
on conflict (key) do nothing;

comment on function private.is_admin() is 'RLS helper. True only for active rows in admin_profiles.';
comment on table public.media_assets is 'Metadata only; image binaries live in Supabase Storage.';
