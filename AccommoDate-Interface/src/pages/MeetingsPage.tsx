import NavigationBar from "../components/NavigationBar";

import MeetingList from "../components/MeetingList";
import "./tailwind.css"

export default function MeetingsPage() {

    return (
        <div className="min-w-screen min-h-screen pt-40 px-4 py-6 bg-gradient-to-br from-indigo-600 to-orange-400">
          <NavigationBar />
          <h1 className="text-3xl text-white font-bold text-center mb-6">Meetings</h1>
      
          <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Upcoming Meetings */}
            <div className="flex-1">
              <h2 className="text-xl text-gray-100 font-semibold mb-2 pb-4 pt-4 text-center md:text-left">Upcoming Meetings:</h2>
              <MeetingList pastUpcoming="upcoming" />
            </div>
      
            {/* Past Meetings */}
            <div className="flex-1">
              <h2 className="text-xl text-gray-100 font-semibold mb-2 pb-4 pt-4 text-center md:text-left">Past Meetings:</h2>
              <MeetingList pastUpcoming="past" />
            </div>
          </div>
        </div>
      );
}