import { Button, Typography } from "@material-tailwind/react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <Layout>
      <Typography variant="h1">Landing Page</Typography>
      <Button className="m-5" onClick={() => router.push("/login")}>
        Log In
      </Button>
      <Button className="m-5" onClick={() => router.push("/signup")}>
        Sign Up
      </Button>
    </Layout>
  );
}
