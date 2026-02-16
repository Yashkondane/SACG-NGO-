UPDATE page_content
SET content = jsonb_set(content, '{images}', '[]')
WHERE page_slug = 'home' AND section_key = 'hero';
