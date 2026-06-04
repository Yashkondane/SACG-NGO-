'use client'

import { Dialog } from '@/components/ui/dialog'
import { SupportDialogContent } from '@/components/support-dialog-content'
import { useRouter } from 'next/navigation'

export default function InterceptedDonationModal() {
    const router = useRouter()

    return (
        <Dialog open={true} onOpenChange={(open) => {
            if (!open) {
                router.back()
            }
        }}>
            <SupportDialogContent />
        </Dialog>
    )
}
