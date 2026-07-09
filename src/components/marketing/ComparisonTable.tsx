'use client'

import { Card } from '@/components/ui'
import { Check, X } from 'lucide-react'
import { ScrollReveal } from '@/components/effects'

const features = [
  { name: 'Detection Method', usermode: 'Process Monitoring', kernel: 'Ring-0 Driver' },
  { name: 'Detection Rate', usermode: '94.2%', kernel: '99.97%' },
  { name: 'Memory Scanning', usermode: true, kernel: true },
  { name: 'Signature Updates', usermode: 'Weekly', kernel: 'Real-time' },
  { name: 'AI Behavioral Analysis', usermode: false, kernel: true },
  { name: 'HWID Binding', usermode: true, kernel: true },
  { name: 'Source Code Access', usermode: false, kernel: true },
  { name: 'Team Licenses', usermode: false, kernel: true },
  { name: 'Priority Support', usermode: false, kernel: true },
  { name: 'SLA Guarantee', usermode: false, kernel: '99.9% Uptime' },
]

export function ComparisonTable() {
  return (
    <section className="relative py-32 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              Choose Your Protection Level
            </h2>
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
              Both tiers provide industry-leading protection. Kernel tier adds AI-powered detection
              and enterprise features for mission-critical deployments.
            </p>
          </div>
        </ScrollReveal>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-strong">
                  <th className="text-left p-6 text-foreground-muted font-medium">Feature</th>
                  <th className="p-6 text-center">
                    <div className="text-lg font-bold text-foreground mb-1">Usermode</div>
                    <div className="text-sm text-foreground-muted">Standard Protection</div>
                  </th>
                  <th className="p-6 text-center bg-primary-dim border-l border-r border-border-accent">
                    <div className="text-lg font-bold text-primary mb-1">Kernel</div>
                    <div className="text-sm text-primary/70">Enterprise Grade</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="p-6 font-medium text-foreground">{feature.name}</td>
                    <td className="p-6 text-center text-foreground-muted">
                      {typeof feature.usermode === 'boolean' ? (
                        feature.usermode ? (
                          <Check className="w-5 h-5 text-success mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-foreground-dim mx-auto" />
                        )
                      ) : (
                        feature.usermode
                      )}
                    </td>
                    <td className="p-6 text-center bg-primary-dim/30 text-foreground">
                      {typeof feature.kernel === 'boolean' ? (
                        feature.kernel ? (
                          <Check className="w-5 h-5 text-primary mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-foreground-dim mx-auto" />
                        )
                      ) : (
                        <span className="font-semibold">{feature.kernel}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  )
}
