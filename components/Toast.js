import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

const toastVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function Toast({ message, type = "info", onClose }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={toastVariants}
      className={clsx(
        "rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 min-w-[220px] text-sm font-medium",
        "backdrop-blur border border-gray-700",
        type === "success" && "bg-green-700/90 text-white border-green-500",
        type === "error" && "bg-red-700/90 text-white border-red-500",
        type === "info" && "bg-gray-800/90 text-white border-gray-600"
      )}
      role="status"
      aria-live="polite"
    >
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 p-1 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          aria-label="Fermer la notification"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}
