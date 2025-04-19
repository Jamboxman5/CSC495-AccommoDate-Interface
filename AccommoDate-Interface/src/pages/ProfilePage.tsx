import { useEffect, useState } from 'react';
import { getUserRole } from '../services/auth';
import NavigationBar from "../components/NavigationBar";
import CourseDirectory from "../components/CourseDirectory";
import MyCourses from "../components/MyCourses";
import "./tailwind.css"

export default function ProfilePage() {

    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        document.title = "Profile - AccommoDate"
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
                    <h1 className="text-3xl text-white font-bold text-center mb-6">Profile</h1>


                    <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                            <h2 className="text-xl text-gray-100 font-semibold mb-2 pb-4 pt-4 text-center md:text-left">Course Directory:</h2>
                            <CourseDirectory />
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <h1 className="text-3xl text-white font-bold text-center mb-6">Profile</h1>


                    <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                            <h2 className="text-xl text-gray-100 font-semibold mb-2 pb-4 pt-4 text-center md:text-left">Your Courses:</h2>
                            <MyCourses />
                        </div>
                    </div>
                </div>
            )}

        </div>
</div>
        
    );
}