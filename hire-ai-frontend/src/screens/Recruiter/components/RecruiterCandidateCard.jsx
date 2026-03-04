// components/CandidateCard.jsx
import { MapPin, Briefcase } from 'lucide-react';

export function RecruiterCandidateCard({ candidate, isSelected, onSelect, onClick, getStatusColor }) {
  return (
    <div
      className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      {/* Header row: avatar + name on left, checkbox on right */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0 pr-3">
          {candidate.image_url ? (
            <img
              src={candidate.image_url}
              alt={candidate.name}
              className="w-12 h-12 rounded-full object-cover border border-gray-200 flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              {candidate.avatar}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 truncate">{candidate.name}</h3>
            <p className="text-sm text-gray-600 truncate">{candidate.title}</p>
          </div>
        </div>

        {/* Checkbox — both onClick and onChange stop propagation to prevent card click / router navigation */}
        <input
          type="checkbox"
          checked={isSelected}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(candidate.id);
          }}
          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 flex-shrink-0 cursor-pointer mt-1"
        />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{candidate.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {candidate.experience} {candidate.experience === 1 ? 'year' : 'years'} experience
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {candidate.skills.slice(0, 5).map((skill, idx) => (
          <span
            key={idx}
            className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
          >
            {skill}
          </span>
        ))}
        {candidate.skills.length > 5 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
            +{candidate.skills.length - 5}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            candidate.status,
          )}`}
        >
          {candidate.status}
        </span>
        <span className="text-xs text-gray-500">{candidate.source}</span>
      </div>
    </div>
  );
}