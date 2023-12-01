import Layout from "@/components/Layout";
import UserPosts from "@/components/UserPosts";
import { AuthContext } from "@/context/AuthContext";
import { updateDisplayName } from "@/firebase/functions";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
import { Avatar, Button, Input, Typography } from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';

export default function EditProfile (){
    const user = useContext(AuthContext);
    const [editName, setEditName] = useState(false);
    const [editPassword, setEditPassword] = useState(false);
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if(editName){
            const form = e.target as HTMLFormElement;
            const displayName = form.elements.namedItem("displayName") as HTMLInputElement;
            try{

                await updateDisplayName(displayName.value)
                setEditName(false)          
            }
            catch(error){
                alert(error)
            }
        }
        else if (editPassword){
            
            setEditPassword(false)
        }
        
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayName(e.target.value)
    }

    if(editName){
        return(
            <div className="flex-grow box-border w-32 p-4 border-4 mr-4 rounded-lg flex flex-col items-center justify-center">
                <Avatar className="my-2"src={user?.photoURL || ""} alt="avatar" size="xxl"/>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h6" color="blue-gray" className="my-2">Your Name</Typography>
                    <Input
                        name="displayName" 
                        size="lg"
                        value= {displayName}
                        onChange={handleNameChange}
                        crossOrigin="anonymous"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                    }}/>
                    <Typography variant="h6" color="blue-gray" className="my-2">Your Email</Typography>
                    <Input
                        name="email" 
                        size="lg"
                        readOnly
                        value={user?.email || ''}
                        crossOrigin="anonymous"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                    }}/>
                    <Button className="mt-6" fullWidth type="submit">Submit</Button>
                </form>
            </div>
        )
    }
    else if(editPassword){
        return(
            <div className="flex-grow box-border w-32 p-4 border-4 mr-4 rounded-lg flex flex-col items-center justify-center">
                <Avatar className="my-2"src={user?.photoURL || ""} alt="avatar" size="xxl"/>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h6" color="blue-gray" className="my-2">Your Name</Typography>
                    <Input
                        name="displayName" 
                        size="lg"
                        value={user?.displayName || ''}
                        crossOrigin="anonymous"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                    }}/>
                    <Typography variant="h6" color="blue-gray" className="my-2">Your Email</Typography>
                    <Input
                        name="email" 
                        size="lg"
                        value={user?.email || ''}
                        crossOrigin="anonymous"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                    }}/>
                    <Typography variant="h6" color="blue-gray" className="my-2">Old Password</Typography>
                    <Input
                        name="oldPassword" 
                        size="lg"
                        placeholder="************"
                        crossOrigin="anonymous"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                    }}/>
                    <Typography variant="h6" color="blue-gray" className="my-2">New Password</Typography>
                    <Input
                        name="newPassword" 
                        size="lg"
                        placeholder="************"
                        crossOrigin="anonymous"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                    }}/>
                    <Button className="mt-6" fullWidth type="submit">Submit</Button>
                </form>
            </div>
        )
    }
    
    return (
        <div className="flex-grow box-border w-32 p-4 border-4 mr-4 rounded-lg flex flex-col items-center justify-center">
            <Avatar className="my-2"src={user?.photoURL || ""} alt="avatar" size="xxl"/>
            <Typography variant="h5" className="">{`Your Name: ${user?.displayName}`} </Typography>
            <Typography variant="h5" className="">{`Your email: ${user?.email}`} </Typography>
            <Button color="blue-gray" variant="gradient" className="my-2" onClick={() => setEditName(true)}>Edit Display Name</Button>
            <Button color="blue-gray" variant="gradient" className="my-2" onClick={() => setEditPassword(true)}>Edit Password</Button>
        </div>
    )
}