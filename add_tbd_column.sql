-- Run this in your Supabase SQL Editor to add the is_tbd flag
ALTER TABLE events ADD COLUMN is_tbd BOOLEAN DEFAULT false;
