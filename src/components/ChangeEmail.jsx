import { useState, useContext } from "react";
import Modal from "./Modal";
import { updateEmail } from '../firebase/functions.ts';
import { AuthContext } from "@/context/AuthContext";
import { Typography, Button, Input } from "@material-tailwind/react";
    
const ChangeEmail = () => {
    const user = useContext(AuthContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [email, setEmail] = useState(user?.email || '');

    const handleOpenModal = () => {
        setEmail(user?.email || ''); 
        setModalOpen(true);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateEmail(email);
            setModalOpen(false);
        } catch (error) {
            alert(error);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return(
        <div>
            <div className="max-w-xl mx-auto p-4">
                <h2 className="text-lg font-medium text-gray-700">Email</h2>
                <button
                    className="mt-4 bg-gray-50 w-full py-2 px-4 text-left text-black font-semibold rounded-lg shadow-md"
                    onClick={handleOpenModal} 
                >
                    Change Email
                </button>

                {isModalOpen && (
                    <Modal onClose={handleCloseModal}>
                        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col max-w-xl">
                            <div className="mb-4">
                                <h1 className="text-xl font-semibold">Change Email</h1>
                                <p className="text-sm text-gray-600 my-2">
                                    Update your email for your account.
                                </p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <Typography variant="h6" color="blue-gray" className="my-2">New Email</Typography>
                                    <Input
                                        name="email" 
                                        size="lg"
                                        value={email} 
                                        crossOrigin="anonymous"
                                        className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                        onChange={handleEmailChange}
                                        labelProps={{
                                            className: "before:content-none after:content-none",
                                        }}
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
            </div>
        </div>
    );
}

export default ChangeEmail;