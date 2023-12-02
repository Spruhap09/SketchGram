import { getUserPosts, getUserPostsLimit } from "@/firebase/functions";
import { AuthContext } from "@/context/AuthContext";
import Post from "@/components/Post";
import { useContext, useEffect, useState } from "react";
import { usePostsContext } from "@/context/PostsContext";


export default function UserPosts() {
    const user = useContext(AuthContext);
    const { state, dispatch } = usePostsContext();
    
    useEffect(() => {
        console.log("ues effect triggered")
        const getPosts = async () => {

            if(user){
                const postsData = await getUserPostsLimit(user?.uid);
                const posts = postsData;
                if (posts) {
                //console.log("before context " + JSON.stringify(posts));
                const fetchPosts = async () => {
                    try {
                        posts.forEach((post) => {
                            //console.log("added post: " + JSON.stringify(post));
                            dispatch({ type: 'ADD_POST', payload: post });
                        });
                        //dispatch({type: 'CLEAR_POSTS'})
                    } catch (error) {
                      console.error('Error fetching posts:', error);
                    }
                }
            fetchPosts();
                }
        }
    }
        getPosts()
        //{console.log(user)}
       // {console.log(state)}
    }, [user]);
    

   
   
    return (
        <div className="w-full h-full flex flex-row justify-evenly flex-wrap">
          {/* if user exists but post doesn't exist, return a div saying no current posts */}
          {user ? (
            state.posts ? (
                console.log(state.posts),
              state.posts.map((post) => {
                console.log(post);
                return <Post key={post.post_id} id={post.post_id} />;
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

