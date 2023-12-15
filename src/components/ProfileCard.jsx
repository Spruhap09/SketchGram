
import React, { useRef } from 'react';

const ProfileCard = () => {
    const fileInputRef = useRef(null);
    const handleButtonClick = () => {
    // Trigger the file input click event
    fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
    // Handle the file selection
    const file = event.target.files[0];
    if (file) {
        // You can update the state or perform actions with the selected file
        console.log('File selected:', file.name);
        }
    };
  return (
    <div className="bg-white max-w-lg mx-auto p-4 flex items-center rounded-lg shadow">

      <img
        src="/path-to-your-profile-image.jpg" 
        alt="Profile"
        className="rounded-full w-16 h-16 border-2 border-gray-300 mr-4"
      />

      <div className="flex-1">
        <p className="text-gray-900 font-bold">aizennn.3</p>
        <p className="text-gray-600">Stephanie💖</p>
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
