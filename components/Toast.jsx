import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TOAST_TYPES = {
  success: {
    icon: '✅',
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    borderColor: 'border-green-600'
  },
  error: {
    icon: '❌',
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    borderColor: 'border-red-600'
  },
  info: {
    icon: 'ℹ️',
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    borderColor: 'border-blue-600'
  },
  warning: {
    icon: '⚠️',
    bgColor: 'bg-yellow-500',
    textColor: 'text-white',
    borderColor: 'border-yellow-600'
  }
};

export default function Toast({ 
  message, 
  type = 'info', 
  duration = 4000, 
  onClose,
  position = 'top-right' 
}) {
  const [isVisible, setIsVisible] = useState(true);
  const toastConfig = TOAST_TYPES[type] || TOAST_TYPES.info;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Attendre la fin de l'animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed z-[9999] ${positionClasses[position]} max-w-sm w-full mx-auto`}
        >
          <div className={`
            ${toastConfig.bgColor} ${toastConfig.textColor} ${toastConfig.borderColor}
            border-l-4 rounded-lg shadow-lg p-4 flex items-center gap-3
            backdrop-blur-sm bg-opacity-95
          `}>
            <span className="text-xl flex-shrink-0">{toastConfig.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium break-words">{message}</p>
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0 text-white hover:text-gray-200 transition-colors ml-2"
              aria-label="Fermer la notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}