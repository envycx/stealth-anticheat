import { Card } from '@/components/ui'
import { GridBackground } from '@/components/effects'
import { LoginForm } from '@/components/auth'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative">
      <GridBackground />
      <Card className="w-full max-w-md z-10">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
        <LoginForm />
      </Card>
    </main>
  )
}
