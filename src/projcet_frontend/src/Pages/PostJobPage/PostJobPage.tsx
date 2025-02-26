import { useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { Plus, Trash, X } from "lucide-react";


const jobCategory = ["Web", "Mobile", "AI", "Game", "IOT", "Desktop", "Network"]


export default function PostJobPage() {
    // requirements
    const [requirements, setRequirements] = useState<string[]>([""]);

    const addRequirement = () => {
        setRequirements([...requirements, ""]);
    };

    const updateRequirement = (index: number, value: string) => {
        const updatedRequirements = [...requirements];
        updatedRequirements[index] = value;
        setRequirements(updatedRequirements);
    };

    const removeRequirement = (index: number) => {
        const updatedRequirements = requirements.filter((_, i) => i !== index);
        setRequirements(updatedRequirements);
    };


    // category
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [customCategory, setCustomCategory] = useState("");

    const addCategory = (category: string) => {
        if (!selectedCategories.includes(category)) {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const removeCategory = (category: string) => {
        setSelectedCategories(selectedCategories.filter((c) => c !== category));
    };

    const handleCustomCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (customCategory.trim() && !selectedCategories.includes(customCategory)) {
            setSelectedCategories([...selectedCategories, customCategory]);
            setCustomCategory("");
        }
    };

    return (
        <div className="flex flex-col min-h-screen ">
            {/* Navbar - Stays on top, does not scroll */}
            <div className="flex-none w-full bg-white shadow-md z-50">
                <Navbar />
            </div>

            {/* Main Content - This is the only scrollable section */}
            <div className="flex flex-col items-center justify-center overflow-x-hidden scrollbar-hide">


                {/* Job Title Section */}
                <div className="shadow-lg border-2 border-gray-400 rounded-xl bg-white w-[55vw] mt-10 p-8">

                    <div className="mt-6 flex justify-between items-start  mx-8">
                        <h1 className="font-bold text-3xl text-gray-800">Write a title for your job!</h1>

                        <input
                            type="text"
                            className="border-2 border-gray-400 rounded-lg w-[40%] h-12 px-4 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-300"
                            placeholder="Type your job name here"
                        />

                    </div>
                    <div className="text-gray-600 mx-8">
                        <p className="text-lg font-medium mb-2">Example:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Full Stack Web Developer</li>
                            <li>Data Scientist</li>
                            <li>AI Designer</li>
                        </ul>
                    </div>
                </div>


                {/* Job Requirement Section */}
                <div className="shadow-lg border-2 border-gray-400 rounded-xl bg-white w-[55vw] mt-2 p-8">
                    <h1 className="font-bold text-3xl text-gray-800 mb-6 mx-8 mt-6">
                        What requirements are needed for your work?
                    </h1>

                    {/* Input requirements dynamically */}
                    <div className="space-y-4 mx-8">
                        {requirements.map((req, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={req}
                                    onChange={(e) => updateRequirement(index, e.target.value)}
                                    className="border-2 border-gray-400 rounded-lg w-full h-12 px-4 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-300"
                                    placeholder={`Requirement ${index + 1}`}
                                />
                                {requirements.length > 1 && (
                                    <button
                                        onClick={() => removeRequirement(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash size={24} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add Requirement Button */}
                    <button
                        onClick={addRequirement}
                        className="mt-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 mx-8"
                    >
                        <Plus size={20} />
                        Add Requirement
                    </button>

                    <div className="text-gray-600 mt-6 mx-8">
                        <p className="text-lg font-medium mb-2">Example:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Know about GitHub and can use it</li>
                            <li>Understand the Java programming language</li>
                            <li>Good at UI/UX</li>
                        </ul>
                    </div>
                </div>


                {/* Job Category Section */}
                <div className="shadow-lg border-2 border-gray-400 rounded-xl bg-white w-[55vw] mt-2 p-8">

                    <div className="flex justify-between mx-8 mt-6">

                        <h1 className="font-bold text-3xl text-gray-800 mb-4 w-[55%]">
                            Write or select some categories for your job!
                        </h1>

                        {/* Input Custom Category */}
                        <form onSubmit={handleCustomCategory} className="flex items-center gap-3">
                            <input
                                type="text"
                                value={customCategory}
                                onChange={(e) => setCustomCategory(e.target.value)}
                                className="border-2 border-gray-400 rounded-lg w-[100%] h-12 px-4 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-300"
                                placeholder="Type your custom category here"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                            >
                                Add
                            </button>
                        </form>
                    </div>



                    <div className="flex mx-8">
                        {/* Job Category List */}
                        <div className="text-gray-600 mt-2 w-[50%]">
                            <p className="text-lg font-medium mb-2">Job category list:</p>
                            <div className="flex flex-wrap gap-3">
                                {jobCategory.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => addCategory(category)}
                                        className="border-2 border-gray-400 rounded-lg px-4 py-2 text-gray-700 bg-gray-100 hover:bg-blue-500 hover:text-white transition-all duration-300"
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Selected Categories */}
                        {selectedCategories.length > 0 && (
                            <div className="mt-2 gap-2 w-[50%]">
                                <p className="text-lg font-medium mb-2">Selected job category:</p>
                                <div className="flex flex-wrap gap-3">

                                    {selectedCategories.map((category) => (
                                        <button
                                            key={category}
                                            className="  bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-300 gap-3 flex items-center"
                                        >
                                            {category}
                                            <button
                                                onClick={() => removeCategory(category)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                <X size={16} />
                                            </button>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="shadow-lg border-2 border-gray-400 rounded-xl bg-white w-[55vw] mt-10 p-8">

                    <div className="mt-6 flex justify-between items-start  mx-8">
                        <h1 className="font-bold text-3xl text-gray-800">Give a Salary for your job!</h1>

                        <input
                            type="number"
                            className="border-2 border-gray-400 rounded-lg w-[40%] h-12 px-4 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-300"
                            placeholder="Insert number of your job salary here"
                        />

                    </div>
                    <div className="text-gray-600 mx-8">
                        <p className="text-lg font-medium mb-2 w-[50%]">Fill in the salary according to the weight of the work so that your work looks attractive in the eyes of freelancers</p>

                    </div>
                </div>

                <div className="shadow-lg border-2 border-gray-400 rounded-xl bg-white w-[55vw] mt-10 p-8">

                    <div className="mt-6 flex justify-between items-start  mx-8">
                        <h1 className="font-bold text-3xl text-gray-800 w-[50%]">How many applier that you want your job !</h1>

                        <input
                            type="number"
                            className="border-2 border-gray-400 rounded-lg w-[40%] h-12 px-4 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-300"
                            placeholder="Insert number of your job salary here"
                        />

                    </div>
                    <div className="text-gray-600 mx-8 mt-4">
                        <p className="text-lg font-medium mb-2 w-[50%]">Fill in the salary according to the weight of the work so that your work looks attractive in the eyes of freelancers</p>

                    </div>
                </div>

                <div className="shadow-lg border-2 border-gray-400 rounded-xl bg-white w-[55vw] mt-10 p-8">

                    <div className="mt-6 flex flex-col items-start  mx-8">
                        <h1 className="font-bold text-xl text-gray-800 w-[50%]">Check all the data before you post or create the job!</h1>

                        <div className="mt-4 flex justify-between w-[100%]">
                            <p className="text-lg font-medium mb-2 w-[50%]">If all the data is correct, press the button to create the job</p>
                            <button className="mt-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 mx-8"
                            >Post Job</button>
                        </div>

                    </div>
                </div>

            </div>

            {/* Footer Section */}
            <div>
                <Footer />
            </div>
        </div>
    );
}