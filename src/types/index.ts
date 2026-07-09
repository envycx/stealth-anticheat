// ============================================================
// Stealth Anti-Cheat Platform — Shared TypeScript Types
// ============================================================

// ----------------------------------------------------------
// User
// ----------------------------------------------------------

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
  twoFactorEnabled: boolean;
  role: 'user' | 'admin';
}

// ----------------------------------------------------------
// License
// ----------------------------------------------------------

export type LicenseTier = 'usermode' | 'kernel';
export type LicenseStatus = 'active' | 'expired' | 'suspended' | 'none';

export interface License {
  id: string;
  userId: string;
  tier: LicenseTier;
  status: LicenseStatus;
  /** Display format: STLTH-XXXX-XXXX-XXXX-XXXX */
  licenseKey: string;
  purchasedAt: Date;
  /** null = lifetime license */
  expiresAt: Date | null;
  maxActivations: number;
  activations: Activation[];
  /** For team licenses */
  seats?: number;
  usedSeats?: number;
}

export interface Activation {
  id: string;
  licenseId: string;
  /** Truncated display: "A1B2...F9G0" */
  hwid: string;
  deviceName: string;
  ipAddress: string;
  activatedAt: Date;
  lastSeenAt: Date;
  isActive: boolean;
}

// ----------------------------------------------------------
// Build
// ----------------------------------------------------------

export interface Build {
  id: string;
  /** Semver string, e.g. "2.4.1" */
  version: string;
  releasedAt: Date;
  changelogSummary: string;
  changelogItems: string[];
  /** 64-character hex string */
  sha256: string;
  isSigned: boolean;
  downloads: {
    /** Mock download URL */
    exe?: string;
    /** Only for kernel tier + 2FA enabled */
    sourceZip?: string;
  };
  tier: LicenseTier | 'all';
}

// ----------------------------------------------------------
// API Keys & Webhooks
// ----------------------------------------------------------

export type APIKeyEnvironment = 'production' | 'sandbox';

export interface APIKey {
  id: string;
  userId: string;
  name: string;
  /** Masked preview, e.g. "sk_live_xxxx...xxxx" */
  keyPreview: string;
  /** Only populated at creation moment, then discarded */
  fullKey?: string;
  environment: APIKeyEnvironment;
  createdAt: Date;
  lastUsedAt: Date | null;
  isActive: boolean;
  webhooks: WebhookConfig[];
}

export interface WebhookConfig {
  id: string;
  apiKeyId: string;
  type: 'discord' | 'slack' | 'custom';
  url: string;
  events: ('ban' | 'flag' | 'detection')[];
  isActive: boolean;
}

// ----------------------------------------------------------
// Team
// ----------------------------------------------------------

export type TeamMemberStatus = 'active' | 'pending' | 'revoked';

export interface TeamMember {
  id: string;
  teamLicenseId: string;
  email: string;
  username?: string;
  status: TeamMemberStatus;
  invitedAt: Date;
  activatedAt: Date | null;
  subLicenseKey: string;
  hwid?: string;
}

// ----------------------------------------------------------
// Activity Feed
// ----------------------------------------------------------

export type ActivityEventType =
  | 'login'
  | 'download'
  | 'license_activated'
  | 'hwid_reset'
  | 'api_key_generated'
  | 'api_key_revoked'
  | 'team_member_added'
  | 'team_member_removed'
  | '2fa_enabled'
  | '2fa_disabled';

export interface ActivityEvent {
  id: string;
  userId: string;
  type: ActivityEventType;
  description: string;
  ipAddress: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// ----------------------------------------------------------
// Auth Context State
// ----------------------------------------------------------

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** true when awaiting 2FA code after successful password check */
  pendingTwoFactor: boolean;
}

export type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_PENDING_2FA' }
  | { type: 'TWO_FACTOR_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean };

// ----------------------------------------------------------
// License Context State
// ----------------------------------------------------------

export interface LicenseState {
  license: License | null;
  builds: Build[];
  activityFeed: ActivityEvent[];
  apiKeys: APIKey[];
  teamMembers: TeamMember[];
  isLoading: boolean;
}
