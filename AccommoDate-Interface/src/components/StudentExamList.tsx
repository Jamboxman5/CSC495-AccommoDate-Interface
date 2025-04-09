import { useEffect, useState } from "react";
import { getToken, getID } from "../services/auth";
import { FullExam } from "../interfaces/FullExam";
import { formatMinutes } from "../services/dateUtil";

export default function StudentExamList() {
    const [exams, setExams] = useState<FullExam[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = getToken();
        const userId = getID(); // stored at login

        if (!token || !userId) {
            setError('Missing auth credentials');
            return;
        }
        fetch(`http://localhost:8080/api/exam/getbyid/${userId}`, {
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
    }, []);





    return (
        <div>
            <h2>Your Exams: </h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {exams.map((fullExam) => {
                    const formattedDate = new Date(fullExam.exam.examdate).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    });

                    const timeSplit = fullExam.exam.examtime.split(":");
                    const timeDate = new Date();
                    timeDate.setHours(Number(timeSplit[0]), Number(timeSplit[1]))

                    const formattedTime = timeDate.toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                    });

                    return (
                        <li key={fullExam.exam.examid}>
                            <strong>{formattedDate}</strong> — {formattedTime} | {fullExam.course.courseid} | {formatMinutes(fullExam.exam.examduration * 1.5)}
                        </li>
                    );

                })}
            </ul>
        </div>
    );
}
