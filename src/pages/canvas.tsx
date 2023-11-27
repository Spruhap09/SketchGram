import Canvas from "@/components/Canvas";
import { AuthContext } from "@/context/AuthContext";
import { doSignOut } from "@/firebase/functions";
import { Button } from "@material-tailwind/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";

export default function CanvasPage() {
  const user = useContext(AuthContext);
  const router = useRouter();

  if (!user) router.push("/");

  return (
    <div className="primary">
      <div className="w-full h-1/12 flex flex-col items-start justify-center">
        <div className="w-50 flex flex-col justify-center">
          <Button onClick={doSignOut} className="m-2">
            Sign Out
          </Button>
          <Button onClick={() => router.push("/profile")} className="m-2">
            Profile
          </Button>
        </div>
      </div>
      <Canvas />
    </div>
  );
}
