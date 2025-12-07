import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Fab } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import ChatWindow from './ChatWindow';
import { ChatContainer, StyledFab } from './styles';
import { generateResponse } from '../../utils/chatUtils';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const userData = useSelector((state) => state.user);

    // Load history from localStorage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('chat_history');
        if (savedHistory) {
            try {
                setMessages(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to parse chat history", e);
            }
        }
    }, []);

    // Save history to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('chat_history', JSON.stringify(messages));
    }, [messages]);

    const handleSendMessage = async (text) => {
        const userMessage = { sender: 'user', text };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Pass current messages as history context
            const responseText = await generateResponse(text, userData, messages);
            const botMessage = { sender: 'bot', text: responseText };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, something went wrong." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearHistory = () => {
        if (window.confirm("Are you sure you want to clear the chat history?")) {
            setMessages([]);
            localStorage.removeItem('chat_history');
        }
    };

    return (
        <ChatContainer>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.2 }}
                        style={{ transformOrigin: 'bottom right' }}
                    >
                        <ChatWindow
                            isOpen={isOpen}
                            onClose={() => setIsOpen(false)}
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            isLoading={isLoading}
                            onClearHistory={handleClearHistory}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <StyledFab
                    color="primary"
                    aria-label="chat"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isOpen ? 'close' : 'chat'}
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                            style={{ display: 'flex' }}
                        >
                            {isOpen ? <CloseIcon /> : <ChatIcon />}
                        </motion.div>
                    </AnimatePresence>
                </StyledFab>
            </motion.div>
        </ChatContainer>
    );
};

export default ChatWidget;
