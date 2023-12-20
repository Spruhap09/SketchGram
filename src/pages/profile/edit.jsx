import React from 'react';
 import ProfileCard from "../../components/ProfileCard";
 import EditProfile from "../../components/EditProfile";
 import ChangePassword from "../../components/ChangePassword";
 import Layout from "../../components/Layout";
 import ChangeDisplayName from '../../components/ChangeDisplayName';
 import ChangeEmail from '../../components/ChangeEmail';
 import { useRouter } from 'next/router';
 import { Button } from '@material-tailwind/react';

 const EditProfileButton = () => {
     const router = useRouter();
     return (
         <>
             <Layout/>
             <div className="flex flex-col items-center justify-start space-y-4 w-full pb-10">
                 <div className="max-w-xl w-full mx-auto p-4">
                     <h1 className="text-2xl font-bold text-black mb-4 ml-4">Edit Profile</h1>
                     <ProfileCard />
                 </div>
                 <div className="max-w-xl w-full mx-auto p-4">
                     <ChangeDisplayName />
                 </div>
                 <div className="max-w-xl w-full mx-auto p-4">
                     <ChangeEmail />
                 </div>
                 <div className="max-w-xl w-full mx-auto p-4">
                     <ChangePassword />
                 </div>
                 <Button color="blue-gray" variant="gradient" className="my-2" onClick={() => router.push("/profile")}>Back to Profile</Button>
             </div>
         </>
     );
 }

 export default EditProfileButton;