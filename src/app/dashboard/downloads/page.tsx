'use client'
import { Card, Button } from '@/components/ui'

export default function DownloadsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Downloads</h1>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Client Downloads</h2>
        <p className="text-slate-400 mb-6">Download the latest version of Stealth anti-cheat client.</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
            <div>
              <h3 className="font-semibold">Windows Client v1.0.0</h3>
              <p className="text-sm text-slate-400">Latest stable release</p>
            </div>
            <Button variant="primary">Download</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
