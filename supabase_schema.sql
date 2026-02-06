-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Admins Table (Whitelist)
create table public.admins (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Members Table
create table public.members (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text not null,
  email text not null,
  phone text,
  profession text not null, -- e.g. Doctor, Software Engineer
  location text not null, -- City/State
  bio text,
  status text default 'pending', -- pending, approved, rejected
  linkedin_url text
);

-- 3. Create Contacts Table
create table public.contacts (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text default 'unread' -- unread, read
);

-- 4. Enable Row Level Security (RLS)
alter table public.admins enable row level security;
alter table public.members enable row level security;
alter table public.contacts enable row level security;

-- 5. RLS Policies

-- Helper function to check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admins 
    where email = auth.jwt() ->> 'email'
  );
end;
$$ language plpgsql security definer;

-- ADMINS Table Policies
-- Only admins can view the admin list (optional, or you can allow read)
create policy "Admins can view admin list" on public.admins
  for select using (public.is_admin());

-- MEMBERS Table Policies
-- Anyone can read APPROVED members (Public Directory)
create policy "Public can view approved members" on public.members
  for select using (status = 'approved');

-- Admins can view ALL members (Pending & Approved)
create policy "Admins can view all members" on public.members
  for select using (public.is_admin());

-- Anyone can insert a new member application (Apply to join)
create policy "Anyone can apply for membership" on public.members
  for insert with check (true);

-- Only admins can update members (Approve/Reject)
create policy "Admins can update members" on public.members
  for update using (public.is_admin());

-- Only admins can delete members
create policy "Admins can delete members" on public.members
  for delete using (public.is_admin());

-- CONTACTS Table Policies
-- Anyone can insert a contact message
create policy "Anyone can submit contact form" on public.contacts
  for insert with check (true);

-- Only admins can view messages
create policy "Admins can view messages" on public.contacts
  for select using (public.is_admin());

-- Only admins can delete/update messages
create policy "Admins can manage messages" on public.contacts
  for all using (public.is_admin());
