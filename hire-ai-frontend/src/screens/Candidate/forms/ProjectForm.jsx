"use client";

import { Button, IconButton } from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import { FormField } from "./FormField";

export function ProjectForm({
  formData,
  handleChange,
  handleAddProject,
  handleRemoveProject,
  primaryColor = "#3b82f6",
  errors,
}) {
  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Projects (Optional)</h3>
      
      {formData.projects?.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-slate-500 mb-4">No projects added yet</p>
          <Button
            variant="outlined"
            startIcon={<Plus className="w-4 h-4" />}
            onClick={handleAddProject}
            style={{
              color: primaryColor,
              borderColor: primaryColor,
              textTransform: "none",
            }}
          >
            Add Your First Project
          </Button>
        </div>
      )}
      
      {formData.projects?.map((project, index) => (
        <div
          key={index}
          className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-base font-medium text-blue-600">
              Project {index + 1}
            </h4>
            <IconButton
              size="small"
              onClick={() => handleRemoveProject(index)}
              className="text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </IconButton>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Project Name"
              name="title"
              value={project.title || ""}
              onChange={(e) => handleChange(e, "projects", index)}
              error={errors[`projects.${index}.title`] || errors[`projects[${index}].title`]}
            />
            <FormField
              label="Your Role"
              name="role"
              value={project.role || ""}
              onChange={(e) => handleChange(e, "projects", index)}
              error={errors[`projects.${index}.role`] || errors[`projects[${index}].role`]}
            />
            <FormField
              label="Year"
              name="year"
              value={project.year || ""}
              onChange={(e) => handleChange(e, "projects", index)}
              error={errors[`projects.${index}.year`] || errors[`projects[${index}].year`]}
              placeholder="e.g., 2024"
            />
          </div>
          
          <div className="mt-4">
            <FormField
              label="Project Description"
              name="description"
              value={project.description || ""}
              onChange={(e) => handleChange(e, "projects", index)}
              multiline
              rows={3}
              error={errors[`projects.${index}.description`] || errors[`projects[${index}].description`]}
              placeholder="Describe your project, technologies used, and your contributions..."
            />
          </div>
        </div>
      ))}
      
      {formData.projects?.length > 0 && (
        <Button
          fullWidth
          variant="contained"
          startIcon={<Plus className="w-4 h-4" />}
          onClick={handleAddProject}
          style={{
            backgroundColor: primaryColor,
            color: "white",
            textTransform: "none",
            borderRadius: "0.75rem",
            padding: "0.75rem",
          }}
        >
          Add Another Project
        </Button>
      )}
    </div>
  );
}
