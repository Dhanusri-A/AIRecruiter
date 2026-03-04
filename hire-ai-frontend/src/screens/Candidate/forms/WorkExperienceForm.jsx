"use client";

import { Button, IconButton } from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import { FormField } from "./FormField";
import { ProjectForm } from "./ProjectForm";

export function WorkExperienceForm({
  formData,
  handleChange,
  handleAddWorkExperience,
  handleRemoveWorkExperience,
  handleAddProject,
  handleRemoveProject,
  primaryColor = "#3b82f6",
  setFormData,
  errors,
}) {
  const handleAddResponsibility = (workIndex) => {
    setFormData((prevData) => {
      const updatedWork = [...prevData.workExperience];
      updatedWork[workIndex].responsibilities.push("");
      return { ...prevData, workExperience: updatedWork };
    });
  };

  const handleRemoveResponsibility = (workIndex, respIndex) => {
    setFormData((prevData) => {
      const updatedWork = [...prevData.workExperience];
      updatedWork[workIndex].responsibilities = updatedWork[
        workIndex
      ].responsibilities.filter((_, i) => i !== respIndex);
      return { ...prevData, workExperience: updatedWork };
    });
  };

  const handleResponsibilityChange = (e, workIndex, respIndex) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const updatedWork = [...prevData.workExperience];
      updatedWork[workIndex].responsibilities[respIndex] = value;
      return { ...prevData, workExperience: updatedWork };
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Work Experience</h3>
        
        {formData.workExperience.map((work, index) => (
          <div
            key={index}
            className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow mb-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base font-medium text-blue-600">
                Experience {index + 1}
              </h4>
              {formData.workExperience.length > 1 && (
                <IconButton
                  size="small"
                  onClick={() => handleRemoveWorkExperience(index)}
                  className="text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </IconButton>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Company Name"
                name="company"
                value={work.company || ""}
                onChange={(e) => handleChange(e, "workExperience", index)}
                error={errors[`workExperience.${index}.company`] || errors[`workExperience[${index}].company`]}
              />
              <FormField
                label="Role/Position"
                name="role"
                value={work.role || ""}
                onChange={(e) => handleChange(e, "workExperience", index)}
                error={errors[`workExperience.${index}.role`] || errors[`workExperience[${index}].role`]}
              />
              <FormField
                label="Duration"
                name="duration"
                value={work.duration || ""}
                onChange={(e) => handleChange(e, "workExperience", index)}
                error={errors[`workExperience.${index}.duration`] || errors[`workExperience[${index}].duration`]}
                placeholder="e.g., Jan 2022 - Present"
              />
            </div>
            
            {/* Responsibilities */}
            <div className="mt-4">
              <h5 className="text-sm font-medium text-slate-700 mb-3">Key Responsibilities</h5>
              {work.responsibilities.map((resp, respIndex) => (
                <div key={respIndex} className="flex gap-2 mb-2">
                  <FormField
                    label={`Responsibility ${respIndex + 1}`}
                    value={resp}
                    onChange={(e) => handleResponsibilityChange(e, index, respIndex)}
                    className="flex-grow"
                    error={errors[`workExperience.${index}.responsibilities.${respIndex}`] || errors[`workExperience[${index}].responsibilities[${respIndex}]`]}
                  />
                  {work.responsibilities.length > 1 && (
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveResponsibility(index, respIndex)}
                      className="self-start mt-1"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </IconButton>
                  )}
                </div>
              ))}
              <Button
                variant="outlined"
                size="small"
                startIcon={<Plus className="w-3 h-3" />}
                onClick={() => handleAddResponsibility(index)}
                style={{ 
                  color: primaryColor, 
                  borderColor: primaryColor,
                  textTransform: "none",
                  marginTop: "0.5rem",
                }}
              >
                Add Responsibility
              </Button>
            </div>
          </div>
        ))}
        
        <Button
          fullWidth
          variant="contained"
          startIcon={<Plus className="w-4 h-4" />}
          onClick={handleAddWorkExperience}
          style={{
            backgroundColor: primaryColor,
            color: "white",
            textTransform: "none",
            borderRadius: "0.75rem",
            padding: "0.75rem",
          }}
        >
          Add Work Experience
        </Button>
      </div>
      
      {/* Projects Section */}
      <ProjectForm
        formData={formData}
        handleChange={handleChange}
        handleAddProject={handleAddProject}
        handleRemoveProject={handleRemoveProject}
        primaryColor={primaryColor}
        errors={errors}
      />
    </div>
  );
}
