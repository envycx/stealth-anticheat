import { TeamMember } from '@/types';
import { Badge, Button, CopyButton } from '@/components/ui';
import { formatDate, maskHwid } from '@/lib/utils';

interface TeamMemberRowProps {
  member: TeamMember;
  onRevoke: (memberId: string) => void;
}

export function TeamMemberRow({ member, onRevoke }: TeamMemberRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-slate-200">
            {member.username || member.email}
          </p>
          <Badge
            variant={
              member.status === 'active'
                ? 'success'
                : member.status === 'pending'
                ? 'warning'
                : 'danger'
            }
          >
            {member.status}
          </Badge>
        </div>
        {member.username && (
          <p className="text-xs text-slate-500">{member.email}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-slate-500 font-mono">{member.subLicenseKey}</p>
          <CopyButton value={member.subLicenseKey} />
        </div>
        {member.hwid && (
          <p className="text-xs text-slate-500 mt-1">HWID: {maskHwid(member.hwid)}</p>
        )}
        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
          <span>Invited: {formatDate(member.invitedAt)}</span>
          {member.activatedAt && (
            <>
              <span>•</span>
              <span>Activated: {formatDate(member.activatedAt)}</span>
            </>
          )}
        </div>
      </div>
      <Button
        variant="danger"
        size="sm"
        onClick={() => onRevoke(member.id)}
        disabled={member.status === 'revoked'}
      >
        {member.status === 'revoked' ? 'Revoked' : 'Revoke'}
      </Button>
    </div>
  );
}
