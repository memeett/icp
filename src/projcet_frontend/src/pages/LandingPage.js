import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Button } from 'antd';
import { ArrowRight, Briefcase, Users, Award, DollarSign, Sparkles, Zap, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../ui/components/Navbar';
const LandingPage = () => {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [_jsx(Navbar, {}), _jsxs("section", { className: "relative py-20 px-4 overflow-hidden", children: [_jsxs("div", { className: "absolute inset-0 overflow-hidden", children: [_jsx(motion.div, { className: "absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl", animate: {
                                    y: [0, -20, 0],
                                    scale: [1, 1.1, 1],
                                }, transition: {
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                } }), _jsx(motion.div, { className: "absolute top-40 right-20 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl", animate: {
                                    y: [0, 30, 0],
                                    scale: [1, 0.9, 1],
                                }, transition: {
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                } }), _jsx(motion.div, { className: "absolute bottom-20 left-1/4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl", animate: {
                                    y: [0, -15, 0],
                                    x: [0, 10, 0],
                                }, transition: {
                                    duration: 7,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                } }), _jsx("div", { className: "absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:25px_25px]" }), _jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl" }), _jsx("div", { className: "absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl" })] }), _jsx("div", { className: "max-w-6xl mx-auto text-center relative z-10", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, children: [_jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [_jsx(motion.div, { className: "absolute top-10 left-10 text-primary/30", animate: {
                                                y: [0, -10, 0],
                                                rotate: [0, 5, 0],
                                            }, transition: {
                                                duration: 4,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }, children: _jsx(Sparkles, { size: 24 }) }), _jsx(motion.div, { className: "absolute top-20 right-16 text-indigo-500/30", animate: {
                                                y: [0, 15, 0],
                                                rotate: [0, -5, 0],
                                            }, transition: {
                                                duration: 5,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }, children: _jsx(Zap, { size: 28 }) }), _jsx(motion.div, { className: "absolute bottom-10 left-1/3 text-blue-500/30", animate: {
                                                y: [0, -12, 0],
                                                rotate: [0, 10, 0],
                                            }, transition: {
                                                duration: 6,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }, children: _jsx(Globe, { size: 32 }) })] }), _jsx(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.6, delay: 0.2 }, className: "mb-6", children: _jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6", children: [_jsx(Sparkles, { size: 16 }), "Powered by Blockchain Technology"] }) }), _jsxs("h1", { className: "text-5xl md:text-7xl font-bold mb-6", children: ["The Future of Freelance is", ' ', _jsx("span", { className: "bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent", children: "Decentralized" })] }), _jsx("p", { className: "text-xl text-muted-foreground mb-8 max-w-3xl mx-auto", children: "Ergasia connects top talent with innovative projects, powered by secure, transparent, and instant crypto payments on the blockchain." }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsx(motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsx(Button, { type: "primary", size: "large", icon: _jsx(ArrowRight, {}), onClick: () => navigate('/find'), className: "h-12 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300", children: "Find Your Next Gig" }) }), _jsx(motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsx(Button, { size: "large", onClick: () => navigate('/post'), className: "h-12 px-8 text-lg border-2 hover:border-primary hover:text-primary transition-all duration-300", children: "Hire Top Talent" }) })] })] }) })] }), _jsx("section", { className: "py-20 px-4 bg-muted/30", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsx("div", { className: "text-center mb-16", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 }, children: [_jsx("h2", { className: "text-4xl font-bold mb-4", children: "How It Works" }), _jsx("p", { className: "text-xl text-muted-foreground", children: "A simple, secure, and transparent process from start to finish." })] }) }), _jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-8", children: [
                                {
                                    icon: _jsx(DollarSign, { className: "h-8 w-8" }),
                                    title: 'Post a Job & Deposit Funds',
                                    description: 'Clients post job details and securely deposit crypto into a smart contract-based escrow.',
                                    color: 'text-green-600'
                                },
                                {
                                    icon: _jsx(Users, { className: "h-8 w-8" }),
                                    title: 'Hire the Perfect Freelancer',
                                    description: 'Browse profiles, invite talent, or accept applications. Agree on terms to initiate the work.',
                                    color: 'text-blue-600'
                                },
                                {
                                    icon: _jsx(Briefcase, { className: "h-8 w-8" }),
                                    title: 'Complete & Submit Work',
                                    description: 'Freelancers complete the job and submit their work for review directly on the platform.',
                                    color: 'text-purple-600'
                                },
                                {
                                    icon: _jsx(Award, { className: "h-8 w-8" }),
                                    title: 'Approve & Release Payment',
                                    description: 'Once the client approves the work, the smart contract automatically releases the funds instantly.',
                                    color: 'text-indigo-600'
                                }
                            ].map((feature, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: index * 0.1 }, whileHover: {
                                    y: -5,
                                    transition: { duration: 0.2 }
                                }, className: "bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-lg transition-all duration-300 group", children: [_jsx("div", { className: `${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`, children: feature.icon }), _jsx("h3", { className: "text-xl font-semibold mb-2", children: feature.title }), _jsx("p", { className: "text-muted-foreground", children: feature.description })] }, feature.title))) })] }) }), _jsx("section", { className: "py-20 px-4", children: _jsx("div", { className: "max-w-4xl mx-auto text-center", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 }, className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl blur-xl opacity-20" }), _jsxs("div", { className: "relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl p-12 text-white overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" }), _jsx("div", { className: "absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl" }), _jsxs("div", { className: "relative z-10", children: [_jsx("h2", { className: "text-4xl font-bold mb-4", children: "Ready to Join the Revolution?" }), _jsx("p", { className: "text-xl mb-8 opacity-90", children: "Whether you're looking for your next big project or the perfect talent to build your vision, Ergasia is your gateway to the future of work." }), _jsx(motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsx(Button, { size: "large", className: "h-12 px-8 text-lg bg-white text-indigo-600 border-none hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300", icon: _jsx(ArrowRight, {}), onClick: () => navigate('/find'), children: "Get Started Today" }) })] })] })] }) }) })] }));
};
export default LandingPage;
