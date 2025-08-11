import React from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Users,
    Award,
    DollarSign,
    LogIn,
    ArrowRight,
    ShieldCheck,
    Zap,
    Lock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
// Main Page Component
export default function LandingPage() {
    return (
        <div className="bg-background text-foreground">
            <Navbar/>
            <main>
                <HeroSection />
                <HowItWorksSection />
                <WhyChooseSection />
                <CallToActionSection />
            </main>
            <Footer/>
        </div>
    );
}

const Section = ({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <section className={`w-full py-16 md:py-24 lg:py-32 ${className}`}>
        <div className="container mx-auto px-4 md:px-6">{children}</div>
    </section>
);

const FeatureCard = ({
    icon,
    title,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}) => (
    <div className="flex flex-col items-start p-6 bg-card rounded-lg border">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-card-foreground">{title}</h3>
        <p className="text-muted-foreground">{children}</p>
    </div>
);

// --- Page Sections ---


function HeroSection() {
    const navigate = useNavigate();
    return (
        <Section className="relative text-center">
            {/* Subtle background grid */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    The Future of Freelance is{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                        Decentralized
                    </span>
                </h1>
                <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl">
                    Ergasia connects top talent with innovative projects,
                    powered by secure, transparent, and instant crypto payments
                    on the blockchain.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button size="lg" onClick={() => navigate('/find-work')}>
                        Find Your Next Gig
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => navigate('/post-job')}
                    >
                        Hire Top Talent
                    </Button>
                </div>
            </motion.div>
        </Section>
    );
}

const steps = [
    {
        icon: <DollarSign className="h-8 w-8" />,
        title: 'Post a Job & Deposit Funds',
        description:
            'Clients post job details and securely deposit crypto into a smart contract-based escrow.',
    },
    {
        icon: <Users className="h-8 w-8" />,
        title: 'Hire the Perfect Freelancer',
        description:
            'Browse profiles, invite talent, or accept applications. Agree on terms to initiate the work.',
    },
    {
        icon: <Briefcase className="h-8 w-8" />,
        title: 'Complete & Submit Work',
        description:
            'Freelancers complete the job and submit their work for review directly on the platform.',
    },
    {
        icon: <Award className="h-8 w-8" />,
        title: 'Approve & Release Payment',
        description:
            'Once the client approves the work, the smart contract automatically releases the funds instantly.',
    },
];

function HowItWorksSection() {
    return (
        <Section className="bg-secondary">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    How It Works
                </h2>
                <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-lg">
                    A simple, secure, and transparent process from start to
                    finish.
                </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <FeatureCard icon={step.icon} title={step.title}>
                            {step.description}
                        </FeatureCard>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}

function WhyChooseSection() {
    return (
        <Section>
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Why Choose Ergasia?
                </h2>
                <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-lg">
                    We leverage blockchain technology to solve the biggest
                    problems in freelancing.
                </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <FeatureCard
                    icon={<Lock className="h-8 w-8" />}
                    title="Secure Escrow"
                >
                    Funds are locked in a smart contract, ensuring payment for
                    completed work and peace of mind for clients.
                </FeatureCard>
                <FeatureCard
                    icon={<Zap className="h-8 w-8" />}
                    title="Instant Payouts"
                >
                    Receive your crypto earnings the moment a job is approved.
                    No more waiting for bank transfers.
                </FeatureCard>
                <FeatureCard
                    icon={<ShieldCheck className="h-8 w-8" />}
                    title="Trustless System"
                >
                    Our platform operates on transparent rules enforced by code,
                    minimizing disputes and building trust.
                </FeatureCard>
            </div>
        </Section>
    );
}

function CallToActionSection() {
    const navigate = useNavigate();
    return (
        <Section>
            <div className="mx-auto max-w-4xl rounded-lg bg-gradient-to-r from-primary to-purple-600 p-8 md:p-12 text-center text-primary-foreground">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Ready to Join the Revolution?
                </h2>
                <p className="mx-auto mt-4 max-w-xl">
                    Whether you're looking for your next big project or the
                    perfect talent to build your vision, Ergasia is your gateway
                    to the future of work.
                </p>
                <div className="mt-8">
                    <Button
                        size="lg"
                        variant="secondary"
                        onClick={() => navigate('/register')}
                    >
                        Get Started Today
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>
        </Section>
    );
}

