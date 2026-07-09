'use client'

import { useState } from 'react'
import { Card, Button, Badge } from '@/components/ui'
import { Check, Zap } from 'lucide-react'
import { ScrollReveal } from '@/components/effects'

export function PricingCards() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual')

  const tiers = [
    {
      name: 'Usermode',
      description: 'Professional-grade protection',
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        'Process & memory scanning',
        '94%+ detection rate',
        'HWID device binding',
        'API access & webhooks',
        'Community support',
        '48-hour response SLA',
      ],
      cta: 'Start Protecting',
      popular: false,
    },
    {
      name: 'Kernel',
      description: 'Enterprise-grade security',
      monthlyPrice: 79,
      annualPrice: 790,
      features: [
        'Ring-0 kernel driver',
        '99.97% detection rate',
        'AI behavioral analysis',
        'Real-time threat intelligence',
        'Team licenses (up to 20 seats)',
        'Source code access (with 2FA)',
        'Priority support',
        '99.9% uptime SLA',
      ],
      cta: 'Deploy Enterprise',
      popular: true,
    },
  ]

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              Transparent Pricing
            </h2>
            <p className="text-xl text-foreground-muted mb-8">
              No hidden fees. Cancel anytime. 14-day money-back guarantee.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-3 p-1 bg-surface-elevated rounded-full">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billing === 'monthly'
                    ? 'bg-primary text-background'
                    : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('annual')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billing === 'annual'
                    ? 'bg-primary text-background'
                    : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                Annual
                <span className="ml-2 text-xs text-success">Save 17%</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          {tiers.map((tier, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <Card
                className={`relative p-8 ${
                  tier.popular ? 'border-primary glow-primary' : ''
                }`}
              >
                {tier.popular && (
                  <Badge className="absolute top-6 right-6 bg-primary text-background border-primary">
                    Most Popular
                  </Badge>
                )}

                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-foreground mb-2">{tier.name}</h3>
                  <p className="text-foreground-muted">{tier.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-foreground">
                      ${billing === 'monthly' ? tier.monthlyPrice : Math.floor(tier.annualPrice / 12)}
                    </span>
                    <span className="text-foreground-muted">/month</span>
                  </div>
                  {billing === 'annual' && (
                    <p className="text-sm text-foreground-muted mt-2">
                      Billed annually at ${tier.annualPrice}
                    </p>
                  )}
                </div>

                <Button
                  size="lg"
                  variant={tier.popular ? 'primary' : 'secondary'}
                  className="w-full mb-8"
                >
                  {tier.popular && <Zap className="w-4 h-4 mr-2" />}
                  {tier.cta}
                </Button>

                <div className="space-y-4">
                  {tier.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground-muted">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <p className="text-center text-foreground-dim mt-12">
          Enterprise deployments (100+ servers)?{' '}
          <a href="/contact" className="text-primary hover:underline">
            Contact sales
          </a>
        </p>
      </div>
    </section>
  )
}
