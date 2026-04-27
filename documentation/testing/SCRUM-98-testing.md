# SCRUM-98 — Spoonacular API Production Verification

**User Story 16:** Hosted Web Application  
**Branch:** `SCRUM-98-the-hosted-app-connects-to-the-`  
**Depends on:** SCRUM-96 (Railway deployment)

---

## What This Covers

Verification that the Spoonacular API connects and returns results correctly from the production Railway environment. No code changes were made for this ticket — this is a verification and documentation of the production API behavior.

---

## How Spoonacular is Configured in Production

The Spoonacular API key is stored as a Railway environment variable:
```
VITE_SPOONACULAR_API_KEY=your-key
```

Since it has the `VITE_` prefix, it is baked into the frontend at build time by Vite. It is read in `src/api/spoonacular.js`:
```js
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY
```

No backend proxy is involved — the frontend calls Spoonacular directly from the browser.

---

## Verification Steps

1. Open the live Railway URL: `https://pantry-cook-app-production.up.railway.app`
2. Enter an ingredient in the search bar (e.g. `chicken`)
3. Click **Search**
4. Recipe tiles should appear with names, images, and links

A successful response confirms:
- `VITE_SPOONACULAR_API_KEY` is correctly set in Railway
- The key was present at build time (baked into the frontend)
- Spoonacular's `/recipes/findByIngredients` and `/recipes/{id}/information` endpoints are reachable from the production environment

---

## Expected Behavior vs Known Limitations

| Scenario | Expected Result |
|----------|----------------|
| Valid search with quota remaining | Recipe tiles load correctly |
| API key missing or wrong | No results, console shows 401 or 402 error |
| Free tier quota hit (150 pts/day) | No results, console shows 402 — **not a code bug** |
| Network error | Error message displayed to user |

> ⚠️ **Free tier quota:** Spoonacular's free tier allows 150 API points per day. Each `/recipes/{id}/information` call costs 1 point. If the quota is hit, searches return no results and the console shows a 402 error. This is a billing limit, not a bug in the code. The API connection itself is working correctly.

---

## If Spoonacular Is Not Working in Production

1. Check Railway → service → Variables tab — confirm `VITE_SPOONACULAR_API_KEY` is set
2. If the variable was added after the last deploy — redeploy with `railway up` (VITE_ vars are baked in at build time)
3. Open browser DevTools → Network tab → look for the Spoonacular request and check the response status
4. 401 = wrong key, 402 = quota exceeded, 429 = rate limited (too many requests per second)
