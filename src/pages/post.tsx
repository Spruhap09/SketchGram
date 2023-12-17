import Layout from "@/components/Layout";
import Post from '@/components/Post';
import { AuthContext } from "@/context/AuthContext";
import { Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { getUserbyUid } from "@/firebase/functions";

export default function Post ({post} : {post : any}){

    const user = useContext(AuthContext);
    const router = useRouter();
    if(!user) router.push('/login');

    return (
        <Layout>
            <Post id={post.post_id} posts={post}/>
        </Layout>
    )


}