import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Grid,
    CircularProgress,
    Chip,
    IconButton
} from '@mui/material';
import { getAllSessions, getSessionMessages } from '../../../api/services/chatService';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import ChatIcon from '@mui/icons-material/Chat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';

const ChatHistorySection = () => {
    const [sessions, setSessions] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        setLoadingSessions(true);
        try {
            const data = await getAllSessions();
            setSessions(data);
        } catch (error) {
            console.error("Error fetching sessions:", error);
            toast.error("Failed to load chat sessions");
        } finally {
            setLoadingSessions(false);
        }
    };

    const handleSessionClick = async (sessionId) => {
        setSelectedSessionId(sessionId);
        setLoadingMessages(true);
        try {
            const data = await getSessionMessages(sessionId);
            setMessages(data);
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error("Failed to load messages");
        } finally {
            setLoadingMessages(false);
        }
    };

    return (
        <Grid container spacing={3} sx={{ height: '70vh' }}>
            {/* Session List Panel */}
            <Grid item xs={12} md={4} sx={{ height: '100%' }}>
                <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.default' }}>
                        <Typography variant="h6">Sessions</Typography>
                        <IconButton onClick={fetchSessions} size="small">
                            <RefreshIcon />
                        </IconButton>
                    </Box>
                    <Divider />

                    {loadingSessions ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress size={30} />
                        </Box>
                    ) : sessions.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                            <Typography>No chat sessions found.</Typography>
                        </Box>
                    ) : (
                        <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                            {sessions.map((session) => (
                                <React.Fragment key={session.id}>
                                    <ListItem
                                        button
                                        selected={selectedSessionId === session.id}
                                        onClick={() => handleSessionClick(session.id)}
                                        sx={{
                                            '&.Mui-selected': { bgcolor: 'action.selected' },
                                            '&:hover': { bgcolor: 'action.hover' }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                                <PersonIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle2" noWrap>
                                                    Session {session.id.slice(0, 8)}...
                                                </Typography>
                                            }
                                            secondary={
                                                <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                                                        <AccessTimeIcon sx={{ fontSize: 12 }} />
                                                        {session.last_active && formatDistanceToNow(new Date(session.last_active), { addSuffix: true })}
                                                    </Box>
                                                    <Box component="span" sx={{ fontSize: '0.75rem' }}>
                                                        {session.message_count} messages
                                                    </Box>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Paper>
            </Grid>

            {/* Chat Messages Panel */}
            <Grid item xs={12} md={8} sx={{ height: '100%' }}>
                <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
                    {selectedSessionId ? (
                        <>
                            <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Session Details: {selectedSessionId}
                                </Typography>
                            </Box>

                            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {loadingMessages ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : messages.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        No messages in this session.
                                    </Typography>
                                ) : (
                                    messages.map((msg) => (
                                        <Box
                                            key={msg.id}
                                            sx={{
                                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                                maxWidth: '70%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                                            }}
                                        >
                                            <Paper
                                                elevation={1}
                                                sx={{
                                                    p: 2,
                                                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                                                    color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                                                    borderRadius: 2,
                                                    borderTopRightRadius: msg.sender === 'user' ? 0 : 2,
                                                    borderTopLeftRadius: msg.sender === 'bot' ? 0 : 2
                                                }}
                                            >

                                                {msg.sender === 'user' ? (
                                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                                        {msg.content}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="body1" component="div" sx={{ '& p': { m: 0 } }}>
                                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                    </Typography>
                                                )}
                                            </Paper>
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, px: 1 }}>
                                                {msg.sender === 'user' ? 'User' : 'Bot'} • {new Date(msg.created_at).toLocaleTimeString()}
                                            </Typography>
                                        </Box>
                                    ))
                                )}
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'text.secondary', p: 3 }}>
                            <ChatIcon sx={{ fontSize: 60, mb: 2, opacity: 0.2 }} />
                            <Typography variant="h6" color="text.disabled">
                                Select a session to view conversation history
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default ChatHistorySection;
