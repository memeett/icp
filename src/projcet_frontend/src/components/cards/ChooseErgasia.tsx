import { motion } from "framer-motion";
import {
  Lock,
  Zap,
  ShieldCheck,
  Coins,
  Handshake,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import CallToAction from "../buttons/DualAction";

const features = [
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Secure Crypto Escrow",
    description:
      "Funds held securely in blockchain-powered escrow until job completion. No more payment disputes or delayed payments.",
    color: "from-blue-400 to-purple-500",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Instant Settlements",
    description:
      "Get paid instantly in cryptocurrency as soon as work is approved. No waiting for bank transfers or processing times.",
    color: "from-purple-400 to-pink-500",
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Trustless System",
    description:
      "Smart contract-based agreements ensure automatic payouts when milestones are met. Work with confidence.",
    color: "from-green-400 to-cyan-500",
  },
  {
    icon: <Coins className="w-8 h-8" />,
    title: "Low Fees",
    description:
      "Pay just 2% platform fee - significantly lower than traditional freelance platforms. Keep more of your earnings.",
    color: "from-pink-400 to-red-500",
  },
  {
    icon: <Handshake className="w-8 h-8" />,
    title: "Fair Dispute Resolution",
    description:
      "Decentralized arbitration system powered by community voting for transparent conflict resolution.",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Global Opportunities",
    description:
      "Work with clients worldwide without currency conversion hassles. Get paid in stablecoins or your preferred crypto.",
    color: "from-cyan-400 to-blue-500",
  },
];

const AuroraBackground = () => (
  <div className="absolute inset-0 overflow-hidden z-0">
    <motion.div
      className="absolute w-[200%] h-[200%] opacity-20 blur-3xl"
      initial={{ x: "-50%", y: "-50%" }}
      animate={{
        background: [
          "conic-gradient(from 90deg at 50% 50%, #0ea5e9, #a5a7f0)",
          //   "conic-gradient(from 90deg at 50% 50%, #ec4899, #0ea5e9, #6366f1)",
          //   "conic-gradient(from 90deg at 50% 50%, #6366f1, #ec4899, #0ea5e9)",
        ],
      }}
      transition={{ duration: 20, repeat: Infinity }}
    />
  </div>
);

export default function WhyChoose() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section
      ref={ref}
      className="relative py-20 overflow-hidden bg-gradient-to-b from-blue-900/50 to-purple-900/50 mt-24"
    >
      <AuroraBackground />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200 mb-4">
            Why Choose Ergasia?
          </h2>
          <p className="text-2xl text-white max-w-2xl mx-auto">
            Revolutionizing freelance work with blockchain-powered trust and
            instant crypto payments
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-gradient-to-br ${feature.color} p-px rounded-2xl shadow-xl hover:shadow-2xl transition-shadow`}
            >
              <div className="bg-gray-900/90 h-full rounded-2xl p-6 backdrop-blur-sm">
                <div
                  className={`mb-4 inline-block p-4 rounded-lg bg-gradient-to-br ${feature.color}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-cyan-50 mb-3">
                  {feature.title}
                </h3>
                <p className="text-cyan-100">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="w-full max-w-6xl mx-auto pt-20 pb-12">
          <h2 className="text-5xl text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-100">
            Start Your Crypto Journey
          </h2>
          <p className="text-center text-white text-xl mb-12 max-w-2xl mx-auto">
            Join the decentralized workforce marketplace where payments are
            secure, instant, and borderless.
          </p>
          <CallToAction />
        </div>
        {/* <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="mb-8 p-8 rounded-3xl bg-gray-900/80 backdrop-blur-sm border border-cyan-500/20 inline-block">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">
              How Crypto Payments Work
            </h3>
            <div className="flex items-center justify-center space-x-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <WalletIcon className="w-8 h-8 text-white" />
                </div>
                <span className="mt-2 text-cyan-200">
                  Client Funds Job Wallet
                </span>
              </div>
              <ArrowRight className="w-8 h-8 text-cyan-400" />
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <BriefcaseIcon className="w-8 h-8 text-white" />
                </div>
                <span className="mt-2 text-cyan-200">Work Completed</span>
              </div>
              <ArrowRight className="w-8 h-8 text-cyan-400" />
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full flex items-center justify-center">
                  <Coins className="w-8 h-8 text-white" />
                </div>
                <span className="mt-2 text-cyan-200">
                  Instant Crypto Payout
                </span>
              </div>
            </div>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}

function WalletIcon(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

function BriefcaseIcon(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  );
}
