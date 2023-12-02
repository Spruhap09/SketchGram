import { getUserPosts, getUserPostsLimit } from "@/firebase/functions";
import { AuthContext } from "@/context/AuthContext";
import Post from "@/components/Post";
import { useContext, useEffect, useState } from "react";


export default function UserPosts() {
    const [posts, setPosts] = useState<any[] | null>(null);
    const user = useContext(AuthContext);
    
    useEffect(() => {
        const getPosts = async () => {
            if(user){
                const postsData = await getUserPostsLimit(user?.uid);
                const posts = postsData;
                setPosts(posts || null);
            }
        }
        getPosts()
        {console.log(user)}
    }, [user])

   
   
    return (
        <div className="w-full h-full flex flex-row justify-evenly flex-wrap">
          {/* if user exists but post doesn't exist, return a div saying no current posts */}
          {user ? (
            posts ? (
              posts.map((post) => {
                console.log(post);
                return <Post key={post.post_id} id={post.post_id} setPosts={setPosts} />;
              })
            ) : (
              <div>No current posts</div>
            )
          ) : (
            <div>Loading</div>
          )}
        </div>
      );
      
}

