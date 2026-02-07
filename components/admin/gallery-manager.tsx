'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { Trash2, Upload, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

function generateId() {
    return Math.random().toString(36).substring(2, 15)
}

interface GalleryManagerProps {
    eventId: string
    eventTitle: string
}

interface GalleryImage {
    id: string
    image_url: string
}

export function GalleryManager({ eventId, eventTitle }: GalleryManagerProps) {
    const [images, setImages] = useState<GalleryImage[]>([])
    const [uploading, setUploading] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (open) {
            fetchImages()
        }
    }, [open, eventId])

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
    }

    async function compressImage(file: File): Promise<Blob> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (e) => {
                const img = document.createElement('img')
                img.src = e.target?.result as string
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    if (!ctx) {
                        reject(new Error('Could not get canvas context'))
                        return
                    }

                    // Max dimensions
                    const MAX_WIDTH = 1920
                    const MAX_HEIGHT = 1920
                    let width = img.width
                    let height = img.height

                    // Calculate new dimensions while maintaining aspect ratio
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = height * (MAX_WIDTH / width)
                            width = MAX_WIDTH
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width = width * (MAX_HEIGHT / height)
                            height = MAX_HEIGHT
                        }
                    }

                    canvas.width = width
                    canvas.height = height

                    // Draw white background
                    ctx.fillStyle = 'white'
                    ctx.fillRect(0, 0, width, height)

                    // Draw image
                    ctx.drawImage(img, 0, 0, width, height)

                    // Convert to blob with compression
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(blob)
                            } else {
                                reject(new Error('Failed to compress image'))
                            }
                        },
                        'image/jpeg',
                        0.85 // 85% quality
                    )
                }
                img.onerror = () => reject(new Error('Failed to load image'))
            }
            reader.onerror = () => reject(new Error('Failed to read file'))
        })
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return

        setUploading(true)
        const files = Array.from(e.target.files)

        for (const file of files) {
            try {
                // Compress the image first
                const compressedBlob = await compressImage(file)

                const fileExt = 'jpg' // Always use jpg after compression
                const fileName = `${eventId}/${generateId()}.${fileExt}`
                const filePath = `${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('event-images')
                    .upload(filePath, compressedBlob)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('event-images')
                    .getPublicUrl(filePath)

                const { error: dbError } = await supabase
                    .from('event_gallery_images')
                    .insert({
                        event_id: eventId,
                        image_url: publicUrl
                    })

                if (dbError) throw dbError

            } catch (error) {
                console.error('Error uploading image:', error)
                alert(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
            }
        }

        setUploading(false)
        fetchImages()
        // Reset input
        e.target.value = ''
    }

    async function handleDelete(id: string, imageUrl: string) {
        if (!confirm('Are you sure you want to delete this image?')) return

        try {
            // Delete from DB
            const { error: dbError } = await supabase
                .from('event_gallery_images')
                .delete()
                .eq('id', id)

            if (dbError) throw dbError

            // Optionally delete from storage if needed, but URL parsing is required.
            // For now, we just delete the reference.

            setImages(images.filter(img => img.id !== id))
        } catch (error) {
            console.error('Error deleting image:', error)
            alert('Failed to delete image')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Gallery
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Manage Gallery for "{eventTitle}"</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-[300px] p-1">
                    {images.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg text-muted-foreground">
                            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                            <p>No images in gallery yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {images.map((img) => (
                                <div key={img.id} className="relative group aspect-video bg-muted rounded-md overflow-hidden">
                                    <Image
                                        src={img.image_url}
                                        alt="Gallery image"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDelete(img.id, img.image_url)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t pt-4 mt-4">
                    <Label htmlFor="gallery-upload" className="block mb-2 font-medium">
                        Upload New Images
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            id="gallery-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="flex-1"
                        />
                        {uploading && <Button disabled>Uploading...</Button>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        You can select multiple files at once.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
