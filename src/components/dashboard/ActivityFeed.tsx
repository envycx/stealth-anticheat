import { ActivityEvent } from '@/types';
import { Card } from '@/components/ui';
import { formatDate } from '@/lib/utils';

interface ActivityFeedProps {
  events: ActivityEvent[];
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  if (events.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Activity Feed</h3>
        <p className="text-slate-400 text-sm">No recent activity</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Activity Feed</h3>
      <div className="space-y-3">
        {events.slice(0, 10).map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0"
          >
            <div className="flex-1">
              <p className="text-sm text-slate-200">{event.description}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span>{formatDate(event.timestamp, { 
                  month: 'short', 
                  day: 'numeric', 
                  hour: 'numeric', 
                  minute: 'numeric' 
                })}</span>
                <span>•</span>
                <span>{event.ipAddress}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
