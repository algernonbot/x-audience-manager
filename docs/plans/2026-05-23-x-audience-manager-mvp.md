# X Audience Manager MVP Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build a previewable Next.js MVP for X graph cleanup with mocked X API fixtures, server-enforced entitlements, safe-listing, cost controls, and billing-state unlocks.

**Architecture:** Start with deterministic domain modules and tests, then expose the behavior through App Router pages and route handlers. The real X and Stripe integrations remain behind provider/entitlement boundaries so the MVP uses fixtures without unofficial automation or token logging.

**Tech Stack:** Next.js App Router, React, TypeScript, hand-rolled premium CSS, Vitest, mocked X API fixtures.

---

### Task 1: Establish test-first domain contracts

**Objective:** Define entitlement, scan, candidate, and action-limit behavior before production code.

**Files:**
- Create: `src/domain/entitlements.test.ts`
- Create: `src/domain/candidates.test.ts`
- Create: `src/domain/cleanup.test.ts`
- Create: `src/domain/scan.test.ts`

**Verification:** Run `pnpm test:run` and expect failures because domain modules do not exist yet.

### Task 2: Implement entitlement and usage accounting

**Objective:** Server-side entitlement rules for free, Purge Pass, subscription, expired pass, scan caps, and action caps.

**Files:**
- Create: `src/domain/entitlements.ts`
- Create: `src/domain/usage.ts`

**Verification:** `pnpm vitest run src/domain/entitlements.test.ts src/domain/cleanup.test.ts`.

### Task 3: Implement mocked X provider and preview scan

**Objective:** Fetch only a capped following preview from deterministic fixtures and record usage events.

**Files:**
- Create: `src/domain/x-provider.ts`
- Create: `src/domain/mock-x.ts`
- Create: `src/domain/scan.ts`

**Verification:** `pnpm vitest run src/domain/scan.test.ts`.

### Task 4: Implement candidate generation and safe-list exclusion

**Objective:** Generate cleanup candidates from basic account fields while excluding safe-listed accounts by default.

**Files:**
- Create: `src/domain/candidates.ts`

**Verification:** `pnpm vitest run src/domain/candidates.test.ts`.

### Task 5: Build a durable server-side mock store and API routes

**Objective:** Provide preview login, preview scan, cleanup action, and billing unlock APIs with server-side enforcement.

**Files:**
- Create: `src/server/store.ts`
- Create: `src/app/api/mock-login/route.ts`
- Create: `src/app/api/scan/preview/route.ts`
- Create: `src/app/api/cleanup/actions/route.ts`
- Create: `src/app/api/billing/purge-pass/route.ts`
- Create: `src/app/api/billing/subscription/route.ts`

**Verification:** `pnpm -r typecheck` and route behavior covered by domain tests.

### Task 6: Build the premium minimal product surface

**Objective:** Create the landing page, dashboard, candidates table, billing/access states, reports, and empty/loading/error copy.

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/app/dashboard/page.tsx`
- Create: `src/app/candidates/page.tsx`
- Create: `src/app/billing/page.tsx`
- Create: `src/app/reports/page.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`

**Verification:** `pnpm build`.

### Task 7: Final quality gates and handoff

**Objective:** Confirm tests, typecheck, build, local commit, and document remaining real-integration decisions.

**Commands:**
- `pnpm test:run`
- `pnpm -r typecheck`
- `pnpm build`
- `git status --short`
- `git commit -m "feat: scaffold x audience manager mvp"`

**Notes:** PR creation requires a GitHub remote; if the managed checkout has no remote, report the local commit and ask Algernon to attach/publish a repository before PR handoff.
