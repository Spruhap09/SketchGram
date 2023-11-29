import Image from "next/image"
import { useEffect, useState } from "react"
import { getPost, getImageFromUrl } from "@/firebase/functions"
import { DocumentData } from "firebase/firestore";

export default function Post({id}: {id: string}) {
    const [src, setSrc] = useState<string>("");
    const [post, setPost] = useState<DocumentData | undefined>();

    useEffect(() => {
        const getSrc = async () => {
            const post = await getPost(id);
            const url = await getImageFromUrl(post?.imageURL);
            setPost(post);
            setSrc(url);
        }
        getSrc();
    }, [id])


    return (
        <div className="w-1/6 h-auto m-5 flex flex-col justify-center items-center border-blue-gray-500 rounded-md border-2">
            {src.length ? <Image src={src} alt="alt" width={500} height={500} className="w-auto h-auto" /> : <div>loading</div>}
            {post?.description && <div>{post.description}</div>}
        </div>
    )
}
