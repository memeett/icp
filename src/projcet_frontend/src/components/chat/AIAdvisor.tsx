import React, { useEffect, useRef } from 'react';
import { FloatButton } from 'antd';
import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { isAdvisorChatOpenAtom } from '../../app/store/ui';
import AdvisorChat from './AdvisorChat';
import { Bot, X } from 'lucide-react';
import './AIAdvisor.css';

const AIAdvisor: React.FC = () => {
    const [isOpen, setIsOpen] = useAtom(isAdvisorChatOpenAtom);
    const chatRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    // Close chat when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                chatRef.current &&
                buttonRef.current &&
                !chatRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, setIsOpen]);

    return (
        <>
            {/* Custom Chat Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={chatRef}
                        className="fixed bottom-24 right-8 z-40 no-horizontal-scroll"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 25,
                            duration: 0.3,
                        }}
                        style={{
                            width: '400px',
                            maxWidth: '90vw',
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '12px',
                            boxShadow:
                                '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                            overflow: 'hidden',
                        }}
                    >
                        <AdvisorChat />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button */}
            <div ref={buttonRef} className="fixed bottom-8 right-8 z-25">
                <FloatButton
                    className="ai-advisor-fab"
                    icon={
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90 }}
                                    animate={{ rotate: 0 }}
                                    exit={{ rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                    className='text-center'
                                >
                                    <X size={20} color='white' />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="bot"
                                    initial={{ rotate: -90 }}
                                    animate={{ rotate: 0 }}
                                    exit={{ rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                    className='text-center'
                                >
                                    <Bot size={20} color='white'/>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    }
                    onClick={handleToggle}
                    style={{
                        width: 72,
                        height: 72,
                        borderColor: 'transparent',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                    }}
                    tooltip={isOpen ? 'Close AI Advisor' : 'Ask AI Advisor'}
                />
            </div>
        </>
    );
};

export default AIAdvisor;
