import noAvatar from 'public/noAvatar.jpeg'
import { AuthContext } from "@/context/AuthContext";
import { getUserbyUid, getUserStats } from "@/firebase/functions";
import { useContext , useState, useEffect, useRef} from 'react';
import { useRouter } from "next/router";
import Popout from "../../components/Popout"
import FollowerPopout from "../FollowerPopout"
import FollowingPopout from "../FollowingPopout"

const ProfileHeader = ({profile, posts}) => {
  const [isOpen, setOpen] = useState(false)
  const user = useContext(AuthContext);
  const [userInformation, setUserInformation] = useState(undefined)
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const popRef = useRef(null)
  const pop2Ref = useRef(null)
  const [followingOpen, setFollowsOpen] = useState(false)

  

  const router = useRouter();
  
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
  
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  useEffect(() => {
    console.log('here')
    const getStats = async () => {
        if(user){
            const stats = await getUserStats(user.uid);
            if (stats){
            let followers_info = []
            let following_info= []
            let currentMostLikedPost = null;
            for (let i=0; i < stats.followers.length; i++){
                const ret_user = await getUserbyUid(stats.followers[i]);
                followers_info.push(ret_user)
            }

            for(let i=0; i < stats.following.length; i++){
                const ret_user = await getUserbyUid(stats.following[i]);
                following_info.push(ret_user)
            }
            console.log(JSON.stringify(followers_info))
            const user = await getUserbyUid(profile.uid)
            console.log("dskfnadslnfdln", user)
            setUserInformation(user)
            setFollowers(followers_info);
            setFollowing(following_info);
            setDrafts(stats.drafts);
            }

        }
    }
    getStats();
}, [user])
  const toggle2Pop = () => {
    setFollowsOpen(!followingOpen)
}

const togglePop = () => {
  setOpen(!isOpen)
}
  const handleOutsideClick = (e) => {
    if (popRef.current && !popRef.current.contains(e.target)) {
      setOpen(false);
    }
    if (pop2Ref.current && !pop2Ref.current.contains(e.target)) {
      setFollowsOpen(false);
    }
  };
  return (
    <div className="">
      <div className="flex flex-col items-center md:items-start md:flex-row w-full justify-center">
        <div className="mb-4 md:mb-0 md:mr-4">
          {console.log("user information", userInformation?.profilePicture)}
          <img src={userInformation?.profilePicture || '../empty-profile.png'} alt="Profile"
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
            <span onClick={togglePop} className=" mr-4 h6 hover:cursor-pointer"><strong>{followers.length}</strong> Followers</span>
            <span onClick={toggle2Pop} className="h6 hover:cursor-pointer"><strong>{following.length}</strong> Following</span>
          </div>
          {profile?.bio && <p className="text-gray-600 mt-4 md:mt-0 pt-3">{profile.bio}</p>}
        </div>
      </div>
      {followers.length > 0 && <FollowerPopout content={followers} followingArray={following} isOpen={isOpen} popRef={popRef}/>}
      {following.length > 0 && <FollowingPopout content={following} isOpen={followingOpen} popRef={pop2Ref}/>}
    </div>
  );
};

export default ProfileHeader