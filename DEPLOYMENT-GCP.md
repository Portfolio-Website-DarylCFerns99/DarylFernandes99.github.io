# Google Cloud Platform Deployment

Deploy to Google Cloud Storage with CDN for production environments.

> **IMPORTANT**: Before using this deployment method, you must rename the workflow file:
> Rename `.github/workflows/gcp-deploy.yml.bak` to `.github/workflows/gcp-deploy.yml`

## Setup

1. **Complete infrastructure setup** from the [infrastructure repository](https://github.com/Portfolio-Website-DarylCFerns99/portfolio-website-infrastructure)
2. The infrastructure setup will create:
   - GCP project and storage bucket
   - Service account credentials  
   - All required cloud resources
3. Add the provided secrets to your GitHub repository (see infrastructure outputs)

## GitHub Actions Workflow

**File:** `.github/workflows/gcp-deploy.yml`

**Triggers:**
- Push to `main` branch  
- Manual workflow dispatch

**Process:**
1. **Setup:**
   - Checkout code
   - Setup Node.js 22 with npm caching
   - Create production environment file

2. **Build:**
   - Install dependencies
   - Run build process
   - Generate production assets

3. **Deploy:**
   - Authenticate with Google Cloud
   - Upload files to Cloud Storage
   - Set appropriate cache headers
   - Configure CDN settings

**Required Secrets:**
- `ENV_FILE` - Production environment variables
- `GCP_SA_KEY` - Google Cloud service account key
- `GCP_PROJECT_ID` - Google Cloud project ID (from infrastructure setup)
- `FRONTEND_BUCKET_NAME` - Storage bucket name (from infrastructure setup)

> 💡 **Tip**: All these values are provided as outputs from the infrastructure repository setup.

## Setting Up GitHub Secrets

1. Go to repository Settings → Secrets and variables → Actions
2. Add the following secrets:

```
ENV_FILE=VITE_USER_ID=your_id
VITE_API_URL=your_api_url

GCP_SA_KEY={"type": "service_account", ...}
GCP_PROJECT_ID=your-gcp-project-id            # From infrastructure outputs  
FRONTEND_BUCKET_NAME=your-bucket-name          # From infrastructure outputs
```

> 📖 **Reference**: See the infrastructure repository's README for detailed secret configuration instructions.
