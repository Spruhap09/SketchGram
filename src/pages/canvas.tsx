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

    if(!user) router.push('/')

    return (
        <div className="primary">
            <div className="w-full h-1/12 flex justify-end">
            <Button onClick={doSignOut} color="blue-gray" variant="gradient" className="m-5 p-1 w-1/12 h-1/12 rounded-full border-2 border-black">Sign Out</Button>
            </div>
            <Canvas/>

        </div>
    )
}