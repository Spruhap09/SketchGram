import React, { useContext, useState } from 'react';
import Modal from './Modal';
import { AuthContext } from "@/context/AuthContext";
import { Typography, Input, Button } from "@material-tailwind/react";
import { updateDisplayName } from "@/firebase/functions"; 

const ChangeDisplayName = () => {
    const user = useContext(AuthContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [displayName, setDisplayName] = useState(user?.displayName || '');

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateDisplayName(displayName);
            setModalOpen(false);
            window.location.reload()
        } catch (error) {
            alert(error);
        }
    };

    const handleNameChange = (e) => {
        setDisplayName(e.target.value);
    };

    return (
        <>
            <div className="max-w-xl mx-auto p-4">
                <h2 className="text-lg font-medium text-gray-700">Account Details</h2>
                <button
                    className="mt-4 bg-gray-50 w-full py-2 px-4 text-left text-black font-semibold rounded-lg shadow-md"
                    onClick={handleOpenModal}
                >
                    Change Display Name
                </button>
            </div>
            {isModalOpen && (
                <Modal onClose={handleCloseModal}>
                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col max-w-md">
                        <div className="mb-4">
                            <h1 className="text-xl font-semibold">Change Display Name</h1>
                            <p className="text-sm text-gray-600 my-2">
                                Update your display name for your account.
                            </p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="display-name">
                                    Your Name
                                </label>
                                <Input
                                    name="displayName"
                                    type="text"
                                    size="lg"
                                    value={displayName}
                                    onChange={handleNameChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
                                />
                            </div>
                            <div className="flex justify-center">
                                <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default ChangeDisplayName;