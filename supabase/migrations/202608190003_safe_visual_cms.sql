create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null check (char_length(client_name) between 2 and 120),
  company text check (company is null or char_length(company) <= 160),
  job_title text check (job_title is null or char_length(job_title) <= 160),
  quote text not null check (char_length(quote) between 20 and 800),
  avatar_path text,
  avatar_url text,
  avatar_alt text check (avatar_alt is null or char_length(avatar_alt) <= 300),
  project_id uuid references public.projects(id) on delete set null,
  featured boolean not null default false,
  sort_order integer not null default 0 check (sort_order between -1000 and 1000),
  published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects add column if not exists og_image_url text;
alter table public.projects add column if not exists canonical_url text;
alter table public.projects add column if not exists project_value text;

alter table public.services add column if not exists icon text;
alter table public.services add column if not exists og_image_path text;
alter table public.services add column if not exists og_image_url text;
alter table public.services add column if not exists canonical_url text;

create index if not exists testimonials_public_idx
  on public.testimonials(published, featured, sort_order, updated_at desc);

drop trigger if exists testimonials_updated_at on public.testimonials;
create trigger testimonials_updated_at before update on public.testimonials
  for each row execute function private.set_updated_at();

alter table public.testimonials enable row level security;
revoke all on public.testimonials from anon, authenticated;
grant select on public.testimonials to anon;
grant select, insert, update, delete on public.testimonials to authenticated;
grant select, insert, update, delete on public.testimonials to service_role;

drop policy if exists "public reads published testimonials" on public.testimonials;
drop policy if exists "authenticated reads testimonials" on public.testimonials;
drop policy if exists "admins manage testimonials" on public.testimonials;

create policy "public reads published testimonials" on public.testimonials
  for select to anon using (published = true);
create policy "authenticated reads testimonials" on public.testimonials
  for select to authenticated using (published = true or (select private.is_admin()));
create policy "admins manage testimonials" on public.testimonials
  for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

insert into public.site_content (key, section, label, value) values
  ('home.services', 'Homepage', 'Services', '{"visible":true,"eyebrow":"03 / What We Do","heading":"Expertise","subheading":"","layout":"list"}'::jsonb),
  ('home.projects', 'Homepage', 'Featured projects', '{"visible":true,"eyebrow":"02 / Featured Projects","heading":"Selected Work","subheading":"","layout":"editorial"}'::jsonb),
  ('home.cta', 'Homepage', 'Call to action', '{"visible":true,"eyebrow":"Have a project in mind?","heading":"Let''s build something remarkable.","description":"","buttonText":"Start a Project","buttonUrl":"/request-a-quote","image":null}'::jsonb),
  ('home.seo', 'Homepage', 'Homepage SEO', '{"title":"Northline Construction & Development | Building What''s Next","description":"Building exceptional spaces through precision, craftsmanship, and uncompromising standards.","canonical":"/","ogImage":null}'::jsonb)
on conflict (key) do nothing;

insert into public.site_settings (key, label, value, is_public) values
  ('footer', 'Footer', '{"description":"Construction and development shaped by clarity, craft, and accountability.","copyright":"© 2026 Northline Construction & Development","contactCta":"Start a Project"}'::jsonb, true),
  ('seo.projects', 'Projects SEO', '{"title":"Projects","description":"Explore selected Northline construction projects.","canonical":"/projects","ogImage":null}'::jsonb, true),
  ('seo.services', 'Services SEO', '{"title":"Services","description":"Construction expertise from preconstruction through final delivery.","canonical":"/services","ogImage":null}'::jsonb, true)
on conflict (key) do nothing;

comment on table public.testimonials is 'Client testimonials managed through the protected Northline visual CMS.';
