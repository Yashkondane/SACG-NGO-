-- Add category column to events table
alter table public.events 
add column if not exists category text not null default 'general';

-- Add check constraint to ensure valid categories (optional but good practice)
-- alter table public.events add constraint valid_category check (category in ('general', 'health'));
