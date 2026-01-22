import React from 'react';
export default function AnalyticsCard({ title, value, icon, gradient }) {
  return (
    <div className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all`}
        >
          <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
          <div className="relative">{icon}</div>
        </div>
      </div>

      <div className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
        {value ?? 0}
      </div>

      <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
        {title}
      </div>
    </div>
  );
}
