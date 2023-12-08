const PhotoGrid = ({ photos }) => {
    return (
      <div className="photo-grid">
        {photos.map(photo => (
          <img key={photo.id} src={photo.src} alt={photo.alt} />
        ))}
      </div>
    );
  };

export default PhotoGrid