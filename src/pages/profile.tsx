import Layout from "@/components/Layout";
import UserPosts from "@/components/UserPosts";
import { AuthContext } from "@/context/AuthContext";
import { Avatar, Button, CardHeader, Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import EditProfile from "./EditProfile";

export default function Profile() {

    const user = useState(useContext(AuthContext));
    const router = useRouter();
    if(!user) router.push('/login');

    
    return (
        <Layout>
            <div className="sticky flex flex-col justify-center items-center">
            <Typography variant="h2" className="">{'Welcome to your profile page!'} </Typography>
            </div>
            <div className="flex justify-between py-10 w-full">
                    <EditProfile/>
                    <div className="flex-grow box-border h-32 w-32 p-4 border-4 rounded-lg">
                        <Typography className="">there</Typography>
                    </div>  
            </div>
            <div>
                <Typography variant="h4" className="text-center">Your Posts</Typography>
                <UserPosts/>
            </div>

            <Button color="blue-gray" variant="gradient" onClick={() => router.push('/canvas')}>Back to Canvas</Button>
        </Layout>
    )
}