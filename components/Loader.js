import { motion } from "framer-motion";

export default function Loader({ label = "Chargement..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <motion.div
        className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"
        aria-label={label}
        role="status"
      />
      <span className="mt-2 text-gray-300 text-sm">{label}</span>
    </div>
  );
}
