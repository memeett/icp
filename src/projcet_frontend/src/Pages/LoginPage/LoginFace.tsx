import FaceRecognition from "../../components/FaceRecognition.js";

const LoginFace = () => {
  const handleSuccess = () => {
    console.log('Operation successful!');
  };

  const handleError = (error: string) => {
    console.error('Operation failed:', error);
  };

  return (
    <FaceRecognition
      principalId=""
      onSuccess={handleSuccess}
      onError={handleError}
      mode="verify" 
      isOpen={true}
      onClose={() => {}}
      
    />
  );
};

export default LoginFace;
