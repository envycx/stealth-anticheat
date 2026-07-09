import { Navbar, Footer } from '@/components/layout'
import { Card } from '@/components/ui'

export default function ChangelogPage() {
  const releases = [
    { version: '1.0.0', date: '2024-01-15', changes: ['Initial release', 'Core anti-cheat features', 'Dashboard v1'] }
  ]
  
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="container mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-12 text-center">Changelog</h1>
        <div className="max-w-4xl mx-auto space-y-6">
          {releases.map(release => (
            <Card key={release.version}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">v{release.version}</h2>
                <span className="text-slate-400">{release.date}</span>
              </div>
              <ul className="space-y-2">
                {release.changes.map((change, i) => (
                  <li key={i} className="text-slate-400">• {change}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
