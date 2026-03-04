import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Search, Filter, Clock, Video, MapPin, Users, X, Check, AlertCircle, Send, Copy, Calendar as CalendarIcon, Download, Mail, ExternalLink, Sparkles } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { createInterview, getRecruiterInterviews } from '../../../api/api';
import RecruiterScheduleInterviewModal from './RecruiterScheduleInterviewModal';
import RecruiterScheduleInterviewDetailPanel from './RecruiterScheduleInterviewDetailPanel';

// ─── Types ────────────────────────────────────────────────────────────────────
// interview_type: 'Online' | 'Onsite' | 'Phone' | etc.
// status derived: if scores !== null => 'completed', else 'pending'

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getWeekStart(date) {
  const d = new Date(date);
  const diff = d.getDate() - d.getDay();
  return new Date(d.setDate(diff));
}

export function isSameDay(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export function formatHour(hour) {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:00 ${period}`;
}

export function getInterviewTypeColor(type) {
  const t = (type || '').toLowerCase();
  if (t === 'screening') return { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-500' };
  if (t === 'technical') return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-500' };
  if (t === 'panel') return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-500' };
  if (t === 'final') return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-500' };
  if (t === 'online') return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-500' };
  if (t === 'onsite') return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-500' };
  if (t === 'phone') return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-500' };
  return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-500' };
}

export function deriveStatus(interview) {
  if (interview.scores !== null && interview.scores !== undefined) return 'completed';
  return 'pending';
}

/**
 * parseInterviewDate
 *
 * The backend stores date/time in UTC (matching how the modal sends them —
 * it converts local → UTC before posting). We must parse them as UTC so the
 * browser can convert to the viewer's local timezone automatically.
 *
 * WITHOUT the trailing "Z": new Date("2026-02-19T11:13:13")
 *   → treated as LOCAL time  ← WRONG, shows UTC time as if it were local
 *
 * WITH the trailing "Z":    new Date("2026-02-19T11:13:13Z")
 *   → treated as UTC        ← CORRECT, browser converts to local timezone
 */
export function parseInterviewDate(interview) {
  const raw = `${interview.date}T${interview.time}`;

  // If the string already ends with Z or contains a timezone offset, use as-is.
  // Otherwise append Z to mark it as UTC.
  const utcStr = /Z|[+-]\d{2}:?\d{2}$/.test(raw) ? raw : `${raw}Z`;

  const d = new Date(utcStr);
  return isNaN(d.getTime()) ? new Date() : d;
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────
export function StatusBadge({ status, compact }) {
  const config = {
    confirmed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Confirmed', icon: Check },
    pending:   { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending', icon: Clock },
    declined:  { bg: 'bg-red-100', text: 'text-red-700', label: 'Declined', icon: X },
    completed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Completed', icon: Check },
    'no-show': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'No-show', icon: AlertCircle },
  };

  const cfg = config[status] || config['pending'];
  const { bg, text, label, icon: Icon } = cfg;

  if (compact) {
    return <span className={`w-2 h-2 rounded-full inline-block ${bg}`} title={label} />;
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

// ─── TypeBadge ────────────────────────────────────────────────────────────────
export function TypeBadge({ type }) {
  const colors = getInterviewTypeColor(type);
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      {type}
    </span>
  );
}

// ─── InterviewCard ────────────────────────────────────────────────────────────
export function InterviewCard({ interview, onClick, compact }) {
  const colors = getInterviewTypeColor(interview.interview_type);
  const status = deriveStatus(interview);
  const date   = parseInterviewDate(interview); // ← now correctly in local TZ

  return (
    <button
      onClick={onClick}
      className={`w-full text-left ${colors.bg} border-l-4 ${colors.border} rounded-lg p-3 hover:shadow-md transition-all group`}
    >
      <div className="flex items-start justify-between mb-1">
        <div className={`text-sm font-bold ${colors.text} truncate flex-1`}>
          {interview.candidate_name}
        </div>
        <StatusBadge status={status} compact />
      </div>
      {!compact && (
        <>
          <div className="text-xs text-gray-600 mb-2 truncate">{interview.job_title}</div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {/* toLocaleTimeString uses the browser's local timezone automatically */}
            <span>{date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
            <span>•</span>
            <span>{interview.duration}</span>
          </div>
        </>
      )}
    </button>
  );
}

// ─── WeekView ─────────────────────────────────────────────────────────────────
function WeekView({ currentDate, interviews, onInterviewClick }) {
  const weekStart = getWeekStart(currentDate);
  const days  = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });
  const hours = Array.from({ length: 12 }, (_, i) => i + 8);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="p-4 border-r border-gray-200 bg-gray-50" />
        {days.map((day, index) => {
          const isToday = isSameDay(day, new Date());
          return (
            <div key={index} className={`p-4 text-center border-r border-gray-200 ${isToday ? 'bg-emerald-50' : 'bg-gray-50'}`}>
              <div className="text-xs font-medium text-gray-600 uppercase mb-1">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={`text-lg font-bold ${isToday ? 'text-emerald-600' : 'text-gray-900'}`}>
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>
      <div className="overflow-y-auto max-h-[600px]">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-200 min-h-[80px]">
            <div className="p-2 border-r border-gray-200 bg-gray-50 text-sm font-medium text-gray-600">
              {formatHour(hour)}
            </div>
            {days.map((day, dayIndex) => {
              const dayInterviews = interviews.filter((iv) => {
                const d = parseInterviewDate(iv); // local TZ
                return isSameDay(d, day) && d.getHours() === hour;
              });
              return (
                <div key={dayIndex} className="p-2 border-r border-gray-200 hover:bg-gray-50 transition-colors">
                  {dayInterviews.map((iv) => (
                    <InterviewCard key={iv.id} interview={iv} onClick={() => onInterviewClick(iv)} compact />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DayView ──────────────────────────────────────────────────────────────────
function DayView({ currentDate, interviews, onInterviewClick }) {
  const hours        = Array.from({ length: 12 }, (_, i) => i + 8);
  const dayInterviews = interviews.filter((iv) => isSameDay(parseInterviewDate(iv), currentDate));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-y-auto max-h-[700px]">
        {hours.map((hour) => {
          const hourInterviews = dayInterviews.filter((iv) => parseInterviewDate(iv).getHours() === hour);
          return (
            <div key={hour} className="flex border-b border-gray-200 min-h-[100px]">
              <div className="w-24 p-4 border-r border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="text-sm font-medium text-gray-600">{formatHour(hour)}</div>
              </div>
              <div className="flex-1 p-4 space-y-2">
                {hourInterviews.map((iv) => (
                  <InterviewCard key={iv.id} interview={iv} onClick={() => onInterviewClick(iv)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MonthView ────────────────────────────────────────────────────────────────
function MonthView({ currentDate, interviews, onInterviewClick }) {
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd   = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate  = getWeekStart(monthStart);
  const endDate    = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const days = [];
  let curr = new Date(startDate);
  while (curr <= endDate) { days.push(new Date(curr)); curr.setDate(curr.getDate() + 1); }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
          <div key={d} className="p-3 text-center border-r border-gray-200 last:border-r-0">
            <div className="text-sm font-semibold text-gray-700">{d}</div>
          </div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 border-b border-gray-200">
          {week.map((day, di) => {
            const isToday        = isSameDay(day, new Date());
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const dayInterviews  = interviews.filter((iv) => isSameDay(parseInterviewDate(iv), day));
            return (
              <div key={di} className={`min-h-[120px] p-2 border-r border-gray-200 last:border-r-0 ${!isCurrentMonth ? 'bg-gray-50' : ''}`}>
                <div className={`text-sm font-semibold mb-2 ${isToday ? 'inline-flex items-center justify-center w-6 h-6 bg-emerald-600 text-white rounded-full' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayInterviews.slice(0, 3).map((iv) => {
                    const colors = getInterviewTypeColor(iv.interview_type);
                    const d      = parseInterviewDate(iv); // local TZ
                    return (
                      <button key={iv.id} onClick={() => onInterviewClick(iv)}
                        className={`w-full text-left px-2 py-1 rounded text-xs font-medium transition-colors ${colors.bg} ${colors.text} hover:opacity-80`}>
                        <div className="truncate">
                          {d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} {iv.candidate_name}
                        </div>
                      </button>
                    );
                  })}
                  {dayInterviews.length > 3 && (
                    <div className="text-xs text-gray-500 px-2">+{dayInterviews.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── AgendaView ───────────────────────────────────────────────────────────────
function AgendaView({ interviews, onInterviewClick }) {
  const sorted  = [...interviews].sort((a, b) => parseInterviewDate(a) - parseInterviewDate(b));
  const grouped = sorted.reduce((acc, iv) => {
    // Group by the LOCAL date string so IST dates group correctly
    const key = parseInterviewDate(iv).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });
    if (!acc[key]) acc[key] = [];
    acc[key].push(iv);
    return acc;
  }, {});

  if (Object.keys(grouped).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No interviews scheduled</h3>
        <p className="text-gray-600">Schedule your first interview to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, dayInterviews]) => (
        <div key={date} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3">
            <h3 className="font-bold text-lg">{date}</h3>
            <p className="text-sm text-emerald-100">{dayInterviews.length} interview{dayInterviews.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="divide-y divide-gray-200">
            {dayInterviews.map((iv) => {
              const d      = parseInterviewDate(iv); // local TZ
              const status = deriveStatus(iv);
              return (
                <div key={iv.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onInterviewClick(iv)}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-20 text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </div>
                      <div className="text-xs text-gray-500">{iv.duration}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 mb-1">{iv.candidate_name}</h4>
                          <p className="text-sm text-gray-600">{iv.job_title}</p>
                          <p className="text-xs text-gray-500">{iv.candidate_email}</p>
                        </div>
                        <StatusBadge status={status} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          <span>{iv.meeting_location}</span>
                        </div>
                      </div>
                      <TypeBadge type={iv.interview_type} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RecruiterScheduleInterview() {
  const { user } = useAuth();
  const [viewMode, setViewMode]               = useState('week');
  const [currentDate, setCurrentDate]         = useState(new Date());
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showFilters, setShowFilters]         = useState(false);
  const [searchQuery, setSearchQuery]         = useState('');
  const [filterType, setFilterType]           = useState('all');
  const [filterStatus, setFilterStatus]       = useState('all');
  const [interviews, setInterviews]           = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);

  const fetchInterviews = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getRecruiterInterviews(user.id);
      setInterviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch interviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInterviews(); }, [user?.id]);

  const handlePreviousPeriod = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() - 1);
    else if (viewMode === 'week') d.setDate(d.getDate() - 7);
    else if (viewMode === 'day') d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const handleNextPeriod = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() + 1);
    else if (viewMode === 'week') d.setDate(d.getDate() + 7);
    else if (viewMode === 'day') d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const filteredInterviews = interviews.filter((iv) => {
    const matchesSearch =
      iv.candidate_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iv.job_title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType   = filterType === 'all' || (iv.interview_type || '').toLowerCase() === filterType.toLowerCase();
    const status        = deriveStatus(iv);
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleScheduleNew = async (payload) => {
    try {
      await createInterview(payload);
      setShowScheduleModal(false);
      fetchInterviews();
    } catch (err) {
      alert(err.message || 'Failed to schedule interview');
    }
  };

  const headerTitle = () => {
    if (viewMode === 'month') return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (viewMode === 'week')  return `Week of ${getWeekStart(currentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    if (viewMode === 'day')   return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Interview Scheduler</h1>
              <p className="text-gray-600">
                {filteredInterviews.length} interview{filteredInterviews.length !== 1 ? 's' : ''} scheduled
                {' '}· Times shown in <span className="font-medium text-emerald-700">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search candidates or roles..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-64"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 border rounded-lg font-medium transition-all flex items-center gap-2 ${showFilters ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Schedule Interview
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Type:</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500">
                  <option value="all">All Types</option>
                  <option value="online">Online</option>
                  <option value="onsite">Onsite</option>
                  <option value="phone">Phone</option>
                  <option value="screening">Screening</option>
                  <option value="technical">Technical</option>
                  <option value="panel">Panel</option>
                  <option value="final">Final</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500">
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={handlePreviousPeriod} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 min-w-[200px] text-center">{headerTitle()}</h2>
              <button onClick={handleNextPeriod} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                Today
              </button>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {['month', 'week', 'day', 'agenda'].map((mode) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className={`px-4 py-1.5 rounded-md font-medium text-sm transition-all capitalize ${viewMode === mode ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading interviews...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 font-medium">{error}</p>
            <button onClick={fetchInterviews}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
              Retry
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'week'   && <WeekView   currentDate={currentDate} interviews={filteredInterviews} onInterviewClick={(iv) => { setSelectedInterview(iv); setShowDetailPanel(true); }} />}
            {viewMode === 'day'    && <DayView    currentDate={currentDate} interviews={filteredInterviews} onInterviewClick={(iv) => { setSelectedInterview(iv); setShowDetailPanel(true); }} />}
            {viewMode === 'month'  && <MonthView  currentDate={currentDate} interviews={filteredInterviews} onInterviewClick={(iv) => { setSelectedInterview(iv); setShowDetailPanel(true); }} />}
            {viewMode === 'agenda' && <AgendaView interviews={filteredInterviews} onInterviewClick={(iv) => { setSelectedInterview(iv); setShowDetailPanel(true); }} />}
          </>
        )}
      </div>

      {/* Modals */}
      {showScheduleModal && (
        <RecruiterScheduleInterviewModal
          onClose={() => setShowScheduleModal(false)}
          onSchedule={handleScheduleNew}
        />
      )}
      {showDetailPanel && selectedInterview && (
        <RecruiterScheduleInterviewDetailPanel
          interview={selectedInterview}
          onClose={() => { setShowDetailPanel(false); setSelectedInterview(null); }}
        />
      )}
    </div>
  );
}