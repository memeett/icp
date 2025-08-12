import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { activeModalAtom, modalDataAtom } from '../../app/store/ui';
export const useModal = () => {
    const [activeModal, setActiveModal] = useAtom(activeModalAtom);
    const [modalData, setModalData] = useAtom(modalDataAtom);
    const openModal = useCallback((modalId, data) => {
        setActiveModal(modalId);
        setModalData(data || null);
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
    }, [setActiveModal, setModalData]);
    const closeModal = useCallback(() => {
        setActiveModal(null);
        setModalData(null);
        // Restore body scrolling when modal is closed
        document.body.style.overflow = 'auto';
    }, [setActiveModal, setModalData]);
    const isModalOpen = useCallback((modalId) => {
        return activeModal === modalId;
    }, [activeModal]);
    return {
        activeModal,
        modalData,
        openModal,
        closeModal,
        isModalOpen,
    };
};
// Specific modal hooks for common modals
export const useAuthModal = () => {
    const { openModal, closeModal, isModalOpen } = useModal();
    return {
        openLoginModal: () => openModal('login'),
        openRegisterModal: () => openModal('register'),
        openForgotPasswordModal: () => openModal('forgotPassword'),
        closeAuthModal: closeModal,
        isLoginModalOpen: isModalOpen('login'),
        isRegisterModalOpen: isModalOpen('register'),
        isForgotPasswordModalOpen: isModalOpen('forgotPassword'),
    };
};
export const useJobModal = () => {
    const { openModal, closeModal, isModalOpen, modalData } = useModal();
    return {
        openJobDetailModal: (jobId) => openModal('jobDetail', { jobId }),
        openJobApplicationModal: (jobId) => openModal('jobApplication', { jobId }),
        openJobEditModal: (jobId) => openModal('jobEdit', { jobId }),
        closeJobModal: closeModal,
        isJobDetailModalOpen: isModalOpen('jobDetail'),
        isJobApplicationModalOpen: isModalOpen('jobApplication'),
        isJobEditModalOpen: isModalOpen('jobEdit'),
        jobModalData: modalData,
    };
};
export const useConfirmModal = () => {
    const { openModal, closeModal, isModalOpen, modalData } = useModal();
    return {
        openConfirmModal: (config) => openModal('confirm', config),
        closeConfirmModal: closeModal,
        isConfirmModalOpen: isModalOpen('confirm'),
        confirmModalData: modalData,
    };
};
