import { useState } from "react";
import { getToken } from "../services/auth";
import { User } from "../interfaces/User";
type Props = {
    isOpen: boolean;
    editing: User;
    onClose: () => void;
};

export default function EditStudentModal({ isOpen, editing, onClose }: Props) {
    const [studentData, setStudentData] = useState<User>(editing);


    if (!isOpen) return null;

    const handleSaveStudent = () => {
        const message = "Are you sure you want save this student?";

        const confirmed = window.confirm(message);

        if (!confirmed) return;
        console.log(JSON.stringify(studentData))

        fetch(`http://localhost:8080/api/user/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
            body: JSON.stringify(studentData),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to save student");
                }
            })
            .then((data) => {
                console.log("Student saved:", data);
            })
            .catch((err) => {
                console.error("Error saving student: ", err);
            });

    }
    const handleDeleteStudent = () => {
        const message = "Are you sure you want delete this student?";

        const confirmed = window.confirm(message);

        if (!confirmed) return;

        fetch(`http://localhost:8080/api/user/delete/${editing.studentid}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to delete student");
                }
            })
            .then((data) => {
                console.log("Student deleted:", data);
            })
            .catch((err) => {
                console.error("Error deleting student: ", err);
            });

    }

    const toggleReader = () => {
        setStudentData(studentData => ({
            ...studentData,
            reader: !studentData.reader
        }));
    }
    const toggleWP = () => {
        setStudentData(studentData => ({
            ...studentData,
            wordprocessor: !studentData.wordprocessor
        }));
    }
    const toggleScribe = () => {
        setStudentData(studentData => ({
            ...studentData,
            scribe: !studentData.scribe
        }));
    }

    const canSave = studentData.fullname.length > 1 && studentData.email.length > 1 && studentData.timeextension >= 1;

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
                    type="text"
                    value={studentData.fullname}
                    placeholder="Name: "
                    onChange={(e) => setStudentData({ ...studentData, fullname: e.target.value })}
                    className="text-white bg-gray-700 placeholder-gray-300 w-3/4 mb-2 px-3 py-2 border rounded"
                />
                <input
                    type="text"
                    value={studentData.email}
                    placeholder="Email (before @): "
                    onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                    className="text-white bg-gray-700 placeholder-gray-300 w-3/4 mb-2 px-3 py-2 border rounded"
                />
                <input
                    type="number"
                    value={studentData.timeextension}
                    placeholder="Time Multiplier: "
                    onChange={(e) => setStudentData({ ...studentData, timeextension: parseFloat(e.target.value) })}
                    className="text-white bg-gray-700 placeholder-gray-300 w-3/4 mb-2 px-3 py-2 border rounded"
                />
                <div className="flex justify-center gap-6">
                    <label className="flex text-white items-center gap-2">
                        <input
                            type="checkbox"
                            checked={studentData.reader}
                            onChange={toggleReader}
                            className="text-center text-white px-6 py-4"
                        />Reader
                    </label>
                    <label className="flex text-white items-center gap-2">

                        <input
                            type="checkbox"
                            checked={studentData.scribe}
                            onChange={toggleScribe}
                            className="text-center text-white px-6 py-4"
                        />
                        Scribe
                    </label>
                    <label className="flex text-white items-center gap-2">

                        <input
                            type="checkbox"
                            checked={studentData.wordprocessor}
                            onChange={toggleWP}
                            className="text-center text-white px-6 py-4"
                        />
                        WP
                    </label>
                </div>


                <div className="flex justify-center gap-2 mt-[40px]">
                    <button
                        onClick={() => onClose()}
                        className="px-4 py-2 text-sm !bg-gray-200 rounded hover:!bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            handleDeleteStudent();
                            onClose();
                        }}
                        className="px-4 py-2 text-sm !text-white !bg-red-500 rounded hover:!bg-red-600 hober:!border-red-600"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => {
                            handleSaveStudent();
                            onClose();
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