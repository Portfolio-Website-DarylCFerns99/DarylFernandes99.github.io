import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import fallbackUserData from '../../common/userData.json';

/**
 * Custom SEO Component for React 19
 * Updated to use userData.json as fallback
 */
export const DynamicSEO = ({ 
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noIndex = false,
  children
}) => {
  // Get user data from Redux store
  const userData = useSelector(state => state.user);
  
  // Use userData from Redux or fallback to userData.json
  const data = userData || fallbackUserData;
  
  // Build full name from separate fields
  const fullName = data ? `${data.name} ${data.surname}` : 'Portfolio';
  
  // Build dynamic values with fallbacks from userData.json
  const siteTitle = `${fullName} | ${data?.title || 'Portfolio'}`;
  const pageTitle = title 
    ? `${title} | ${fullName}` 
    : siteTitle;
  
  // Use shortdescription from about object
  const metaDescription = description || 
    data?.about?.shortdescription || 
    'Portfolio website showcasing projects and experience.';
  
  // Build keywords from name, title, and featured skills
  const featuredSkillNames = data?.featuredSkills?.map(skill => skill.name).join(', ') || '';
  const metaKeywords = keywords || 
    `${fullName}, ${data?.title || ''}, ${featuredSkillNames}`.trim();
  
  const metaImage = image || 
    data?.avatar || 
    'https://daryl-fernandes.com/og-image.jpg';
  
  const metaUrl = url || window.location.href;
  
  useEffect(() => {
    // Update document title
    const prevTitle = document.title;
    document.title = pageTitle;
    
    // Helper function to update or create meta tag
    const updateMetaTag = (property, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
      return element;
    };
    
    // Update meta tags
    const tags = [
      updateMetaTag('description', metaDescription),
      updateMetaTag('keywords', metaKeywords),
      updateMetaTag('author', fullName),
      
      // Open Graph tags
      updateMetaTag('og:title', `${fullName} - ${data?.title || 'Portfolio'}`, true),
      updateMetaTag('og:description', metaDescription, true),
      updateMetaTag('og:type', type, true),
      updateMetaTag('og:url', metaUrl, true),
      updateMetaTag('og:image', metaImage, true),
      
      // Twitter Card tags
      updateMetaTag('twitter:card', 'summary_large_image', true),
      updateMetaTag('twitter:title', `${fullName} - ${data?.title || 'Portfolio'}`, true),
      updateMetaTag('twitter:description', metaDescription, true),
      updateMetaTag('twitter:image', metaImage, true),
    ];
    
    // Handle canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', metaUrl.split('?')[0]);
    
    // Handle noIndex
    if (noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    }
    
    // Cleanup function
    return () => {
      document.title = prevTitle;
      // Note: We don't remove meta tags as they might be used by other components
    };
  }, [pageTitle, metaDescription, metaKeywords, metaImage, metaUrl, type, noIndex, data, fullName]);
  
  return null;
};

/**
 * Structured Data Component
 */
export const StructuredData = ({ data }) => {
  useEffect(() => {
    if (!data) return;
    
    // Create script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
    
    // Cleanup
    return () => {
      document.head.removeChild(script);
    };
  }, [data]);
  
  return null;
};

/**
 * Person Schema Generator Hook
 * Updated to use userData.json as fallback
 */
export const usePersonSchema = () => {
  const userData = useSelector(state => state.user?.userData);
  const data = userData || fallbackUserData;
  
  if (!data) return null;
  
  const fullName = `${data.name} ${data.surname}`;
  
  // Extract social links
  const socialLinks = data.socialLinks || [];
  const linkedinUrl = socialLinks.find(link => link.platform === 'linkedin')?.url;
  const githubUrl = socialLinks.find(link => link.platform === 'github')?.url;
  
  // Extract education data
  const education = data.timelineData
    ?.filter(item => item.type === 'education')
    ?.map(edu => ({
      "@type": "EducationalOrganization",
      "name": edu.institution
    })) || [];
  
  // Extract all skills from skill groups
  const allSkills = data.skillGroups
    ?.flatMap(group => group.skills.map(skill => skill.name)) || [];
  
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": fullName,
    "givenName": data.name,
    "familyName": data.surname,
    "jobTitle": data.title || "Software Engineer",
    "email": data.email,
    "telephone": data.phone,
    "url": "https://daryl-fernandes.com/",
    "image": data.avatar,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": data.location
    },
    "sameAs": [
      linkedinUrl,
      githubUrl
    ].filter(Boolean),
    "alumniOf": education,
    "knowsAbout": allSkills,
    "description": data.about?.description || data.about?.shortdescription
  };
};

/**
 * Project Schema Generator Hook
 * Updated to use userData.json as fallback
 */
export const useProjectSchema = (project) => {
  const userData = useSelector(state => state.user?.userData);
  const data = userData || fallbackUserData;
  
  if (!project) return null;
  
  const fullName = data ? `${data.name} ${data.surname}` : "Portfolio Owner";
  
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": project.title,
    "description": project.description,
    "author": {
      "@type": "Person",
      "name": fullName
    },
    "dateCreated": project.created_at,
    "programmingLanguage": project.tags?.join(', ') || project.additional_data?.language,
    "applicationCategory": "WebApplication",
    "url": project.url || `https://daryl-fernandes.com/projects/${project.id}`,
    "image": project.image,
    "keywords": project.tags?.join(', '),
    "codeRepository": project.url
  };
};

/**
 * Breadcrumb Schema Generator Hook
 */
export const useBreadcrumbSchema = (items) => {
  if (!items || items.length === 0) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://daryl-fernandes.com${item.path}`
    }))
  };
};

/**
 * Experience Schema Generator Hook
 * For timeline data (work experience)
 * Updated to use userData.json as fallback
 */
export const useExperienceSchema = () => {
  const userData = useSelector(state => state.user?.userData);
  const data = userData || fallbackUserData;
  
  if (!data?.timelineData) return null;
  
  const experiences = data.timelineData
    .filter(item => item.type === 'experience')
    .map(exp => ({
      "@type": "OrganizationRole",
      "startDate": exp.year,
      "roleName": exp.title,
      "worksFor": {
        "@type": "Organization",
        "name": exp.company
      },
      "description": exp.description
    }));
  
  return experiences.length > 0 ? experiences : null;
};

/**
 * SEO Provider Component (No need for external library)
 * This is just a placeholder for consistency with helmet pattern
 */
export const SEOProvider = ({ children }) => {
  return children;
};
