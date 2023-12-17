import Layout from "@/components/Layout";
import Home from "@/components/Home";
import Explore from "@/components/Explore"
import { AuthContext } from "@/context/AuthContext";
import { Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { getUserbyUid } from "@/firebase/functions";
import TopFeed from "./TopFeed";



export default function Feed() {

    const user = useContext(AuthContext);
    const router = useRouter();
    if(!user) router.push('/login');

    const [activeTab, setTab] = useState('home');
    const [userObj, setUserObj] = useState<any | any >();
    const [ready, setReady] = useState(false);

    useEffect(()=> {
        const getUser = async () => {
            if (user?.uid) {
              const ret_user = await getUserbyUid(user.uid);
              if (ret_user){
              setUserObj(ret_user);
              setReady(true);
              }
            }
          }
          getUser();

    },[user])

    return(
        <div className="flex flex-row">
            {ready ? (
            <>
                <div className="flex flex-col items-center h-screen p-4">
                    <div className="flex items-center justyify-center space-x-4 py-5">
                        <button className="btn bg-blue-gray-800 text-white font-bold py-6 px-6 rounded-full flex items-center justify-center" onClick={() => setTab('home')}>Home</button>
                        <button className="btn bg-blue-gray-800 text-white font-bold py-6 px-6 rounded-full flex items-center justify-center" onClick={() => setTab('expore')}>Explore</button>
                    </div>
                    <div className="flex items-center justyify-center text-4xl space-x-4 py-5 font-bold">
                        {activeTab == 'expore' ? (<p>Explore</p>) : (<p>Home</p>)}
                    </div>
                    <div className="flex-2/3 h-200 overflow-y-scroll scrollbar-thumb-blue-gray-800 scrollbar-thin shadow-md">
                        {activeTab == 'home' && <Home userObj={userObj}/>} 
                        {activeTab == 'expore' && <Explore userObj={userObj}/>}

                    </div>
                </div>


                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justyify-center text-4xl space-x-4 py-10 lg:font-bold">
                        <p>Top 10 Posts</p>
                    </div>
                    <div className="flex flex-col items-center justify-center h-screen">
                        <div className="flex-1/3 h-200 overflow-y-scroll scrollbar-thumb-blue-gray-800 scrollbar-thin shadow-md">
                            {<TopFeed />}
                        </div>
                    </div>

                </div>
            </>
            ) : <div>Loading</div>}

        </div>
        
    )



}

