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

<<<<<<< Updated upstream
            if (user){
<<<<<<< Updated upstream
=======
              try {
=======
            if (user && typeof id === 'string'){
>>>>>>> Stashed changes
>>>>>>> Stashed changes
                const individualPost = await getPost(id)
                setPost(individualPost)
                setReady(true)
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
              }
>>>>>>> Stashed changes

                
=======
>>>>>>> Stashed changes
            }   
        }
        getIndividualPost()
    }, [user, id])


    return (
        <Layout>
          {ready ? (
            <div>
<<<<<<< Updated upstream
              <Post id={post?.post_id} posts={[post]} />
=======
<<<<<<< Updated upstream
              <Post id={post[0]?.post_id} posts={post} setPosts={setPost} sample={false} />
=======
              <Post id={post?.post_id} posts={[post]} setPosts={undefined} sample={undefined} />
>>>>>>> Stashed changes
>>>>>>> Stashed changes
            </div>
          ) : (
            <div>Loading</div>
          )}
        </Layout>
      );
}