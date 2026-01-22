import { useEffect, useState } from "react";
import api from "../services/api";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/analytics/summary")
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Error fetching analytics:", err);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="ml-72 min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto" />
          <p className="mt-6 text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="ml-72 min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="ml-72 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-10">
      <div className="max-w-7xl mx-auto px-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
          Analytics Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <StatCard title="Conversations" value={data.conversations} icon="💬" gradient="from-blue-500 to-blue-600" />
          <StatCard title="Total Messages" value={data.messages} icon="📨" gradient="from-green-500 to-emerald-600" />
          <StatCard title="RAG Responses" value={data.ragResponses} icon="📚" gradient="from-purple-500 to-purple-600" />
          <StatCard title="User Messages" value={data.totalUserMessages || 0} icon="👤" gradient="from-orange-500 to-orange-600" />
          <StatCard title="AI Responses" value={data.totalAssistantMessages || 0} icon="🤖" gradient="from-indigo-500 to-pink-600" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, gradient }) {
  return (
    <div className="bg-white/80 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl mb-4`}>
        {icon}
      </div>
      <div className="text-4xl font-bold">{value}</div>
      <div className="text-sm text-gray-600 uppercase tracking-wide">{title}</div>
    </div>
  );
}
