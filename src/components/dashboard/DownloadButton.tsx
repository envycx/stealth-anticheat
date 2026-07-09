import { Build, LicenseTier } from '@/types';
import { Button } from '@/components/ui';

interface DownloadButtonProps {
  build: Build;
  userTier: LicenseTier | 'none';
  type: 'exe' | 'source';
  onDownload: (build: Build, type: 'exe' | 'source') => void;
}

export function DownloadButton({ build, userTier, type, onDownload }: DownloadButtonProps) {
  const canDownloadExe = userTier !== 'none' && (build.tier === 'all' || build.tier === userTier);
  const canDownloadSource = userTier === 'kernel' && type === 'source' && build.downloads.sourceZip;

  const isDisabled = type === 'exe' ? !canDownloadExe : !canDownloadSource;

  const getTooltipText = () => {
    if (type === 'exe' && userTier === 'none') {
      return 'Purchase a license to download';
    }
    if (type === 'exe' && build.tier !== 'all' && build.tier !== userTier) {
      return `Requires ${build.tier} tier license`;
    }
    if (type === 'source' && userTier !== 'kernel') {
      return 'Requires kernel tier license';
    }
    return undefined;
  };

  return (
    <Button
      variant={type === 'exe' ? 'primary' : 'secondary'}
      size="sm"
      disabled={isDisabled}
      onClick={() => onDownload(build, type)}
      title={getTooltipText()}
    >
      {type === 'exe' ? 'Download EXE' : 'Download Source'}
    </Button>
  );
}
