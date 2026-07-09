import { Accordion } from '@/components/ui'

const faqs = [
  { title: 'What games does Stealth support?', content: 'All major titles with custom integration via our API.' },
  { title: 'Usermode vs Kernel difference?', content: 'Kernel operates at ring-0 for deeper detection, Usermode is DLL-based.' },
  { title: 'Will it trigger other anti-cheats?', content: 'No, designed to be transparent to EAC/VAC/BattlEye.' },
  { title: 'How does HWID binding work?', content: 'Hardware fingerprint locks your license to specific devices.' },
  { title: 'Refund policy?', content: '7-day money-back guarantee, no questions asked.' },
  { title: 'Source code available?', content: 'Yes, for Kernel tier with 2FA enabled.' }
]

export function FaqAccordion() {
  return (
    <section className="py-20 px-6">
      <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto">
        <Accordion items={faqs} />
      </div>
    </section>
  )
}
