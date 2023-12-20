import Post from "./Post";
import { getPost, getImageFromUrl, getUserPostsLimit, getAllPosts } from "@/firebase/functions"
import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";


export default function Explore({userObj}: {userObj: any}){

    const user = useContext(AuthContext);
    const [posts, setPosts] = useState<any[] | null>(null);

    useEffect(() => {
        const getPosts = async () => {
                if(user){
                    let userPosts = await getAllPosts();

                    //make sure there are no posts from the current user
                    userPosts = userPosts.filter((post) => {
                        return post.userid !== user.uid;
                    })

                    //make copy of posts
                    let userPostsCopy = [...userPosts];
                    
                    //only take the posts that were made today
                    userPosts = userPosts.filter((post) => {
                        const today = new Date();
                        const postDate = new Date(post.timestamp);
                        return today.getDate() === postDate.getDate() && today.getMonth() === postDate.getMonth() && today.getFullYear() === postDate.getFullYear();
                    })

                    //sort by likes
                    userPosts.sort((a, b) => {
                        return b.likes.length - a.likes.length;
                    });

                    //if there are less than 10 posts, add the rest of posts sorted by most liked
                    if(userPosts.length < 10){
                        userPostsCopy.sort((a, b) => {
                            return b.likes.length - a.likes.length;
                        });
                        userPosts = userPosts.concat(userPostsCopy.slice(0, 10 - userPosts.length));
                    }

                    //make sure there are no duplicate posts in userPosts
                    const seen = new Set();
                    userPosts = userPosts.filter((post) => {
                        const duplicate = seen.has(post.post_id);
                        seen.add(post.post_id);
                        return !duplicate;
                    })

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
                <Post id={post.post_id} posts={explorePosts} setPosts={setPosts} sample={false}/>
=======
                <Post id={post.post_id} posts={posts} setPosts={undefined} sample={undefined}/>
>>>>>>> Stashed changes
>>>>>>> Stashed changes
            </div> 
            )}
        </div>
    )
}