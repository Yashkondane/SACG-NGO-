-- Create board_members table
CREATE TABLE IF NOT EXISTS public.board_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;

-- Create policies
drop policy if exists "Board members are viewable by everyone" on public.board_members;
CREATE POLICY "Board members are viewable by everyone" 
ON public.board_members FOR SELECT 
USING (true);

-- Allow authenticated users to manage board members
drop policy if exists "Authenticated users can insert board members" on public.board_members;
CREATE POLICY "Authenticated users can insert board members" 
ON public.board_members FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can update board members" on public.board_members;
CREATE POLICY "Authenticated users can update board members" 
ON public.board_members FOR UPDATE 
USING (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can delete board members" on public.board_members;
CREATE POLICY "Authenticated users can delete board members" 
ON public.board_members FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create storage bucket for board member images
insert into storage.buckets (id, name, public) 
values ('board-member-images', 'board-member-images', true)
on conflict (id) do nothing;

-- Set up storage policies for board-member-images bucket
drop policy if exists "Board member images are publicly accessible" on storage.objects;
create policy "Board member images are publicly accessible" on storage.objects for select using ( bucket_id = 'board-member-images' );

drop policy if exists "Authenticated users can upload board member images" on storage.objects;
create policy "Authenticated users can upload board member images" on storage.objects for insert with check ( bucket_id = 'board-member-images' and auth.role() = 'authenticated' );

drop policy if exists "Authenticated users can update board member images" on storage.objects;
create policy "Authenticated users can update board member images" on storage.objects for update using ( bucket_id = 'board-member-images' and auth.role() = 'authenticated' );

drop policy if exists "Authenticated users can delete board member images" on storage.objects;
create policy "Authenticated users can delete board member images" on storage.objects for delete using ( bucket_id = 'board-member-images' and auth.role() = 'authenticated' );
