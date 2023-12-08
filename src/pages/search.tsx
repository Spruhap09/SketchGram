import Layout from "@/components/Layout";
import { searchUsers } from "@/firebase/functions";
import { Input, Typography } from "@material-tailwind/react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Search() {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [searchResults, setSearchResults] = useState<User[]>([])
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }

    useEffect(() => {
        const trimmedSearch = searchTerm.trim();
        const fetchResults = async () => {
            let results = [];
            if(trimmedSearch.length > 0)
                results = await searchUsers(trimmedSearch);
            setSearchResults(results);
        }

        fetchResults();
    }, [searchTerm])

    return (
        <Layout>
            <Typography variant="h1">Search Users</Typography>
            <Typography variant="h2">TODO Implement way to find and follow other users profiles</Typography>
            <Input label="Search" crossOrigin="anonymous" onChange={handleSearch}/>
            <div>
                {searchResults.map((result, i) => {
                    return <Typography key={i} variant="h2">{result?.displayName} {result?.email}</Typography>
                })}
            </div>
        </Layout>
    )
}