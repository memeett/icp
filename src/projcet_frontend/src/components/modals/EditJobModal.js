"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ModalBody, ModalContent } from "../ui/animated-modal";
import { FiPlus, FiMinus, FiDollarSign, FiUsers } from "react-icons/fi";
import { useModal } from "../../contexts/modal-context";
import { updateJob } from "../../controller/jobController";
const EditJobForm = ({ job, onSave, onCancel, refreshData, modalIndex }) => {
    const { open, setOpen, closeModal } = useModal();
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        jobName: "",
        jobDescription: [],
        jobSalary: 0,
        jobSlots: 1,
        jobTags: [],
        userId: "",
    });
    const [jobStatus, setJobStatus] = useState(job?.jobStatus || "Start");
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
        return _jsx("div", { children: "Loading..." });
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "jobName" ? value : value,
        }));
    };
    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: Number(value),
        }));
    };
    const handleDescriptionChange = (index, value) => {
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
    const removeDescriptionItem = (index) => {
        const updatedDescriptions = [...(formData.jobDescription || [])];
        updatedDescriptions.splice(index, 1);
        setFormData(prev => ({
            ...prev,
            jobDescription: updatedDescriptions,
        }));
    };
    const toggleCategory = (category) => {
        const currentTags = [...(formData.jobTags || [])];
        const existingTagIndex = currentTags.findIndex(tag => tag.id === category.id);
        if (existingTagIndex >= 0) {
            currentTags.splice(existingTagIndex, 1);
        }
        else {
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
        }
        else {
            setOpen(false);
        }
        onCancel();
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.jobName && formData.jobDescription && formData.jobSalary !== undefined && formData.jobSlots !== undefined) {
            try {
                if (job?.id) {
                    const updatedJobData = await updateJob(job.id, formData.jobName, formData.jobDescription, formData.jobTags?.map(tag => tag.jobCategoryName) || [], formData.jobSalary, formData.jobSlots, jobStatus);
                }
                if (refreshData) {
                    refreshData();
                }
                handleClose();
            }
            catch (error) {
                console.error("Error saving job:", error);
            }
        }
    };
    if (!open && modalIndex === undefined)
        return null;
    return (_jsx("div", { className: "hidden md:flex flex-column items-center space-x-4", children: _jsx(ModalBody, { className: "flex flex-column items-center space-x-4", children: _jsx(ModalContent, { className: "w-full max-w-2xl mx-auto bg-[#F9F7F7] rounded-2xl", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "space-y-2 px-8 pt-6", children: [_jsx("label", { className: "block text-lg font-medium text-[#112D4E]", children: "Job Name" }), _jsx("input", { type: "text", name: "jobName", value: formData.jobName, onChange: handleInputChange, className: "w-full p-2 border rounded-md", required: true })] }), _jsxs("div", { className: "space-y-2 px-8", children: [_jsx("label", { className: "block text-lg font-medium text-[#112D4E]", children: "Job Description" }), (formData.jobDescription || []).map((desc, index) => (_jsxs("div", { className: "flex gap-2", children: [_jsx("textarea", { value: desc, onChange: (e) => handleDescriptionChange(index, e.target.value), className: "w-full p-2 border rounded-md", rows: 2 }), _jsx("button", { type: "button", onClick: () => removeDescriptionItem(index), className: "text-red-500", children: _jsx(FiMinus, {}) })] }, index))), _jsxs("button", { type: "button", onClick: addDescriptionItem, className: "flex items-center text-[#112D4E]", children: [_jsx(FiPlus, { className: "mr-1" }), " Add Description"] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 px-8", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-lg font-medium text-[#112D4E]", children: "Salary" }), _jsxs("div", { className: "relative", children: [_jsx(FiDollarSign, { className: "absolute left-3 top-1/2 transform -translate-y-1/2" }), _jsx("input", { type: "number", name: "jobSalary", value: formData.jobSalary, onChange: handleNumberChange, className: "w-full pl-10 p-2 border rounded-md", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-lg font-medium text-[#112D4E]", children: "Available Slots" }), _jsxs("div", { className: "relative", children: [_jsx(FiUsers, { className: "absolute left-3 top-1/2 transform -translate-y-1/2" }), _jsx("input", { type: "number", name: "jobSlots", value: formData.jobSlots, onChange: handleNumberChange, className: "w-full pl-10 p-2 border rounded-md", required: true })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 border-t border-gray-200", children: [_jsx("button", { type: "button", onClick: handleClose, className: "py-4 text-lg font-semibold text-center hover:bg-red-500 hover:text-white transition-colors rounded-bl-2xl", children: "Cancel" }), _jsx("button", { type: "submit", className: "py-4 text-lg font-semibold text-center hover:bg-green-500 hover:text-white transition-colors rounded-br-2xl", children: "Save" })] })] }) }) }) }));
};
export default EditJobForm;
