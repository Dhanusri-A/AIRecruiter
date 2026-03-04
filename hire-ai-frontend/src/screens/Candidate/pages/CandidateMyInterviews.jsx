// screens/Candidate/pages/CandidateMyInterviews.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext'; // adjust path
import { getCandidateInterviews } from '../../../api/api'; // adjust path
import CandidateMyInterviewCard from '../components/CandidateMyInterviewCard';
import { Calendar, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function CandidateMyInterviews() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user?.id) return;

      try {
        const data = await getCandidateInterviews(user.id);

        // Sort by date/time ascending (upcoming first)
        const sorted = data.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}Z`); // Treat as UTC
          const dateB = new Date(`${b.date}T${b.time}Z`);
          return dateA - dateB;
        });

        setInterviews(sorted);
      } catch (err) {
        setError(err.message || 'Failed to load interviews');
        toast.error(err.message || 'Failed to load interviews');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Interviews</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            My Interviews
          </h1>
          <p className="mt-1 text-gray-600">
            View and prepare for your upcoming interviews
          </p>
        </div>
        <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
          <Calendar className="h-5 w-5" />
          <span className="text-sm font-medium">
            {interviews.length} scheduled
          </span>
        </div>
      </div>

      {interviews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No Upcoming Interviews
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Apply to more jobs to schedule interviews. Check back soon!
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Jobs
          </button>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {interviews.map((interview, index) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <CandidateMyInterviewCard interview={interview} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}