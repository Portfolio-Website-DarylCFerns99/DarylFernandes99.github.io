import { lazy } from 'react'
import LinkIcon from '@mui/icons-material/Link'
import ArticleIcon from '@mui/icons-material/Article'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import TwitterIcon from '@mui/icons-material/Twitter'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import HomeIcon from '@mui/icons-material/Home'
import WorkIcon from '@mui/icons-material/Work'
import MailIcon from '@mui/icons-material/Mail'
import RateReviewIcon from '@mui/icons-material/RateReview'

const HomePage = lazy(() => import('../pages/home'))
const ProjectsPage = lazy(() => import('../pages/projects'))
const ContactPage = lazy(() => import('../pages/contact'))
const ProjectDetailPage = lazy(() => import('../pages/projectDetail'))
const ReviewsPage = lazy(() => import('../pages/reviews'))

export const ROUTES = [
  { path: '/', title: 'Home', component: HomePage, icon: HomeIcon },
  { path: '/projects', title: 'Projects', component: ProjectsPage, icon: WorkIcon },
  { path: '/projects/:name', title: 'Project Detail', component: ProjectDetailPage, icon: WorkIcon, hide: true },
  // {path: '/reviews', title: 'Reviews', component: ReviewsPage, icon: RateReviewIcon},
  { path: '/contact', title: 'Contact', component: ContactPage, icon: MailIcon },
]

export const typeMapping = {
  linkedin: {
    name: 'LinkedIn',
    icon: LinkedInIcon,
    inputType: 'link',
    tooltip: 'LinkedIn'
  },
  github: {
    name: 'GitHub',
    icon: GitHubIcon,
    inputType: 'link',
    tooltip: 'GitHub'
  },
  twitter: {
    name: 'Twitter',
    icon: TwitterIcon,
    inputType: 'link',
    tooltip: 'Twitter'
  },
  instagram: {
    name: 'Instagram',
    icon: InstagramIcon,
    inputType: 'link',
    tooltip: 'Instagram'
  },
  facebook: {
    name: 'Facebook',
    icon: FacebookIcon,
    inputType: 'link',
    tooltip: 'Facebook'
  },
  link: {
    name: 'Link',
    icon: LinkIcon,
    inputType: 'link',
    tooltip: 'Link'
  },
  document: {
    name: 'Document',
    icon: ArticleIcon,
    inputType: 'file',
    tooltip: 'Document'
  }
}

export const getTypeFromName = (name) => {
  for (const type in typeMapping) {
    if (typeMapping[type].name === name) {
      return type
    }
  }
  return null
}

export const getTypeName = (type) => {
  if (type in typeMapping) {
    return typeMapping[type].name
  }
  return null
}

export const getSocialIcon = (platform) => {
  if (platform in typeMapping) {
    return typeMapping[platform].icon
  }
  return null
}

// Convert file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Generate SVG array from loading folder
export const generateSvgArray = (loadingSvgs) => {
  return Object.entries(loadingSvgs).map(([path, module]) => {
    // Extract the name from the path
    const name = path.split('/').pop().replace('.svg', '');

    // Create a display name from the filename (convert kebab-case to Title Case)
    const displayName = name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      path,
      url: module.default,
      name,
      displayName
    };
  });
};

export const getTopSkillsByProficiency = (data, count = 3) => {
  const allSkills = data.flatMap(category => category.skills);
  const sortedSkills = allSkills.sort((a, b) => b.proficiency - a.proficiency);

  return sortedSkills.slice(0, count);
}
