"use client";
import React, { useState, useEffect } from "react";
import { ModalBody, ModalContent, ModalFooter } from "../ui/animated-modal";
import { motion } from "framer-motion";
import { TagIcon } from "lucide-react";
import { FiPlus, FiMinus, FiDollarSign, FiStar, FiUsers } from "react-icons/fi";
import { useModal } from "../../contexts/modal-context";
import { updateJob } from "../../controller/jobController";
import { Job, JobCategory } from "../../interface/job/Job";
import { UpdateJobPayload } from "../../interface/job/UpdatedJobPayload";

interface EditJobFormProps {
    job: Job | null;
    onSave: (updatedJob: Job) => void;
    onCancel: () => void;
    refreshData?: () => void;
    modalIndex?: number;
  }

const EditJobForm = ({ job, onSave, onCancel, refreshData, modalIndex }: EditJobFormProps) => {
  const { open, setOpen, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<UpdateJobPayload>({
    jobName: "",
    jobDescription: [],
    jobSalary: 0,
    jobSlots: 1,
    jobTags: [],
    userId: "",
  });
  const [jobStatus, setJobStatus] = useState<string>(job?.jobStatus || "Start");

  useEffect(() => {
    if (job) {
      setFormData({
        jobName: job.jobName || "",
        jobDescription: job.jobDescription || [],
        jobSalary: job.jobSalary || 0,
        jobSlots: typeof job.jobSlots === 'bigint' ? Number(job.jobSlots) : job.jobSlots !== undefined ? Number(job.jobSlots) : 1,
        jobTags: job.jobTags || [],
        userId: job.userId || "",
      });
      setJobStatus(job.jobStatus || "Start");
      setIsLoading(false);
    }
  }, [job]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "jobName" ? value : value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const updatedDescriptions = [...(formData.jobDescription || [])];
    updatedDescriptions[index] = value;
    setFormData(prev => ({
      ...prev,
      jobDescription: updatedDescriptions,
    }));
  };

  const addDescriptionItem = () => {
    setFormData(prev => ({
      ...prev,
      jobDescription: [...(prev.jobDescription || []), ""],
    }));
  };

  const removeDescriptionItem = (index: number) => {
    const updatedDescriptions = [...(formData.jobDescription || [])];
    updatedDescriptions.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      jobDescription: updatedDescriptions,
    }));
  };

  const toggleCategory = (category: JobCategory) => {
    const currentTags = [...(formData.jobTags || [])];
    const existingTagIndex = currentTags.findIndex(tag => tag.id === category.id);
    
    if (existingTagIndex >= 0) {
      currentTags.splice(existingTagIndex, 1);
    } else {
      currentTags.push(category);
    }
    
    setFormData(prev => ({
      ...prev,
      jobTags: currentTags,
    }));
  };

  const handleClose = () => {
    if (modalIndex !== undefined) {
      closeModal(modalIndex);
    } else {
      setOpen(false);
    }
    onCancel();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.jobName && formData.jobDescription && formData.jobSalary !== undefined && formData.jobSlots !== undefined) {
      try {
        if (job?.id) {
          const updatedJobData = await updateJob(
            job.id,
            formData.jobName,
            formData.jobDescription,
            formData.jobTags?.map(tag => tag.jobCategoryName) || [],
            formData.jobSalary,
            formData.jobSlots,
            jobStatus
          );

    
        }
        
        if (refreshData) {
          refreshData();
        }
        
        handleClose();
      } catch (error) {
        console.error("Error saving job:", error);
      }
    }
  };

  if (!open && modalIndex === undefined) return null;

  return (
    <div className="hidden md:flex flex-column items-center space-x-4">
    <ModalBody className="flex flex-column items-center space-x-4">
      <ModalContent className="w-full max-w-2xl mx-auto bg-[#F9F7F7] rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Name Input */}

          <div className="space-y-2 px-8 pt-6">
            <label className="block text-lg font-medium text-[#112D4E]">
              Job Name
            </label>
            <input
              type="text"
              name="jobName"
              value={formData.jobName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Job Description Section */}
          <div className="space-y-2 px-8">
            <label className="block text-lg font-medium text-[#112D4E]">
              Job Description
            </label>
            {(formData.jobDescription || []).map((desc, index) => (
              <div key={index} className="flex gap-2">
                <textarea
                  value={desc}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={2}
                />
                <button
                  type="button"
                  onClick={() => removeDescriptionItem(index)}
                  className="text-red-500"
                >
                  <FiMinus />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDescriptionItem}
              className="flex items-center text-[#112D4E]"
            >
              <FiPlus className="mr-1" /> Add Description
            </button>
          </div>

          {/* Salary and Slots */}
          <div className="grid grid-cols-2 gap-4 px-8">
            <div>
              <label className="block text-lg font-medium text-[#112D4E]">
                Salary
              </label>
              <div className="relative">
                <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="number"
                  name="jobSalary"
                  value={formData.jobSalary}
                  onChange={handleNumberChange}
                  className="w-full pl-10 p-2 border rounded-md"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-[#112D4E]">
                Available Slots
              </label>
              <div className="relative">
                <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="number"
                  name="jobSlots"
                  value={formData.jobSlots}
                  onChange={handleNumberChange}
                  className="w-full pl-10 p-2 border rounded-md"
                  required
                />
              </div>
            </div>
          </div>

          {/* Job Status */}
          <div className="space-y-2 px-8 pb-4">
            <label className="block text-lg font-medium text-[#112D4E]">
              Job Status
            </label>
            <div className="flex space-x-4">
              {["Start", "Pending", "Completed"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setJobStatus(status)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    jobStatus === status 
                      ? 'bg-[#112D4E] text-white' 
                      : 'bg-transparent border-2 border-[#112D4E] text-[#112D4E]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Form Footer */}
          <div className="grid grid-cols-2 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="py-4 text-lg font-semibold text-center hover:bg-red-500 hover:text-white transition-colors rounded-bl-2xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-4 text-lg font-semibold text-center hover:bg-green-500 hover:text-white transition-colors rounded-br-2xl"
            >
              Save
            </button>
          </div>
        </form>
      </ModalContent>
      </ModalBody>
    </div>
  );
};

export default EditJobForm;
