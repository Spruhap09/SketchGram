import Layout from "@/components/Layout";
import { searchPosts, searchUsers } from "@/firebase/functions";
import { Input, Typography } from "@material-tailwind/react";
import { User } from "firebase/auth";
import PhotoGrid from "@/components/profile/PhotoGrid";
import { useEffect, useState } from "react";
import UserProfile from "@/components/UserProfile";
import Post from "@/components/Post";

export default function Search() {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [searchResults, setSearchResults] = useState<User[]>([])
    const [activeTab, setTab] = useState('none');
    const [posts, setPosts] = useState<any[] | null>(null);
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchResults([])
        setSearchTerm(e.target.value);
    }

    useEffect(() => {
        const trimmedSearch = searchTerm.trim();
        const fetchResults = async () => {
            let results = [];
            if(trimmedSearch.length > 0 && activeTab === 'user')
                results = await searchUsers(trimmedSearch);

            if(trimmedSearch.length > 0 && activeTab === 'post')
                results = await searchPosts(trimmedSearch)
                results = results.filter(
                    (post: { post_id: any; }, index: any, self: any[]) =>
                      index === self.findIndex((p) => p.post_id === post.post_id)
                  );

            setSearchResults(results);
            setPosts(results|| null);

        }

        fetchResults();
    }, [searchTerm])


    const handleSwitch = (name:string) => {
        setTab(name)
        setSearchResults([])
        setSearchTerm("")
    }

    return (
        <Layout>
            <div className="flex items-center justyify-center space-x-4 py-5">
                <button className="btn bg-blue-gray-800 text-white font-bold py-6 px-6 rounded-full flex items-center justify-center" onClick={() => handleSwitch('user')}>Search Users</button>
                <button className="btn bg-blue-gray-800 text-white font-bold py-6 px-6 rounded-full flex items-center justify-center" onClick={() => handleSwitch('post')}>Search Posts</button>
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
                    <PhotoGrid posts={searchResults} setPosts={setPosts} />
                </div>
            </div> : <div><p>Pick a search option! </p></div>}
        </Layout>
    )
}