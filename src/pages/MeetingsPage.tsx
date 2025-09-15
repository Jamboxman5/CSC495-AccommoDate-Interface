import NavigationBar from "../components/NavigationBar";
import { useState } from "react";
import MeetingList from "../components/MeetingList";
import "./tailwind.css"
import ScheduleMeetingModal from "../components/ScheduleMeetingModal";
import { useEffect } from "react";
import { getUserRole } from "../services/auth";

export default function MeetingsPage() {
  const [showModal, setShowModal] = useState(false);
  
useEffect(() => {
  document.title = "Meetings - AccommoDate"
});

  return (
    <div className="min-w-screen min-h-screen pt-40 px-4 py-6 bg-gradient-to-br from-indigo-600 to-orange-400">
      <NavigationBar />
      <h1 className="text-3xl text-white font-bold text-center mb-6">Meetings</h1>
      {getUserRole() === "ROLE_USER" ? (<button
        onClick={() => {setShowModal(true)}}
        className="!bg-blue-500 flex ml-auto mr-auto mt-[30px] mb-[20px] justify-center hover:!bg-blue-600 text-white text-xs font-semibold py-1 px-3 rounded-lg transition duration-200"
      >Schedule a Meeting
      </button>) : (<></>)}
      <ScheduleMeetingModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-xl text-gray-100 font-semibold mb-2 pb-4 pt-4 text-center md:text-left">Upcoming Meetings:</h2>
          <MeetingList pastUpcoming="upcoming" />
        </div>

        <div className="flex-1">
          <h2 className="text-xl text-gray-100 font-semibold mb-2 pb-4 pt-4 text-center md:text-left">Past Meetings:</h2>
          <MeetingList pastUpcoming="past" />
        </div>
      </div>
    </div>
  );
}