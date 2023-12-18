import Layout from "@/components/Layout";
import UserPosts from "@/components/UserPosts";
import { AuthContext } from "@/context/AuthContext";
import { Avatar, Button, CardHeader, Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { getPost } from "@/firebase/functions";
import Post from "@/components/Post";
import { DocumentData } from "firebase/firestore";


export default function IndividualPost(){
    const router = useRouter();
    const {id} = router.query;
    const user = useContext(AuthContext);
    const [ready, setReady] = useState(false);
    const [post, setPost] = useState<DocumentData | null>(null);
    const posts: DocumentData[] = [];
    

    useEffect(() => {
        setReady(false);
        const getIndividualPost = async () => {

            if (user){
                const individualPost = await getPost(id)
                setPost(individualPost)
                setReady(true)

                
            }   
        }
        getIndividualPost()
    }, [user, id])


    return (
        <Layout>
          {ready ? (
            <div>
              <Post id={post?.post_id} posts={[post]} />
            </div>
          ) : (
            <div>Loading</div>
          )}
        </Layout>
      );
}