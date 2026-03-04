"use client";

import { Button, IconButton } from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import { FormField } from "./FormField";

export function EducationForm({
  formData,
  handleChange,
  handleAddEducation,
  handleRemoveEducation,
  primaryColor = "#3b82f6",
  errors,
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Education Details</h3>
      
      {formData.education.map((edu, index) => (
        <div
          key={index}
          className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-base font-medium text-blue-600">
              Education {index + 1}
            </h4>
            {formData.education.length > 1 && (
              <IconButton
                size="small"
                onClick={() => handleRemoveEducation(index)}
                className="text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </IconButton>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Years (e.g., 2020-2024)"
              name="years"
              value={edu.years || ""}
              onChange={(e) => handleChange(e, "education", index)}
              error={errors[`education.${index}.years`] || errors[`education[${index}].years`]}
            />
            <FormField
              label="Institution Name"
              name="institution"
              value={edu.institution || ""}
              onChange={(e) => handleChange(e, "education", index)}
              error={errors[`education.${index}.institution`] || errors[`education[${index}].institution`]}
            />
            <FormField
              label="Degree/Program"
              name="degree"
              value={edu.degree || ""}
              onChange={(e) => handleChange(e, "education", index)}
              error={errors[`education.${index}.degree`] || errors[`education[${index}].degree`]}
            />
            <FormField
              label="Percentage/GPA"
              name="percentage"
              value={edu.percentage || ""}
              onChange={(e) => handleChange(e, "education", index)}
              error={errors[`education.${index}.percentage`] || errors[`education[${index}].percentage`]}
              placeholder="e.g., 85% or 8.5 CGPA"
            />
          </div>
        </div>
      ))}
      
      <Button
        fullWidth
        variant="contained"
        startIcon={<Plus className="w-4 h-4" />}
        onClick={handleAddEducation}
        className="!mt-4"
        style={{
          backgroundColor: primaryColor,
          color: "white",
          textTransform: "none",
          borderRadius: "0.75rem",
          padding: "0.75rem",
        }}
      >
        Add Another Education
      </Button>
    </div>
  );
}
