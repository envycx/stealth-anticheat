// Feature: stealth-anticheat-platform, Property 6: Activity feed descending timestamp ordering

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { licenseReducer } from '@/contexts/LicenseContext';
import type { LicenseState, ActivityEvent } from '@/types';

/**
 * Validates: Requirements 7.4
 *
 * Property 6: Activity feed descending timestamp ordering
 *
 * For any collection of activity events, after dispatching either
 * SET_ACTIVITY_FEED or ADD_ACTIVITY_EVENT to the licenseReducer, the
 * resulting activityFeed MUST be sorted in descending order by timestamp
 * (most recent first). Existing entries must not be mutated.
 */

// ----------------------------------------------------------
// Helpers
// ----------------------------------------------------------

const baseState: LicenseState = {
  license: null,
  builds: [],
  activityFeed: [],
  apiKeys: [],
  teamMembers: [],
  isLoading: false,
};

/** Generator for a single ActivityEvent with a random timestamp */
const activityEventArb = fc.record({
  timestamp: fc.date(),
}).map(({ timestamp }, idx) => ({
  id: `evt_${idx ?? Math.random()}`,
  userId: 'usr_test',
  type: 'login' as const,
  description: 'test event',
  ipAddress: '127.0.0.1',
  timestamp,
}));

/** Generator for an array of ActivityEvents with unique numeric ids */
const activityEventsArb = fc.array(
  fc.record({ timestamp: fc.date() }),
  { minLength: 0, maxLength: 50 }
).map((entries) =>
  entries.map((entry, i) => ({
    id: `evt_${i}`,
    userId: 'usr_test',
    type: 'login' as const,
    description: 'test event',
    ipAddress: '127.0.0.1',
    timestamp: entry.timestamp,
  }))
);

/** Checks that `feed` is sorted descending by timestamp */
function isSortedDescending(feed: ActivityEvent[]): boolean {
  for (let i = 0; i < feed.length - 1; i++) {
    if (feed[i].timestamp.getTime() < feed[i + 1].timestamp.getTime()) {
      return false;
    }
  }
  return true;
}

// ----------------------------------------------------------
// Tests
// ----------------------------------------------------------

describe('Property 6: Activity feed descending timestamp ordering', () => {
  it('SET_ACTIVITY_FEED: resulting feed is sorted descending by timestamp', () => {
    fc.assert(
      fc.property(activityEventsArb, (events) => {
        const nextState = licenseReducer(baseState, {
          type: 'SET_ACTIVITY_FEED',
          payload: events,
        });

        expect(isSortedDescending(nextState.activityFeed)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('SET_ACTIVITY_FEED: existing entries are not mutated (same references preserved)', () => {
    fc.assert(
      fc.property(activityEventsArb, (events) => {
        const nextState = licenseReducer(baseState, {
          type: 'SET_ACTIVITY_FEED',
          payload: events,
        });

        // Every event in the output must correspond to an event from the input
        // (same id, same timestamp value — no mutation of event objects)
        const inputById = new Map(events.map((e) => [e.id, e]));

        for (const outputEvent of nextState.activityFeed) {
          const inputEvent = inputById.get(outputEvent.id);
          expect(inputEvent).toBeDefined();
          expect(outputEvent.timestamp.getTime()).toBe(
            inputEvent!.timestamp.getTime()
          );
          expect(outputEvent.description).toBe(inputEvent!.description);
        }

        // Output must contain the same number of events as the input
        expect(nextState.activityFeed.length).toBe(events.length);
      }),
      { numRuns: 100 }
    );
  });

  it('ADD_ACTIVITY_EVENT: resulting feed is sorted descending by timestamp after each addition', () => {
    fc.assert(
      fc.property(
        activityEventsArb,
        fc.record({ timestamp: fc.date() }),
        (existingEvents, newEventRecord) => {
          // Seed state with an already-processed feed
          const seededState = licenseReducer(baseState, {
            type: 'SET_ACTIVITY_FEED',
            payload: existingEvents,
          });

          const newEvent: ActivityEvent = {
            id: 'evt_new',
            userId: 'usr_test',
            type: 'login',
            description: 'new test event',
            ipAddress: '127.0.0.1',
            timestamp: newEventRecord.timestamp,
          };

          const nextState = licenseReducer(seededState, {
            type: 'ADD_ACTIVITY_EVENT',
            payload: newEvent,
          });

          expect(isSortedDescending(nextState.activityFeed)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('ADD_ACTIVITY_EVENT: new event appears in feed and existing entries are unmutated', () => {
    fc.assert(
      fc.property(
        activityEventsArb,
        fc.record({ timestamp: fc.date() }),
        (existingEvents, newEventRecord) => {
          const seededState = licenseReducer(baseState, {
            type: 'SET_ACTIVITY_FEED',
            payload: existingEvents,
          });

          const newEvent: ActivityEvent = {
            id: 'evt_new',
            userId: 'usr_test',
            type: 'download',
            description: 'new download event',
            ipAddress: '10.0.0.1',
            timestamp: newEventRecord.timestamp,
          };

          const nextState = licenseReducer(seededState, {
            type: 'ADD_ACTIVITY_EVENT',
            payload: newEvent,
          });

          // Feed grows by exactly one
          expect(nextState.activityFeed.length).toBe(
            seededState.activityFeed.length + 1
          );

          // The new event is present in the output
          const found = nextState.activityFeed.find((e) => e.id === 'evt_new');
          expect(found).toBeDefined();
          expect(found!.timestamp.getTime()).toBe(
            newEvent.timestamp.getTime()
          );

          // All previously existing events are still present and unmutated
          const inputById = new Map(
            seededState.activityFeed.map((e) => [e.id, e])
          );
          for (const outputEvent of nextState.activityFeed) {
            if (outputEvent.id === 'evt_new') continue;
            const original = inputById.get(outputEvent.id);
            expect(original).toBeDefined();
            expect(outputEvent.timestamp.getTime()).toBe(
              original!.timestamp.getTime()
            );
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
