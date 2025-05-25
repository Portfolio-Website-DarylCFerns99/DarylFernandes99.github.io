import React from 'react';
import { Box, Typography, Chip, useTheme } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

const CompactContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
}));

const SkillGroupContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5),
  },
}));

const GroupTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  color: theme.palette.text.primary,
  fontSize: '1.1rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
    marginBottom: theme.spacing(1),
  },
}));

const SkillsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(0.5),
  },
}));

const SkillChip = styled(Chip, {
  shouldForwardProp: (prop) => !['proficiency'].includes(prop),
})(({ theme, proficiency }) => {
  // Color intensity based on proficiency level
  const getColor = () => {
    switch(proficiency) {
      case 5: return theme.palette.success.main;
      case 4: return theme.palette.info.main;
      case 3: return theme.palette.warning.main;
      case 2: return theme.palette.secondary.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getIntensity = () => {
    return 0.6 + (proficiency * 0.08); // 0.68 to 1.0 opacity
  };

  return {
    backgroundColor: alpha(getColor(), 0.15),
    color: getColor(),
    border: `1px solid ${alpha(getColor(), 0.3)}`,
    fontWeight: 500,
    fontSize: '0.8rem',
    height: '28px',
    transition: 'all 0.2s ease',
    opacity: getIntensity(),
    
    '&:hover': {
      backgroundColor: alpha(getColor(), 0.25),
      transform: 'translateY(-1px)',
      boxShadow: `0 2px 8px ${alpha(getColor(), 0.3)}`,
    },
    
    '& .MuiChip-label': {
      padding: '0 8px',
      [theme.breakpoints.down('sm')]: {
        padding: '0 6px',
        fontSize: '0.75rem',
      },
    },

    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem',
      height: '26px',
    },
  };
});

const SkillsStats = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

const StatItem = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  lineHeight: 1,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.25),
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.7rem',
    marginTop: 0,
  },
}));

const CompactSkills = ({ skillGroups, filterLevel }) => {
  const theme = useTheme();

  if (!skillGroups || skillGroups.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">No skills match your current search and filter criteria</Typography>
      </Box>
    );
  }

  // The skillGroups are already filtered by search term from parent,
  // we just need to apply proficiency level filtering
  const filteredGroups = skillGroups.map(group => {
    const filteredSkills = group.skills.filter(skill => {
      if (filterLevel === 'all') return true;
      if (filterLevel === 'basic') return skill.proficiency === 1;
      if (filterLevel === 'proficient') return skill.proficiency === 2 || skill.proficiency === 3;
      if (filterLevel === 'expert') return skill.proficiency >= 4;
      return true;
    });
    
    return {
      ...group,
      skills: filteredSkills
    };
  }).filter(group => group.skills.length > 0);

  // Calculate statistics
  const allSkills = filteredGroups.flatMap(group => group.skills);
  const totalSkills = allSkills.length;
  const totalGroups = filteredGroups.length;
  const expertSkills = allSkills.filter(skill => skill.proficiency >= 4).length;
  const avgProficiency = totalSkills > 0 
    ? (allSkills.reduce((sum, skill) => sum + skill.proficiency, 0) / totalSkills).toFixed(1)
    : 0;

  return (
    <CompactContainer>
      {/* Statistics */}
      {/* <SkillsStats>
        <StatItem>
          <StatNumber>{totalSkills}</StatNumber>
          <StatLabel>Total Skills</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>{totalGroups}</StatNumber>
          <StatLabel>Categories</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>{expertSkills}</StatNumber>
          <StatLabel>Expert Level</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>{avgProficiency}</StatNumber>
          <StatLabel>Avg. Level</StatLabel>
        </StatItem>
      </SkillsStats> */}

      {/* Skill Groups */}
      {filteredGroups.map((group, index) => (
        <SkillGroupContainer key={group.id || index}>
          <GroupTitle>
            {group.name} ({group.skills.length})
          </GroupTitle>
          <SkillsContainer>
            {group.skills.map((skill, skillIndex) => (
              <SkillChip
                key={`${skill.name}-${skillIndex}`}
                label={skill.name}
                proficiency={skill.proficiency}
                size="small"
                variant="outlined"
              />
            ))}
          </SkillsContainer>
        </SkillGroupContainer>
      ))}
    </CompactContainer>
  );
};

export default CompactSkills; 