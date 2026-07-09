# Implementation Plan: Stealth Anti-Cheat Platform

## Overview

Implement the Stealth anti-cheat marketing and dashboard platform as a Next.js 14 (App Router) application with TypeScript, Tailwind CSS, Framer Motion, React Hook Form + Zod, Sonner, and Lucide React. The implementation is frontend-only with mock auth/license state. Tasks are ordered to build the foundation first, then public pages, then auth, then the full dashboard.

## Tasks

- [x] 1. Project foundation and shared types
  - [x] 1.1 Scaffold Next.js 14 App Router project with TypeScript, Tailwind CSS, and all required dependencies (framer-motion, lucide-react, react-hook-form, zod, sonner, fast-check, vitest, @testing-library/react, playwright)
    - Configure `tailwind.config.ts` with the `#0a0a0f` background, cyan/violet accent colors, and monospace font
    - Add global CSS variables and base styles
    - _Requirements: 20.1, 20.2_
  - [x] 1.2 Define all shared TypeScript interfaces in `src/types/index.ts`
    - `User`, `License`, `Activation`, `Build`, `APIKey`, `WebhookConfig`, `TeamMember`, `ActivityEvent`, `AuthState`, `LicenseState` and all related union types
    - _Requirements: 20.1_
  - [x] 1.3 Implement `src/lib/utils.ts` with helper functions: `cn()`, `formatDate()`, `truncate()`, `maskHwid()`, `formatLicenseKey()`
    - _Requirements: 20.1_
  - [x] 1.4 Implement Zod validation schemas in `src/lib/validators.ts`
    - Schemas for registration, login, password change, email change, API key creation, team invite, report forms
    - Enforce: email format, password strength (min 8 chars, uppercase, number), required string trim, username rules
    - _Requirements: 4.4, 19.1, 19.5_
  - [x] 1.5 Write unit tests for `utils.ts` and `validators.ts`
    - Test each validator with valid and boundary-invalid examples
    - _Requirements: 19.5_

- [x] 2. Mock data and application contexts
  - [x] 2.1 Implement `src/lib/mock-data.ts` with seeded mock instances for all types
    - Seed one active kernel-license user, one usermode-license user, one user with no license
    - Seed builds, API keys, team members, activity events
    - Add `shouldSimulateError` flag for development error-state testing
    - Add `generateApiKey()` function — returns object with `fullKey` populated; stripping `fullKey` before list storage implements the reveal-once invariant
    - _Requirements: 20.3, 20.4_
  - [x] 2.2 Write property test for API Key reveal-once invariant (Property 3)
    - **Property 3: API Key reveal-once invariant**
    - **Validates: Requirements 10.2**
    - Generator: `fc.record({ name: fc.string({ minLength: 1 }) })` → call `generateApiKey(name)`; add to list; assert `fullKey` defined on creation, `undefined` in listing
  - [x] 2.3 Implement `AuthContext` and `authReducer` in `src/contexts/AuthContext.tsx`
    - Handle actions: `LOGIN_SUCCESS`, `LOGIN_PENDING_2FA`, `TWO_FACTOR_SUCCESS`, `LOGOUT`, `REGISTER_SUCCESS`, `SET_LOADING`
    - Expose `useAuth` hook from `src/hooks/useAuth.ts`
    - _Requirements: 5.3, 6.5, 20.3_
  - [x] 2.4 Write unit tests for `authReducer`
    - Cover all state transitions with example-based tests
    - _Requirements: 5.3, 6.5_
  - [x] 2.5 Implement `LicenseContext` and `licenseReducer` in `src/contexts/LicenseContext.tsx`
    - Manage `license`, `builds`, `activityFeed`, `apiKeys`, `teamMembers`, `isLoading`
    - Activity feed reducer must insert new events and re-sort by `timestamp` descending
    - Seat accounting: `usedSeats` derived as `teamMembers.filter(m => m.status === 'active').length`
    - Expose `useLicense` hook from `src/hooks/useLicense.ts`
    - _Requirements: 7.4, 11.3, 11.4, 11.5, 20.3_
  - [x] 2.6 Write property test for activity feed descending timestamp ordering (Property 6)
    - **Property 6: Activity feed descending timestamp ordering**
    - **Validates: Requirements 7.4**
    - Generator: `fc.array(fc.record({ timestamp: fc.date() }), { minLength: 0, maxLength: 50 })`; assert sorted descending and existing entries unmutated
  - [x] 2.7 Write property test for license seat accounting invariant (Property 4)
    - **Property 4: License seat accounting invariant**
    - **Validates: Requirements 11.3, 11.4, 11.5**
    - Generator: `fc.array` of team member records with random statuses; assert `usedSeats === active count` and `usedSeats <= seats`

- [ ] 3. Primitive UI component library
  - [x] 3.1 Implement `src/components/ui/` primitive components: `Button`, `Card`, `Badge`, `Input`, `Modal`, `Accordion`, `Tooltip`, `CopyButton`
    - `Card`: glassmorphism styles (`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl`), `variant` and `glow` props
    - `Button`: gradient primary, glow hover effect, loading spinner state, all variants
    - `Input`: dark-themed with focus glow ring in cyan, field-error display slot
    - `CopyButton`: clipboard copy with visual feedback using `useClipboard` hook
    - Implement `src/hooks/useClipboard.ts`
    - _Requirements: 2.2, 2.7, 19.1, 20.1, 20.2_
  - [-] 3.2 Implement visual effect components in `src/components/effects/`
    - `GridBackground`: animated circuit/grid SVG or CSS background pattern
    - `GlowBorder`: CSS glow wrapper using box-shadow with cyan/violet
    - `ScrollReveal`: Framer Motion `useInView` wrapper, `direction` and `delay` props, `opacity 0→1` + `y 20→0`
    - `CounterAnimation`: count-up animation driven by `useCountUp` hook
    - Implement `src/hooks/useCountUp.ts` — starts at 0, increments to target value
    - _Requirements: 2.6, 3.1, 3.2, 3.3, 3.4_
  - [~] 3.3 Write property test for counter animation convergence (Property 2)
    - **Property 2: Counter animation converges to target value**
    - **Validates: Requirements 3.3**
    - Generator: `fc.integer({ min: 1, max: 10_000_000 })`; assert `useCountUp(target)` starts at 0 and final value equals target
  - [-] 3.4 Implement layout components: `Navbar`, `Footer`, `DashboardShell`, `Sidebar`, `MobileNav`
    - `Navbar`: public site nav with logo, links, login/register CTAs, sticky with backdrop blur
    - `Footer`: links to docs, support, Discord, changelog; _Requirements: 1.9_
    - `Sidebar`: navigation items with icons, active state, badge support, `requiresLicense` dimming
    - `DashboardShell`: wraps sidebar + main content area
    - `MobileNav`: hamburger menu for mobile viewports
    - _Requirements: 7.5, 2.9_

- [~] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Landing page and marketing sections
  - [~] 5.1 Implement `HeroSection` with headline, subheadline, primary CTA, animated shield graphic, and `StatsCounter` live statistics
    - Wire `CounterAnimation` / `StatsCounter` for animated counter values
    - _Requirements: 1.1, 3.3_
  - [~] 5.2 Implement `FeatureGrid`, `HowItWorks`, `ComparisonTable`, `Testimonials`, and `FaqAccordion` marketing components
    - `FeatureGrid`: kernel-mode, usermode, low FP, real-time detection, SDK features with icons
    - `HowItWorks`: step diagram of detection flow
    - `ComparisonTable`: Usermode vs Kernel tier differences
    - `Testimonials`: placeholder content and logos
    - `FaqAccordion`: common Q&A using `Accordion` primitive
    - Wrap all sections in `ScrollReveal` for fade-in/slide-up on scroll
    - _Requirements: 1.2, 1.3, 1.4, 1.7, 1.8, 3.1_
  - [~] 5.3 Implement `PricingCards` and `TrustSection` marketing components
    - `PricingCards`: Usermode and Kernel pricing cards with tier features, one-time-payment label, add-on options, "Buy Now" → `/checkout`
    - `TrustSection`: links to `/status`, `/builds`, `/bug-bounty`
    - _Requirements: 1.5, 1.6, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_
  - [~] 5.4 Assemble the landing page at `app/page.tsx` and pricing page at `app/pricing/page.tsx`
    - Compose all marketing sections with `GridBackground`, `Navbar`, `Footer`
    - _Requirements: 1.1–1.9, 2.1–2.9_

- [ ] 6. Authentication pages and forms
  - [~] 6.1 Implement `RegisterForm` component with React Hook Form + Zod
    - Fields: username, email, password, password confirmation, terms checkbox
    - Field-level error display below each input; form-level error banner for conflicts
    - On valid submit: call mock `register()` → redirect to `/dashboard`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 19.1, 19.4_
  - [~] 6.2 Write property test for form validation whitespace rejection (Property 1)
    - **Property 1: Form validation rejects whitespace-only required fields and isolates errors to invalid fields**
    - **Validates: Requirements 4.4, 19.1, 19.5**
    - Generator: `fc.record` with subset of fields as whitespace-only strings, others as valid values; assert errors only on whitespace fields
  - [~] 6.3 Implement `LoginForm` component with React Hook Form + Zod
    - Fields: email/username, password; "Forgot password" link; OAuth placeholder buttons
    - On valid creds: `LOGIN_SUCCESS` → `/dashboard`; if 2FA enabled: `LOGIN_PENDING_2FA` → 2FA prompt
    - Invalid creds: generic error "Invalid email or password" — no enumeration
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [~] 6.4 Write property test for login error non-enumeration (Property 12)
    - **Property 12: Login error message does not reveal which credential was wrong**
    - **Validates: Requirements 5.4**
    - Generator: `fc.record({ email: fc.emailAddress(), password: fc.string({ minLength: 1 }) })` filtered to non-matching credentials; assert all error messages are the same generic string
  - [~] 6.5 Implement `TwoFactorSetup` and `TwoFactorPrompt` auth components
    - `TwoFactorSetup`: QR code placeholder, TOTP enrollment flow, verification code input
    - `TwoFactorPrompt`: 6-digit code input, verify action, wrong-code error
    - Wire into auth flow: setup prompt after registration; prompt after password on login
    - _Requirements: 6.1, 6.2, 6.3, 6.5_
  - [~] 6.6 Implement auth pages: `app/auth/login/page.tsx`, `app/auth/register/page.tsx`, `app/auth/forgot-password/page.tsx`, `app/auth/2fa-setup/page.tsx`
    - Wire forms into pages with `GridBackground`, shared layout
    - Forgot password page: email input, mock success message
    - _Requirements: 5.5, 4.3_

- [ ] 7. Dashboard shell and overview
  - [~] 7.1 Implement `AuthGuard` client component and `app/dashboard/layout.tsx`
    - Read `AuthContext.user`; if null redirect to `/auth/login?redirect=...`; else render `DashboardShell` with `Sidebar`
    - _Requirements: 20.3_
  - [~] 7.2 Implement `LicenseStatusCard` and `ActivityFeed` dashboard components
    - `LicenseStatusCard`: tier badge, status, expiration, license key with `CopyButton`
    - `ActivityFeed`: list of `ActivityEvent` items with icon, description, IP, timestamp; empty state with shield icon
    - _Requirements: 7.1, 7.4, 9.1, 9.2_
  - [~] 7.3 Assemble `app/dashboard/page.tsx` overview
    - Compose `LicenseStatusCard`, active version badge, quick download buttons, `ActivityFeed`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 8. Downloads page with gated access
  - [~] 8.1 Implement `BuildCard` and `DownloadButton` dashboard components
    - `BuildCard`: version, changelog summary, SHA-256 checksum in monospace, signed-installer badge, download buttons
    - `DownloadButton`: triggers mock file download; disabled/hidden based on license gate
    - _Requirements: 8.5_
  - [~] 8.2 Write property test for build card metadata completeness (Property 11)
    - **Property 11: Build card renders all required metadata fields**
    - **Validates: Requirements 8.5**
    - Generator: `fc.record({ version: fc.string(), sha256: fc.hexaString({ minLength: 64, maxLength: 64 }), changelogSummary: fc.string(), isSigned: fc.boolean() })`; assert all fields present in rendered output
  - [~] 8.3 Implement downloads gating logic and assemble `app/dashboard/downloads/page.tsx`
    - OS detection to highlight appropriate download
    - Show EXE buttons for usermode and kernel licensed users
    - Show source code options only when `tier === 'kernel' && twoFactorEnabled === true`; otherwise show 2FA prompt
    - Show license purchase CTA when no active license
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.6_
  - [~] 8.4 Write property test for source code download gating (Property 5)
    - **Property 5: Source code download gating**
    - **Validates: Requirements 8.3, 8.4**
    - Generator: `fc.record({ tier: fc.oneof(fc.constant('usermode'), fc.constant('kernel')), twoFaEnabled: fc.boolean() })`; assert `isSourceDownloadVisible === (tier === 'kernel' && twoFaEnabled === true)`
  - [~] 8.5 Write property test for license-gated content exclusion (Property 7)
    - **Property 7: License-gated content exclusion**
    - **Validates: Requirements 8.6, 9.6**
    - Generator: combinations of `license === null` or `license.status !== 'active'`; assert no download buttons rendered, CTA present

- [ ] 9. License management page
  - [~] 9.1 Implement `DeviceList` dashboard component
    - List of activations with HWID (masked), device name, IP, last seen; deactivate button per row
    - After deactivate: `isActive → false`, entry removed from active list, rate-limit warning toast
    - Activation history log
    - _Requirements: 9.3, 9.4, 9.5_
  - [~] 9.2 Write property test for HWID deactivation immediate reflection (Property 8)
    - **Property 8: HWID deactivation reflects immediately in active device list**
    - **Validates: Requirements 9.5**
    - Generator: `fc.array` of `Activation` records + `fc.nat` to pick random index; assert after deactivate: `isActive === false` and absent from `filter(a => a.isActive)`
  - [~] 9.3 Assemble `app/dashboard/license/page.tsx`
    - Show license tier, copyable license key, `DeviceList`, activation history
    - Show upgrade/purchase CTA if no active license
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ] 10. API Keys page
  - [~] 10.1 Implement `ApiKeyRow` dashboard component and API key management actions
    - Row shows: name, masked key preview, environment badge, creation date, last used, revoke button
    - Revoke: sets `isActive → false`, removes from active list
    - Generate: calls `generateApiKey()`, shows `fullKey` once in modal/banner with `CopyButton`, then discards
    - Webhook configuration form: Discord/Slack URL, event selection
    - Sandbox/test-mode key generation option
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  - [~] 10.2 Write property test for API key revocation removes from active list (Property 9)
    - **Property 9: API key revocation removes key from active list**
    - **Validates: Requirements 10.3**
    - Generator: `fc.array` of `APIKey` records + `fc.nat` to pick random active key; assert after revoke: `isActive === false` and absent from `filter(k => k.isActive)`
  - [~] 10.3 Assemble `app/dashboard/api-keys/page.tsx`
    - List active keys with `ApiKeyRow`, "Generate API Key" button, webhook config section, sandbox key option
    - _Requirements: 10.1–10.5_

- [ ] 11. Team management page
  - [~] 11.1 Implement `TeamMemberRow` dashboard component and team management actions
    - Row shows: email/username, status badge, invited date, activated date, sub-license key, remove button
    - Add member: form with email input, assigns one seat; invite dispatches to `LicenseContext`
    - Remove member: revokes sub-license, returns seat to pool
    - Display total seats and remaining available seats
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  - [~] 11.2 Assemble `app/dashboard/team/page.tsx`
    - Seat summary card, `TeamMemberRow` list, "Add Team Member" form, empty state
    - _Requirements: 11.1–11.5_

- [ ] 12. Account settings page
  - [~] 12.1 Implement account settings forms: change password, change email, 2FA management, connected devices
    - Change password: requires current password; success → Sonner success toast
    - Change email: validation, mock confirmation flow
    - Connected devices: list with last access timestamps, session revoke option
    - 2FA section: enable/disable toggle; disable requires password confirmation + security warning
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_
  - [~] 12.2 Assemble `app/dashboard/settings/page.tsx`
    - Compose all settings sections; wire Sonner toasts for all form outcomes
    - _Requirements: 18.1–18.5, 19.2, 19.3_
  - [~] 12.3 Write property test for toast notifications matching form outcome (Property 10)
    - **Property 10: Toast notifications match form outcome**
    - **Validates: Requirements 19.2, 19.3**
    - Generator: `fc.boolean()` for success/failure flag; assert success → `toast.success` called once, failure → `toast.error` called once, never wrong type

- [~] 13. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Public trust and transparency pages
  - [~] 14.1 Implement `app/status/page.tsx`
    - Uptime percentage, operational status indicator, detection service health, last signature update timestamp (all mock data)
    - Publicly accessible without auth
    - _Requirements: 14.1, 14.2, 14.5_
  - [~] 14.2 Implement `app/changelog/page.tsx`
    - Versioned, timestamped list of updates with patch/detection descriptions (mock data)
    - _Requirements: 14.3_
  - [~] 14.3 Implement `app/builds/page.tsx`
    - Published SHA-256 checksums for every installer/EXE in monospace font, copy buttons
    - _Requirements: 14.4_
  - [~] 14.4 Implement `app/bug-bounty/page.tsx`
    - Program rules and scope, reward tiers by severity, submission guidelines and contact methods
    - Publicly accessible
    - _Requirements: 17.1, 17.2, 17.3, 17.4_
  - [~] 14.5 Implement `app/docs/page.tsx`
    - Integration guide with step-by-step instructions
    - Webhook events reference with event schemas
    - Ban API reference with endpoint descriptions and examples
    - Publicly accessible
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

- [ ] 15. Report forms and checkout flow
  - [~] 15.1 Implement `app/report/page.tsx` with false-positive and cheat report forms
    - False positive form: contact, affected software, description
    - Cheat report form: cheat name, source, evidence
    - On submit: Sonner success toast with mock ticket/reference number
    - Allow unauthenticated submissions
    - _Requirements: 15.1, 15.2, 15.3, 15.4_
  - [~] 15.2 Implement `app/checkout/page.tsx` checkout flow
    - Display selected tier and price (passed via query param or state)
    - Stripe placeholder payment form fields
    - Mock submit → success state with Sonner success toast → provision placeholder license → redirect to `/dashboard`
    - Mock failure state → Sonner error toast, retry option
    - Add code comment: `// TODO: Replace with real Stripe integration and backend license provisioning`
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 20.4_

- [ ] 16. Dashboard support page and README
  - [~] 16.1 Implement `app/dashboard/support/page.tsx`
    - Links to docs, contact form placeholder, Discord link
    - _Requirements: 7.5_
  - [~] 16.2 Create `README.md` documenting mock/placeholder systems and backend integration requirements
    - Document all mock contexts, the `shouldSimulateError` flag, and what needs a real backend (payments, HWID, 2FA, detection engine, webhooks)
    - _Requirements: 20.5_

- [ ] 17. Playwright smoke tests
  - [~] 17.1 Write Playwright smoke test: Auth flow (register → dashboard → logout → login → dashboard)
    - _Requirements: 4.3, 5.3_
  - [~] 17.2 Write Playwright smoke test: 2FA gate (attempt source download without 2FA → prompt → enable 2FA → source visible)
    - _Requirements: 8.3, 8.4, 6.4_
  - [~] 17.3 Write Playwright smoke test: License gate (no license → Downloads CTA → checkout → license active)
    - _Requirements: 8.6, 13.3, 13.4_
  - [~] 17.4 Write Playwright smoke test: API key lifecycle (generate → copy → revoke → removed from list)
    - _Requirements: 10.2, 10.3_
  - [~] 17.5 Write Playwright smoke test: Team management (add member → seat decrements → remove → seat returns)
    - _Requirements: 11.3, 11.4, 11.5_

- [~] 18. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- The design document contains 12 correctness properties; each has a corresponding property-based test sub-task
- All backend integration points (Stripe, HWID, real 2FA, detection engine) are mock — see `lib/mock-data.ts` and `README.md`
- Property tests use fast-check with minimum 100 iterations per property
- Smoke tests use Playwright for end-to-end user journey verification

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "1.4"] },
    { "id": 2, "tasks": ["1.5", "2.1"] },
    { "id": 3, "tasks": ["2.2", "2.3", "2.5"] },
    { "id": 4, "tasks": ["2.4", "2.6", "2.7", "3.1"] },
    { "id": 5, "tasks": ["3.2", "3.4"] },
    { "id": 6, "tasks": ["3.3", "5.1", "7.1"] },
    { "id": 7, "tasks": ["5.2", "5.3", "6.1", "7.2"] },
    { "id": 8, "tasks": ["5.4", "6.2", "6.3", "7.3"] },
    { "id": 9, "tasks": ["6.4", "6.5", "8.1"] },
    { "id": 10, "tasks": ["6.6", "8.2", "8.3", "9.1"] },
    { "id": 11, "tasks": ["8.4", "8.5", "9.2", "10.1"] },
    { "id": 12, "tasks": ["9.3", "10.2", "10.3", "11.1"] },
    { "id": 13, "tasks": ["11.2", "12.1"] },
    { "id": 14, "tasks": ["12.2", "12.3", "14.1", "14.2", "14.3"] },
    { "id": 15, "tasks": ["14.4", "14.5", "15.1", "15.2"] },
    { "id": 16, "tasks": ["16.1", "16.2"] },
    { "id": 17, "tasks": ["17.1", "17.2", "17.3", "17.4", "17.5"] }
  ]
}
```
