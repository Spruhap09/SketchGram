// postsContext.js
import React, { ReactNode, createContext, useContext, useReducer } from 'react';

// Initial state for posts
const initialState = {
  posts: [],
};

// Create a context
const PostsContext = createContext(initialState);

// Define a reducer function to handle state changes
const postsReducer = (state: { posts: any[]; }, action: { type: any; payload: any; }) => {
  switch (action.type) {
    case 'ADD_POST':

      const newPost = action.payload;
      const existingPostIndex = state.posts.findIndex(
        (post: { post_id: any; }) => post.post_id === newPost.post_id
      );

      if (existingPostIndex !== -1) {
        // If exists, update the existing post
        const updatedPosts = [...state.posts];
        updatedPosts[existingPostIndex] = newPost;

        return {
          ...state,
          posts: updatedPosts,
        };
      } else {
        // If doesn't exist, add the new post
        return {
          ...state,
          posts: [...state.posts, newPost],
        };
      }
    case 'CLEAR_POSTS':
      return {
        ...state,
        posts: [],
      };

      case 'UPDATE_POST':
        const updatedPost = action.payload;
        const existingPostIndexToUpdate = state.posts.findIndex(
          (post: { post_id: any; }) => post.post_id === updatedPost.post_id
        );

        if (existingPostIndexToUpdate !== -1) {
          // If exists, update the existing post
          const updatedPosts = [...state.posts];
          updatedPosts[existingPostIndexToUpdate] = updatedPost;

        return {
          ...state,
          posts: updatedPosts,
        };
      };

    case 'REMOVE_POST':
      const postIdToRemove = action.payload;

      // Filter out the post with the specified post_id
      const updatedPosts = state.posts.filter((post: { post_id: any; }) => post.post_id !== postIdToRemove);

      return {
        ...state,
        posts: updatedPosts,
      };
    // Add more cases as needed for your application
    default:
      return state;
  }
};

// Create a context provider component
export const PostsProvider = ({ children }: {children: ReactNode}) => {
  const [state, dispatch] = useReducer(postsReducer, initialState);

  return (
    <PostsContext.Provider value={{ state, dispatch }}>
      {children}
    </PostsContext.Provider>
  );
};

// Create a custom hook for using the context
export const usePostsContext = () => {
  return useContext(PostsContext);
};
