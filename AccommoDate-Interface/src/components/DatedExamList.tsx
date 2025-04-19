import { useEffect, useState } from "react";
import { getToken, logout } from "../services/auth";
import { formatPrettyDate, formatTime } from "../services/dateUtil";
import { FullExam } from "../interfaces/FullExam";
import { getCourseEndTime } from "../services/dateUtil";
import EditExamModal from "./EditExamModal";
import "./tailwind.css";
import { Exam } from "../interfaces/Exam";
type Props = {
    date: string;
}

export default function DatedExamList({ date }: Props) {
    const [exams, setExams] = useState<FullExam[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);


    useEffect(() => {
        loadExams();
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

    const getStatus = (exam: Exam): string => {
        if (exam.examcomplete) return "Complete";
        else if (exam.examconfirmed) return "Confirmed";
        else if (exam.examrequested) return "Pending";
        else return "New";
    }

    const loadExams = () => {
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
                                                                if (res.status == 403) logout();
                
                return res.json();
            })
            .then((data: FullExam[]) => {
                setExams(data);
            })
            .catch((err) => {
                setError(err.message);
            }).finally(() => {
                setLoading(false);
            });
    }


    return (
        <div>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : exams.length === 0 ? (

                <p className="text-l pt-5 pb-5 text-center mb-5 font-semibold text-gray-200">No exams on {formatPrettyDate(date)}.</p>
            ) : (
                <div className="max-w-10/12 ml-auto mr-auto relative overflow-x-auto rounded-lg shadow-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="bg-gradient-to-l from-blue-400 to-indigo-500 text-xs text-gray-100 uppercase dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center">Mark As<br />Complete</th>
                                <th scope="col" className="px-6 py-3 text-center">Student</th>
                                <th scope="col" className="px-6 py-3 text-center">Course</th>
                                <th scope="col" className="px-6 py-3 text-center">Section</th>
                                <th scope="col" className="px-6 py-3 text-center">CRN</th>
                                <th scope="col" className="px-6 py-3 text-center">Date</th>
                                <th scope="col" className="px-6 py-3 text-center">Time</th>
                                <th scope="col" className="px-6 py-3 text-center"></th>
                                <th scope="col" className="px-6 py-3 text-center">Status</th>
                                <th scope="col" className="px-6 py-3 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="className=divide-y">
                            {exams.map((fullExam) => (
                                <tr key={fullExam.exam.examid} className=" even:bg-gray-700 odd:bg-gray-800 border-b border-gray-700">
                                    <td className="text-center text-white px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={fullExam.exam.examcomplete}
                                            onChange={() => handleCompleteToggle(fullExam.exam.examid, fullExam.exam.examcomplete)}
                                        />
                                    </td>
                                    <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white text-center">
                                        {fullExam.user.fullname}
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white text-center">
                                        {fullExam.course.courseid}
                                    </th>
                                    <td className="text-center text-white px-6 py-4">{fullExam.course.sectionnum}</td>
                                    <td className="text-center text-white px-6 py-4">{fullExam.course.crn}</td>
                                    <td className="text-center text-white px-6 py-4">{formatPrettyDate(fullExam.exam.examdate)}</td>
                                    <td className="text-center text-white px-6 py-4">{formatTime(fullExam.exam.examtime)} - {getCourseEndTime(fullExam.exam.examtime, fullExam.exam.examduration)}</td>
                                    <td className="text-center text-white px-6 py-4">{fullExam.exam.examonline ? ("Online") : ("")}</td>
                                    <td className="text-center text-white px-6 py-4">{getStatus(fullExam.exam)}</td>
                                    <td className="text-center text-white px-6 py-4">

                                        <button
                                            onClick={() => { setShowModal(true); setEditingExam(fullExam.exam) }}
                                            className="!bg-transparent hover:!bg-blue-600 text-white text-xs font-semibold py-1 px-3 rounded-lg transition duration-200"
                                        >
                                            Edit
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {editingExam && (
                        <EditExamModal
                            isOpen={showModal}
                            editing={editingExam}
                            onClose={() => {
                                setShowModal(false);
                                setEditingExam(null);
                                loadExams();
                            }}
                        />
                    )}
                </div>

            )}

        </div>

    );
}
