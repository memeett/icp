import React from "react";

// Define the props interface
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPay: () => void;
    amount: number;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onPay, amount }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-md z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Payment Required</h2>
                <p className="text-gray-700 mb-6">
                    You need to transfer <span className="font-bold">${amount.toFixed(2)}</span> to start the job.
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <button
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                        onClick={onPay}
                    >
                        Pay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;