"use client";

import { useState } from "react";
import { Button, TextField, Chip } from "@mui/material";
import { X, Plus } from "lucide-react";

export function SkillsForm({
  formData,
  handleSkillChange,
  handleRemoveSkill,
  primaryColor = "#3b82f6",
  errors,
}) {
  const [newSkills, setNewSkills] = useState({
    skills: "",
    languages: "",
  });

  const handleInputChange = (e, skillType) => {
    setNewSkills((prev) => ({ ...prev, [skillType]: e.target.value }));
  };

  const handleAddSkill = (skillType) => {
    if (newSkills[skillType].trim()) {
      handleSkillChange(skillType, newSkills[skillType].trim());
      setNewSkills((prev) => ({ ...prev, [skillType]: "" }));
    }
  };

  const handleKeyPress = (e, skillType) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill(skillType);
    }
  };

  const renderSkillSection = (title, skillType, placeholder) => (
    <div className="mb-6 p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
      <h4 className="text-base font-medium mb-4 text-slate-800">{title}</h4>
      
      {/* Skill chips */}
      <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
        {formData[skillType]?.length === 0 && (
          <span className="text-sm text-slate-400 italic">No {skillType} added yet</span>
        )}
        {formData[skillType]?.map((skill, index) => (
          <Chip
            key={index}
            label={skill}
            onDelete={() => handleRemoveSkill(skillType, index)}
            deleteIcon={<X className="w-3 h-3" />}
            className="!bg-blue-50 !text-blue-700 hover:!bg-blue-100 transition-colors"
            sx={{
              "& .MuiChip-deleteIcon": {
                color: primaryColor,
                "&:hover": { color: "#1d4ed8" },
              },
            }}
          />
        ))}
      </div>
      
      {/* Add skill input */}
      <div className="flex gap-2">
        <TextField
          label={`Add ${title}`}
          value={newSkills[skillType]}
          onChange={(e) => handleInputChange(e, skillType)}
          onKeyPress={(e) => handleKeyPress(e, skillType)}
          variant="outlined"
          size="small"
          className="flex-grow"
          placeholder={placeholder}
          error={!!errors[skillType]}
          helperText={errors[skillType]}
        />
        <Button
          variant="contained"
          onClick={() => handleAddSkill(skillType)}
          style={{
            backgroundColor: primaryColor,
            minWidth: "auto",
            padding: "8px 16px",
          }}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Skills & Languages</h3>
      {renderSkillSection("Technical Skills", "skills", "e.g., React, Node.js, Python")}
      {renderSkillSection("Languages", "languages", "e.g., English, Hindi, Tamil")}
    </div>
  );
}
