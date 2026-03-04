import { Users, TrendingUp, Clock } from 'lucide-react';

export function RecruiterCandidateStats({ totalCandidates, newThisWeek, recentActivity, topSource }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium">Total Candidates</p>
            <p className="text-3xl font-bold text-blue-900 mt-1">{totalCandidates}</p>
          </div>
          <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-700" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-emerald-600 font-medium">New This Week</p>
            <p className="text-3xl font-bold text-emerald-900 mt-1">{newThisWeek}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-200 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-700" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-600 font-medium">Recent Activity</p>
            <p className="text-3xl font-bold text-purple-900 mt-1">{recentActivity}</p>
          </div>
          <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-purple-700" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-orange-600 font-medium">Top Source</p>
            <p className="text-lg font-bold text-orange-900 mt-1">
              {topSource ? topSource[0] : 'N/A'}
            </p>
            <p className="text-xs text-orange-600 mt-1">
              {topSource ? `${topSource[1]} candidates` : ''}
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-orange-700" />
          </div>
        </div>
      </div>
    </div>
  );
}