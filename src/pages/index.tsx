import Canvas from "@/components/Canvas";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export default function Home() {
  return (
    <div className="primary">
      <Typography variant="h1">Landing Page</Typography>
      <Button color="blue-gray" variant="gradient" className="m-5">
        <Link href="/login">
          <ArrowRightIcon />
          <Typography>Log In</Typography>
        </Link>
      </Button>
      <Button color="blue-gray" variant="gradient" className="m-5">
        <Link href="/signup">
          <ArrowRightIcon />
          <Typography>Sign Up</Typography>
        </Link>
      </Button>
    </div>
  );
}
