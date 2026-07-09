import { Build, LicenseTier } from '@/types';
import { Card, Badge, Button } from '@/components/ui';
import { formatDate } from '@/lib/utils';

interface BuildCardProps {
  build: Build;
  userTier: LicenseTier | 'none';
  onDownload: (build: Build, type: 'exe' | 'source') => void;
}

export function BuildCard({ build, userTier, onDownload }: BuildCardProps) {
  const canDownloadExe = userTier !== 'none' && (build.tier === 'all' || build.tier === userTier);
  const canDownloadSource = userTier === 'kernel' && build.downloads.sourceZip;

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">v{build.version}</h3>
            <Badge variant="info">{build.tier}</Badge>
            {build.isSigned && <Badge variant="success">Signed</Badge>}
          </div>
          <p className="text-sm text-slate-400">{formatDate(build.releasedAt)}</p>
        </div>
      </div>

      <p className="text-sm text-slate-300 mb-3">{build.changelogSummary}</p>

      {build.changelogItems.length > 0 && (
        <ul className="text-sm text-slate-400 space-y-1 mb-4 list-disc list-inside">
          {build.changelogItems.slice(0, 3).map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}

      <div className="flex gap-2 mt-4">
        <Button
          variant="primary"
          size="sm"
          disabled={!canDownloadExe}
          onClick={() => onDownload(build, 'exe')}
        >
          Download EXE
        </Button>
        {build.downloads.sourceZip && (
          <Button
            variant="secondary"
            size="sm"
            disabled={!canDownloadSource}
            onClick={() => onDownload(build, 'source')}
          >
            Download Source
          </Button>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-xs text-slate-500 font-mono">SHA256: {build.sha256.slice(0, 16)}...</p>
      </div>
    </Card>
  );
}
