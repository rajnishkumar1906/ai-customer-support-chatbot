import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const cls = (path) =>
    `px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
      pathname === path
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <img src="/logo.svg" alt="AI Support Logo" className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Support
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/" className={cls("/")}>
              💬 Chat
            </Link>
            <Link to="/analytics" className={cls("/analytics")}>
              📊 Analytics
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
