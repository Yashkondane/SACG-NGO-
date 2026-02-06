'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { getCroppedImg } from '@/lib/cropper-utils'
import { Loader2 } from 'lucide-react'

interface ImageCropperDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    imageSrc: string | null
    onCropComplete: (croppedBlob: Blob) => void
    aspect?: number
}

export function ImageCropperDialog({
    open,
    onOpenChange,
    imageSrc,
    onCropComplete,
    aspect = 16 / 9,
}: ImageCropperDialogProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
    const [processing, setProcessing] = useState(false)

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop)
    }

    const onZoomChange = (zoom: number) => {
        setZoom(zoom)
    }

    const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleSave = async () => {
        if (!imageSrc || !croppedAreaPixels) return
        setProcessing(true)
        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
            onCropComplete(croppedBlob)
            onOpenChange(false)
        } catch (e) {
            console.error(e)
        } finally {
            setProcessing(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Crop Image</DialogTitle>
                    <DialogDescription>
                        Adjust the image to fit the aspect ratio.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative w-full h-[400px] bg-black rounded-md overflow-hidden">
                    {imageSrc && (
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            onCropChange={onCropChange}
                            onCropComplete={onCropCompleteHandler}
                            onZoomChange={onZoomChange}
                        />
                    )}
                </div>

                <div className="py-4 space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium w-12">Zoom</span>
                        <Slider
                            defaultValue={[1]}
                            min={1}
                            max={3}
                            step={0.1}
                            value={[zoom]}
                            onValueChange={(vals) => setZoom(vals[0])}
                            className="flex-1"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={processing}>
                        {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save & Upload
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
