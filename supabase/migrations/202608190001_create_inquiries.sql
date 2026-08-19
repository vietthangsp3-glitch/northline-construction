create extension if not exists pgcrypto;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  form_type text not null check (form_type in ('contact', 'quote')),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  phone text check (phone is null or char_length(phone) <= 30),
  company text check (company is null or char_length(company) <= 120),
  project_type text check (project_type is null or project_type in ('Commercial', 'Residential', 'Hospitality', 'Healthcare', 'Corporate', 'Renovation')),
  budget text check (budget is null or budget in ('Under $5 million', '$5 million - $20 million', '$20 million - $75 million', '$75 million - $200 million', '$200 million+')),
  location text check (location is null or char_length(location) <= 120),
  timeline text check (timeline is null or char_length(timeline) <= 120),
  message text not null check (char_length(message) between 20 and 2000),
  client_hash text not null check (char_length(client_hash) = 64),
  status text not null default 'received' check (status in ('received', 'delivered', 'delivery_failed', 'archived')),
  email_delivery_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    form_type = 'contact'
    or (project_type is not null and budget is not null and location is not null)
  )
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_client_rate_limit_idx on public.inquiries (client_hash, created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status, created_at desc);

alter table public.inquiries enable row level security;
revoke all on table public.inquiries from anon, authenticated;
grant select, insert, update on table public.inquiries to service_role;

create or replace function public.create_inquiry(
  p_form_type text,
  p_name text,
  p_email text,
  p_phone text,
  p_company text,
  p_project_type text,
  p_budget text,
  p_location text,
  p_timeline text,
  p_message text,
  p_client_hash text
)
returns table(result text, inquiry_id uuid, retry_after_seconds integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_recent_count integer;
  v_oldest_recent timestamptz;
  v_inquiry_id uuid;
  v_retry integer;
begin
  select count(*), min(created_at)
  into v_recent_count, v_oldest_recent
  from public.inquiries
  where client_hash = p_client_hash
    and created_at > now() - interval '10 minutes';

  if v_recent_count >= 5 then
    v_retry := greatest(1, ceil(extract(epoch from (v_oldest_recent + interval '10 minutes' - now())))::integer);
    return query select 'rate_limited'::text, null::uuid, v_retry;
    return;
  end if;

  insert into public.inquiries (
    form_type, name, email, phone, company, project_type, budget,
    location, timeline, message, client_hash
  ) values (
    p_form_type,
    p_name,
    p_email,
    nullif(p_phone, ''),
    nullif(p_company, ''),
    nullif(p_project_type, ''),
    nullif(p_budget, ''),
    nullif(p_location, ''),
    nullif(p_timeline, ''),
    p_message,
    p_client_hash
  ) returning id into v_inquiry_id;

  return query select 'created'::text, v_inquiry_id, 0;
end;
$$;

revoke all on function public.create_inquiry(text, text, text, text, text, text, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.create_inquiry(text, text, text, text, text, text, text, text, text, text, text) to service_role;

comment on table public.inquiries is 'Contact and project inquiries submitted through the Northline website.';
comment on column public.inquiries.client_hash is 'HMAC-SHA256 of the request identifier; the raw IP address is never stored.';
