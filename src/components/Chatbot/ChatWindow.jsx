import React, { useState, useRef, useEffect } from 'react';
import { Typography, IconButton, TextField, CircularProgress, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ReactMarkdown from 'react-markdown';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChatWindowContainer,
    ChatHeader,
    MessagesArea,
    MessageBubble,
    InputArea
} from './styles';

const ChatWindow = ({ isOpen, onClose, messages, onSendMessage, isLoading, onClearHistory }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
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

    if (!isOpen) return null;

    return (
        <ChatWindowContainer elevation={10}>
            <ChatHeader>
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                    Portfolio Assistant
                </Typography>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Tooltip title="Clear History">
                        <IconButton size="small" onClick={onClearHistory} sx={{ color: 'inherit' }}>
                            <DeleteSweepIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <IconButton size="small" onClick={onClose} sx={{ color: 'inherit' }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>
            </ChatHeader>

            <MessagesArea>
                {messages.length === 0 && (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                        Hi! Ask me anything about Daryl's projects, skills, or experience.
                    </Typography>
                )}
                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                display: 'flex',
                                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                width: '100%'
                            }}
                        >
                            <MessageBubble isUser={msg.sender === 'user'}>
                                {msg.sender === 'user' ? (
                                    <Typography variant="body2">{msg.text}</Typography>
                                ) : (
                                    <Typography variant="body2" component="div">
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </Typography>
                                )}
                            </MessageBubble>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ width: '100%' }}
                        >
                            <MessageBubble isUser={false}>
                                <CircularProgress size={20} color="inherit" />
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
                    disabled={isLoading}
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
                    disabled={!input.trim() || isLoading}
                >
                    <SendIcon />
                </IconButton>
            </InputArea>
        </ChatWindowContainer>
    );
};

export default ChatWindow;
