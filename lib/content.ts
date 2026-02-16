import { supabase } from '@/lib/supabase'

export async function getPageContent(pageSlug: string) {
    try {
        const { data, error } = await supabase
            .from('page_content')
            .select('*')
            .eq('page_slug', pageSlug)

        if (error) {
            // If table doesn't exist yet, return empty object to prevent crash
            if (error.code === '42P01') {
                console.warn('page_content table does not exist yet.')
                return {}
            }
            console.error('Error fetching page content:', error)
            return {}
        }

        // Convert array to object keyed by section_key
        const contentMap = data.reduce((acc, item) => {
            acc[item.section_key] = item.content
            return acc
        }, {} as Record<string, any>)

        return contentMap
    } catch (err) {
        console.error('Unexpected error fetching content:', err)
        return {}
    }
}
