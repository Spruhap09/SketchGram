import React from 'react';
import { useRouter } from "next/router";

export default function Popout({ 
  followersOrFollowing, 
  content, 
  isOpen, 
  popRef, 
  followingArray // This is the new prop that contains the array of user IDs that the current user is following
}: {
  followersOrFollowing: string, 
  content: any, 
  isOpen: boolean, 
  popRef: any,
  followingArray: string[] // Assuming followingArray is an array of user IDs
}) {
  const router = useRouter();

  const handleClick = (user: any) => {
    console.log("from handle clicked: ");
    router.push(`/user/${user.uid}`);
  };

  const isFollowing = (userId: string) => {
    return followingArray.includes(userId);
  };

  return (
    <div className='relative'>
      {isOpen && (
        <div ref={popRef} className='fixed rounded-xl top-20 left-1/2 transform -translate-x-1/2 bg-white p-4 max-h-[80vh] overflow-auto w-[90%] md:w-[500px] z-10 shadow-lg'>
          <div className='p-2'>
            <h3 className="text-lg font-semibold border-b pb-2">{followersOrFollowing}</h3>
            {content.map((user: any) => (
              <div key={user.uid} className="flex items-center space-x-3 mt-3 p-2 hover:bg-gray-100 cursor-pointer rounded-lg" onClick={() => handleClick(user)}>
                <img 
                  src={user.profilePicture || '../empty-profile.png'} 
                  alt={"Profile picture of " + user.displayName}
                  className="h-10 w-10 rounded-full" 
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{user.displayName}</p>
                  <p className="text-sm text-gray-600">{user.username}</p>
                </div>
                {followersOrFollowing.trim().toLowerCase() === "followers" && isFollowing(user.uid) ? (
                  <button 
                    className="text-xs font-bold text-white bg-green-500 px-3 py-1 rounded"
                  >
                    Following
                  </button>
                ) : (
                  <button 
                    className="text-xs font-bold text-white bg-red-500 px-3 py-1 rounded"
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
