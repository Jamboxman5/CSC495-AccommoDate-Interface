import { useState, useEffect } from "react";
import { getID, getToken } from "../services/auth";
import { formatDate, isWeekDay, getFixedTime } from "../services/dateUtil";
import { StudentCourse } from "../interfaces/StudentCourse";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export default function ScheduleExamModal({ isOpen, onClose }: Props) {
    const [courseList, setCourseList] = useState<StudentCourse[]>([]);

    const [examData, setExamData] = useState({
        studentid: getID(),
        examdate: formatDate(new Date()),
        examtime: '08:00:00',
        examduration: 0,
        crn: 0,
        examrequested: false,
        examcomplete: false,
        examconfirmed: false,
        examonline: false,
        note: "",
        examlocation: "",

    });

    useEffect(() => {
        const token = getToken();
        if (!token) return;

        fetch(`http://localhost:8080/api/course/getfullbyid/${getID()}`, {
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


    const isValidExam = (course: StudentCourse | null) => {
        if (course == null) return false;
        const selectedTime = new Date(`${examData.examdate}T${examData.examtime}`);
        const nextAvailableMeetTime = new Date(Date.now());
        const startInOfficeHours = (selectedTime.getHours() >= 7 && selectedTime.getHours() < 16)
        const multiplier = course.user.timeextension;
        const assumedDuration = course.course.meetduration;
        const assumedExamDuration = multiplier * assumedDuration;
        selectedTime.setMinutes(selectedTime.getMinutes() + assumedExamDuration);
        const endInOfficeHours = (selectedTime.getHours() >= 7 && selectedTime.getHours() <= 16)

        if (selectedTime.getHours() == 16) {
            return (selectedTime > nextAvailableMeetTime) && startInOfficeHours && selectedTime.getMinutes() <= 30 && endInOfficeHours && isWeekDay(selectedTime);
        } else {
            return (selectedTime > nextAvailableMeetTime) && startInOfficeHours && endInOfficeHours && isWeekDay(selectedTime);
        }
    };

    const handleSaveExam = () => {
        const message = "Are you sure you want schedule this exam?";

        const confirmed = window.confirm(message);
        examData.examtime = getFixedTime(examData.examtime)

        if (!confirmed) return;
        console.log(JSON.stringify(examData))

        fetch(`http://localhost:8080/api/exam/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
            body: JSON.stringify(examData),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to schedule exam");
                }
            })
            .then((data) => {
                console.log("Exam scheduled:", data);
            })
            .catch((err) => {
                console.error("Error scheduling exam: ", err);
            });

    }
    
    const getByCRN = (searching: number): StudentCourse | null => {
        return courseList.find((course) => course.course.crn === searching) || null;
    };

    const canSave = (examData.crn > 0) && isValidExam(getByCRN(examData.crn));

    const getExamDuration = (course: StudentCourse | null): number => {
        if (course == null) return 0;
        if (course.course.meetduration == 0) return 60;
        return course.course.meetduration;
    }

    const getDefaultStartTime = (course: StudentCourse | null): string => {
        if (course == null) return "08:00:00";
        return course.course.meettime;
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-gradient-to-b from-gray-700 text-center to-gray-800 rounded-lg shadow-lg p-6 min-w-3/8 min-h-1/2 max-w-md">
                <h2 className="text-3xl text-white font-semibold mb-4">Schedule Exam</h2>
                <select
                    value={examData.crn}
                    onChange={(e) => setExamData({ ...examData, crn: parseInt(e.target.value), examtime: getDefaultStartTime(getByCRN(parseInt(e.target.value))), examduration: getExamDuration(getByCRN(parseInt(e.target.value)))})}
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