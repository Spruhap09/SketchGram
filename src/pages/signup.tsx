import GoogleButton from "@/components/GoogleButton";
import Layout from "@/components/Layout";
import { AuthContext } from "@/context/AuthContext";
import { signUpWithEmailAndPassword } from "@/firebase/functions";
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

  // Redirect to canvas if user is logged in
  if (user) router.push("/canvas");

  // Triggered on form submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // Extract form data
    const form = e.target as HTMLFormElement;
    const displayName = form.elements.namedItem(
      "displayName"
    ) as HTMLInputElement;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;
    const passwordConfirmation = form.elements.namedItem(
      "passwordConfirmation"
    ) as HTMLInputElement;

    // Check if passwords match
    if (password.value !== passwordConfirmation.value) {
      setPwMatch("Passwords do not match");
      return false;
    }

    // Sign up
    try {
      await signUpWithEmailAndPassword(
        email.value,
        password.value,
        displayName.value
      );
    } catch (error) {
      console.log(error, typeof error, "error");
      alert(error);
      return
    }
  };

  return (
    <Layout>
      <Card color="transparent" shadow={true} className="p-20">
        <CardHeader className="p-5">
          <Typography variant="h4" color="blue-gray">
            Sign Up
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
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
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
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
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                crossOrigin="anonymous"
              />
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                Password
              </Typography>
              {pwMatch.length > 0 && <Typography color="red">{pwMatch}</Typography>}
              <Input
                name="password"
                type="password"
                size="lg"
                placeholder="********"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
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

            <Button className="mt-6" fullWidth type="submit">
              Sign Up
            </Button>
          </form>
        </CardBody>
        <CardFooter>
          <GoogleButton />
          <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-gray-900">
              Log In
            </Link>
          </Typography>
        </CardFooter>
      </Card>
    </Layout>
  );
}
