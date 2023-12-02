import Post from "./Post";
import { getPost, getImageFromUrl, getUserPostsLimit } from "@/firebase/functions"
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";





export default function Posts(){

    const user = useContext(AuthContext);
    const [posts, setPosts] = useState<any[] | null>(null);

    useEffect(() => {
        const getPosts = async () => {
                if(user){
                    const userPosts = await getUserPostsLimit(user.uid, 50);
                    setPosts(userPosts || null);
                }
            }
            getPosts();
    }, [user]);

    return(
        <div>
            {posts && posts.map((post) =>
            <>
            
             {/* <Post key={post.post_id} id={post.post_id}/> */}
            </> 
            )}
        </div>
    )
}
