import noAvatar from 'public/noAvatar.jpeg'

const ProfileHeader = ({profile, posts}) => {
  return (
    <div className="">
      <div className="flex flex-col items-center md:items-start md:flex-row w-full justify-center">
        <div className="mb-4 md:mb-0 md:mr-4">
          <img src={noAvatar.src} className="w-40 h-30 rounded-lg mb-4" /> 
        </div>
        <div>
        <div className="flex flex-col md:flex-row w-full justify-left items-center"> 
          <h1 className="text-2xl font-bold mr-8">{profile.displayName ? profile.displayName : "Unknown"}</h1>
          <div>
            <button
              className="text-white ml-4 bg-black w-24 px-6 py-2 text-xs rounded shadow hover:bg-gray-800 focus:outline-none mt-4 ml-8 md:mt-0"
            >
              EDIT PROFILE
            </button>
          </div>
        </div>
          <div className="mt-4">
            <span className="mr-4"><strong>{posts.length}</strong> Photos</span>
            <span className="mr-4"><strong>{profile.followers}</strong> Followers</span>
            <span><strong>{profile.following}</strong> Following</span>
          </div>
          {profile.bio && <p className="text-gray-600 mt-4 md:mt-0 pt-3">{profile.bio}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader