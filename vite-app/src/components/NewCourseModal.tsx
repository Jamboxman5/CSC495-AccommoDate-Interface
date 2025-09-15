import { useState } from "react";
import { getToken } from "../services/auth";
import { Course } from "../interfaces/Course";
type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export default function NewCourseModal({ isOpen, onClose }: Props) {
    const [courseData, setCourseData] = useState<Course>({
        crn: 0,
    courseid: "",
    sectionnum: "",
    meetdays: "",
    meettime: "",
    instructor: "",
    instructoremail: "",
    coursename: "",
    meetduration: 0,
    });

    if (!isOpen) return null;

    const handleSaveStudent = () => {
        const message = "Are you sure you want save this course?";

        const confirmed = window.confirm(message);

        if (!confirmed) return;
        onClose();

        fetch(`http://localhost:8080/api/course/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
            body: JSON.stringify(courseData),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to save course");
                }
            })
            .then((data) => {
                console.log("Course saved:", data);
            })
            .catch((err) => {
                console.error("Error saving course: ", err);
            });

    }

    const canSave = courseData.crn > 1 && courseData.courseid.length == 6;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-gradient-to-b from-gray-700 text-center to-gray-800 rounded-lg shadow-lg p-6 min-w-3/8 min-h-1/2 max-w-md">
                <h2 className="text-3xl text-white font-semibold mb-4">Edit Student</h2>
                {/* <select
                    value={editing.crn}
                    onChange={(e) => setExamData({ ...examData, crn: parseInt(e.target.value), examtime: getDefaultStartTime(getByCRN(parseInt(e.target.value))), examduration: getExamDuration(getByCRN(parseInt(e.target.value))) })}
                    className="text-white bg-gray-700 w-3/4 mb-2 mt-6 px-3 py-2 border rounded"
                >
                    <option value={0}>Select Course</option>
                    {courseList.map((studentCourse) => (
                        <option key={studentCourse.course.crn} value={studentCourse.course.crn}>
                            {studentCourse.course.courseid} - {studentCourse.course.coursename}
                        </option>
                    ))}
                </select> */}
                <input
                    type="number"
                    value={courseData.crn}
                    placeholder="CRN: "
                    onChange={(e) => setCourseData({ ...courseData, crn: parseInt(e.target.value) })}
                    className="text-white bg-gray-700 placeholder-gray-300 w-3/4 mb-2 px-3 py-2 border rounded"
                />
                <input
                    type="text"
                    value={courseData.courseid}
                    placeholder="Course ID (e.g. 'CSC495'):"
                    onChange={(e) => setCourseData({ ...courseData, courseid: e.target.value })}
                    className="text-white bg-gray-700 placeholder-gray-300 w-3/4 mb-2 px-3 py-2 border rounded"
                />
                <input
                    type="text"
                    value={courseData.coursename}
                    placeholder="Course Name:"
                    onChange={(e) => setCourseData({ ...courseData, coursename: e.target.value })}
                    className="text-white bg-gray-700 placeholder-gray-300 w-3/4 mb-2 px-3 py-2 border rounded"
                />
                <input
                    type="text"
                    value={courseData.sectionnum}
                    placeholder="Section:"
                    onChange={(e) => setCourseData({ ...courseData, sectionnum: e.target.value })}
                    className="text-white bg-gray-700 placeholder-gray-300 w-3/4 mb-2 px-3 py-2 border rounded"
                />
                <input
                    type="text"
                    value={courseData.meetdays}
                    placeholder="Meet Days (e.g. 'MWF'): "
                    onChange={(e) => setCourseData({ ...courseData, meetdays: e.target.value })}
                    className="text-white bg-gray-700 placeholder-gray-300 w-3/4 mb-2 px-3 py-2 border rounded"
                />
                <input
                    type="text"
                    value={courseData.meetdays}
                    placeholder="Meet Time (e.g. '14:20:00'):"
                    onChange={(e) => setCourseData({ ...courseData, meettime: e.target.value })}
                    className="text-white bg-gray-700 placeholder-gray-300 w-3/4 mb-2 px-3 py-2 border rounded"
                />
                <input
                    type="number"
                    value={courseData.meetduration}
                    placeholder="Meet Duration (minutes):"
                    onChange={(e) => setCourseData({ ...courseData, meetduration: parseInt(e.target.value) })}
                    className="text-white bg-gray-700 placeholder-gray-300 w-3/4 mb-2 px-3 py-2 border rounded"
                />
                <input
                    type="text"
                    value={courseData.instructor}
                    placeholder="Instructor Name:"
                    onChange={(e) => setCourseData({ ...courseData, instructor: e.target.value })}
                    className="text-white bg-gray-700 placeholder-gray-300 w-3/4 mb-2 px-3 py-2 border rounded"
                />
                <input
                    type="text"
                    value={courseData.instructoremail}
                    placeholder="Instructor Email (Before @):"
                    onChange={(e) => setCourseData({ ...courseData, instructoremail: e.target.value })}
                    className="text-white bg-gray-700 placeholder-gray-300 w-3/4 mb-2 px-3 py-2 border rounded"
                />


                <div className="flex justify-center gap-2 mt-[40px]">
                    <button
                        onClick={() => onClose()}
                        className="px-4 py-2 text-sm !bg-gray-200 rounded hover:!bg-gray-300"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                            handleSaveStudent();
                        }}
                        disabled={!canSave}

                        className={`px-4 py-2 text-sm rounded transition ${canSave
                            ? '!bg-blue-600 text-white hover:!bg-blue-700'
                            : '!bg-gray-500 text-white cursor-not-allowed'
                            }`}
                    >
                        Save
                    </button>

                </div>
            </div>
        </div>
    )
}