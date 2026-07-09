'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar, Footer } from '@/components/layout'
import { Card, Input, Button } from '@/components/ui'

export default function CheckoutPage() {
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    // Mock payment processing
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }
  
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="container mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-12 text-center">Checkout</h1>
        <div className="max-w-2xl mx-auto">
          <Card>
            <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Card Number" placeholder="4242 4242 4242 4242" required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Expiry Date" placeholder="MM/YY" required />
                <Input label="CVC" placeholder="123" required />
              </div>
              <Input label="Cardholder Name" required />
              <div className="pt-4">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
                  <span className="text-slate-400">Total</span>
                  <span className="text-2xl font-bold">$99.00</span>
                </div>
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  className="w-full"
                  disabled={processing}
                >
                  {processing ? 'Processing...' : 'Complete Payment'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
