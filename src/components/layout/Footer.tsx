import { Shield } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  const links = {
    Product: [
      { name: 'Features', href: '/#features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Changelog', href: '/changelog' },
      { name: 'Status', href: '/status' },
    ],
    Developers: [
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/docs#api' },
      { name: 'Downloads', href: '/builds' },
      { name: 'Bug Bounty', href: '/bug-bounty' },
    ],
    Company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ],
    Legal: [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
      { name: 'Security', href: '/security' },
      { name: 'Compliance', href: '/compliance' },
    ],
  }

  return (
    <footer className="relative border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                STEALTH
              </span>
            </Link>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Next-generation anti-cheat protecting competitive gaming since 2026.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-foreground mb-4">{category}</h3>
              <ul className="space-y-3">
                {items.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground-muted hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground-dim">
            © 2026 Stealth Security. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://twitter.com/stealth" className="text-foreground-muted hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="https://discord.gg/stealth" className="text-foreground-muted hover:text-primary transition-colors">
              Discord
            </a>
            <a href="https://github.com/stealth" className="text-foreground-muted hover:text-primary transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
