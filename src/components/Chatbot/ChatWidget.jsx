import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Fab, useTheme, useMediaQuery } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import ChatWindow from './ChatWindow';
import { ChatContainer, StyledFab } from './styles';
import { useChat } from '../../hooks/useChat';
import useScrollDirection from '../../hooks/useScrollDirection';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { scrollDirection, isScrolled } = useScrollDirection();

    // Determine if navbar is visible (logic matches Header component)
    const isNavbarVisible = !isScrolled || scrollDirection === 'up';

    // Calculate bottom position
    const bottomPosition = isMobile && isNavbarVisible ? theme.spacing(10) : theme.spacing(1);

    // Use the new WebSocket hook
    const {
        messages,
        sendMessage,
        isStreaming,
        setMessages,
        clearHistory
    } = useChat();


    const handleSendMessage = (text) => {
        sendMessage(text);
    };

    const handleClearHistory = () => {
        clearHistory();
    };

    return (
        <ChatContainer
            sx={{
                bottom: bottomPosition,
                transition: 'bottom 0.3s ease-in-out'
            }}
        >
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
                            isStreaming={isStreaming}
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
