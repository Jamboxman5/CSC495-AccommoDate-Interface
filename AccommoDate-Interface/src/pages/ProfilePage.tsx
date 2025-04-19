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
                <div className='max-w-1/2 bg-gray-700 rounded-4xl shadow-lg flex border-blue-400 border-10 justify-center ml-auto mr-auto'>
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
                            <div>
                                <h2 className="text-2xl text-white font-semibold text-center mb-6 mt-32">Accommadations</h2>
                                <h2 className="text-2xl text-white font-semibold text-center mb-6">{getAccommodationString(user)}</h2>
                                <a
                                    href="/example.pdf"
                                    download
                                    className="flex justify-center bg-blue-500 hover:bg-blue-600 !text-white font-semibold rounded mt-4 px-2 py-2"
                                >
                                    Download Accommodation Letter
                                </a>
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