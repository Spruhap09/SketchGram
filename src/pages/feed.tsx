import Layout from "@/components/Layout";
import Feed from "@/components/Feed";
import { AuthContext } from "@/context/AuthContext";
import { Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useContext } from "react";


export default function FeedBody() {
    const user = useContext(AuthContext);
    const router = useRouter();
    if(!user) router.push('/login');

    return (
        <Layout>
            <Feed/>
        </Layout>
    )

}