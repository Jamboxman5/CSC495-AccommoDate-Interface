import { useEffect, useState } from "react";
import { getToken } from "../services/auth";
import { formatWeekDate, formatTime } from "../services/dateUtil";
import { FullExam } from "../interfaces/FullExam";
import { getCourseEndTime } from "../services/dateUtil";
import { getAccommodationString } from "../services/textUtil";
type Props = {
    date: string;
}

export default function DatedExamList({ date }: Props) {
    const [exams, setExams] = useState<FullExam[]>([]);
    const [error, setError] = useState<string | null>(null);


    
    useEffect(() => {
        const token = getToken();

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
        if (isComplete) {
            const confirm = window.confirm("Are you sure you want to mark this exam as incomplete?");
            if (!confirm) return;
        } else {
            const confirm = window.confirm("Are you sure you want to mark this exam as complete?");
            if (!confirm) return;
        }

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

        }


    return (
        <div>
            <h2>Exams on {formatWeekDate(date)}:</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
                        {exams.length === 0 ? (
                            <p>There are no exams today!</p>
                        ) : (
                            <table className="table-auto border border-collapse w-full">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2">Student</th>
                                        <th className="border p-2">Course</th>
                                        <th className="border p-2">Start Time</th>
                                        <th className="border p-2">Location</th>
                                        <th className="border p-2">Class Days</th>
                                        <th className="border p-2">End Time</th>
                                        <th className="border p-2">Accommodations</th>
                                        <th className="border p-2">Online?</th>
                                        <th className="border p-2">Complete?</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exams.map((fullExam) => (
                                        <tr key={fullExam.exam.crn}>
                                            <td className="text-center border p-2">{fullExam.user.fullname}</td>
                                            <td className="text-center border p-2">{fullExam.course.courseid}</td>
                                            <td className="text-center border p-2">{formatTime(fullExam.exam.examtime)}</td>
                                            <td className="text-center border p-2">{fullExam.exam.examlocation}</td>
                                            <td className="text-center border p-2">{fullExam.course.meetdays}</td>
                                            <td className="text-center border p-2">{getCourseEndTime(fullExam.exam.examtime, fullExam.exam.examduration * fullExam.user.timeextension)}</td>
                                            <td className="text-center border p-4">{getAccommodationString(fullExam.user)}</td>
                                            <td className="border p-2 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={fullExam.exam.examonline}
                                                    onChange={() => toggleOnline(fullExam.exam.examid)}
                                                />
                                            </td>
                                            <td className="border p-2 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={fullExam.exam.examcomplete}
                                                    onChange={() => handleCompleteToggle(fullExam.exam.examid, fullExam.exam.examcomplete)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
            
        </div>
    );
}
