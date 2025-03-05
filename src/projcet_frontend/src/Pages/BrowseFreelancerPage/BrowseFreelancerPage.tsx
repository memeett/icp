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
    const users: User[] = [
        {
            id: '1',
            profilePicture: new Blob(), // Replace with actual Blob if needed
            username: 'john_doe',
            dob: '1990-01-01',
            description: 'Loves coding and hiking.',
            wallet: 100.50,
            rating: 4.5,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-10-01'),
            isFaceRecognitionOn: true,
        },
        {
            id: '2',
            profilePicture: new Blob(),
            username: 'jane_smith',
            dob: '1985-05-15',
            description: 'Enjoys reading and traveling.',
            wallet: 200.75,
            rating: 4.7,
            createdAt: new Date('2023-02-15'),
            updatedAt: new Date('2023-09-20'),
            isFaceRecognitionOn: false,
        },
        {
            id: '3',
            profilePicture: new Blob(),
            username: 'alex_wong',
            dob: '1995-08-25',
            description: 'Tech enthusiast and gamer.',
            wallet: 150.00,
            rating: 4.2,
            createdAt: new Date('2023-03-10'),
            updatedAt: new Date('2023-08-15'),
            isFaceRecognitionOn: true,
        },
        {
            id: '4',
            profilePicture: new Blob(),
            username: 'emily_chen',
            dob: '1992-11-12',
            description: 'Artist and nature lover.',
            wallet: 300.25,
            rating: 4.8,
            createdAt: new Date('2023-04-05'),
            updatedAt: new Date('2023-07-30'),
            isFaceRecognitionOn: false,
        },
        {
            id: '5',
            profilePicture: new Blob(),
            username: 'michael_brown',
            dob: '1988-07-20',
            description: 'Fitness trainer and foodie.Fitness trainer and foodie.Fitness trainer and foodie.Fitness trainer and foodie.Fitness trainer and foodie.',
            wallet: 50.00,
            rating: 4.0,
            createdAt: new Date('2023-05-20'),
            updatedAt: new Date('2023-06-25'),
            isFaceRecognitionOn: true,
        },
    ];
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