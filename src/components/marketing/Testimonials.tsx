import { Card } from '@/components/ui'

const testimonials = [
  { name: 'ProGamer123', server: 'Elite Competitive', quote: 'Best anti-cheat we\'ve used. Zero false positives.' },
  { name: 'ServerAdmin', server: 'Ranked Arena', quote: 'Easy API integration, great detection rate.' },
  { name: 'TeamOwner', server: 'Tournament Servers', quote: 'Kernel-level protection gives us confidence.' }
]

export function Testimonials() {
  return (
    <section className="py-20 px-6">
      <h2 className="text-3xl font-bold text-center mb-12">Trusted by Communities</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map((t, i) => (
          <Card key={i}>
            <p className="text-slate-300 mb-4">"{t.quote}"</p>
            <div className="text-sm">
              <p className="font-semibold text-cyan-400">{t.name}</p>
              <p className="text-slate-500">{t.server}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
