import { Search, Sliders, List, LayoutGrid } from 'lucide-react';

export function RecruiterSearchBar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  showAdvancedFilters,
  onToggleAdvancedFilters,
  hasActiveFilters,
  filterCount
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search candidates by name, title, skills, location, email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onToggleAdvancedFilters}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg font-medium transition-all ${
            showAdvancedFilters || hasActiveFilters
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'table'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('card')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'card'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Card View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}