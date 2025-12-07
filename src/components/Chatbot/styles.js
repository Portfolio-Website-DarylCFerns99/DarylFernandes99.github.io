import { styled } from '@mui/material/styles';
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
    width: '350px',
    height: '500px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[10],
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('sm')]: {
        width: '90vw',
        height: '60vh',
        right: theme.spacing(2),
        bottom: theme.spacing(10),
    },
}));

export const ChatHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

export const MessagesArea = styled(Box)(({ theme }) => ({
    flex: 1,
    padding: theme.spacing(2),
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    backgroundColor: theme.palette.action.hover,
}));

export const MessageBubble = styled(Box)(({ theme, isUser }) => ({
    maxWidth: '80%',
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius * 2,
    borderTopRightRadius: isUser ? 0 : theme.shape.borderRadius * 2,
    borderTopLeftRadius: isUser ? theme.shape.borderRadius * 2 : 0,
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    backgroundColor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
    color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    wordBreak: 'break-word',
}));

export const InputArea = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    gap: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
}));

export const StyledFab = styled(Fab)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));
