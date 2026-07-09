import { License } from '@/types';
import { Card, Badge, CopyButton } from '@/components/ui';
import { formatLicenseKey } from '@/lib/utils';

interface LicenseStatusCardProps {
  license: License | null;
}

export function LicenseStatusCard({ license }: LicenseStatusCardProps) {
  if (!license) {
    return (
      <Card variant="danger">
        <h3 className="text-lg font-semibold mb-2">No Active License</h3>
        <p className="text-slate-400 mb-4">Purchase a license to access downloads</p>
        <a href="/pricing" className="text-cyan-400 hover:underline">
          Get Started →
        </a>
      </Card>
    );
  }

  return (
    <Card variant="highlighted">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">License Status</h3>
          <Badge variant={license.status === 'active' ? 'success' : 'danger'}>
            {license.tier} • {license.status}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-2 font-mono text-sm">
        <span>{formatLicenseKey(license.licenseKey)}</span>
        <CopyButton value={license.licenseKey} />
      </div>
    </Card>
  );
}
