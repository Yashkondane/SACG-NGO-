'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog'
import { ZoomIn } from 'lucide-react'

interface GalleryImage {
    id: string
    image_url: string
}

export function GalleryGrid({ eventId }: { eventId: string }) {
    const [images, setImages] = useState<GalleryImage[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchImages() {
            const { data, error } = await supabase
                .from('event_gallery_images')
                .select('*')
                .eq('event_id', eventId)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching gallery images:', error)
            } else {
                setImages(data || [])
            }
            setLoading(false)
        }

        if (eventId) {
            fetchImages()
        }
    }, [eventId])

    if (loading) {
        return <div className="text-muted-foreground">Loading gallery...</div>
    }

    if (images.length === 0) {
        return null // Don't show anything if no images
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img) => (
                <Dialog key={img.id}>
                    <DialogTrigger asChild>
                        <div className="relative group aspect-square cursor-pointer overflow-hidden rounded-lg bg-muted">
                            <Image
                                src={img.image_url}
                                alt="Event gallery image"
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                sizes="(max-width: 768px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 drop-shadow-md" />
                            </div>
                        </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] p-0 border-none bg-black/90">
                        <div className="relative w-full h-[80vh]">
                            <Image
                                src={img.image_url}
                                alt="Event gallery image full view"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            ))}
        </div>
    )
}
