'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save, Upload, ImageIcon, RotateCcw } from 'lucide-react'
import { ImageCropperDialog } from '@/components/image-cropper-dialog'
import { DEFAULT_PAGE_CONTENT } from '@/lib/content-defaults'

interface SectionEditorProps {
    pageSlug: string
    sectionKey: string
    initialContent: any
    onSave: () => void
}

export function SectionEditor({ pageSlug, sectionKey, initialContent, onSave }: SectionEditorProps) {
    const [content, setContent] = useState(initialContent || {})
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)

    // Image Cropper State
    const [cropperOpen, setCropperOpen] = useState(false)
    const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null)
    const [activeImageKey, setActiveImageKey] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleChange = (key: string, value: any) => {
        setContent((prev: any) => ({ ...prev, [key]: value }))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            // Check if record exists
            const { data: existing } = await supabase
                .from('page_content')
                .select('id')
                .eq('page_slug', pageSlug)
                .eq('section_key', sectionKey)
                .single()

            if (existing) {
                const { error } = await supabase
                    .from('page_content')
                    .update({ content, updated_at: new Date().toISOString() })
                    .eq('id', existing.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('page_content')
                    .insert([{ page_slug: pageSlug, section_key: sectionKey, content }])
                if (error) throw error
            }

            alert('Section updated successfully!')
            onSave()
        } catch (error: any) {
            console.error('Error saving section:', error)
            alert(`Failed to save: ${error.message}`)
        } finally {
            setSaving(false)
        }
    }

    const handleReset = () => {
        if (!confirm('Are you sure you want to reset this section to its default content? This cannot be undone.')) return

        const defaultContent = DEFAULT_PAGE_CONTENT[pageSlug]?.[sectionKey]
        if (defaultContent) {
            setContent(defaultContent)
        } else {
            alert('No default content found for this section.')
        }
    }

    // Image Upload Logic
    const initiateUpload = (key: string) => {
        setActiveImageKey(key)
        fileInputRef.current?.click()
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.addEventListener('load', () => {
            setSelectedImageSrc(reader.result?.toString() || null)
            setCropperOpen(true)
            if (fileInputRef.current) fileInputRef.current.value = ''
        })
        reader.readAsDataURL(file)
    }

    const handleCropComplete = async (croppedBlob: Blob) => {
        if (!activeImageKey) return
        setUploading(true)
        try {
            const fileName = `content-${pageSlug}-${sectionKey}-${Date.now()}.jpg`
            const filePath = `${fileName}`
            const file = new File([croppedBlob], fileName, { type: 'image/jpeg' })

            const { error: uploadError } = await supabase.storage
                .from('event-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                })

            if (uploadError) {
                throw uploadError
            }

            const { data: { publicUrl } } = supabase.storage
                .from('event-images')
                .getPublicUrl(filePath)

            handleChange(activeImageKey, publicUrl)
        } catch (error: any) {
            console.error('Error uploading image:', error)
            alert(`Upload failed: ${error.message}`)
        } finally {
            setUploading(false)
            setCropperOpen(false)
            setActiveImageKey(null)
        }
    }

    const renderField = (key: string, value: any) => {
        // Skip protected keys
        if (key === 'id' || key === 'created_at' || key === 'updated_at') return null

        // Explicitly hide 'images' field for Home -> Hero section
        if (pageSlug === 'home' && sectionKey === 'hero' && key === 'images') return null

        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())

        if (Array.isArray(value)) {
            return (
                <div key={key} className="space-y-2 border p-4 rounded-md bg-muted/20">
                    <Label className="mb-2 block">{label} (List)</Label>
                    <div className="text-xs text-muted-foreground mb-2">
                        Editing lists is currently supported via raw JSON.
                    </div>
                    <Textarea
                        id={key}
                        value={JSON.stringify(value, null, 2)}
                        onChange={(e) => {
                            try {
                                handleChange(key, JSON.parse(e.target.value))
                            } catch (err) {
                                // Allow typing invalid JSON while editing
                            }
                        }}
                        className="font-mono text-xs min-h-[150px]"
                    />
                </div>
            )
        }

        // Image Handling
        if (key.toLowerCase().includes('image') || (key.toLowerCase().includes('url') && typeof value === 'string' && value.startsWith('/'))) {
            return (
                <div key={key} className="space-y-2">
                    <Label>{label}</Label>
                    <div className="flex items-center gap-4">
                        {value && (
                            <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                                <img src={value} alt={key} className="object-cover w-full h-full" />
                            </div>
                        )}
                        <Button type="button" variant="outline" onClick={() => initiateUpload(key)} disabled={uploading}>
                            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            {value ? 'Change Image' : 'Upload Image'}
                        </Button>
                    </div>
                    <Input
                        value={value}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder="/images/..."
                        className="font-mono text-xs text-muted-foreground mt-1"
                    />
                </div>
            )
        }

        // Text Handling
        if (typeof value === 'string') {
            const isLongText = value.length > 60 || key.toLowerCase().includes('description') || key.toLowerCase().includes('text') || key.toLowerCase().includes('content')

            // Define character limits based on key or type
            const charLimit = key.toLowerCase().includes('title') ? 100 :
                key.toLowerCase().includes('excerpt') ? 200 :
                    key.toLowerCase().includes('badge') ? 50 : 1000 // Default 1000 for long text

            const isOverLimit = value.length > charLimit

            return (
                <div key={key} className="space-y-2">
                    <div className="flex justify-between">
                        <Label htmlFor={key}>{label}</Label>
                        <span className={`text-xs ${isOverLimit ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}>
                            {value.length} / {charLimit}
                        </span>
                    </div>
                    {isLongText ? (
                        <Textarea
                            id={key}
                            value={value}
                            onChange={(e) => {
                                // Allow typing but warn, or strictly block. User said "wont allow it".
                                // Blocking might be annoying if pasting. Let's block if length > limit AND adding text.
                                const nextVal = e.target.value
                                if (nextVal.length <= charLimit || nextVal.length < value.length) {
                                    handleChange(key, nextVal)
                                }
                            }}
                            className="min-h-[100px]"
                        />
                    ) : (
                        <Input
                            id={key}
                            value={value}
                            onChange={(e) => {
                                const nextVal = e.target.value
                                if (nextVal.length <= charLimit || nextVal.length < value.length) {
                                    handleChange(key, nextVal)
                                }
                            }}
                        />
                    )}
                    {isOverLimit && <p className="text-xs text-red-500">Character limit exceeded.</p>}
                </div>
            )
        }

        if (typeof value === 'number') {
            return (
                <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                        id={key}
                        type="number"
                        value={value}
                        onChange={(e) => handleChange(key, Number(e.target.value))}
                    />
                </div>
            )
        }

        return null
    }

    return (
        <div className="space-y-6">
            <ImageCropperDialog
                open={cropperOpen}
                onOpenChange={setCropperOpen}
                imageSrc={selectedImageSrc}
                onCropComplete={handleCropComplete}
                aspect={16 / 9} // Default aspect, maybe make dynamic later
            />
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
            />

            <div className="grid gap-6">
                {Object.entries(content).map(([key, value]) => renderField(key, value))}
            </div>

            <div className="flex gap-4">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>

                <Button onClick={handleReset} variant="outline" type="button" disabled={saving}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset to Defaults
                </Button>
            </div>
        </div>
    )
}
