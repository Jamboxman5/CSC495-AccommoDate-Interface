import { useEffect, useState } from "react";
import { getID, getToken, getUserRole } from "../services/auth";
import { formatWeekDate, formatTime, formatPrettyDate, formatDate } from "../services/dateUtil";
import { FullMeeting } from "../interfaces/FullMeeting";
import { getCourseEndTime } from "../services/dateUtil";
import { getAccommodationString } from "../services/textUtil";
import "./tailwind.css";

type Props = {
    pastUpcoming: string;
}

export default function MeetingList({pastUpcoming}: Props) {
    const [exams, setMeetings] = useState<FullMeeting[]>([]);
    const [error, setError] = useState<string | null>(null);

    var date = formatDate(new Date());
    const time = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

    useEffect(() => {
        const token = getToken();

        if (!token) {
            setError('Missing auth credentials');
            return;
        }
        if (getUserRole() == "ROLE_ADMIN") {
            fetch(`http://localhost:8080/api/meeting/get/admin/${pastUpcoming}/${getID()}/${date}/${time}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to fetch meetings');
                    return res.json();
                })
                .then((data: FullMeeting[]) => {
                    setMeetings(data);
                })
                .catch((err) => {
                    setError(err.message);
                });
        } else if (getUserRole() == "ROLE_USER") {
            fetch(`http://localhost:8080/api/meeting/get/user/${pastUpcoming}/${getID()}/${date}/${time}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to fetch meetings');
                    return res.json();
                })
                .then((data: FullMeeting[]) => {
                    setMeetings(data);
                })
                .catch((err) => {
                    setError(err.message);
                });
        }

    }, [date]);

    if (getUserRole() == "ROLE_ADMIN") {
        return (
            <div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {exams.length === 0 ? (
                    <p>You have no {pastUpcoming} meetings.</p>
                ) : (
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-100 uppercase bg-gradient-to-l from-blue-400 to-indigo-500 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Meeting with</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Time</th>
                                    <th scope="col" className="px-6 py-3">Virtual / In Person</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.map((fullMeeting) => (
                                    <tr key={fullMeeting.meeting.meetingid} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                            {fullMeeting.user.preferredname + " " + fullMeeting.user.fullname.split(" ")[1]}<br></br>{fullMeeting.user.title}
                                        </th>
                                        <td className="px-6 py-4">{formatPrettyDate(fullMeeting.meeting.meetdate)}</td>
                                        <td className="px-6 py-4">{formatTime(fullMeeting.meeting.meettime)}</td>
                                        <td className="px-6 py-4">{fullMeeting.meeting.virtual ? ("Virtual") : ("In Person")}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                )}

            </div>
        );
    } else {
        return (
            <div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {exams.length === 0 ? (
                    <p>You have no {pastUpcoming} meetings.</p>
                ) : (
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="bg-gradient-to-l from-blue-400 to-indigo-500 text-xs text-gray-100 uppercase dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Meeting with</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Time</th>
                                    <th scope="col" className="px-6 py-3">Virtual / In Person</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.map((fullMeeting) => (
                                    <tr key={fullMeeting.meeting.meetingid} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                                            {fullMeeting.admin.preferredname + " " + fullMeeting.admin.fullname.split(" ")[1]}<br></br>{fullMeeting.admin.title}
                                        </th>
                                        <td className="px-6 py-4">{formatPrettyDate(fullMeeting.meeting.meetdate)}</td>
                                        <td className="px-6 py-4">{formatTime(fullMeeting.meeting.meettime)}</td>
                                        <td className="px-6 py-4">{fullMeeting.meeting.virtual ? ("Virtual") : ("In Person")}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                )}

            </div>
        );
    }


}
