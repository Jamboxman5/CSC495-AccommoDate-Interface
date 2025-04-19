import { FullExam } from "../interfaces/FullExam";
import { formatTime, getCourseEndTime, formatMinutes, getWeekDay } from "../services/dateUtil";
import { getDay, startOfWeek, endOfWeek, format, parseISO } from "date-fns";
import { useState, useEffect } from "react";
import { getID, getToken, logout } from "../services/auth";
import './tailwind.css'
type Props = {
    date: string;
}

const verticalScale = 120;

const hours = Array.from({ length: 12 }, (_, i) => 7 + i);

const timeToPixels = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    const minutesSinceStart = (hour * 60 + minute) - (7 * 60);
    return (minutesSinceStart / 60) * verticalScale; 
};

export default function WeeklySchedule({ date }: Props) {
    const weekdays = [getWeekDay(new Date(), 1), 
        getWeekDay(new Date(), 2), 
        getWeekDay(new Date(), 3), 
        getWeekDay(new Date(), 4), 
        getWeekDay(new Date(), 5)
    ];

    const [exams, setExams] = useState<FullExam[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const fetchWeekExams = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = getToken();
                if (!token) {
                    setError("Missing authentication token.");
                    return;
                }

                const inputDate = parseISO(date);
                const start = format(startOfWeek(inputDate, { weekStartsOn: 0 }), "yyyy-MM-dd");
                const end = format(endOfWeek(inputDate, { weekStartsOn: 0 }), "yyyy-MM-dd");

                const response = await fetch(`http://localhost:8080/api/exam/getbetween/${getID()}?start=${start}&end=${end}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch exams.");
                                if (response.status == 403) logout();

                const data: FullExam[] = await response.json();

                setExams(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeekExams();
    }, [date]);

    const groupedByDay = weekdays.reduce((acc, day) => {
        acc[day] = [];
        return acc;
    }, {} as Record<string, FullExam[]>);

    exams.forEach((exam) => {
        const examDate = parseISO(exam.exam.examdate);
        const dayIndex = getDay(examDate);
        const day = weekdays[dayIndex - 1]; 

        if (groupedByDay[day]) {
            groupedByDay[day].push(exam);
        }
    });


    return (
        <div className="max-w-7xl mx-auto rounded-xl shadow-lg  bg-gray-700 overflow-hidden">

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <>
                    <div className="flex h-[40px] sticky top-0 z-10 bg-gradient-to-l from-blue-400 to-indigo-500 text-white font-semibold text-sm">
                        <div className="w-16" />
                        {weekdays.map((day) => (
                            <div key={day} className="flex-1 text-center flex items-center justify-center">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="overflow-y-auto bg-gray-700" style={{ maxHeight: "600px" }}>
                        <div className="flex">
                            <div className="w-16 flex flex-col border-r border-gray-500">
                                {hours.map((hour) => (
                                    <div
                                        key={hour}
                                        className="text-right pr-2 text-xs text-gray-200 border-b border-gray-500"
                                        style={{ height: `${verticalScale}px`, lineHeight: `${verticalScale}px` }}
                                    >
                                        {format(new Date(0, 0, 0, hour), "h a")}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-1">
                                {weekdays.map((day) => (
                                    <div key={day} className="flex-1 border-r relative border-gray-500">
                                        {hours.map((_, i) => (
                                            <div
                                                key={i}
                                                className="border-b border-gray-500"
                                                style={{ height: `${verticalScale}px` }}
                                            />
                                        ))}

                                        {groupedByDay[day].map((exam) => {
                                            const top = timeToPixels(exam.exam.examtime);
                                            const durationMinutes = exam.exam.examduration * exam.user.timeextension;
                                            const height = (durationMinutes / 60) * verticalScale;

                                            return (
                                                <div
                                                    key={exam.exam.examid}
                                                    className="absolute left-1 right-1 bg-blue-500 text-white rounded p-1 text-xs shadow-md"
                                                    style={{
                                                        top: `${top}px`,
                                                        height: `${height}px`,
                                                    }}
                                                >
                                                    <div className="font-semibold text-sm">{exam.course.courseid}</div>
                                                    <div className="text-xs">
                                                        {formatTime(exam.exam.examtime)} –{" "}
                                                        {getCourseEndTime(
                                                            exam.exam.examtime,
                                                            durationMinutes
                                                        )}
                                                    </div>
                                                    <div className="text-xs">{formatMinutes(durationMinutes)}</div>
                                                    <div className="text-xs">{exam.exam.note}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );


}