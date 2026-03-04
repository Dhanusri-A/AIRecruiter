// screens/Candidate/components/CandidateMyInterviewCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, Briefcase, ChevronRight } from 'lucide-react';

export default function CandidateMyInterviewCard({ interview }) {
  const navigate = useNavigate();

  // Parse UTC time correctly
  const utcDate = new Date(`${interview.date}T${interview.time}Z`);

  // Format in user's local timezone (automatically uses browser's timezone)
  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(utcDate);

  const formattedTime = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(utcDate);

  const isUpcoming = utcDate > new Date();

  const handleClick = () => {
    navigate(`/candidate/my-interviews/${interview.id}`, { state: { interview } });
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 overflow-hidden group hover:border-blue-200"
    >
      <div className="p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
            {interview.job_title}
          </h3>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
        </div>

        <div className="space-y-3.5 text-sm">
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="h-4.5 w-4.5 text-blue-500 flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Clock className="h-4.5 w-4.5 text-blue-500 flex-shrink-0" />
            <span>
              {formattedTime} • {interview.duration}
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Video className="h-4.5 w-4.5 text-blue-500 flex-shrink-0" />
            <span className="line-clamp-1">
              {interview.interview_type} • {interview.meeting_location}
            </span>
          </div>

          {interview.notes && (
            <div className="flex items-start gap-3 text-gray-600">
              <Briefcase className="h-4.5 w-4.5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="line-clamp-2">{interview.notes}</p>
            </div>
          )}
        </div>

        <div className="pt-2">
          <span
            className={`inline-flex px-3.5 py-1 rounded-full text-xs font-medium ${
              isUpcoming
                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                : 'bg-gray-100 text-gray-600 border border-gray-200'
            }`}
          >
            {isUpcoming ? 'Upcoming' : 'Past'}
          </span>
        </div>
      </div>
    </div>
  );
}