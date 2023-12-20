import Post from "./Post";
import { getPost, getImageFromUrl, getUserPostsLimit } from "@/firebase/functions"
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";





export default function Home({userObj}: {userObj: any}){

    const user = useContext(AuthContext);
    const [posts, setPosts] = useState<any[] | null>(null);

    useEffect(() => {
        const getPosts = async () => {
                if(user && userObj){

                    //get all the uids of the people the user is following
                    const following = userObj.following;

                    //get all posts from today from the people the user is following
                    let userPosts: any[] = [];
                    for(let i = 0; i < following.length; i++){
                        const temp = await getUserPostsLimit(following[i], 10);
                        userPosts = userPosts.concat(temp);
                    }

                    //add users own posts
                    userPosts = userPosts.concat(await getUserPostsLimit(user.uid, 10));

                    //sort the posts by timestamp field
                    userPosts.sort((a: { timestamp: string; }, b: { timestamp: string; }) => {
                        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                    });

                    //set the posts
                    setPosts(userPosts || null);
                }
            }
            getPosts();
    }, [user]);

    return(
        <div>
            {posts && posts.map((post) =>
            <div key={post.post_id} className="px-3">
            
<<<<<<< Updated upstream
             <Post id={post.post_id} posts={posts}/>
=======
<<<<<<< Updated upstream
             <Post id={post.post_id} posts={homePosts} setPosts={setPosts} sample={false}/>
=======
             <Post id={post.post_id} posts={posts} setPosts={undefined} sample={undefined}/>
>>>>>>> Stashed changes
>>>>>>> Stashed changes
            </div> 
            )}
        </div>
    )
}
