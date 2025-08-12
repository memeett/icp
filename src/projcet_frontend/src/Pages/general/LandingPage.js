import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Briefcase, Users, Award, DollarSign, ArrowRight, ShieldCheck, Zap, Lock, } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
// Main Page Component
export default function LandingPage() {
    return (_jsxs("div", { className: "bg-background text-foreground", children: [_jsx(Navbar, {}), _jsxs("main", { children: [_jsx(HeroSection, {}), _jsx(HowItWorksSection, {}), _jsx(WhyChooseSection, {}), _jsx(CallToActionSection, {})] }), _jsx(Footer, {})] }));
}
const Section = ({ children, className = '', }) => (_jsx("section", { className: `w-full py-16 md:py-24 lg:py-32 ${className}`, children: _jsx("div", { className: "container mx-auto px-4 md:px-6", children: children }) }));
const FeatureCard = ({ icon, title, children, }) => (_jsxs("div", { className: "flex flex-col items-start p-6 bg-card rounded-lg border", children: [_jsx("div", { className: "mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary", children: icon }), _jsx("h3", { className: "text-xl font-bold mb-2 text-card-foreground", children: title }), _jsx("p", { className: "text-muted-foreground", children: children })] }));
// --- Page Sections ---
function HeroSection() {
    const navigate = useNavigate();
    return (_jsxs(Section, { className: "relative text-center", children: [_jsx("div", { className: "absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, children: [_jsxs("h1", { className: "text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl", children: ["The Future of Freelance is", ' ', _jsx("span", { className: "bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400", children: "Decentralized" })] }), _jsx("p", { className: "mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl", children: "Ergasia connects top talent with innovative projects, powered by secure, transparent, and instant crypto payments on the blockchain." }), _jsxs("div", { className: "mt-8 flex justify-center gap-4", children: [_jsxs(Button, { size: "lg", onClick: () => navigate('/find-work'), children: ["Find Your Next Gig", _jsx(ArrowRight, { className: "ml-2 h-5 w-5" })] }), _jsx(Button, { size: "lg", variant: "outline", onClick: () => navigate('/post-job'), children: "Hire Top Talent" })] })] })] }));
}
const steps = [
    {
        icon: _jsx(DollarSign, { className: "h-8 w-8" }),
        title: 'Post a Job & Deposit Funds',
        description: 'Clients post job details and securely deposit crypto into a smart contract-based escrow.',
    },
    {
        icon: _jsx(Users, { className: "h-8 w-8" }),
        title: 'Hire the Perfect Freelancer',
        description: 'Browse profiles, invite talent, or accept applications. Agree on terms to initiate the work.',
    },
    {
        icon: _jsx(Briefcase, { className: "h-8 w-8" }),
        title: 'Complete & Submit Work',
        description: 'Freelancers complete the job and submit their work for review directly on the platform.',
    },
    {
        icon: _jsx(Award, { className: "h-8 w-8" }),
        title: 'Approve & Release Payment',
        description: 'Once the client approves the work, the smart contract automatically releases the funds instantly.',
    },
];
function HowItWorksSection() {
    return (_jsxs(Section, { className: "bg-secondary", children: [_jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-3xl font-bold tracking-tighter sm:text-4xl", children: "How It Works" }), _jsx("p", { className: "mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-lg", children: "A simple, secure, and transparent process from start to finish." })] }), _jsx("div", { className: "mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4", children: steps.map((step, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.5 }, transition: { duration: 0.5, delay: index * 0.1 }, children: _jsx(FeatureCard, { icon: step.icon, title: step.title, children: step.description }) }, step.title))) })] }));
}
function WhyChooseSection() {
    return (_jsxs(Section, { children: [_jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-3xl font-bold tracking-tighter sm:text-4xl", children: "Why Choose Ergasia?" }), _jsx("p", { className: "mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-lg", children: "We leverage blockchain technology to solve the biggest problems in freelancing." })] }), _jsxs("div", { className: "mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3", children: [_jsx(FeatureCard, { icon: _jsx(Lock, { className: "h-8 w-8" }), title: "Secure Escrow", children: "Funds are locked in a smart contract, ensuring payment for completed work and peace of mind for clients." }), _jsx(FeatureCard, { icon: _jsx(Zap, { className: "h-8 w-8" }), title: "Instant Payouts", children: "Receive your crypto earnings the moment a job is approved. No more waiting for bank transfers." }), _jsx(FeatureCard, { icon: _jsx(ShieldCheck, { className: "h-8 w-8" }), title: "Trustless System", children: "Our platform operates on transparent rules enforced by code, minimizing disputes and building trust." })] })] }));
}
function CallToActionSection() {
    const navigate = useNavigate();
    return (_jsx(Section, { children: _jsxs("div", { className: "mx-auto max-w-4xl rounded-lg bg-gradient-to-r from-primary to-purple-600 p-8 md:p-12 text-center text-primary-foreground", children: [_jsx("h2", { className: "text-3xl font-bold tracking-tighter sm:text-4xl", children: "Ready to Join the Revolution?" }), _jsx("p", { className: "mx-auto mt-4 max-w-xl", children: "Whether you're looking for your next big project or the perfect talent to build your vision, Ergasia is your gateway to the future of work." }), _jsx("div", { className: "mt-8", children: _jsxs(Button, { size: "lg", variant: "secondary", onClick: () => navigate('/register'), children: ["Get Started Today", _jsx(ArrowRight, { className: "ml-2 h-5 w-5" })] }) })] }) }));
}
