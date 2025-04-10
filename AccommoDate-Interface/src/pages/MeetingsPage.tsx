import NavigationBar from "../components/NavigationBar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserRole } from "../services/auth";
import { formatDate } from "../services/dateUtil";
import StudentExamList from "../components/StudentExamList";
import DatedExamList from "../components/DatedExamList";
import UpcomingMeetingList from "../components/UpcomingMeetingList";
import "./tailwind.css"

export default function MeetingsPage() {
    const navigate = useNavigate();


    const [role, setRole] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(() => {
        return formatDate(new Date());
    });

    useEffect(() => {
        const userRole = getUserRole();
        setRole(userRole)
    }, []);

    return (
        <div>
            <NavigationBar/>
            <h1>Meetings</h1>
            
            <UpcomingMeetingList/>
        </div>
    )
}