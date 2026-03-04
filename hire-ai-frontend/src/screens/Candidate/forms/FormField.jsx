"use client";

import { TextField } from "@mui/material";

export function FormField({
  label,
  name,
  value,
  onChange,
  className = "",
  error,
  multiline,
  rows,
  type = "text",
  placeholder,
}) {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      variant="outlined"
      size="small"
      fullWidth
      type={type}
      placeholder={placeholder}
      className={`text-sm sm:text-base ${className}`}
      InputProps={{ className: "text-sm sm:text-base" }}
      error={!!error}
      helperText={error}
      multiline={multiline}
      rows={rows}
    />
  );
}
