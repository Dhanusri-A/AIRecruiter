// screens/Candidate/pages/CandidateInterviewResult.jsx
// Simple completion screen — backend only returns { status: "success" }, no result data to display
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Star } from 'lucide-react';

export default function CandidateInterviewResult() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-10 text-center">

        {/* Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Interview Completed!</h1>
        <p className="text-gray-500 text-base mb-8 leading-relaxed">
          Thank you for completing your interview. Our team will review your responses and get back to you shortly.
        </p>

        {/* Info box */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 flex items-start gap-3 text-left">
          <Star className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-800">
            Your responses have been recorded and submitted for AI evaluation. You can view your score and feedback in{' '}
            <strong>My Interviews</strong> once the review is complete.
          </p>
        </div>

        {/* Action */}
        <button
          onClick={() => navigate('/candidate')}
          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-semibold text-lg flex items-center justify-center gap-2 shadow-md"
        >
          <Home className="w-5 h-5" />
          Back to My Interviews
        </button>
      </div>
    </div>
  );
}