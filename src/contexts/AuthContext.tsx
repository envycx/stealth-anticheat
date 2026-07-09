'use client';

// ============================================================
// Stealth Anti-Cheat Platform — Auth Context
// ============================================================
//
// Provides authentication state and actions to the entire app.
// All auth operations are mocked against MOCK_USERS.
//
// TODO: Replace mock operations with real backend API calls
// (JWT-based auth, TOTP/2FA provider, session management).

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';

import type { AuthState, AuthAction, User } from '@/types';
import { MOCK_USERS, mockAsync } from '@/lib/mock-data';

// ----------------------------------------------------------
// Reducer
// ----------------------------------------------------------

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  pendingTwoFactor: false,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        pendingTwoFactor: false,
      };

    case 'LOGIN_PENDING_2FA':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        pendingTwoFactor: true,
      };

    case 'TWO_FACTOR_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        pendingTwoFactor: false,
      };

    case 'LOGOUT':
      return {
        ...initialState,
      };

    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        pendingTwoFactor: false,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

// ----------------------------------------------------------
// Context shape
// ----------------------------------------------------------

interface AuthContextValue extends AuthState {
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
  verifyTwoFactor: (code: string) => Promise<void>;
}

// ----------------------------------------------------------
// Context creation
// ----------------------------------------------------------

const AuthContext = createContext<AuthContextValue | null>(null);

// ----------------------------------------------------------
// Temporary storage for the user pending 2FA verification.
// In a real app this would live server-side in the session.
// ----------------------------------------------------------

let _pendingUser: User | null = null;

// ----------------------------------------------------------
// Provider
// ----------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Attempt to log in with email and password.
   *
   * - Checks credentials against MOCK_USERS (any password accepted).
   * - If the user has 2FA enabled, dispatches LOGIN_PENDING_2FA and
   *   stores the user for the verifyTwoFactor step.
   * - Otherwise dispatches LOGIN_SUCCESS.
   *
   * Throws a generic error on failure to avoid credential enumeration
   * (Requirement 5.4 / Property 12).
   */
  const login = useCallback(async (email: string, _password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simulate network latency; surfaced value is the matched user or null.
      const matched = await mockAsync(
        MOCK_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        ) ?? null
      );

      if (!matched) {
        // Generic error — do not reveal whether email or password was wrong.
        throw new Error('Invalid email or password');
      }

      if (matched.twoFactorEnabled) {
        _pendingUser = matched;
        dispatch({ type: 'LOGIN_PENDING_2FA' });
      } else {
        _pendingUser = null;
        dispatch({ type: 'LOGIN_SUCCESS', payload: matched });
      }
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw err;
    }
  }, []);

  /**
   * Log out the current user and clear all auth state.
   */
  const logout = useCallback(() => {
    _pendingUser = null;
    dispatch({ type: 'LOGOUT' });
  }, []);

  /**
   * Register a new user.
   *
   * Mock implementation: checks that the email is not already taken
   * by an existing MOCK_USER, then creates an in-memory user object
   * and dispatches REGISTER_SUCCESS.
   *
   * TODO: Replace with real backend registration and email verification.
   */
  const register = useCallback(
    async (username: string, email: string, _password: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const existing = await mockAsync(
          MOCK_USERS.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
          ) ?? null
        );

        if (existing) {
          throw new Error('An account with this email already exists');
        }

        const newUser: User = {
          id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          username,
          email,
          avatarUrl: undefined,
          createdAt: new Date(),
          twoFactorEnabled: false,
          role: 'user',
        };

        dispatch({ type: 'REGISTER_SUCCESS', payload: newUser });
      } catch (err) {
        dispatch({ type: 'SET_LOADING', payload: false });
        throw err;
      }
    },
    []
  );

  /**
   * Complete the 2FA verification step.
   *
   * Mock implementation: any 6-digit numeric code is accepted.
   * In production this would validate a TOTP token server-side.
   *
   * TODO: Replace with real TOTP validation via backend.
   */
  const verifyTwoFactor = useCallback(async (code: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simulate network round-trip
      await mockAsync(null);

      // Mock validation: accept any 6-digit code.
      if (!/^\d{6}$/.test(code)) {
        throw new Error('Invalid verification code. Please try again.');
      }

      if (!_pendingUser) {
        throw new Error('No pending 2FA session. Please log in again.');
      }

      const user = _pendingUser;
      _pendingUser = null;
      dispatch({ type: 'TWO_FACTOR_SUCCESS', payload: user });
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw err;
    }
  }, []);

  const value: AuthContextValue = {
    ...state,
    dispatch,
    login,
    logout,
    register,
    verifyTwoFactor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ----------------------------------------------------------
// Internal hook (used by useAuth re-export)
// ----------------------------------------------------------

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}

export { AuthContext };
