import { Link } from "react-router-dom";
import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function NavigationBar() {

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleProfile = () => {
        navigate('/profile')
    }

    const handleHome = () => {
        navigate('/home')
    }
    const handleExams = () => {
        navigate('/exams')
    }
    const handleMeetings = () => {
        navigate('/meetings')
    }
    const handleCourses = () => {
        navigate('/courses')
    }
    return (
        <nav className="bg-gradient-to-l from-blue-500 to-indigo-700 text-white shadow-md fixed top-0 left-0 w-full z-50">
            <div className="max-w-8xl mx-auto px-4">
                <ul className="flex space-x-7 py-5">
                <button
                        onClick={handleHome}
                        className="!bg-transparent hover:!bg-indigo-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
                    >
                        Home
                    </button>
                    <button
                        onClick={handleExams}
                        className="!bg-transparent hover:!bg-indigo-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
                    >
                        Exams
                    </button>
                    <button
                        onClick={handleMeetings}
                        className="!bg-transparent hover:!bg-indigo-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
                    >
                        Meetings
                    </button>
                    <button
                        onClick={handleCourses}
                        className="!bg-transparent hover:!bg-indigo-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
                    >
                        Courses
                    </button>
                    <button
                        onClick={handleProfile}
                        className="ml-auto !bg-transparent hover:!bg-blue-400 text-white font-semibold py-2 px-4 rounded transition duration-200"
                    >
                        Profile
                    </button>
                    <button
                        onClick={handleLogout}
                        className="!bg-transparent hover:!bg-blue-400 text-white font-semibold py-2 px-4 rounded transition duration-200"
                    >
                        Logout
                    </button>
                </ul>
            </div>

        </nav>
    )
}