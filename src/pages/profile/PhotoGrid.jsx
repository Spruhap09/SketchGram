import PhotoSquare from './PhotoSquare'
const PhotoGrid = ({ posts }) => {
  // const res = await fetch(`/api/image?url=${post?.imageURL}`);
  // const data = await res.json();
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((p, index) => (
          // <div key={index} className={`overflow-hidden shadow-lg`}>
          //   <img src={post.imageURL} alt={post.description} className="w-full object-cover" />
          // </div>
          
          <PhotoSquare post={p}/>
        ))}
      </div>
    </div>
  );
};



export default PhotoGrid