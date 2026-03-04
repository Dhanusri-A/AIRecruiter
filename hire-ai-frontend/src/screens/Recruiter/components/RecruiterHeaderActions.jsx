import { UserPlus, Upload, Download } from 'lucide-react';

export function RecruiterHeaderActions({ onCreateNew }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onCreateNew}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
      >
        <UserPlus className="w-4 h-4" />
        <span className="hidden sm:inline">Add Candidate</span>
      </button>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
        <Upload className="w-4 h-4" />
        <span className="hidden sm:inline">Bulk Import</span>
      </button>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm font-medium">
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export All</span>
      </button>
    </div>
  );
}