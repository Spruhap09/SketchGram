import { AuthContext } from "@/context/AuthContext";
import { getUserStats } from "@/firebase/functions";
import { Typography } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";

export default function ProfileStats ({posts}: { posts: any }) {
    const user = useContext(AuthContext);
    const [following, setFollowing] = useState<string[]>([]);
    const [followers, setFollowers] = useState<string[]>([]);
    const [drafts, setDrafts] = useState<string[]>([]);

    

    useEffect(() => {
        const getStats = async () => {
            if(user){
                const stats = await getUserStats(user.uid);
                setFollowers(stats.followers);
                setFollowing(stats.following);
                setDrafts(stats.drafts);
            }
        }
        getStats();
    }, [user])

    //TODO: ADD STUFF ABOUT YOUR MOST LIKED POST SO FAR...
    return (
        <div className="flex-grow box-border w-32 p-4 border-4 mr-4 rounded-lg flex flex-col items-center justify-center">
            <Typography variant="h5" color="blue-gray" className="my-2">Here are your profile stats!</Typography>
            <Typography className="h6">{`Total Followers: ${followers.length}`}</Typography>
            <Typography className="h6">{`Total Following: ${following.length}`}</Typography>
            <Typography className="h6">{`Total Posts: ${posts.length}`}</Typography>
            <Typography className="h6">{`Total drafts: ${drafts.length}`}</Typography>
        </div>  
    )
}