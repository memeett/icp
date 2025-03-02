import FaceRecognition from "../../components/FaceRecognition.js";

const FaceTes = () => {
  const handleSuccess = () => {
    console.log('Operation successful!');
  };

  const handleError = (error: string) => {
    console.error('Operation failed:', error);
  };

  return (
    <FaceRecognition
      principalId="user1234"
      onSuccess={handleSuccess}
      onError={handleError}
      mode="register" 
    />
  );
};

export default FaceTes;
