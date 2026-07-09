'use client'
import { useState } from 'react'
import { Navbar, Footer } from '@/components/layout'
import { Card, Input, Button } from '@/components/ui'

export default function ReportPage() {
  const [submitted, setSubmitted] = useState(false)
  
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="container mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-12 text-center">Report a Security Issue</h1>
        <Card className="max-w-2xl mx-auto">
          {!submitted ? (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} className="space-y-4">
              <Input label="Your Email" type="email" required />
              <Input label="Subject" required />
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea 
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                  rows={6}
                  required
                />
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full">Submit Report</Button>
            </form>
          ) : (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Report Submitted</h2>
              <p className="text-slate-400">Thank you for your submission. We'll review it shortly.</p>
            </div>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  )
}
