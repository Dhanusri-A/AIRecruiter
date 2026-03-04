// components/AdvancedFilters.jsx
import { X, Plus } from 'lucide-react';

export function RecruiterAdvancedFilters({
  // Status filter
  statusFilter,
  onStatusChange,
  statusOptions,

  // Location filter
  locationFilter,
  onLocationChange,
  locationOptions,

  // Source filter
  sourceFilter,
  onSourceChange,
  sourceOptions,

  // Experience filter
  experienceFilter,
  onExperienceChange,
  experienceRanges,

  // Skills filter
  selectedSkills,
  onToggleSkill,
  skillSearchQuery,
  onSkillSearchChange,
  showSkillsDropdown,
  onShowSkillsDropdown,
  filteredSkillOptions,

  // Clear filters
  hasActiveFilters,
  filteredCount,
  totalCount,
  onClearFilters
}) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Skills Multi-Select */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Skills (AND logic)
          </label>
          <div className="relative">
            <div className="border border-gray-300 rounded-lg p-2 min-h-[42px] bg-white focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
              <div className="flex flex-wrap gap-1 mb-1">
                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-sm font-medium"
                  >
                    {skill}
                    <button
                      onClick={() => onToggleSkill(skill)}
                      className="hover:bg-emerald-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type to search skills..."
                value={skillSearchQuery}
                onChange={(e) => onSkillSearchChange(e.target.value)}
                onFocus={() => onShowSkillsDropdown(true)}
                className="w-full outline-none text-sm"
              />
            </div>

            {showSkillsDropdown && filteredSkillOptions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                {filteredSkillOptions.slice(0, 20).map((skill) => (
                  <button
                    key={skill}
                    onClick={() => {
                      onToggleSkill(skill);
                      onSkillSearchChange("");
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-sm flex items-center justify-between group"
                  >
                    <span>{skill}</span>
                    <Plus className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedSkills.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Showing candidates with ALL selected skills
            </p>
          )}
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location
          </label>
          <select
            value={locationFilter}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm"
          >
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Source Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Source
          </label>
          <select
            value={sourceFilter}
            onChange={(e) => onSourceChange(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm"
          >
            {sourceOptions.map((src) => (
              <option key={src} value={src}>
                {src}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Experience
          </label>
          <select
            value={experienceFilter}
            onChange={(e) => onExperienceChange(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-sm"
          >
            {experienceRanges.map((exp) => (
              <option key={exp.label} value={exp.label}>
                {exp.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredCount} of {totalCount} candidates match your filters
          </p>
          <button
            onClick={onClearFilters}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}