'use client';

// ============================================================
// useAuth — convenience re-export of the AuthContext hook
// ============================================================
//
// Import from here rather than directly from AuthContext so
// callers have a stable, short import path:
//
//   import { useAuth } from '@/hooks/useAuth';

export { useAuthContext as useAuth } from '@/contexts/AuthContext';
