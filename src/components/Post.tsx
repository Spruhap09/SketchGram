import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { getUserbyUid, deletePost, updatePostLikes, updatePostComments } from "@/firebase/functions";
import { DocumentData } from "firebase/firestore";
import { Button, IconButton, Input, Typography, input } from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/20/solid";
import { AuthContext } from "@/context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import router from "next/router";
import {
  FaceSmileIcon,
  ChatBubbleBottomCenterIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import {HeartIcon as HeartIconFilled} from "@heroicons/react/20/solid"
import Moment from "react-moment"

export default function Post({
  id,
  posts,
}: {
  id: string;
  posts: any;
}) {

  const [src, setSrc] = useState<string>("");
  const [post, setPost] = useState<DocumentData | undefined>();
  const user = useContext(AuthContext);
  const [comment, setComment] = useState('');
  const [ready, setReady] = useState(false);
  const [userObj, setUserObj] = useState<any | any >();
  const [likes, setLikes] = useState<string[]>([]);

  //this is used to set the cursor to comment box when clicking comment button
  const inputRef = useRef<HTMLInputElement>(null);

  if(!user) router.push('/login');

  useEffect(() => {
    setReady(false);
    const getSrc = async () => {
      console.log("from Post, id = " + id)

     
      // Get firebase bucket url
      //get post from posts context
      const post = posts.find((post: { post_id: string; }) => post.post_id === id);

      //order comments by timestamp
      if (post?.comments){
        post.comments.sort((a: { timestamp: string; }, b: { timestamp: string; }) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
      }



      const res = await fetch(`/api/image?url=${post?.imageURL}`)
      const {imageUrl} = await res.json();

      

      // Set state
      setPost(post);
      setSrc(imageUrl);
      setLikes(post?.likes)
    };
    async function getUser() {
      if (post?.userid) {
        const user = await getUserbyUid(post.userid);
        if (user){
        console.log(user);
        setUserObj(user);
        setReady(true);
        }
      }
    }
    getUser();
    getSrc();

  }, [id, user, post]);

  const handleLike = async () => {
    try {
      if (user){
        await updatePostLikes (post?.post_id, post?.userid, user?.uid)
        //update post context
        const newLikes = [...post?.likes, user?.uid];
        post.likes = newLikes;
        console.log(post.likes)
        setPost(post);
        setLikes(newLikes);
      }
      
    } catch (error) {
      alert(error)
    }
  }

  const focusInput = async () => {
    if (inputRef.current) {
      inputRef?.current?.focus();
    }

  }

  const handleUnLike = async () => {
    try {
      if (user){
        await updatePostLikes (post?.post_id, post?.userid, user?.uid)
        //update post context
        const newLikes = post?.likes.filter((like: string) => like !== user?.uid);
        post.likes = newLikes;
        console.log(post.likes)
        setPost(post);
        setLikes(newLikes);
      }
      
    } catch (error) {
      alert(error)
    }
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (comment && user?.uid) {
        //create comment object
        const comment_obj = {
          uid: uuidv4(),
          comment: comment,
          userid: user?.uid,
          username: user?.displayName,
          profile_img: userObj?.profile_img,
          timestamp: new Date().toISOString(),
        };
        await updatePostComments(post?.post_id, comment_obj, user?.uid);
        post?.comments.push(comment_obj);

        //resort comments by timestamp
        post?.comments.sort((a: { timestamp: string; }, b: { timestamp: string; }) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        setPost(post);
        setComment('');
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <>
    {ready ? (

      <div className="bg-blue-gray-800 my-7 border rounded-sm text-white !important max-w-500 overflow-x-hidden">
        <div className="flex items-center p-5">
          <img src={userObj?.profile_img} width={500} height={500} className="rounded-full h-12 w-12 object-contain border-2 p-1 mr-3" alt={"prfoile picture for " + userObj?.displayName} />
          <p className="flex-1 font-bold text-white">{userObj?.displayName}</p>
        </div>
        {src.length ? 
        (
          <img src={src} alt="user post" className="object-cover w-full bg-white" />
        ) : (<div>loading</div>)}


        
        <div className="flex space-x-4 p-4">
         
          {(!likes.includes(user?.uid) 
          ?  <HeartIcon onClick={handleLike} className='btn text-white'/> :
          <HeartIconFilled onClick={handleUnLike} className='btn text-red-500'/>
          )}
          <ChatBubbleBottomCenterIcon onClick={focusInput} className='btn text-white'/>
          <PaperAirplaneIcon className='btn text-white'/>
        </div>

          
        {/* Caption */}

        
        <div className="px-5 py-3 truncate">
        {likes.length > 0 && (
            <>
            {likes.length > 1 ? (
            <p className="font-bold mb-1">{likes.length} likes</p>) : (
            <p className="font-bold mb-1">{likes.length} like</p>)}
            </>
          )
          }
          <span className="font-bold mr-1 ml-1">{userObj?.displayName}</span>
          <span>{post?.description}</span>
        </div>

        {/* Comments */}
        <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-white scrollbar-thin">
        {(post && post?.comments) && (
            <div>
              {post.comments.map((postComment: any) => (
                <div key={postComment.uid} className="flex items-center space-x-2 ab-3 p-2 block">
                  <img src={postComment?.profile_img}
                  alt={"comment pofile picture for user " + postComment?.username}
                  className="h-7 rounded-full" />
                  <p className="text-sm flex-1 truncate space-x-4 overflow-ellipsis block whitespace-no-wrap">
                    <span className="font-bold mr-2">{postComment?.username}</span>
                    {postComment?.comment}
                  </p>

                  <Moment fromNow className="pr-5 text-xs">
                    {postComment?.timestamp}
                  </Moment>

                </div>
              ))}
            </div>)
         }

        </div>

        {/* Input Box */}
        <form onSubmit={handleSubmit} className="flex items-center space-x-3 p-4">
          <FaceSmileIcon className='h-7'/>
          <input 
            ref={inputRef}
            type="text" 
            value={comment}
            onChange={handleCommentChange}
            placeholder="Add a comment..."
            className="bg-blue-gray-400 p-1 border-none flex-1 focus:ring-0 outline=none text-sm" />
          <button disabled={!comment.trim()} type='submit' className="font-semibold btn">Post</button>
        </form>

          {/* <div className="w-fit h-fit m-5 p-5 flex flex-col justify-center items-center border-blue-gray-500 rounded-md border-2">
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
            </div>)}
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
        </div> */}
    </div>

    ): (<div>loading</div>)}
    </>
    

  );
}
