# GitHub Pages Deployment

The site automatically deploys to GitHub Pages on every push to the `main` branch.

> **IMPORTANT**: Before using this deployment method, you must rename the workflow file:
> Rename `.github/workflows/github-pages-deploy.yml.bak` to `.github/workflows/github-pages-deploy.yml`

## Setup

1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push to main branch to trigger deployment

## GitHub Actions Workflow

**File:** `.github/workflows/github-pages-deploy.yml`

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**Process:**
1. **Build Job:**
   - Checkout code
   - Setup Node.js 22
   - Create production environment file
   - Install dependencies with `npm ci`
   - Build project with `npm run build`
   - Configure GitHub Pages
   - Upload build artifacts

2. **Deploy Job:**
   - Deploy artifacts to GitHub Pages
   - Update live site automatically

**Required Secrets:**
- `ENV_FILE` - Production environment variables
