<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
import Post from "./Post";
import { getPost, getImageFromUrl, getUserPostsLimit, getAllPosts } from "@/firebase/functions"
import { AuthContext } from "@/context/AuthContext";
import { Key, SetStateAction, useContext, useEffect, useRef, useState } from "react";

export default function SamplePost(){
    const user = useContext(AuthContext);
    const [posts, setPosts] = useState<any[] | null>(null);


    useEffect(() => {
        const getPosts = async () => {
            //gets all the posts from the database
            const data = await getAllPosts();

            // sorts the posts from most to least likes
            const sortedPosts = data.sort((a, b) => b.likes.length - a.likes.length);
            
            //sets the current list of top posts
            setPosts(sortedPosts.slice(0,10));
        }
        getPosts(); 
        }

    , []);
    return (
        <div>
        {posts && posts.map((post: { post_id: Key | null | undefined | any; }) =>
        <div key={post.post_id} className="px-3">
        
            <Post id={post.post_id} posts={posts} setPosts={"default"} sample={true}/>
        </div> 
        )}
    </div>
    )
=======
>>>>>>> Stashed changes
import Post from "./Post";
import { getPost, getImageFromUrl, getUserPostsLimit, getAllPosts } from "@/firebase/functions"
import { AuthContext } from "@/context/AuthContext";
import { Key, SetStateAction, useContext, useEffect, useRef, useState } from "react";

export default function SamplePost(){
    const user = useContext(AuthContext);
    const [posts, setPosts] = useState<any[] | null>(null);


    useEffect(() => {
        const getPosts = async () => {
            //gets all the posts from the database
            const data = await getAllPosts();

            // sorts the posts from most to least likes
            const sortedPosts = data.sort((a, b) => b.likes.length - a.likes.length);
            
            //sets the current list of top posts
            setPosts(sortedPosts.slice(0,10));
        }
        getPosts(); 
        }

    , []);
    return (
        <div>
<<<<<<< Updated upstream
        {posts && posts.map((post: { post_id: Key | null | undefined; }) =>
        <div key={post.post_id} className="px-3">
        
            <Post id={post.post_id} posts={posts} sample={true}/>
=======
        {posts && posts.map((post: { post_id: string }) =>
        <div key={post.post_id} className="px-3">
        
            <Post id={post.post_id} posts={posts} sample={true} setPosts={undefined}/>
>>>>>>> Stashed changes
        </div> 
        )}
    </div>
    )
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
}