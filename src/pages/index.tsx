import Canvas from "@/components/Canvas";
import { Typography } from "@material-tailwind/react";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export default function Home() {
  return (
    <div className="primary">
      <Typography variant="h1">Landing Page</Typography>
      <Link
        href="/login"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm hover:bg-blue-400 focus:outline-none"
      >
        <ArrowRightIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
        Log In
      </Link>
      <Link
        href="/signup"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm hover:bg-blue-400 focus:outline-none"
      >
        <ArrowRightIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
        Sign Up
      </Link>
    </div>
  );
}
