import { useCallback, useEffect, useState } from "react";
import { UserInvitationPayload } from "../../../../declarations/invitation/invitation.did";
import { getInvitationByUserId } from "../../controller/invitationController";
import FreelancerInvitationCard from "../cards/FreelancerInvitationCard";
import { motion } from "framer-motion";

export default function ProfileInvitationSection() {
    const [invitations, setInvitations] = useState<UserInvitationPayload[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInvitationByUserId = useCallback(async () => {
        setIsLoading(true);
        const userData = localStorage.getItem("current_user");

        try {
            const parsedData = userData ? JSON.parse(userData) : null;
            if (!parsedData || !parsedData.ok?.id) {
                throw new Error("User data not found");
            }

            const res = await getInvitationByUserId(parsedData.ok.id);
            setInvitations(res);
        } catch (err) {
            console.error("Error fetching invitations:", err);
            setError("Failed to load invitations. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInvitationByUserId();
    }, [fetchInvitationByUserId]);

    const mockInvitations: UserInvitationPayload[] = [
        {
            job: {
                id: "job-001",
                jobRating: 4.5,
                jobName: "Frontend Developer",
                jobTags: [
                    { id: "tag-001", jobCategoryName: "Web Development" },
                    { id: "tag-002", jobCategoryName: "React" },
                ],
                userId: "user-001",
                jobDescription: [
                    "Develop and maintain user-facing features for our web application.",
                    "Collaborate with designers and backend developers to implement UI/UX designs.",
                ],
                createdAt: BigInt(1698765432000), // October 31, 2023
                jobStatus: "Open",
                jobSalary: 5000,
                updatedAt: BigInt(1698765432000),
                wallet: 1000,
                jobSlots: BigInt(5),
            },
            invitedAt: BigInt(1698765432000), // October 31, 2023
        },
        {
            job: {
                id: "job-002",
                jobRating: 4.0,
                jobName: "Backend Developer",
                jobTags: [
                    { id: "tag-003", jobCategoryName: "API Development" },
                    { id: "tag-004", jobCategoryName: "Node.js" },
                ],
                userId: "user-002",
                jobDescription: [
                    "Design and implement scalable backend services.",
                    "Optimize database queries and ensure high performance.",
                ],
                createdAt: BigInt(1698841832000), // November 1, 2023
                jobStatus: "Open",
                jobSalary: 6000,
                updatedAt: BigInt(1698841832000),
                wallet: 1500,
                jobSlots: BigInt(3),
            },
            invitedAt: BigInt(1698841832000), // November 1, 2023
        },
        {
            job: {
                id: "job-003",
                jobRating: 4.7,
                jobName: "UI/UX Designer",
                jobTags: [
                    { id: "tag-005", jobCategoryName: "Design" },
                    { id: "tag-006", jobCategoryName: "Figma" },
                ],
                userId: "user-003",
                jobDescription: [
                    "Create wireframes, prototypes, and high-fidelity designs.",
                    "Collaborate with developers to ensure design feasibility.",
                ],
                createdAt: BigInt(1698928232000), // November 2, 2023
                jobStatus: "Closed",
                jobSalary: 4500,
                updatedAt: BigInt(1698928232000),
                wallet: 800,
                jobSlots: BigInt(2),
            },
            invitedAt: BigInt(1698928232000), // November 2, 2023
        },
        {
            job: {
                id: "job-004",
                jobRating: 3.8,
                jobName: "DevOps Engineer",
                jobTags: [
                    { id: "tag-007", jobCategoryName: "Cloud" },
                    { id: "tag-008", jobCategoryName: "AWS" },
                ],
                userId: "user-004",
                jobDescription: [
                    "Manage CI/CD pipelines and automate deployment processes.",
                    "Monitor and optimize cloud infrastructure.",
                ],
                createdAt: BigInt(1699014632000), // November 3, 2023
                jobStatus: "Open",
                jobSalary: 7000,
                updatedAt: BigInt(1699014632000),
                wallet: 2000,
                jobSlots: BigInt(4),
            },
            invitedAt: BigInt(1699014632000), // November 3, 2023
        },
        {
            job: {
                id: "job-005",
                jobRating: 4.2,
                jobName: "Data Scientist",
                jobTags: [
                    { id: "tag-009", jobCategoryName: "Machine Learning" },
                    { id: "tag-010", jobCategoryName: "Python" },
                ],
                userId: "user-005",
                jobDescription: [
                    "Analyze large datasets and build predictive models.",
                    "Collaborate with stakeholders to derive actionable insights.",
                ],
                createdAt: BigInt(1699101032000), // November 4, 2023
                jobStatus: "Open",
                jobSalary: 8000,
                updatedAt: BigInt(1699101032000),
                wallet: 1200,
                jobSlots: BigInt(6),
            },
            invitedAt: BigInt(1699101032000), // November 4, 2023
        },
    ];

    return (
        <div className="w-full \ bg-gradient-to-r ">
            <div className="max-w-5xl mx-auto px-4 ">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-purple-100"
                >
                    <div className="relative overflow-hidden h-32 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgxMzUpIj48cGF0aCBkPSJNMjAgMCBMMjAgNDAgTDAgMjAgTDQwIDIwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIiBvcGFjaXR5PSIwLjQiLz48L3N2Zz4=')] opacity-30"></div>
                        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t "></div>
                        <div className="relative p-6 flex items-end h-full">
                            <h1 className="text-3xl font-bold text-white drop-shadow-md">Your Invitations</h1>
                        </div>
                    </div>

                    <div className="p-6">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <div className="text-red-500 mb-2">{error}</div>
                                <button
                                    onClick={() => fetchInvitationByUserId()}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : mockInvitations.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-6">
                                    <p className="text-gray-600">You have {mockInvitations.length} invitation{mockInvitations.length !== 1 ? 's' : ''}</p>
                                    <div className="flex space-x-2">
                                        
                                        <button
                                            onClick={() => fetchInvitationByUserId()}
                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                {mockInvitations.map((invitation) => (
                                    <FreelancerInvitationCard  invitation={invitation} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-full inline-block mb-4">
                                    <svg className="h-16 w-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                                    </svg>
                                </div>
                                <p className="mt-4 text-lg text-gray-600">No invitations found</p>
                                <p className="text-gray-500">When employers invite you to their jobs, they'll appear here.</p>
                                <button
                                    onClick={() => fetchInvitationByUserId()}
                                    className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300"
                                >
                                    Refresh
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}