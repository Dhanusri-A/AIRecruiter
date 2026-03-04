// components/TableView.jsx
import { MapPin, Briefcase, Clock, ChevronDown, MoreVertical, Users } from 'lucide-react';

export function RecruiterTableView({
  candidates,
  selectedCandidates,
  onSelectAll,
  onSelectCandidate,
  onCandidateClick,
  sortColumn,
  sortDirection,
  onSort,
  getStatusColor,
  onClearFilters
}) {
  if (candidates.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
          <button
            onClick={onClearFilters}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={selectedCandidates.length === candidates.length && candidates.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center gap-1">
                  Candidate
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      sortColumn === 'name' && sortDirection === 'asc' ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Location
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('experience')}
              >
                <div className="flex items-center gap-1">
                  Experience
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      sortColumn === 'experience' && sortDirection === 'asc' ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Key Skills
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Source
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('lastUpdated')}
              >
                <div className="flex items-center gap-1">
                  Last Updated
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      sortColumn === 'lastUpdated' && sortDirection === 'asc' ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {candidates.map((candidate) => (
              <tr
                key={candidate.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onCandidateClick(candidate)}
              >
                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedCandidates.includes(candidate.id)}
                    onChange={() => onSelectCandidate(candidate.id)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {candidate.image_url ? (
                      <img
                        src={candidate.image_url}
                        alt={candidate.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {candidate.avatar}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{candidate.name}</div>
                      <div className="text-sm text-gray-600 truncate">{candidate.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{candidate.location}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {candidate.experience} {candidate.experience === 1 ? 'yr' : 'yrs'}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {candidate.skills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium whitespace-nowrap"
                      >
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium whitespace-nowrap">
                        +{candidate.skills.length - 4}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      candidate.status,
                    )} whitespace-nowrap`}
                  >
                    {candidate.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-700 truncate block">{candidate.source}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{candidate.lastUpdated}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}