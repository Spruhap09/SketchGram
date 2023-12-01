import Canvas from "@/components/Canvas";
import Layout from "@/components/Layout";
import Navigation from "@/components/Navigation";
import { AuthContext } from "@/context/AuthContext";
import { logOutUser } from "@/firebase/functions";
import { Button } from "@material-tailwind/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import UserDrafts from "@/components/UserDrafts";
import PostButton from "@/components/PostButton";

export default function CanvasPage() {
  const user = useContext(AuthContext);

  return (
    <Layout>
      <Canvas />
      {user && (
        <>
          <UserDrafts />
          
          <PostButton />
        </>
      )}
    </Layout>
  );
}
