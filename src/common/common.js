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

const HomePage = lazy(() => import('../pages/home'))
const ProjectsPage = lazy(() => import('../pages/projects'))
const ContactPage = lazy(() => import('../pages/contact'))
const ProjectDetailPage = lazy(() => import('../pages/projectDetail'))

export const ROUTES = [
    {path: '/', title: 'Home', component: HomePage, icon: HomeIcon},
    {path: '/projects', title: 'Projects', component: ProjectsPage, icon: WorkIcon},
    {path: '/projects/:id', title: 'Project Detail', component: ProjectDetailPage, icon: WorkIcon, hide: true},
    {path: '/contact', title: 'Contact', component: ContactPage, icon: MailIcon},
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

// Parse GitHub URL to extract username and repository name
export const parseGitHubUrl = (githubUrl) => {
  try {
    const url = new URL(githubUrl);
    
    // Check if it's a GitHub URL
    if (!url.hostname.includes('github.com')) {
      throw new Error('Not a valid GitHub URL');
    }
    
    // Get the path segments (removing empty segments)
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    
    // GitHub URLs follow the pattern: github.com/username/repository
    if (pathSegments.length >= 2) {
      return {
        username: pathSegments[0],
        repo: pathSegments[1]
      };
    }
    
    throw new Error('Could not extract username and repository from URL');
  } catch (error) {
    console.error('Error parsing GitHub URL:', error);
    return null;
  }
};

// Fetch GitHub data from GitHub API
export const fetchGitHubData = async (url) => {
  const headers = url.includes("raw.githubusercontent.com") ? {} : {
    'Authorization': `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28'
  }
  const response = await fetch(url, { headers: headers });
  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}`);
  }
  return response;
}

// Fetch repository data from GitHub API
export const fetchGitHubRepoData = async (githubUrl) => {
  const repoInfo = parseGitHubUrl(githubUrl);
  
  if (!repoInfo) {
    return null;
  }
  
  const apiUrl = `https://api.github.com/repos/${repoInfo.username}/${repoInfo.repo}`;
  
  try {
    const response = await fetchGitHubData(apiUrl)
    
    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Filter out all fields containing "_url" in their key names
    const filteredData = data
    
    return filteredData;
  } catch (error) {
    console.error('Error fetching GitHub repository data:', error);
    return null;
  }
};

// Fetch languages data from GitHub API
export const fetchGitHubLanguagesData = async (languageUrl) => {
  
  if (!languageUrl) {
    return null;
  }

  try {
    const response = await fetchGitHubData(languageUrl);
    
    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const data = await response.json()
    
    return Object.keys(data).join(', ') || 'N/A';
  } catch (error) {
    console.error('Error fetching GitHub repository data:', error);
    return null;
  }
}

// Fetch repository README.md data from GitHub API
export const fetchGitHubReadmeData = async (githubUrl) => {
  const repoInfo = parseGitHubUrl(githubUrl);
  
  if (!repoInfo) {
    return null;
  }
  
  const apiUrl = `https://raw.githubusercontent.com/${repoInfo.username}/${repoInfo.repo}/refs/heads/main/README.md`;
  const baseRawUrl = `https://raw.githubusercontent.com/${repoInfo.username}/${repoInfo.repo}/main/`;
  
  try {
    const response = await fetchGitHubData(apiUrl);
    
    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }
    
    const readmeText = await response.text();
    
    // Convert relative image paths to absolute URLs
    // Match markdown image syntax: ![alt text](image-path)
    const convertedReadme = readmeText.replace(
      /!\[(.*?)\]\((?!http|https)(.*?)\)/g,
      (match, altText, imagePath) => {
        // Remove leading ./ or / if present
        const cleanPath = imagePath.replace(/^\.\/|^\//, '');
        return `![${altText}](${baseRawUrl}${cleanPath})`;
      }
    );
    
    return convertedReadme;
  } catch (error) {
    console.error('Error fetching GitHub repository data:', error);
    return null;
  }
};

// Utility function to fetch GitHub data for all projects
export const fetchAllGitHubProjectsData = async (projects, dispatch, updateProjectData, setGithubDataLoading) => {
  // Set loading to true
  dispatch(setGithubDataLoading(true));
  
  try {
    // Go through all projects
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      
      // Only process GitHub projects (those with type 'github' and a URL)
      if (project.type === 'github' && project.url) {
        try {
          // Fetch GitHub data
          const githubData = await fetchGitHubRepoData(project.url);
          githubData.readme_file = await fetchGitHubReadmeData(project.url);
          githubData.languages = await fetchGitHubLanguagesData(githubData.languages_url);

          if (githubData) {
            // Update Redux store with the GitHub data
            dispatch(updateProjectData({
              projectIndex: i,
              githubData
            }));
          }
        } catch (error) {
          console.error(`Error fetching data for project ${project.title}:`, error);
        }
      }
    }
  } finally {
    // Set loading to false when done (even if there were errors)
    dispatch(setGithubDataLoading(false));
  }
};

export const getTopSkillsByProficiency = (data, count = 3) => {
  const allSkills = data.flatMap(category => category.skills);
  const sortedSkills = allSkills.sort((a, b) => b.proficiency - a.proficiency);
  
  return sortedSkills.slice(0, count);
}
