import FaceRecognition from "../../components/FaceRecognition.js";

const FaceTes = () => {
  const handleSuccess = () => {
    console.log("Operation successful!");
  };

  const handleError = (error: string) => {
    console.error("Operation failed:", error);
  };

  return (
    <FaceRecognition
      principalId="user1234"
      onSuccess={handleSuccess}
      onError={handleError}
      mode="register"
      isOpen={true}
      onClose={() => {}}
    />
  );
};

export default FaceTes;
