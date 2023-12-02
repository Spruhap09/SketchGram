import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { getPost, deletePost, updatePostLikes, updatePostUnLikes } from "@/firebase/functions";
import { DocumentData } from "firebase/firestore";
import { Button, IconButton } from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/20/solid";
import { AuthContext } from "@/context/AuthContext";


export default function Post({
  id,
  setPosts,
}: {
  id: string;
  setPosts: Function;
}) {
  const [src, setSrc] = useState<string>("");
  const [post, setPost] = useState<DocumentData | undefined>();
  const user = useContext(AuthContext);
  useEffect(() => {
    const getSrc = async () => {
      // Get firebase bucket url
      const post = await getPost(id);

      // Get displayable url from api
      const res = await fetch(`/api/image?url=${post?.imageURL}`)
      const {imageUrl} = await res.json();

      // Set state
      setPost(post);
      setSrc(imageUrl);
    };
    getSrc();
  }, [id, user]);

  const handleLike = async () => {
    if (user){
      await updatePostLikes (post?.post_id, post?.userid, user?.uid)
    }
  }

  const handleUnLike = async () => {
    if (user){
      await updatePostUnLikes (post?.post_id, post?.userid, user?.uid)
    }
  }

  return (
    <div className="w-fit h-fit m-5 p-5 flex flex-col justify-center items-center border-blue-gray-500 rounded-md border-2">
      {src.length ? (
        <Image
          src={src}
          alt="alt"
          width={500}
          height={500}
          className="w-auto h-auto border-2 rounded-md border-blue-gray-800"
        />
      ) : (
        <div>loading</div>
      )}
      {post?.description && <div>{post.description}</div>}
      {(post?.likes ? 
        <div>{`Total Number of Likes: ${post?.likes.length}`}</div> 
        : <div>{`Total Number of Likes: 0`}</div>)}

      {(post?.userid !== user?.uid) && (!post?.likes.includes(user?.uid) 
      ? <Button className="mt-6" fullWidth type="submit" onClick={handleLike}>Like Me!</Button> :
      <Button className="mt-6" fullWidth type="submit" onClick={handleUnLike}>Unlike Me</Button>)}
      {(post?.userid !== user?.uid) && <div>Me Commenty</div>}
      {post && (
        <IconButton
          variant="outlined"
          className="m-2"
          onClick={async () => {
            const posts = await deletePost(id);
            setPosts(posts);
      }}
        >
          <TrashIcon title="Delete Post" className="w-full h-full p-0 m-0" />
        </IconButton>
      )}
    </div>
  );
}
