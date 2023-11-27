import GoogleButton from "@/components/GoogleButton";
import { AuthContext } from "@/context/AuthContext";
import { doCreateUserWithEmailAndPassword } from "@/firebase/functions";
import { HomeModernIcon } from "@heroicons/react/24/solid";
import {
  Card,
  Typography,
  Input,
  Checkbox,
  Button,
  CardHeader,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

export default function SignUp() {
  const user = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState("");
  const router = useRouter();

  // Triggered on form submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const displayName = form.elements.namedItem(
      "displayName"
    ) as HTMLInputElement;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;
    const passwordConfirmation = form.elements.namedItem(
      "passwordConfirmation"
    ) as HTMLInputElement;

    if (password.value !== passwordConfirmation.value) {
      setPwMatch("Passwords do not match");
      return false;
    }

    try {
      await doCreateUserWithEmailAndPassword(
        email.value,
        password.value,
        displayName.value
      );
    } catch (error) {
      console.log(error, typeof error, "error");
      alert(error);
    }
  };

  // Redirect to canvas if user is logged in
  if (user) router.push("/canvas");

  return (
    <div className="primary">
      <Card color="transparent" shadow={true}>
        <CardHeader>
          <Typography variant="h1">Sign Up</Typography>
          <Typography variant="h2" color="gray">
            Enter your details to continue to your canvas.
          </Typography>
        </CardHeader>
        <CardBody>
          <form
            className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
            onSubmit={handleSignUp}
          >
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Display Name
              </Typography>
              <Input
                name="displayName"
                size="lg"
                placeholder="Your Name"
                className="rounded-full p-3 !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                crossOrigin="anonymous"
              />
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
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Confirm Password
              </Typography>
              <Input
                name="passwordConfirmation"
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
                <HomeModernIcon/>
              </div>
              <div className="w-full flex justify-center">Sign Up</div>
            </Button>
          </form>
        </CardBody>
        <CardFooter className="mt-10 p-2 h-fit rounded-xl border-2 border-blue-gray-200">
          <GoogleButton />
          <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-gray-900">
              Log In
            </Link>
          </Typography>
        </CardFooter>
      </Card>
    </div>
  );
}
