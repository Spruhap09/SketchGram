import noAvatar from 'public/noAvatar.jpeg'
import { AuthContext } from "@/context/AuthContext";
import { getUserbyUid, getUserStats } from "@/firebase/functions";
import { useContext , useState, useEffect} from 'react';
import { useRouter } from "next/router";

const ProfileHeader = ({profile, posts}) => {
  const user = useContext(AuthContext);
  const [userInformation, setUserInformation] = useState(undefined)
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [drafts, setDrafts] = useState([]);

  

  const router = useRouter();
  
  useEffect(() => {
      const getStats = async () => {
          if(user){
              const stats = await getUserStats(user.uid);
              const fetchUserInfo = await getUserbyUid(user.uid)
              console.log("inside fet stats", fetchUserInfo)
              setUserInformation(fetchUserInfo)
              setFollowers(stats.followers);
              setFollowing(stats.following);
              setDrafts(stats.drafts);
          }
      }
      getStats();
  }, [user])
  return (
    <div className="">
      <div className="flex flex-col items-center md:items-start md:flex-row w-full justify-center">
        <div className="mb-4 md:mb-0 md:mr-4">
          {console.log("user information", userInformation?.profilePicture)}
          <img src={userInformation?.profilePicture || noAvatar.src} alt="Profile"
          className="rounded-full w-20 h-20 border-2 border-gray-300 mr-4" /> 
        </div>
        <div>
        <div className="flex flex-col md:flex-row w-full justify-left items-center"> 
          <h1 className="text-2xl font-bold mr-8">{profile?.displayName ? profile?.displayName : "Unknown"}</h1>
          <div>
            <button
              className="text-white ml-4 bg-black w-24 px-6 py-2 text-xs rounded shadow hover:bg-gray-800 focus:outline-none mt-4 ml-8 md:mt-0" onClick={() => router.push('/profile/edit')}
            >
              EDIT PROFILE
            </button>
          </div>
        </div>
          <div className="mt-4">
            <span className="mr-4"><strong>{posts?.length}</strong> Photos</span>
            <span className="mr-4"><strong>{followers.length}</strong> Followers</span>
            <span><strong>{following.length}</strong> Following</span>
          </div>
          {profile?.bio && <p className="text-gray-600 mt-4 md:mt-0 pt-3">{profile.bio}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader