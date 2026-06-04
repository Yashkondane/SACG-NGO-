'use client'

import { DynamicQrManager } from '@/components/admin/dynamic-qr-manager'

export default function QrPage() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dynamic QRs</h1>
                    <p className="text-muted-foreground">Manage dynamic QR codes that can redirect to any URL.</p>
                </div>
            </div>

            <DynamicQrManager />
        </div>
    )
}
