import { useEffect, useState } from 'react';
import { getUserRole } from '../services/auth';
import NavigationBar from "../components/NavigationBar";
import { getToken, getID } from '../services/auth';
import "./tailwind.css"
import { User } from '../interfaces/User';
import { getAccommodationString } from '../services/textUtil';
import ChangePasswordModal from '../components/ChangePasswordModal';
import ChangePrefNameModal from '../components/ChangePrefNameModal';

export default function ProfilePage() {

    const [role, setRole] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [showCNModal, setShowCNModal] = useState(false);
    const [showCPModal, setShowCPModal] = useState(false);

    useEffect(() => {
        document.title = "Profile - AccommoDate"
    });

    useEffect(() => {
        const userRole = getUserRole();
        setRole(userRole)
    }, []);

    useEffect(() => {
        loadUser()
    }, []);

    const [dragging, setDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            alert('Please select a PDF file!');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            alert('Please select a PDF file!');
        }
    };

    const loadUser = () => {
        const token = getToken();
        const userId = getID();

        if (!token || !userId) {
            setError('Missing auth credentials');
            return;
        }

        setLoading(true);
        fetch(`http://localhost:8080/api/user/get/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch courses');
                return res.json();
            })
            .then((data: User) => {
                setUser(data);
            })
            .catch((err) => {
                setError(err.message);
            }).finally(() => {
                setLoading(false);
            });
    }

    return (
        <div className="overflow-x-hidden">
            <div className="w-screen min-h-screen overflow-x-hidden pt-40 px-4 py-6 bg-gradient-to-br from-indigo-600 to-orange-400">
                <NavigationBar />
                <div className='min-w-1/2 max-w-5/8 bg-gray-700 rounded-4xl shadow-lg flex border-blue-400 border-10 justify-center ml-auto mr-auto'>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                        </div>
                    ) : error ? (
                        <p className="text-red-500 text-center">{error}</p>
                    ) : role === "ROLE_ADMIN" ? (
                        <div className='mt-16 mb-16'>
                            <h2 className="text-xl text-white font-semibold text-center mb-6">Profile</h2>
                            <div className='flex justify-center'>
                                <h1 className="text-4xl text-white font-bold text-center mb-2">{user?.fullname}</h1>
                            </div>
                            <h2 className="text-2xl text-white font-bold text-center mb-6">{user?.title}</h2>
                            <h2 className="text-xl text-white font-semibold text-center mb-6">{user?.email}@oswego.edu</h2>
                            <div>
                                <h2 className="text-2xl text-white font-semibold text-center mb-6 mt-32">Information</h2>
                                <h2 className="text-xl text-white font-normal text-center mb-6">Preferred Name: {user?.preferredname}</h2>
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => { setShowCPModal(true) }}
                                        className="w-3/8 !bg-blue-500 hover:!bg-blue-600 text-white flex items-center justify-center mx-auto text-xs font-semibold py-1 px-3 rounded-lg transition duration-200"
                                    >
                                        Change Password
                                    </button>
                                    <button
                                        onClick={() => { setShowCNModal(true) }}
                                        className="w-3/8 !bg-blue-500 hover:!bg-blue-600 text-white flex justify-center mx-auto text-xs font-semibold py-1 px-3 rounded-lg transition duration-200"
                                    >
                                        Change Preferred Name
                                    </button>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className='mt-16 mb-16'>
                            <h2 className="text-xl text-white font-semibold text-center mb-6">Profile</h2>
                            <div className='flex justify-center'>
                                <h1 className="text-4xl text-white font-bold text-center mb-2">{user?.fullname}</h1>
                            </div>
                            <h2 className="text-2xl text-white font-bold text-center mb-6">{user?.title}</h2>
                            <h2 className="text-xl text-white font-semibold text-center mb-6">{user?.email}@oswego.edu</h2>
                            <div>
                                <h2 className="text-2xl text-white font-semibold text-center mb-6 mt-20">Information</h2>
                                <h2 className="text-xl text-white font-normal text-center mb-6">Preferred Name: {user?.preferredname ? (user?.preferredname) : ("Not Set")}</h2>

                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => { setShowCPModal(true) }}
                                        className="w-3/8 !bg-blue-500 hover:!bg-blue-600 text-white flex items-center justify-center mx-auto text-xs font-semibold py-1 px-3 rounded-lg transition duration-200"
                                    >
                                        Change Password
                                    </button>
                                    <button
                                        onClick={() => { setShowCNModal(true) }}
                                        className="w-3/8 !bg-blue-500 hover:!bg-blue-600 text-white flex justify-center mx-auto text-xs font-semibold py-1 px-3 rounded-lg transition duration-200"
                                    >
                                        Change Preferred Name
                                    </button>
                                </div>

                            </div>
                            <div>
                                <h2 className="text-2xl text-white font-semibold text-center mb-6 mt-20">Accommadations</h2>
                                <h2 className="text-2xl text-white font-semibold text-center mb-6">{getAccommodationString(user)}</h2>
                                <a
                                    href="/example.pdf"
                                    download
                                    className="flex justify-center bg-blue-500 hover:bg-blue-600 !text-white font-semibold rounded mt-4 px-2 py-2"
                                >
                                    Download Accommodation Letter
                                </a>
                            </div>
                            <div className="w-full max-w-md mx-auto mt-16">
                                <h2 className="text-2xl text-white font-semibold text-center mb-6 mt-6">Submit Documentation</h2>

                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`border-2 border-dashed rounded-lg p-6 text-center ${dragging ? 'border-blue-500 bg-gray-500' : 'border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="pdf-upload"
                                    />
                                    <label htmlFor="pdf-upload" className="cursor-pointer">
                                        <div className="flex flex-col items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                                stroke="currentColor"
                                                className="w-6 h-6 text-gray-200"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                            </svg>
                                            <p className="text-gray-200">
                                                {selectedFile ? selectedFile.name : 'Drag and drop a PDF or click to upload'}
                                            </p>
                                        </div>
                                    </label>
                                </div>
                                <button
                                    onClick={() => { setSelectedFile(null);  }}
                                    disabled={selectedFile == null}
                                    className={`mt-8 w-3/8 text-white flex justify-center mx-auto text-xs font-semibold py-1 px-3 rounded-lg transition duration-200 ${selectedFile
                                        ? '!bg-blue-600 text-white hover:!bg-blue-700'
                                        : '!bg-gray-500 text-white cursor-not-allowed'}`}
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <ChangePasswordModal
                    isOpen={showCPModal}
                    onClose={() => {
                        setShowCPModal(false);
                    }}
                />
                <ChangePrefNameModal
                    isOpen={showCNModal}
                    onClose={() => {
                        setShowCNModal(false);
                        loadUser();
                    }}
                />


            </div>
        </div>

    );
}