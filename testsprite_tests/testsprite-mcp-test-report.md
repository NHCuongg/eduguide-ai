# TestSprite AI Testing Report (MCP)

---

## 1️⃣ Document Metadata

- **Project Name:** pet-manager
- **Project Type:** Frontend (Next.js 16 App Router, React 19, NextAuth v5, Drizzle ORM + PostgreSQL)
- **Test Scope:** Codebase
- **Server Mode:** Development (dev cap = 15 high-priority tests)
- **Local Endpoint:** http://localhost:3003
- **Test Date:** 2026-05-03
- **Prepared by:** TestSprite AI Team
- **Total Test Cases Generated:** 49 (full plan in `testsprite_frontend_test_plan.json`)
- **Total Test Cases Executed:** 15 (dev-mode cap)
- **TestSprite Run Dashboard:** https://www.testsprite.com/dashboard/mcp/tests/b6982451-f998-4ccd-b5a1-bc360430b302

---

## 2️⃣ Requirement Validation Summary

### Requirement: User Authentication (Login + Registration)
**Description:** Users sign in with email/password (NextAuth Credentials) and create accounts via the `/register` flow with bcrypt-hashed passwords.

#### Test TC001 — Login and reach dashboard
- **Test Code:** [TC001_Login_and_reach_dashboard.py](./TC001_Login_and_reach_dashboard.py)
- **Status:** 🚧 Blocked
- **Test Visualization:** https://www.testsprite.com/dashboard/mcp/tests/b6982451-f998-4ccd-b5a1-bc360430b302/c33fa9a4-20fe-4bb7-b971-088da83e4d9d
- **Findings:** Test user `phamdt203@gmail.com` does not exist in the local DB. Both login (`Email hoặc mật khẩu không chính xác.`) and the fallback registration (`Đăng ký thất bại. Xin vui lòng thử lại sau.`) failed, so the dashboard never loaded.

#### Test TC002 — Successful login redirects to dashboard
- **Test Code:** [TC002_Successful_login_redirects_to_dashboard.py](./TC002_Successful_login_redirects_to_dashboard.py)
- **Status:** ❌ Failed
- **Test Visualization:** https://www.testsprite.com/dashboard/mcp/tests/b6982451-f998-4ccd-b5a1-bc360430b302/6b1e102d-6f5c-414f-99df-e3111388da47
- **Findings:** Submitting valid-format credentials yields the error "Email hoặc mật khẩu không chính xác." and the page stays on `/login`. Server log shows the cause: NextAuth's `getUser` Drizzle query crashes with `connect ECONNREFUSED 127.0.0.1:5433` — Postgres is not running locally — so authentication can never succeed.

#### Test TC011 — Register a new account and reach onboarding
- **Test Code:** [TC011_Register_a_new_account_and_reach_onboarding.py](./TC011_Register_a_new_account_and_reach_onboarding.py)
- **Status:** ❌ Failed
- **Test Visualization:** https://www.testsprite.com/dashboard/mcp/tests/b6982451-f998-4ccd-b5a1-bc360430b302/4ba255e1-cdc9-4b17-a83c-b0d7f5f3d43d
- **Findings:** The registration server action (`registerUser`) fails for the same reason — DB unreachable — and surfaces a generic Vietnamese toast ("Đăng ký không thành công. Đăng ký thất bại. Xin vui lòng thử lại sau.") that hides the underlying connection error. No redirect to `/onboarding` occurs.

---

### Requirement: Theme Management (Light / Dark)
**Description:** Users toggle theme in Settings; preference must persist across navigation via `next-themes`.

#### Test TC003 — Persist theme preference across dashboard navigation
- **Test Code:** [TC003_Persist_theme_preference_across_dashboard_navigation.py](./TC003_Persist_theme_preference_across_dashboard_navigation.py)
- **Status:** ✅ Passed
- **Test Visualization:** https://www.testsprite.com/dashboard/mcp/tests/b6982451-f998-4ccd-b5a1-bc360430b302/236faeba-46ae-430e-a738-7aaab1216db1
- **Findings:** The only test that succeeded — `next-themes` correctly persists the chosen theme via `localStorage` and the `class` attribute on `<html>` survives client-side navigation.

#### Test TC004 — Switch theme persists across dashboard navigation
- **Test Code:** [TC004_Switch_theme_persists_across_dashboard_navigation.py](./TC004_Switch_theme_persists_across_dashboard_navigation.py)
- **Status:** 🚧 Blocked
- **Test Visualization:** https://www.testsprite.com/dashboard/mcp/tests/b6982451-f998-4ccd-b5a1-bc360430b302/c4bbd088-c0e9-4290-8fa3-0fd75a2cf8f7
- **Findings:** Variant of TC003 that requires reaching Settings while authenticated. Blocked at login due to the Postgres outage.

#### Test TC008 — Toggle theme preference from settings
- **Test Code:** [TC008_Toggle_theme_preference_from_settings.py](./TC008_Toggle_theme_preference_from_settings.py)
- **Status:** 🚧 Blocked
- **Test Visualization:** https://www.testsprite.com/dashboard/mcp/tests/b6982451-f998-4ccd-b5a1-bc360430b302/544d026f-d54d-4778-83d0-3b7f6ff93299
- **Findings:** Settings page is auth-gated; blocked at login.

---

### Requirement: Language / Localization (EN ↔ VI)
**Description:** Users switch UI language via `next-intl`; preference must persist across navigation.

#### Test TC006 — Switch language persists across dashboard navigation
- **Test Code:** [TC006_Switch_language_persists_across_dashboard_navigation.py](./TC006_Switch_language_persists_across_dashboard_navigation.py)
- **Status:** 🚧 Blocked
- **Test Visualization:** https://www.testsprite.com/dashboard/mcp/tests/b6982451-f998-4ccd-b5a1-bc360430b302/770ca08f-1b5f-4e88-8d1a-bbc86898601d
- **Findings:** Language picker lives in the dashboard header — unreachable without auth. Blocked.

#### Test TC013 — Persist language preference across dashboard navigation
- **Test Code:** [TC013_Persist_language_preference_across_dashboard_navigation.py](./TC013_Persist_language_preference_across_dashboard_navigation.py)
- **Status:** 🚧 Blocked
- **Test Visualization:** https://www.testsprite.com/dashboard/mcp/tests/b6982451-f998-4ccd-b5a1-bc360430b302/f094eb44-35fc-406c-8e23-f08b6d3875b3
- **Findings:** Auth-gated; same blocker. Agent also reports that `/register` sometimes renders the sign-in form instead of the registration form — worth investigating separately.

---

### Requirement: Dashboard Home & Resume Learning
**Description:** Authenticated users see widgets, sidebar navigation, and a "Resume" CTA for the active course.

#### Test TC005 — Dashboard shows core widgets and navigation
- **Test Code:** [TC005_Dashboard_shows_core_widgets_and_navigation.py](./TC005_Dashboard_shows_core_widgets_and_navigation.py)
- **Status:** 🚧 Blocked
- **Test Visualization:** https://www.testsprite.com/dashboard/mcp/tests/b6982451-f998-4ccd-b5a1-bc360430b302/56f1cc4e-403d-48ec-83c8-1aa8a1e4a2aa
- **Findings:** Cannot reach `/dashboard` — login fails (DB outage).

#### Test TC012 — Resume learning from dashboard
- **Test Code:** [TC012_Resume_learning_from_dashboard.py](./TC012_Resume_learning_from_dashboard.py)
- **Status:** 🚧 Blocked
- **Test Visualization:** https://www.testsprite.com/dashboard/mcp/tests/b6982451-f998-4ccd-b5a1-bc360430b302/b0c5bd23-da1a-436c-81c8-009b3c9648e3
- **Findings:** Same root cause; resume CTA cannot be exercised.

---

### Requirement: Study Plan & Module Tracking
**Description:** Roadmap displays modules with sub-topics; users can mark modules complete and overall progress updates.

#### Test TC009 — Mark a module complete and see overall completion update
- **Test Code:** [TC009_Mark_a_module_complete_and_see_overall_completion_update.py](./TC009_Mark_a_module_complete_and_see_overall_completion_update.py)
- **Status:** 🚧 Blocked
- **Test Visualization:** https://www.testsprite.com/dashboard/mcp/tests/b6982451-f998-4ccd-b5a1-bc360430b302/2e1af9d0-3d92-4247-8a2d-70ea14fe6cf4
- **Findings:** Auth-gated `/dashboard/plan` is unreachable.

#### Test TC014 — Browse modules and expand a module to see sub-topics
- **Test Code:** [TC014_Browse_modules_and_expand_a_module_to_see_sub_topics.py](./TC014_Browse_modules_and_expand_a_module_to_see_sub_topics.py)
- **Status:** ❌ Failed
- **Test Visualization:** https://www.testsprite.com/dashboard/mcp/tests/b6982451-f998-4ccd-b5a1-bc360430b302/37e00d58-09e7-4da6-9e77-9dcf39b9ec78
- **Findings:** This test ran far enough to view the Study Plan UI but found a real product bug: each module card exposes only header, phase, duration, description, and the actions (Resources / Quiz / Mark done) — **no expandable sub-topic list is rendered**. The agent specifically tried to extract sub-topic titles for the "Career Change Vocabulary Core" module and found none. Either the feature is not implemented or the disclosure interaction is missing/non-discoverable.

---

### Requirement: Quiz / Test Practice
**Description:** Generate AI quizzes per module via `/api/generate-quiz` (BullMQ + OpenAI), answer questions, and see scoring.

#### Test TC007 — Generate and complete a quiz practice session
- **Test Code:** [TC007_Generate_and_complete_a_quiz_practice_session.py](./TC007_Generate_and_complete_a_quiz_practice_session.py)
- **Status:** 🚧 Blocked
- **Test Visualization:** https://www.testsprite.com/dashboard/mcp/tests/b6982451-f998-4ccd-b5a1-bc360430b302/0388f608-67f1-433b-8f2e-034188ce1f90
- **Findings:** Blocked upstream at auth. Note that even with auth, this flow needs a running BullMQ worker (`npm run worker`) which is also not running in this environment.

---

### Requirement: Flashcards
**Description:** AI-generated flashcards with flip / next / previous interactions per module.

#### Test TC010 — Generate and review flashcards for a module
- **Test Code:** [TC010_Generate_and_review_flashcards_for_a_module.py](./TC010_Generate_and_review_flashcards_for_a_module.py)
- **Status:** 🚧 Blocked
- **Test Visualization:** https://www.testsprite.com/dashboard/mcp/tests/b6982451-f998-4ccd-b5a1-bc360430b302/c9edd5e0-aff4-411e-9c87-ebfdb489da6d
- **Findings:** Blocked upstream at auth. The agent also observed that `/register` did not present registration fields on this attempt — only the sign-in form — which prevented the fallback account creation.

---

### Requirement: Sign Out
**Description:** Users can sign out from Settings and be redirected back to `/login`.

#### Test TC015 — Sign out from settings and return to login
- **Test Code:** [TC015_Sign_out_from_settings_and_return_to_login.py](./TC015_Sign_out_from_settings_and_return_to_login.py)
- **Status:** 🚧 Blocked
- **Test Visualization:** https://www.testsprite.com/dashboard/mcp/tests/b6982451-f998-4ccd-b5a1-bc360430b302/3cc07f29-171b-4062-991a-0c3697fa3a4b
- **Findings:** Blocked upstream at auth.

---

## 3️⃣ Coverage & Matching Metrics

- **Pass Rate:** **6.67 %** (1 / 15 tests passed)
- **Failure Rate:** 20 % (3 hard failures)
- **Block Rate:** 73 % (11 tests blocked by upstream auth/DB outage)

| Requirement | Total | ✅ Passed | ❌ Failed | 🚧 Blocked |
|---|---|---|---|---|
| User Authentication (Login + Register) | 3 | 0 | 2 | 1 |
| Theme Management | 3 | 1 | 0 | 2 |
| Language / Localization | 2 | 0 | 0 | 2 |
| Dashboard Home & Resume | 2 | 0 | 0 | 2 |
| Study Plan & Module Tracking | 2 | 0 | 1 | 1 |
| Quiz / Test Practice | 1 | 0 | 0 | 1 |
| Flashcards | 1 | 0 | 0 | 1 |
| Sign Out | 1 | 0 | 0 | 1 |
| **Total** | **15** | **1** | **3** | **11** |

---

## 4️⃣ Key Gaps / Risks

### 🔴 Critical — Local Postgres is unreachable, blocking the entire authenticated surface
- **Evidence:** Server log:
  ```
  DrizzleQueryError: Failed query: select "id", "name", "email", "password", ...
  from "user" where "user"."email" = $1 limit $2
  params: phamdt203@gmail.com,1: connect ECONNREFUSED 127.0.0.1:5433
  ```
- **Impact:** 11 of 15 tests blocked; both login and registration UX fail with the same generic Vietnamese error message regardless of input.
- **Fix:** Bring up the database (`docker compose up -d db` per `docker-compose.yml`) and run migrations (`npm run db:push`), then seed a known test user. Re-run TestSprite afterwards.

### 🟠 High — Registration / login error messages mask infrastructure failures
- **Evidence:** A DB-connection refusal surfaces as `Đăng ký thất bại. Xin vui lòng thử lại sau.` and `Email hoặc mật khẩu không chính xác.`
- **Impact:** Users (and tests) cannot distinguish bad credentials from a backend outage. The "wrong password" framing is also misleading and a minor security/UX smell.
- **Fix:** In `src/app/actions/auth.ts` and the NextAuth `authorize` callback, log the underlying error server-side (already done via pino) but surface a distinct user-facing message for transient/infrastructure errors (e.g., `Service temporarily unavailable, please try again`) versus credential errors.

### 🟠 High — Study Plan modules do not render sub-topics
- **Evidence:** TC014 (failed, not blocked) — agent inspected the Study Plan UI and found no sub-topic disclosure for module "Career Change Vocabulary Core"; only header + Resources / Quiz / Mark done buttons.
- **Impact:** Either the sub-topics feature is missing or the expand interaction is not discoverable; advertised in the test plan / PRD but not delivered in the UI.
- **Fix:** Verify whether modules are supposed to expand inline (e.g. accordion) or navigate to a detail view; if data exists in `roadmaps` JSON, wire it up in `src/components/dashboard/StudyPlan.tsx`.

### 🟡 Medium — `/register` route occasionally rendered the sign-in form
- **Evidence:** TC010 and TC013 reported that `/register` did not show registration inputs — only the login form was visible.
- **Impact:** Users who land on `/register` directly may be unable to create an account at all.
- **Fix:** Verify `src/app/register/page.tsx` and `AuthScreen.tsx` for state leakage between modes (the same component likely renders both login and register based on a prop/route — check that the route wiring sets the correct mode).

### 🟡 Medium — BullMQ worker not running in dev
- **Evidence:** AI-generation routes (`/api/generate-quiz`, `/api/generate-flashcards`, `/api/generate-roadmap`) use BullMQ jobs; without `npm run worker` running, these will stall even after auth is fixed.
- **Impact:** Tests TC007, TC010 (and onboarding) cannot exercise the AI pipeline locally.
- **Fix:** Document a single dev script (e.g., `npm run dev:all`) that boots Next, the worker, Postgres and Redis together; or add a `concurrently` setup.

### 🟢 Low — Dev-mode test cap and port detection
- **Evidence:** TestSprite limited execution to 15 high-priority tests because dev mode is single-threaded and crashes under concurrent load. Initial run also briefly reported `tcp timeout: 3003 localhost` before recovering.
- **Impact:** Only 15 of the 49 generated cases ran. Larger surface (notes, profile, password reset, AI chat rate-limit, landing page, privacy/terms) is untested.
- **Fix:** Run `npm run build && npm run start` and re-invoke TestSprite with `serverMode: "production"` to lift the cap to 30 high-priority tests.

---

### Recommended Next Steps

1. Start Postgres + Redis (`docker compose up -d`) and run `npm run db:push`.
2. Seed/register a known test user (`phamdt203@gmail.com` / `Tien1210@`).
3. Start the worker: `npm run worker:dev`.
4. Re-run TestSprite in production mode for broader coverage:
   `npm run build && npm run start` then re-invoke `testsprite_generate_code_and_execute` with `serverMode: "production"`.
5. Triage TC014 (missing sub-topics) and the `/register` rendering inconsistency as real product bugs independent of the infra issues above.
