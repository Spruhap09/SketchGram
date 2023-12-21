import React, { useState } from 'react';
import PhotoSquare from './PhotoSquare';
import Post from "../Post"
import Modal from "../Modal"

const PhotoGrid = ({ posts , setPosts}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePost, setActivePost] = useState(null);

  const handlePhotoClick = (post) => {
    setActivePost(post);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div onClick={() => handlePhotoClick(post)} key={post.post_id}>
            <PhotoSquare post={post} />
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
           {console.log("active post", activePost.post_id)}
          
          <Post key={activePost.post_id} id={activePost.post_id} posts={posts} sample={false} setPosts={setPosts}/>
         
        </Modal>
      )}
    </div>
  );
};

export default PhotoGrid;