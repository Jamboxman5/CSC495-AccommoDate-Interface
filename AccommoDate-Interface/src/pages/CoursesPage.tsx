import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { getUserRole } from '../services/auth';
import NavigationBar from "../components/NavigationBar";
import CourseDirectory from "../components/CourseDirectory";
import MyCourses from "../components/MyCourses";
import "./tailwind.css"

export default function CoursesPage() {

    const navigate = useNavigate();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const userRole = getUserRole();
        setRole(userRole)
    }, []);

    return (
        <div>
            <NavigationBar/>
            <h1 className="w-full max-w-7/8">Courses</h1>
            {role === "ROLE_ADMIN" ? (
                <CourseDirectory/>
            ) : (
                <MyCourses/>
            )}
        </div>
    )
}