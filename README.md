# Portfolio Website

A modern, responsive portfolio website built with React 19, Vite, and Material UI. Features dark/light mode, admin dashboard, and integration with GitHub APIs for dynamic content.

![Portfolio Website](https://img.shields.io/badge/React-19.0.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.1.0-green)
![Material UI](https://img.shields.io/badge/Material--UI-6.4.3-blue)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple)

> 🚨 **IMPORTANT**: This frontend requires infrastructure setup first. Please visit the [Infrastructure Repository](https://github.com/Portfolio-Website-DarylCFerns99/portfolio-website-infrastructure) to set up the backend API, database, and cloud resources before running this frontend application.

## ✨ Features

- **🎨 Modern Design**: Clean, responsive design with Material UI components
- **🌙 Dark/Light Mode**: Automatic theme detection with manual toggle
- **👤 Admin Dashboard**: Secure admin area to manage content
- **⚡ Fast Performance**: Built with Vite for optimal performance
- **📱 Mobile Responsive**: Adapts beautifully to all screen sizes
- **🔄 State Management**: Efficient state handling with Redux Toolkit
- **🛡️ Error Handling**: Comprehensive error boundaries and fallbacks
- **🔔 Toast Notifications**: User-friendly feedback system  
- **🔐 Authentication**: Protected routes for admin access
- **📊 Analytics Ready**: Easy integration with analytics platforms

## 🏗️ Project Structure

```
portfolio-website/
├── public/                 # Static assets and favicon
├── src/                    # Source code
│   ├── api/               # API services and endpoints
│   ├── assets/            # Images, fonts, and static resources
│   ├── authRouter/        # Authentication routing logic
│   ├── axiosSetup/        # Axios configuration and interceptors
│   ├── common/            # Common utilities and constants
│   ├── components/        # Reusable UI components
│   ├── config/            # Configuration files
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin dashboard pages
│   │   ├── contact/       # Contact form and information
│   │   ├── errorPage/     # 404 and error pages
│   │   ├── home/          # Landing page
│   │   ├── loading/       # Loading states
│   │   ├── projectDetail/ # Individual project showcase
│   │   ├── projects/      # Projects gallery
│   │   └── reviews/       # Client reviews and testimonials
│   ├── redux/             # Redux store, slices, and middleware
│   └── utils/             # Helper functions and utilities
├── .github/               # GitHub Actions workflows
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore patterns
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML entry point
├── package.json          # Dependencies and scripts
├── README.md             # Project documentation
├── vercel.json           # Vercel deployment configuration
└── vite.config.js        # Vite configuration
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Vite 6.1** - Next-generation frontend tooling
- **Material UI 6.4** - React component library
- **React Router 7.4** - Declarative routing
- **Redux Toolkit 2.5** - Predictable state container

### Development & Build Tools
- **ESLint 9.19** - Code linting and formatting
- **Vite** - Build tool and development server
- **gh-pages** - GitHub Pages deployment
- **GCP** - Google Cloud Platform for hosting

### APIs & Services
- **Axios** - HTTP client for API requests
- **React Toastify** - Toast notifications

## 🌐 Routes

### Public Routes
- `/` - Home page with introduction and highlights
- `/projects` - Portfolio showcase with filtering
- `/projects/:id` - Detailed project view with GitHub integration  
- `/reviews` - Client testimonials and reviews
- `/contact` - Contact form with validation

### Protected Admin Routes
- `/admin` - Admin authentication
- `/admin/dashboard` - Content management dashboard

## 🖥️ Backend Setup

### 🔗 Backend Repository

**For standalone backend setup or detailed backend customization:**

👉 **[Portfolio Website Backend](https://github.com/Portfolio-Website-DarylCFerns99/portfolio-website-backend)**

This repository contains:
- **Python3/Fast API** - RESTful API with authentication
- **Database Models** - User management and data schemas
- **Authentication System** - JWT-based auth with role management
- **File Upload Handling** - Image and document management
- **Email Services** - Contact form and notification system
- **API Documentation** - Swagger/OpenAPI specifications

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- **Infrastructure setup completed** (see above section)

### Installation

1. **Clone the repository**
   ```bash
   git clone your-repo-url
   cd portfolio-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   VITE_USER_ID=your_database_user_id
   VITE_API_URL=your_backend_api_url
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

### Build for Production

```bash
# Build the project
npm run build

# Preview the production build locally
npm run preview
```

## 🔧 Environment Variables

Create environment files for different stages:

### `.env.development`
```env
VITE_USER_ID=your_user_id
VITE_API_URL=http://localhost:8000/api
```

### `.env.production`
```env
VITE_USER_ID=your_user_id  
VITE_API_URL=https://your-production-api.com/api
```

## 🚀 Deployment

> **📋 Prerequisites**: Ensure you have completed the [infrastructure setup](#-infrastructure-setup) before deploying the frontend.

This project supports multiple deployment strategies:

### GitHub Pages (Primary)
The site automatically deploys to GitHub Pages on every push to the `main` branch.

**Setup:**
1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push to main branch to trigger deployment

### Google Cloud Platform
Deploy to Google Cloud Storage with CDN for production environments.

**Setup:**
1. **Complete infrastructure setup** from the [infrastructure repository](https://github.com/Portfolio-Website-DarylCFerns99/portfolio-website-infrastructure)
2. The infrastructure setup will create:
   - GCP project and storage bucket
   - Service account credentials  
   - All required cloud resources
3. Add the provided secrets to your GitHub repository (see infrastructure outputs)

## 🔄 GitHub Actions Workflows

### 1. GitHub Pages Deployment

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

### 2. Google Cloud Platform Deployment

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

### Setting Up GitHub Secrets

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

## 🔧 Development Workflow

### Code Style
- ESLint configuration with React best practices
- Consistent code formatting
- Pre-commit hooks for code quality

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production  
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Deployment
npm run deploy       # Deploy to GitHub Pages
npm run predeploy    # Pre-deployment build
```

### Git Workflow
1. Create feature branch from `main`
2. Make changes and commit with descriptive messages
3. Push branch and create pull request
4. Merge after review and CI passes
5. Automatic deployment to staging/production

## 📦 Dependencies

### Production Dependencies
- React ecosystem (React, React-DOM, React-Router)
- Material UI components and styling
- Redux Toolkit for state management
- Axios for API communication
- Additional UI libraries (Swiper, React-Markdown)

### Development Dependencies  
- Vite build tooling
- ESLint for code quality
- Type definitions for better development experience

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all GitHub Actions pass

## 🐛 Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version (requires 18+)
- Clear node_modules and reinstall dependencies
- Verify environment variables are set correctly

**Deployment Issues:**
- Ensure GitHub Pages is enabled in repository settings
- Check GitHub Actions logs for detailed error messages
- Verify all required secrets are configured
- Check GCP permissions and service account setup
- Ensure bucket name and project ID are correct

**Development Server Issues:**
- Check if port 3000 is available
- Clear browser cache and try again
- Restart development server

## 📄 License

This project is licensed under the terms included in the [LICENSE](LICENSE) file.

## 🙏 Acknowledgments

- Material UI team for the excellent component library
- Vite team for the amazing build tool
- React team for the revolutionary framework

---

⭐ **Star this repository if you found it helpful!**
