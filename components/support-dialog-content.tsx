import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function SupportDialogContent() {
    return (
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center text-primary mb-2">
                    Support Community. Celebrate Culture. Build Belonging.
                </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
                <p className="text-muted-foreground leading-relaxed text-center">
                    Your generosity helps the South Asian Community of Greater New Haven create meaningful programs, strengthen connections, and ensure our community continues to thrive.
                </p>

                <div className="bg-muted/50 p-4 rounded-lg border">
                    <p className="text-sm text-center font-medium">
                        Every donation large or small directly supports our mission to celebrate cultural heritage, foster inclusion, encourage civic engagement, and build a welcoming space for South Asians across Greater New Haven.
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-primary text-center">Ways to Give</h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border hover:border-primary/50 transition-colors bg-card">
                            <h4 className="font-semibold mb-2">One-Time Donation</h4>
                            <p className="text-sm text-muted-foreground">Make an immediate impact by supporting our current programs and initiatives.</p>
                        </div>
                        <div className="p-4 rounded-lg border hover:border-primary/50 transition-colors bg-card">
                            <h4 className="font-semibold mb-2">Monthly Giving</h4>
                            <p className="text-sm text-muted-foreground">Become a sustaining supporter and help ensure long-term stability and growth for our community.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-4">
                    <Button asChild size="lg" className="w-full sm:w-auto text-lg px-8">
                        <a
                            href="https://www.zeffy.com/en-US/donation-form/donate-to-sacg-new-haven"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Proceed to Donate
                        </a>
                    </Button>
                </div>
            </div>
        </DialogContent>
    )
}
