'use client'

import { Button } from '@/components/ui'
import { Shield, Zap, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import { CounterAnimation } from '@/components/effects'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background mesh */}
      <div className="absolute inset-0 gradient-mesh" />
      
      {/* Floating security grid */}
      <div className="absolute inset-0 opacity-20 grid-pattern" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#08080c_100%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
        {/* Security badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-dim border border-border-accent mb-8"
        >
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Enterprise-Grade Protection</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="block text-foreground">Next-Generation</span>
          <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Anti-Cheat System
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          AI-powered detection engine protecting competitive gaming with
          real-time threat analysis, kernel-level security, and zero tolerance for cheaters.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
        >
          <Button size="lg" className="px-8 py-4 text-lg glow-primary">
            <Zap className="w-5 h-5 mr-2" />
            Deploy Protection
          </Button>
          <Button variant="secondary" size="lg" className="px-8 py-4 text-lg">
            <Activity className="w-5 h-5 mr-2" />
            View Live Stats
          </Button>
        </motion.div>

        {/* Real-time stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
        >
          {[
            { label: 'Detection Rate', value: 99.97, suffix: '%' },
            { label: 'False Positives', value: 0.03, suffix: '%', prefix: '<' },
            { label: 'Response Time', value: 1.8, suffix: 'ms' },
            { label: 'Protected Servers', value: 15420, suffix: '+' },
          ].map((stat, i) => (
            <div key={i} className="glass-strong rounded-xl p-6 border border-border-accent/50">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.prefix}
                <CounterAnimation target={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-sm text-foreground-muted font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Animated security indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-primary"
          />
        ))}
      </div>
    </section>
  )
}
