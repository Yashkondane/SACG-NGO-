-- Create page_content table
CREATE TABLE IF NOT EXISTS page_content (
    id UUID DEFAULt gen_random_uuid() PRIMARY KEY,
    page_slug TEXT NOT NULL, -- 'home', 'about', etc.
    section_key TEXT NOT NULL, -- 'hero', 'mission', 'story', etc.
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULt timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULt timezone('utc'::text, now()) NOT NULL,
    UNIQUE(page_slug, section_key)
);

-- Enable Row Level Security
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Drop existing policies to allow re-running the script
DROP POLICY IF EXISTS "Public read access" ON page_content;
DROP POLICY IF EXISTS "Admin full access" ON page_content;

-- Allow public read access
CREATE POLICY "Public read access" ON page_content
    FOR SELECT
    USING (true);

-- Allow authenticated users (admins) to insert/update/delete
CREATE POLICY "Admin full access" ON page_content
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_page_content_updated_at ON page_content;

CREATE TRIGGER update_page_content_updated_at
    BEFORE UPDATE ON page_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed Initial Data (Home Page)
INSERT INTO page_content (page_slug, section_key, content)
VALUES
    ('home', 'hero', '{
        "title": "Building Bridges, Celebrating Culture",
        "subtitle": "The South Asian Community of Greater New Haven brings together diverse voices to create a vibrant, inclusive community",
        "ctaTextPrimary": "Support Our Mission",
        "ctaTextSecondary": "Upcoming Events",
        "images": [
            "/images/hero.jpg",
            "/images/sacg-banner.png"
        ]
    }'),
    ('home', 'mission', '{
        "title": "Our Mission",
        "text_1": "To foster a strong, vibrant South Asian community in Greater New Haven by promoting cultural awareness, social engagement, and mutual support.",
        "text_2": "We strive to create meaningful connections that celebrate our rich heritage while embracing the diversity of our region. Through community programs, cultural events, and social initiatives, we work to build bridges between generations and cultures.",
        "imageUrl": "/images/about-us.jpg"
    }'),
    ('home', 'goal', '{
        "title": "Our Goal",
        "text_1": "To create a thriving, inclusive community where South Asian culture is celebrated, preserved, and shared with future generations while fostering meaningful connections across all backgrounds.",
        "text_2": "We aim to empower our members through cultural education, community service, and social engagement, building a legacy of unity, understanding, and mutual respect that enriches the Greater New Haven area for years to come.",
        "points": [
            "Strengthen cultural identity and heritage preservation",
            "Foster cross-generational and cross-cultural connections",
            "Support community members through resources and programs",
            "Promote civic engagement and social responsibility"
        ],
        "imageUrl": "/images/logo.jpg"
    }'),
    ('home', 'what_we_do', '{
        "title": "What We Do",
        "items": [
            {
                "title": "Cultural Events",
                "description": "Celebrate festivals, traditions, and cultural milestones together through vibrant performances and gatherings",
                "image": "/images/cultural-events.jpg"
            },
            {
                "title": "Community Building",
                "description": "Connect with neighbors and build lasting friendships across generations and backgrounds",
                "image": "/images/community-building.jpg"
            },
            {
                "title": "Social Engagement",
                "description": "Fostering a sense of belonging and community participation",
                "image": "/images/social-support.jpg"
            }
        ]
    }'),
     ('home', 'testimonials', '{
        "title": "What Our Members Say",
        "subtitle": "Hear from community members about their experiences with SACG"
    }'),
    ('home', 'faq', '{
        "title": "Frequently Asked Questions",
        "subtitle": "Find answers to common questions about SACG and our activities",
        "items": [
            {
                "question": "What types of events does SACG organize?",
                "answer": "SACG organizes a wide variety of events including cultural festivals like Diwali and Holi celebrations, educational workshops, family gatherings, networking events, and community service initiatives. Check our Events page to see what''s coming up!"
            },
            {
                "question": "Do I need to be South Asian to join SACG?",
                "answer": "Absolutely not! While SACG celebrates South Asian culture, we welcome everyone who is interested in learning about and celebrating our traditions. Our community is built on inclusivity and cultural exchange."
            },
             {
                "question": "How can I volunteer with SACG?",
                "answer": "We''re always looking for passionate volunteers! Contact us through our Contact page or email us directly. Volunteer opportunities include event planning, cultural programming, community outreach, and administrative support. Every contribution makes a difference!"
            },
            {
                "question": "Are SACG events family-friendly?",
                "answer": "Yes! Most of our events are designed to be family-friendly and welcoming to all ages. We often have activities specifically planned for children and families. Check individual event descriptions for specific details about age-appropriateness."
            }
        ]
    }'),
    ('home', 'join_community', '{
        "title": "Join Our Community",
        "description": "Become part of something bigger. Connect with your community, celebrate your heritage, and make a difference.",
        "ctaText": "Get in Touch"
    }'),
     ('about', 'intro', '{
        "badge": "Our Journey",
        "title": "About SACG",
        "description": "Celebrating South Asian culture, fostering community connections, and building lasting memories in Greater New Haven since 2010."
    }'),
    ('about', 'story', '{
        "title": "Our Story",
        "subtitle": "From humble beginnings to a thriving community",
        "text_1": "The South Asian Community of Greater New Haven (SACG) was born from a simple yet powerful idea: to create a space where South Asians could come together, celebrate their heritage, and support one another in navigating life in a new country.",
        "text_2": "What started as informal gatherings quickly grew into something much bigger—a movement focused on preserving cultural identity, bridging the gap between traditions, and building a sense of belonging in a broader community.",
        "text_3": "With several successful and multi-faceted events under our belt, we formally registered as a 501(c)3 in July 2025. We are committed to building a welcoming home for the South Asian community of Greater New Haven.",
        "imageUrl": "/images/about-team.jpg"
    }')
ON CONFLICT (page_slug, section_key) DO UPDATE
SET content = EXCLUDED.content;
