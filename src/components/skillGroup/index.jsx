import { Box, Typography, Paper, LinearProgress, Chip, Grid } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import PropTypes from 'prop-types';

// Styled components
const SkillGroupContainer = styled(Paper)(({ theme }) => ({
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.15)',
  borderRadius: theme.shape.borderRadius,
  height: '100%',
}));

const SkillGroupHeader = styled(Box)(({ theme, index }) => {
  const colorMap = [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.tertiary.main];
  const bgcolor = colorMap[index % 3];
  
  return {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2),
    backgroundColor: bgcolor || theme.palette.primary.main,
    color: '#fff',
    fontWeight: 600,
    fontSize: '1.1rem',
  }
});

const SkillsList = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
}));

const SkillItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: theme.spacing(2.5),
  width: '100%',
  '&:last-child': {
    marginBottom: 0,
  }
}));

const SkillNameWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.75),
}));

const SkillName = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: '0.95rem',
  flex: 1,
}));

const SkillLevelChip = styled(Chip)(({ theme, level, proficiency }) => {
  // Use the same color logic as CompactSkills component
  const getColor = () => {
    switch(proficiency) {
      case 5: return theme.palette.success.main;     // Green
      case 4: return theme.palette.info.main;       // Blue  
      case 3: return theme.palette.warning.main;    // Orange
      case 2: return theme.palette.secondary.main;  // Secondary
      default: return theme.palette.text.secondary; // Gray (Level 1)
    }
  };
  
  return {
    fontSize: '0.7rem',
    height: 22,
    borderRadius: 12,
    backgroundColor: alpha(getColor(), 0.15),
    color: getColor(),
    fontWeight: 500,
    '& .MuiChip-label': {
      padding: '0 8px',
    }
  };
});

const StyledLinearProgress = styled(LinearProgress)(({ theme, level, proficiency }) => {
  // Use the same color logic as CompactSkills component
  const getColor = () => {
    switch(proficiency) {
      case 5: return theme.palette.success.main;     // Green
      case 4: return theme.palette.info.main;       // Blue  
      case 3: return theme.palette.warning.main;    // Orange
      case 2: return theme.palette.secondary.main;  // Secondary
      default: return theme.palette.text.secondary; // Gray (Level 1)
    }
  };
  
  return {
    height: 8,
    borderRadius: 4,
    backgroundColor: alpha(theme.palette.divider, 0.2),
    '& .MuiLinearProgress-bar': {
      backgroundColor: getColor(),
      borderRadius: 4,
    }
  };
});

// Convert proficiency level (1-5) to text description and progress value
const getSkillLevelInfo = (proficiency) => {
  const levelMap = {
    1: { label: 'basic', value: 30 },
    2: { label: 'intermediate', value: 50 },
    3: { label: 'intermediate', value: 70 },
    4: { label: 'advanced', value: 85 },
    5: { label: 'expert', value: 100 }
  };
  
  return levelMap[proficiency] || { label: 'basic', value: 20 };
};

// SkillGroup component
const SkillGroup = ({ index, name, skills, filterLevel }) => {
  
  // Filter skills by level if filterLevel is provided
  const filteredSkills = filterLevel ? 
    skills.filter(skill => {
      return (filterLevel === 'basic' && skill.proficiency === 1) || 
             (filterLevel === 'proficient' && (skill.proficiency === 2 || skill.proficiency === 3)) || 
             (filterLevel === 'expert' && skill.proficiency >= 4) || 
             (filterLevel === 'all');
    }) : skills;
  
  return (
    <SkillGroupContainer>
      <SkillGroupHeader index={index}>
        <Typography variant="h6">{name}</Typography>
      </SkillGroupHeader>
      
      <SkillsList>
        <Grid container spacing={3}>
          {
            filteredSkills.length === 0 && (
              <Grid item xs={12} sm={6} md={6} key={index}>
                No Skills found
              </Grid>
            )
          }
          {filteredSkills.length !== 0 && filteredSkills.map((skill, index) => {
            const { label, value } = getSkillLevelInfo(skill.proficiency);
            
            return (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <SkillItem>
                  <SkillNameWrapper>
                    <SkillName>{skill.name}</SkillName>
                    <SkillLevelChip 
                      size="small" 
                      label={label} 
                      level={label}
                      proficiency={skill.proficiency}
                    />
                  </SkillNameWrapper>
                  <StyledLinearProgress 
                    variant="determinate" 
                    value={value} 
                    level={label}
                    proficiency={skill.proficiency}
                  />
                </SkillItem>
              </Grid>
            );
          })}
        </Grid>
      </SkillsList>
    </SkillGroupContainer>
  );
};

SkillGroup.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      proficiency: PropTypes.number,
      icon: PropTypes.string,
      color: PropTypes.string
    })
  ).isRequired,
  filterLevel: PropTypes.oneOf(['all', 'basic', 'proficient', 'expert'])
};

SkillGroup.defaultProps = {
  filterLevel: 'all'
};

export default SkillGroup;
