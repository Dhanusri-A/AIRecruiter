"use client";

import { TextField } from "@mui/material";

export function ProfileForm({ formData, handleChange, errors }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Professional Summary</h3>
      <p className="text-sm text-slate-500 mb-4">
        Write a compelling summary that highlights your experience, skills, and career goals.
      </p>
      
      <div className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
        <TextField
          label="Professional Summary"
          name="profile"
          value={formData.profile || ""}
          onChange={(e) => handleChange(e, "profile")}
          variant="outlined"
          fullWidth
          multiline
          rows={8}
          placeholder="I am a passionate software developer with 3+ years of experience in building scalable web applications. Specialized in React, Node.js, and cloud technologies. I thrive in collaborative environments and am always eager to learn new technologies..."
          error={!!errors["profile"]}
          helperText={
            errors["profile"] ||
            `${(formData.profile || "").length}/1000 characters (minimum 10 required)`
          }
          InputProps={{
            className: "text-sm sm:text-base",
          }}
        />
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Tips for a great summary:</h4>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Start with your professional identity and years of experience</li>
          <li>Highlight your key skills and areas of expertise</li>
          <li>Mention notable achievements or projects</li>
          <li>Include your career goals or what you are looking for</li>
        </ul>
      </div>
    </div>
  );
}
