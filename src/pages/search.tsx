import Layout from "@/components/Layout";
import { searchUsers } from "@/firebase/functions";
import { Input, Typography } from "@material-tailwind/react";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import UserProfile from "@/components/UserProfile";

export default function Search() {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [searchResults, setSearchResults] = useState<User[]>([])
    const [activeTab, setTab] = useState('none');
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
            <div className="flex items-center justyify-center space-x-4 py-5">
                <button className="btn bg-blue-gray-800 text-white font-bold py-6 px-6 rounded-full flex items-center justify-center" onClick={() => setTab('user')}>Search Users</button>
                <button className="btn bg-blue-gray-800 text-white font-bold py-6 px-6 rounded-full flex items-center justify-center" onClick={() => setTab('post')}>Search Posts</button>
            </div>
            
            {activeTab === 'user' ? 
            <div>
                <Typography className='p-5'variant="h1">Search Users</Typography>
                <Input label="Search" crossOrigin="anonymous" onChange={handleSearch}/>
                <div>
                    {searchResults.map((result, i) => {
                        return <UserProfile key={i} userDetails={result}/>
                    })}
                </div>
            </div> : activeTab === 'post' ?
            <div>
                <Typography className='p-5'variant="h1">Search Posts</Typography>
                <Input label="Search" crossOrigin="anonymous" onChange={handleSearch}/>
                <div>
                    {searchResults.map((result, i) => {
                        return <UserProfile key={i} userDetails={result}/>
                    })}
                </div>
            </div> : <div><p>Pick a search option! </p></div>}       
        </Layout>
    )
}