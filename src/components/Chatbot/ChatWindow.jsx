import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, IconButton, TextField, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useTheme, alpha } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChatWindowContainer,
    ChatHeader,
    MessagesArea,
    MessageBubble,
    InputArea
} from './styles';

const ThinkingBubble = () => {
    return (
        <Box sx={{ display: 'flex', gap: '6px', py: 0.5, px: 1, alignItems: 'center' }}>
            {[0, 1, 2].map((i) => (
                <Box
                    key={i}
                    sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: 'text.secondary',
                        opacity: 0.6,
                        animation: 'bounce 1.4s infinite ease-in-out both',
                        animationDelay: `${i * 0.2}s`,
                        '@keyframes bounce': {
                            '0%, 80%, 100%': { transform: 'scale(0.3)', opacity: 0.2 },
                            '40%': { transform: 'scale(1)', opacity: 0.9 }
                        }
                    }}
                />
            ))}
        </Box>
    );
};

const ChatWindow = ({ isOpen, onClose, messages, onSendMessage, isStreaming, onClearHistory }) => {
    const theme = useTheme();
    const userName = useSelector((state) => state.user.name || "Daryl");
    const [input, setInput] = useState('');
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isStreaming) {
            onSendMessage(input);
            setInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleClearClick = () => {
        setShowClearConfirm(true);
    };

    const handleConfirmClear = () => {
        onClearHistory();
        setShowClearConfirm(false);
    };

    if (!isOpen) return null;

    const isThinking = isStreaming && messages.length > 0 && messages[messages.length - 1]?.sender === 'user';

    return (
        <ChatWindowContainer elevation={10}>
            <ChatHeader>
                <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                    Portfolio Assistant
                </Typography>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Tooltip title="Clear History">
                        <IconButton size="small" onClick={handleClearClick} sx={{ color: 'inherit', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                            <DeleteSweepIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <IconButton size="small" onClick={onClose} sx={{ color: 'inherit', opacity: 0.8, '&:hover': { opacity: 1 } }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>
            </ChatHeader>

            <MessagesArea>
                {messages.length === 0 && (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4, px: 2, lineHeight: 1.6 }}>
                        Hi! Ask me anything about {userName}'s projects, skills, or experience.
                    </Typography>
                )}
                <AnimatePresence>
                    {messages.map((msg, index) => {
                        const isLast = index === messages.length - 1;
                        const isBot = msg.sender === 'bot';
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                style={{
                                    display: 'flex',
                                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    width: '100%'
                                }}
                            >
                                <MessageBubble isUser={msg.sender === 'user'}>
                                    {msg.sender === 'user' ? (
                                        <Typography variant="body2" sx={{ lineHeight: 1.5 }}>{msg.text}</Typography>
                                    ) : (
                                        <Typography variant="body2" component="div" sx={{
                                            lineHeight: 1.6,
                                            '& p': { m: 0 },
                                            '& p + p': { mt: 1.5 }
                                        }}>
                                            <ReactMarkdown>
                                                {msg.text + (isStreaming && isLast ? ' ▋' : '')}
                                            </ReactMarkdown>
                                        </Typography>
                                    )}
                                </MessageBubble>
                            </motion.div>
                        );
                    })}
                    {isThinking && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}
                        >
                            <MessageBubble isUser={false}>
                                <ThinkingBubble />
                            </MessageBubble>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </MessagesArea>

            <InputArea component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isStreaming}
                    multiline
                    maxRows={3}
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '20px',
                            backgroundColor: 'background.default'
                        }
                    }}
                />
                <IconButton
                    color="primary"
                    type="submit"
                    disabled={!input.trim() || isStreaming}
                >
                    <SendIcon />
                </IconButton>
            </InputArea>

            <Dialog
                open={showClearConfirm}
                onClose={() => setShowClearConfirm(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    sx: {
                        borderRadius: '24px',
                        padding: theme.spacing(1),
                        backgroundColor: alpha(theme.palette.background.paper, 0.85),
                        backdropFilter: 'blur(16px)',
                        border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 700 }}>
                    {"Clear Chat History?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={{ color: 'text.secondary', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        This will start a new chat session and the current conversation history will be lost from this view.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1.5 }}>
                    <Button 
                        onClick={() => setShowClearConfirm(false)} 
                        color="inherit"
                        sx={{ borderRadius: '12px', px: 2.5 }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmClear} 
                        color="error" 
                        variant="contained"
                        autoFocus
                        sx={{ borderRadius: '12px', px: 2.5, color: '#ffffff' }}
                    >
                        Clear
                    </Button>
                </DialogActions>
            </Dialog>
        </ChatWindowContainer>
    );
};

export default ChatWindow;
