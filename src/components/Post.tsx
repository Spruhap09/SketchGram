import Image from "next/image";
import { useEffect, useState } from "react";
import { getPost, deletePost } from "@/firebase/functions";
import { DocumentData } from "firebase/firestore";
import { IconButton } from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/20/solid";

export default function Post({
  id,
  setPosts,
}: {
  id: string;
  setPosts: Function;
}) {
  const [src, setSrc] = useState<string>("");
  const [post, setPost] = useState<DocumentData | undefined>();

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
            setPosts(posts);
          }}
        >
          <TrashIcon title="Delete Post" className="w-full h-full p-0 m-0" />
        </IconButton>
      )}
    </div>
  );
}