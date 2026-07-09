import { Navbar, Footer } from '@/components/layout'
import { GridBackground } from '@/components/effects'
import { 
  HeroSection, 
  FeatureGrid, 
  HowItWorks, 
  ComparisonTable, 
  PricingCards,
  Testimonials,
  TrustSection,
  FaqAccordion
} from '@/components/marketing'

export default function Home() {
  return (
    <>
      <Navbar />
      <GridBackground />
      <main className="relative z-10">
        <HeroSection />
        <FeatureGrid />
        <HowItWorks />
        <ComparisonTable />
        <PricingCards />
        <Testimonials />
        <TrustSection />
        <FaqAccordion />
      </main>
      <Footer />
    </>
  )
}
