import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ModalProvider, useModal } from "../../contexts/modal-context.tsx";
import { JobNameStep } from "./JobName.tsx";
import { CategoriesStep } from "./CategoriesStep.tsx";
import { JobSalaryStep } from "./JobSalary.tsx";
import { JobSlotsStep } from "./JobSlot.tsx";
import Navbar from "../../components/Navbar";
import { createJob } from "../../controller/jobController.ts";
import { PopUpModal } from "../../components/modals/PopUpModal.tsx";
import { RequirementsStep } from "./Requirements.tsx";
import { useNavigate } from "react-router-dom";
import { createJobTransaction } from "../../controller/freelancerController.ts";
import { authUtils } from "../../utils/authUtils.tsx";

const BackgroundPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-10"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path
          d="M 20 0 L 0 0 0 20"
          fill="none"
          stroke="black"
          strokeWidth="1"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

const CreateJobPageContent = () => {
  const { setOpen } = useModal();
  const [currentStep, setCurrentStep] = useState(1);
  const [jobName, setJobName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [customCategory, setCustomCategory] = useState("");
  const [jobSalary, setJobSalary] = useState<number | null>(null);
  const [jobSlots, setJobSlots] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const STEP_DICTIONARY: Record<number, string> = {
    1: "Information",
    2: "Requirements",
    3: "Category",
    4: "Slot",
    5: "Salary",
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 1 && !jobName.trim())
      newErrors.jobName = "Job title is required";
    if (step === 3 && selectedCategories.length === 0)
      newErrors.categories = "Select at least one category";
    if (step === 4 && (!jobSlots || jobSlots <= 0))
      newErrors.slots = "Enter valid applicant number";
    if (step === 5 && (!jobSalary || jobSalary <= 0))
      newErrors.salary = "Enter valid salary";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const [modalMessage, setModalMessage] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUser = authUtils().current_user;
  const handleSubmit = () => {
    if (validateStep(4)) {
      // Add your submission logic here
      setLoading(true);
      setOpen(true);

      createJob(
        jobName,
        requirements,
        selectedCategories,
        jobSalary ? jobSalary : 0,
        jobSlots ? jobSlots : 0
      )
        .then((res) => {
          setModalMessage(res);
        })
        .catch((err) => {
          setModalMessage(err);
        })
        .finally(() => {
          setLoading(false);
          navigate(-1);
        });

      // createJobTransaction(
      //   currentUser,
        
      // )
    }
  };

  return (
    <div className="relative flex-grow w-full">
      <div>
        <div className="flex flex-row max-w-4xl mx-auto px-4 pt-8 min-h-[80vh]">
          {/* Enhanced Step Indicator */}
          <motion.div
            className="min-h-[80vh] z-40 bg-white/80 backdrop-blur-lg py-4 rounded-3xl shadow-lg mr-[2vw]  flex flex-col justify-center items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className=" gap-4 py-2 px-4">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center 
                    ${
                      currentStep >= step
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-400"
                    }`}
                    >
                      {step}
                    </div>
                  </div>
                  {step < 5 && (
                    <div className="h-8 w-1 bg-gray-200 rounded-full">
                      <div
                        className={`h-full transition-all duration-500 ${
                          currentStep > step
                            ? "bg-purple-500"
                            : "bg-transparent"
                        }`}
                        style={{ width: `${currentStep > step ? 100 : 0}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Container */}
          <motion.div
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mx-auto w-full max-w-3xl flex flex-col "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                Create New Job
              </h1>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto">
              {currentStep === 1 && (
                <JobNameStep
                  {...{ jobName, setJobName, error: errors.jobName }}
                />
              )}
              {currentStep === 2 && (
                <RequirementsStep
                  requirements={requirements}
                  setRequirements={setRequirements}
                />
              )}
              {currentStep === 3 && (
                <CategoriesStep
                  {...{
                    selectedCategories,
                    setSelectedCategories,
                    customCategory,
                    setCustomCategory,
                    error: errors.categories,
                  }}
                />
              )}
              {currentStep === 4 && (
                <JobSlotsStep
                  {...{ jobSlots, setJobSlots, error: errors.slots }}
                />
              )}
              {currentStep === 5 && (
                <JobSalaryStep
                  {...{ jobSalary, setJobSalary, error: errors.salary }}
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex justify-between">
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-200 hover:bg-red-300 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex flex-row gap-x-[2vh]">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentStep((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all"
                    >
                      Continue{" "}
                      <ChevronRight size={20} className="ml-2 inline" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-12 py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 text-white hover:shadow-lg"
                    >
                      Post Job
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <PopUpModal res={modalMessage} loading={loading} />
    </div>
  );
};

export default function CreateJobPage() {
  return (
    <ModalProvider>
      <div className="relative  min-h-screen bg-[#F9F7F7] bg-gradient-to-br from-blue-100/50 to-purple-100/50 ">
        <Navbar />
        <BackgroundPattern />
        <main className="relative">
          <CreateJobPageContent />
        </main>
      </div>
    </ModalProvider>
  );
}
