import React from "react";

export default function Textarea({ value, onChange, placeholder = "", className = "", ...props }) {
  return (
    <textarea
      className={`bg-muted/30 text-gray-100 rounded px-3 py-2 transition duration-300 ease-in-out ${className}`}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      {...props}
    />
  );
}
