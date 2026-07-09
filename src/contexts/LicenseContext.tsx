'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type {
  LicenseState,
  License,
  Build,
  ActivityEvent,
  APIKey,
  TeamMember,
  APIKeyEnvironment,
} from '@/types';
import {
  getLicenseForUser,
  getActivityEventsForUser,
  getApiKeysForUser,
  getTeamMembersForLicense,
  generateApiKey,
  MOCK_BUILDS,
  mockAsync,
} from '@/lib/mock-data';

// ----------------------------------------------------------
// Action types
// ----------------------------------------------------------

export type LicenseAction =
  | { type: 'SET_LICENSE'; payload: License | null }
  | { type: 'SET_BUILDS'; payload: Build[] }
  | { type: 'SET_ACTIVITY_FEED'; payload: ActivityEvent[] }
  | { type: 'SET_API_KEYS'; payload: APIKey[] }
  | { type: 'SET_TEAM_MEMBERS'; payload: TeamMember[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'DEACTIVATE_DEVICE'; payload: { activationId: string } }
  | { type: 'REVOKE_API_KEY'; payload: { keyId: string } }
  | { type: 'ADD_API_KEY'; payload: APIKey }
  | { type: 'ADD_TEAM_MEMBER'; payload: TeamMember }
  | { type: 'REMOVE_TEAM_MEMBER'; payload: { memberId: string } }
  | { type: 'ADD_ACTIVITY_EVENT'; payload: ActivityEvent };

// ----------------------------------------------------------
// Initial state
// ----------------------------------------------------------

const initialState: LicenseState = {
  license: null,
  builds: [],
  activityFeed: [],
  apiKeys: [],
  teamMembers: [],
  isLoading: false,
};

// ----------------------------------------------------------
// Helpers
// ----------------------------------------------------------

/** Sort an activity feed array descending by timestamp (most recent first). */
function sortFeedDescending(feed: ActivityEvent[]): ActivityEvent[] {
  return [...feed].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Derive `usedSeats` from the current team members list.
 * usedSeats = count of members whose status is 'active'.
 */
function deriveUsedSeats(
  license: License | null,
  teamMembers: TeamMember[]
): License | null {
  if (!license) return null;
  const usedSeats = teamMembers.filter((m) => m.status === 'active').length;
  return { ...license, usedSeats };
}

// ----------------------------------------------------------
// Reducer
// ----------------------------------------------------------

export function licenseReducer(
  state: LicenseState,
  action: LicenseAction
): LicenseState {
  switch (action.type) {
    case 'SET_LICENSE':
      return { ...state, license: action.payload };

    case 'SET_BUILDS':
      return { ...state, builds: action.payload };

    case 'SET_ACTIVITY_FEED':
      return { ...state, activityFeed: sortFeedDescending(action.payload) };

    case 'SET_API_KEYS':
      return { ...state, apiKeys: action.payload };

    case 'SET_TEAM_MEMBERS': {
      const teamMembers = action.payload;
      const license = deriveUsedSeats(state.license, teamMembers);
      return { ...state, teamMembers, license };
    }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'DEACTIVATE_DEVICE': {
      if (!state.license) return state;
      const updatedActivations = state.license.activations.map((a) =>
        a.id === action.payload.activationId ? { ...a, isActive: false } : a
      );
      return {
        ...state,
        license: { ...state.license, activations: updatedActivations },
      };
    }

    case 'REVOKE_API_KEY': {
      const apiKeys = state.apiKeys.map((k) =>
        k.id === action.payload.keyId ? { ...k, isActive: false } : k
      );
      return { ...state, apiKeys };
    }

    case 'ADD_API_KEY': {
      // Strip fullKey before storing in the list (reveal-once invariant)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { fullKey: _discard, ...storedKey } = action.payload;
      return { ...state, apiKeys: [...state.apiKeys, storedKey] };
    }

    case 'ADD_TEAM_MEMBER': {
      const teamMembers = [...state.teamMembers, action.payload];
      const license = deriveUsedSeats(state.license, teamMembers);
      return { ...state, teamMembers, license };
    }

    case 'REMOVE_TEAM_MEMBER': {
      const teamMembers = state.teamMembers.map((m) =>
        m.id === action.payload.memberId ? { ...m, status: 'revoked' as const } : m
      );
      const license = deriveUsedSeats(state.license, teamMembers);
      return { ...state, teamMembers, license };
    }

    case 'ADD_ACTIVITY_EVENT': {
      const feed = sortFeedDescending([...state.activityFeed, action.payload]);
      return { ...state, activityFeed: feed };
    }

    default:
      return state;
  }
}

// ----------------------------------------------------------
// Context value shape
// ----------------------------------------------------------

interface LicenseContextValue extends LicenseState {
  dispatch: React.Dispatch<LicenseAction>;
  /** Load all license data for the given user from mock data. */
  loadLicenseData: (userId: string) => Promise<void>;
  /** Deactivate a specific device activation by its ID. */
  deactivateDevice: (activationId: string) => Promise<void>;
  /**
   * Generate a new API key with fullKey populated (reveal-once).
   * Returns the full key string so the caller can display it once.
   */
  generateNewApiKey: (
    name: string,
    environment: APIKeyEnvironment,
    userId: string
  ) => Promise<string>;
  /** Revoke an API key by its ID. */
  revokeApiKey: (keyId: string) => Promise<void>;
  /**
   * Invite a new team member by email.
   * Creates a pending TeamMember and dispatches ADD_TEAM_MEMBER.
   */
  addTeamMember: (email: string) => Promise<void>;
  /** Remove (revoke) a team member by ID. */
  removeTeamMember: (memberId: string) => Promise<void>;
  /** Add an event to the activity feed and re-sort descending. */
  addActivityEvent: (event: ActivityEvent) => void;
}

// ----------------------------------------------------------
// Context
// ----------------------------------------------------------

const LicenseContext = createContext<LicenseContextValue | undefined>(undefined);

// ----------------------------------------------------------
// Provider
// ----------------------------------------------------------

interface LicenseProviderProps {
  children: ReactNode;
}

export function LicenseProvider({ children }: LicenseProviderProps) {
  const [state, dispatch] = useReducer(licenseReducer, initialState);

  // Keep a stable ref to state for use inside callbacks without stale closure
  const stateRef = React.useRef(state);
  stateRef.current = state;

  // --------------------------------------------------------
  // loadLicenseData
  // --------------------------------------------------------
  const loadLicenseData = useCallback(async (userId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const license = await mockAsync(getLicenseForUser(userId));
      const builds = await mockAsync(MOCK_BUILDS);
      const apiKeys = await mockAsync(getApiKeysForUser(userId));
      const activityFeed = await mockAsync(getActivityEventsForUser(userId));
      const teamMembers = license
        ? await mockAsync(getTeamMembersForLicense(license.id))
        : [];

      dispatch({ type: 'SET_LICENSE', payload: license });
      dispatch({ type: 'SET_BUILDS', payload: builds });
      dispatch({ type: 'SET_API_KEYS', payload: apiKeys });
      dispatch({ type: 'SET_ACTIVITY_FEED', payload: activityFeed });
      // Dispatch team members last so usedSeats can be derived correctly
      dispatch({ type: 'SET_TEAM_MEMBERS', payload: teamMembers });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // --------------------------------------------------------
  // deactivateDevice
  // --------------------------------------------------------
  const deactivateDevice = useCallback(async (activationId: string) => {
    await mockAsync(null);
    dispatch({ type: 'DEACTIVATE_DEVICE', payload: { activationId } });
  }, []);

  // --------------------------------------------------------
  // generateNewApiKey
  // --------------------------------------------------------
  const generateNewApiKey = useCallback(
    async (name: string, environment: APIKeyEnvironment, userId: string) => {
      const newKey = await mockAsync(generateApiKey(name, userId, environment));
      // Dispatch to store — ADD_API_KEY strips fullKey before pushing into list
      dispatch({ type: 'ADD_API_KEY', payload: newKey });
      // Return the full key so the caller can display it once
      return newKey.fullKey as string;
    },
    []
  );

  // --------------------------------------------------------
  // revokeApiKey
  // --------------------------------------------------------
  const revokeApiKey = useCallback(async (keyId: string) => {
    await mockAsync(null);
    dispatch({ type: 'REVOKE_API_KEY', payload: { keyId } });
  }, []);

  // --------------------------------------------------------
  // addTeamMember
  // --------------------------------------------------------
  const addTeamMember = useCallback(async (email: string) => {
    const currentLicense = stateRef.current.license;
    const licenseId = currentLicense?.id ?? '';

    const newMember: TeamMember = {
      id: `tm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      teamLicenseId: licenseId,
      email,
      username: undefined,
      status: 'pending',
      invitedAt: new Date(),
      activatedAt: null,
      subLicenseKey: `STLTH-INV-${Math.random().toString(36).toUpperCase().slice(2, 6)}-PEND`,
      hwid: undefined,
    };

    await mockAsync(null);
    dispatch({ type: 'ADD_TEAM_MEMBER', payload: newMember });
  }, []);

  // --------------------------------------------------------
  // removeTeamMember
  // --------------------------------------------------------
  const removeTeamMember = useCallback(async (memberId: string) => {
    await mockAsync(null);
    dispatch({ type: 'REMOVE_TEAM_MEMBER', payload: { memberId } });
  }, []);

  // --------------------------------------------------------
  // addActivityEvent
  // --------------------------------------------------------
  const addActivityEvent = useCallback((event: ActivityEvent) => {
    dispatch({ type: 'ADD_ACTIVITY_EVENT', payload: event });
  }, []);

  // --------------------------------------------------------
  // Context value
  // --------------------------------------------------------
  const value: LicenseContextValue = {
    ...state,
    dispatch,
    loadLicenseData,
    deactivateDevice,
    generateNewApiKey,
    revokeApiKey,
    addTeamMember,
    removeTeamMember,
    addActivityEvent,
  };

  return (
    <LicenseContext.Provider value={value}>{children}</LicenseContext.Provider>
  );
}

// ----------------------------------------------------------
// Internal hook (exported for useLicense.ts re-export)
// ----------------------------------------------------------

export function useLicenseContext(): LicenseContextValue {
  const context = useContext(LicenseContext);
  if (!context) {
    throw new Error('useLicenseContext must be used within a LicenseProvider');
  }
  return context;
}

export { LicenseContext };
