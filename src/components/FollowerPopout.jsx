import React from 'react';
import { useRouter } from "next/router";

export default function FollowerPopout({ 
  content, 
  isOpen, 
  popRef, 
  followingArray 
}) {
  const router = useRouter();

  const handleClick = (userId) => {
    console.log("from handle clicked: ");
    router.push(`/user/${userId}`);
  };

  const isFollowing = (userId) => {
    console.log("following array is", followingArray)
    console.log("userID is ", userId)
    return followingArray.some(follower => follower.uid === userId);
  };

  return (
    <div className='relative'>
      {isOpen && (
        <div ref={popRef} className='fixed rounded-xl top-20 left-1/2 transform -translate-x-1/2 bg-white p-4 max-h-[80vh] overflow-auto w-[90%] md:w-[500px] z-10 shadow-lg'>
          <div className='p-2'>
            <h3 className="text-lg font-semibold border-b pb-2">Followers</h3>
            {content.map((follower) => (
              
              <div key={follower.uid} className="flex items-center space-x-3 mt-3 p-2 hover:bg-gray-100 cursor-pointer rounded-lg" onClick={() => handleClick(follower.uid)}>
                <img 
                  src={follower.profilePicture || '../empty-profile.png'} 
                  alt={"Profile picture of " + follower.displayName}
                  className="h-10 w-10 rounded-full" 
                />

                <div className="flex-1">
                  <p className="text-sm font-semibold">{follower.displayName}</p>
                  <p className="text-sm text-gray-600">{follower.username}</p>
                </div>
                
                {isFollowing(follower.uid) ? (
                  <button 
                    className="text-xs font-bold text-white bg-green-500 px-3 py-1 rounded w-24"
                  >
                    Following
                  </button>
                ) : (
                  <button 
                    className="text-xs font-bold text-white bg-blue-500 px-3 py-1 rounded w-24"
                  >
                    Follow
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
