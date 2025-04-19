import { getUserRole } from '../services/auth';
import { formatDate } from '../services/dateUtil';
import { useEffect, useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import ExamBoard from '../components/ExamBoard';
import "./tailwind.css"
import WeeklySchedule from '../components/WeeklyExams';

export default function HomePage() {

    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const userRole = getUserRole();
        setRole(userRole)
    }, []);

    useEffect(() => {
        document.title = "Home - AccommoDate"
      });
    return (
        <div className="">
            <div className='w-screen bg-gradient-to-br from-indigo-600 to-orange-400 pt-40 min-h-screen'>
                <NavigationBar />
                <h1 className="text-center font-bold text-white">Welcome to AccommoDate!</h1>
                <p className="text-center mt-10 mb-10">You are logged in as <strong>{role}</strong>.</p>

                {role === "ROLE_ADMIN" ? (
                    <ExamBoard date={formatDate(new Date())} />
                ) : (
                    <div>
                        <h2 className="text-2xl text-center my-4 pb-5 font-semibold text-gray-200">Your Exams This Week:</h2>

                        <WeeklySchedule date={formatDate(new Date())} />
                        <br />
                    </div>

                )}
            </div>
        </div>

    )
}