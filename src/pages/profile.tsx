import Layout from "@/components/Layout";
import UserPosts from "@/components/UserPosts";
import { AuthContext } from "@/context/AuthContext";
import { Avatar, Button, Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useContext } from "react";

export default function Profile() {
    const user = useContext(AuthContext);
    const router = useRouter();
    if(!user) router.push('/login');

    return (
        <Layout>
            <div className="sticky flex flex-col justify-center items-center">
            <Avatar src={user?.photoURL || ""} alt="avatar" size="xxl"/>
            <Typography variant="h2" className="">{user?.displayName} </Typography>
            <Typography variant="h3" className="">{user?.email} </Typography>
            </div>
            <div>
                <Typography variant="h4" className="text-center">Your Posts</Typography>
                <UserPosts/>
            </div>

            <Button color="blue-gray" variant="gradient" onClick={() => router.push('/canvas')}>Back to Canvas</Button>
        </Layout>
    )
}