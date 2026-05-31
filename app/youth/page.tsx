import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { FadeIn } from '@/components/ui/fade-in'
import { Rocket } from 'lucide-react'

export default function YouthPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-4">
        <FadeIn direction="up" className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-3xl p-12 md:p-20 shadow-xl border border-slate-100 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8">
                <Rocket className="w-10 h-10 text-primary" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                Youth focused initiatives coming soon!
              </h1>
              
              <p className="text-xl text-slate-600 max-w-lg mx-auto">
                We are actively working on exciting new programs tailored for the youth. Stay tuned for updates and opportunities to get involved.
              </p>
            </div>
          </div>
        </FadeIn>
      </main>

      <Footer />
    </div>
  )
}
