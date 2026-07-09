'use client';

import React from 'react';
import { Shield, Zap, CheckCircle, Activity, Code2, Users } from 'lucide-react';
import { Card } from '@/components/ui';
import { ScrollReveal } from '@/components/effects';

const FEATURES = [
  {
    icon: Shield,
    title: 'Kernel-Level Detection',
    description: 'Operates at ring-0 for undetectable hooks and deep system-level protection against sophisticated cheats.',
    color: 'text-cyan-400',
    delay: 0,
  },
  {
    icon: Zap,
    title: 'Usermode Protection',
    description: 'Lightweight DLL for casual and competitive play with minimal performance impact.',
    color: 'text-cyan-400',
    delay: 100,
  },
  {
    icon: CheckCircle,
    title: 'Low False Positives',
    description: 'Under 0.1% false positive rate ensures legitimate players are never wrongly flagged.',
    color: 'text-green-400',
    delay: 200,
  },
  {
    icon: Activity,
    title: 'Real-Time Detection',
    description: 'Sub-2ms detection latency provides instant protection and immediate threat response.',
    color: 'text-cyan-400',
    delay: 0,
  },
  {
    icon: Code2,
    title: 'Developer SDK',
    description: 'RESTful API with webhook events for seamless integration into your game infrastructure.',
    color: 'text-violet-400',
    delay: 100,
  },
  {
    icon: Users,
    title: 'Team Licenses',
    description: 'Multi-seat licenses for organizations with centralized management and billing.',
    color: 'text-violet-400',
    delay: 200,
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Section title */}
        <ScrollReveal direction="up" className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Built for <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              Competitive Gaming
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Industry-leading anti-cheat technology that protects your competitive integrity
          </p>
        </ScrollReveal>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <ScrollReveal key={index} direction="up" delay={feature.delay}>
              <Card className="h-full hover:border-cyan-500/30 transition-colors duration-300" glow={false}>
                <div className="flex flex-col h-full">
                  <div className={`${feature.color} mb-4`}>
                    <feature.icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
