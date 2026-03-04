// screens/Candidate/pages/CandidateMyInterviewDetails.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  Briefcase,
  ArrowLeft,
  ExternalLink,
  Play,
} from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import toast from 'react-hot-toast';

export default function CandidateMyInterviewDetails() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(state?.interview);
  const [timeLeft, setTimeLeft] = useState('');
  const [isUpcoming, setIsUpcoming] = useState(false);

  useEffect(() => {
    if (!interview) {
      toast.error('Interview details not found');
      navigate('/candidate');
      return;
    }

    // Parse UTC date + time from backend
    const utcString = `${interview.date}T${interview.time}Z`;
    const interviewDateTime = new Date(utcString);

    // Check if upcoming
    const now = new Date();
    setIsUpcoming(interviewDateTime > now);

    if (interviewDateTime > now) {
      const updateTimer = () => {
        setTimeLeft(formatDistanceToNowStrict(interviewDateTime, { addSuffix: true }));
      };
      updateTimer();
      const interval = setInterval(updateTimer, 30000);
      return () => clearInterval(interval);
    }
  }, [interview, navigate]);

  const handleStartAIInterview = () => {
    navigate(`/candidate/ai-interview/${interview.id}`, { state: { interview } });
  };

  const handleJoinMeeting = () => {
    let url = '';
    const platform = interview.meeting_location?.toLowerCase() || '';

    if (platform.includes('meet') || platform.includes('google')) {
      url = 'https://meet.google.com';
    } else if (platform.includes('zoom')) {
      url = 'https://zoom.us/join';
    } else if (platform.includes('teams') || platform.includes('microsoft')) {
      url = 'https://teams.microsoft.com';
    } else if (interview.meeting_location?.startsWith('http')) {
      url = interview.meeting_location;
    } else {
      url = `https://${interview.meeting_location}`;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success('Opening meeting link...');
  };

  if (!interview) return null;

  // ── Convert UTC to candidate's LOCAL time zone ────────────────────────────────
  const utcDateTime = new Date(`${interview.date}T${interview.time}Z`);

  // Full local date + weekday + time + timezone name (e.g. "Monday, 10 March 2026, 2:30 pm IST")
  const formattedLocalDateTime = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',           // shows IST, PST, etc.
  }).format(utcDateTime);

  // Just time part (e.g. "2:30 pm")
  const formattedLocalTime = new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(utcDateTime);

  // Relative time for countdown / past info
  const relativeTime = formatDistanceToNowStrict(utcDateTime, {
    addSuffix: true,
  });

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Back button */}
      <button
        onClick={() => navigate('/candidate')}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors group"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        Back to My Interviews
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 md:p-12 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            {interview.job_title} Interview
          </h1>
          <p className="text-blue-100 text-lg md:text-xl opacity-90">
            {interview.interview_type} • {formattedLocalDateTime}
          </p>
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-10 lg:p-12 space-y-9">
          <div className="flex items-start gap-5">
            <Calendar className="h-7 w-7 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Date</h3>
              <p className="text-gray-700 mt-1.5 text-base">
                {formattedLocalDateTime.split(', ')[0]}, {formattedLocalDateTime.split(', ').slice(1).join(', ')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5">
            <Clock className="h-7 w-7 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Time & Duration</h3>
              <p className="text-gray-700 mt-1.5 text-base">
                {formattedLocalTime} • {interview.duration}
              </p>
              <p className="text-sm text-emerald-600 font-medium mt-1">
                {isUpcoming ? `Starts ${relativeTime}` : `Happened ${relativeTime}`}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5">
            <Video className="h-7 w-7 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Platform</h3>
              <p className="text-gray-700 mt-1.5 text-base">
                {interview.interview_type} • {interview.meeting_location}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5">
            <Briefcase className="h-7 w-7 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Notes</h3>
              <p className="text-gray-700 mt-1.5 whitespace-pre-line leading-relaxed">
                {interview.notes || 'No additional notes provided.'}
              </p>
            </div>
          </div>

          {!isUpcoming && (
            <div className="mt-8 p-5 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <p className="text-gray-700">
                This interview has been completed. Results will be shared with you separately by the recruiter.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 bg-white p-8 md:p-12">
          {isUpcoming ? (
            <div className="flex flex-col sm:flex-row gap-5 justify-center max-w-2xl mx-auto">
              <button
                onClick={handleStartAIInterview}
                className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
              >
                <Play className="h-6 w-6" />
                Start AI Interview
              </button>

              <button
                onClick={handleJoinMeeting}
                className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
              >
                Join Live Meeting
                <ExternalLink className="h-6 w-6" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl font-medium text-gray-700">
                This interview has already taken place
              </p>
              <p className="text-gray-500 mt-3">
                {relativeTime}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}