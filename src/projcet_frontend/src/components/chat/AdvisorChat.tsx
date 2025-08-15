import React, { useState, useRef, useEffect } from 'react';
import { askAdvisor } from '../../controller/advisorController';
import { motion } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-sm border border-purple-100/50 rounded-xl shadow-lg w-full max-w-2xl mx-auto flex flex-col h-[500px]"
        >
            <div className="p-4 border-b border-purple-100/50">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <Bot className="mr-2 text-purple-500" size={20} />
                    AI Job Advisor
                </h3>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-start gap-3 my-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                    >
                        {msg.sender === 'ai' && <Bot className="text-purple-500 flex-shrink-0 mt-1" size={20} />}
                        <div className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md ${msg.sender === 'user' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                            <div className="prose prose-sm max-w-full">
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        </div>
                        {msg.sender === 'user' && <User className="text-gray-500 flex-shrink-0 mt-1" size={20} />}
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-purple-100/50 flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isLoading}
                    placeholder="Ask the AI Advisor..."
                    className="flex-grow px-4 py-2 bg-white/50 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                />
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSend}
                    disabled={isLoading}
                    className="ml-3 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg disabled:opacity-50"
                >
                    {isLoading ? '...' : <Send size={20} />}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default AdvisorChat;