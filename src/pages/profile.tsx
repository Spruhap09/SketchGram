import { AuthContext } from "@/context/AuthContext";
import { Button, Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useContext } from "react";

export default function Profile() {
    const user = useContext(AuthContext);
    const router = useRouter();
    console.log('user', user)

    return (
        <div className="primary">
            <Typography variant="h1" prefix="Hello" className="underline"> Profile </Typography>
            <Typography variant="h2" className=""> {user?.displayName} </Typography>
            <Typography variant="h3" className=""> {user?.email} </Typography>
            <Button color="blue-gray" variant="gradient" onClick={() => router.push('/canvas')}>Back to Canvas</Button>
        </div>
    )
}