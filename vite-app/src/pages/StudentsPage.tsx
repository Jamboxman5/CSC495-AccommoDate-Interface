import { useEffect, useState } from 'react';
import { getUserRole } from '../services/auth';
import NavigationBar from "../components/NavigationBar";
import "./tailwind.css"
import StudentDirectory from '../components/StudentDirectory';

export default function StudentsPage() {

    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        document.title = "Manage Students - AccommoDate"
    });

    useEffect(() => {
        const userRole = getUserRole();
        setRole(userRole)
    }, []);

    return (
        <div className="overflow-x-hidden">
            <div className="w-screen min-h-screen overflow-x-hidden pt-40 px-4 py-6 bg-gradient-to-br from-indigo-600 to-orange-400">
                <NavigationBar />
                {role === "ROLE_ADMIN" ? (
                    <div>
                        <h1 className="text-3xl text-white font-bold text-center mb-6">Manage Students</h1>


                        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-8">
                            <div className="flex-1 mt-12">
                                <StudentDirectory />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>

                    </div>
                )}

            </div>
        </div>

    );
}