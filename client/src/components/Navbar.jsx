import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const cls = (path) =>
    `px-6 py-3 rounded-lg font-medium ${
      pathname === path
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <nav className="bg-white border-b shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-6">
        <span className="text-xl font-bold text-blue-600">AI Support</span>
        <div className="flex gap-2">
          <Link to="/" className={cls("/")}>Chat</Link>
          <Link to="/analytics" className={cls("/analytics")}>Analytics</Link>
        </div>
      </div>
    </nav>
  );
}
