// components/CardView.jsx
import { Users } from 'lucide-react';
import { RecruiterCandidateCard } from './RecruiterCandidateCard';

export function RecruiterCardView({
  candidates,
  selectedCandidates,
  onSelectCandidate,
  onCandidateClick,
  getStatusColor,
  onClearFilters
}) {
  if (candidates.length === 0) {
    return (
      <div className="col-span-full py-20 text-center">
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
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {candidates.map((candidate) => (
        <RecruiterCandidateCard
          key={candidate.id}
          candidate={candidate}
          isSelected={selectedCandidates.includes(candidate.id)}
          onSelect={onSelectCandidate}
          onClick={() => onCandidateClick(candidate)}
          getStatusColor={getStatusColor}
        />
      ))}
    </div>
  );
}