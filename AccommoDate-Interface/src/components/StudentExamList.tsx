import { useEffect, useState } from "react";
import { getToken, getID, logout } from "../services/auth";
import { FullExam } from "../interfaces/FullExam";
import { Exam } from "../interfaces/Exam";
import { formatDate, formatTime, formatPrettyDate, getCourseEndTime } from "../services/dateUtil";

type Props = {
    pastUpcoming: string;
}

export default function StudentExamList({ pastUpcoming }: Props) {
    const [exams, setExams] = useState<FullExam[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);
    var date = formatDate(new Date());
    const time = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    useEffect(() => {
        setLoading(true)
        const token = getToken();
        const userId = getID(); // stored at login

        if (!token || !userId) {
            setError('Missing auth credentials');
            return;
        }
        fetch(`http://localhost:8080/api/exam/getbyid/${pastUpcoming}/${userId}/${date}/${time}`, {
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
            })
    }, []);


    const getStatus = (exam: Exam): string => {
        if (exam.examcomplete) return "Complete";
        else if (pastUpcoming == "past") return "Missed";
        else if (exam.examconfirmed) return "Confirmed";
        else if (exam.examrequested) return "Pending";
        else return "Requested";
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

                <p className="text-l pt-5 pb-5 text-center mb-5 font-semibold text-gray-200">You have no {pastUpcoming} exams.</p>
            ) : (
                <div className="relative overflow-x-auto rounded-lg shadow-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="bg-gradient-to-l from-blue-400 to-indigo-500 text-xs text-gray-100 uppercase dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                            <th scope="col" className="px-6 py-3 text-center">Course</th>
                            <th scope="col" className="px-6 py-3 text-center">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Date</th>
                                <th scope="col" className="px-6 py-3 text-center">Time</th>
                                <th scope="col" className="px-6 py-3 text-center">Online?</th>
                            </tr>
                        </thead>
                        <tbody className="className=divide-y">
                            {exams.map((fullExam) => (
                                <tr key={fullExam.exam.examid} className=" even:bg-gray-700 odd:bg-gray-800 border-b dark:border-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white text-center">
                                        {fullExam.course.courseid}<br />{fullExam.course.coursename}
                                    </th>
                                    <td className="text-center text-white px-6 py-4">{getStatus(fullExam.exam)}</td>
                                    <td className="text-center text-white px-6 py-4">{formatPrettyDate(fullExam.exam.examdate)}</td>
                                    <td className="text-center text-white px-6 py-4">{formatTime(fullExam.exam.examtime)} - {getCourseEndTime(fullExam.exam.examtime, fullExam.exam.examduration * fullExam.user.timeextension)}</td>
                                    <td className="text-center text-white px-6 py-4">{fullExam.exam.examonline ? ("Online") : ("")}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            )}

        </div>
    );
}
