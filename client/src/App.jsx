import { Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </div>
  );
}
