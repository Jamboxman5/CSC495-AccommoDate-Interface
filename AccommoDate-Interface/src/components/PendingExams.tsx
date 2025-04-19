import { useEffect, useState } from "react";
import { getToken, logout } from "../services/auth";
import { formatPrettyDate, formatTime } from "../services/dateUtil";
import { FullExam } from "../interfaces/FullExam";
import { Exam } from "../interfaces/Exam";
import { getCourseEndTime } from "../services/dateUtil";
import EditExamModal from "./EditExamModal";
import "./tailwind.css";

export default function PendingExams() {
    const [exams, setExams] = useState<FullExam[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);


    useEffect(() => {
        loadExams();
    }, []);

    const handleConfirmedToggle = (examID: string, isConfirmed: boolean) => {
        const message = isConfirmed ?
                        "Are you sure you want to unconfirm this exam?":
    "Are you sure you want to confirm this exam?" ;

        const confirmed = window.confirm(message);
        if (!confirmed) return;

        const updatedExams = exams.map((exam) => {
            if (exam.exam.examid === examID) {
                exam.exam.examconfirmed = !exam.exam.examconfirmed;
            }
            return exam;
        });

        setExams(updatedExams);

        const updatedExam = exams.find((exam) => exam.exam.examid === examID);
        console.log(updatedExam?.exam.examconfirmed)

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

    const handlePendingToggle = (examID: string, isRequested: boolean) => {
        const message = isRequested ?
        "Are you sure you want to unmark this exam as requested?":
        "Are you sure you want to mark this exam as requested?";

        const confirmed = window.confirm(message);
        if (!confirmed) return;

        const updatedExams = exams.map((exam) => {
            if (exam.exam.examid === examID) {
                exam.exam.examrequested = !exam.exam.examrequested;
            }
            return exam;
        });

        setExams(updatedExams);

        const updatedExam = exams.find((exam) => exam.exam.examid === examID);
        console.log(updatedExam?.exam.examrequested)

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

    const loadExams = () => {
        const token = getToken();
        setLoading(true);

        if (!token) {
            setError('Missing auth credentials');
            return;
        }
        fetch(`http://localhost:8080/api/exam/getpending`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((res) => {
                                                if (res.status == 403) logout();
                
                if (!res.ok) throw new Error('Failed to fetch exams');
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

                <p className="text-l pt-5 pb-5 text-center mb-5 font-semibold text-gray-200">No More Pending Exams.</p>
            ) : (
                <div className="max-w-10/12 ml-auto mr-auto relative overflow-x-auto rounded-lg shadow-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="bg-gradient-to-l from-blue-400 to-indigo-500 text-xs text-gray-100 uppercase dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                            <th scope="col" className="px-6 py-3 text-center">Confirm<br/>Exam</th>
                            <th scope="col" className="px-6 py-3 text-center">Student</th>
                            <th scope="col" className="px-6 py-3 text-center">Course</th>
                            <th scope="col" className="px-6 py-3 text-center">Section</th>
                            <th scope="col" className="px-6 py-3 text-center">CRN</th>
                                <th scope="col" className="px-6 py-3 text-center">Date</th>
                                <th scope="col" className="px-6 py-3 text-center">Time</th>
                                <th scope="col" className="px-6 py-3 text-center"></th>
                                <th scope="col" className="px-6 py-3 text-center">Exam<br/>Requested</th>
                                <th scope="col" className="px-6 py-3 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {exams.map((fullExam) => (
                                <tr key={fullExam.exam.examid} className=" even:bg-gray-700 odd:bg-gray-800 border-b border-gray-700">
                                    <td className="text-center text-white px-6 py-4">
                                    <input
                                                    type="checkbox"
                                                    checked={fullExam.exam.examconfirmed}
                                                    onChange={() => handleConfirmedToggle(fullExam.exam.examid, fullExam.exam.examconfirmed)}
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
                                    <td className="text-center text-white px-6 py-4">{formatTime(fullExam.exam.examtime)} - {getCourseEndTime(fullExam.exam.examtime, fullExam.exam.examduration * fullExam.user.timeextension)}</td>
                                    <td className="text-center text-white px-6 py-4">{fullExam.exam.examonline ? ("Online") : ("")}</td>
                                    <td className="text-center text-white px-6 py-4">
                                    <input
                                                    type="checkbox"
                                                    checked={fullExam.exam.examrequested}
                                                    onChange={() => handlePendingToggle(fullExam.exam.examid, fullExam.exam.examrequested)}
                                                /> 
                                    </td>
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
