import { Navbar, Footer } from '@/components/layout'
import { Card } from '@/components/ui'

export default function DocsPage() {
  const sections = [
    { title: 'Getting Started', description: 'Learn the basics of integrating Stealth' },
    { title: 'API Reference', description: 'Complete API documentation' },
    { title: 'SDKs', description: 'Client libraries and integrations' }
  ]
  
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="container mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-12 text-center">Documentation</h1>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {sections.map(section => (
            <Card key={section.title} className="cursor-pointer hover:border-blue-500 transition-colors">
              <h2 className="text-xl font-bold mb-2">{section.title}</h2>
              <p className="text-slate-400">{section.description}</p>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
