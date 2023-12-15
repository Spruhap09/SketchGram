import Layout from "@/components/Layout";
import UserPosts from "@/components/UserPosts";
import { AuthContext } from "@/context/AuthContext";
import { Avatar, Button, CardHeader, Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import EditProfile from "../components/EditProfile";
import ProfileStats from "../components/ProfileStats";
import { getUserPostsLimit } from "@/firebase/functions";
import ProfileHeader from "./profile/ProfileHeader"
import noAvatar from 'public/noAvatar.jpeg'
import AboutSection from './profile/AboutSection'
import PhotoGrid from "./profile/PhotoGrid"
export default function Profile() {

    const exampleProfile = {
        name: 'Andy Horwitz',
        location: "Hoboken, NJ", 
        photos: 253,
        followers: 1026,
        following: 478,
        bio: "I like art and im dominican"
      };
      

    const user = useContext(AuthContext);
    const [posts, setPosts] = useState<any[] | null>(null);
    const [ready, setReady] = useState(false);
    const router = useRouter();
    if(!user) router.push('/login');

    useEffect(() => {
        setReady(false);
        const getPosts = async () => {
                if(user){
                    const userPosts = await getUserPostsLimit(user.uid);
                    console.log(userPosts)
                    if (userPosts) setReady(true);
                    setPosts(userPosts || null);
                }
            }
            getPosts();
    },[])

    return (
        <Layout>
            {/* {ready ? (
                <>
                    <div className="sticky flex flex-col justify-center items-center">
                        <Typography variant="h2" className="">{'Welcome to your profile page!'} </Typography>
                    </div>
                    <div className="flex justify-between py-10 w-full">
                        <EditProfile />
                        <ProfileStats posts={posts} />

                    </div>
                    <div>
                        <Typography variant="h4" className="text-center">Your Posts</Typography>
                        <UserPosts setPosts={setPosts} posts={posts} />
                    </div>
                    <Button color="blue-gray" variant="gradient" onClick={() => router.push('/canvas')}>Back to Canvas</Button>
                </>
                ) : <div>Loading</div>} */}
            {ready? (
                <>
                 <div className="w-full">
                    <ProfileHeader profile={user} posts={posts}/>
                    <PhotoGrid posts={posts}/> 
                 </div>
                </>
            ) : <div>Loading</div>}
        </Layout>
        
    )
}