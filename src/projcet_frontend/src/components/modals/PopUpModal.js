import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useModal } from "../../contexts/modal-context";
import { ModalBody, ModalContent, ModalFooter } from "../ui/animated-modal";
export function PopUpModal({ res, loading }) {
    const { open, setOpen } = useModal();
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-opacity-50 flex items-center justify-center z-50", children: _jsx(ModalBody, { className: "flex flex-column items-center space-x-4", children: _jsxs(ModalContent, { className: "max-w-2xl mx-auto bg-[#F9F7F7] w-[40vw] h-[40vh] flex flex-col justify-between", children: [_jsx("div", { className: "space-y-8 px-8 pt-8 pb-6", children: _jsx("div", { className: "text-center", children: loading ? (_jsxs("div", { className: "flex flex-col items-center justify-center", children: [_jsx("div", { className: "animate-spin rounded-full h-15 w-15 border-b-2 mt-10 border-[#112D4E]" }), _jsx("p", { className: "mt-4 text-[#112D4E] text-2xl", children: "Posting Job..." })] })) : (_jsxs(_Fragment, { children: [_jsx("h3", { className: "text-3xl font-bold text-[#112D4E] border-b-2 border-[#112D4E] pb-6", children: res[0] }), _jsx("p", { className: "mt-20 text-[#112D4E] text-3xl", children: res[1] })] })) }) }), !loading && (_jsx(ModalFooter, { className: "flex items-center justify-center mt-2 p-0", children: _jsx("div", { onClick: () => setOpen(false), className: "w-full h-full text-lg text-center font-semibold rounded-b-2xl border-b border-b-[#112D4E] text-black transition-colors hover:text-white hover:bg-[#D9534F] hover:border-[#D9534F] py-4 cursor-pointer", children: "Close" }) }))] }) }) }));
}
