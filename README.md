# Portfolio Website

A modern, responsive portfolio website built with React, Vite, and Material UI.

## Project Structure

```
portfolio-website/
├── public/             # Static assets
├── src/                # Source code
│   ├── api/            # API services
│   ├── assets/         # Images, fonts, etc.
│   ├── authRouter/     # Authentication routing
│   ├── axiosSetup/     # Axios configuration
│   ├── common/         # Common utilities and constants
│   ├── components/     # Reusable UI components
│   ├── config/         # Configuration files
│   ├── pages/          # Page components
│   │   ├── admin/      # Admin pages
│   │   ├── contact/    # Contact page
│   │   ├── errorPage/  # Error page
│   │   ├── home/       # Home page
│   │   ├── loading/    # Loading page
│   │   ├── projectDetail/ # Project detail page
│   │   ├── projects/   # Projects page
│   │   └── reviews/    # Reviews page
│   ├── redux/          # Redux store and slices
│   └── utils/          # Utility functions
├── .gitignore          # Git ignore file
├── eslint.config.js    # ESLint configuration
├── index.html          # HTML entry point
├── LICENSE             # License file
├── package-lock.json   # Lock file for npm
├── package.json        # Project dependencies and scripts
├── README.md           # Project documentation
└── vite.config.js      # Vite configuration
```

## Routes

### Public Routes
- `/` - Home page
- `/projects` - Projects showcase
- `/projects/:id` - Individual project details
- `/reviews` - User/client reviews
- `/contact` - Contact form and information

### Admin Routes
- `/admin` - Admin login
- `/admin/dashboard` - Admin dashboard (protected)

## Features

- **Responsive Design**: Adapts to different screen sizes
- **Dark/Light Mode**: Automatic theme detection with manual toggle
- **Admin Dashboard**: Secure admin area to manage content
- **Redux State Management**: Efficient state handling with Redux
- **Error Handling**: Comprehensive error boundaries
- **Loading States**: Elegant loading indicators
- **Toast Notifications**: User feedback through notifications
- **Authentication**: Protected routes for admin access
- **GitHub Integration**: Fetches real data from GitHub

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and development server
- **React Router** - Navigation and routing
- **Material UI** - Component library
- **Redux Toolkit** - State management
- **Axios** - API requests
- **React Toastify** - Notifications
- **GitHub Pages** - Deployment

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Build for production:
   ```
   npm run build
   ```
5. Deploy to GitHub Pages:
   ```
   npm run deploy
   ```

## Environment Variables

Create a `.env` file in the root directory with:

```
VITE_USER_ID=your_user_id
VITE_API_URL=backend_prefix_with_domain
```

## License

This project is licensed under the terms included in the LICENSE file.
