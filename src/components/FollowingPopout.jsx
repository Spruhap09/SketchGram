import React from 'react';
import { useRouter } from "next/router";

export default function FollowingPopout({ 
  content, 
  isOpen, 
  popRef
}) {
  const router = useRouter();

  const handleClick = (userId) => {
    console.log("from handle clicked: ");
    router.push(`/user/${userId}`);
  };


  const handleUnfollow = (userId) => {
    console.log("Unfollow clicked for user: ", userId);

  };

  return (
    <div className='relative'>
      {isOpen && (
        <div ref={popRef} className='fixed rounded-xl top-20 left-1/2 transform -translate-x-1/2 bg-white p-4 max-h-[80vh] overflow-auto w-[90%] md:w-[500px] z-10 shadow-lg'>
          <div className='p-2'>
            <h3 className="text-lg font-semibold border-b pb-2">Following</h3>
            {content.map((user) => (
              <div key={user.uid} className="flex items-center space-x-3 mt-3 p-2 hover:bg-gray-100 cursor-pointer rounded-lg" onClick={() => handleClick(user.uid)}>
                <img 
                  src={user.profilePicture || '../empty-profile.png'} 
                  alt={"Profile picture of " + user.displayName}
                  className="h-10 w-10 rounded-full" 
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{user.displayName}</p>
                  <p className="text-sm text-gray-600">{user.username}</p>
                </div>
                <button 
                  className="text-xs font-bold text-white bg-black px-3 py-1 rounded"
                  onClick={() => handleUnfollow(user.uid)}
                >
                  Unfollow
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}