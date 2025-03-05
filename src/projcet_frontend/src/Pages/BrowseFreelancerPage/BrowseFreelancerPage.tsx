import { FiSearch, FiX } from "react-icons/fi";
import FreelancerCard from "../../components/cards/FreelancerCard";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { User } from "../../interface/User";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../controller/userController";

export default function BrowseFreelancerPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [listUser, setListUser] = useState<User[]>([]);
    
    useEffect(()=> {

        getAllUsers().then((res)=>{
            if(res)setListUser(res)
        })


    },[])
    
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="container mx-auto px-4 mt-6">
                <div className="flex items-center gap-8 mb-6">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search freelancers..."
                            className="w-full px-12 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                        />
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                        {searchQuery && (
                            <FiX
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl cursor-pointer hover:text-gray-600"
                                onClick={() => setSearchQuery('')}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Freelancer Cards Grid */}
            <div className="mx-auto px-4 flex-1 min-h-screen flex items-center justify-center">
                {listUser.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-10 ">
                        {listUser.map((user) => (
                            <FreelancerCard key={user.id} user={user} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 text-xl">No freelancers available</p>
                )}
            </div>

            <Footer />
        </div>
    );
}