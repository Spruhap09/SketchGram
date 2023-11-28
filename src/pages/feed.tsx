import Layout from "@/components/Layout";
import { AuthContext } from "@/context/AuthContext";
import { Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useContext } from "react";

export default function Feed() {
    const user = useContext(AuthContext);
    const router = useRouter();
    if(!user) router.push('/login');

    return (
        <Layout>
            <Typography variant="h2">Feed</Typography>
            TODO
        </Layout>
    )

}