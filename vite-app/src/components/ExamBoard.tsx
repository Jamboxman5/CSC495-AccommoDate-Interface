import { useEffect, useState } from "react";
import { getToken, logout } from "../services/auth";
import { formatTime, getCourseEndTime } from "../services/dateUtil";
import { FullExam } from "../interfaces/FullExam";
import { getAccommodationString } from "../services/textUtil";
type Props = {
    date: string;
}

export default function ExamBoard({ date }: Props) {
    const [exams, setExams] = useState<FullExam[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);



    useEffect(() => {
        const token = getToken();
        setLoading(true);

        if (!token) {
            setError('Missing auth credentials');
            return;
        }
        fetch(`http://localhost:8080/api/exam/getforboard/${date}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch exams');
                if (res.status == 403) logout();

                return res.json();
            })
            .then((data: FullExam[]) => {
                setExams(data);
            })
            .catch((err) => {
                setError(err.message);
            }).finally(() => {
                setLoading(false)
            });
    }, [date]);

    const handleCompleteToggle = (examID: string, isComplete: boolean) => {
        const message = isComplete ?
            "Are you sure you want to mark this exam as incomplete?" :
            "Are you sure you want to mark this exam as complete?";

        const confirmed = window.confirm(message);
        if (!confirmed) return;

        const updatedExams = exams.map((exam) => {
            if (exam.exam.examid === examID) {
                exam.exam.examcomplete = !exam.exam.examcomplete;
            }
            return exam;
        });

        setExams(updatedExams);

        const updatedExam = exams.find((exam) => exam.exam.examid === examID);
        console.log(updatedExam?.exam.examcomplete)

        fetch(`http://localhost:8080/api/exam/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
            body: JSON.stringify(updatedExam?.exam), 
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to update exam");
                }
            })
            .then((data) => {
                console.log("Exam updated:", data);
            })
            .catch((err) => {
                console.error("Error updating exam:", err);
                setError("Failed to update exam on the server.");
            });

    }

    return (
        <div className="max-w-6/8 ml-auto mr-auto flex justify-center">
            <div className="w-full max-w-8xl ">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : exams.length === 0 ? (
                    <p className="text-xl text-center mb-5 font-semibold text-gray-100">No More Exams Today!</p>
                ) : (
                    <div>
                        <p className="text-xl text-center mb-5 font-semibold text-gray-100">Today's Exams:</p>
                        <div className="relative overflow-x-auto relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-100 uppercase bg-gradient-to-l from-blue-400 to-indigo-500">
                                    <tr>
                                        <th scope="col" className="px-6 py-3"></th>
                                        <th scope="col" className="px-6 py-3">Student</th>
                                        <th scope="col" className="px-6 py-3">Course</th>
                                        <th scope="col" className="px-6 py-3">Start Time</th>
                                        <th scope="col" className="px-6 py-3">Location</th>
                                        <th scope="col" className="px-6 py-3">Class Days</th>
                                        <th scope="col" className="px-6 py-3">End Time</th>
                                        <th scope="col" className="px-6 py-3"></th>
                                        <th scope="col" className="px-6 py-3">Accommodations</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exams.map((fullExam) => (
                                        <tr key={fullExam.exam.examid} className="even:bg-gray-700 odd:bg-gray-800 dark:border-gray-600 border-b dark:bg-gray-800 border-gray-700">
                                            <th scope="row" className="px-6 py-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={fullExam.exam.examcomplete}
                                                    onChange={() => handleCompleteToggle(fullExam.exam.examid, fullExam.exam.examcomplete)}
                                                />                                        </th>
                                            <th scope="row" className="text-white px-6 py-4 font-medium whitespace-nowrap dark:text-white">
                                                {fullExam.user.fullname}
                                            </th>

                                            <td className="text-white px-6 py-4">{fullExam.course.courseid}</td>
                                            <td className="text-white px-6 py-4">{formatTime(fullExam.exam.examtime)}</td>
                                            <td className="text-white px-6 py-4">{fullExam.exam.examlocation}</td>
                                            <td className="text-white px-6 py-4">{fullExam.course.meetdays}</td>
                                            <td className="text-white px-6 py-4">{getCourseEndTime(fullExam.exam.examtime, fullExam.exam.examduration * fullExam.user.timeextension)}</td>
                                            <td className="text-white px-6 py-4 text-center">{fullExam.exam.examonline ? ("Online") : ("")}</td>
                                            <td className="text-white px-6 py-4">{getAccommodationString(fullExam.user)}</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>


                )}

            </div>
        </div>

    );
}
