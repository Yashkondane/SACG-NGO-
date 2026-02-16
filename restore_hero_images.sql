UPDATE page_content
SET content = jsonb_set(content, '{images}', '["/images/hero.jpg", "/images/sacg-banner.png"]')
WHERE page_slug = 'home' AND section_key = 'hero';
