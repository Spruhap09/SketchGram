import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { getPost, deletePost, updatePostLikes, updatePostUnLikes, updatePostComments } from "@/firebase/functions";
import { DocumentData } from "firebase/firestore";
import { Button, IconButton, Input, Typography } from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/20/solid";
import { AuthContext } from "@/context/AuthContext";
import router from "next/router";

export default function Post({
  id,
  setPosts,
  posts,
}: {
  id: string;
  setPosts: any;
  posts: any;
}) {

  const [src, setSrc] = useState<string>("");
  const [post, setPost] = useState<DocumentData | undefined>();
  const user = useContext(AuthContext);
  const [comment, setComment] = useState('');

  if(!user) router.push('/login');
  useEffect(() => {
    const getSrc = async () => {
      console.log("from Post, id = " + id)
      // Get firebase bucket url
      //get post from posts context
      const post = posts.find((post: { post_id: string; }) => post.post_id === id);
      console.log(post);

      const res = await fetch(`/api/image?url=${post?.imageURL}`)
      const {imageUrl} = await res.json();

      // Set state
      setPost(post);
      setSrc(imageUrl);
    };
    getSrc();

    console.log(post?.userid === user?.uid)

  }, [id, user, post]);

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

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (comment && user?.uid) {
        await updatePostComments(post?.post_id, comment, user?.uid);
      }
    } catch (e) {
      alert(e);
    }
  };

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
      {(!post?.likes.includes(user?.uid) 
      ? <Button className="m-6" type="submit" onClick={handleLike}>Like Me!</Button> :
      <Button className="m-6" type="submit" onClick={handleUnLike}>Unlike Me</Button>)}
      {(post && post?.comments) && (
        <div>
          {post.comments.map((postComment: string) => (
            <Typography>{postComment}</Typography>
          ))}
        </div>
)}
      <form onSubmit={handleSubmit}>
          <Input
            name="comment" 
            size="lg"
            placeholder="Your comment..."
            onChange={handleCommentChange}
            crossOrigin="anonymous"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
            className: "before:content-none after:content-none",
        }}/>
        <Button className="mt-6" fullWidth type="submit">Submit</Button>
      </form>
      {post && (
        <IconButton
          variant="outlined"
          className="m-2"
          onClick={async () => {
            const posts = await deletePost(id);
            console.log("from delete " + posts);
            //remove post from posts context
            const newPosts = posts.filter((post: { post_id: string; }) => post.post_id !== id);
            setPosts(newPosts);
          }}
        >
          <TrashIcon title="Delete Post" className="w-full h-full p-0 m-0" />
        </IconButton>
      )}
    </div>
  );
}
