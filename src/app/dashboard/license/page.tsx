'use client'
import { Card, Badge } from '@/components/ui'
import { useLicense } from '@/hooks/useLicense'

export default function LicensePage() {
  const { license } = useLicense()
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">License Management</h1>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Current License</h2>
        {license ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Plan:</span>
              <Badge variant="info">{license.tier}</Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Status:</span>
              <Badge variant={license.status === 'active' ? 'success' : 'danger'}>
                {license.status}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Seats:</span>
              <span>{license.usedSeats || 0} / {license.seats || 1}</span>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No active license found.</p>
        )}
      </Card>
    </div>
  )
}
