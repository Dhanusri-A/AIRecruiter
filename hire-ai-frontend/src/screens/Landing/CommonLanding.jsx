// src/components/CommonLanding.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wand2,
  UserPlus,
  Upload,
  Target,
  FileEdit,
  Calendar,
  Bot,
  Users,
  Lock,
  ArrowRight,
} from 'lucide-react';
import logoImage from '../../assets/images/amz-logo.png'; // adjust path if needed

export function CommonLanding() {
  const navigate = useNavigate();

  const goToRecruiterSignIn = () => {
    navigate('/recruiter-signin');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="AMZ.AI" className="h-10 w-auto" />
            <span className="text-xl font-bold text-green-600">Hire AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={goToRecruiterSignIn}
              className="px-5 py-2.5 text-gray-700 hover:text-emerald-600 font-medium transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={goToRecruiterSignIn}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-semibold"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-6 bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="15" cy="15" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-emerald-100 text-lg mb-4 font-medium">AI-Powered Recruitment</p>
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Hire Smarter.<br />
            Shortlist Faster.<br />
            Recruit Better.
          </h1>
          <p className="text-xl text-emerald-50 mb-4 max-w-2xl mx-auto leading-relaxed">
            Automate parsing, matching, and interviews — build better pipelines with less effort.
          </p>
          <p className="text-base text-emerald-100 mb-10">
            Includes freemium — start free, upgrade for unlimited access.
          </p>

          <button
            onClick={goToRecruiterSignIn}
            className="px-10 py-5 bg-white text-emerald-700 rounded-lg hover:bg-gray-50 transition-all font-bold text-xl shadow-2xl inline-flex items-center gap-3 mb-3"
          >
            Get Started Free
          </button>

          <p className="text-sm text-emerald-100">
            No credit card required
          </p>

          <div className="flex items-center justify-center gap-2 mt-6 text-emerald-200 text-sm">
            <Lock className="w-4 h-4" />
            <span>Secured with end-to-end encryption</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <MinimalFeatureCard
              icon={<Wand2 className="w-7 h-7" />}
              title="Generate JD"
              tagline="Craft perfect, keyword-optimized job descriptions in seconds."
              description="Attract stronger candidates faster."
              badge="Freemium: Limited generations free"
              color="blue"
            />

            <MinimalFeatureCard
              icon={<UserPlus className="w-7 h-7" />}
              title="Create Profile"
              tagline="Turn basic info into polished, standout candidate profiles."
              description="AI suggests highlights for maximum impact."
              color="emerald"
            />

            <MinimalFeatureCard
              icon={<Upload className="w-7 h-7" />}
              title="Upload Resume"
              tagline="Drop any resume — AI handles the rest."
              description="Instant processing, no manual entry."
              color="purple"
            />

            <MinimalFeatureCard
              icon={<Target className="w-7 h-7" />}
              title="Resume Matcher"
              tagline="Auto-score and rank resumes against your JD."
              description="Focus on the best fits only."
              badge="Pro: Unlimited matching on paid plans"
              color="orange"
            />

            <MinimalFeatureCard
              icon={<FileEdit className="w-7 h-7" />}
              title="Reformatter"
              tagline="Clean messy resumes and make them ATS-ready."
              description="Consistent, professional views in one click."
              color="indigo"
            />

            <MinimalFeatureCard
              icon={<Calendar className="w-7 h-7" />}
              title="Schedule Interview"
              tagline="Smart scheduling with calendar sync and reminders."
              description="Eliminate endless emails and no-shows."
              color="teal"
            />

            <MinimalFeatureCard
              icon={<Bot className="w-7 h-7" />}
              title="AI Interview"
              tagline="Run tailored, unbiased AI-led interviews anytime."
              description="Get scores and insights for faster decisions."
              badge="Pro feature: Full access on upgrade"
              color="rose"
            />

            <MinimalFeatureCard
              icon={<Users className="w-7 h-7" />}
              title="Talent Pool"
              tagline="Manage all candidates with powerful search and filters."
              description="Build your pipeline, never lose a great candidate."
              color="cyan"
            />
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500 max-w-3xl mx-auto leading-relaxed">
              <span className="font-semibold text-gray-700">Freemium model:</span> Core tools free to start. Unlock unlimited usage, advanced AI, and team features with paid plans.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Ready to recruit smarter?</h2>
          <button
            onClick={goToRecruiterSignIn}
            className="px-10 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-bold text-lg inline-flex items-center gap-3 shadow-lg"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Secured with end-to-end encryption</span>
            </div>
            <span className="hidden md:inline">|</span>
            <span>© 2026 AMZ.AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Reusable Minimal Feature Card (unchanged)
function MinimalFeatureCard({ icon, title, tagline, description, badge, color }) {
  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    teal: 'bg-teal-100 text-teal-600',
    rose: 'bg-rose-100 text-rose-600',
    cyan: 'bg-cyan-100 text-cyan-600',
  };

  const colorClasses = colorMap[color] || colorMap.emerald;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
      <div
        className={`w-16 h-16 ${colorClasses} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm font-semibold text-gray-700 mb-3">{tagline}</p>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      {badge && (
        <div className="mt-2 text-xs text-gray-500">
          <span className="font-semibold">Note:</span> {badge}
        </div>
      )}
    </div>
  );
}