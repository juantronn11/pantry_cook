# SCRUM-148 — MongoDB Error Logging Collection

**User Story 22:** Improved Search & Error Handling  
**Branch:** `SCRUM-148`  
**PR Flag:** Have teammates review and leave comments on this PR before merging.

---

## What This Covers

A new MongoDB collection (`errorLogs`) and a `POST /errors` endpoint that allows the frontend to log errors persistently instead of only printing to the console.

---

## What Changed

### `server/mongo.js`
- Added `errorLogs` collection reference to the `pantrycook` database
- Added `POST /errors` endpoint — unauthenticated so errors can be logged before or during login failures

### Endpoint

```
POST /errors
```

**Request body:**
```json
{
  "message": "Failed to save recipe",
  "component": "RecipeTile",
  "userId": "user@example.com"
}
```

- `message` — required
- `component` — optional, defaults to `"unknown"`
- `userId` — optional, defaults to `null`

**Response:**
```json
{ "logged": true }
```

**Each log entry stored in MongoDB:**
```json
{
  "timestamp": "2026-04-20T...",
  "message": "Failed to save recipe",
  "component": "RecipeTile",
  "userId": "user@example.com"
}
```

---

## How to Verify

### Using DevTools
1. Run the app locally (`npm run dev` + `node ./server/mongo.js`)
2. Open DevTools → Console
3. Run:
```js
fetch('/errors', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'test error', component: 'DevTools' })
})
```
4. Response should be `{ "logged": true }`

### Verify in MongoDB
1. Open MongoDB Atlas → `pantrycook` database
2. Check the `errorLogs` collection
3. A new document should appear with the timestamp, message, and component

---

## Reviewer Checklist

- [ ] `POST /errors` returns `{ "logged": true }` with a valid body
- [ ] `POST /errors` returns 400 when `message` is missing
- [ ] Entry appears in the `errorLogs` MongoDB collection after a successful call
- [ ] Endpoint works without an auth token
