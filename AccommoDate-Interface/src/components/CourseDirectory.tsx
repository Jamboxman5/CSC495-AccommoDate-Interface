import { useEffect, useState } from "react";
import { getToken, getID, getUserRole } from "../services/auth";
import { getFormattedTime, getCourseEndTime } from "../services/dateUtil";
import { Course } from "../interfaces/Course";

export default function CourseDirectory() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const token = getToken();
        const userId = getID();

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
        .then(res => {
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
    };

    const filteredCourses = courses.filter(course => {
        const search = searchTerm.toLowerCase();
        return (
            course.courseid.toLowerCase().includes(search) ||
            course.coursename.toLowerCase().includes(search) ||
            course.sectionnum.toString().includes(search) ||
            course.crn.toString().includes(search) ||
            course.meetdays?.toLowerCase().includes(search) ||
            getCourseTime(course.meettime, course.meetduration).toLowerCase().includes(search) ||
            course.instructor?.toLowerCase().includes(search) ||
            course.instructoremail?.toLowerCase().includes(search)
        );
    });

    const renderSearchBar = () => (
        <div className="mb-4 flex  justify-center ml-1 ">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses..."
                className="px-4 py-2 w-full bg-gray-700 max-w-md text-white placeholder-gray-300 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );

    if (getUserRole() == "ROLE_ADMIN") {
        return (
            <div>
                {renderSearchBar()}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : filteredCourses.length === 0 ? (
                    <p className="text-l pt-5 pb-5 text-center mb-5 font-semibold text-gray-200">No courses match your search.</p>
                ) : (
                    <div className="relative overflow-x-auto rounded-lg shadow-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-100 uppercase bg-gradient-to-l from-blue-400 to-indigo-500 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="text-center px-6 py-3">Course</th>
                                    <th className="text-center px-6 py-3">Section</th>
                                    <th className="text-center px-6 py-3">CRN</th>
                                    <th className="text-center px-6 py-3">Days</th>
                                    <th className="text-center px-6 py-3">Time</th>
                                    <th className="text-center px-6 py-3">Instructor</th>
                                    <th className="text-center px-6 py-3">Instructor Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.map((course) => (
                                    <tr key={course.crn} className="even:bg-gray-700 odd:bg-gray-800 border-b border-gray-700">
                                        <th className="px-6 py-4 text-center font-medium text-gray-100 whitespace-nowrap">
                                            {course.courseid}<br />{course.coursename}
                                        </th>
                                        <td className="text-center text-white px-6 py-4">{course.sectionnum}</td>
                                        <td className="text-center text-white px-6 py-4">{course.crn}</td>
                                        <td className="text-center text-white px-6 py-4">{course.meetdays}</td>
                                        <td className="text-center text-white px-6 py-4">{getCourseTime(course.meettime, course.meetduration)}</td>
                                        <td className="text-center text-white px-6 py-4">{course.instructor}</td>
                                        <td className="text-center text-white px-6 py-4">{course.instructoremail}@oswego.edu</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="p-4">
            {renderSearchBar()}
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
                        {filteredCourses.map((course) => (
                            <tr key={course.crn}>
                                <td className="border p-2">{course.courseid}</td>
                                <td className="border p-2">{course.sectionnum}</td>
                                <td className="border p-2">{course.crn}</td>
                                <td className="border p-2">{course.meetdays}</td>
                                <td className="border p-2">{getCourseTime(course.meettime, course.meetduration)}</td>
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
