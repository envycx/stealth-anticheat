'use client'
import { useAuth } from '@/hooks/useAuth'
import { Card } from '@/components/ui'

export default function DashboardPage() {
  const { user } = useAuth()
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Welcome back, {user?.username || 'User'}</h1>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <p className="text-slate-400">Dashboard under construction. Navigate using the sidebar.</p>
      </Card>
    </div>
  )
}
