import { Card } from '@/components/ui'
import { GridBackground } from '@/components/effects'
import { TwoFactorSetup } from '@/components/auth'

export default function TwoFactorSetupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative">
      <GridBackground />
      <Card className="w-full max-w-md z-10">
        <TwoFactorSetup />
      </Card>
    </main>
  )
}
