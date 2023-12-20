import React, { useState, useContext } from 'react';
import { AuthContext } from "@/context/AuthContext";
import Modal from './Modal'; 
import { changePassword, updateDisplayName, getUserbyUid } from "@/firebase/functions";
import { Typography, Input , Button} from '@material-tailwind/react';

const ChangePassword = () => {
    const user = useContext(AuthContext);
  const [isModalOpen, setModalOpen] = useState(false)
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const handlePasswordSubmit = async (e) => {
    console.log("e", e)
    e.preventDefault();
    const form = e.target;
    console.log("form", form)
    const oldPassword = form.elements.namedItem("oldPassword") ;
    const newPassword = form.elements.namedItem("newPassword") ;
    console.log("old password", oldPassword.value)
    try{
        await changePassword(user.email, oldPassword.value, newPassword.value)
    }
    catch(error){
        alert(error)
    }     
  } 

  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value)
    }
    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value)
    }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-lg font-medium text-gray-700">Account Security</h2>
      <button
        className="mt-4 bg-gray-50 w-full py-2 px-4 text-left text-black font-semibold rounded-lg shadow-md"
        onClick={handleOpenModal} 
      >
        Change password
      </button>

      {isModalOpen && <Modal onClose={handleCloseModal}>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col max-w-md">
            <div className="mb-4">
            <h1 className="text-xl font-semibold">Change password</h1>
            <p className="text-sm text-gray-600 my-2">
                You will be logged out of this account and will be prompted to log in again with your new password.
            </p>
            </div>
            <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
                <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="current-password">
                Current password
                </label>
                <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                id="oldPassword"
                type="password"
                placeholder="Current Password"
                value={oldPassword}
                onChange={handleOldPasswordChange}
                />
            </div>
            <div className="mb-4">
                <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="new-password">
                New password
                </label>
                <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                id="newPassword"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                />
            </div>
            <div className="flex justify-center">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
                Update Password
                </button>
            </div>
            </form>
        </div>
</Modal>}

    </div>
  );
};

export default ChangePassword;