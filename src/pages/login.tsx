import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { doSignInWithEmailAndPassword } from "@/firebase/functions";
import { useRouter } from "next/router";
import {
  Card,
  Input,
  Typography,
  Button,
  CardHeader,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import SocialSignIn from "@/components/SocialSignIn";
import { HomeIcon } from "@heroicons/react/24/solid";

export default function Login() {
  const user = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;

    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
    } catch (error) {
      alert(error);
    }
  };

  if (user) router.push("/canvas");

  return (
    <div className="primary">
      <Card shadow={true}>
        <CardHeader>
          <Typography variant="h1">Log In</Typography>
          <Typography variant="h2" color="gray">
            Log into your account.
          </Typography>
        </CardHeader>
        <CardBody>
          <form
            className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
            onSubmit={handleLogin}
          >
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Your Email
              </Typography>
              <Input
                name="email"
                size="lg"
                placeholder="name@mail.com"
                className="rounded-full p-3 !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                crossOrigin="anonymous"
              />
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Password
              </Typography>
              <Input
                name="password"
                type="password"
                size="lg"
                placeholder="********"
                className="rounded-full p-3 !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                crossOrigin="anonymous"
              />
            </div>

            <Button
              color="blue"
              fullWidth
              className="mt-5 rounded-full border border-black flex text-center items-center justify-start text-black"
              type="submit"
              variant="outlined"
            >
              <div className="w-5 h-5 ml-10 mt-2 mb-2">
                <HomeIcon />
              </div>
              <div className="w-full flex justify-center">Log In</div>
            </Button>
          </form>
        </CardBody>
        <CardFooter className="mt-10 p-2 rounded-xl border-2 border-blue-gray-200">
          <SocialSignIn />
          <Typography color="gray" className="mt-4 text-center font-normal">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="font-medium text-gray-900">
              Sign Up
            </a>
          </Typography>
        </CardFooter>
      </Card>
    </div>
  );
}