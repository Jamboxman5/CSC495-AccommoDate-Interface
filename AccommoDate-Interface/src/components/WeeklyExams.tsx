import React from "react";
import { FullExam } from "../interfaces/FullExam";
import { formatTime, getCourseEndTime, formatMinutes } from "../services/dateUtil";
import { getDay, startOfWeek, endOfWeek, format, parseISO } from "date-fns";
import { useState, useEffect } from "react";
import { getID, getToken } from "../services/auth";
import './tailwind.css'
type Props = {
    date: string;
}

const verticalScale = 90;

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hours = Array.from({ length: 11 }, (_, i) => 7 + i); // 7 AM to 5 PM

const timeToPixels = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    const minutesSinceStart = (hour * 60 + minute) - (7 * 60);
    return (minutesSinceStart / 60) * verticalScale; // 1 hour = 60px
};

const timeToYPosition = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    return ((hour + minute / 60) - 7) * verticalScale; // pixels from top (1hr = 60px)
};

export default function WeeklySchedule({ date }: Props) {
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
                const start = format(startOfWeek(inputDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
                const end = format(endOfWeek(inputDate, { weekStartsOn: 1 }), "yyyy-MM-dd");

                const response = await fetch(`http://localhost:8080/api/exam/getbetween/${getID()}?start=${start}&end=${end}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch exams.");

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
        const dayIndex = getDay(examDate); // Sunday = 0
        const day = weekdays[dayIndex - 1]; // Adjust to Monday = 0

        if (groupedByDay[day]) {
            groupedByDay[day].push(exam);
        }
    });


    return (
        <div className="max-w-7xl mx-auto rounded-xl shadow-lg border border-gray-200 bg-white overflow-hidden">
      
          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <>
              {/* Sticky weekday header */}
              <div className="flex h-[40px] sticky top-0 z-10 bg-gradient-to-l from-blue-400 to-indigo-500 text-white font-semibold text-sm">
                <div className="w-16" />
                {weekdays.map((day) => (
                  <div key={day} className="flex-1 text-center flex items-center justify-center">
                    {day}
                  </div>
                ))}
              </div>
      
              {/* Scrollable calendar body */}
              <div className="overflow-y-auto" style={{ maxHeight: "600px" }}>
                <div className="flex">
                  {/* Time column */}
                  <div className="w-16 flex flex-col border-r">
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className="text-right pr-2 text-xs text-gray-700 border-b"
                        style={{ height: `${verticalScale}px`, lineHeight: `${verticalScale}px` }}
                      >
                        {format(new Date(0, 0, 0, hour), "h a")}
                      </div>
                    ))}
                  </div>
      
                  {/* Weekday columns */}
                  <div className="flex flex-1">
                    {weekdays.map((day) => (
                      <div key={day} className="flex-1 border-r relative">
                        {/* Hour lines */}
                        {hours.map((_, i) => (
                          <div
                            key={i}
                            className="border-b border-gray-200"
                            style={{ height: `${verticalScale}px` }}
                          />
                        ))}
      
                        {/* Exams */}
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