import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchUserBySession } from "../../controller/userController.js";
const RegisterFace = () => {
    const handleSuccess = () => {
        console.log("Operation successful!");
    };
    const handleError = (error) => {
        console.error("Operation failed:", error);
    };
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const user = await fetchUserBySession();
                setCurrentUser(user);
            }
            catch (error) {
                console.error("Error fetching current user:", error);
            }
        };
        fetchCurrentUser();
    }, []);
    return (_jsx(_Fragment, {})
    // <FaceRecognition
    //   principalId={currentUser?.id ?? ''}
    //   onSuccess={handleSuccess}
    //   onError={handleError}
    //   mode="register"
    // />
    );
};
export default RegisterFace;
