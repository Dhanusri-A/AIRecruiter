"use client";

import { FormField } from "./FormField";

export function BasicDetailsForm({ formData, handleChange, errors }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Basic Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Professional Title"
          name="title"
          value={formData.title || ""}
          onChange={(e) => handleChange(e, "title")}
          error={errors["title"]}
          placeholder="e.g., Full Stack Developer"
        />
        <FormField
          label="Mobile Number"
          name="phone"
          value={formData.contact?.phone || ""}
          onChange={(e) => handleChange(e, "contact.phone")}
          error={errors["contact.phone"]}
          placeholder="+91 98765 43210"
        />
        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={formData.contact?.email || ""}
          onChange={(e) => handleChange(e, "contact.email")}
          error={errors["contact.email"]}
          placeholder="your@email.com"
        />
        <FormField
          label="Location"
          name="location"
          value={formData.contact?.location || ""}
          onChange={(e) => handleChange(e, "contact.location")}
          error={errors["contact.location"]}
          placeholder="City, State"
        />
        <FormField
          label="Pincode"
          name="pincode"
          value={formData.contact?.pincode || ""}
          onChange={(e) => handleChange(e, "contact.pincode")}
          error={errors["contact.pincode"]}
          placeholder="641001"
        />
        <FormField
          label="LinkedIn Profile (Optional)"
          name="linkedin"
          value={formData.contact?.linkedin || ""}
          onChange={(e) => handleChange(e, "contact.linkedin")}
          error={errors["contact.linkedin"]}
          placeholder="https://linkedin.com/in/yourprofile"
        />
        <FormField
          label="GitHub Profile (Optional)"
          name="github"
          value={formData.contact?.github || ""}
          onChange={(e) => handleChange(e, "contact.github")}
          error={errors["contact.github"]}
          placeholder="https://github.com/yourusername"
        />
      </div>
    </div>
  );
}
