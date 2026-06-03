import { styled, alpha } from '@mui/material/styles';
import { Box, Paper, IconButton, TextField, Fab } from '@mui/material';

export const ChatContainer = styled(Box)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: theme.spacing(2),
}));

export const ChatWindowContainer = styled(Paper)(({ theme }) => ({
    width: '380px',
    height: '550px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: '24px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
    backgroundColor: alpha(theme.palette.background.paper, 0.85),
    backdropFilter: 'blur(16px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
    [theme.breakpoints.down('sm')]: {
        width: '90vw',
        height: '70vh',
        right: theme.spacing(2),
        bottom: theme.spacing(10),
    },
}));

export const ChatHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2.5, 2.5, 2.5, 3),
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${alpha('#ffffff', 0.1)}`,
}));

export const MessagesArea = styled(Box)(({ theme }) => ({
    flex: 1,
    padding: theme.spacing(3),
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    backgroundColor: alpha(theme.palette.action.hover, 0.05),
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
        width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: alpha(theme.palette.text.secondary, 0.2),
        borderRadius: '3px',
    },
}));

export const MessageBubble = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isUser',
})(({ theme, isUser }) => ({
    maxWidth: '85%',
    padding: theme.spacing(1.8, 2.2),
    borderRadius: '18px',
    borderTopRightRadius: isUser ? 0 : '18px',
    borderTopLeftRadius: isUser ? '18px' : 0,
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    backgroundColor: isUser ? theme.palette.primary.main : alpha(theme.palette.background.paper, 0.9),
    color: isUser ? '#ffffff' : theme.palette.text.primary,
    boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.05)',
    border: `1px solid ${isUser ? 'transparent' : alpha(theme.palette.divider, 0.2)}`,
    wordBreak: 'break-word',
    '& p': {
        margin: 0,
    },
    '& p + p': {
        marginTop: theme.spacing(1),
    },
}));

export const InputArea = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2, 2.5),
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
    display: 'flex',
    gap: theme.spacing(1.5),
    alignItems: 'center',
    backgroundColor: alpha(theme.palette.background.paper, 0.5),
}));

export const StyledFab = styled(Fab)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',
    boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        transform: 'scale(1.05) rotate(5deg)',
    },
}));
