import { useEffect, useState } from "react";
import { getToken, getID } from "../services/auth";
import { formatWeekDate } from "../services/dateUtil";

interface Exam {
    examid: string;
    crn: number;
    examdate: string;
    examtime: string;
    studentid: string;
    examlocation: string;
    examconfirmed: boolean;
    examcomplete: boolean;
    examonline: boolean;
    examduration: number;
}

type Props = {
    date: string;
}

export default function DatedExamList({ date }: Props) {
    const [exams, setExams] = useState<Exam[]>([]);
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
            .then((data: Exam[]) => {
                setExams(data);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, [date]);


    


    return (
        <div>
            <h2>Exams on {formatWeekDate(date)}:</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {exams.map((exam) => {
                    const formattedDate = formatWeekDate(exam.examdate)

                    const timeSplit = exam.examtime.split(":");
                    const timeDate = new Date();
                    timeDate.setHours(Number(timeSplit[0]), Number(timeSplit[1]))

                    const formattedTime = timeDate.toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                    });

                    return (
                        <li key={exam.examid}>
                            <strong>{formattedDate}</strong> — {formattedTime} (CRN: {exam.crn})
                        </li>
                    );

                })}
            </ul>
        </div>
    );
}
