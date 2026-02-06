-- 1. Create Events Table
create table if not exists public.events (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  excerpt text, -- Short description for the card
  content text, -- Full HTML/Markdown content
  date timestamp with time zone not null,
  location text,
  image_url text -- Public URL of the uploaded image
);

-- 2. Enable RLS
alter table public.events enable row level security;

-- 3. RLS Policies for Events
-- Everyone can view events
create policy "Public can view events" on public.events
  for select using (true);

-- Only admins can insert/update/delete events
create policy "Admins can manage events" on public.events
  for all using (public.is_admin());

-- 4. Storage Bucket Policies (You must create a bucket named 'event-images' in Supabase Dashboard first!)
-- OR run checking code if you have permissions (usually UI is better for buckets)
-- Assuming bucket 'event-images' exists:

-- Allow public access to view images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'event-images' );

-- Allow admins to upload images
create policy "Admin Upload"
on storage.objects for insert
with check ( bucket_id = 'event-images' AND public.is_admin() );

-- Allow admins to delete images
create policy "Admin Delete"
on storage.objects for delete
using ( bucket_id = 'event-images' AND public.is_admin() );
