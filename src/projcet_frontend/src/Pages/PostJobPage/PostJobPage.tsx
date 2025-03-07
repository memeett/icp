import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
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
import Footer from "../../components/Footer.tsx";
import LoadingOverlay from "../../components/ui/loading-animation.tsx";

const CreateJobPageContent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [jobName, setJobName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [customCategory, setCustomCategory] = useState("");
  const [jobSalary, setJobSalary] = useState<number | null>(null);
  const [jobSlots, setJobSlots] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const [modalMessage, setModalMessage] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    // Job Title Validation
    if (step === 1) {
      const trimmedName = jobName.trim();
      if (!trimmedName) {
        newErrors.jobName = "Job title is required";
      } else if (trimmedName.length < 3) {
        newErrors.jobName = "Job title must be at least 3 characters";
      } else if (trimmedName.length > 100) {
        newErrors.jobName = "Job title cannot exceed 100 characters";
      }
    }

    // Categories Validation
    if (step === 3) {
      if (selectedCategories.length === 0) {
        newErrors.categories = "Please select at least one category";
      } else if (selectedCategories.length > 3) {
        newErrors.categories = "Maximum 3 categories allowed";
      }
    }

    // Job Slots Validation
    if (step === 4) {
      if (jobSlots === null || jobSlots <= 0) {
        newErrors.slots = "Please enter a valid number of applicants needed";
      } else if (!Number.isInteger(jobSlots)) {
        newErrors.slots = "Must be a whole number";
      } else if (jobSlots > 1000) {
        newErrors.slots = "Maximum 1000 applicants allowed";
      }
    }

    // Salary Validation
    if (step === 5) {
      if (jobSalary === null || jobSalary <= 0) {
        newErrors.salary = "Please enter a valid salary amount";
      } else if (jobSalary > 1000000) {
        newErrors.salary = "Maximum salary allowed is $1,000,000";
      } else if (jobSalary < 1) {
        newErrors.salary = "Salary must be at least $1";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update handleSubmit to validate correct step
  const handleSubmit = () => {
    if (validateStep(5)) {
      // Changed from 4 to 5
      setLoading(true);
      createJob(
        jobName.trim(),
        requirements,
        selectedCategories,
        jobSalary!, // Now guaranteed by validation
        jobSlots! // Now guaranteed by validation
      )
        .then(setModalMessage)
        .catch(setModalMessage)
        .finally(() => {
          setLoading(false);
          navigate(-1);
        });
    }
  };
  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  return (
    <div className="flex-grow w-full">
      <div>
        {loading && <LoadingOverlay message="Creating your job.." />}

        <div className="flex flex-row max-w-5xl mx-auto px-8 pt-8 min-h-[80vh]">
          {/* Enhanced Step Indicator with Labels */}
          <motion.div
            className="min-h-[80vh] z-40 bg-white/80 backdrop-blur-lg py-4 rounded-4xl shadow-lg mr-[2vw] flex flex-col justify-center items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="gap-4 py-2 px-4">
              {[
                { step: 1, label: "Job Title" },
                { step: 2, label: "Requirements" },
                { step: 3, label: "Categories" },
                { step: 4, label: "Applicants" },
                { step: 5, label: "Salary" },
              ].map(({ step, label }) => (
                <div
                  key={step}
                >
                  <div className="flex flex-col items-center justify-center">
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
                    <span
                      className={`text-sm w-24 text-center ${
                        currentStep >= step
                          ? "text-gray-700 font-medium"
                          : "text-gray-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {step < 5 && (
                    <div className="flex justify-center">

                      <div className="h-8 w-1 bg-gray-200 rounded-full flex justify-center">
                        <div
                          className={`h-full transition-all duration-500 ${
                            currentStep > step
                            ? "bg-purple-500"
                            : "bg-transparent"
                          }`}
                          style={{ width: `${currentStep > step ? 100 : 0}%` }}
                          />
                      </div>
                          </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Container with Enhanced Header */}
          <motion.div
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mx-auto w-full max-w-3xl flex flex-col relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Progress Header */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ChevronLeft size={24} />
                  <span className="font-medium">Back to Dashboard</span>
                </button>
                <span className="text-sm text-gray-500">
                  Step {currentStep} of 5
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                  Create New Job
                </h1>
                <p className="text-gray-600">
                  Fill in the details to create your perfect job posting
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep - 1) * 25}%` }}
                />
              </div>
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

            {/* Enhanced Navigation Buttons */}
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
        <main className="relative mb-12">
          <CreateJobPageContent />
        </main>
        <Footer />
      </div>
    </ModalProvider>
  );
}
