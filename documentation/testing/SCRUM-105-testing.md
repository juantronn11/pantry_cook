# SCRUM-105 — Bitbucket Pipelines Auto-Deploy Setup

**User Story 16:** Hosted Web Application  
**Branch:** `SCRUM-105`  
**Depends on:** SCRUM-96 (Railway deployment)

---

## What This Covers

Setup of Bitbucket Pipelines CI/CD so that every push to `main` automatically deploys the app to Railway — no manual `railway up` needed.

---

## What Was Added

### `bitbucket-pipelines.yml` (project root)

```yaml
image: node:18

pipelines:
  branches:
    main:
      - step:
          name: Deploy to Railway
          script:
            - npm i -g @railway/cli
            - railway up --service=$RAILWAY_SERVICE
```

This file tells Bitbucket to run the pipeline on every push to `main`. It installs the Railway CLI and deploys using the service ID stored in Bitbucket repository variables.

---

## Required Bitbucket Repository Variables

Before the pipeline can run, two variables must be set in Bitbucket:

1. Go to your Bitbucket repository → **Repository Settings** → **Pipelines** → **Repository variables**
2. Add these two variables (mark both as **Secured**):

| Variable | Value | Secured |
|----------|-------|---------|
| `RAILWAY_TOKEN` | Railway API token (Railway → Account Settings → Tokens) | Yes |
| `RAILWAY_SERVICE` | Railway Service ID (Railway → service → Settings) | Yes |

---

## How to Enable Pipelines

1. Bitbucket repository → **Repository Settings** → **Pipelines** → **Settings**
2. Toggle **Enable Pipelines** to on

---

## How to Verify It Works

1. Push any change to the `main` branch
2. Go to Bitbucket → **Pipelines** (left sidebar)
3. A pipeline run should appear — click it to watch the logs
4. When it completes, open the Railway URL and confirm the change is live

A successful run looks like:
```
npm i -g @railway/cli    ✓
railway up               ✓ Deploy complete
```

---

## How the Full Flow Works

```
Push to Bitbucket main
  → Bitbucket Pipelines triggers
    → Installs Railway CLI
      → Runs railway up --service=$RAILWAY_SERVICE
        → Railway builds and deploys
          → Live URL updated automatically
```

---

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Pipeline not triggering | Pipelines not enabled | Repo Settings → Pipelines → Settings → enable |
| `Error: Unauthorized` | `RAILWAY_TOKEN` wrong or expired | Generate a new token in Railway → Account Settings → Tokens |
| `Service not found` | `RAILWAY_SERVICE` wrong | Double-check Service ID in Railway → service → Settings |
| Pipeline passes but site not updated | Railway build failed | Check Railway dashboard → Deployments for the error |
