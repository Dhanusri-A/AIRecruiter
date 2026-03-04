// src/steps/Step7Review.jsx
import React from 'react';
import { MapPin, Mail, Phone, Link, Edit2 } from 'lucide-react';

export default function Step7Review({ formData, goBack }) {
  const { 
    firstName, lastName, headline, email, phone, location,
    linkedin, github, portfolio, twitter,
    experiences, education, technicalSkills, summary,
    yearsOfExperience, noticePeriod, salaryCurrency, salaryMin, salaryMax,
    workType, languages
  } = formData;

  const profileStrength = calculateProfileStrength(formData);

  function calculateProfileStrength(data) {
    let score = 0;
    const weights = {
      basics: 15,
      headline: 10,
      summary: 15,
      experience: 20,
      education: 15,
      skills: 15,
      online: 10
    };

    if (data.firstName && data.lastName && data.email && data.phone) score += weights.basics;
    if (data.headline) score += weights.headline;
    if (data.summary && data.summary.length > 50) score += weights.summary;
    if (data.experiences && data.experiences.length > 0) score += weights.experience;
    if (data.education && data.education.length > 0) score += weights.education;
    if (data.technicalSkills && data.technicalSkills.length >= 3) score += weights.skills;
    if (data.linkedin || data.github) score += weights.online;

    return Math.min(100, score);
  }

  const suggestions = [];
  if (!summary || summary.length < 50) suggestions.push('Add a professional summary to make your profile stand out');
  if (!technicalSkills || technicalSkills.length < 5) suggestions.push('Add more technical skills (at least 5-8 recommended)');
  if (!linkedin && !github) suggestions.push('Connect your LinkedIn or GitHub profile for better matches');
  if (!experiences || experiences.length === 0) suggestions.push('Add at least one work experience');

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Review your profile
        </h2>
        <p className="text-gray-600">Make sure everything looks great before submitting</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left column - Profile preview */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex-shrink-0 flex items-center justify-center text-2xl font-bold text-emerald-700">
                {firstName?.[0]}{lastName?.[0]}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {firstName} {lastName}
                </h3>
                {headline && <p className="text-gray-600 mt-1">{headline}</p>}
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-sm text-gray-600">
                  {location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} /> {location}
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center gap-1.5">
                      <Mail size={16} /> {email}
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={16} /> +1 {phone}
                    </div>
                  )}
                </div>
                {(linkedin || github || portfolio || twitter) && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {linkedin && (
                      <div className="flex items-center gap-1.5 text-sm text-emerald-600">
                        <Link size={16} /> LinkedIn
                      </div>
                    )}
                    {github && (
                      <div className="flex items-center gap-1.5 text-sm text-emerald-600">
                        <Link size={16} /> GitHub
                      </div>
                    )}
                    {portfolio && (
                      <div className="flex items-center gap-1.5 text-sm text-emerald-600">
                        <Link size={16} /> Portfolio
                      </div>
                    )}
                    {twitter && (
                      <div className="flex items-center gap-1.5 text-sm text-emerald-600">
                        <Link size={16} /> Twitter
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {summary && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">Professional Summary</h4>
                <button className="text-emerald-600 hover:text-emerald-700">
                  <Edit2 size={16} />
                </button>
              </div>
              <p className="text-gray-600">{summary}</p>
            </div>
          )}

          {experiences && experiences.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">Experience</h4>
                <button className="text-emerald-600 hover:text-emerald-700">
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="space-y-5">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="border-l-2 border-emerald-200 pl-4">
                    <div className="font-medium text-gray-900">{exp.title || 'Job Title'}</div>
                    <div className="text-sm text-gray-600">
                      {exp.company || 'Company'} • {exp.startMonth} {exp.startYear} – {exp.current ? 'Present' : `${exp.endMonth} ${exp.endYear}`}
                    </div>
                    {exp.location && <div className="text-sm text-gray-500 mt-1">{exp.location}</div>}
                    {exp.description && (
                      <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {education && education.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">Education</h4>
                <button className="text-emerald-600 hover:text-emerald-700">
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="space-y-4">
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <div className="font-medium text-gray-900">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </div>
                    <div className="text-sm text-gray-600">
                      {edu.school} • {edu.startYear} – {edu.endYear}
                    </div>
                    {(edu.gpa || edu.honors) && (
                      <div className="text-sm text-gray-500 mt-1">
                        {edu.gpa && `GPA: ${edu.gpa}`}
                        {edu.gpa && edu.honors && ' • '}
                        {edu.honors}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {technicalSkills && technicalSkills.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">Technical Skills</h4>
                <button className="text-emerald-600 hover:text-emerald-700">
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {technicalSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(yearsOfExperience || noticePeriod || (salaryMin && salaryMax) || workType.length > 0) && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Preferences</h4>
              <div className="space-y-3 text-sm">
                {yearsOfExperience && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium">{yearsOfExperience}</span>
                  </div>
                )}
                {noticePeriod && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability</span>
                    <span className="font-medium">{noticePeriod}</span>
                  </div>
                )}
                {salaryMin && salaryMax && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Salary</span>
                    <span className="font-medium">{salaryCurrency} {salaryMin} - {salaryMax}</span>
                  </div>
                )}
                {workType.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Work Type</span>
                    <span className="font-medium">{workType.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Stats & Suggestions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Profile Strength</h4>
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-center">
              <div>
                <div className={`text-2xl font-bold ${
                  profileStrength >= 80 ? 'text-emerald-700' : 
                  profileStrength >= 50 ? 'text-amber-600' : 'text-orange-600'
                }`}>
                  {profileStrength}%
                </div>
                <div className="text-xs text-gray-600">Complete</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    profileStrength >= 80 ? 'bg-emerald-600' : 
                    profileStrength >= 50 ? 'bg-amber-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${profileStrength}%` }}
                />
              </div>
            </div>
          </div>

          {suggestions.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Suggestions</h4>
              <ul className="space-y-3 text-sm">
                {suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-amber-700">
                    <span className="mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Profile Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Work Experience</span>
                <span className="font-medium">{experiences?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Education</span>
                <span className="font-medium">{education?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Skills</span>
                <span className="font-medium">{technicalSkills?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Connected Profiles</span>
                <span className="font-medium">
                  {[linkedin, github, portfolio, twitter].filter(Boolean).length}
                </span>
              </div>
              {languages && languages.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Languages</span>
                  <span className="font-medium">{languages.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}