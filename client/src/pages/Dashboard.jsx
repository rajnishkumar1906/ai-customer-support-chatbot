import { useEffect, useState } from "react";
import api from "../services/api";

const Dashboard = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    api.get("/analytics/summary").then((res) => setData(res.data)).catch((err) => {
      console.error("Error fetching analytics:", err);
      setData({});
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white w-96 p-8 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Analytics
        </h2>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-500">
              Total Messages
            </p>
            <p className="text-2xl font-bold">
              {data.messages || 0}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-500">
              AI Responses
            </p>
            <p className="text-2xl font-bold">
              {data.totalAssistantMessages || 0}
            </p>
          </div>
        </div>

        <a
          href="/"
          className="block text-center mt-6 text-blue-600 hover:underline"
        >
          ← Back to Chat
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
