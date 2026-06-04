'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save, Upload, ImageIcon, RotateCcw, Plus, Trash2, GripVertical } from 'lucide-react'
import { ImageCropperDialog } from '@/components/image-cropper-dialog'
import { DEFAULT_PAGE_CONTENT } from '@/lib/content-defaults'

interface SectionEditorProps {
    pageSlug: string
    sectionKey: string
    initialContent: any
    arrayDisplayMode?: 'card' | 'table'
    onSave: () => void
}

export function SectionEditor({ pageSlug, sectionKey, initialContent, arrayDisplayMode = 'card', onSave }: SectionEditorProps) {
    const defaultContent = DEFAULT_PAGE_CONTENT[pageSlug]?.[sectionKey] || {}
    const mergedContent = { ...defaultContent, ...initialContent }
    const [content, setContent] = useState(mergedContent)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)

    // Image Cropper State
    const [cropperOpen, setCropperOpen] = useState(false)
    const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null)
    const [activeImageKey, setActiveImageKey] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Drag and Drop State
    const [draggedItem, setDraggedItem] = useState<{key: string, index: number} | null>(null)

    const handleDragStart = (e: React.DragEvent, key: string, index: number) => {
        setDraggedItem({ key, index })
        e.dataTransfer.effectAllowed = 'move'
        // Required for Firefox
        e.dataTransfer.setData('text/html', e.currentTarget.innerHTML)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }

    const handleDrop = (e: React.DragEvent, key: string, targetIndex: number, currentArray: any[]) => {
        e.preventDefault()
        if (!draggedItem || draggedItem.key !== key || draggedItem.index === targetIndex) return

        const newArray = [...currentArray]
        const [removed] = newArray.splice(draggedItem.index, 1)
        newArray.splice(targetIndex, 0, removed)
        
        handleChange(key, newArray)
        setDraggedItem(null)
    }

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

            if (activeImageKey.includes('[')) {
                const arrayKey = activeImageKey.split('[')[0];
                const indexStr = activeImageKey.split('[')[1].split(']')[0];
                const index = parseInt(indexStr);
                const fieldKey = activeImageKey.includes('.') ? activeImageKey.split('.')[1] : undefined;
                
                setContent((prev: any) => {
                    const newArray = [...prev[arrayKey]];
                    if (fieldKey) {
                        newArray[index] = { ...newArray[index], [fieldKey]: publicUrl };
                    } else {
                        newArray[index] = publicUrl;
                    }
                    return { ...prev, [arrayKey]: newArray };
                });
            } else {
                handleChange(activeImageKey, publicUrl)
            }
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

        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())

        if (Array.isArray(value)) {
            const isObjectArray = value.length > 0 && typeof value[0] === 'object' && value[0] !== null;
            
            // If empty array, default to assuming object array or string array based on key
            const isAssumedObjectArray = isObjectArray || (value.length === 0 && key !== 'points');

            if (isAssumedObjectArray) {
                return (
                    <div key={key} className="space-y-4 md:col-span-2">
                        <div className="flex justify-between items-center mb-2">
                            <Label className="text-xl font-bold">{label}</Label>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md font-medium">{value.length} Items</span>
                        </div>
                        
                        {arrayDisplayMode === 'table' && value.length > 0 ? (
                            <div className="border rounded-xl bg-card overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground">
                                        <tr>
                                            <th className="w-10 px-4 py-3"></th>
                                            {Object.keys(value[0]).map((colKey) => (
                                                <th key={colKey} className="px-4 py-3 font-medium capitalize">{colKey.replace(/_/g, ' ')}</th>
                                            ))}
                                            <th className="w-16 px-4 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {value.map((item: any, index: number) => (
                                            <tr 
                                                key={index} 
                                                className="border-t group hover:bg-muted/30 transition-colors"
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, key, index)}
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop(e, key, index, value)}
                                                onDragEnd={() => setDraggedItem(null)}
                                            >
                                                <td className="px-4 py-3 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                                                    <GripVertical className="h-4 w-4" />
                                                </td>
                                                {Object.entries(item).map(([itemKey, itemValue]: [string, any]) => (
                                                    <td key={itemKey} className="px-4 py-3">
                                                        <Input
                                                            value={itemValue}
                                                            className="h-8 text-sm bg-transparent border-transparent hover:border-input focus-visible:bg-background"
                                                            onChange={(e) => {
                                                                const newArray = [...value];
                                                                newArray[index] = { ...newArray[index], [itemKey]: e.target.value };
                                                                handleChange(key, newArray);
                                                            }}
                                                        />
                                                    </td>
                                                ))}
                                                <td className="px-4 py-3 text-right">
                                                    <Button 
                                                        type="button" 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => {
                                                            const newArray = [...value];
                                                            newArray.splice(index, 1);
                                                            handleChange(key, newArray);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {value.map((item: any, index: number) => (
                                <div key={index} className="p-6 border rounded-xl bg-card shadow-sm space-y-6 relative group transition-all hover:shadow-md flex flex-col">
                                    <div className="flex items-center justify-between border-b pb-4">
                                        <h4 className="font-semibold text-lg text-primary flex items-center gap-2">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">{index + 1}</span>
                                            Card Item
                                        </h4>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                            onClick={() => {
                                                const newArray = [...value];
                                                newArray.splice(index, 1);
                                                handleChange(key, newArray);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    
                                    <div className="flex-1 grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                                        {Object.entries(item).map(([itemKey, itemValue]: [string, any]) => {
                                            if (itemKey === 'image' || itemKey === 'imageUrl') {
                                                return (
                                                    <div key={itemKey} className="space-y-2 md:col-span-2 lg:col-span-2">
                                                        <Label className="capitalize font-medium">{itemKey}</Label>
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-muted/30">
                                                            {itemValue ? (
                                                                <div className="relative w-24 h-24 rounded-lg overflow-hidden border bg-background shrink-0 shadow-sm">
                                                                    <img src={itemValue} alt={itemKey} className="object-cover w-full h-full" />
                                                                </div>
                                                            ) : (
                                                                <div className="w-24 h-24 rounded-lg border border-dashed flex flex-col items-center justify-center bg-background text-muted-foreground shrink-0 shadow-sm">
                                                                    <ImageIcon className="h-6 w-6 mb-1 opacity-50" />
                                                                    <span className="text-[10px]">No image</span>
                                                                </div>
                                                            )}
                                                            <div className="space-y-2 w-full">
                                                                <Button type="button" variant="secondary" size="sm" className="font-medium" onClick={() => {
                                                                    initiateUpload(`${key}[${index}].${itemKey}`)
                                                                }} disabled={uploading}>
                                                                    <Upload className="mr-2 h-4 w-4" />
                                                                    {itemValue ? 'Replace Image' : 'Upload Image'}
                                                                </Button>
                                                                <Input
                                                                    value={itemValue}
                                                                    onChange={(e) => {
                                                                        const newArray = [...value];
                                                                        newArray[index] = { ...newArray[index], [itemKey]: e.target.value };
                                                                        handleChange(key, newArray);
                                                                    }}
                                                                    placeholder="/images/..."
                                                                    className="font-mono text-xs text-muted-foreground h-9 bg-background focus-visible:ring-primary/50"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            } else {
                                                const isLong = itemKey.includes('desc') || itemKey.includes('text') || itemKey.includes('answer')
                                                return (
                                                    <div key={itemKey} className={`space-y-2 ${isLong ? 'md:col-span-2 lg:col-span-2' : ''}`}>
                                                        <Label className="capitalize font-medium">{itemKey}</Label>
                                                        {isLong ? (
                                                            <Textarea 
                                                                value={itemValue} 
                                                                className="resize-none bg-background focus-visible:ring-primary/50 min-h-[100px]"
                                                                onChange={(e) => {
                                                                    const newArray = [...value];
                                                                    newArray[index] = { ...newArray[index], [itemKey]: e.target.value };
                                                                    handleChange(key, newArray);
                                                                }}
                                                            />
                                                        ) : (
                                                            <Input 
                                                                value={itemValue} 
                                                                className="bg-background focus-visible:ring-primary/50"
                                                                onChange={(e) => {
                                                                    const newArray = [...value];
                                                                    newArray[index] = { ...newArray[index], [itemKey]: e.target.value };
                                                                    handleChange(key, newArray);
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        )}
                        
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full md:col-span-2 border-dashed py-8 border-2 text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-colors" 
                            onClick={() => {
                                const template = value.length > 0 ? Object.keys(value[0]).reduce((acc, k) => ({ ...acc, [k]: '' }), {}) : { image: '', title: '', description: '' };
                                handleChange(key, [...value, template])
                            }}
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            Add New {label}
                        </Button>
                    </div>
                )
            } else {
                const isImageArray = key.toLowerCase() === 'images';
                return (
                    <div key={key} className="space-y-4 md:col-span-2">
                        <Label className="text-xl font-bold mb-4 block">{label}</Label>
                        <div className="space-y-3 bg-card border rounded-xl p-6 shadow-sm">
                            {value.map((item: string, index: number) => (
                                <div key={index} className={`flex ${isImageArray ? 'flex-col sm:flex-row' : ''} gap-3 items-center group bg-muted/30 p-3 rounded-lg border`}>
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary font-medium">{index + 1}</span>
                                    
                                    {isImageArray && (
                                        <>
                                            {item ? (
                                                <div className="relative w-24 h-24 rounded-lg overflow-hidden border bg-background shrink-0 shadow-sm">
                                                    <img src={item} alt={`${key} ${index}`} className="object-cover w-full h-full" />
                                                </div>
                                            ) : (
                                                <div className="w-24 h-24 rounded-lg border border-dashed flex flex-col items-center justify-center bg-background text-muted-foreground shrink-0 shadow-sm">
                                                    <ImageIcon className="h-6 w-6 mb-1 opacity-50" />
                                                    <span className="text-[10px]">No image</span>
                                                </div>
                                            )}
                                            <Button type="button" variant="secondary" size="sm" className="font-medium shrink-0" onClick={() => initiateUpload(`${key}[${index}]`)} disabled={uploading}>
                                                <Upload className="mr-2 h-4 w-4" />
                                                {item ? 'Replace Image' : 'Upload Image'}
                                            </Button>
                                        </>
                                    )}

                                    <Input
                                        value={item}
                                        className={`bg-background focus-visible:ring-primary/50 ${isImageArray ? 'font-mono text-xs text-muted-foreground h-9' : ''}`}
                                        onChange={(e) => {
                                            const newArray = [...value];
                                            newArray[index] = e.target.value;
                                            handleChange(key, newArray);
                                        }}
                                        placeholder={isImageArray ? "/images/..." : ""}
                                    />
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        className="shrink-0 h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-50 group-hover:opacity-100 transition-opacity"
                                        onClick={() => {
                                            const newArray = [...value];
                                            newArray.splice(index, 1);
                                            handleChange(key, newArray);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            
                            <Button 
                                type="button" 
                                variant="outline" 
                                className="w-full border-dashed mt-4 text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-colors" 
                                onClick={() => {
                                    handleChange(key, [...value, ""])
                                }}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add {isImageArray ? 'Image' : 'Item'}
                            </Button>
                        </div>
                    </div>
                )
            }
        }

        // Image Handling
        if (key.toLowerCase().includes('image') || key.toLowerCase() === 'imageurl') {
            return (
                <div key={key} className="space-y-2 md:col-span-2">
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
            const forceOneColumnKeys = ['title', 'subtitle', 'ctatext', 'ctatextprimary', 'ctaurlprimary', 'ctatextsecondary', 'ctaurlsecondary', 'cta', 'ctaurl', 'badge'];
            const forceInputKeys = ['title', 'ctatext', 'ctatextprimary', 'ctaurlprimary', 'ctatextsecondary', 'ctaurlsecondary', 'cta', 'ctaurl', 'badge'];
            
            const isForceOneColumn = forceOneColumnKeys.includes(key.toLowerCase()) || key.toLowerCase().startsWith('text_');
            const isForceInput = forceInputKeys.includes(key.toLowerCase());

            const isLongText = !isForceInput && (value.length > 60 || key.toLowerCase().includes('description') || key.toLowerCase().includes('text') || key.toLowerCase().includes('content'));

            const colSpanClass = isForceOneColumn ? '' : (isLongText ? 'md:col-span-2' : '')

            // Define character limits based on key or type
            const charLimit = key.toLowerCase().includes('title') ? 100 :
                key.toLowerCase().includes('excerpt') ? 200 :
                    key.toLowerCase().includes('badge') ? 50 : 1000 // Default 1000 for long text

            const isOverLimit = value.length > charLimit

            return (
                <div key={key} className={`space-y-2 ${colSpanClass}`}>
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

    const getAspectForUpload = (key: string | null) => {
        if (!key) return 16 / 9;
        if (key.includes('mission') || key.includes('goal')) return 4 / 3;
        if (key.includes('what_we_do')) return 1;
        return 16 / 9;
    }

    return (
        <div className="space-y-6">
            <ImageCropperDialog
                open={cropperOpen}
                onOpenChange={setCropperOpen}
                imageSrc={selectedImageSrc}
                onCropComplete={handleCropComplete}
                aspect={getAspectForUpload(activeImageKey)}
            />
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
            />

            <div className="grid md:grid-cols-2 gap-6">
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
