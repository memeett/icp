import { jsx as _jsx } from "react/jsx-runtime";
import FaceRecognition from "../../components/FaceRecognition.js";
const FaceTes = () => {
    const handleSuccess = () => {
        console.log("Operation successful!");
    };
    const handleError = (error) => {
        console.error("Operation failed:", error);
    };
    return (_jsx(FaceRecognition, { principalId: "user1234", onSuccess: handleSuccess, onError: handleError, mode: "register", isOpen: true, onClose: () => { } }));
};
export default FaceTes;
