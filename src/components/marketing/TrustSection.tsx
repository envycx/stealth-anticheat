import { Card } from '@/components/ui'
import { Shield, Activity, Bug } from 'lucide-react'

export function TrustSection() {
  return (
    <section className="py-20 px-6 bg-white/5">
      <h2 className="text-3xl font-bold text-center mb-12">Why Trust Stealth?</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Card>
          <Shield className="w-12 h-12 text-cyan-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Verified Builds</h3>
          <p className="text-slate-400 mb-4">All checksums published</p>
          <a href="/builds" className="text-cyan-400 hover:underline">View Checksums →</a>
        </Card>
        <Card>
          <Activity className="w-12 h-12 text-cyan-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Live Status</h3>
          <p className="text-slate-400 mb-4">Real-time system health</p>
          <a href="/status" className="text-cyan-400 hover:underline">Check Status →</a>
        </Card>
        <Card>
          <Bug className="w-12 h-12 text-cyan-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Bug Bounty</h3>
          <p className="text-slate-400 mb-4">Responsible disclosure program</p>
          <a href="/bug-bounty" className="text-cyan-400 hover:underline">Learn More →</a>
        </Card>
      </div>
    </section>
  )
}
