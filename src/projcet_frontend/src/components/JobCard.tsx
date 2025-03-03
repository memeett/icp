import { Job } from "../../../declarations/job/job.did";

import { addIncrementUserClicked } from "../controller/userClickedController";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";


export default function JobCard({ job }: { job: Job }) {

    const nav = useNavigate();

    const viewDetails = useCallback(() => {
        nav("/jobs/" + job.id);
    }, [nav]);

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto border border-gray-200 relative">
            <div className="flex justify-between items-center border-b pb-3 mb-3">
                <p className="text-lg font-semibold text-gray-800">{job.jobName}</p>
                {/* <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-lg">{job.jobTags}</span> */}
            </div>

            <div className="grid grid-cols-2 gap-4 text-gray-600 mb-4">
                <p className="font-medium">{job.jobSalary}$</p>
                <p className="font-medium">Slots: {Number(job.jobSlots)} 🙎‍♂️</p>
            </div>

            <ul className="text-gray-700 mb-12">
                {job.jobDescription.map((tag) => (
                    <li>{tag}</li>
                ))}
            </ul>

            {/* Button Positioned at Bottom Right */}

            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition absolute bottom-4 right-4" onClick={() => {
    addIncrementUserClicked(job.id);
    viewDetails();
  }}>

                View Details
            </button>
        </div>



    );
}