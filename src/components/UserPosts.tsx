import { getUserPosts } from "@/firebase/functions";
import { AuthContext } from "@/context/AuthContext";
import Post from "@/components/Post";
import { useContext, useEffect, useState } from "react";


export default function UserPosts() {
    const [posts, setPosts] = useState<string[]>([]);
    const user = useContext(AuthContext);
    
    useEffect(() => {
        const getPosts = async () => {
            if(user){
                const postsData = await getUserPosts(user.uid);
                const posts = postsData.map((post) => post.toString());
                setPosts(posts);
            }
        }
        getPosts()
    }, [user])
    
    if(!user) return (<div>loading</div>)
    return (
        <div className="w-full h-full flex flex-row justify-evenly flex-wrap">
            {posts.map((post) => {
                return (
                    <Post key={post} id={post} setPosts={setPosts}/>
                )
            })}
        </div>
    )   
}