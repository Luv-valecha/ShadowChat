import { useState } from "react";
import { useAuthStore } from '../store/useAuthStore'
import { Camera, Mail, User } from "lucide-react";
import Resizer from "react-image-file-resizer";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, deleteUser } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    // get the image file
    const file = e.target.files[0];
    // if no file is selected, don't do anything
    if (!file) return;
    // if selected then read the image using file reader
    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // // loading the image
    // reader.onload = async () => {
    //   const base64Image = reader.result;
    //   setSelectedImg(base64Image);

    Resizer.imageFileResizer(
      file,
      800, // Max width
      800, // Max height
      "JPEG", // Format
      80, // Quality (0-100)
      0, // Rotation
      async (uri) => {
        setSelectedImg(uri);
        await updateProfile({ profilePic: uri });
      },
      "base64"
    );
    // function that'll be called to update the profile pic to the database

    // };
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                // if there is image in so image in selectedImg and authUser.profilePic show default avatar.png
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>
          {/* ---- */}
          {/* User Info */}

          {/* ---- */}
          {/* Additional Info Field */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
              <div className="flex justify-end">
                <button 
                className="border border-amber-100 p-2 cursor-pointer bg-red-700 text-black font-medium"
                onClick={deleteUser}
                >Delete Profile</button>
              </div>
            </div>
          </div>
          {/* ---- */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage