import Layout from "@/components/Layout";
import UserPosts from "@/components/UserPosts";
import { AuthContext } from "@/context/AuthContext";
import { Avatar, Button, CardHeader, Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import EditProfile from "../components/EditProfile";
import ProfileStats from "../components/ProfileStats";

export default function Profile() {
    // Redirect to login if user is not logged in
    const user = useContext(AuthContext);
    const router = useRouter();
    if(!user) router.push('/login');

    
    return (
        <Layout>
            <div className="sticky flex flex-col justify-center items-center">
            <Typography variant="h2" className="">{'Welcome to your profile page!'} </Typography>
            </div>
            <div className="flex justify-between py-10 w-full">
                    <EditProfile/>
                    <ProfileStats/>
                    
            </div>
            <div>
                <Typography variant="h4" className="text-center">Your Posts</Typography>
                <UserPosts/>
            </div>

            <Button color="blue-gray" variant="gradient" onClick={() => router.push('/canvas')}>Back to Canvas</Button>
        </Layout>
    )
}