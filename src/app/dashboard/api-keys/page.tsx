'use client'
import { useState } from 'react'
import { Card, Button, CopyButton } from '@/components/ui'

export default function ApiKeysPage() {
  const [keys, setKeys] = useState([
    { id: '1', name: 'Production API Key', key: 'sk_live_****************************', created: '2024-01-15' }
  ])
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">API Keys</h1>
        <Button variant="primary">Generate New Key</Button>
      </div>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Your API Keys</h2>
        <div className="space-y-4">
          {keys.map(key => (
            <div key={key.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <h3 className="font-semibold">{key.name}</h3>
                <p className="text-sm text-slate-400 font-mono">{key.key}</p>
                <p className="text-xs text-slate-500 mt-1">Created: {key.created}</p>
              </div>
              <div className="flex gap-2">
                <CopyButton value={key.key} />
                <Button variant="danger" size="sm">Revoke</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
