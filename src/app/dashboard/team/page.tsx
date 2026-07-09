'use client'
import { Card, Button, Badge } from '@/components/ui'

export default function TeamPage() {
  const members = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Owner', status: 'active' }
  ]
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Team Members</h1>
        <Button variant="primary">Invite Member</Button>
      </div>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Team</h2>
        <div className="space-y-4">
          {members.map(member => (
            <div key={member.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-slate-400">{member.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="info">{member.role}</Badge>
                <Button variant="secondary" size="sm">Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
