import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star, Users, UserCircle } from 'lucide-react';
import { User } from '../../interface/User';

export default function FreelancerCard({ user }: { user: User }) {

    return (

            <div className="p-1 bg-gradient-to-br from-blue-600 to-purple-500 rounded-3xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-80 bg-white 
                    rounded-[1.5rem] 
                    p-6 space-y-6 
                    relative overflow-hidden"
                >
                    <div className="flex flex-col items-center space-y-4">
                      
                        <motion.img
                            src={

                                URL.createObjectURL(user.profilePicture) ||
                                "/pic.jpeg"
                            }
                            // src="assets/profilePicture/default_profile_pict.jpg"
                        alt="assets/profilePicture/default_profile_pict.jpg"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-28 h-28 rounded-full border-4 border-gray-100 
                       shadow-lg object-cover"
                        />

                        <div className="text-center">
                            <h2 className="text-3xl font-bold 
                           bg-clip-text text-transparent 
                           bg-gradient-to-r from-blue-600 to-purple-500">
                                {user.username}
                            </h2>
                        </div>
                    </div>

                    <div className="space-y-4 mt-4">
                        {[
                            {
                                icon: <Users className="text-blue-600" />,
                                label: 'Username',
                                value: user.username
                            },
                            {
                                icon: <Calendar className="text-purple-600" />,
                                label: 'Date of Birth',
                                value: user.dob
                            },
                            {
                                icon: <Star className="text-indigo-600" />,
                                label: 'Rating',
                                value: `${user.rating}/5`
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="flex items-center space-x-3 
                         bg-gray-100 p-3 rounded-xl"
                                whileHover={{
                                    scale: 1.05,
                                    backgroundColor: 'rgb(243 244 246)'
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {item.icon}
                                <div>
                                    <span className="text-xs text-gray-500 block">
                                        {item.label}
                                    </span>
                                    <span className="text-gray-800 font-medium">
                                        {item.value}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    };
