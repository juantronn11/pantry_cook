# SCRUM-96 — Railway Deployment Guide

**User Story 16:** Hosted Web Application  
**Branch:** `SCRUM-96-load-webpage-on-global-server-u`  
**Platform:** Railway (railway.app)

---

## What Changed

Four files were modified to make the app deployable on Railway:

| File | Change |
|------|--------|
| `package.json` | Added `"start": "node ./server/mongo.js"` — Railway needs this to run the server after build |
| `server/mongo.js` | Added `path`/`url` imports and `__dirname`; Express now serves the built `dist/` as static files; added React Router catch-all route; port now reads from `process.env.PORT` so Railway can inject its own |
| `src/helperFunctions/helper.js` | Changed `"http://localhost:3000/"` → `"/"` — relative URL works since Express serves the frontend on the same domain in production |
| `vite.config.js` | Added dev proxy for `/user` and `/recipe` → `localhost:3000` so local development still works after the URL change |

---

## How Railway Runs the App

Railway automatically runs these three steps on every deploy:
```
npm install
npm run build     ← Vite compiles the frontend into dist/
npm start         ← Express serves dist/ as static files and handles API routes
```

Everything — frontend and backend — runs as a single Railway service on one URL.

---

## Railway Setup (One-Time)

### Step 1 — Create the Railway project

Option A — Railway CLI (works with Bitbucket, no GitHub required):
```bash
npm install -g @railway/cli
railway login
railway init      # run from the project root — links the local repo to Railway
railway up        # deploys from current directory
```

Option B — Railway dashboard (GitHub only): connect repo directly at railway.app/new.

### Step 2 — Set environment variables in Railway

Go to Railway project → your service → **Variables** tab. Add all of these **before the first deploy** — `VITE_` variables are baked into the frontend at build time and will be missing if set after:

| Variable | Where it's used |
|----------|----------------|
| `MONGODB_URL` | `server/mongo.js` — MongoDB connection string |
| `AUTH0_AUDIENCE` | `server/mongo.js` — JWT verification |
| `ISSUER_BASE_URL` | `server/mongo.js` — JWT verification |
| `VITE_SPOONACULAR_API_KEY` | `src/api/spoonacular.js` — recipe search |
| `VITE_AUTH0_AUDIENCE` | `src/helperFunctions/helper.js` — Auth0 token request |

Values for these are in the team's `.env` file (not committed — ask the team if you don't have it).

### Step 3 — Update Auth0 allowed URLs

Auth0 will block logins from the Railway URL until you add it. In the Auth0 dashboard → your application → Settings:

- **Allowed Callback URLs** — add `https://your-railway-url.up.railway.app/callback`
- **Allowed Logout URLs** — add `https://your-railway-url.up.railway.app`
- **Allowed Web Origins** — add `https://your-railway-url.up.railway.app`

Replace `your-railway-url` with the actual subdomain Railway assigns.

### Step 4 — Verify the deployment

1. Open the Railway URL in a browser — the search page should load
2. Open from a phone or a different network — should load identically
3. Navigate to `/history` and `/saved` directly in the URL bar — should not 404

---

## Running Locally After These Changes

Local dev works the same as before — the Vite proxy routes API calls to Express:

```bash
# Terminal 1 — Express server
node ./server/mongo.js

# Terminal 2 — Vite dev server
npm run dev
```

The proxy in `vite.config.js` forwards `/user` and `/recipe` calls from Vite (port 5173) to Express (port 3000) automatically.
