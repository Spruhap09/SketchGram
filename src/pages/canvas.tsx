import Canvas from "@/components/Canvas";
import Layout from "@/components/Layout";
import Navigation from "@/components/Navigation";
import { AuthContext } from "@/context/AuthContext";
import { logOutUser } from "@/firebase/functions";
import { Button } from "@material-tailwind/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";

export default function CanvasPage() {
  const user = useContext(AuthContext);

  // if (!user)
  //   return (
  //     <div className="primary">
  //       <Canvas />
  //     </div>
  //   );

  return (
    <Layout>
      
      <Canvas />
    </Layout>
  );
}
