import { jsx as _jsx } from "react/jsx-runtime";
import FaceRecognition from "../../components/FaceRecognition.js";
const LoginFace = () => {
    const handleSuccess = () => {
        console.log('Operation successful!');
    };
    const handleError = (error) => {
        console.error('Operation failed:', error);
    };
    return (_jsx(FaceRecognition, { principalId: "", onSuccess: handleSuccess, onError: handleError, mode: "verify", isOpen: true, onClose: () => { } }));
};
export default LoginFace;
