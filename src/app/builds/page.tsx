import { Navbar, Footer } from '@/components/layout'
import { Card, Button, Badge } from '@/components/ui'

export default function BuildsPage() {
  const builds = [
    { version: '1.0.0', date: '2024-01-15', status: 'stable', size: '45 MB' }
  ]
  
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="container mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-12 text-center">Client Builds</h1>
        <div className="max-w-4xl mx-auto space-y-6">
          {builds.map(build => (
            <Card key={build.version}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">v{build.version}</h2>
                    <Badge variant="success">{build.status}</Badge>
                  </div>
                  <p className="text-slate-400">Released: {build.date}</p>
                  <p className="text-sm text-slate-500">Size: {build.size}</p>
                </div>
                <Button variant="primary">Download</Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
