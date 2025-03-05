import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authUtils } from "../../utils/authUtils";
import { UpdateUserPayload, User } from "../../interface/User";
import { topUp, updateUserProfile } from "../../controller/userController";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Check, PencilLine, Star, X } from "lucide-react";
import Modal from "../modals/ModalTemplate";

export default function ProfileBiodata() {
  const [user, setUser] = useState<User | null>(null);
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tempUsername, setTempUsername] = useState<string>("");
  const [tempDescription, setTempDescription] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [faceRecognitionOn, setFaceRecognitionOn] = useState(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
  const [createdAt, setCreatedAt] = useState<Date>();
  const [errors, setErrors] = useState<string>("");


  const [, setPrincipalId] = useState<string | null>(null);
  const [, setIsConnected] = useState(false);
  const [amount, setAmount] = useState("");
  useEffect(() => {
    const connectPlugWallet = async () => {
      try {

        const plug = (window as any).ic?.plug; // Typecasting window.ic

        if (!plug) {
          console.error("Plug Wallet not detected");
          alert("Plug Wallet is not installed. Please install it and try again.");
          return;
        }

        const connected = await plug.isConnected();
        if (!connected) {
          await plug.requestConnect({
            whitelist: ["ryjl3-tyaaa-aaaaa-aaaba-cai"],
            host: "https://localhost:3000",
          });
        }

        const principal = await plug.getPrincipal();
        setPrincipalId(principal.toString());
        setIsConnected(true);
      } catch (error) {
        console.error("Plug Wallet connection error:", error);
      }
    };

    connectPlugWallet();
  }, []);

  const sendICP = async () => {
    try {
      const plug = (window as any).ic?.plug;

      if (!plug) {
        alert("Plug Wallet not detected");
        return;
      }

      const connected = await plug.isConnected();
      if (!connected) {
        await plug.requestConnect();
      }

      const transferArgs = {
        to: "Ergasia",
        amount: parseFloat(amount) * 100000000, // 8 decimals for ICP
        token: {
          symbol: "ICP",
          standard: "ICP",
          decimals: 8,
          price: true
        },
      };


      console.log("Sending ICP:", transferArgs);
      const result = await plug.requestTransfer(transferArgs);

      console.log("Transaction successful:", result);
      alert("Payment successful!");
      topUp(parseFloat(amount))
      const user = JSON.parse(localStorage.getItem("current_user") || "");
      localStorage.setItem(
        "current_user",
        JSON.stringify({
          ok: {
            ...user,
            wallet: user.wallet + parseFloat(amount),
          },
        })
      );

      window.location.reload();

    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed!");
    }
  };


  const { current_user } = authUtils();
  const [dob, setDob] = useState("");
  const [tempDob, setTempDob] = useState<string>("");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      console.log(file);
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setShowImagePreview(true);
    }
  };
  useEffect(() => {
    const changesExist =
      tempUsername !== username ||
      tempDescription !== description ||
      tempDob !== dob ||
      selectedImage !== null;

    setHasChanges(changesExist);
  }, [tempUsername, tempDescription, tempDob, selectedImage]);

  useEffect(() => {
    if (current_user) {
      const newUser = JSON.parse(current_user).ok;
      const profile = newUser.profilePicture;

      if (profile) {
        const u8 = new Uint8Array(Object.values(profile));
        const blob = new Blob([u8], { type: "image/png" });
        newUser.profilePicture = blob;
      }
      setUser(newUser);
      setTempUser(newUser);
      // setCreatedAt(date);
      setUsername(newUser.username);
      setDescription(newUser.description);
      setDob(newUser.dob);
      setTempUsername(newUser.username);
      setTempDescription(newUser.description);
      setTempDob(newUser.dob);
      setPreviewImage(URL.createObjectURL(newUser.profilePicture));
    }
  }, [current_user]);

  const ProfileImageModal = () => (
    <Modal
      isOpen={showImagePreview}
      onClose={() => setShowImagePreview(false)}
      title="Profile Picture Preview"
    >
      <div className="space-y-6 text-center">
        <div className="relative mx-auto w-48 h-48">
          <img
            src={previewImage || ""}
            className="w-full h-full rounded-full border-4 border-white shadow-lg"
            alt="Preview"
          />
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => {
              setShowImagePreview(false);
              setPreviewImage(previewImage);
            }}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg flex items-center gap-2 hover:shadow-md transition-all"
          >
            <Check size={20} /> Confirm
          </button>
          <button
            onClick={() => {
              setSelectedImage(null);
              setPreviewImage(null);
              setShowImagePreview(false);
            }}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg flex items-center gap-2 hover:shadow-md transition-all"
          >
            <X size={20} /> Cancel
          </button>
        </div>
      </div>
    </Modal>
  );

  const convertImageToBlob = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          const blob = new Blob([reader.result], { type: file.type });
          resolve(blob);
        } else {
          reject(new Error("Failed to convert image to blob"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  };

  const blobToUint8Array = async (blob: Blob): Promise<Uint8Array> => {
    const arrayBuffer = await blob.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  };

  const handleSave = async () => {
    if (!tempUsername.trim()) {
      setErrors("Username cannot be empty");
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(tempUsername)) {
      setErrors("Username can only contain alphanumeric characters");
      return;
    }
    // also add validation if username already taken

    try {
      let imageData: Uint8Array | null = null;
      console.log(imageData);

      if (selectedImage) {
        const imageBlob = await convertImageToBlob(selectedImage);
        imageData = await blobToUint8Array(imageBlob);
      } else {
        // console.log("Selected image:", selectedImage);
        imageData = await blobToUint8Array(
          user ? user.profilePicture : new Blob()
        );
      }

      console.log("Image data:", imageData);

      const formattedPayload: UpdateUserPayload = {
        username: tempUsername ? [tempUsername] : [],
        profilePicture: imageData ? [imageData] : [],
        description: tempDescription ? [tempDescription] : [],
        dob: tempDob ? [tempDob] : [],
        preference: [],
      };

      await updateUserProfile(formattedPayload);
      console.log(imageData);
      localStorage.setItem(
        "current_user",
        JSON.stringify({
          ok: {
            ...user,
            profilePicture: imageData,
            username: tempUsername,
            description: tempDescription,
            dob: tempDob,
          },
        })
      );
      window.location.reload();
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  const handleCancel = () => {
    setTempUsername(username);
    setTempDescription(description);
    setSelectedImage(null);
    setPreviewImage(null);
  };

  const handleToggle = () => {
    setFaceRecognitionOn((prev) => !prev);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className=" w-full">
      {user && (
        <>
          <AnimatePresence>
            {hasChanges && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl p-4 flex gap-4 items-center z-50 border border-purple-100"
              >
                <span className="text-purple-700 font-semibold">
                  Unsaved changes detected
                </span>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:scale-[1.02] transition-transform flex items-center gap-2 shadow-lg"
                >
                  <Check size={18} /> Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-white border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition-all flex items-center gap-2"
                >
                  <X size={18} /> Discard
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <ProfileImageModal />

          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-50">
            {/* Profile Header */}
            <div className=" bg-gradient-to-r from-[#DBE2EF] to-blue-200 p-8">
              <div className="flex items-center gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative group"
                >
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="relative w-48 h-48 rounded-full border-4 border-white/90 shadow-2xl overflow-hidden">
                      <img
                        src={
                          previewImage ||
                          URL.createObjectURL(user.profilePicture) ||
                          "/default-avatar.png"
                        }
                        className="w-full h-full object-cover"
                        alt="Profile"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera
                          className="text-white w-8 h-8"
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>
                  </label>
                </motion.div>

                <div className="space-y-2 flex-1">
                  <label htmlFor="username" className="relative">
                    <input
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      autoComplete="off"
                      className="text-4xl font-bold bg-transparent focus:outline-0 border-b border-purple-400 focus:border-black text-black placeholder:text-gray-400 w-1/2"
                      placeholder="Enter username"
                      name="username"
                    />
                    <PencilLine className="absolute -top-2 right-4" />
                  </label>
                  {/* <p className="text-black text-xl">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </p> */}
                </div>
              </div>
            </div>

            {/* Biodata Content */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-lg">
                  <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-3">
                    Wallet Balance
                  </h3>
                  <p className="text-3xl font-bold text-purple-900">
                    ${user?.wallet.toFixed(2) || "0.00"}
                  </p>

                  <button
                    className="mt-4 w-full bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Top Up
                  </button>

                  {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-md">
                      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold text-purple-700 mb-4">
                          Enter Token Amount
                        </h2>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                        />
                        <div className="mt-4 flex justify-end">
                          <button
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
                            onClick={() => setIsModalOpen(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                            onClick={sendICP}
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>


                <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-lg">
                  <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-3">
                    Rating
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${i < (user?.rating || 0)
                            ? "fill-current"
                            : "fill-purple-100"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-xl font-bold text-purple-900">
                      {user?.rating?.toFixed(1) || "4.8"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-lg">
                  <label className="block text-sm font-semibold text-purple-600 uppercase tracking-wide mb-3">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={tempDob}
                    onChange={(e) => setTempDob(e.target.value)}
                    className="w-full p-3 border-2 border-purple-100 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-purple-900 font-medium"
                  />
                </div>

                <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-lg">
                  <label className="block text-sm font-semibold text-purple-600 uppercase tracking-wide mb-3">
                    Description
                  </label>
                  <textarea
                    value={tempDescription}
                    onChange={(e) => setTempDescription(e.target.value)}
                    className="w-full p-3 border-2 border-purple-100 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 h-32 text-purple-900 font-medium"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                      Face Recognition
                    </span>
                    <button
                      onClick={handleToggle}
                      className={`w-14 h-8 rounded-full p-1 transition-colors ${faceRecognitionOn ? "bg-purple-600" : "bg-purple-100"
                        }`}
                    >
                      <motion.div
                        className="w-6 h-6 rounded-full bg-white shadow-lg"
                        animate={{ x: faceRecognitionOn ? 26 : 0 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      />
                    </button>
                    {/* register button for face recognition */}
                    <Link to={"/face-recognition/register"} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:scale-[1.02] transition-transform flex items-center gap-2 shadow-lg">
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
