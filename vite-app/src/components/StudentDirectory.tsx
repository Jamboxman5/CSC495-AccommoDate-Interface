import { useEffect, useState } from "react";
import { getToken, getID, getUserRole, logout } from "../services/auth";
import { User } from "../interfaces/User";
import { getAccommodationString } from "../services/textUtil";
import EditStudentModal from "./EditStudentModal";
import NewStudentModal from "./NewStudentModal";

export default function StudentDirectory() {
    const [students, setStudents] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [showNewModal, setShowNewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState<User | null>(null);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = () => {
        const token = getToken();
        const userId = getID();

        if (!token || !userId) {
            setError('Missing auth credentials');
            return;
        }

        setLoading(true);
        fetch(`http://localhost:8080/api/user/get/students`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch students');
                if (res.status == 403) logout();

                return res.json();
            })
            .then((data: User[]) => {
                setStudents(data);
            })
            .catch((err) => {
                setError(err.message);
            }).finally(() => {
                setLoading(false);
            });
    }

    const filteredStudents = students.filter(student => {
        const search = searchTerm.toLowerCase();
        return (
            student.studentid.toLowerCase().includes(search) ||
            student.fullname.toLowerCase().includes(search) ||
            student.preferredname.toLowerCase().includes(search) ||
            student.email.toLowerCase().includes(search) ||
            (student.timeextension + "x").toString().includes(search) ||
            (student.reader && "reader".includes(search)) ||
            (student.scribe && "scribe".includes(search)) ||
            (student.wordprocessor && "word processor".includes(search))
        );
    });

    const renderSearchBar = () => (
        <div className="mb-4 flex gap-4 justify-center ml-1 ">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students..."
                className="px-4 py-2 w-full bg-gray-700 max-w-md text-white placeholder-gray-300 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={() => { setShowNewModal(true); }}
                className="!bg-blue-500 hover:!bg-blue-600 text-white text-xs font-semibold py-1 px-3 rounded-lg transition duration-200"
            >
                New
            </button>
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
                ) : filteredStudents.length === 0 ? (
                    <p className="text-l pt-5 pb-5 text-center mb-5 font-semibold text-gray-200">No students match your search.</p>
                ) : (
                    <div className="relative overflow-x-auto rounded-lg shadow-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-100 uppercase bg-gradient-to-l from-blue-400 to-indigo-500 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="text-center px-6 py-3">Student ID</th>
                                    <th className="text-center px-6 py-3">Full Name</th>
                                    <th className="text-center px-6 py-3">Preferred Name</th>
                                    <th className="text-center px-6 py-3">Email</th>
                                    <th className="text-center px-6 py-3">Accommodations</th>
                                    <th className="text-center px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <tr key={student.studentid} className="even:bg-gray-700 odd:bg-gray-800 border-b border-gray-700">
                                        <th className="px-6 py-4 text-center font-medium text-gray-100 whitespace-nowrap">
                                            {student.studentid}
                                        </th>
                                        <td className="text-center text-white px-6 py-4">{student.fullname}</td>
                                        <td className="text-center text-white px-6 py-4">{student.preferredname}</td>
                                        <td className="text-center text-white px-6 py-4">{student.email}@oswego.edu</td>
                                        <td className="text-center text-white px-6 py-4">{getAccommodationString(student)}</td>
                                        <td className="text-center text-white px-6 py-4">

                                            <button
                                                onClick={() => { setShowEditModal(true); setEditingStudent(student) }}
                                                className="!bg-transparent hover:!bg-blue-600 text-white text-xs font-semibold py-1 px-3 rounded-lg transition duration-200"
                                            >
                                                Edit
                                            </button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {editingStudent && (
                            <EditStudentModal
                                isOpen={showEditModal}
                                editing={editingStudent}
                                onClose={() => {
                                    setShowEditModal(false);
                                    setEditingStudent(null);
                                    loadStudents();
                                }}
                            />
                        )}
                        {<NewStudentModal
                            isOpen={showNewModal}
                            onClose={() => {
                                setShowNewModal(false);
                                loadStudents();
                            }}
                        />}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="p-4">

        </div>
    );
}
