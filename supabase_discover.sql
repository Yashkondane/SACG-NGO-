-- Create a table for discover items
create table if not exists public.discover_items (
  id uuid not null default gen_random_uuid (),
  name text not null,
  description text not null,
  type text not null check (type in ('non-profit', 'organisation')),
  logo_url text,
  website_url text,
  display_order integer default 0,
  created_at timestamp with time zone not null default now(),
  constraint discover_items_pkey primary key (id)
);

-- Set up Row Level Security (RLS)
alter table public.discover_items enable row level security;

-- Allow public read access
drop policy if exists "Public can view discover items" on public.discover_items;
create policy "Public can view discover items" on public.discover_items
  for select using (true);

-- Allow authenticated users (admins) to insert, update, delete
drop policy if exists "Admins can insert discover items" on public.discover_items;
create policy "Admins can insert discover items" on public.discover_items
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "Admins can update discover items" on public.discover_items;
create policy "Admins can update discover items" on public.discover_items
  for update using (auth.role() = 'authenticated');

drop policy if exists "Admins can delete discover items" on public.discover_items;
create policy "Admins can delete discover items" on public.discover_items
  for delete using (auth.role() = 'authenticated');

-- Create a storage bucket for discover item logos
insert into storage.buckets (id, name, public)
values ('discover-logos', 'discover-logos', true)
on conflict (id) do nothing;

-- Set up storage policies for discover-logos bucket
drop policy if exists "Discover Logos Public Access" on storage.objects;
create policy "Discover Logos Public Access" on storage.objects 
  for select using ( bucket_id = 'discover-logos' );

drop policy if exists "Discover Logos Auth Upload" on storage.objects;
create policy "Discover Logos Auth Upload" on storage.objects 
  for insert with check ( bucket_id = 'discover-logos' and auth.role() = 'authenticated' );

drop policy if exists "Discover Logos Auth Update" on storage.objects;
create policy "Discover Logos Auth Update" on storage.objects 
  for update using ( bucket_id = 'discover-logos' and auth.role() = 'authenticated' );

drop policy if exists "Discover Logos Auth Delete" on storage.objects;
create policy "Discover Logos Auth Delete" on storage.objects 
  for delete using ( bucket_id = 'discover-logos' and auth.role() = 'authenticated' );
