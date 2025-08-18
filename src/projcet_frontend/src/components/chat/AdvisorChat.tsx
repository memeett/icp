import React, { useState, useRef, useEffect } from 'react';
import { askAdvisor } from '../../controller/advisorController';
import { motion } from 'framer-motion';
import { Input, Button, Avatar, Typography, Spin } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { Text } = Typography;

interface Message {
    text: string;
    sender: 'user' | 'ai';
}

const AdvisorChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hello! How can I help you find the perfect job or talent today?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '') return;

        const userMessage: Message = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponse = await askAdvisor(input);
            const aiMessage: Message = { text: aiResponse, sender: 'ai' };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = { text: 'Sorry, something went wrong.', sender: 'ai' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[400px] w-full bg-background border border-border rounded-lg z-50">
            {/* Header */}
            <div className="flex items-center p-3 border-b border-border bg-card rounded-t-lg">
                <RobotOutlined className="text-primary mr-2" />
                <Text strong className="text-foreground">AI Job Advisor</Text>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 overflow-y-auto bg-background">
                {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-start gap-2 mb-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                    >
                        {msg.sender === 'ai' && (
                            <Avatar
                                size="small"
                                icon={<RobotOutlined />}
                                className="bg-primary/10 text-primary border-primary/20 flex-shrink-0"
                            />
                        )}
                        <div
                            className={`px-3 py-2 rounded-lg max-w-[80%] ${
                                msg.sender === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground'
                            }`}
                        >
                            <div className="prose prose-sm max-w-full text-inherit">
                                <ReactMarkdown
                                    components={{
                                        p: ({ children }) => <p className="mb-1 last:mb-0 text-inherit">{children}</p>,
                                        strong: ({ children }) => <strong className="text-inherit">{children}</strong>,
                                        em: ({ children }) => <em className="text-inherit">{children}</em>,
                                    }}
                                >
                                    {msg.text}
                                </ReactMarkdown>
                            </div>
                        </div>
                        {msg.sender === 'user' && (
                            <Avatar
                                size="small"
                                icon={<UserOutlined />}
                                className="bg-muted text-muted-foreground flex-shrink-0"
                            />
                        )}
                    </motion.div>
                ))}
                {isLoading && (
                    <div className="flex items-center gap-2 mb-3">
                        <Avatar
                            size="small"
                            icon={<RobotOutlined />}
                            className="bg-primary/10 text-primary border-primary/20"
                        />
                        <div className="bg-muted px-3 py-2 rounded-lg">
                            <Spin size="small" />
                            <Text className="ml-2 text-muted-foreground">Thinking...</Text>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border bg-card rounded-b-lg">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onPressEnter={handleKeyPress}
                        disabled={isLoading}
                        placeholder="Ask the AI Advisor..."
                        className="flex-1"
                        style={{
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--foreground))'
                        }}
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        loading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdvisorChat;