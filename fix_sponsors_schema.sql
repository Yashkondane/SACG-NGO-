-- Make logo_url nullable
alter table public.sponsors alter column logo_url drop not null;
