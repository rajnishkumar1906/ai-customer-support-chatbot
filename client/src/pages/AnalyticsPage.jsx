import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/analytics/summary")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching analytics:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="ml-72 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="ml-72 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-200 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 font-semibold">Failed to load analytics</p>
        </div>
      </div>
    );

  return (
    <div className="ml-72 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Track your customer support metrics and insights in real-time</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <StatCard
            title="Conversations"
            value={data.conversations}
            icon="💬"
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Total Messages"
            value={data.messages}
            icon="📨"
            gradient="from-green-500 to-emerald-600"
          />
          <StatCard
            title="RAG Responses"
            value={data.ragResponses}
            icon="📚"
            gradient="from-purple-500 to-purple-600"
          />
          <StatCard
            title="User Messages"
            value={data.totalUserMessages || 0}
            icon="👤"
            gradient="from-orange-500 to-orange-600"
          />
          <StatCard
            title="AI Responses"
            value={data.totalAssistantMessages || 0}
            icon="🤖"
            gradient="from-indigo-500 to-pink-600"
          />
        </div>

        {data.modelStats && data.modelStats.length > 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Model Performance</h3>
                <p className="text-gray-500">AI model usage statistics and distribution</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="space-y-6">
              {data.modelStats.map((stat, idx) => {
                const percentage = (stat.count / data.totalAssistantMessages) * 100;
                return (
                  <div key={idx} className="space-y-3 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                          <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${idx === 0 ? 'from-yellow-400 to-orange-500' : idx === 1 ? 'from-blue-400 to-blue-600' : 'from-purple-400 to-purple-600'} flex items-center justify-center text-white font-bold text-lg shadow-lg transform group-hover:scale-110 transition-transform`}>
                            {idx + 1}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-lg">
                            {stat.model.split("/").pop() || stat.model}
                          </p>
                          <p className="text-sm text-gray-500">
                            {percentage.toFixed(1)}% of total responses
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {stat.count}
                        </p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">uses</p>
                      </div>
                    </div>
                    <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${idx === 0 ? 'from-yellow-400 to-orange-500' : idx === 1 ? 'from-blue-500 to-blue-600' : 'from-purple-500 to-purple-600'} rounded-full transition-all duration-1000 ease-out shadow-lg`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {data.recentConversations && data.recentConversations.length > 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50/50 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">Recent Conversations</h3>
                  <p className="text-gray-500">
                    Latest {data.recentConversations.length} conversation{data.recentConversations.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50/30">
                  <tr>
                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Conversation ID
                    </th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Messages
                    </th>
                    <th className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Started
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {data.recentConversations.map((conv, idx) => (
                    <tr
                      key={conv.id}
                      className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all cursor-pointer group"
                    >
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                              {idx + 1}
                            </div>
                          </div>
                          <code className="text-sm font-mono text-gray-700 font-medium">
                            {conv.id.toString().substring(0, 16)}...
                          </code>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200 shadow-sm">
                          {conv.messageCount} {conv.messageCount === 1 ? 'message' : 'messages'}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {new Date(conv.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(!data.recentConversations || data.recentConversations.length === 0) && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-16 text-center">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative text-7xl">📊</div>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-3">No conversations yet</h3>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
              Start chatting to see analytics and insights here!
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Start Chatting
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, gradient }) {
  return (
    <div className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="flex items-center justify-between mb-4">
        <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all`}>
          <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
          <div className="relative">{icon}</div>
        </div>
      </div>
      <div className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
        {value}
      </div>
      <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">{title}</div>
    </div>
  );
}
