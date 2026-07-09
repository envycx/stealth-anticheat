import { Navbar, Footer } from '@/components/layout'
import { Card, Badge } from '@/components/ui'

export default function StatusPage() {
  const services = [
    { name: 'API', status: 'operational', uptime: '99.99%' },
    { name: 'Dashboard', status: 'operational', uptime: '99.98%' },
    { name: 'Client Downloads', status: 'operational', uptime: '100%' }
  ]
  
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="container mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-12 text-center">System Status</h1>
        <Card className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {services.map(service => (
              <div key={service.name} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div>
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-sm text-slate-400">Uptime: {service.uptime}</p>
                </div>
                <Badge variant="success">Operational</Badge>
              </div>
            ))}
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
