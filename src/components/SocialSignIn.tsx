import { doSocialSignIn } from "@/firebase/functions"
import { Button } from "@material-tailwind/react";
import GoogleButton from "./GoogleButton";

export default function SocialSignIn() {
    const signOn = async () => {
        try {
            await doSocialSignIn();
        } catch (error) {
            alert(error);
        }
    }

    return (
        <GoogleButton onClick={signOn}/>
    )
}