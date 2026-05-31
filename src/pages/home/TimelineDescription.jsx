import React from 'react';
import { Box, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '@mui/material/styles';

const TimelineDescription = ({ description }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                mt: 1.5,
                maxHeight: '240px',
                overflowY: 'auto',
                pr: 1.5,
                // Sleek custom scrollbar styling
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
                    borderRadius: '4px',
                    '&:hover': {
                        background: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.2)',
                    }
                }
            }}
        >
            <ReactMarkdown
                components={{
                    p: ({ node, ...props }) => (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1, lineHeight: 1.6, textAlign: 'left' }}
                            {...props}
                        />
                    ),
                    li: ({ node, ...props }) => (
                        <Typography
                            component="li"
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5, lineHeight: 1.6, textAlign: 'left' }}
                            {...props}
                        />
                    )
                }}
            >
                {description?.replace(/\\n/g, '\n').replace(/\n/g, '  \n')}
            </ReactMarkdown>
        </Box>
    );
};

export default TimelineDescription;
