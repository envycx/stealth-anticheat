'use client'
import { useState } from 'react'
import { Card, Input, Button } from '@/components/ui'
import { GridBackground } from '@/components/effects'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative">
      <GridBackground />
      <Card className="w-full max-w-md z-10">
        <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
        {!submitted ? (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button type="submit" variant="primary" size="lg" className="w-full">Send Reset Link</Button>
          </form>
        ) : (
          <p className="text-center text-slate-400">If that email exists, you'll receive a reset link.</p>
        )}
      </Card>
    </main>
  )
}
