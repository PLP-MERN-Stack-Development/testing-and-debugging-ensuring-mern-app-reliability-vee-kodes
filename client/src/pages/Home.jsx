import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-indigo-100 to-white px-4 sm:px-6">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-indigo-700 mb-4 text-center">
        🐞 Bug Tracker
      </h1>
      <p className="text-gray-600 text-center max-w-md mb-8 text-sm sm:text-base">
        Track, manage, and resolve project bugs efficiently. Stay organized and
        improve your development workflow.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/bug-list"
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition text-center"
        >
          View All Bugs
        </Link>
        <Link
          to="/new-bug"
          className="px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition text-center"
        >
          Report New Bug
        </Link>
      </div>
    </div>
  );
}
