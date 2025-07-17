import React from "react";

export default function Toggle({ checked, onChange, label, className = "" }) {
  return (
    <label className={`flex items-center cursor-pointer gap-3 ${className}`}>
      <span className="text-sm select-none">{label}</span>
      <span className="relative inline-block w-11 h-6">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
        />
        <span className="block w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-primary transition-all duration-300"></span>
        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-all duration-300"></span>
      </span>
    </label>
  );
}
