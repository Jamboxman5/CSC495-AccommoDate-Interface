import { useState } from "react";
import { getID, getToken } from "../services/auth";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export default function ChangePasswordModal({ isOpen, onClose }: Props) {

    const [PWD, setPWD] = useState({
        userid: getID(),
        newpassword: "",
        confirmpwd: "",
    })

    if (!isOpen) return null;

    const handleChangePWD = () => {
        const message = "Are you sure you want change your password?";
        const confirmed = window.confirm(message);

        if (!confirmed) return;

        fetch(`http://localhost:8080/api/user/changepwd`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
            body: JSON.stringify(PWD),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to change password");
                }
            })
            
            .catch((err) => {
                console.error("Error saving password: ", err);
            });

    }


    const canSave = PWD.newpassword.length > 6 && PWD.newpassword == PWD.confirmpwd;


    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-gradient-to-b from-gray-700 text-center to-gray-800 rounded-lg shadow-lg p-6 min-w-3/8 min-h-1/2 max-w-md">
                <h2 className="text-3xl text-white font-semibold mb-4">Change Password:</h2>

                <input
            type="password"
            value={PWD.newpassword}
                    placeholder="New Password: "
                    onChange={(e) => setPWD({...PWD, newpassword: e.target.value})}
                    className="text-white bg-gray-700 placeholder-gray-300 w-3/4 mb-2 px-3 py-2 border rounded"
                />
                <input
            type="password"
            value={PWD.confirmpwd}
                    placeholder="Confirm Password: "
                    onChange={(e) => setPWD({...PWD, confirmpwd: e.target.value})}
                    className="text-white bg-gray-700 placeholder-gray-300 w-3/4 mb-2 px-3 py-2 border rounded"
                />


                <div className="flex justify-center gap-2 mt-[40px]">
                    <button
                        onClick={() => onClose()}
                        className="px-4 py-2 text-sm !bg-gray-200 rounded hover:!bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            handleChangePWD();
                            onClose();
                        }}
                        disabled={!canSave}

                        className={`px-4 py-2 text-sm rounded transition ${canSave
                            ? '!bg-blue-600 text-white hover:!bg-blue-700'
                            : '!bg-gray-500 text-white cursor-not-allowed'
                            }`}
                    >
                        Save
                    </button>

                </div>
            </div>
        </div>
    )
}