import { useEffect, useState } from "react";
import { getToken, getID } from "../services/auth";
import { getFormattedTime, getCourseEndTime } from "../services/dateUtil";
import { Course } from "../interfaces/Course";
// import "./CourseDirectory.css";

export default function CourseDirectory() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const token = getToken();
        const userId = getID(); // stored at login

        if (!token || !userId) {
            setError('Missing auth credentials');
            return;
        }

        setLoading(true);

        fetch(`http://localhost:8080/api/course/get`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch courses');
                return res.json();
            })
            .then((data: Course[]) => {
                setCourses(data);
            })
            .catch((err) => {
                setError(err.message);
            }).finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-4">
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <table className="table-auto border border-collapse w-full">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Course</th>
                            <th className="border p-2">Section</th>
                            <th className="border p-2">CRN</th>
                            <th className="border p-2">Days</th>
                            <th className="border p-2">Time</th>
                            <th className="border p-2">Instructor</th>
                            <th className="border p-2">Instructor Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (

                            <tr key={course.crn}>
                                <td className="border p-2">{course.courseid}</td>
                                <td className="border p-2">{course.sectionnum}</td>
                                <td className="border p-2">{course.crn}</td>
                                <td className="border p-2">{course.meetdays}</td>
                                <td className="border p-2">{getFormattedTime(course.meettime)} - {getCourseEndTime(course.meettime, course.meetduration)}</td>
                                <td className="border p-2">{course.instructor}</td>
                                <td className="text-right border p-4">{course.instructoremail}@oswego.edu</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

    );



}
