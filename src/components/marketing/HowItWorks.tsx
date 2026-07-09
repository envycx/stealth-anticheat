'use client';

import React from 'react';
import { ScrollReveal } from '@/components/effects';
import { ArrowRight } from 'lucide-react';

const STEPS = [
  {
    number: 1,
    title: 'Install',
    description: 'Download and install the Stealth agent. Usermode DLL or kernel-level driver depending on your tier.',
  },
  {
    number: 2,
    title: 'Activate License',
    description: 'Enter your license key to activate protection. HWID binding secures your license to your device.',
  },
  {
    number: 3,
    title: 'Real-Time Scan',
    description: 'Stealth continuously monitors game processes, memory, and system state for cheat signatures.',
  },
  {
    number: 4,
    title: 'Detection Event',
    description: 'On detection, a webhook event fires to your server. Take action instantly: ban, flag, or alert.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Section title */}
        <ScrollReveal direction="up" className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            How It <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            From installation to detection in four simple steps
          </p>
        </ScrollReveal>

        {/* Steps — horizontal on desktop, vertical on mobile */}
        <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-0 lg:items-start">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.number}>
              <ScrollReveal
                direction="up"
                delay={index * 150}
                className="flex-1"
              >
                <div className="flex flex-col items-center text-center lg:px-6">
                  {/* Numbered circle */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-[0_0_24px_rgba(0,240,255,0.35)]">
                      <span className="text-xl font-bold text-white">{step.number}</span>
                    </div>
                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-[ping_2s_ease-in-out_infinite]" />
                  </div>

                  <h3 className="text-xl font-semibold text-slate-200 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>

              {/* Connector arrow — shown between steps on desktop only */}
              {index < STEPS.length - 1 && (
                <div className="hidden lg:flex items-start pt-7 text-slate-600">
                  <ArrowRight size={24} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
