import { useEffect, useState } from "react";
import FaceRecognition from "../../components/FaceRecognition.js";
import { User } from "../../interface/User.js";
import { fetchUserBySession } from "../../controller/userController.js";

const RegisterFace = () => {
  const handleSuccess = () => {
    console.log("Operation successful!");
  };

  const handleError = (error: string) => {
    console.error("Operation failed:", error);
  };

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await fetchUserBySession();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <></>
    // <FaceRecognition
    //   principalId={currentUser?.id ?? ''}
    //   onSuccess={handleSuccess}
    //   onError={handleError}
    //   mode="register"
    // />
  );
};

export default RegisterFace;
