'use client'
import { Card, Button } from '@/components/ui'

export default function SupportPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Support</h1>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Get Help</h2>
        <div className="space-y-4">
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="font-semibold mb-2">Documentation</h3>
            <p className="text-sm text-slate-400 mb-3">Browse our comprehensive guides and API documentation.</p>
            <Button variant="secondary" size="sm">View Docs</Button>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="font-semibold mb-2">Contact Support</h3>
            <p className="text-sm text-slate-400 mb-3">Need help? Our support team is here for you.</p>
            <Button variant="secondary" size="sm">Open Ticket</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
