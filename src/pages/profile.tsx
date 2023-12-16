import Layout from "@/components/Layout";
import UserPosts from "@/components/UserPosts";
import { AuthContext } from "@/context/AuthContext";
import { Avatar, Button, CardHeader, Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import EditProfile from "../components/EditProfile";
import ProfileStats from "../components/ProfileStats";
import { getUserPostsLimit } from "@/firebase/functions";
import ProfileHeader from "../components/profile/ProfileHeader"
import noAvatar from 'public/noAvatar.jpeg'
import AboutSection from '../components/profile/AboutSection'
import PhotoGrid from "../components/profile/PhotoGrid"
export default function Profile() {
      

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