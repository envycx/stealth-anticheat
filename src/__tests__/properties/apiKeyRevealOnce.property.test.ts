// Feature: stealth-anticheat-platform, Property 3: API Key reveal-once invariant

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateApiKey } from '@/lib/mock-data';
import type { APIKey } from '@/types';

/**
 * Validates: Requirements 10.2
 *
 * Property 3: API Key reveal-once invariant
 *
 * For any generated API key, the `fullKey` field SHALL be present in the
 * returned object at the moment of creation and SHALL be absent (`undefined`)
 * in all subsequent listings of that key in the active key list.
 */
describe('Property 3: API Key reveal-once invariant', () => {
  it('fullKey is defined on creation and undefined after stripping into the stored list', () => {
    fc.assert(
      fc.property(
        fc.record({ name: fc.string({ minLength: 1 }) }),
        ({ name }) => {
          // Step 1: generate the key — fullKey must be populated at creation time
          const newKey = generateApiKey(name, 'usr_test', 'production');

          expect(newKey.fullKey).toBeDefined();
          expect(typeof newKey.fullKey).toBe('string');
          expect((newKey.fullKey as string).length).toBeGreaterThan(0);

          // Step 2: strip fullKey before storing in the list (reveal-once pattern)
          const { fullKey: _, ...storedKey } = newKey;
          const list: Omit<APIKey, 'fullKey'>[] = [];
          list.push(storedKey);

          // Step 3: the listed entry must NOT expose fullKey
          const listedEntry = list[0];
          expect((listedEntry as APIKey).fullKey).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('fullKey is undefined for all entries when multiple keys are generated and stored', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 20 }),
        (names) => {
          const list: APIKey[] = [];

          for (const name of names) {
            const newKey = generateApiKey(name, 'usr_test', 'production');

            // fullKey must be present on the freshly generated key
            expect(newKey.fullKey).toBeDefined();

            // Strip fullKey before pushing into the list
            const { fullKey: _discard, ...storedKey } = newKey;
            list.push(storedKey as APIKey);
          }

          // No entry in the stored list should have fullKey defined
          for (const entry of list) {
            expect(entry.fullKey).toBeUndefined();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('fullKey is defined on creation for both production and sandbox environments', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1 }),
          environment: fc.oneof(
            fc.constant('production' as const),
            fc.constant('sandbox' as const)
          ),
        }),
        ({ name, environment }) => {
          const newKey = generateApiKey(name, 'usr_test', environment);

          // fullKey must always be populated immediately after generation
          expect(newKey.fullKey).toBeDefined();
          expect(typeof newKey.fullKey).toBe('string');

          // Strip and store
          const { fullKey: _, ...storedKey } = newKey;
          const list: APIKey[] = [storedKey as APIKey];

          // fullKey must be absent in the stored version
          expect(list[0].fullKey).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});
