import React, { useContext, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Assuming you are using Next.js
import { AuthContext } from "@/context/AuthContext";
import { uploadProfilePic, getUserbyUid } from "../firebase/functions.ts";

const ProfileCard = () => {
    const user = useContext(AuthContext);
    const router = useRouter();
    const [error, setError] = useState(null); 
    const fileInputRef = useRef(null);
    const [userInformation, setUserInformation] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Loading state

    useEffect(() => {
      if (!user) {
        router.push('/login');
        return;
      }

      const fetchUserInfo = async () => {
        try {
          const info = await getUserbyUid(user.uid);
          setUserInformation(info);
        } catch (error) {
          console.error("Error fetching user info:", error);
        } finally {
          setIsLoading(false); // Update loading state when data is fetched
        }
      };
    
      fetchUserInfo();
    }, [user, router]);

    const handleButtonClick = () => {
      fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        await uploadProfilePic(file);
        // Reset error state if upload is successful
        setError(null);
      } catch (error) {
        // Set error state to display the error message
        setError(error.message);
      }
    };

    // Render loading indicator or return null while loading
    if (isLoading) {
      return <div>Loading...</div>; // or return null;
    }

    return (
      <div className="bg-white max-w-lg mx-auto p-4 flex items-center rounded-lg shadow">
        {console.log("pfp", userInformation)}
        {error && <div className="error-message text-red-500">{error}</div>}
        <img
          src={userInformation.profilePicture}
          alt="Profile"
          className="rounded-full w-16 h-16 border-2 border-gray-300 mr-4"
        />

        <div className="flex-1">
          <p className="text-gray-900 font-bold">{userInformation.displayName}</p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".jpeg,.jpg,.png"
          onChange={handleFileChange}
        />
        <button
          onClick={handleButtonClick}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Change photo
        </button>
      </div>
    );
};

export default ProfileCard;