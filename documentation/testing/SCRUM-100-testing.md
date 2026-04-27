# SCRUM-100 — Load Time and Error Page Verification

**User Story 16:** Hosted Web Application  
**Branch:** `SCRUM-100-loading-of-webpage-is-in-a-rea`  
**Depends on:** SCRUM-96 (Railway deployment), SCRUM-98 (Spoonacular verification)  
**PR Flag:** Have teammates review and leave comments on this PR before merging.

---

## What This Covers

Verification that the deployed Railway app loads in a reasonable time and handles error states gracefully. No code changes were made for this ticket — this is a verification and documentation of production load behavior.

---

## Load Time Verification

### How to check
1. Open `https://pantry-cook-app-production.up.railway.app` in Chrome
2. Open **DevTools** (F12) → **Network** tab
3. Hard reload the page (Ctrl + Shift + R)
4. Check the total load time shown at the bottom of the Network tab

### Results
- Target: under 3 seconds on a normal network connection
- First load after inactivity may be slower due to Railway's cold start on the free tier — test a second load for an accurate reading
- CSS and JS assets are gzip compressed by Vite at build time which keeps bundle size small

### Bundle sizes (from build output)
| Asset | Size | Gzip |
|-------|------|------|
| `index.css` | ~14 kB | ~2.8 kB |
| `index.js` | ~479 kB | ~147 kB |

The JS bundle is within acceptable range for a React app of this size.

---

## Error Page Verification

### React Router catch-all
The Express server includes a catch-all route (`/{*splat}`) that sends `index.html` for any unknown path. React Router then handles rendering the appropriate page or a not-found state.

### How to verify
1. Navigate to a route that doesn't exist:
   `https://pantry-cook-app-production.up.railway.app/doesnotexist`
2. The app should load and display a not-found state — not a blank page or raw server error
3. Navigate to valid sub-routes directly in the URL bar:
   - `/history` — should load the history page
   - `/saved` — should load the saved recipes page
   - `/` — should load the search page

---

## Teammate Review Checklist

Teammates reviewing this PR — please test the following on the live URL and leave a comment confirming:

- [ ] App loaded in a reasonable time from your device and network
- [ ] Navigating to `/history` and `/saved` directly in the URL bar worked without 404
- [ ] Navigating to an invalid route did not show a blank page or server error
