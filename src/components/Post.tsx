import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { getPost, deletePost } from "@/firebase/functions";
import { DocumentData } from "firebase/firestore";
import { IconButton } from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/20/solid";
import { AuthContext } from "@/context/AuthContext";
import { usePostsContext } from "@/context/PostsContext";



export default function Post({
  id,
}: {
  id: string;
}) {
  const { state, dispatch } = usePostsContext();

  const [src, setSrc] = useState<string>("");
  const [post, setPost] = useState<DocumentData | undefined>();
  const user = useContext(AuthContext);
  useEffect(() => {
    const getSrc = async () => {
      console.log("from Post, id = " + id)
      // Get firebase bucket url
      const post = await getPost(id);
      console.log(post);

      // Get displayable url from api
      const res = await fetch(`/api/image?url=${post?.imageURL}`)
      const {imageUrl} = await res.json();

      // Set state
      setPost(post);
      console.log('here is the post')
      console.log(post)
      setSrc(imageUrl);
    };
    getSrc();
  }, [id]);

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
      {post && (
        <IconButton
          variant="outlined"
          className="m-2"
          onClick={async () => {
            const posts = await deletePost(id);
            console.log("from delete " + posts);
            dispatch({ type: "REMOVE_POST", payload: id });
            console.log(state.posts);
          }}
        >
          <TrashIcon title="Delete Post" className="w-full h-full p-0 m-0" />
        </IconButton>
      )}
    </div>
  );
}
