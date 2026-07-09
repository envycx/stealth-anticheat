import { APIKey } from '@/types';
import { Badge, Button, CopyButton } from '@/components/ui';
import { formatDate } from '@/lib/utils';

interface ApiKeyRowProps {
  apiKey: APIKey;
  onRevoke: (keyId: string) => void;
  onToggle: (keyId: string) => void;
}

export function ApiKeyRow({ apiKey, onRevoke, onToggle }: ApiKeyRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-slate-200">{apiKey.name}</p>
          <Badge variant={apiKey.isActive ? 'success' : 'default'}>
            {apiKey.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <Badge variant={apiKey.environment === 'production' ? 'warning' : 'info'}>
            {apiKey.environment}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-slate-500 font-mono">{apiKey.keyPreview}</p>
          {apiKey.fullKey && <CopyButton value={apiKey.fullKey} />}
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
          <span>Created: {formatDate(apiKey.createdAt)}</span>
          {apiKey.lastUsedAt && (
            <>
              <span>•</span>
              <span>Last used: {formatDate(apiKey.lastUsedAt)}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onToggle(apiKey.id)}
        >
          {apiKey.isActive ? 'Disable' : 'Enable'}
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onRevoke(apiKey.id)}
        >
          Revoke
        </Button>
      </div>
    </div>
  );
}
