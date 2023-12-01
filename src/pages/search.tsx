import Layout from "@/components/Layout";
import { Input, Typography } from "@material-tailwind/react";
import { useState } from "react";

export default function Search() {
    const [search, setSearch] = useState<string>("")

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setSearch(e.target.value);
    }

    // TODO
    return (
        <Layout>
            <Typography variant="h1">Search Users</Typography>
            <Typography variant="h2">TODO Implement way to find and follow other users profiles</Typography>
            <Input label="Search" crossOrigin="anonymous" onChange={handleSearch}/>
            <div>
                {search}
            </div>
        </Layout>
    )
}