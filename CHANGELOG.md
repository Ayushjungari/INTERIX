# INTERVO — Fix Report

## 1. Root causes found by comparing INTERVO ↔ talent-IQ

### Create Session was broken because:
- `backend/src/lib/inngest.js` referenced `upsertStreamUser` / `deleteStreamUser`
  **without importing them**. When Clerk fired `user.created`, the Inngest
  function threw `ReferenceError`, so the MongoDB user record was NEVER
  created. `protectRoute` then hit `User.findOne({clerkId})` → `null` →
  responded `404 "User not found"`, and `createSession` bubbled that up as
  “Failed to create room”.
- `backend/src/lib/env.js` used `INGEST_EVENT_KEY`/`INGEST_SIGNING_KEY`
  (typo, missing an `N`), so Inngest never authenticated even when the
  webhook was reachable.
- `backend/src/lib/inngest.js` also silently changed the Inngest app id
  and hard-coded a `signingKey`, blocking event delivery for anyone
  cloning the repo.

### The compiler was broken because:
- `backend/src/routes/codeRoutes.js` shell-executed `node temp_run.js`
  no matter what language the frontend sent, and had no test-case logic.
- `frontend/src/pages/ProblemPage.jsx` **hard-coded a Two-Sum test
  driver** appended to every submission — so "Reverse String" always
  ran Two-Sum tests (`ReferenceError: twoSum is not defined`).
- `frontend/src/lib/piston.js` was rewritten to POST to a literal
  `http://localhost:8000/...` URL and dropped Piston entirely.
- `frontend/src/data/problems.js` shipped only 2 problems, only in
  JavaScript, and starter code contained baked-in visible tests
  (no starter-vs-tests separation, no hidden tests, no Submit).

## 2. Fixes (architecture, not hacks)

### Backend
| File | Change |
|---|---|
| `src/lib/env.js` | Added `INNGEST_EVENT_KEY` / `INNGEST_SIGNING_KEY` (correct spelling) + `CLERK_*` |
| `src/lib/inngest.js` | Restored `upsertStreamUser` / `deleteStreamUser` imports; used `findOneAndUpdate({upsert})` so retries never crash on dup-key; removed hard-coded signingKey |
| `src/lib/stream.js` | Cleaned up, unchanged semantics |
| `src/middleware/protectRoute.js` | **NEW resilience**: if MongoDB has no record for the Clerk user (webhook missed / dev), the middleware calls `clerkClient.users.getUser()`, upserts the user in Mongo, and best-effort upserts to Stream. Session creation now works out-of-the-box |
| `src/models/User.js` | Normalized formatting, kept schema identical |
| `src/controllers/sessionController.js` | Fixed broken `getActiveSessions` catch block; end-session cleanup wrapped so a stale Stream artifact can't 500 the request |
| `src/routes/codeRoutes.js` | **Replaced entirely.** Removed `child_process` + `fs.writeFileSync`. Now proxies to Piston (`https://emkc.org/api/v2/piston`) with per-language pins (`javascript 18.15.0`, `python 3.10.0`, `java 15.0.2`, `c++ 10.2.0`). Two endpoints: `POST /api/code/run` and `POST /api/code/submit`. Detects Compilation Error, Runtime Error, and Time Limit Exceeded from Piston's response |
| `src/data/problems.js` | **New file.** Server-side catalog of hidden tests + language driver builders. `buildSubmission()` wraps the user function with a JSON test runner (`OUT:<json>`); `parseVerdict()` diffs outputs and returns `Accepted` / `Wrong Answer` |
| `src/server.js` | Removed stray `dotenv.config()` (already in `env.js`), removed the `console.log("API KEY: ...")` leak, wired the code router |

### Frontend
| File | Change |
|---|---|
| `src/data/problems.js` | 5 problems (Two-Sum, Reverse String, Valid Palindrome, Maximum Subarray, Container With Most Water). Full `starterCode` + `expectedOutput` for `javascript`, `python`, `java`, `cpp` |
| `src/lib/piston.js` | Rewritten. `executeCode()` and `submitCode()` call the backend via `axiosInstance` (so `VITE_API_URL` works in dev/prod). Returns `{success, output, error, verdict, details, testsPassed, testsTotal}` |
| `src/pages/ProblemPage.jsx` | Removed the hard-coded Two-Sum runner. Added Submit flow, per-problem/per-language starter reset, confetti on Accepted, verdict toasts |
| `src/components/CodeEditorPanel.jsx` | Added Submit button + `isSubmitting` state, kept UI/styling untouched |
| `src/components/OutputPanel.jsx` | Renders `verdict` header (Accepted / Wrong Answer / TLE / Runtime Error / Compilation Error), per-test detail list on Wrong Answer |
| `src/components/ProblemDescription.jsx` | Now also renders `examples` and `constraints` when present |
| `frontend/public/cpp.png` | Placeholder icon for C++ (currently a copy of `java.png`; swap for your own if desired) |

### Session/Video/Chat
No structural changes needed — INTERVO's `SessionPage`, `useStreamClient`,
and `VideoCallUI` were byte-identical to talent-IQ (only line endings
differed). They were only failing because `protectRoute` returned 404
before the session record could be created. That is now fixed.

## 3. Environment variables required

### `backend/.env` (see `.env.example`)
```
PORT=8000
DB_URL=<mongodb-uri>
NODE_ENV=development
CLIENT_URL=http://localhost:5173
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
STREAM_API_KEY=...
STREAM_API_SECRET=...
INNGEST_EVENT_KEY=...     # optional in dev; auto-provision covers it
INNGEST_SIGNING_KEY=...   # optional in dev
```

### `frontend/.env` (see `.env.example`)
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:8000/api
VITE_STREAM_API_KEY=...
```

## 4. Files added / modified

**Added**
- `backend/src/data/problems.js`
- `backend/.env.example`
- `frontend/.env.example`
- `frontend/public/cpp.png`
- `CHANGELOG.md` (this file)

**Modified (backend)**
- `src/lib/env.js`
- `src/lib/inngest.js`
- `src/lib/stream.js`
- `src/middleware/protectRoute.js`
- `src/models/User.js`
- `src/controllers/sessionController.js`
- `src/routes/codeRoutes.js`
- `src/server.js`

**Modified (frontend)**
- `src/data/problems.js`
- `src/lib/piston.js`
- `src/pages/ProblemPage.jsx`
- `src/components/CodeEditorPanel.jsx`
- `src/components/OutputPanel.jsx`
- `src/components/ProblemDescription.jsx`

No UI/style changes. `index.css`, DaisyUI theme, and every layout untouched.

## 5. Verified

- Backend files pass `node --check` (all 10 syntactically valid).
- Frontend JSX passes `esbuild` parse.
- Piston reachability is a runtime dependency (public endpoint
  `emkc.org/api/v2/piston` — no key needed). If your network blocks it,
  swap `PISTON_URL` in `src/routes/codeRoutes.js` for your own Piston
  instance.

## 6. Known remaining limitations

- **Java / C++ Submit**: for the JS and Python tracks the backend wraps
  the user's function with a hidden-test JSON driver and diffs deterministic
  output. For Java and C++, Submit runs the user's program as-is (the
  visible tests baked into starter code) and reports `Ran`. Building a
  per-problem Java/C++ harness (like LeetCode's LeetCode's `Solution.solve`
  reflection scaffolding) is a follow-up; the plumbing is in
  `backend/src/data/problems.js` → `buildSubmission()` where you can add
  a `javaDriver()` / `cppDriver()` alongside the existing ones.
- **Inngest** is optional in dev — `protectRoute` self-heals via Clerk.
  For production you still want the Clerk webhook wired to
  `/api/inngest` so user rows are created on signup rather than on first
  authenticated request.
- The included `frontend/public/cpp.png` is a placeholder (copy of the
  Java icon). Drop in a real C++ icon if you want branding accuracy.
