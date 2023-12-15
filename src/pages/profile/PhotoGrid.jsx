const PhotoGrid = ({ posts }) => {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {console.log("posts", posts)}
        {posts.map((post, index) => (
          <div key={index} className={`overflow-hidden shadow-lg`}>
            <img src={post.imageURL} alt={post.description} className="w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};



export default PhotoGrid