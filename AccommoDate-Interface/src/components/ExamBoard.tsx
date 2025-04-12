import { useEffect, useState } from "react";
import { getToken } from "../services/auth";
import { formatWeekDate, formatTime, getCourseEndTime } from "../services/dateUtil";
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
        fetch(`http://localhost:8080/api/exam/getbydate/${date}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch exams');
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





    const toggleOnline = (examID: string) => {
        const updatedExams = exams.map((exam) => {
            if (exam.exam.examid === examID) {
                return {
                    ...exam,
                    exam: {
                        ...exam.exam,
                        examonline: !exam.exam.examonline,
                    },
                };
            }
            return exam;
        });

        setExams(updatedExams);
    };

    const toggleComplete = (examID: string) => {
        const updatedExams = exams.map((exam) => {
            if (exam.exam.examid === examID) {
                return {
                    ...exam,
                    exam: {
                        ...exam.exam,
                        examcomplete: !exam.exam.examcomplete,
                    },
                };
            }
            return exam;
        });

        setExams(updatedExams);
    };

    const handleCompleteToggle = (examID: string, isComplete: boolean) => {
        const message = isComplete ? 
        "Are you sure you want to mark this exam as incomplete?" : 
        "Are you sure you want to mark this exam as complete?";

        const confirmed = window.confirm(message);
        if (!confirmed) return;

        const updatedExams = exams.map((exam) => {
            if (exam.exam.examid === examID) {
                return {
                    ...exam,
                    exam: {
                        ...exam.exam,
                        examcomplete: !exam.exam.examcomplete,
                    },
                };
            }
            return exam;
        });

        setExams(updatedExams);

        const updatedExam = exams.find((exam) => exam.exam.examid === examID );
        console.log(updatedExam?.exam.examcomplete)

        fetch(`http://localhost:8080/api/exam/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
            body: JSON.stringify(updatedExam?.exam), // send only the exam portion
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to update exam");
                }
                return res.json();
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
                <p className="text-xl font-medium text-gray-700 text-center mb-5">Today's Exams:</p>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : exams.length === 0 ? (
                    <p></p>
                ) : (
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
                                    <th scope="col" className="px-6 py-3">Accommodations</th>
                                    <th scope="col" className="px-6 py-3">Online?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.map((fullExam) => (
                                    <tr key={fullExam.exam.examid} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                        <th scope="row" className="px-6 py-4 text-center">
                                        <input
                                                type="checkbox"
                                                checked={fullExam.exam.examcomplete}
                                                onChange={() => handleCompleteToggle(fullExam.exam.examid, fullExam.exam.examcomplete)}
                                            />                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {fullExam.user.fullname}
                                        </th>

                                        <td className="px-6 py-4">{fullExam.course.courseid}</td>
                                        <td className="px-6 py-4">{formatTime(fullExam.exam.examtime)}</td>
                                        <td className="px-6 py-4">{fullExam.exam.examdate}</td>
                                        <td className="px-6 py-4">{fullExam.course.meetdays}</td>
                                        <td className="px-6 py-4">{getCourseEndTime(fullExam.exam.examtime, fullExam.exam.examduration * fullExam.user.timeextension)}</td>
                                        <td className="px-6 py-4">{getAccommodationString(fullExam.user)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={fullExam.exam.examonline}
                                                onChange={() => toggleOnline(fullExam.exam.examid)}
                                            />
                                        </td>
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                )}

            </div>
        </div>

    );
}
