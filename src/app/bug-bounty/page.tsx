import { Navbar, Footer } from '@/components/layout'
import { Card } from '@/components/ui'

export default function BugBountyPage() {
  const tiers = [
    { severity: 'Critical', reward: '$5,000 - $10,000', description: 'Remote code execution, authentication bypass' },
    { severity: 'High', reward: '$2,000 - $5,000', description: 'Privilege escalation, data leaks' },
    { severity: 'Medium', reward: '$500 - $2,000', description: 'XSS, CSRF, minor security issues' },
    { severity: 'Low', reward: '$100 - $500', description: 'Information disclosure, minor bugs' }
  ]
  
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="container mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-12 text-center">Bug Bounty Program</h1>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <h2 className="text-2xl font-bold mb-4">Reward Tiers</h2>
            <div className="space-y-4">
              {tiers.map(tier => (
                <div key={tier.severity} className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold">{tier.severity}</h3>
                    <span className="text-blue-400 font-semibold">{tier.reward}</span>
                  </div>
                  <p className="text-sm text-slate-400">{tier.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
