import React from "react";

export default function Select({ options, value, onChange, className = "" }) {
  return (
    <select
      className={`bg-muted/30 text-gray-100 rounded px-3 py-2 transition duration-300 ease-in-out ${className}`}
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
