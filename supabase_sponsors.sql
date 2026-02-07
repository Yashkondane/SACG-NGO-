-- Create a table for sponsors
create table if not exists public.sponsors (
  id uuid not null default gen_random_uuid (),
  name text not null,
  logo_url text not null,
  website_url text null,
  display_order integer default 0,
  created_at timestamp with time zone not null default now(),
  constraint sponsors_pkey primary key (id)
);

-- Set up Row Level Security (RLS)
alter table public.sponsors enable row level security;

-- Allow public read access
-- Drop policy if exists to avoid error on rerun
drop policy if exists "Public can view sponsors" on public.sponsors;
create policy "Public can view sponsors" on public.sponsors
  for select using (true);

-- Allow authenticated users (admins) to insert, update, delete
drop policy if exists "Admins can insert sponsors" on public.sponsors;
create policy "Admins can insert sponsors" on public.sponsors
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "Admins can update sponsors" on public.sponsors;
create policy "Admins can update sponsors" on public.sponsors
  for update using (auth.role() = 'authenticated');

drop policy if exists "Admins can delete sponsors" on public.sponsors;
create policy "Admins can delete sponsors" on public.sponsors
  for delete using (auth.role() = 'authenticated');

-- Create a storage bucket for sponsor logos
insert into storage.buckets (id, name, public)
values ('sponsor-logos', 'sponsor-logos', true)
on conflict (id) do nothing;

-- Set up storage policies for sponsor-logos bucket
-- Using distinct names to avoid conflicts with other buckets
drop policy if exists "Sponsors Public Access" on storage.objects;
create policy "Sponsors Public Access" on storage.objects 
  for select using ( bucket_id = 'sponsor-logos' );

drop policy if exists "Sponsors Auth Upload" on storage.objects;
create policy "Sponsors Auth Upload" on storage.objects 
  for insert with check ( bucket_id = 'sponsor-logos' and auth.role() = 'authenticated' );

drop policy if exists "Sponsors Auth Update" on storage.objects;
create policy "Sponsors Auth Update" on storage.objects 
  for update using ( bucket_id = 'sponsor-logos' and auth.role() = 'authenticated' );

drop policy if exists "Sponsors Auth Delete" on storage.objects;
create policy "Sponsors Auth Delete" on storage.objects 
  for delete using ( bucket_id = 'sponsor-logos' and auth.role() = 'authenticated' );
