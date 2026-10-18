# Deployment & development workflow

## Services

| Piece | Where | Deploys |
|---|---|---|
| Frontend (`frontend/`, Next.js) | Vercel project `wegoviral`, Root Directory `frontend` | Every push: `main` → production (https://wegoviral-nu.vercel.app); other branches → preview URL |
| Backend (`backend/`, Express + Prisma) | Railway project `wegoviral`, service `backend`, Root Directory `/backend` | Every push to `main` |
| Database, Auth, Storage | Supabase | Migrations run automatically before each backend deploy |

> Until the community launches, local development, previews and tests all use the **production** database. See "Before launch" in [ADMIN_ROADMAP.md](ADMIN_ROADMAP.md).

### Railway service settings

Set on the service itself (Railway's `railway.json` is deprecated and was ignored):

| Setting | Value |
|---|---|
| Root directory | `/backend` |
| Build command | `yarn build` |
| Pre-deploy command | `yarn migrate:deploy` (applies pending Prisma migrations) |
| Start command | `yarn start` |
| Health check path | `/health` |
| Restart policy | On failure, 5 retries |

Railway PR environments are **off** on purpose: they'd share the production database, so a PR's migration would change production before the PR is merged.

## Environment variables

### Railway (backend)

| Variable | Value / where to find it |
|---|---|
| `DATABASE_URL` | Supabase → Connect → Transaction pooler (port 6543) + `?pgbouncer=true` |
| `DIRECT_URL` | Supabase → Connect → Session pooler (port 5432), used by migrations |
| `SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_JWKS_URL` | `<SUPABASE_URL>/auth/v1/.well-known/jwks.json` |
| `SUPABASE_SECRET_KEY` | Supabase → API Keys → secret key (Storage uploads; server only) |
| `FRONTEND_URL` | `https://wegoviral-nu.vercel.app,https://wegoviral-ayoubbahmads-projects.vercel.app,https://wegoviral-*-ayoubbahmads-projects.vercel.app` (`*` covers preview URLs) |
| `NODE_ENV` | `production` |
| `SCRAPERS_ENABLED` | `false` |
| `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` | `1` |

`PORT` is provided by Railway; don't set it.

### Vercel (frontend, all environments)

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://backend-production-ab0be.up.railway.app/api` |
| `NEXT_PUBLIC_SUPABASE_URL` | Same as `SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → API Keys → `sb_publishable_…` (safe in the browser) |

Local equivalents live in `backend/.env` and `frontend/.env.local` (both gitignored; see `backend/.env.example`).

**Local `DATABASE_URL`:** use Supabase's session pooler (port 5432) with `?connection_limit=4`. The session pooler allows only 15 clients in total, and a local backend, a test backend and the test runner share them; without a cap you get `max clients reached in session mode`. Production uses the transaction pooler (port 6543), which has no such limit but adds latency from far away.

## Branch workflow

1. One branch per roadmap item, e.g. `feat/admin-members`.
2. Open a PR to `main`. The template has the Build → Review → Test → Accept → Ship checklist.
3. **CI** (GitHub Actions) runs on every PR:
   - Frontend: typecheck, lint of the changed files (older files still have lint errors), production build.
   - Backend: typecheck (app, tests, demo script), build, and a check that the migrations exactly match `schema.prisma`.
4. Vercel posts a **preview URL** on the PR. Previews use the production backend, so frontend-only changes can be tried there. Backend changes are tested locally (below) until a staging environment exists.
5. Merge → Vercel and Railway deploy `main`; Railway applies new migrations before starting.

## Testing

```bash
cd backend
yarn dev                      # backend on http://localhost:3001
yarn test:api                 # API test suite against it
API_URL=https://backend-production-ab0be.up.railway.app/api yarn test:api   # against production (slow: ~10-15 min from far away)
```

The suite (`backend/tests/api/`) signs in as real Supabase test users (`@apitest.wegoviral.test`) and deletes everything it created afterwards, including logins left by an interrupted run. The onboarding tests temporarily change the guide, quiz and joining settings and restore them at the end; if a run is killed midway, the next run detects the leftover `[test]` content and restores a clean state. It needs `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` and `DATABASE_URL` in `backend/.env`.

## Demo data

```bash
cd backend
yarn demo:seed    # replaces demo data with a fresh set (members, posts, polls, likes, comments)
yarn demo:clear   # removes all demo data
```

Demo members use `@demo.wegoviral.test` emails and can't log in. Clearing deletes only them and their content, never real members. Clear it before launch.
