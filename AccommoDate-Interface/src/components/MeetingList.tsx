import { useEffect, useState } from "react";
import { getID, getToken, getUserRole, logout } from "../services/auth";
import { formatTime, formatPrettyDate, formatDate } from "../services/dateUtil";
import { FullMeeting } from "../interfaces/FullMeeting";
import "./tailwind.css";

type Props = {
    pastUpcoming: string;
}

export default function MeetingList({ pastUpcoming }: Props) {
    const [meetings, setMeetings] = useState<FullMeeting[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);

    var date = formatDate(new Date());
    const time = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    useEffect(() => {
        setLoading(true);
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
                }).finally(() => {
                    setLoading(false);
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
                                                                    if (res.status == 403) logout();
                    
                    return res.json();
                })
                .then((data: FullMeeting[]) => {
                    setMeetings(data);
                })
                .catch((err) => {
                    setError(err.message);
                }).finally(() => {
                    setLoading(false);
                });
        }

    }, [date]);

    if (getUserRole() == "ROLE_ADMIN") {
        return (
            <div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : meetings.length === 0 ? (

                    <p className="text-l pt-5 pb-5 text-center mb-5 font-semibold text-gray-200">You have no {pastUpcoming} meetings.</p>
                ) : (
                    <div className="relative overflow-x-auto rounded-lg shadow-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-100 uppercase bg-gradient-to-l from-blue-400 to-indigo-500 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                <th scope="col" className="px-6 py-3 text-center">{pastUpcoming === "past" ? ("Met") : ("Meeting")} with</th>
                                <th scope="col" className="text-center px-6 py-3">Date</th>
                                    <th scope="col" className="text-center px-6 py-3">Time</th>
                                    <th scope="col" className="text-center px-6 py-3">Virtual / In Person</th>
                                </tr>
                            </thead>
                            <tbody className="className=divide-y">
                                {meetings.map((fullMeeting) => (
                                    <tr key={fullMeeting.meeting.meetingid} className=" even:bg-gray-700 odd:bg-gray-800 border-b dark:border-gray-600">
                                        <th scope="row" className="px-6 py-4 text-center font-medium text-gray-100 whitespace-nowrap dark:text-white text-center">
                                            {fullMeeting.user.preferredname + " " + fullMeeting.user.fullname.split(" ")[1]}<br></br>{fullMeeting.user.title}
                                        </th>
                                        <td className="text-center text-white px-6 py-4">{formatPrettyDate(fullMeeting.meeting.meetdate)}</td>
                                        <td className="text-center text-white px-6 py-4">{formatTime(fullMeeting.meeting.meettime)}</td>
                                        <td className="text-center text-white px-6 py-4">{fullMeeting.meeting.virtual ? ("Virtual") : ("In Person")}</td>

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
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : meetings.length === 0 ? (

                    <p className="text-l pt-5 pb-5 text-center mb-5 font-semibold text-gray-200">You have no {pastUpcoming} meetings.</p>
                ) : (
                    <div className="relative overflow-x-auto rounded-lg shadow-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="bg-gradient-to-l from-blue-400 to-indigo-500 text-xs text-gray-100 uppercase dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                <th scope="col" className="px-6 py-3 text-center">{pastUpcoming === "past" ? ("Met") : ("Meeting")} with</th>
                                <th scope="col" className="px-6 py-3 text-center">Date</th>
                                    <th scope="col" className="px-6 py-3 text-center">Time</th>
                                    <th scope="col" className="px-6 py-3 text-center">Virtual / In Person</th>
                                </tr>
                            </thead>
                            <tbody className="className=divide-y">
                                {meetings.map((fullMeeting) => (
                                    <tr key={fullMeeting.meeting.meetingid} className=" even:bg-gray-700 odd:bg-gray-800 border-b border-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white text-center">
                                            {fullMeeting.admin.preferredname + " " + fullMeeting.admin.fullname.split(" ")[1]}<br></br>{fullMeeting.admin.title}
                                        </th>
                                        <td className="text-center text-white px-6 py-4">{formatPrettyDate(fullMeeting.meeting.meetdate)}</td>
                                        <td className="text-center text-white px-6 py-4">{formatTime(fullMeeting.meeting.meettime)}</td>
                                        <td className="text-center text-white px-6 py-4">{fullMeeting.meeting.virtual ? ("Virtual") : ("In Person")}</td>

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
