// src/pages/recruiter/reformat/TemplatePreview.jsx

export default function RecruiterReformatResumeStep4TemplatePreview({ type }) {
  if (type === 'modern') {
    return (
      <div className="space-y-3 text-left scale-75 origin-top-left">
        <div className="h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        <div className="flex gap-2 mt-4">
          <div className="h-2 bg-blue-200 rounded flex-1"></div>
          <div className="h-2 bg-blue-200 rounded flex-1"></div>
        </div>
        <div className="h-4 bg-blue-300 rounded w-1/3 mt-4"></div>
        <div className="space-y-1.5">
          <div className="h-2 bg-gray-200 rounded w-full"></div>
          <div className="h-2 bg-gray-200 rounded w-5/6"></div>
          <div className="h-2 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="h-4 bg-blue-300 rounded w-1/3 mt-4"></div>
        <div className="space-y-1.5">
          <div className="h-2 bg-gray-200 rounded w-full"></div>
          <div className="h-2 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>
    );
  }

  if (type === 'classic') {
    return (
      <div className="space-y-2.5 text-left scale-75 origin-top-left">
        <div className="h-5 bg-gray-800 rounded w-2/3"></div>
        <div className="h-2.5 bg-gray-400 rounded w-1/2"></div>
        <div className="border-t-2 border-gray-400 my-3"></div>
        <div className="h-3 bg-gray-600 rounded w-1/4"></div>
        <div className="space-y-1.5">
          <div className="h-2 bg-gray-300 rounded w-full"></div>
          <div className="h-2 bg-gray-300 rounded w-full"></div>
          <div className="h-2 bg-gray-300 rounded w-5/6"></div>
        </div>
        <div className="h-3 bg-gray-600 rounded w-1/4 mt-3"></div>
        <div className="space-y-1.5">
          <div className="h-2 bg-gray-300 rounded w-full"></div>
          <div className="h-2 bg-gray-300 rounded w-4/5"></div>
        </div>
      </div>
    );
  }

  if (type === 'minimal') {
    return (
      <div className="space-y-4 text-left scale-75 origin-top-left">
        <div className="h-5 bg-gray-700 rounded w-1/2"></div>
        <div className="h-2 bg-gray-300 rounded w-1/3"></div>
        <div className="my-6 border-t border-gray-300"></div>
        <div className="h-3 bg-emerald-400 rounded w-1/5"></div>
        <div className="space-y-2">
          <div className="h-1.5 bg-gray-200 rounded w-full"></div>
          <div className="h-1.5 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="h-3 bg-emerald-400 rounded w-1/5 mt-5"></div>
        <div className="space-y-2">
          <div className="h-1.5 bg-gray-200 rounded w-full"></div>
          <div className="h-1.5 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (type === 'executive') {
    return (
      <div className="space-y-3 text-left scale-75 origin-top-left">
        <div className="h-7 bg-gradient-to-r from-purple-600 to-purple-800 rounded w-2/3"></div>
        <div className="h-3 bg-purple-300 rounded w-1/2"></div>
        <div className="bg-purple-100 p-3 rounded mt-3">
          <div className="h-2 bg-purple-400 rounded w-full mb-1.5"></div>
          <div className="h-2 bg-purple-400 rounded w-5/6"></div>
        </div>
        <div className="h-4 bg-purple-500 rounded w-1/3 mt-4"></div>
        <div className="flex gap-3">
          <div className="flex-1 bg-purple-50 p-2 rounded">
            <div className="h-2 bg-purple-300 rounded w-3/4"></div>
          </div>
          <div className="flex-1 bg-purple-50 p-2 rounded">
            <div className="h-2 bg-purple-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'creative') {
    return (
      <div className="space-y-3 text-left scale-75 origin-top-left">
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-orange-500 rounded w-2/3 mb-2"></div>
            <div className="h-2 bg-orange-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="h-6 bg-orange-200 rounded"></div>
          <div className="h-6 bg-orange-200 rounded"></div>
          <div className="h-6 bg-orange-200 rounded"></div>
        </div>
        <div className="h-3 bg-orange-400 rounded w-1/4 mt-4"></div>
        <div className="space-y-1.5">
          <div className="h-2 bg-gray-200 rounded w-full"></div>
          <div className="h-2 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (type === 'technical') {
    return (
      <div className="space-y-3 text-left scale-75 origin-top-left">
        <div className="h-5 bg-indigo-700 rounded w-2/3"></div>
        <div className="h-2 bg-indigo-300 rounded w-1/2"></div>
        <div className="grid grid-cols-4 gap-1.5 mt-3">
          <div className="h-4 bg-indigo-200 rounded"></div>
          <div className="h-4 bg-indigo-200 rounded"></div>
          <div className="h-4 bg-indigo-200 rounded"></div>
          <div className="h-4 bg-indigo-200 rounded"></div>
        </div>
        <div className="h-3 bg-indigo-500 rounded w-1/4 mt-4"></div>
        <div className="space-y-1.5">
          <div className="h-2 bg-gray-300 rounded w-full"></div>
          <div className="h-2 bg-gray-300 rounded w-5/6"></div>
        </div>
        <div className="flex gap-2 mt-2">
          <div className="h-5 bg-indigo-100 rounded flex-1"></div>
          <div className="h-5 bg-indigo-100 rounded flex-1"></div>
        </div>
      </div>
    );
  }

  return null;
}