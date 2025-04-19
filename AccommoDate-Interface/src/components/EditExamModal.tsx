import { useState, useEffect } from "react";
import { getToken } from "../services/auth";
import { getFixedTime } from "../services/dateUtil";
import { StudentCourse } from "../interfaces/StudentCourse";
import { Exam } from "../interfaces/Exam";
type Props = {
    isOpen: boolean;
    editing: Exam;
    onClose: () => void;
};

export default function EditExamModal({ isOpen, editing, onClose }: Props) {
    const [courseList, setCourseList] = useState<StudentCourse[]>([]);
    const [examData, setExamData] = useState<Exam>(editing);

    useEffect(() => {
        const token = getToken();
        if (!token) return;

        fetch(`http://localhost:8080/api/course/getfullbyid/${examData.studentid}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch courses");
                return res.json();
            })
            .then((data: StudentCourse[]) => {
                setCourseList(data);
            })
            .catch((err) => {
                console.error("Error fetching courses:", err);
            });
    }, []);

    if (!isOpen) return null;

    const handleSaveExam = () => {
        const message = "Are you sure you want save this exam?";

        const confirmed = window.confirm(message);
        examData.examtime = getFixedTime(examData.examtime)

        if (!confirmed) return;
        console.log(JSON.stringify(examData))

        fetch(`http://localhost:8080/api/exam/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
            body: JSON.stringify(examData),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to save exam");
                }
            })
            .then((data) => {
                console.log("Exam saved:", data);
            })
            .catch((err) => {
                console.error("Error saving exam: ", err);
            });

    }
    const isValidDate = (exam: Exam): boolean => {
        if (exam.examdate) return true;
        else return false;
    }
    const isValidTime = (exam: Exam): boolean => {
        if (exam.examtime) return true;
        else return false;
    }
    const getByCRN = (searching: number): StudentCourse | null => {
        return courseList.find((course) => course.course.crn === searching) || null;
    };

    const canSave = (examData.crn > 0) && isValidDate(examData) && isValidTime(examData);


    const getExamDuration = (course: StudentCourse | null): number => {
        if (course == null) return 0;
        return course.course.meetduration;
    }

    const getDefaultStartTime = (course: StudentCourse | null): string => {
        if (course == null) return "08:00:00";
        return course.course.meettime;
    }

    const toggleRequested = () => {
        setExamData(examData => ({
            ...examData,
            examrequested: !examData.examrequested
        }));
    }
    const toggleComplete = () => {
        setExamData(examData => ({
            ...examData,
            examcomplete: !examData.examcomplete
        }));
    }
    const toggleConfirmed = () => {
        setExamData(examData => ({
            ...examData,
            examconfirmed: !examData.examconfirmed
        }));
    }
    const toggleOnline = () => {
        setExamData(examData => ({
            ...examData,
            examonline: !examData.examonline
        }));
    }


    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-gradient-to-b from-gray-700 text-center to-gray-800 rounded-lg shadow-lg p-6 min-w-3/8 min-h-1/2 max-w-md">
                <h2 className="text-3xl text-white font-semibold mb-4">Edit Exam</h2>
                <select
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
                </select>
                <input
                    type="date"
                    value={examData.examdate}
                    onChange={(e) => setExamData({ ...examData, examdate: e.target.value })}
                    className="text-white bg-gray-700 w-3/4 mb-2 px-3 py-2 border rounded"
                />
                <input
                    type="time"
                    value={examData.examtime}
                    onChange={(e) => setExamData({ ...examData, examtime: e.target.value })}
                    className="text-white bg-gray-700 w-3/4 mb-2 px-3 py-2 border rounded"
                />
                <input
                    type="text"
                    value={examData.note}
                    placeholder="Note: "
                    onChange={(e) => setExamData({ ...examData, note: e.target.value })}
                    className="text-white bg-gray-700 placeholder-gray-300 w-3/4 mb-2 px-3 py-2 border rounded"
                />
                <input
                    type="text"
                    value={examData.examlocation}
                    placeholder="Location: "
                    onChange={(e) => setExamData({ ...examData, examlocation: e.target.value })}
                    className="text-white bg-gray-700 placeholder-gray-300 w-3/4 mb-2 px-3 py-2 border rounded"
                />
                <input
                    type="number"
                    value={examData.examduration}
                    placeholder="Normal Duration: "
                    onChange={(e) => setExamData({ ...examData, examduration: parseInt(e.target.value) })}
                    className="text-white bg-gray-700 placeholder-gray-300 w-3/4 mb-2 px-3 py-2 border rounded"
                />
                <div className="flex justify-center gap-6">
                    <label className="flex text-white items-center gap-2">
                        <input
                            type="checkbox"
                            checked={examData.examonline}
                            onChange={toggleOnline}
                            className="text-center text-white px-6 py-4"
                        />Online
                    </label>
                    <label className="flex text-white items-center gap-2">

                        <input
                            type="checkbox"
                            checked={examData.examrequested}
                            onChange={toggleRequested}
                            className="text-center text-white px-6 py-4"
                        />
                        Requested</label>
                    <label className="flex text-white items-center gap-2">

                        <input
                            type="checkbox"
                            checked={examData.examconfirmed}
                            onChange={toggleConfirmed}
                            className="text-center text-white px-6 py-4"
                        />
                        Confirmed
                    </label>

                    <label className="flex text-white items-center gap-2">

                        <input
                            type="checkbox"
                            checked={examData.examcomplete}
                            onChange={toggleComplete}
                            className="text-center text-white px-6 py-4"
                        />
                        Complete
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
                            handleSaveExam();
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