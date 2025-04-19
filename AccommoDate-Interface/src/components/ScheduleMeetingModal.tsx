import { useState, useEffect } from "react";
import { getID, getToken } from "../services/auth";
import { formatDate, isWeekDay, getFixedTime } from "../services/dateUtil";
import { Admin } from "../interfaces/Admin";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export default function ScheduleMeetingModal({ isOpen, onClose }: Props) {
    const [adminList, setAdminList] = useState<Admin[]>([]);

    const [meetingData, setMeetingData] = useState({
        adminid: '',
        userid: getID(),
        meetdate: formatDate(new Date()),
        meettime: '12:00:00',
        virtual: false,
    });

    useEffect(() => {
        const token = getToken();
        if (!token) return;

        fetch("http://localhost:8080/api/meeting/admins", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch admins");
                return res.json();
            })
            .then((data: Admin[]) => {
                setAdminList(data);
            })
            .catch((err) => {
                console.error("Error fetching admins:", err);
            });
    }, []);

    if (!isOpen) return null;


    const isValidMeetingTime = () => {
        const selectedTime = new Date(`${meetingData.meetdate}T${meetingData.meettime}`);
        const nextAvailableMeetTime = new Date(Date.now() + 6 * 60 * 60 * 1000);
        const inOfficeHours = (selectedTime.getHours() >= 7 && selectedTime.getHours() < 16)

        return (selectedTime > nextAvailableMeetTime) && inOfficeHours && isWeekDay(selectedTime);
    };

    const handleSaveMeeting = () => {
        const message = "Are you sure you want schedule this meeting?";

        const confirmed = window.confirm(message);
        meetingData.meettime = getFixedTime(meetingData.meettime)

        if (!confirmed) return;
        console.log(JSON.stringify(meetingData))

        fetch(`http://localhost:8080/api/meeting/schedule`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
            body: JSON.stringify(meetingData),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to schedule meeting");
                }
            })
            .then((data) => {
                console.log("Meeting scheduled:", data);
            })
            .catch((err) => {
                console.error("Error scheduling meeting: ", err);
            });

    }

    const canSave = (meetingData.adminid.length > 1) && isValidMeetingTime();

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-gradient-to-b from-gray-700 text-center to-gray-800 rounded-lg shadow-lg p-6 min-w-3/8 min-h-1/2 max-w-md">
                <h2 className="text-3xl text-white font-semibold mb-4">Schedule Meeting</h2>
                <select
                    value={meetingData.adminid}
                    onChange={(e) => setMeetingData({ ...meetingData, adminid: e.target.value })}
                    className="text-white bg-gray-700 w-3/4 mb-2 mt-6 px-3 py-2 border rounded"
                >
                    <option value="">Select Admin</option>
                    {adminList.map((admin) => (
                        <option key={admin.adminid} value={admin.adminid}>
                            {admin.fullname} - {admin.title}
                        </option>
                    ))}
                </select>
                <input
                    type="date"
                    value={meetingData.meetdate}
                    onChange={(e) => setMeetingData({ ...meetingData, meetdate: e.target.value })}
                    className="text-white bg-gray-700 w-3/4 mb-2 px-3 py-2 border rounded"
                />
                <input
                    type="time"
                    value={meetingData.meettime}
                    onChange={(e) => setMeetingData({ ...meetingData, meettime: e.target.value })}
                    className="text-white bg-gray-700 w-3/4 mb-2 px-3 py-2 border rounded"
                />
                <div className="flex items-center justify-center gap-4 my-4">
                    <span className="text-white text-md font-medium">
                        {meetingData.virtual ? "Virtual" : "In Person"}
                    </span>
                    <button
                        onClick={() =>
                            setMeetingData({ ...meetingData, virtual: !meetingData.virtual })
                        }
                        className={`relative w-12 h-6 flex items-center bg-gray-400 rounded-full p-1 transition-colors duration-300 ${meetingData.virtual ? "bg-blue-600" : "bg-gray-500"
                            }`}
                    >
                        <span
                            className={`bg-blue-500 w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${meetingData.virtual ? "translate-x-3" : "-translate-x-3"
                                }`}
                        ></span>
                    </button>
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
                            handleSaveMeeting();
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