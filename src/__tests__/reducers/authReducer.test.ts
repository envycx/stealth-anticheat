import { describe, it, expect } from 'vitest';
import { authReducer } from '@/contexts/AuthContext';
import type { AuthState, User } from '@/types';

// ----------------------------------------------------------
// Fixtures
// ----------------------------------------------------------

const mockUser: User = {
  id: 'usr_test_001',
  username: 'testuser',
  email: 'test@example.com',
  avatarUrl: undefined,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  twoFactorEnabled: false,
  role: 'user',
};

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  pendingTwoFactor: false,
};

const loadingState: AuthState = {
  ...initialState,
  isLoading: true,
};

const pendingTwoFactorState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  pendingTwoFactor: true,
};

const authenticatedState: AuthState = {
  user: mockUser,
  isLoading: false,
  isAuthenticated: true,
  pendingTwoFactor: false,
};

// ----------------------------------------------------------
// Tests
// ----------------------------------------------------------

describe('authReducer', () => {
  // Requirements 5.3, 6.5

  describe('LOGIN_SUCCESS', () => {
    it('sets user, marks authenticated, clears loading and pendingTwoFactor', () => {
      const result = authReducer(loadingState, {
        type: 'LOGIN_SUCCESS',
        payload: mockUser,
      });

      expect(result).toEqual({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        pendingTwoFactor: false,
      });
    });

    it('clears pendingTwoFactor when already in pending 2FA state', () => {
      const result = authReducer(pendingTwoFactorState, {
        type: 'LOGIN_SUCCESS',
        payload: mockUser,
      });

      expect(result.pendingTwoFactor).toBe(false);
      expect(result.isAuthenticated).toBe(true);
      expect(result.user).toEqual(mockUser);
    });
  });

  describe('LOGIN_PENDING_2FA', () => {
    it('clears user, sets pendingTwoFactor, clears loading and isAuthenticated', () => {
      const result = authReducer(loadingState, { type: 'LOGIN_PENDING_2FA' });

      expect(result).toEqual({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        pendingTwoFactor: true,
      });
    });

    it('clears user even when previously authenticated', () => {
      const result = authReducer(authenticatedState, { type: 'LOGIN_PENDING_2FA' });

      expect(result.user).toBeNull();
      expect(result.isAuthenticated).toBe(false);
      expect(result.pendingTwoFactor).toBe(true);
    });
  });

  describe('TWO_FACTOR_SUCCESS', () => {
    it('sets user, marks authenticated, clears loading and pendingTwoFactor', () => {
      const result = authReducer(pendingTwoFactorState, {
        type: 'TWO_FACTOR_SUCCESS',
        payload: mockUser,
      });

      expect(result).toEqual({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        pendingTwoFactor: false,
      });
    });

    it('transitions cleanly from pending 2FA loading state', () => {
      const fromLoadingPending: AuthState = {
        ...pendingTwoFactorState,
        isLoading: true,
      };

      const result = authReducer(fromLoadingPending, {
        type: 'TWO_FACTOR_SUCCESS',
        payload: mockUser,
      });

      expect(result.isLoading).toBe(false);
      expect(result.pendingTwoFactor).toBe(false);
      expect(result.isAuthenticated).toBe(true);
      expect(result.user).toEqual(mockUser);
    });
  });

  describe('LOGOUT', () => {
    it('resets to initial state from authenticated state', () => {
      const result = authReducer(authenticatedState, { type: 'LOGOUT' });

      expect(result).toEqual(initialState);
    });

    it('resets to initial state from pendingTwoFactor state', () => {
      const result = authReducer(pendingTwoFactorState, { type: 'LOGOUT' });

      expect(result).toEqual(initialState);
    });

    it('resets to initial state from loading state', () => {
      const result = authReducer(loadingState, { type: 'LOGOUT' });

      expect(result).toEqual(initialState);
    });

    it('is idempotent — logging out from initial state returns initial state', () => {
      const result = authReducer(initialState, { type: 'LOGOUT' });

      expect(result).toEqual(initialState);
    });
  });

  describe('REGISTER_SUCCESS', () => {
    it('sets user, marks authenticated, clears loading and pendingTwoFactor', () => {
      const result = authReducer(loadingState, {
        type: 'REGISTER_SUCCESS',
        payload: mockUser,
      });

      expect(result).toEqual({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        pendingTwoFactor: false,
      });
    });

    it('works from initial state', () => {
      const result = authReducer(initialState, {
        type: 'REGISTER_SUCCESS',
        payload: mockUser,
      });

      expect(result.user).toEqual(mockUser);
      expect(result.isAuthenticated).toBe(true);
      expect(result.isLoading).toBe(false);
    });
  });

  describe('SET_LOADING', () => {
    it('sets isLoading to true without touching other fields', () => {
      const result = authReducer(initialState, {
        type: 'SET_LOADING',
        payload: true,
      });

      expect(result).toEqual({ ...initialState, isLoading: true });
    });

    it('sets isLoading to false without touching other fields', () => {
      const result = authReducer(authenticatedState, {
        type: 'SET_LOADING',
        payload: false,
      });

      expect(result).toEqual({ ...authenticatedState, isLoading: false });
    });

    it('does not mutate user or auth fields when toggling loading', () => {
      const withLoading = authReducer(authenticatedState, {
        type: 'SET_LOADING',
        payload: true,
      });

      expect(withLoading.user).toEqual(mockUser);
      expect(withLoading.isAuthenticated).toBe(true);
      expect(withLoading.pendingTwoFactor).toBe(false);
    });
  });

  describe('unknown action', () => {
    it('returns state unchanged for an unrecognised action type', () => {
      // @ts-expect-error — intentionally passing an unknown action
      const result = authReducer(authenticatedState, { type: 'UNKNOWN_ACTION' });

      expect(result).toBe(authenticatedState);
    });
  });
});
