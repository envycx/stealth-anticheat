// Feature: stealth-anticheat-platform, Property 4: License seat accounting invariant

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { licenseReducer } from '@/contexts/LicenseContext';
import type { LicenseState, License, TeamMember, TeamMemberStatus } from '@/types';

/**
 * Validates: Requirements 11.3, 11.4, 11.5
 *
 * Property 4: License seat accounting invariant
 *
 * For any team license state after any sequence of add-member and
 * remove-member operations, the derived `usedSeats` count SHALL equal the
 * number of team members with `status === 'active'`, and `usedSeats` SHALL
 * never exceed the license's total `seats` capacity.
 */

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

/** A base license with enough seats to accommodate test arrays */
const BASE_LICENSE: License = {
  id: 'lic_test_001',
  userId: 'usr_test',
  tier: 'kernel',
  status: 'active',
  licenseKey: 'STLTH-TEST-1234-5678-ABCD',
  purchasedAt: new Date('2024-01-01'),
  expiresAt: null,
  maxActivations: 10,
  activations: [],
  seats: 20,
  usedSeats: 0,
};

/** Build the initial LicenseState from an array of TeamMembers */
function buildInitialState(members: TeamMember[]): LicenseState {
  return {
    license: { ...BASE_LICENSE },
    builds: [],
    activityFeed: [],
    apiKeys: [],
    teamMembers: [],
    isLoading: false,
  };
}

/** Create a minimal TeamMember record */
function makeMember(id: string, status: TeamMemberStatus): TeamMember {
  return {
    id,
    teamLicenseId: BASE_LICENSE.id,
    email: `${id}@example.com`,
    status,
    invitedAt: new Date('2024-01-01'),
    activatedAt: status === 'active' ? new Date('2024-01-02') : null,
    subLicenseKey: `STLTH-${id.toUpperCase()}-KEY`,
  };
}

// fast-check arbitraries
const statusArb = fc.oneof(
  fc.constant('active' as TeamMemberStatus),
  fc.constant('pending' as TeamMemberStatus),
  fc.constant('revoked' as TeamMemberStatus)
);

/** Arbitrary for an array of TeamMember records (0-20 members) */
const teamMembersArb = fc.array(
  fc.record({ status: statusArb }),
  { minLength: 0, maxLength: 20 }
).map((records) =>
  records.map((r, idx) => makeMember(`tm_${idx}`, r.status))
);

// ------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------

describe('Property 4: License seat accounting invariant', () => {
  it('SET_TEAM_MEMBERS: usedSeats equals active member count and never exceeds seats', () => {
    fc.assert(
      fc.property(teamMembersArb, (members) => {
        const initialState = buildInitialState(members);

        const nextState = licenseReducer(initialState, {
          type: 'SET_TEAM_MEMBERS',
          payload: members,
        });

        const expectedUsedSeats = members.filter((m) => m.status === 'active').length;

        // usedSeats must equal the active count
        expect(nextState.license?.usedSeats).toBe(expectedUsedSeats);

        // usedSeats must never exceed seats capacity
        const seats = nextState.license?.seats ?? 0;
        expect(nextState.license?.usedSeats ?? 0).toBeLessThanOrEqual(seats);
      }),
      { numRuns: 100 }
    );
  });

  it('ADD_TEAM_MEMBER: usedSeats is recalculated correctly after adding any member', () => {
    fc.assert(
      fc.property(
        teamMembersArb,
        statusArb,
        (existingMembers, newStatus) => {
          // Build state with existing members first via SET_TEAM_MEMBERS
          const initialState = buildInitialState(existingMembers);
          const stateWithMembers = licenseReducer(initialState, {
            type: 'SET_TEAM_MEMBERS',
            payload: existingMembers,
          });

          const newMember = makeMember(`tm_new_${Date.now()}`, newStatus);

          const nextState = licenseReducer(stateWithMembers, {
            type: 'ADD_TEAM_MEMBER',
            payload: newMember,
          });

          const allMembers = [...existingMembers, newMember];
          const expectedUsedSeats = allMembers.filter((m) => m.status === 'active').length;

          expect(nextState.license?.usedSeats).toBe(expectedUsedSeats);

          const seats = nextState.license?.seats ?? 0;
          expect(nextState.license?.usedSeats ?? 0).toBeLessThanOrEqual(seats);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('REMOVE_TEAM_MEMBER: usedSeats is recalculated correctly after removing a member', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({ status: statusArb }),
          { minLength: 1, maxLength: 20 }
        ).map((records) =>
          records.map((r, idx) => makeMember(`tm_${idx}`, r.status))
        ),
        fc.nat(),
        (members, indexSeed) => {
          // Set up state with the members
          const initialState = buildInitialState(members);
          const stateWithMembers = licenseReducer(initialState, {
            type: 'SET_TEAM_MEMBERS',
            payload: members,
          });

          // Pick a member to remove (modulo to stay in bounds)
          const targetIndex = indexSeed % members.length;
          const targetId = members[targetIndex].id;

          const nextState = licenseReducer(stateWithMembers, {
            type: 'REMOVE_TEAM_MEMBER',
            payload: { memberId: targetId },
          });

          // After REMOVE_TEAM_MEMBER the member's status becomes 'revoked',
          // so we mirror that in the expected calculation
          const membersAfterRemove = members.map((m) =>
            m.id === targetId ? { ...m, status: 'revoked' as TeamMemberStatus } : m
          );
          const expectedUsedSeats = membersAfterRemove.filter(
            (m) => m.status === 'active'
          ).length;

          expect(nextState.license?.usedSeats).toBe(expectedUsedSeats);

          const seats = nextState.license?.seats ?? 0;
          expect(nextState.license?.usedSeats ?? 0).toBeLessThanOrEqual(seats);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('sequential add/remove sequence: invariant holds throughout the entire operation sequence', () => {
    fc.assert(
      fc.property(
        // Start with up to 10 members (so additions stay under 20-seat limit)
        fc.array(
          fc.record({ status: statusArb }),
          { minLength: 0, maxLength: 10 }
        ).map((records) =>
          records.map((r, idx) => makeMember(`tm_${idx}`, r.status))
        ),
        // A sequence of extra members to add (up to 5 more)
        fc.array(statusArb, { minLength: 0, maxLength: 5 }),
        (initialMembers, additionalStatuses) => {
          // Step 1: load initial team
          let state = licenseReducer(buildInitialState(initialMembers), {
            type: 'SET_TEAM_MEMBERS',
            payload: initialMembers,
          });

          // Verify invariant after initial load
          let expected = initialMembers.filter((m) => m.status === 'active').length;
          expect(state.license?.usedSeats).toBe(expected);

          // Step 2: add members one by one and check invariant after each
          const addedMembers: TeamMember[] = [];
          additionalStatuses.forEach((status, i) => {
            const newMember = makeMember(`tm_added_${i}`, status);
            addedMembers.push(newMember);
            state = licenseReducer(state, {
              type: 'ADD_TEAM_MEMBER',
              payload: newMember,
            });

            const allMembers = [...initialMembers, ...addedMembers];
            expected = allMembers.filter((m) => m.status === 'active').length;

            expect(state.license?.usedSeats).toBe(expected);
            expect(state.license?.usedSeats ?? 0).toBeLessThanOrEqual(
              state.license?.seats ?? 0
            );
          });

          // Step 3: remove all added members one by one and check invariant
          let currentMembers = [...initialMembers, ...addedMembers];
          for (const member of addedMembers) {
            state = licenseReducer(state, {
              type: 'REMOVE_TEAM_MEMBER',
              payload: { memberId: member.id },
            });

            currentMembers = currentMembers.map((m) =>
              m.id === member.id ? { ...m, status: 'revoked' as TeamMemberStatus } : m
            );
            expected = currentMembers.filter((m) => m.status === 'active').length;

            expect(state.license?.usedSeats).toBe(expected);
            expect(state.license?.usedSeats ?? 0).toBeLessThanOrEqual(
              state.license?.seats ?? 0
            );
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
