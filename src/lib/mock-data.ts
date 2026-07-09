// ============================================================
// Stealth Anti-Cheat Platform — Mock Data & Seed State
// ============================================================
//
// This file provides seeded mock data for all platform types.
// It is the single source of truth for development and testing.
//
// Developer flag: set `shouldSimulateError = true` to test
// error-state UI flows across all mock async operations.
//
// TODO: Replace all mock data and async handlers with real
// backend API calls (Stripe, HWID service, detection engine,
// webhook delivery, TOTP / 2FA provider).

import type {
  User,
  License,
  Activation,
  Build,
  APIKey,
  WebhookConfig,
  TeamMember,
  ActivityEvent,
} from '@/types';

// ----------------------------------------------------------
// Developer flags
// ----------------------------------------------------------

/**
 * Set to `true` to make all mock async operations reject with
 * an error, so you can test error-state UI during development.
 */
export let shouldSimulateError = false;

// ----------------------------------------------------------
// Internal helpers
// ----------------------------------------------------------

/** Simulate a realistic async latency between 600 ms and 1200 ms. */
export function mockDelay(): Promise<void> {
  const ms = 600 + Math.floor(Math.random() * 601);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wrap a mock operation with the standard async delay and
 * optional error simulation. Throw if `shouldSimulateError`
 * is true; otherwise return the resolved value.
 */
export async function mockAsync<T>(value: T): Promise<T> {
  await mockDelay();
  if (shouldSimulateError) {
    throw new Error('Simulated server error — set shouldSimulateError = false to disable.');
  }
  return value;
}

// ----------------------------------------------------------
// Users — three seeded personas
// ----------------------------------------------------------

/** User with an active kernel-tier license (team, 2FA enabled). */
export const MOCK_USER_KERNEL: User = {
  id: 'usr_kernel_001',
  username: 'kernel_dev',
  email: 'kernel@stealth.gg',
  avatarUrl: undefined,
  createdAt: new Date('2023-06-15T10:00:00Z'),
  twoFactorEnabled: true,
  role: 'user',
};

/** User with an active usermode-tier license (no 2FA). */
export const MOCK_USER_USERMODE: User = {
  id: 'usr_usermode_002',
  username: 'usermode_player',
  email: 'usermode@stealth.gg',
  avatarUrl: undefined,
  createdAt: new Date('2023-09-01T14:30:00Z'),
  twoFactorEnabled: false,
  role: 'user',
};

/** User with no license at all. */
export const MOCK_USER_NO_LICENSE: User = {
  id: 'usr_nolicense_003',
  username: 'new_user',
  email: 'nolicense@stealth.gg',
  avatarUrl: undefined,
  createdAt: new Date('2024-01-20T08:00:00Z'),
  twoFactorEnabled: false,
  role: 'user',
};

export const MOCK_USERS: User[] = [
  MOCK_USER_KERNEL,
  MOCK_USER_USERMODE,
  MOCK_USER_NO_LICENSE,
];

// ----------------------------------------------------------
// Activations (HWID records)
// ----------------------------------------------------------

const ACTIVATIONS_KERNEL: Activation[] = [
  {
    id: 'act_k_001',
    licenseId: 'lic_kernel_001',
    hwid: 'A1B2C3D4E5F6G7H8',
    deviceName: 'DESKTOP-MAIN',
    ipAddress: '192.168.1.101',
    activatedAt: new Date('2023-06-15T10:05:00Z'),
    lastSeenAt: new Date('2024-11-01T18:22:00Z'),
    isActive: true,
  },
  {
    id: 'act_k_002',
    licenseId: 'lic_kernel_001',
    hwid: 'Z9Y8X7W6V5U4T3S2',
    deviceName: 'LAPTOP-SECONDARY',
    ipAddress: '10.0.0.55',
    activatedAt: new Date('2023-08-20T09:15:00Z'),
    lastSeenAt: new Date('2024-10-28T11:00:00Z'),
    isActive: true,
  },
];

const ACTIVATIONS_USERMODE: Activation[] = [
  {
    id: 'act_u_001',
    licenseId: 'lic_usermode_001',
    hwid: 'M1N2O3P4Q5R6S7T8',
    deviceName: 'GAMING-PC',
    ipAddress: '172.16.0.10',
    activatedAt: new Date('2023-09-01T15:00:00Z'),
    lastSeenAt: new Date('2024-10-31T20:45:00Z'),
    isActive: true,
  },
];

// ----------------------------------------------------------
// Licenses
// ----------------------------------------------------------

/** Active kernel-tier team license. Lifetime, 5 seats. */
export const MOCK_LICENSE_KERNEL: License = {
  id: 'lic_kernel_001',
  userId: MOCK_USER_KERNEL.id,
  tier: 'kernel',
  status: 'active',
  licenseKey: 'STLTH-K3RN-EL00-1111-AAAA',
  purchasedAt: new Date('2023-06-15T10:00:00Z'),
  expiresAt: null, // lifetime
  maxActivations: 3,
  activations: ACTIVATIONS_KERNEL,
  seats: 5,
  usedSeats: 3,
};

/** Active usermode-tier license. Annual subscription. */
export const MOCK_LICENSE_USERMODE: License = {
  id: 'lic_usermode_001',
  userId: MOCK_USER_USERMODE.id,
  tier: 'usermode',
  status: 'active',
  licenseKey: 'STLTH-US3R-M0DE-2222-BBBB',
  purchasedAt: new Date('2023-09-01T14:30:00Z'),
  expiresAt: new Date('2024-09-01T14:30:00Z'),
  maxActivations: 2,
  activations: ACTIVATIONS_USERMODE,
};

// No license for MOCK_USER_NO_LICENSE — license is null in context.

// ----------------------------------------------------------
// Builds
// ----------------------------------------------------------

export const MOCK_BUILDS: Build[] = [
  {
    id: 'build_001',
    version: '2.5.0',
    releasedAt: new Date('2024-10-15T12:00:00Z'),
    changelogSummary: 'Major kernel driver update with improved stealth and BattlEye compatibility.',
    changelogItems: [
      'Rewrote kernel driver signature to evade new BattlEye scan patterns',
      'Reduced false-positive rate by 12% on AMD GPU workloads',
      'Added support for Windows 11 24H2',
      'Fixed race condition in HWID binding on multi-CPU systems',
    ],
    sha256: 'a3f5c8e1d2b4097f6e3a1c9d5b8f2e4a7c0d3e6b9f1a4c7e2b5d8f0a3c6e9b2',
    isSigned: true,
    downloads: {
      exe: '/mock-downloads/stealth-v2.5.0.exe',
      sourceZip: '/mock-downloads/stealth-v2.5.0-src.zip',
    },
    tier: 'kernel',
  },
  {
    id: 'build_002',
    version: '2.4.3',
    releasedAt: new Date('2024-09-02T08:30:00Z'),
    changelogSummary: 'Hotfix for VAC3 detection loop and usermode DLL stability improvements.',
    changelogItems: [
      'Patched VAC3 timing-based detection window',
      'Fixed DLL injection crash on 32-bit game processes',
      'Improved reconnect stability after network drops',
    ],
    sha256: 'e7d1a4b9c2f0e3a6d9b2c5f8e1a4d7b0c3f6e9a2d5b8c1f4e7a0d3b6c9f2e5a8',
    isSigned: true,
    downloads: {
      exe: '/mock-downloads/stealth-v2.4.3.exe',
      sourceZip: '/mock-downloads/stealth-v2.4.3-src.zip',
    },
    tier: 'kernel',
  },
  {
    id: 'build_003',
    version: '2.4.1',
    releasedAt: new Date('2024-07-18T16:00:00Z'),
    changelogSummary: 'Usermode release with improved EAC bypass and new detection event webhooks.',
    changelogItems: [
      'New EAC usermode bypass for updated game clients',
      'Webhook now fires on flag events in addition to ban events',
      'Performance improvements reducing CPU overhead by ~8%',
    ],
    sha256: 'b1d4f7a0c3e6b9d2f5a8c1e4b7d0f3a6c9e2b5d8f1a4c7e0b3d6f9a2c5e8b1d4',
    isSigned: true,
    downloads: {
      exe: '/mock-downloads/stealth-v2.4.1.exe',
    },
    tier: 'usermode',
  },
  {
    id: 'build_004',
    version: '2.3.0',
    releasedAt: new Date('2024-05-05T09:00:00Z'),
    changelogSummary: 'General availability release compatible with both tiers.',
    changelogItems: [
      'Unified installer for usermode and kernel tiers',
      'Added real-time detection logging to dashboard activity feed',
      'Improved 2FA TOTP compatibility with Authy and Google Authenticator',
    ],
    sha256: 'f9e2d5c8b1a4f7e0d3c6b9a2f5e8d1c4b7a0f3e6d9c2b5a8f1e4d7c0b3a6f9e2',
    isSigned: true,
    downloads: {
      exe: '/mock-downloads/stealth-v2.3.0.exe',
      sourceZip: '/mock-downloads/stealth-v2.3.0-src.zip',
    },
    tier: 'all',
  },
];

// ----------------------------------------------------------
// Webhooks
// ----------------------------------------------------------

const WEBHOOK_DISCORD: WebhookConfig = {
  id: 'wh_001',
  apiKeyId: 'key_001',
  type: 'discord',
  url: 'https://discord.com/api/webhooks/mock/placeholder',
  events: ['ban', 'detection'],
  isActive: true,
};

const WEBHOOK_SLACK: WebhookConfig = {
  id: 'wh_002',
  apiKeyId: 'key_002',
  type: 'slack',
  url: 'https://hooks.slack.com/services/mock/placeholder',
  events: ['ban', 'flag', 'detection'],
  isActive: true,
};

// ----------------------------------------------------------
// API Keys
// ----------------------------------------------------------

/**
 * Seeded API keys stored in list format — `fullKey` is always
 * undefined here. The `fullKey` is only populated by
 * `generateApiKey()` at the moment of creation and must be
 * stripped before the key is pushed into any stored list.
 */
export const MOCK_API_KEYS: APIKey[] = [
  {
    id: 'key_001',
    userId: MOCK_USER_KERNEL.id,
    name: 'Production Integration',
    keyPreview: 'sk_live_k3rn...9z2a',
    fullKey: undefined, // reveal-once: discarded after creation
    environment: 'production',
    createdAt: new Date('2023-07-01T11:00:00Z'),
    lastUsedAt: new Date('2024-10-30T14:22:00Z'),
    isActive: true,
    webhooks: [WEBHOOK_DISCORD],
  },
  {
    id: 'key_002',
    userId: MOCK_USER_KERNEL.id,
    name: 'Staging Tests',
    keyPreview: 'sk_live_stag...7b1c',
    fullKey: undefined,
    environment: 'sandbox',
    createdAt: new Date('2023-08-12T09:30:00Z'),
    lastUsedAt: new Date('2024-09-15T08:00:00Z'),
    isActive: true,
    webhooks: [WEBHOOK_SLACK],
  },
  {
    id: 'key_003',
    userId: MOCK_USER_KERNEL.id,
    name: 'Old Sandbox Key',
    keyPreview: 'sk_test_oldk...4f8d',
    fullKey: undefined,
    environment: 'sandbox',
    createdAt: new Date('2023-06-20T15:45:00Z'),
    lastUsedAt: null,
    isActive: false, // already revoked
    webhooks: [],
  },
];

// ----------------------------------------------------------
// Team Members
// ----------------------------------------------------------

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm_001',
    teamLicenseId: MOCK_LICENSE_KERNEL.id,
    email: 'alice@stealth.gg',
    username: 'alice_dev',
    status: 'active',
    invitedAt: new Date('2023-06-16T10:00:00Z'),
    activatedAt: new Date('2023-06-17T09:00:00Z'),
    subLicenseKey: 'STLTH-TM01-ALCE-3333-CCCC',
    hwid: 'P9Q8R7S6T5U4V3W2',
  },
  {
    id: 'tm_002',
    teamLicenseId: MOCK_LICENSE_KERNEL.id,
    email: 'bob@stealth.gg',
    username: 'bob_sec',
    status: 'active',
    invitedAt: new Date('2023-07-01T12:00:00Z'),
    activatedAt: new Date('2023-07-02T08:30:00Z'),
    subLicenseKey: 'STLTH-TM02-B0BS-4444-DDDD',
    hwid: 'L1M2N3O4P5Q6R7S8',
  },
  {
    id: 'tm_003',
    teamLicenseId: MOCK_LICENSE_KERNEL.id,
    email: 'charlie@stealth.gg',
    username: undefined,
    status: 'pending',
    invitedAt: new Date('2024-10-25T14:00:00Z'),
    activatedAt: null, // not yet activated
    subLicenseKey: 'STLTH-TM03-CH4R-5555-EEEE',
    hwid: undefined,
  },
  {
    id: 'tm_004',
    teamLicenseId: MOCK_LICENSE_KERNEL.id,
    email: 'dave@stealth.gg',
    username: 'dave_x',
    status: 'revoked',
    invitedAt: new Date('2023-09-10T10:00:00Z'),
    activatedAt: new Date('2023-09-11T11:00:00Z'),
    subLicenseKey: 'STLTH-TM04-D4VE-6666-FFFF',
    hwid: 'X1Y2Z3A4B5C6D7E8',
  },
];

// ----------------------------------------------------------
// Activity Events
// ----------------------------------------------------------

export const MOCK_ACTIVITY_EVENTS: ActivityEvent[] = [
  {
    id: 'evt_001',
    userId: MOCK_USER_KERNEL.id,
    type: 'login',
    description: 'Successful login from Chrome on Windows 11',
    ipAddress: '203.0.113.42',
    timestamp: new Date('2024-11-01T18:20:00Z'),
    metadata: { browser: 'Chrome', os: 'Windows 11' },
  },
  {
    id: 'evt_002',
    userId: MOCK_USER_KERNEL.id,
    type: 'download',
    description: 'Downloaded stealth-v2.5.0.exe',
    ipAddress: '203.0.113.42',
    timestamp: new Date('2024-11-01T18:22:00Z'),
    metadata: { buildId: 'build_001', filename: 'stealth-v2.5.0.exe' },
  },
  {
    id: 'evt_003',
    userId: MOCK_USER_KERNEL.id,
    type: 'api_key_generated',
    description: 'Generated API key "Production Integration"',
    ipAddress: '203.0.113.42',
    timestamp: new Date('2023-07-01T11:01:00Z'),
    metadata: { keyId: 'key_001', keyName: 'Production Integration' },
  },
  {
    id: 'evt_004',
    userId: MOCK_USER_KERNEL.id,
    type: 'team_member_added',
    description: 'Invited alice@stealth.gg to the team',
    ipAddress: '203.0.113.42',
    timestamp: new Date('2023-06-16T10:01:00Z'),
    metadata: { memberId: 'tm_001', email: 'alice@stealth.gg' },
  },
  {
    id: 'evt_005',
    userId: MOCK_USER_KERNEL.id,
    type: '2fa_enabled',
    description: 'Two-factor authentication enabled',
    ipAddress: '203.0.113.1',
    timestamp: new Date('2023-06-15T10:10:00Z'),
  },
  {
    id: 'evt_006',
    userId: MOCK_USER_KERNEL.id,
    type: 'license_activated',
    description: 'License activated on DESKTOP-MAIN',
    ipAddress: '192.168.1.101',
    timestamp: new Date('2023-06-15T10:05:00Z'),
    metadata: { activationId: 'act_k_001', deviceName: 'DESKTOP-MAIN' },
  },
  {
    id: 'evt_007',
    userId: MOCK_USER_KERNEL.id,
    type: 'api_key_revoked',
    description: 'Revoked API key "Old Sandbox Key"',
    ipAddress: '203.0.113.42',
    timestamp: new Date('2024-01-05T09:00:00Z'),
    metadata: { keyId: 'key_003', keyName: 'Old Sandbox Key' },
  },
  {
    id: 'evt_008',
    userId: MOCK_USER_KERNEL.id,
    type: 'hwid_reset',
    description: 'HWID reset requested for LAPTOP-SECONDARY',
    ipAddress: '203.0.113.55',
    timestamp: new Date('2024-05-12T14:30:00Z'),
    metadata: { activationId: 'act_k_002', deviceName: 'LAPTOP-SECONDARY' },
  },
];

// ----------------------------------------------------------
// generateApiKey()
// ----------------------------------------------------------

/**
 * Generate a new `APIKey` with `fullKey` populated.
 *
 * **Reveal-once invariant (Requirements 10.2):**
 * The returned object has `fullKey` set so the caller can display
 * it exactly once (e.g. in a copy-and-dismiss modal).
 * Before pushing the key into any persistent list, strip `fullKey`
 * by setting it to `undefined`:
 *
 * ```ts
 * const newKey = generateApiKey('My Key', userId);
 * // Show newKey.fullKey to the user once...
 * const { fullKey: _discard, ...storedKey } = newKey;
 * apiKeys.push(storedKey); // fullKey is undefined in list
 * ```
 */
export function generateApiKey(
  name: string,
  userId: string,
  environment: 'production' | 'sandbox' = 'production'
): APIKey {
  const id = `key_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // Build a 40-character random hex full key
  const rawHex = Array.from({ length: 40 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');

  const prefix = environment === 'production' ? 'sk_live_' : 'sk_test_';
  const fullKey = `${prefix}${rawHex}`;

  // Preview shows first 8 and last 4 chars of the raw portion
  const keyPreview = `${prefix}${rawHex.slice(0, 4)}...${rawHex.slice(-4)}`;

  return {
    id,
    userId,
    name,
    keyPreview,
    fullKey, // populated — caller must strip before list storage
    environment,
    createdAt: new Date(),
    lastUsedAt: null,
    isActive: true,
    webhooks: [],
  };
}

// ----------------------------------------------------------
// Convenience getters
// ----------------------------------------------------------

/**
 * Retrieve the seeded license for a given user ID.
 * Returns `null` for users with no license.
 */
export function getLicenseForUser(userId: string): License | null {
  if (userId === MOCK_USER_KERNEL.id) return MOCK_LICENSE_KERNEL;
  if (userId === MOCK_USER_USERMODE.id) return MOCK_LICENSE_USERMODE;
  return null;
}

/**
 * Retrieve the seeded activity events for a given user ID,
 * sorted descending by timestamp (most recent first).
 */
export function getActivityEventsForUser(userId: string): ActivityEvent[] {
  return MOCK_ACTIVITY_EVENTS.filter((e) => e.userId === userId).sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
}

/**
 * Retrieve the seeded API keys for a given user ID.
 * Does not include the `fullKey` field (as per reveal-once invariant).
 */
export function getApiKeysForUser(userId: string): APIKey[] {
  return MOCK_API_KEYS.filter((k) => k.userId === userId);
}

/**
 * Retrieve the seeded team members for a given license ID.
 */
export function getTeamMembersForLicense(licenseId: string): TeamMember[] {
  return MOCK_TEAM_MEMBERS.filter((m) => m.teamLicenseId === licenseId);
}
