import React from "react";

export default function Card({ title, children, className = "" }) {
  return (
    <section className={`bg-white border border-gray-200 text-gray-900 p-6 rounded-2xl shadow-card mb-6 transition-all duration-300 hover:shadow-card-hover ${className}`}>
      {title && <h2 className="text-xl font-bold mb-4 tracking-tight text-primary">{title}</h2>}
      {children}
    </section>
  );
}
