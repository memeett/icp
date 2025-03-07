import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

const FinishJobModal = ({ isOpen, onClose, onConfirm, isLoading }: {isOpen: boolean; onClose : ()=>void; onConfirm : () => void; isLoading: boolean}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-800 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={24} />
            Finish Job
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            disabled={isLoading}
          >
            <XCircle size={24} />
          </button>
        </div>

        <div className="mb-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4">
            <p className="text-amber-800 font-medium">
              Are you sure you want to finish this job?
            </p>
          </div>
          <p className="text-gray-600">
            This action will mark the job as completed and trigger payment to all accepted freelancers. This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-4 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Confirm
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FinishJobModal;