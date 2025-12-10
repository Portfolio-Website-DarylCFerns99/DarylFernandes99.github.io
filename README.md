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
- **🤖 AI Chatbot**: Interactive portfolio assistant powered by Gemini
- **📊 Analytics Ready**: Easy integration with analytics platforms

## 🏗️ Project Structure

```
portfolio-website/
├── .github/                 # GitHub Actions workflows
workflows
├── public/                 # Static assets and favicon
├── src/                    # Source code
│   ├── api/               # API services and endpoints
│   ├── assets/            # Images, fonts, and static resources
│   ├── authRouter/        # Authentication routing logic
│   ├── axiosSetup/        # Axios configuration and interceptors
│   ├── common/            # Common utilities and constants
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom hooks
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
├── env.example          # Environment variables template
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
- **React Toastify** - Toast notifications

### Development & Build Tools
- **ESLint 9.19** - Code linting and formatting
- **Vite** - Build tool and development server

### Deployment Tools (Optional)
- **Vercel** - Deployment platform
- **GitHub Pages** - GitHub Pages deployment
- **Google Cloud Platform** - Google Cloud Platform for hosting

### APIs & Services
- **Axios** - HTTP client for API requests

## 🌐 Routes

### Public Routes
- `/` - Home page with introduction and highlights
- `/projects` - Portfolio showcase with filtering
- `/projects/:name` - Detailed project view with GitHub integration  
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
- **RAG Chatbot** - AI chatbot integration
- **API Documentation** - Swagger/OpenAPI specifications

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

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
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration

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
VITE_WS_URL=ws://localhost:8000/ws
```

Note: For WebSocket connections, on Production replace `ws://*` with `wss://*`.

### `.env.production`
```env
VITE_USER_ID=your_user_id  
VITE_API_URL=https://your-production-api.com/api
VITE_WS_URL=wss://your-production-api.com/ws
```

## 🚀 Deployment

> **📋 Prerequisites**: Ensure you have completed the [infrastructure setup](#-infrastructure-setup) before deploying the frontend.

### Vercel Deployment (Recommended)

1. **Login to Vercel**
   - Go to [Vercel](https://vercel.com) and log in with your GitHub account.

2. **Import Project**
   - Click "Add New..." -> "Project".
   - Select your `portfolio-website` repository from the list.

3. **Configure Project**
   - Vercel will automatically detect `Vite` as the framework.
   - **Environment Variables**: Add your production environment variables here (e.g., `VITE_API_URL`, `VITE_USER_ID`).

4. **Deploy**
   - Click "Deploy".
   - Your site will be live in minutes!

### Alternative Deployment Methods

This project also supports deployment to Google Cloud Platform and GitHub Pages. Please refer to the detailed guides below:

-   **[Google Cloud Platform Deployment](DEPLOYMENT-GCP.md)**
-   **[GitHub Pages Deployment](DEPLOYMENT-GITHUB-PAGES.md)**

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
