import { Activation } from '@/types';
import { Card, Badge, Button } from '@/components/ui';
import { formatDate, maskHwid } from '@/lib/utils';

interface DeviceListProps {
  activations: Activation[];
  onDeactivate: (activationId: string) => void;
}

export function DeviceList({ activations, onDeactivate }: DeviceListProps) {
  if (activations.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Active Devices</h3>
        <p className="text-slate-400 text-sm">No devices activated yet</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Active Devices</h3>
      <div className="space-y-3">
        {activations.map((activation) => (
          <div
            key={activation.id}
            className="flex items-center justify-between pb-3 border-b border-white/5 last:border-0"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-slate-200">{activation.deviceName}</p>
                <Badge variant={activation.isActive ? 'success' : 'default'}>
                  {activation.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-mono">HWID: {maskHwid(activation.hwid)}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span>Activated: {formatDate(activation.activatedAt)}</span>
                <span>•</span>
                <span>Last seen: {formatDate(activation.lastSeenAt)}</span>
              </div>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDeactivate(activation.id)}
            >
              Deactivate
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
