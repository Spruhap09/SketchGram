// postsContext.js
<<<<<<< Updated upstream
import React, { ReactNode, createContext, useContext, useReducer } from 'react';

// Initial state for posts
const initialState = {
=======
import React, { Dispatch, ReactNode, createContext, useContext, useReducer } from 'react';

// // Initial state for posts
// const initialState = {
//   posts: [],
// };
// Define the structure of a post
interface Post {
  post_id: string; // replace 'string' with the actual type
  // ... other post properties
}

// Define the structure of an action
interface Action {
  type: string;
  payload: Post | string; // replace with specific type based on action
}

// Define the structure of the state
interface State {
  posts: Post[];
}

// Define the structure of the context's value
interface ContextValue {
  state: State;
  dispatch: Dispatch<Action>;
}

// Initial state for posts
const initialState: State = {
>>>>>>> Stashed changes
  posts: [],
};

// Create a context
<<<<<<< Updated upstream
const PostsContext = createContext(initialState);
=======
const PostsContext = createContext<ContextValue>({
  state: initialState,
  dispatch: () => null, // Dummy dispatch function
});

// // Create a context
// const PostsContext = createContext(initialState);
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream

=======
  
>>>>>>> Stashed changes
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

