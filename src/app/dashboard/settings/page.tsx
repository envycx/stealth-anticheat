'use client'
import { Card, Input, Button } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'

export default function SettingsPage() {
  const { user } = useAuth()
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        <form className="space-y-4">
          <Input label="Username" defaultValue={user?.username || ''} />
          <Input label="Email" type="email" defaultValue={user?.email || ''} />
          <Button variant="primary">Save Changes</Button>
        </form>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Security</h2>
        <div className="space-y-4">
          <Button variant="secondary">Change Password</Button>
          <Button variant="secondary">Enable Two-Factor Authentication</Button>
        </div>
      </Card>
    </div>
  )
}
