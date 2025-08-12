import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { memo, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal as AntModal, Button, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
const ModalContext = createContext(null);
const useModalContext = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('Modal compound components must be used within Modal');
    }
    return context;
};
const ModalComponent = memo(({ open, onClose, children, width = 520, centered = true, closable = true, maskClosable = true, loading = false, className = '', destroyOnClose = true }) => {
    const contextValue = {
        onClose,
        loading
    };
    return (_jsx(ModalContext.Provider, { value: contextValue, children: _jsx(AntModal, { open: open, onCancel: onClose, width: width, centered: centered, closable: closable, maskClosable: maskClosable, footer: null, className: `custom-modal ${className}`, destroyOnClose: destroyOnClose, styles: {
                mask: {
                    backdropFilter: 'blur(4px)',
                },
            }, modalRender: (modal) => (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8, y: -50 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.8, y: -50 }, transition: {
                    type: 'spring',
                    damping: 25,
                    stiffness: 300,
                    duration: 0.3
                }, children: modal })), children: _jsx(AnimatePresence, { mode: "wait", children: open && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.2, delay: 0.1 }, children: children })) }) }) }));
});
const ModalHeader = memo(({ children, closable = true, className = '' }) => {
    const { onClose } = useModalContext();
    return (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 }, className: `flex items-center justify-between p-6 pb-4 ${className}`, children: [_jsx("div", { className: "flex-1", children: typeof children === 'string' ? (_jsx("h2", { className: "text-xl font-semibold text-gray-900 m-0", children: children })) : (children) }), closable && (_jsx(motion.div, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, children: _jsx(Button, { type: "text", icon: _jsx(CloseOutlined, {}), onClick: onClose, className: "ml-4 hover:bg-gray-100 rounded-full" }) }))] }));
});
const ModalBody = memo(({ children, className = '', padding = true }) => {
    return (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3, delay: 0.1 }, className: `${padding ? 'px-6 py-4' : ''} ${className}`, children: children }));
});
const ModalFooter = memo(({ children, className = '', align = 'right' }) => {
    const alignmentClasses = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end'
    };
    return (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, delay: 0.2 }, className: `flex ${alignmentClasses[align]} p-6 pt-4 border-t border-gray-100 ${className}`, children: children }));
});
const ModalActions = memo(({ onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', confirmType = 'primary', confirmDanger = false, loading, disabled = false, className = '' }) => {
    const { onClose, loading: contextLoading } = useModalContext();
    const isLoading = loading ?? contextLoading;
    const handleCancel = useCallback(() => {
        onCancel?.();
        onClose();
    }, [onCancel, onClose]);
    return (_jsx(ModalFooter, { className: className, children: _jsxs(Space, { children: [_jsx(motion.div, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, children: _jsx(Button, { onClick: handleCancel, disabled: isLoading, children: cancelText }) }), onConfirm && (_jsx(motion.div, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, children: _jsx(Button, { type: confirmType, danger: confirmDanger, onClick: onConfirm, loading: isLoading, disabled: disabled, children: confirmText }) }))] }) }));
});
// Create the compound component
const Modal = ModalComponent;
// Set display names
Modal.displayName = 'Modal';
ModalHeader.displayName = 'Modal.Header';
ModalBody.displayName = 'Modal.Body';
ModalFooter.displayName = 'Modal.Footer';
ModalActions.displayName = 'Modal.Actions';
// Attach compound components
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.Actions = ModalActions;
export default Modal;
// Export individual components for direct use
export { ModalHeader, ModalBody, ModalFooter, ModalActions };
// Utility hook for modal state management
export const useModal = (initialOpen = false) => {
    const [open, setOpen] = React.useState(initialOpen);
    const openModal = useCallback(() => setOpen(true), []);
    const closeModal = useCallback(() => setOpen(false), []);
    const toggleModal = useCallback(() => setOpen(prev => !prev), []);
    return {
        open,
        openModal,
        closeModal,
        toggleModal,
        setOpen
    };
};
// Pre-built modal variants
export const ConfirmModal = ({ open, onClose, onConfirm, title, content, confirmText = 'Confirm', cancelText = 'Cancel', danger = false, loading = false }) => (_jsxs(Modal, { open: open, onClose: onClose, width: 400, children: [_jsx(Modal.Header, { children: title }), _jsx(Modal.Body, { children: content }), _jsx(Modal.Actions, { onConfirm: onConfirm, confirmText: confirmText, cancelText: cancelText, confirmDanger: danger, loading: loading })] }));
