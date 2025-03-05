import { FiSearch, FiX } from "react-icons/fi";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import Footer from "../../components/Footer";

export default function BrowseFreelancerPage(){
    const [searchQuery, setSearchQuery] = useState('');



    return(
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="container mx-auto px-4 mt-6">
                <div className="flex items-center gap-8 mb-6">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search jobs..."
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

            <div className="flex overflow-x-hidden scrollbar-hide">
                
            </div>


            <Footer />
            
        </div>
    );
}