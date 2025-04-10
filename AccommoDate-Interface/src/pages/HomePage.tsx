import {useNavigate} from 'react-router-dom';
import { getUserRole, logout } from '../services/auth';
import { formatDate } from '../services/dateUtil';
import { useEffect, useState } from 'react';
import StudentExamList from '../components/StudentExamList';
import DatedExamList from '../components/DatedExamList';
import NavigationBar from '../components/NavigationBar';
import ExamBoard from '../components/ExamBoard';
import "./tailwind.css"

export default function HomePage() {
    
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    

    const [role, setRole] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(() => {
        return formatDate(new Date());
    });

    useEffect(() => {
        const userRole = getUserRole();
        setRole(userRole)
    }, []);

    return (
        <div className='w-screen'>
            <NavigationBar/>
            <h1 className="text-center">Welcome to AccommoDate!</h1>
            <p className="text-center mt-10 mb-10">You are logged in as <strong>{role}</strong>.</p>
            
            {role === "ROLE_ADMIN" ? (
                // <>
                //     <label htmlFor="exam-date">Choose a date: </label>
                //     <input
                //         type = "date"
                //         id = "exam-date"
                //         value = {selectedDate}
                //         onChange={(e) => setSelectedDate(e.target.value)}
                //     />
                //     <DatedExamList date = {selectedDate} />
                // </>
                <ExamBoard date = {formatDate(new Date())}/>
            ) : (
                <StudentExamList/>
            )}
        </div>
    )
}