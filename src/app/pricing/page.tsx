import { Navbar, Footer } from '@/components/layout'
import { PricingCards } from '@/components/marketing'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-400">Choose the plan that fits your needs</p>
        </div>
        <PricingCards />
      </main>
      <Footer />
    </div>
  )
}
