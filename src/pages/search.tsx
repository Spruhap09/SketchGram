import Layout from "@/components/Layout";
import { searchUsers } from "@/firebase/functions";
import { Input, Typography } from "@material-tailwind/react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import UserProfile from "@/components/UserProfile";

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
            <Typography className='p-5'variant="h1">Search Users</Typography>
            <Input label="Search" crossOrigin="anonymous" onChange={handleSearch}/>

            <div className="flex flex-col items-center h-screen p-4">


            <div>
                {searchResults.map((result, i) => {
                    return <UserProfile key={i} userDetails={result}/>
                })}
            </div>
            </div>
        </Layout>
    )
}