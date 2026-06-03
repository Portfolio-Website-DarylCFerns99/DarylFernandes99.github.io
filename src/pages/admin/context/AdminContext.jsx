import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../../../api/services/userService';
import { getAllSkills, getAllSkillGroups } from '../../../api/services/skillService';
import { getAllProjects } from '../../../api/services/projectService';
import { getAllProjectCategories } from '../../../api/services/projectCategoryService';
import { getAllExperiences } from '../../../api/services/experienceService';
import { getAllReviews } from '../../../api/services/reviewService';
import { toast } from 'react-toastify';

const AdminContext = createContext();

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};

export const AdminProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [skills, setSkills] = useState([]);
    const [skillGroups, setSkillGroups] = useState([]);
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [
                profileData,
                skillsData,
                skillGroupsData,
                projectsData,
                categoriesData,
                experiencesData,
                reviewsData
            ] = await Promise.all([
                getProfile(),
                getAllSkills(),
                getAllSkillGroups(),
                getAllProjects(),
                getAllProjectCategories(),
                getAllExperiences(),
                getAllReviews()
            ]);

            setProfile(profileData);
            setSkills(skillsData);
            setSkillGroups(skillGroupsData);
            setProjects(projectsData);
            setCategories(categoriesData);
            setExperiences(experiencesData);
            setReviews(reviewsData);
            setError(null);
        } catch (err) {
            console.error('Error fetching admin data:', err);
            setError(err);
            toast.error('Failed to load admin panel data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const value = {
        profile,
        setProfile,
        skills,
        setSkills,
        skillGroups,
        setSkillGroups,
        projects,
        setProjects,
        categories,
        setCategories,
        experiences,
        setExperiences,
        reviews,
        setReviews,
        loading,
        setLoading,
        error,
        refetchAll: fetchAllData
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};
