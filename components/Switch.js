import React from "react";

export default function Switch({ checked, onChange, label, className = "" }) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
      <span className="text-sm select-none">{label}</span>
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <span className="w-10 h-6 flex items-center bg-gray-700 rounded-full p-1 duration-300 peer-checked:bg-primary">
        <span className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${checked ? 'translate-x-4' : ''}`}></span>
      </span>
    </label>
  );
}
