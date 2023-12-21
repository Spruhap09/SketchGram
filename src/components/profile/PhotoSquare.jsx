import React, { useEffect, useState } from 'react';

const PhotoSquare = ({ post }) => {
    const [picture, setPicture] = useState(null);

    useEffect(() => {
        const fetchPicture = async () => {
            try {
                console.log("Fetching image for", post.imageURL);
                const res = await fetch(`/api/image?url=${post.imageURL}`);
                const data = await res.json();
                if (data.imageUrl) {
                    setPicture(data.imageUrl);
                }
            } catch (error) {
                console.error('Error fetching picture:', error);
            }
        };
        fetchPicture();
    }, [post]); 

    return (
        <div className="overflow-hidden shadow-lg">
            <img src={picture} alt={post.description} className="w-full object-cover" />
        </div>
    );
};

export default PhotoSquare;