"use client";

import { Stepper, Step, StepLabel } from "@mui/material";
import { User, GraduationCap, Wrench, UserCircle, Briefcase } from "lucide-react";
import React from "react";

const steps = [
  { label: "Basic Details", icon: <User className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: "Education", icon: <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: "Skills", icon: <Wrench className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: "Profile", icon: <UserCircle className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: "Experience", icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" /> },
];

export function FormStepper({ activeStep, primaryColor = "#3b82f6" }) {
  return (
    <div className="py-4 px-2 sm:py-6 sm:px-8 bg-slate-50 rounded-xl">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel
              className="px-1 sm:px-2"
              StepIconComponent={() => (
                <div
                  className={`rounded-full p-2 transition-all duration-300 ${
                    index <= activeStep
                      ? "text-white shadow-lg"
                      : "text-slate-400 bg-slate-200"
                  }`}
                  style={{
                    backgroundColor: index <= activeStep ? primaryColor : undefined,
                  }}
                >
                  {step.icon}
                </div>
              )}
            >
              <span className="text-xs sm:text-sm mt-2 font-medium text-slate-600">
                {step.label}
              </span>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
