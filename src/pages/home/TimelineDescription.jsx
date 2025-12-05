import React, { useState } from 'react';
import { Box, Button, Typography, Collapse } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTheme } from '@mui/material/styles';

const TimelineDescription = ({ description }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);

    // If description is short, just show it without collapse logic
    // Heuristic: < 150 chars
    const isShort = !description || description.length < 150;

    if (isShort) {
        return (
            <Box sx={{ mt: 1 }}>
                <ReactMarkdown
                    components={{
                        p: ({ node, ...props }) => (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                                {...props}
                            />
                        ),
                        li: ({ node, ...props }) => (
                            <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                {...props}
                            />
                        )
                    }}
                >
                    {description?.replace(/\\n/g, '\n').replace(/\n/g, '  \n')}
                </ReactMarkdown>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 1 }}>
            <Collapse in={expanded} collapsedSize={72} timeout="auto">
                <ReactMarkdown
                    components={{
                        p: ({ node, ...props }) => (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 0.5 }}
                                {...props}
                            />
                        ),
                        li: ({ node, ...props }) => (
                            <Typography
                                component="li"
                                variant="body2"
                                color="text.secondary"
                                {...props}
                            />
                        )
                    }}
                >
                    {description?.replace(/\\n/g, '\n').replace(/\n/g, '  \n')}
                </ReactMarkdown>
            </Collapse>

            <Button
                size="small"
                onClick={() => setExpanded(!expanded)}
                endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{
                    mt: 1,
                    textTransform: 'none',
                    p: 0,
                    minWidth: 'auto',
                    color: theme.palette.primary.main,
                    '&:hover': {
                        background: 'transparent',
                        textDecoration: 'underline'
                    }
                }}
            >
                {expanded ? "Show Less" : "Read More"}
            </Button>
        </Box>
    );
};

export default TimelineDescription;
