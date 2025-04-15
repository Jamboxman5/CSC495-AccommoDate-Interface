import { useEffect, useState } from "react";
import { getToken, getID } from "../services/auth";
import { getFormattedTime, getCourseEndTime } from "../services/dateUtil";
import { Course } from "../interfaces/Course";
import { getOrganizationDomain } from "../services/config";
// import "./CourseDirectory.css";

export default function MyCourses() {
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

        fetch(`http://localhost:8080/api/course/getbyid/${getID()}`, {
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

    const getCourseTime = (meettime: string, meetduration: number): string => {
        if (meettime == null || meetduration == null) return "Online";
        return getFormattedTime(meettime) + " - " + getCourseEndTime(meettime, meetduration);
    }

    return (
        <div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : courses.length === 0 ? (

                    <p className="text-l pt-5 pb-5 text-center mb-5 font-semibold text-gray-200">Empty Course Directory.</p>
                ) : (
                    <div className="relative overflow-x-auto rounded-lg shadow-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-100 uppercase bg-gradient-to-l from-blue-400 to-indigo-500 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="text-center px-6 py-3">Course</th>
                                    <th scope="col" className="text-center px-6 py-3">Section</th>
                                    <th scope="col" className="text-center px-6 py-3">CRN</th>
                                    <th scope="col" className="text-center px-6 py-3">Days</th>
                                    <th scope="col" className="text-center px-6 py-3">Time</th>
                                    <th scope="col" className="text-center px-6 py-3">Instructor</th>
                                    <th scope="col" className="text-right px-6 py-3">Instructor Email</th>
                                </tr>
                            </thead>
                            <tbody className="className=divide-y">
                                {courses.map((course) => (
                                    <tr key={course.crn} className=" even:bg-gray-700 odd:bg-gray-800 border-b dark:border-gray-600">
                                        <th scope="row" className="px-6 py-4 text-center font-medium text-gray-100 whitespace-nowrap dark:text-white text-center">
                                            {course.courseid}<br/>{course.coursename}
                                        </th>
                                        <td className="text-center text-white px-6 py-4">{course.sectionnum}</td>
                                        <td className="text-center text-white px-6 py-4">{course.crn}</td>
                                        <td className="text-center text-white px-6 py-4">{course.meetdays}</td>
                                        <td className="text-center text-white px-6 py-4">{getCourseTime(course.meettime, course.meetduration)}</td>
                                        <td className="text-center text-white px-6 py-4">{course.instructor}</td>
                                        <td className="text-right text-white px-6 py-4">{course.instructoremail}@oswego.edu</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                )}

            </div>

    );



}
