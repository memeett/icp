import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Modal, Button, Progress, Typography, Space } from "antd";
import { CameraOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { login } from "../controller/userController";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface FaceRecognitionProps {
  principalId: string;
  onSuccess: (data?: any) => void;
  onError: (error: string) => void;
  mode: "register" | "verify";
  isOpen: boolean;
  onClose: () => void;
}

const FaceRecognition: React.FC<FaceRecognitionProps> = ({
  principalId,
  onSuccess,
  onError,
  mode: initialMode,
  isOpen,
  onClose,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentMode, setCurrentMode] = useState(initialMode);
  const [captureCount, setCaptureCount] = useState(0);
  const [registrationStatus, setRegistrationStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const navigate = useNavigate();

  // Reset states when modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      setCurrentMode(initialMode);
      setCaptureCount(0);
      setRegistrationStatus("idle");
    }
  }, [isOpen, initialMode]);

  const capture = async () => {
    if (!webcamRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      setRegistrationStatus("processing");
      const imageSrc = webcamRef.current.getScreenshot();

      if (!imageSrc) {
        throw new Error("Failed to capture image");
      }

      // Convert base64 to blob
      const base64Data = imageSrc.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });

      // Create form data
      const formData = new FormData();
      formData.append("file", blob, "image.jpg");

      // Only add principal_id if in register mode
      if (currentMode === "register") {
        formData.append("principal_id", principalId);
      }

      const endpoint =
        currentMode === "register" ? "/register-face" : "/verify-face";
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Response from server:", result);

      if (result.status === "success") {
        console.log(result.message);
        setRegistrationStatus("success");

        if (currentMode === "verify" && result.principal_id) {
          // Handle successful verification
          setTimeout(() => {
            onSuccess({
              principalId: result.principal_id,
              similarity: result.similarity,
              message: result.message,
            });
            login(result.principal_id);
            navigate("/");
            onClose();
          }, 1500);
        } else {
          // Handle successful registration
          setCaptureCount((prev) => prev + 1);
          setTimeout(() => {
            if (captureCount >= 2) {
              // If this was the 3rd capture (0-indexed)
              onSuccess();
              onClose();
            } else {
              setRegistrationStatus("idle");
            }
          }, 1500);
        }
      } else {
        setRegistrationStatus("error");
        onError(result.message || "Failed to process request");
      }
    } catch (error) {
      console.error("Error in capture:", error);
      setRegistrationStatus("error");
      onError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <Modal
      title={
        <Title level={3} style={{ margin: 0 }}>
          {currentMode === "register" ? "Face Registration" : "Face Verification"}
        </Title>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      destroyOnClose
    >
      <div className="text-center">
        <Text type="secondary" className="block mb-6">
          {currentMode === "register"
            ? "Please capture your face 3 times to register."
            : "Look at the camera to verify your identity."}
        </Text>

        <div className="relative inline-block mb-6">
          <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg mx-auto">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              mirrored={true}
              className="w-full h-full object-cover"
              videoConstraints={{ width: 400, height: 400, facingMode: "user" }}
            />
            
            {/* Status Overlay */}
            <AnimatePresence>
              {registrationStatus === "processing" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                >
                  <div className="text-center text-white">
                    <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                    <Text className="text-white">Processing...</Text>
                  </div>
                </motion.div>
              )}
              {registrationStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm"
                >
                  <div className="text-center">
                    <CheckCircleOutlined className="text-6xl text-green-500 mb-2" />
                    <Text className="text-green-600 font-medium">Success!</Text>
                  </div>
                </motion.div>
              )}
              {registrationStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm"
                >
                  <div className="text-center">
                    <ExclamationCircleOutlined className="text-6xl text-red-500 mb-2" />
                    <Text className="text-red-600 font-medium">Error</Text>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {currentMode === "register" && (
          <div className="mb-6">
            <Progress
              percent={(captureCount / 3) * 100}
              showInfo={false}
              strokeColor="#1890ff"
              className="mb-2"
            />
            <Text type="secondary">
              {captureCount}/3 captures completed
            </Text>
          </div>
        )}

        <Space direction="vertical" size="middle" className="w-full">
          <Button
            type="primary"
            size="large"
            icon={<CameraOutlined />}
            onClick={capture}
            disabled={isCapturing || registrationStatus === "processing"}
            loading={registrationStatus === "processing"}
            className="w-full"
          >
            {registrationStatus === "processing"
              ? "Processing..."
              : registrationStatus === "success"
              ? "Captured Successfully!"
              : registrationStatus === "error"
              ? "Try Again"
              : currentMode === "register"
              ? `Capture Face ${captureCount + 1}/3`
              : "Verify Face"}
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default FaceRecognition;
