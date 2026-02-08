-- Create Newsletters Table
create table if not exists public.newsletters (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  link text not null
);

-- Enable RLS
alter table public.newsletters enable row level security;

-- Policies

-- Public can read all newsletters
create policy "Public can read newsletters" on public.newsletters
  for select using (true);

-- Admins can insert newsletters
create policy "Admins can insert newsletters" on public.newsletters
  for insert with check (public.is_admin());

-- Admins can delete newsletters
create policy "Admins can delete newsletters" on public.newsletters
  for delete using (public.is_admin());

-- Admins can update newsletters
create policy "Admins can update newsletters" on public.newsletters
  for update using (public.is_admin());
