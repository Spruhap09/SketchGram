import Layout from "@/components/Layout";
import Home from "@/components/Home";
import Explore from "@/components/Explore"
import { AuthContext } from "@/context/AuthContext";
import { Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { getUserbyUid } from "@/firebase/functions";



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
        <div>
            {ready ? (
            <>
                <div>
                    <div className="flex items-center justyify-center space-x-4 py-5">
                        <button className="btn bg-blue-gray-800 text-white font-bold py-1 px-4 rounded-full" onClick={() => setTab('home')}>Home</button>
                        <button className="btn bg-blue-gray-800 text-white font-bold py-1 px-4 rounded-full" onClick={() => setTab('expore')}>Explore</button>
                    </div>
                </div>


                <div className="flex items-cetner justify-center h-screen">
                    <div className="flex-2/3 overflow-y-scroll scrollbar-thumb-blue-gray-800 scrollbar-thin shadow-md">
                        {activeTab == 'home' && <Home userObj={userObj}/>}
                        {activeTab == 'expore' && <Explore userObj={userObj}/>}
                    </div>
                    <div className="flex-1/3 p-4">
                        <p className="text-center"> Top 3 Pictures</p>
                    </div>

                </div>
            </>
            ) : <div>Loading</div>}

        </div>
        
    )



}

