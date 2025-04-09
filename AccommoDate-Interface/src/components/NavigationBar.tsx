import { Link } from "react-router-dom";

export default function NavigationBar() {
    return (
        <nav className="bg-gradient-to-l from-blue-500 to-indigo-700 text-white shadow-md fixed top-0 left-0 w-full z-50">
            <div className="max-w-8xl mx-auto px-4">
                <ul className="flex space-x-6 py-4">
                    <li>
                        <Link
                            to="/home"
                            className="!text-white hover:!text-gray-300 transition-colors duration-200"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/exams"
                            className="!text-white hover:!text-gray-300 transition-colors duration-200"
                        >
                            Exams
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/courses"
                            className="!text-white hover:!text-gray-300 transition-colors duration-200"
                        >
                            Courses
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/profile"
                            className="!text-white hover:!text-gray-300 transition-colors duration-200"
                        >
                            Profile
                        </Link>
                    </li>
                </ul>
            </div>

        </nav>
    )
}