-- Create a table for event gallery images
create table if not exists public.event_gallery_images (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  event_id uuid references public.events(id) on delete cascade not null,
  image_url text not null
);

-- Enable RLS
alter table public.event_gallery_images enable row level security;

-- Policies
-- Public can view gallery images
create policy "Public can view gallery images" on public.event_gallery_images
  for select using (true);

-- Admins can manage gallery images
create policy "Admins can manage gallery images" on public.event_gallery_images
  for all using (public.is_admin());
