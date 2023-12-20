import { useContext, useState, useEffect } from "react";
import { searchByTitleFn} from "@/firebase/functions";
import { AuthContext } from "@/context/AuthContext";
import { Typography, Input, Button } from "@material-tailwind/react";
import Layout from "@/components/Layout"
import PhotoGrid from "@/components/profile/PhotoGrid"

const SearchByTitle = () => {
    const user = useContext(AuthContext);

    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    useEffect(() => {
        const trimmedSearch = searchTerm.trim();
        const fetchResults = async () => {
            let results = [];
            if(trimmedSearch.length > 0)
                results = await searchByTitleFn(trimmedSearch);
            setSearchResults(results);
        }

        fetchResults();
    }, [searchTerm])
  return (
    <Layout>
      <Typography className='p-5'variant="h1">Search for Posts</Typography>
            <Input label="Search" crossOrigin="anonymous" onChange={handleSearch}/>
            <div>
                <PhotoGrid posts={searchResults} />
            </div>
    </Layout>
  );
}

export default SearchByTitle