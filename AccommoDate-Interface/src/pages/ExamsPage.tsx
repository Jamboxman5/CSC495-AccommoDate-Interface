import NavigationBar from "../components/NavigationBar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserRole } from "../services/auth";
import { formatDate } from "../services/dateUtil";
import StudentExamList from "../components/StudentExamList";
import DatedExamList from "../components/DatedExamList";
import "./tailwind.css"
import NewExams from "../components/NewExams";
import PendingExams from "../components/PendingExams";

export default function ExamsPage() {
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
        <div className="min-w-screen min-h-screen pt-40 px-4 py-6 bg-gradient-to-br from-indigo-600 to-orange-400">
            <NavigationBar />
            {role === "ROLE_ADMIN" ? (
                <div>
                     <p className="text-white text-center font-bold w-full text-5xl max-w-7/8 mr-auto ml-auto mb-10">Manage Exams: </p>

                    <div className="w-full text-center mb-5 mt-5">
                        <p className="text-white text-center font-semibold w-full max-w-7/8 mr-auto ml-auto mb-4">New Exams: </p>

                        <NewExams />
                    </div>
                    <div className="w-full text-center mb-5 mt-5">
                        <p className="text-white text-center font-semibold w-full max-w-7/8 mr-auto ml-auto mb-4">Pending Exams: </p>
                        <PendingExams />
                    </div>

                    <div className="w-full text-center mb-5 mt-20">

                        <div className="ml-auto mr-auto w-[350px] mb-5 pb-1 pt-1">
                            <label className="text-white font-semibold w-full max-w-7/8 pr-2" htmlFor="exam-date">Choose a date: </label>
                            <input
                                className="text-white bg-gray-700 rounded-lg shadow-lg pl-2 pr-2 pt-1 pb-1"
                                type="date"
                                id="exam-date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>

                        <DatedExamList date={selectedDate} />
                    </div>
                </div>

            ) : (
                <div>
                    <h1 className="text-3xl text-white font-bold text-center mb-6">Your Exams</h1>


                    <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-8">
                        {/* Upcoming Meetings */}
                        <div className="flex-1">
                            <h2 className="text-xl text-gray-100 font-semibold mb-2 pb-4 pt-4 text-center md:text-left">Upcoming Exams:</h2>
                            <StudentExamList pastUpcoming="upcoming" />
                        </div>

                        {/* Past Meetings */}
                        <div className="flex-1">
                            <h2 className="text-xl text-gray-100 font-semibold mb-2 pb-4 pt-4 text-center md:text-left">Past Exams:</h2>
                            <StudentExamList pastUpcoming="past" />
                        </div>
                    </div>
                </div>
            )}

        </div>
        // <div className="w-screen">
        //     <NavigationBar />
        //     <h1 className="w-full max-w-7/8">Browse Exams</h1>

        //     {role === "ROLE_ADMIN" ? (
        //         
        //     ) : (
        //         <div>
        //             <StudentExamList pastUpcoming={"upcoming"} />
        //             <StudentExamList pastUpcoming={"past"} />
        //         </div>

        //     )}
        // </div>
    )
}